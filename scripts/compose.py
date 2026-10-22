"""Operate the existing private Compose stack with isolated local settings."""
import argparse
import json
import os
from pathlib import Path
import secrets
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[1]
RUNTIME=ROOT/'runtime'
ENV_FILE=RUNTIME/'compose.env'


def initialize():
    RUNTIME.mkdir(exist_ok=True)
    if not ENV_FILE.exists():
        values={'POSTGRES_PASSWORD':secrets.token_hex(24),'GRAFANA_ADMIN_PASSWORD':secrets.token_hex(24),
                'GRAFANA_ADMIN_USER':'admin','APP_VERSION':'compose-local','APP_IMAGE':'launchops:local',
                'APP_PORT':'8080','RESTORED_APP_PORT':'8081','PROMETHEUS_PORT':'9090',
                'ALERTMANAGER_PORT':'9093','GRAFANA_PORT':'3000','HTTPS_PORT':'8443',
                'BACKUP_DIRECTORY':str(ROOT/'backups/compose'),
                'BACKUP_STATUS_DIRECTORY':str(RUNTIME/'compose-backup-status'),'BACKUP_S3_URI':''}
        fd=os.open(ENV_FILE,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
        with os.fdopen(fd,'w') as stream:stream.write(''.join(f'{k}={v}\n' for k,v in values.items()))
    if ENV_FILE.stat().st_mode & 0o077:raise RuntimeError('runtime/compose.env must be mode600')
    # Only read task-owned configuration. Never execute/source an environment file.
    values={k:v for line in ENV_FILE.read_text().splitlines() if line and not line.startswith('#')
            for k,separator,v in [line.partition('=')] if separator}
    for name in ['BACKUP_DIRECTORY','BACKUP_STATUS_DIRECTORY']:
        Path(values[name]).mkdir(parents=True,exist_ok=True)
    return values


def docker_environment():
    env=os.environ.copy()
    # Keep task CLI/plugin state separate from the user's global Docker configuration.
    cli=RUNTIME/'docker-cli';cli.mkdir(parents=True,exist_ok=True)
    config=cli/'config.json'
    if not config.exists():
        config.write_text(json.dumps({'cliPluginsExtraDirs':['/opt/homebrew/lib/docker/cli-plugins']}))
    env['DOCKER_CONFIG']=str(cli)
    owned_socket=Path.home()/'.colima/launchops/docker.sock'
    host=os.getenv('LAUNCHOPS_DOCKER_HOST') or (f'unix://{owned_socket}' if owned_socket.exists() else os.getenv('DOCKER_HOST'))
    if host:env['DOCKER_HOST']=host;env.pop('DOCKER_CONTEXT',None)
    # Compose's process environment overrides its env-file; discard inherited lab
    # settings so a native server's DB/image/port settings cannot contaminate this stack.
    for key in ['POSTGRES_PASSWORD','GRAFANA_ADMIN_PASSWORD','APP_IMAGE','APP_VERSION','APP_PORT','RESTORED_APP_PORT',
                'BACKUP_DIRECTORY','BACKUP_STATUS_DIRECTORY','BACKUP_S3_URI','GRAFANA_ADMIN_USER','GRAFANA_PORT','PROMETHEUS_PORT','ALERTMANAGER_PORT','HTTPS_PORT']:
        env.pop(key,None)
    return env


def command(*args, monitoring=True, capture=False, check=True):
    initialize()
    base=['docker','compose','--project-name','launchops-local','--env-file',str(ENV_FILE),'-f',str(ROOT/'compose.yaml')]
    if monitoring:base+=['-f',str(ROOT/'compose.monitoring.yaml')]
    return subprocess.run([*base,*args],cwd=ROOT,env=docker_environment(),text=True,capture_output=capture,check=check)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action',choices=['init','config','build','up','stop','logs','ps','backup','verify','drill','failure-drill'])
    args=parser.parse_args();values=initialize()
    try:
        if args.action=='init':print('Private settings ready in ignored runtime/compose.env; no values printed')
        elif args.action=='config':command('config','--quiet')
        elif args.action=='build':command('build','app')
        elif args.action=='up':command('up','--detach','--wait','--wait-timeout','180','app','prometheus','grafana','alertmanager','postgres-exporter','caddy')
        elif args.action=='stop':command('--profile','ops','--profile','recovery','stop') # Preserve containers and all persistent volumes.
        elif args.action=='logs':command('logs','--tail','80','app','db','migrate','prometheus','grafana','alertmanager','postgres-exporter')
        elif args.action=='ps':command('ps')
        elif args.action=='backup':command('run','--rm','backup')
        elif args.action=='verify':subprocess.run([sys.executable,str(ROOT/'scripts/verify.py'),'--url',f"http://127.0.0.1:{values['APP_PORT']}",'--expected-version',values['APP_VERSION']],check=True)
        elif args.action=='failure-drill':
            from container_failure_drill import drill
            print(json.dumps(drill(),indent=2))
        elif args.action=='drill':
            from container_drill import drill
            print(json.dumps(drill(),indent=2))
    except (subprocess.CalledProcessError,RuntimeError) as error:
        print(f'Compose operation failed: {type(error).__name__}',file=sys.stderr);return 1
    return 0


if __name__=='__main__':raise SystemExit(main())
