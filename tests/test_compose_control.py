"""Protect saved lab credentials and isolate Compose from a native process env."""
from pathlib import Path
import pytest
from scripts import compose


def local_control(monkeypatch,tmp_path):
    monkeypatch.setattr(compose,'ROOT',tmp_path)
    monkeypatch.setattr(compose,'RUNTIME',tmp_path/'runtime')
    monkeypatch.setattr(compose,'ENV_FILE',tmp_path/'runtime/compose.env')


def test_initialize_preserves_existing_credentials(monkeypatch,tmp_path):
    local_control(monkeypatch,tmp_path)
    compose.initialize()
    saved=compose.ENV_FILE.read_bytes()
    compose.initialize()
    assert compose.ENV_FILE.read_bytes()==saved
    assert compose.ENV_FILE.stat().st_mode & 0o077==0


def test_broad_credential_permissions_refused(monkeypatch,tmp_path):
    local_control(monkeypatch,tmp_path)
    compose.initialize();compose.ENV_FILE.chmod(0o644)
    with pytest.raises(RuntimeError,match='mode600'):compose.initialize()


def test_native_environment_cannot_override_compose_lab(monkeypatch,tmp_path):
    local_control(monkeypatch,tmp_path)
    compose.initialize()
    monkeypatch.setenv('APP_VERSION','native-context')
    monkeypatch.setenv('POSTGRES_PASSWORD','unrelated-test-value')
    monkeypatch.setenv('BACKUP_DIRECTORY','/unrelated/backups')
    child=compose.docker_environment()
    assert all(key not in child for key in ['APP_VERSION','POSTGRES_PASSWORD','BACKUP_DIRECTORY'])
    assert child['DOCKER_CONFIG']==str(tmp_path/'runtime/docker-cli')
    # Parent runtime and user context are unchanged.
    import os
    assert os.environ['APP_VERSION']=='native-context'
