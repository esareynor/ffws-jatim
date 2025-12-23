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

# Database Connection Pool Configuration
DB_POOL_SIZE = int(os.getenv('DB_POOL_SIZE', 5))
DB_POOL_MAX_OVERFLOW = int(os.getenv('DB_POOL_MAX_OVERFLOW', 10))
DB_POOL_RECYCLE = int(os.getenv('DB_POOL_RECYCLE', 3600))  # 1 hour

# Model Training Configuration
DEFAULT_EPOCHS = int(os.getenv('DEFAULT_EPOCHS', 50))
DEFAULT_BATCH_SIZE = int(os.getenv('DEFAULT_BATCH_SIZE', 64))
TRAINING_DATA_LIMIT = int(os.getenv('TRAINING_DATA_LIMIT', 720))  # Default: 30 days of hourly data
TEST_SIZE = float(os.getenv('TEST_SIZE', 0.2))  # Train/test split ratio

# Neural Network Architecture Configuration
# LSTM/GRU Layer Sizes
LSTM_LAYER_1_SIZE = int(os.getenv('LSTM_LAYER_1_SIZE', 128))
LSTM_LAYER_2_SIZE = int(os.getenv('LSTM_LAYER_2_SIZE', 64))
DROPOUT_RATE = float(os.getenv('DROPOUT_RATE', 0.2))

# TCN Configuration
TCN_NB_FILTERS = int(os.getenv('TCN_NB_FILTERS', 64))
TCN_KERNEL_SIZE = int(os.getenv('TCN_KERNEL_SIZE', 3))
TCN_DILATIONS = [int(x) for x in os.getenv('TCN_DILATIONS', '1,2,4,8').split(',')]

# Prediction Configuration
DEFAULT_CONFIDENCE_SCORE = float(os.getenv('DEFAULT_CONFIDENCE_SCORE', 0.85))
MIN_CONFIDENCE = float(os.getenv('MIN_CONFIDENCE', 0.5))
VARIANCE_THRESHOLD = float(os.getenv('VARIANCE_THRESHOLD', 10.0))

# Gunicorn Configuration (for production deployment)
GUNICORN_WORKERS = int(os.getenv('GUNICORN_WORKERS', 4))
GUNICORN_TIMEOUT = int(os.getenv('GUNICORN_TIMEOUT', 120))

# Logging Configuration
LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
LOG_FORMAT = os.getenv('LOG_FORMAT', '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# HTTP Status Codes
HTTP_OK = 200
HTTP_BAD_REQUEST = 400
HTTP_NOT_FOUND = 404
HTTP_SERVER_ERROR = 500
HTTP_SERVICE_UNAVAILABLE = 503

