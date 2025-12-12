"""
Flask application for FFWS Forecasting System
"""
from flask import Flask
from api.routes import api_bp
from config.settings import FLASK_DEBUG, LOG_LEVEL
from utils.helpers import setup_logging
import warnings
import logging

# Suppress warnings
warnings.filterwarnings("ignore")

# Setup logging
setup_logging(log_level=LOG_LEVEL)
logger = logging.getLogger(__name__)


def create_app():
    """Create and configure Flask application"""
    app = Flask('FFWS-Forecasting')
    
    # Configuration
    app.config['DEBUG'] = FLASK_DEBUG
    app.config['JSON_SORT_KEYS'] = False
    
    # Register blueprints
    app.register_blueprint(api_bp)
    
    logger.info("Flask application created successfully")
    
    return app


if __name__ == '__main__':
    from config.settings import FLASK_HOST, FLASK_PORT
    
    app = create_app()
    
    logger.info(f"Starting Flask server on {FLASK_HOST}:{FLASK_PORT}")
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)

