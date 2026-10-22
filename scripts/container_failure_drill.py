"""Measured, deliberate DB/app interruption for the clearly scoped local lab.

Run only for the task-owned launchops-local project. Never deletes data/volumes.
Uses real Prometheus/Alertmanager evaluation periods and HTTP behavior.
"""
import json
from pathlib import Path
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime,timezone

ROOT=Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:sys.path.insert(0,str(ROOT))
from scripts.compose import initialize,command


def get(url,path):
    with urllib.request.urlopen(url+path,timeout=10) as response:return json.load(response)


def status(url,path):
    try:
        with urllib.request.urlopen(url+path,timeout=10) as response:return response.status
    except urllib.error.HTTPError as error:return error.code
    except OSError:return 0


def wait_for(check,seconds):
    started=time.monotonic()
    while time.monotonic()-started<seconds:
        if check():return round(time.monotonic()-started,3)
        time.sleep(3)
    raise RuntimeError('Expected runtime alert/readiness condition did not occur within bounded wait')


def drill():
    v=initialize();app='http://127.0.0.1:'+v['APP_PORT'];prom='http://127.0.0.1:'+v['PROMETHEUS_PORT'];am='http://127.0.0.1:'+v['ALERTMANAGER_PORT']
    before=get(app,'/tickets');app_id_before=command('ps','-q','app',capture=True).stdout.strip()
    db_id_before=command('ps','-q','db',capture=True).stdout.strip()
    if not app_id_before or not db_id_before:raise RuntimeError('Task-owned app/db containers must already be running')
    result={'started_at':datetime.now(timezone.utc).isoformat(),'project':'launchops-local','completed':False}
    def firing():return [a for a in get(prom,'/api/v1/alerts')['data']['alerts'] if a['labels']['alertname']=='LaunchOpsDatabaseUnavailable' and a['state']=='firing']
    def received():return [a for a in get(am,'/api/v2/alerts') if a['labels']['alertname']=='LaunchOpsDatabaseUnavailable']
    try:
        command('stop','db',capture=True)
        observed={p:status(app,p) for p in ['/health/live','/health/ready','/tickets']}
        if observed!={'/health/live':200,'/health/ready':503,'/tickets':503}:raise RuntimeError('DB-outage contract failed')
        result['database_outage_http']=observed
        result['prometheus_alert_firing_after_seconds']=wait_for(firing,150)
        result['alertmanager_received_after_firing_seconds']=wait_for(received,60)
        result['external_notification_verified']=False
    finally:
        command('start','db',capture=True) # Recovery always attempted, including failed observation.
    result['readiness_recovered_after_seconds']=wait_for(lambda:status(app,'/health/ready')==200,60)
    if get(app,'/tickets')!=before:raise RuntimeError('DB interruption changed committed tickets')
    if command('ps','-q','app',capture=True).stdout.strip()!=app_id_before:raise RuntimeError('App unexpectedly restarted during DB interruption')
    result['app_unchanged_during_database_outage']=True
    result['prometheus_alert_cleared_after_seconds']=wait_for(lambda:not firing(),90)
    result['alertmanager_cleared_after_seconds']=wait_for(lambda:not received(),90)
    # New containers, same named volumes. Do not recreate dependent monitoring or migrate.
    command('up','-d','--no-deps','--force-recreate','db',capture=True)
    wait_for(lambda:status(app,'/health/ready')==200,60)
    if get(app,'/tickets')!=before:raise RuntimeError('Database recreation did not retain committed data')
    app_recreated_at=time.time()
    command('up','-d','--no-deps','--force-recreate','app',capture=True)
    wait_for(lambda:status(app,'/health/ready')==200,60)
    if get(app,'/tickets')!=before:raise RuntimeError('Application recreation did not retain data')
    result['database_container_replaced']=command('ps','-q','db',capture=True).stdout.strip()!=db_id_before
    result['app_container_replaced']=command('ps','-q','app',capture=True).stdout.strip()!=app_id_before
    result['committed_tickets_preserved']=len(before)
    result['metrics_scrape_resumed_after_seconds']=wait_for(lambda:any(t['labels'].get('job')=='launchops' and t['health']=='up' and datetime.fromisoformat(t['lastScrape'].replace('Z','+00:00')).timestamp()>app_recreated_at for t in get(prom,'/api/v1/targets')['data']['activeTargets']),60)
    result['completed']=True;result['completed_at']=datetime.now(timezone.utc).isoformat()
    result['measurement']='Observed wall-clock waits after each control action; configured scrape/evaluation/pending intervals apply. No RTO guarantee.'
    path=ROOT/'runtime/container-failure-evidence.json';path.write_text(json.dumps(result,indent=2)+'\n');path.chmod(0o600)
    return result


if __name__=='__main__':print(json.dumps(drill(),indent=2))
