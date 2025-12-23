"""
Flask API routes for FFWS Forecasting System
"""
from flask import Blueprint, jsonify, request
from services.prediction_service import get_prediction_service
from database.queries import get_data_fetcher
from database.connection import get_db
from config.settings import (
    HTTP_OK, HTTP_BAD_REQUEST, HTTP_NOT_FOUND, 
    HTTP_SERVER_ERROR, HTTP_SERVICE_UNAVAILABLE
)
import logging

logger = logging.getLogger(__name__)

api_bp = Blueprint('api', __name__)


@api_bp.route("/")
def home():
    """API home endpoint"""
    return jsonify({
        'service': 'FFWS Forecasting System',
        'version': '2.0',
        'status': 'running'
    })


@api_bp.route("/health")
def health_check():
    """Health check endpoint"""
    try:
        db = get_db()
        db_status = db.test_connection()
        
        return jsonify({
            'status': 'healthy' if db_status else 'unhealthy',
            'database': 'connected' if db_status else 'disconnected'
        }), HTTP_OK if db_status else HTTP_SERVICE_UNAVAILABLE
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), HTTP_SERVICE_UNAVAILABLE


@api_bp.route("/api/models", methods=['GET'])
def get_models():
    """Get all active models"""
    try:
        data_fetcher = get_data_fetcher()
        models = data_fetcher.get_active_models()
        
        return jsonify({
            'status': 'success',
            'count': len(models),
            'models': models
        })
    except Exception as e:
        logger.error(f"Error fetching models: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), HTTP_SERVER_ERROR


@api_bp.route("/api/models/<model_code>", methods=['GET'])
def get_model(model_code):
    """Get specific model details"""
    try:
        data_fetcher = get_data_fetcher()
        model = data_fetcher.get_model_by_code(model_code)
        
        if not model:
            return jsonify({
                'status': 'error',
                'error': f'Model not found: {model_code}'
            }), HTTP_NOT_FOUND
        
        # Get sensors for this model
        sensors = data_fetcher.get_sensors_for_model(model_code)
        model['sensors'] = sensors
        
        return jsonify({
            'status': 'success',
            'model': model
        })
    except Exception as e:
        logger.error(f"Error fetching model {model_code}: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), HTTP_SERVER_ERROR


@api_bp.route("/api/sensors", methods=['GET'])
def get_sensors():
    """Get all sensors with optional filtering"""
    try:
        model_code = request.args.get('model_code')
        data_fetcher = get_data_fetcher()
        
        if model_code:
            sensors = data_fetcher.get_sensors_for_model(model_code)
        else:
            # Get all active sensors from database
            try:
                with data_fetcher.db.session_scope() as session:
                    from database.models import MasSensor
                    sensors_query = session.query(MasSensor).filter(
                        MasSensor.is_active == True,
                        MasSensor.status == 'active'
                    ).all()
                    
                    sensors = [{
                        'id': s.id,
                        'code': s.code,
                        'name': s.name,
                        'parameter': s.parameter,
                        'unit': s.unit,
                        'device_code': s.mas_device_code,
                        'model_code': s.mas_model_code,
                        'forecasting_status': s.forecasting_status
                    } for s in sensors_query]
            except Exception as e:
                logger.error(f"Error fetching all sensors: {e}")
                return jsonify({
                    'status': 'error',
                    'error': 'Failed to fetch sensors. Please provide model_code parameter.'
                }), HTTP_BAD_REQUEST
        
        return jsonify({
            'status': 'success',
            'count': len(sensors),
            'sensors': sensors
        })
    except Exception as e:
        logger.error(f"Error fetching sensors: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), HTTP_SERVER_ERROR


@api_bp.route("/api/predict", methods=['POST'])
def predict():
    """
    Make predictions for all active models or specific model/sensor
    
    Request body (optional):
    {
        "model_code": "model_code_here",  // Optional: predict for specific model
        "sensor_code": "sensor_code_here"  // Optional: predict for specific sensor
    }
    """
    try:
        prediction_service = get_prediction_service()
        
        # Get request data
        data = request.get_json() if request.is_json else {}
        
        model_code = data.get('model_code')
        sensor_code = data.get('sensor_code')
        
        # Predict based on parameters
        if sensor_code:
            # Predict for specific sensor
            result = prediction_service.predict_for_sensor(sensor_code)
        elif model_code:
            # Predict for specific model
            result = prediction_service.predict_for_model(model_code)
        else:
            # Predict for all active models
            results = prediction_service.predict_all_active_models()
            return jsonify({
                'status': 'success',
                'count': len(results),
                'results': results
            })
        
        if result.get('status') == 'error':
            return jsonify(result), HTTP_SERVER_ERROR
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in prediction endpoint: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), HTTP_SERVER_ERROR


@api_bp.route("/api/predict/<model_code>", methods=['POST'])
def predict_model(model_code):
    """Make prediction for a specific model"""
    try:
        prediction_service = get_prediction_service()
        result = prediction_service.predict_for_model(model_code)
        
        if result.get('status') == 'error':
            return jsonify(result), HTTP_SERVER_ERROR
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error predicting for model {model_code}: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), HTTP_SERVER_ERROR


@api_bp.route("/api/sensors/<sensor_code>/predict", methods=['POST'])
def predict_sensor(sensor_code):
    """Make prediction for a specific sensor"""
    try:
        prediction_service = get_prediction_service()
        result = prediction_service.predict_for_sensor(sensor_code)
        
        if result.get('status') == 'error':
            return jsonify(result), HTTP_SERVER_ERROR
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error predicting for sensor {sensor_code}: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), HTTP_SERVER_ERROR


@api_bp.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'status': 'error',
        'error': 'Endpoint not found'
    }), HTTP_NOT_FOUND


@api_bp.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({
        'status': 'error',
        'error': 'Internal server error'
    }), HTTP_SERVER_ERROR

