import json
import time
from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import create_app
from app.migrate import migrate


def test_edit_inspect_filter_and_pagination(tmp_path):
    with TestClient(create_app(f'sqlite:///{tmp_path}/tickets.db')) as client:
        first=client.post('/tickets',json={'title':'First'}).json()
        second=client.post('/tickets',json={'title':'Second'}).json()
        updated=client.patch(f"/tickets/{first['id']}",json={'title':'Edited title','description':'Synthetic detail','status':'in_progress'})
        assert updated.status_code==200
        assert client.get(f"/tickets/{first['id']}").json()['description']=='Synthetic detail'
        assert [t['id'] for t in client.get('/tickets?status=in_progress').json()]==[first['id']]
        assert client.get('/tickets?limit=1').json()[0]['id']==second['id']
        assert client.get('/tickets?limit=1&offset=1').json()[0]['id']==first['id']
        for payload in [{},{'title':None},{'title':'   '},{'description':None},{'status':'invalid'}]:
            assert client.patch(f"/tickets/{first['id']}",json=payload).status_code==422
        assert client.get('/tickets?limit=101').status_code==422


def test_metrics_and_safe_request_context(tmp_path):
    with TestClient(create_app(f'sqlite:///{tmp_path}/metrics.db','verified-version')) as client:
        assert client.get('/tickets/123',headers={'X-Request-ID':'valid-context'}).headers['x-request-id']=='valid-context'
        unsafe=client.get('/version',headers={'X-Request-ID':'bad id with spaces'}).headers['x-request-id']
        assert ' ' not in unsafe
        metrics=client.get('/metrics').text
        assert 'route="/tickets/{ticket_id}"' in metrics
        assert 'route="/tickets/123"' not in metrics
        assert 'launchops_database_ready 1.0' in metrics
        assert 'version="verified-version"' in metrics
        assert client.get('/').headers['content-security-policy'].startswith("default-src 'self'")


def test_readiness_requires_migration_and_migration_is_idempotent(tmp_path):
    app=create_app(f'sqlite:///{tmp_path}/schema.db',auto_migrate=False)
    with TestClient(app) as client:
        assert client.get('/health/live').status_code==200
        assert client.get('/health/ready').status_code==503
        migrate(app.state.engine)
        migrate(app.state.engine)
        assert client.get('/health/ready').status_code==200
        with app.state.engine.connect() as conn:
            assert conn.execute(text('SELECT COUNT(*) FROM schema_migrations')).scalar_one()==1


def test_backup_metadata_honest_states(tmp_path,monkeypatch):
    metadata=tmp_path/'latest.json';monkeypatch.setenv('BACKUP_STATUS_FILE',str(metadata))
    with TestClient(create_app(f'sqlite:///{tmp_path}/status.db')) as client:
        status=client.get('/ops/status').json()
        assert status['backup']['state']=='missing'
        assert status['recovery']['restore_verified'] is False
        metadata.write_text(json.dumps({'status':'success','completed_at_unix':time.time(),'s3_upload_verified':False}))
        status=client.get('/ops/status').json()
        assert status['backup']['state']=='fresh'
        assert status['backup']['s3_transfer_verified'] is False
        metadata.write_text(json.dumps({'status':'success','completed_at_unix':True}))
        assert client.get('/ops/status').json()['backup']['state']=='invalid'
        metadata.write_text('{broken')
        assert client.get('/ops/status').json()['backup']['state']=='invalid'
        assert 'launchops_backup_metadata_valid 0.0' in client.get('/metrics').text
