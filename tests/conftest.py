"""Unit tests initialize their own isolated schema, regardless of host runtime config."""
import pytest


@pytest.fixture(autouse=True)
def isolated_application_settings(monkeypatch):
    monkeypatch.setenv('APP_AUTO_MIGRATE','1')
    monkeypatch.setenv('APP_VERSION','test-local')
