"""Consequential diagnosis: outage, wrong artifact, stale/invalid backup evidence."""
import importlib.util
import json
from pathlib import Path
import time
from urllib.error import HTTPError

spec = importlib.util.spec_from_file_location("doctor", Path(__file__).parents[1] / "scripts/doctor.py")
doctor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(doctor)


def healthy(url, timeout):
    if url.endswith("/health/live"):
        return {"status": "alive", "version": "test"}
    if url.endswith("/health/ready"):
        return {"status": "ready", "version": "test"}
    return {"version": "test"}


def test_db_outage_keeps_liveness_but_fails_doctor(monkeypatch):
    def outage(url, timeout):
        if url.endswith("/health/ready"):
            raise HTTPError(url, 503, "Unavailable", {}, None)
        return healthy(url, timeout)
    monkeypatch.setattr(doctor, "http_json", outage)
    result = doctor.diagnose()
    states = {item["check"]: item["status"] for item in result["checks"]}
    assert states["liveness"] == "passed" and states["readiness"] == "failed"
    assert result["result"] == "failed"


def test_wrong_release_cannot_pass(monkeypatch):
    monkeypatch.setattr(doctor, "http_json", healthy)
    assert doctor.diagnose(expected_version="other")["result"] == "failed"


def test_backup_freshness_and_failed_attempt(monkeypatch, tmp_path):
    monkeypatch.setattr(doctor, "http_json", healthy)
    path = tmp_path / "latest.json"
    path.write_text(json.dumps({"status": "success", "completed_at_unix": time.time()}))
    assert doctor.diagnose(backup_status=path, require_backup=True)["result"] == "passed"
    path.write_text(json.dumps({"status": "failed", "completed_at_unix": time.time()}))
    assert doctor.diagnose(backup_status=path)["result"] == "failed"
    path.write_text(json.dumps({"status": "success", "completed_at_unix": time.time() - 90000}))
    assert doctor.diagnose(backup_status=path)["result"] == "failed"
    path.write_text("not json")
    assert doctor.diagnose(backup_status=path)["result"] == "failed"


def test_backup_required_and_public_http_rejected(monkeypatch):
    import pytest
    monkeypatch.setattr(doctor, "http_json", healthy)
    assert doctor.diagnose(require_backup=True)["result"] == "failed"
    with pytest.raises(ValueError, match="loopback"):
        doctor.diagnose(url="http://example.com")
