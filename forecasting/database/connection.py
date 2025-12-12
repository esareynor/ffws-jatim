"""
Database connection utilities for FFWS Forecasting System
Connects to the same MySQL database as the Laravel backend
"""
from sqlalchemy import create_engine, text, pool
from sqlalchemy.orm import sessionmaker, scoped_session
from contextlib import contextmanager
import logging
from config.settings import DB_URL, DB_CONFIG

logger = logging.getLogger(__name__)


class DatabaseConnection:
    """Singleton database connection manager"""
    
    _instance = None
    _engine = None
    _session_factory = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize database engine and session factory"""
        try:
            # Create engine with connection pooling
            self._engine = create_engine(
                DB_URL,
                poolclass=pool.QueuePool,
                pool_size=5,
                max_overflow=10,
                pool_pre_ping=True,  # Verify connections before using
                pool_recycle=3600,   # Recycle connections after 1 hour
                echo=False
            )
            
            # Create session factory
            self._session_factory = scoped_session(
                sessionmaker(bind=self._engine, expire_on_commit=False)
            )
            
            logger.info(f"Database connection initialized: {DB_CONFIG['database']}@{DB_CONFIG['host']}")
        except Exception as e:
            logger.error(f"Failed to initialize database connection: {e}")
            raise
    
    def get_engine(self):
        """Get SQLAlchemy engine"""
        return self._engine
    
    def get_session(self):
        """Get a new database session"""
        return self._session_factory()
    
    def close_session(self, session):
        """Close a database session"""
        if session:
            session.close()
    
    @contextmanager
    def session_scope(self):
        """Provide a transactional scope for database operations"""
        session = self.get_session()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logger.error(f"Database transaction error: {e}")
            raise
        finally:
            self.close_session(session)
    
    def execute_query(self, query, params=None):
        """Execute a raw SQL query and return results"""
        try:
            with self._engine.connect() as connection:
                result = connection.execute(text(query), params or {})
                return result.fetchall(), result.keys()
        except Exception as e:
            logger.error(f"Query execution error: {e}")
            raise
    
    def test_connection(self):
        """Test database connection"""
        try:
            with self._engine.connect() as connection:
                result = connection.execute(text("SELECT 1"))
                return result.fetchone()[0] == 1
        except Exception as e:
            logger.error(f"Connection test failed: {e}")
            return False


# Global database instance
db = DatabaseConnection()


def get_db():
    """Get database connection instance"""
    return db


def test_connection():
    """Test database connection"""
    return db.test_connection()

