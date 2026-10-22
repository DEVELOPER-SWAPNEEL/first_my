"""Run a private PostgreSQL-backed lab without Docker; never uses a global DB service."""
import argparse
import os
from pathlib import Path
import secrets
import shlex
import shutil
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))


def tools():
    candidates=[Path(os.getenv('PG_BIN','/opt/homebrew/opt/postgresql@17/bin'))]
    if shutil.which('pg_config'):
        candidates.append(Path(subprocess.check_output(['pg_config','--bindir'],text=True).strip()))
    for candidate in candidates:
        if (candidate/'initdb').exists() and (candidate/'pg_ctl').exists():return candidate
    raise SystemExit('PostgreSQL server tools unavailable. Set PG_BIN or use Docker Compose; see README.')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port',type=int,default=55432)
    parser.add_argument('--app-port',type=int,default=8000)
    parser.add_argument('--version',default='prototype-local')
    parser.add_argument('--task',choices=['serve','backup','drill'],default='serve',help='Run the app, an on-demand local backup, or a synthetic fresh-target recovery drill')
    parser.add_argument('--stop-db',action='store_true',help='Stop only this repository runtime/postgres cluster; retain data')
    args=parser.parse_args();pg=tools();runtime=ROOT/'runtime';runtime.mkdir(exist_ok=True);data=runtime/'postgres'
    ctl=[str(pg/'pg_ctl'),'-D',str(data)]
    if args.stop_db:
        if not (data/'PG_VERSION').exists():raise SystemExit('No repository PostgreSQL cluster exists')
        subprocess.run(ctl+['stop','-m','fast'],check=True);return
    pwfile=runtime/'pg-password'
    if not (data/'PG_VERSION').exists():
        if data.exists() and any(data.iterdir()):raise SystemExit('Refusing to initialize a nonempty PostgreSQL directory')
        if not pwfile.exists():pwfile.write_text(secrets.token_urlsafe(32));pwfile.chmod(0o600)
        with (runtime/'initdb.log').open('w') as log:
            subprocess.run([str(pg/'initdb'),'-D',str(data),'-U','launchops','--auth-local=trust','--auth-host=scram-sha-256',f'--pwfile={pwfile}','--no-instructions'],stdout=log,stderr=log,check=True)
    if not pwfile.exists():raise SystemExit('Repository database password file missing; recover it rather than reinitialize data')
    running=subprocess.run(ctl+['status'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0
    if not running:
        subprocess.run(ctl+['-l',str(runtime/'postgres.log'),'-o',f'-p {args.port} -h 127.0.0.1 -k {shlex.quote(str(data))}','start'],check=True)
    from sqlalchemy import URL
    import psycopg
    from psycopg import sql
    password=pwfile.read_text().strip()
    with psycopg.connect(host='127.0.0.1',port=args.port,user='launchops',password=password,dbname='postgres',autocommit=True,connect_timeout=3) as conn:
        if not conn.execute("SELECT 1 FROM pg_database WHERE datname='launchops'").fetchone():
            conn.execute(sql.SQL('CREATE DATABASE {}').format(sql.Identifier('launchops')))
    url=URL.create('postgresql+psycopg',username='launchops',password=password,host='127.0.0.1',port=args.port,database='launchops').render_as_string(hide_password=False)
    config={'DATABASE_URL':url,'APP_VERSION':args.version,'APP_AUTO_MIGRATE':'0','BACKUP_STATUS_FILE':str(runtime/'backup-status/latest.json')}
    os.environ.update(config)
    envfile=runtime/'native.env';envfile.write_text(''.join(f'{k}={v}\n' for k,v in config.items()));envfile.chmod(0o600)
    from app.database import make_engine
    from app.migrate import migrate
    engine=make_engine();migrate(engine);engine.dispose()
    os.environ['PG_BIN']=str(pg)
    if args.task!='serve':
        import json,time
        from scripts.recovery_common import database_dsn
        if args.task=='backup':
            from scripts.backup import backup
            result=backup(database_dsn(),ROOT/'backups',runtime/'backup-status/latest.json')
        else:
            from scripts.backup_drill import drill
            result=drill(database_dsn(),ROOT/'backups'/('drill-'+time.strftime('%Y%m%dT%H%M%SZ',time.gmtime())))
        print(json.dumps(result,sort_keys=True));return
    import uvicorn
    print(f'LaunchOps: http://127.0.0.1:{args.app_port} (PostgreSQL; cluster data retained under runtime/)')
    uvicorn.run('app.main:app',host='127.0.0.1',port=args.app_port,access_log=False)


if __name__=='__main__':main()
