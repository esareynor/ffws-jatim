"""
Configuration settings for FFWS Forecasting System
Reads configuration from environment variables and database
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from backend .env file
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR.parent / 'backend'
ENV_FILE = BACKEND_DIR / '.env'

if ENV_FILE.exists():
    load_dotenv(ENV_FILE)
else:
    # Fallback to forecasting .env if backend .env doesn't exist
    load_dotenv(BASE_DIR / '.env')

# Database Configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USERNAME', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_DATABASE', 'ffws_v2'),
    'charset': 'utf8mb4'
}

# Build database URL for SQLAlchemy
DB_URL = f"mysql+mysqldb://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}?charset={DB_CONFIG['charset']}"

# Storage Paths
STORAGE_DIR = BASE_DIR / 'storage'
MODELS_DIR = STORAGE_DIR / 'models'
SCALERS_DIR = STORAGE_DIR / 'scalers'
LOGS_DIR = BASE_DIR / 'logs'

# Ensure directories exist
MODELS_DIR.mkdir(parents=True, exist_ok=True)
SCALERS_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Flask Configuration
FLASK_HOST = os.getenv('FLASK_HOST', '127.0.0.1')
FLASK_PORT = int(os.getenv('FLASK_PORT', 8000))
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'

# Model Training Configuration
DEFAULT_EPOCHS = int(os.getenv('DEFAULT_EPOCHS', 50))
DEFAULT_BATCH_SIZE = int(os.getenv('DEFAULT_BATCH_SIZE', 64))
TRAINING_DATA_LIMIT = int(os.getenv('TRAINING_DATA_LIMIT', 720))  # Default: 30 days of hourly data

# Prediction Configuration
DEFAULT_CONFIDENCE_SCORE = float(os.getenv('DEFAULT_CONFIDENCE_SCORE', 0.85))

# Logging Configuration
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

