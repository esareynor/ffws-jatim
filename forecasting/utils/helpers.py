"""
Helper utilities for FFWS Forecasting System
"""
import logging
import pickle
from pathlib import Path
from datetime import datetime
import numpy as np


def setup_logging(log_level='INFO', log_file=None):
    """
    Setup logging configuration
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Optional log file path
    """
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    handlers = [logging.StreamHandler()]
    
    if log_file:
        handlers.append(logging.FileHandler(log_file))
    
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format=log_format,
        handlers=handlers
    )


def save_pickle(obj, file_path):
    """
    Save object to pickle file
    
    Args:
        obj: Object to save
        file_path: Path to save file
    """
    file_path = Path(file_path)
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(file_path, 'wb') as f:
        pickle.dump(obj, f)


def load_pickle(file_path):
    """
    Load object from pickle file
    
    Args:
        file_path: Path to pickle file
    
    Returns:
        Loaded object
    """
    with open(file_path, 'rb') as f:
        return pickle.load(f)


def validate_sensor_data(df, required_columns):
    """
    Validate sensor data DataFrame
    
    Args:
        df: DataFrame to validate
        required_columns: List of required column names
    
    Returns:
        bool: True if valid, False otherwise
    """
    if df.empty:
        return False
    
    missing_columns = set(required_columns) - set(df.columns)
    if missing_columns:
        logging.error(f"Missing required columns: {missing_columns}")
        return False
    
    # Check for NaN values
    if df[required_columns].isnull().any().any():
        logging.warning("DataFrame contains NaN values")
        return False
    
    return True


def calculate_confidence_score(predictions, historical_variance=None):
    """
    Calculate confidence score for predictions
    
    Args:
        predictions: Array of predicted values
        historical_variance: Historical variance of the data (optional)
    
    Returns:
        float: Confidence score between 0 and 1
    """
    # Simple confidence calculation based on prediction variance
    # Lower variance = higher confidence
    pred_variance = np.var(predictions)
    
    if historical_variance is not None and historical_variance > 0:
        # Normalize by historical variance
        confidence = 1.0 - min(pred_variance / historical_variance, 1.0)
    else:
        # Use a simple heuristic
        confidence = max(0.5, 1.0 - (pred_variance / 10.0))
    
    return min(max(confidence, 0.0), 1.0)  # Clamp between 0 and 1


def format_datetime(dt, format_str='%Y-%m-%d %H:%M:%S'):
    """
    Format datetime object to string
    
    Args:
        dt: datetime object
        format_str: Format string
    
    Returns:
        str: Formatted datetime string
    """
    if isinstance(dt, str):
        return dt
    return dt.strftime(format_str)


def parse_datetime(dt_str, format_str='%Y-%m-%d %H:%M:%S'):
    """
    Parse datetime string to datetime object
    
    Args:
        dt_str: Datetime string
        format_str: Format string
    
    Returns:
        datetime: Parsed datetime object
    """
    if isinstance(dt_str, datetime):
        return dt_str
    return datetime.strptime(dt_str, format_str)


def get_model_filename(model_code, extension='.h5'):
    """
    Generate standardized model filename
    
    Args:
        model_code: Model code
        extension: File extension
    
    Returns:
        str: Model filename
    """
    return f"{model_code}{extension}"


def get_scaler_filename(model_code, scaler_type='x_scaler', extension='.pkl'):
    """
    Generate standardized scaler filename
    
    Args:
        model_code: Model code
        scaler_type: Type of scaler ('x_scaler' or 'y_scaler')
        extension: File extension
    
    Returns:
        str: Scaler filename
    """
    return f"{model_code}_{scaler_type}{extension}"

