import pytest
from fastapi.testclient import TestClient
from app.main import create_app


@pytest.fixture
def client(tmp_path):
    with TestClient(create_app(f"sqlite:///{tmp_path}/test.db", "test-release")) as client:
        yield client


def test_transaction_and_persistence(tmp_path):
    url = f"sqlite:///{tmp_path}/persistent.db"
    with TestClient(create_app(url)) as client:
        created = client.post('/tickets', json={'title': 'Synthetic incident', 'description': 'Test only'})
        assert created.status_code == 201
        ticket_id = created.json()['id']
        assert client.get(f'/tickets/{ticket_id}').json() == created.json()
        changed = client.patch(f'/tickets/{ticket_id}', json={'status': 'resolved'})
        assert changed.status_code == 200
    with TestClient(create_app(url)) as restarted:
        assert restarted.get(f'/tickets/{ticket_id}').json()['status'] == 'resolved'


@pytest.mark.parametrize('payload', [{'title': ''}, {'title': '   '}, {'title': 'x' * 121}, {'title': 'valid', 'unexpected': 1}])
def test_invalid_ticket_never_persists(client, payload):
    assert client.post('/tickets', json=payload).status_code == 422
    assert client.get('/tickets').json() == []


def test_invalid_status_preserves_record(client):
    ticket = client.post('/tickets', json={'title': 'Test'}).json()
    assert client.patch(f"/tickets/{ticket['id']}", json={'status': 'unknown'}).status_code == 422
    assert client.get(f"/tickets/{ticket['id']}").json()['status'] == 'open'


def test_missing_ticket(client):
    assert client.get('/tickets/999').status_code == 404
    assert client.patch('/tickets/999', json={'status': 'resolved'}).status_code == 404


def test_health_and_version(client):
    assert client.get('/health/live').status_code == 200
    assert client.get('/health/ready').status_code == 200
    assert client.get('/version').json() == {'version': 'test-release', 'schema_version': 1}
    assert client.get('/').status_code == 200


def test_database_failure_does_not_break_liveness(tmp_path):
    with TestClient(create_app(f"sqlite:///{tmp_path}/missing/db.sqlite")) as client:
        assert client.get('/health/live').status_code == 200
        assert client.get('/health/ready').status_code == 503
        assert client.post('/tickets', json={'title': 'Failure'}).status_code == 503
        assert client.get('/health/live').status_code == 200
