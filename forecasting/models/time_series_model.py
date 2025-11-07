"""
Time Series Model wrapper for FFWS Forecasting System
Supports LSTM, GRU, and TCN models dynamically
"""
import pickle
import numpy as np
import pandas as pd
from pathlib import Path
import logging
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import LSTM, GRU
from keras import backend as K
from config.settings import MODELS_DIR, SCALERS_DIR
from utils.helpers import load_pickle, get_model_filename, get_scaler_filename

logger = logging.getLogger(__name__)


def root_mean_squared_error(y_true, y_pred):
    """Custom RMSE metric for Keras"""
    return K.sqrt(K.mean(K.square(y_pred - y_true)))


class TimeSeriesModel:
    """
    Wrapper class for time series forecasting models
    Handles model loading, preprocessing, and prediction
    """
    
    def __init__(self, model_code, model_type, n_steps_in, n_steps_out, n_features):
        """
        Initialize time series model
        
        Args:
            model_code: Unique model code from database
            model_type: Model type (LSTM, GRU, TCN)
            n_steps_in: Number of input timesteps
            n_steps_out: Number of output timesteps
            n_features: Number of input features
        """
        self.model_code = model_code
        self.model_type = model_type
        self.n_steps_in = n_steps_in
        self.n_steps_out = n_steps_out
        self.n_features = n_features
        
        self.model = None
        self.x_scaler = None
        self.y_scaler = None
        
        self._load_model()
        self._load_scalers()
    
    def _load_model(self):
        """Load Keras model from file"""
        try:
            model_path = MODELS_DIR / get_model_filename(self.model_code)
            
            if not model_path.exists():
                raise FileNotFoundError(f"Model file not found: {model_path}")
            
            # Load model with custom objects
            custom_objects = {
                'root_mean_squared_error': root_mean_squared_error,
                'LSTM': LSTM,
                'GRU': GRU
            }
            
            # Try to import TCN if available
            try:
                from keras_tcn import TCN
                custom_objects['TCN'] = TCN
            except ImportError:
                logger.warning("keras_tcn not available, TCN models won't be supported")
            
            self.model = load_model(str(model_path), custom_objects=custom_objects)
            logger.info(f"Model loaded successfully: {self.model_code}")
            
        except Exception as e:
            logger.error(f"Error loading model {self.model_code}: {e}")
            raise
    
    def _load_scalers(self):
        """Load X and Y scalers from pickle files"""
        try:
            x_scaler_path = SCALERS_DIR / get_scaler_filename(self.model_code, 'x_scaler')
            y_scaler_path = SCALERS_DIR / get_scaler_filename(self.model_code, 'y_scaler')
            
            if not x_scaler_path.exists():
                raise FileNotFoundError(f"X scaler not found: {x_scaler_path}")
            if not y_scaler_path.exists():
                raise FileNotFoundError(f"Y scaler not found: {y_scaler_path}")
            
            self.x_scaler = load_pickle(x_scaler_path)
            self.y_scaler = load_pickle(y_scaler_path)
            
            logger.info(f"Scalers loaded successfully for model: {self.model_code}")
            
        except Exception as e:
            logger.error(f"Error loading scalers for {self.model_code}: {e}")
            raise
    
    def preprocess_data(self, df, sensor_columns):
        """
        Preprocess input data for prediction
        
        Args:
            df: DataFrame with sensor data (must include DateTime column)
            sensor_columns: List of sensor column names to use
        
        Returns:
            Scaled and reshaped data ready for model input
        """
        try:
            # Remove DateTime column if present
            if 'DateTime' in df.columns:
                df = df.drop(columns=['DateTime'])
            
            # Select only required sensor columns
            df_selected = df[sensor_columns].copy()
            
            # Convert to numpy array
            data = df_selected.to_numpy()
            
            # Scale the data
            data_scaled = self.x_scaler.transform(data)
            
            # Reshape for model input: (batch_size, n_steps_in, n_features)
            data_reshaped = data_scaled.reshape(-1, self.n_steps_in, self.n_features)
            
            return data_reshaped
            
        except Exception as e:
            logger.error(f"Error preprocessing data: {e}")
            raise
    
    def predict(self, preprocessed_data):
        """
        Make predictions using the model
        
        Args:
            preprocessed_data: Preprocessed and scaled input data
        
        Returns:
            DataFrame with predictions
        """
        try:
            # Make prediction
            predictions_scaled = self.model.predict(preprocessed_data, verbose=0)
            
            # Inverse transform predictions
            predictions = self.y_scaler.inverse_transform(
                predictions_scaled.reshape(-1, self.n_steps_out)
            )
            
            # Convert to DataFrame
            predictions_df = pd.DataFrame(predictions)
            
            return predictions_df
            
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            raise
    
    def predict_from_dataframe(self, df, sensor_columns):
        """
        End-to-end prediction from raw DataFrame
        
        Args:
            df: DataFrame with sensor data
            sensor_columns: List of sensor column names
        
        Returns:
            DataFrame with predictions
        """
        preprocessed = self.preprocess_data(df, sensor_columns)
        return self.predict(preprocessed)


class ModelLoader:
    """
    Dynamic model loader that loads models based on database configuration
    """
    
    def __init__(self):
        self.loaded_models = {}
    
    def load_model(self, model_config, sensor_configs):
        """
        Load a model with its configuration
        
        Args:
            model_config: Dictionary with model configuration from database
            sensor_configs: List of sensor configurations for this model
        
        Returns:
            TimeSeriesModel instance
        """
        model_code = model_config['code']
        
        # Check if already loaded
        if model_code in self.loaded_models:
            logger.info(f"Model {model_code} already loaded, returning cached instance")
            return self.loaded_models[model_code]
        
        try:
            # Determine number of features based on sensors
            n_features = len(sensor_configs)
            
            # Create model instance
            model = TimeSeriesModel(
                model_code=model_code,
                model_type=model_config['type'],
                n_steps_in=model_config['n_steps_in'],
                n_steps_out=model_config['n_steps_out'],
                n_features=n_features
            )
            
            # Cache the model
            self.loaded_models[model_code] = model
            
            logger.info(f"Model {model_code} loaded and cached successfully")
            return model
            
        except Exception as e:
            logger.error(f"Error loading model {model_code}: {e}")
            raise
    
    def get_model(self, model_code):
        """Get a loaded model by code"""
        return self.loaded_models.get(model_code)
    
    def unload_model(self, model_code):
        """Unload a model from cache"""
        if model_code in self.loaded_models:
            del self.loaded_models[model_code]
            logger.info(f"Model {model_code} unloaded from cache")
    
    def clear_cache(self):
        """Clear all loaded models from cache"""
        self.loaded_models.clear()
        logger.info("All models cleared from cache")


# Global model loader instance
model_loader = ModelLoader()


def get_model_loader():
    """Get model loader instance"""
    return model_loader

