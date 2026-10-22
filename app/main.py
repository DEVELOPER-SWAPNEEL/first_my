"""Synthetic support-ticket workload with real operational signals."""
import json
import logging
import os
import re
import time
import uuid
from contextlib import asynccontextmanager
from enum import Enum
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from prometheus_client import CollectorRegistry, Counter, Gauge, Histogram, generate_latest, CONTENT_TYPE_LATEST
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from sqlalchemy import select, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.database import make_engine
from app.migrate import SCHEMA_VERSION, migrate
from app.models import Base, Ticket

logger = logging.getLogger('launchops')
if not logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('%(message)s'))
    logger.addHandler(handler)
logger.setLevel(logging.INFO)
logger.propagate = False


def event(name, **fields):
    logger.info(json.dumps({'event': name, **fields}, separators=(',', ':')))


class Status(str, Enum):
    open = 'open'
    in_progress = 'in_progress'
    resolved = 'resolved'


class TicketCreate(BaseModel):
    model_config = ConfigDict(extra='forbid')
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(default='', max_length=2000)

    @field_validator('title')
    @classmethod
    def meaningful_title(cls, value):
        if not value.strip():
            raise ValueError('Title cannot be blank')
        return value.strip()


class TicketUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid')
    title: str | None = Field(default=None, min_length=1, max_length=120)
    description: str | None = Field(default=None, max_length=2000)
    status: Status | None = None

    @field_validator('title')
    @classmethod
    def meaningful_title(cls, value):
        if value is not None and not value.strip():
            raise ValueError('Title cannot be blank')
        return value.strip() if value is not None else value

    @model_validator(mode='after')
    def nonempty_update(self):
        if not self.model_fields_set or any(getattr(self, key) is None for key in self.model_fields_set):
            raise ValueError('Supply at least one non-null title, description or status')
        return self


class TicketOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str
    status: Status


def backup_status():
    path = Path(os.getenv('BACKUP_STATUS_FILE', 'runtime/backup-status/latest.json'))
    if not path.exists():
        return {'state': 'missing', 'message': 'No verified local backup recorded', 'last_success_unix': None}
    try:
        data = json.loads(path.read_text())
        raw_timestamp = data['completed_at_unix']
        if isinstance(raw_timestamp, bool) or not isinstance(raw_timestamp, (int, float)):
            raise ValueError('Invalid timestamp')
        timestamp = float(raw_timestamp)
        if data.get('status') not in ('success', 'failed') or not 0 < timestamp <= time.time() + 60:
            raise ValueError('Invalid completion metadata')
        age = max(0, time.time() - timestamp)
        return {'state': 'failed' if data.get('status') == 'failed' else ('fresh' if age < 86400 else 'stale'), 'last_success_unix': timestamp,
                'age_seconds': round(age), 's3_transfer_verified': data.get('s3_upload_verified') is True,
                'message': 'Local backup recorded; fresh-target restore is a separate check'}
    except (ValueError, KeyError, OSError, TypeError):
        return {'state': 'invalid', 'message': 'Backup metadata is unreadable or invalid', 'last_success_unix': None}


def create_app(database_url=None, version=None, auto_migrate=None):
    engine = make_engine(database_url)
    release = version or os.getenv('APP_VERSION', 'dev')
    auto = (os.getenv('APP_AUTO_MIGRATE', '1') == '1') if auto_migrate is None else auto_migrate
    registry = CollectorRegistry()
    requests = Counter('launchops_http_requests_total', 'Completed HTTP requests', ['method', 'route', 'status'], registry=registry)
    latency = Histogram('launchops_http_request_duration_seconds', 'HTTP request latency', ['method', 'route'], registry=registry,
                        buckets=(.01,.025,.05,.1,.25,.5,1,2.5,5,10))
    database_ready = Gauge('launchops_database_ready', 'Database and supported schema ready', registry=registry)
    backup_timestamp = Gauge('launchops_backup_last_success_timestamp_seconds', 'Last completed backup timestamp; zero means none', registry=registry)
    backup_valid = Gauge('launchops_backup_metadata_valid', 'One for valid backup metadata', registry=registry)
    Gauge('launchops_build_info', 'Running application version', ['version'], registry=registry).labels(release).set(1)

    def storage_ready():
        try:
            with engine.connect() as connection:
                connection.execute(text('SELECT 1 FROM tickets LIMIT 1'))
                schema = connection.execute(text('SELECT MAX(version) FROM schema_migrations')).scalar_one()
                ok = schema == SCHEMA_VERSION
        except SQLAlchemyError:
            ok = False
        database_ready.set(int(ok))
        return ok

    @asynccontextmanager
    async def lifespan(app):
        if auto:
            try:
                migrate(engine)
                event('schema_ready', version=release, schema_version=SCHEMA_VERSION)
            except (SQLAlchemyError, RuntimeError) as exc:
                event('schema_unavailable', error_type=type(exc).__name__, version=release)
        yield
        engine.dispose()

    app = FastAPI(title='LaunchOps', version=release, lifespan=lifespan)
    app.state.engine = engine
    app.mount('/static', StaticFiles(directory=Path(__file__).with_name('static')), name='static')

    @app.middleware('http')
    async def observe(request: Request, call_next):
        supplied_id = request.headers.get('X-Request-ID', '')
        request_id = supplied_id if re.fullmatch(r'[A-Za-z0-9_.-]{1,64}', supplied_id) else uuid.uuid4().hex
        request.state.request_id = request_id
        start = time.perf_counter()
        status = 500
        try:
            response = await call_next(request)
            status = response.status_code
            response.headers['X-Request-ID'] = request_id
            response.headers['X-Content-Type-Options'] = 'nosniff'
            response.headers['Referrer-Policy'] = 'no-referrer'
            response.headers['X-Frame-Options'] = 'DENY'
            if request.url.path == '/':
                response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
            return response
        finally:
            elapsed = time.perf_counter() - start
            route = getattr(request.scope.get('route'), 'path', '__unmatched__')
            if not request.url.path.startswith('/static') and request.url.path != '/metrics':
                requests.labels(request.method, route, str(status)).inc()
                latency.labels(request.method, route).observe(elapsed)
                event('http_request', request_id=request_id, method=request.method, route=route,
                      status=status, duration_ms=round(elapsed*1000, 2), version=release)

    @app.exception_handler(SQLAlchemyError)
    async def database_failure(request, exc):
        event('database_error', request_id=getattr(request.state, 'request_id', None), error_type=type(exc).__name__)
        return JSONResponse(status_code=503, content={'detail': 'Database unavailable', 'request_id': getattr(request.state, 'request_id', None)})

    @app.get('/', include_in_schema=False)
    def interface():
        return FileResponse(Path(__file__).with_name('index.html'))

    @app.get('/health/live')
    def live():
        return {'status': 'alive', 'version': release}

    @app.get('/health/ready')
    def ready():
        if not storage_ready():
            raise HTTPException(503, 'Database or supported schema unavailable')
        return {'status': 'ready', 'version': release, 'schema_version': SCHEMA_VERSION}

    @app.get('/version')
    def deployed_version():
        return {'version': release, 'schema_version': SCHEMA_VERSION}

    @app.get('/ops/status')
    def operations():
        return {'version': release, 'schema_version': SCHEMA_VERSION,
                'database': {'ready': storage_ready(), 'engine': engine.dialect.name},
                'backup': backup_status(), 'environment': 'private lab',
                'recovery': {'restore_verified': False, 'message': 'Consult saved drill evidence; this process does not assert recovery completion'},
                'metrics_path': '/metrics'}

    @app.get('/metrics', include_in_schema=False)
    def metrics():
        storage_ready()
        backup = backup_status()
        backup_timestamp.set(backup['last_success_unix'] or 0)
        backup_valid.set(int(backup['state'] in ('fresh','stale')))
        return Response(generate_latest(registry), media_type=CONTENT_TYPE_LATEST)

    @app.post('/tickets', response_model=TicketOut, status_code=201)
    def create_ticket(payload: TicketCreate):
        with Session(engine) as session:
            ticket = Ticket(**payload.model_dump())
            session.add(ticket)
            session.commit()
            session.refresh(ticket)
            return TicketOut.model_validate(ticket)

    @app.get('/tickets', response_model=list[TicketOut])
    def list_tickets(limit: int = Query(50, ge=1, le=100), offset: int = Query(0, ge=0), status: Status | None = None):
        with Session(engine) as session:
            query = select(Ticket).order_by(Ticket.id.desc()).limit(limit).offset(offset)
            if status is not None:
                query = query.where(Ticket.status == status.value)
            return [TicketOut.model_validate(t) for t in session.scalars(query)]

    @app.get('/tickets/{ticket_id}', response_model=TicketOut)
    def retrieve_ticket(ticket_id: int):
        with Session(engine) as session:
            ticket = session.get(Ticket, ticket_id)
            if ticket is None:
                raise HTTPException(404, 'Ticket not found')
            return TicketOut.model_validate(ticket)

    @app.patch('/tickets/{ticket_id}', response_model=TicketOut)
    def update_ticket(ticket_id: int, payload: TicketUpdate):
        with Session(engine) as session:
            ticket = session.get(Ticket, ticket_id)
            if ticket is None:
                raise HTTPException(404, 'Ticket not found')
            for field, value in payload.model_dump(exclude_unset=True).items():
                setattr(ticket, field, value.value if isinstance(value, Status) else value)
            session.commit()
            session.refresh(ticket)
            return TicketOut.model_validate(ticket)
    return app


app = create_app()
