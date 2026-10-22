"""Explicit initial, additive schema migration. Never drops tables/data."""
from sqlalchemy import text
from app.database import make_engine
from app.models import Base

SCHEMA_VERSION = 1


def migrate(engine):
    with engine.begin() as connection:
        # Serialize concurrent PostgreSQL migrations within the transaction.
        if engine.dialect.name == 'postgresql':
            connection.execute(text('SELECT pg_advisory_xact_lock(742109)'))
        connection.execute(text('CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY)'))
        current = connection.execute(text('SELECT COALESCE(MAX(version),0) FROM schema_migrations')).scalar_one()
        if current > SCHEMA_VERSION:
            raise RuntimeError('Database schema is newer than this application; refusing migration')
        if current < 1:
            Base.metadata.create_all(connection)
            if engine.dialect.name == 'postgresql':
                # Existing prototype tables need the same constraints as new tables.
                constraints = connection.execute(text("SELECT conname FROM pg_constraint WHERE conrelid='tickets'::regclass")).scalars().all()
                for constraint in Ticket_constraints():
                    if constraint[0] not in constraints:
                        connection.execute(text(f'ALTER TABLE tickets ADD CONSTRAINT {constraint[0]} CHECK ({constraint[1]})'))
            connection.execute(text('INSERT INTO schema_migrations(version) VALUES (1)'))


def Ticket_constraints():
    return [('ticket_title_length', 'length(trim(title)) BETWEEN 1 AND 120'),
            ('ticket_description_length', 'length(description) <= 2000'),
            ('ticket_status', "status IN ('open', 'in_progress', 'resolved')")]


if __name__ == '__main__':
    engine = make_engine()
    try:
        migrate(engine)
        print('{"event":"migration_complete","schema_version":1}')
    finally:
        engine.dispose()
