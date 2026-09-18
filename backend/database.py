import os
import logging
import time
from typing import Generator
from sqlalchemy import create_engine, pool, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import OperationalError, DatabaseError
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load SoulTalk environment parameters
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))

DATABASE_URL = os.getenv("DATABASE_URL")

# Production-grade database engine for Neon PostgreSQL ONLY
# SQLite fallback is strictly prohibited in production.
if not DATABASE_URL or not DATABASE_URL.startswith("postgresql"):
    logger.warning("DATABASE_URL is not set or not postgresql. Neon PostgreSQL is required.")

engine = None
SessionLocal = None

if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
    if "sslmode" not in DATABASE_URL:
        DATABASE_URL = f"{DATABASE_URL}&sslmode=require"
    try:
        engine = create_engine(
            DATABASE_URL,
            poolclass=pool.QueuePool,
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=True,
            pool_recycle=3600,
            connect_args={"connect_timeout": 3},
            echo=False
        )
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        logger.info("Configured Neon PostgreSQL database engine with 3s connect timeout")
    except Exception as e:
        logger.error(f"Could not initialize PostgreSQL engine: {e}. SQLite fallback is strictly prohibited.")
        raise RuntimeError(f"PostgreSQL connection initialization failed: {e}")
else:
    # No fallback allowed
    raise RuntimeError("DATABASE_URL environment variable must be a valid PostgreSQL connection string. SQLite fallback is strictly prohibited.")

Base = declarative_base()

def test_connection(max_retries: int = 2) -> bool:
    """Test database connection."""
    if not engine:
        return False
    for attempt in range(max_retries):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
                return True
        except Exception as e:
            logger.warning(f"Database connection attempt {attempt+1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(0.5)
    return False

def get_db() -> Generator[Session, None, None]:
    """Get database session. Fails fast if Neon PostgreSQL is unavailable."""
    if not SessionLocal:
        raise RuntimeError("Database session factory is not configured. Neon PostgreSQL is required.")
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Database transaction failed: {e}")
        raise
    finally:
        db.close()
