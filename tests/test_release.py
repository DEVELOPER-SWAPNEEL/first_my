"""Recovery controller must preserve the verified release after candidate failure."""
import argparse
import importlib.util
import json
from pathlib import Path
import pytest

spec = importlib.util.spec_from_file_location("release", Path(__file__).parents[1] / "scripts/release.py")
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)


def make_release(root, character):
    version = character * 40
    path = root / "releases" / version
    (path / "scripts").mkdir(parents=True)
    (path / "compose.yaml").write_text("services: {}")
    (path / "scripts/verify.py").write_text("")
    return {"version": version, "image": "registry/app@sha256:" + character * 64,
            "release_dir": str(path)}


def test_failed_candidate_restores_previous_and_preserves_record(tmp_path, monkeypatch):
    (tmp_path / "shared").mkdir()
    secret = tmp_path / "shared/.env"
    secret.write_text(f"POSTGRES_PASSWORD=test\nBACKUP_DIRECTORY={tmp_path}/shared/backups\nBACKUP_STATUS_DIRECTORY={tmp_path}/shared/runtime/backup-status\n")
    secret.chmod(0o600)
    current = make_release(tmp_path, "a")
    candidate = make_release(tmp_path, "b")
    record = {"current": current, "previous": None}
    (tmp_path / "shared/releases.json").write_text(json.dumps(record))
    attempts = []
    def activate(item, root, url):
        attempts.append(item["version"])
        if item == candidate:
            raise RuntimeError("readiness failed")
    monkeypatch.setattr(release, "activate", activate)
    args = argparse.Namespace(mode="deploy", root=str(tmp_path), url="http://127.0.0.1:8000",
                              **candidate)
    with pytest.raises(RuntimeError):
        release.execute(args)
    assert attempts == [candidate["version"], current["version"]]
    assert json.loads((tmp_path / "shared/releases.json").read_text()) == record
    assert (tmp_path / "current").resolve() == Path(current["release_dir"])


def test_mutable_release_and_broad_secret_permissions_rejected(tmp_path):
    (tmp_path / "shared").mkdir()
    (tmp_path / "shared/.env").write_text("test")
    candidate = make_release(tmp_path, "a")
    args = argparse.Namespace(mode="deploy", root=str(tmp_path), url="http://127.0.0.1:8000", **candidate)
    with pytest.raises(ValueError, match="permissions"):
        release.execute(args)
    candidate["image"] = "registry/app:latest"
    with pytest.raises(ValueError, match="digest"):
        release.validate_release(candidate, tmp_path)


def test_successful_manual_rollback_swaps_known_good_releases(tmp_path, monkeypatch):
    (tmp_path / "shared").mkdir()
    secret = tmp_path / "shared/.env"
    secret.write_text(f"BACKUP_DIRECTORY={tmp_path}/shared/backups\nBACKUP_STATUS_DIRECTORY={tmp_path}/shared/runtime/backup-status\n")
    secret.chmod(0o600)
    current = make_release(tmp_path, "a")
    previous = make_release(tmp_path, "b")
    (tmp_path / "shared/releases.json").write_text(json.dumps({"current": current, "previous": previous}))
    monkeypatch.setattr(release, "activate", lambda *args: None)
    args = argparse.Namespace(mode="rollback", root=str(tmp_path), url="http://127.0.0.1:8000")
    release.execute(args)
    record = json.loads((tmp_path / "shared/releases.json").read_text())
    assert record["current"] == previous and record["previous"] == current
