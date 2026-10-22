"""Consequential PostgreSQL checks, skipped unless a local test admin DSN is supplied."""
import os
import uuid
import pytest
import psycopg
from psycopg import sql
from psycopg.conninfo import conninfo_to_dict,make_conninfo
from sqlalchemy import URL
from fastapi.testclient import TestClient
from app.main import create_app


@pytest.fixture
def postgres_url():
    admin=os.getenv('TEST_POSTGRES_DSN')
    if not admin:pytest.skip('TEST_POSTGRES_DSN is required for isolated PostgreSQL checks')
    config=conninfo_to_dict(admin)
    if config.get('host') not in ('127.0.0.1','localhost','/tmp'):pytest.fail('Only local PostgreSQL tests authorized')
    name='launchops_test_'+uuid.uuid4().hex[:12]
    with psycopg.connect(admin,autocommit=True) as conn:conn.execute(sql.SQL('CREATE DATABASE {}').format(sql.Identifier(name)))
    url=URL.create('postgresql+psycopg',username=config.get('user'),password=config.get('password'),host=config.get('host'),port=int(config.get('port',5432)),database=name)
    try:yield url
    finally:
        with psycopg.connect(admin,autocommit=True) as conn:conn.execute(sql.SQL('DROP DATABASE {}').format(sql.Identifier(name)))


def test_real_postgres_restart_and_constraints(postgres_url):
    url=postgres_url
    with TestClient(create_app(url)) as client:
        ticket=client.post('/tickets',json={'title':'Synthetic PostgreSQL restart'}).json()
        assert client.patch(f"/tickets/{ticket['id']}",json={'description':'Persisted','status':'resolved'}).status_code==200
    with TestClient(create_app(url,auto_migrate=False)) as restarted:
        assert restarted.get('/health/ready').status_code==200
        assert restarted.get(f"/tickets/{ticket['id']}").json()['status']=='resolved'
    with psycopg.connect(host=url.host,port=url.port,user=url.username,password=url.password,dbname=url.database) as conn:
        with pytest.raises(psycopg.errors.CheckViolation):
            conn.execute("INSERT INTO tickets(title,description,status) VALUES ('bad','','not_allowed')")
