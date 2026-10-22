"""Fresh-target recovery using the existing Compose services in an isolated project.

Only generated synthetic data is used. No native or main-stack database is changed.
All raw artifacts stay ignored. Cleanup retains all volumes and backup artifacts.
"""
import json
import os
from pathlib import Path, PurePosixPath
import secrets
import socket
import subprocess
import sys
import time
import urllib.request
import uuid
from datetime import datetime,timezone

ROOT=Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:sys.path.insert(0,str(ROOT))
from scripts.compose import docker_environment,initialize


def request(base,path,method='GET',payload=None):
    data=None if payload is None else json.dumps(payload).encode()
    req=urllib.request.Request(base+path,data=data,method=method,headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=8) as response:return json.load(response)


def wait_ready(url,version,timeout=120):
    deadline=time.monotonic()+timeout
    while time.monotonic()<deadline:
        try:
            if request(url,'/health/ready')['version']==version:return
        except (OSError,ValueError):pass
        time.sleep(1)
    raise RuntimeError('Isolated drill application failed expected-version readiness')


def drill():
    settings=initialize();identifier=uuid.uuid4().hex[:12];project='launchops-drill-'+identifier
    directory=ROOT/'runtime/compose-drills'/identifier;directory.mkdir(parents=True,mode=0o700)
    artifacts=ROOT/'backups/compose-drills'/identifier;artifacts.mkdir(parents=True,mode=0o700)
    ports=[]
    for _ in range(2):
        with socket.socket() as sock:
            sock.bind(('127.0.0.1',0));ports.append(sock.getsockname()[1])
    version='drill-'+identifier;envfile=directory/'drill.env'
    values={'POSTGRES_PASSWORD':secrets.token_hex(24),'APP_VERSION':version,'APP_IMAGE':settings['APP_IMAGE'],
            'APP_PORT':str(ports[0]),'RESTORED_APP_PORT':str(ports[1]),'BACKUP_DIRECTORY':str(artifacts),
            'BACKUP_STATUS_DIRECTORY':str(directory/'backup-status'),'BACKUP_S3_URI':''}
    (directory/'backup-status').mkdir()
    fd=os.open(envfile,os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600)
    with os.fdopen(fd,'w') as stream:stream.write(''.join(f'{k}={v}\n' for k,v in values.items()))
    base=['docker','compose','--project-name',project,'--env-file',str(envfile),'-f',str(ROOT/'compose.yaml')]
    def run(*args,check=True):
        return subprocess.run([*base,*args],cwd=ROOT,env=docker_environment(),capture_output=True,text=True,check=check)
    def operation(*args):
        result=run(*args)
        return json.loads(result.stdout)
    result={'project':project,'status':'failed','started_at':datetime.now(timezone.utc).isoformat(),
            'source_application_url':f'http://127.0.0.1:{ports[0]}','restored_application_url':f'http://127.0.0.1:{ports[1]}',
            'cloud_transfer_verified':False,'cleanup':'Only this unique project containers/network removed; all volumes/artifacts retained'}
    started=time.monotonic()
    try:
        run('up','-d','--wait','--wait-timeout','120','--no-build','app')
        source=result['source_application_url'];target=result['restored_application_url']
        wait_ready(source,version)
        expected=[]
        for i in range(3):
            ticket=request(source,'/tickets','POST',{'title':f'Synthetic {identifier} restore {i+1}','description':'Generated container drill data'})
            expected.append(ticket)
        expected[1]=request(source,f"/tickets/{expected[1]['id']}",'PATCH',{'status':'resolved','description':'Updated before snapshot'})
        saved=operation('run','--rm','backup')
        run('up','-d','--wait','--wait-timeout','120','db-restore')
        restored=operation('run','--rm','restore',saved['archive'])
        run('up','-d','--wait','--wait-timeout','120','--no-build','recovered-app')
        wait_ready(target,version+'-restored')
        for ticket in expected:
            if request(target,f"/tickets/{ticket['id']}")!=ticket:raise RuntimeError('Recovered API record differs from source')
        created=request(target,'/tickets','POST',{'title':f'Synthetic {identifier} after restore'})
        if created['id']<=max(t['id'] for t in expected):raise RuntimeError('Restored sequence/write failed')
        baseline=request(target,'/tickets')
        # Stop only this drill's restored process before target safety checks, so an
        # occupied target is identified by real tables, rather than incidental sessions.
        run('stop','recovered-app')
        occupied=run('run','--rm','restore',saved['archive'],check=False)
        if occupied.returncode!=1 or 'target must have no user objects' not in occupied.stderr:
            raise RuntimeError('Occupied-target safety check did not reject the correct condition')
        name=PurePosixPath(saved['archive']).name
        code="import pathlib,sys; p=pathlib.Path('/backups/corrupt');p.mkdir(mode=0o700);f=p/sys.argv[1];f.write_bytes(b'corrupt synthetic drill archive');f.chmod(0o600)"
        run('run','--rm','--entrypoint','python','restore','-c',code,name)
        corrupt=run('run','--rm','restore','/backups/corrupt/'+name,'--manifest',saved['manifest'],check=False)
        if corrupt.returncode!=1 or 'SHA256 mismatch' not in corrupt.stderr:raise RuntimeError('Corrupt-archive integrity check failed')
        run('up','-d','--wait','--wait-timeout','120','--no-build','recovered-app')
        wait_ready(target,version+'-restored')
        if request(target,'/tickets')!=baseline:raise RuntimeError('Failed recovery operations changed target records')
        result.update(status='passed',synthetic_source_tickets=3,restored_tickets_verified_via_api=3,
                      schema_and_data_manifest_verified=restored['status']=='verified',
                      ticket_constraints_verified=restored['ticket_constraints_verified'],post_restore_create_verified=True,
                      occupied_target_rejected=True,corrupt_archive_rejected=True,failure_target_unchanged=True,
                      backup_seconds=saved['duration_seconds'],restore_seconds=restored['duration_seconds'],
                      total_drill_seconds=round(time.monotonic()-started,3),
                      measurement='Includes isolated container start, API seed, backup, restore, API verification and safety failures; excludes image build/pull and cleanup')
    except Exception as error:
        result['error_type']=type(error).__name__
        raise RuntimeError('Container drill failed; inspect ignored runtime/compose-drills report and scoped logs') from None
    finally:
        result['completed_at']=datetime.now(timezone.utc).isoformat()
        report=directory/'result.json';report.write_text(json.dumps(result,indent=2)+'\n');report.chmod(0o600)
        cleaned=run('--profile','ops','--profile','recovery','down',check=False) # Never -v: neither project nor drill volumes removed.
        remaining=run('--profile','ops','--profile','recovery','ps','--all','--quiet',check=False)
        result['container_cleanup_succeeded']=cleaned.returncode==0 and not remaining.stdout.strip()
        report.write_text(json.dumps(result,indent=2)+'\n')
    return result


if __name__=='__main__':print(json.dumps(drill(),indent=2))
