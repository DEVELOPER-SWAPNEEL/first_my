"""Database configuration; credentials stay out of logs and HTTP responses."""
import os
from sqlalchemy import URL, create_engine


def configured_url():
    if os.getenv('DATABASE_URL'):
        return os.environ['DATABASE_URL']
    if os.getenv('DB_HOST'):
        return URL.create('postgresql+psycopg', username=os.getenv('DB_USER', 'launchops'),
                          password=os.environ['DB_PASSWORD'], host=os.environ['DB_HOST'],
                          port=int(os.getenv('DB_PORT', '5432')), database=os.getenv('DB_NAME', 'launchops'))
    return 'sqlite:///./launchops.db'


def make_engine(url=None):
    url = url or configured_url()
    dialect = str(url).split(':', 1)[0]
    args = {'check_same_thread': False} if dialect.startswith('sqlite') else {'connect_timeout': 3, 'options': '-c statement_timeout=5000'}
    return create_engine(url, pool_pre_ping=True, pool_timeout=5, connect_args=args)
