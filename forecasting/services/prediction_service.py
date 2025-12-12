"""
Prediction service for FFWS Forecasting System
Handles prediction workflow and saves results to database
"""
import logging
from datetime import datetime, timedelta
import pandas as pd
from database.queries import get_data_fetcher
from database.connection import get_db
from models.time_series_model import get_model_loader
from config.settings import DEFAULT_CONFIDENCE_SCORE
from utils.helpers import calculate_confidence_score

logger = logging.getLogger(__name__)


class PredictionService:
    """Service for making predictions and saving to database"""
    
    def __init__(self):
        self.data_fetcher = get_data_fetcher()
        self.model_loader = get_model_loader()
        self.db = get_db()
    
    def predict_for_model(self, model_code):
        """
        Make predictions for all sensors using a specific model
        
        Args:
            model_code: Model code to use for prediction
        
        Returns:
            Dictionary with prediction results
        """
        try:
            logger.info(f"Starting prediction for model: {model_code}")
            
            # Get model configuration
            model_config = self.data_fetcher.get_model_by_code(model_code)
            if not model_config:
                raise ValueError(f"Model not found: {model_code}")
            
            # Get sensors for this model
            sensors = self.data_fetcher.get_sensors_for_model(model_code)
            if not sensors:
                logger.warning(f"No active sensors found for model: {model_code}")
                return {'status': 'no_sensors', 'model_code': model_code}
            
            logger.info(f"Found {len(sensors)} sensors for model {model_code}")
            
            # Get sensor codes
            sensor_codes = [s['code'] for s in sensors]
            
            # Get latest data for prediction
            n_steps_in = model_config['n_steps_in']
            latest_data = self.data_fetcher.get_latest_sensor_data(
                sensor_codes, 
                n_records=n_steps_in
            )
            
            if latest_data.empty:
                logger.warning(f"No data available for sensors: {sensor_codes}")
                return {'status': 'no_data', 'model_code': model_code}
            
            # Load model
            model = self.model_loader.load_model(model_config, sensors)
            
            # Get the last timestamp from data
            last_timestamp = latest_data['DateTime'].iloc[-1]
            
            # Prepare sensor columns (exclude DateTime)
            sensor_columns = [col for col in latest_data.columns if col != 'DateTime']
            
            # Make prediction
            predictions = model.predict_from_dataframe(latest_data, sensor_columns)
            
            # Save predictions to database
            prediction_results = self._save_predictions(
                model_code=model_code,
                sensor_codes=sensor_codes,
                predictions=predictions,
                prediction_run_at=datetime.now(),
                last_timestamp=last_timestamp,
                n_steps_out=model_config['n_steps_out']
            )
            
            logger.info(f"Prediction completed for model {model_code}")
            
            return {
                'status': 'success',
                'model_code': model_code,
                'sensors': sensor_codes,
                'prediction_run_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'predicted_from': last_timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'predictions': prediction_results
            }
            
        except Exception as e:
            logger.error(f"Error making prediction for model {model_code}: {e}")
            return {
                'status': 'error',
                'model_code': model_code,
                'error': str(e)
            }
    
    def predict_for_sensor(self, sensor_code):
        """
        Make prediction for a specific sensor
        
        Args:
            sensor_code: Sensor code to predict for
        
        Returns:
            Dictionary with prediction results
        """
        try:
            logger.info(f"Starting prediction for sensor: {sensor_code}")
            
            # Get sensor configuration
            sensor = self.data_fetcher.get_sensor_by_code(sensor_code)
            if not sensor:
                raise ValueError(f"Sensor not found: {sensor_code}")
            
            model_code = sensor['model_code']
            if not model_code:
                raise ValueError(f"No model assigned to sensor: {sensor_code}")
            
            # Get model configuration
            model_config = self.data_fetcher.get_model_by_code(model_code)
            if not model_config:
                raise ValueError(f"Model not found: {model_code}")
            
            # Get all sensors for this model (for proper feature count)
            all_sensors = self.data_fetcher.get_sensors_for_model(model_code)
            sensor_codes = [s['code'] for s in all_sensors]
            
            # Get latest data
            n_steps_in = model_config['n_steps_in']
            latest_data = self.data_fetcher.get_latest_sensor_data(
                sensor_codes,
                n_records=n_steps_in
            )
            
            if latest_data.empty:
                return {'status': 'no_data', 'sensor_code': sensor_code}
            
            # Load model
            model = self.model_loader.load_model(model_config, all_sensors)
            
            # Get the last timestamp
            last_timestamp = latest_data['DateTime'].iloc[-1]
            
            # Prepare sensor columns
            sensor_columns = [col for col in latest_data.columns if col != 'DateTime']
            
            # Make prediction
            predictions = model.predict_from_dataframe(latest_data, sensor_columns)
            
            # Save predictions
            prediction_results = self._save_predictions(
                model_code=model_code,
                sensor_codes=sensor_codes,
                predictions=predictions,
                prediction_run_at=datetime.now(),
                last_timestamp=last_timestamp,
                n_steps_out=model_config['n_steps_out']
            )
            
            logger.info(f"Prediction completed for sensor {sensor_code}")
            
            return {
                'status': 'success',
                'sensor_code': sensor_code,
                'model_code': model_code,
                'prediction_run_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'predicted_from': last_timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'predictions': prediction_results
            }
            
        except Exception as e:
            logger.error(f"Error making prediction for sensor {sensor_code}: {e}")
            return {
                'status': 'error',
                'sensor_code': sensor_code,
                'error': str(e)
            }
    
    def _save_predictions(self, model_code, sensor_codes, predictions, 
                         prediction_run_at, last_timestamp, n_steps_out):
        """
        Save predictions to database
        
        Args:
            model_code: Model code used for prediction
            sensor_codes: List of sensor codes
            predictions: DataFrame with predictions
            prediction_run_at: Timestamp when prediction was made
            last_timestamp: Last timestamp in input data
            n_steps_out: Number of prediction steps
        
        Returns:
            Dictionary with saved predictions
        """
        try:
            prediction_results = {}
            
            # Iterate through each prediction timestep
            for step in range(n_steps_out):
                # Calculate prediction timestamp (1 hour ahead for each step)
                prediction_ts = last_timestamp + timedelta(hours=step + 1)
                
                # Iterate through each sensor
                for idx, sensor_code in enumerate(sensor_codes):
                    # Get predicted value for this sensor and timestep
                    predicted_value = float(predictions.iloc[0, step * len(sensor_codes) + idx])
                    
                    # Calculate confidence score (simplified)
                    confidence_score = DEFAULT_CONFIDENCE_SCORE
                    
                    # Prepare insert query
                    insert_query = """
                    INSERT INTO data_predictions 
                    (mas_sensor_code, mas_model_code, prediction_run_at, 
                     prediction_for_ts, predicted_value, confidence_score, 
                     threshold_status, created_at, updated_at)
                    VALUES 
                    (:sensor_code, :model_code, :run_at, :for_ts, 
                     :value, :confidence, 'unknown', NOW(), NOW())
                    ON DUPLICATE KEY UPDATE
                    predicted_value = VALUES(predicted_value),
                    confidence_score = VALUES(confidence_score),
                    updated_at = NOW()
                    """
                    
                    # Execute insert
                    self.db.execute_query(insert_query, {
                        'sensor_code': sensor_code,
                        'model_code': model_code,
                        'run_at': prediction_run_at,
                        'for_ts': prediction_ts,
                        'value': predicted_value,
                        'confidence': confidence_score
                    })
                    
                    # Store in results
                    if sensor_code not in prediction_results:
                        prediction_results[sensor_code] = {}
                    
                    prediction_results[sensor_code][prediction_ts.strftime('%Y-%m-%d %H:%M:%S')] = {
                        'value': predicted_value,
                        'confidence': confidence_score
                    }
            
            logger.info(f"Saved predictions for {len(sensor_codes)} sensors, {n_steps_out} timesteps")
            return prediction_results
            
        except Exception as e:
            logger.error(f"Error saving predictions: {e}")
            raise
    
    def predict_all_active_models(self):
        """
        Make predictions for all active models
        
        Returns:
            List of prediction results for each model
        """
        try:
            # Get all active models
            models = self.data_fetcher.get_active_models()
            
            if not models:
                logger.warning("No active models found")
                return []
            
            logger.info(f"Found {len(models)} active models")
            
            results = []
            for model in models:
                result = self.predict_for_model(model['code'])
                results.append(result)
            
            return results
            
        except Exception as e:
            logger.error(f"Error predicting for all models: {e}")
            return []


# Global prediction service instance
prediction_service = PredictionService()


def get_prediction_service():
    """Get prediction service instance"""
    return prediction_service

