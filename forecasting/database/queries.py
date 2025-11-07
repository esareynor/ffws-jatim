"""
Database query utilities for fetching sensor data and configurations
"""
import pandas as pd
from datetime import datetime, timedelta
from sqlalchemy import desc, and_, or_
import logging
from database.connection import get_db
from database.models import MasModel, MasSensor, MasDevice, DataActual, MasScaler

logger = logging.getLogger(__name__)


class DataFetcher:
    """Fetch data from database for training and prediction"""
    
    def __init__(self):
        self.db = get_db()
    
    def get_active_models(self):
        """Get all active forecasting models from database"""
        try:
            with self.db.session_scope() as session:
                models = session.query(MasModel).filter(
                    MasModel.is_active == True
                ).all()
                
                return [{
                    'id': m.id,
                    'code': m.code,
                    'name': m.name,
                    'type': m.type,
                    'n_steps_in': m.n_steps_in,
                    'n_steps_out': m.n_steps_out,
                    'file_path': m.file_path
                } for m in models]
        except Exception as e:
            logger.error(f"Error fetching active models: {e}")
            return []
    
    def get_model_by_code(self, model_code):
        """Get model configuration by code"""
        try:
            with self.db.session_scope() as session:
                model = session.query(MasModel).filter(
                    MasModel.code == model_code
                ).first()
                
                if model:
                    return {
                        'id': model.id,
                        'code': model.code,
                        'name': model.name,
                        'type': model.type,
                        'n_steps_in': model.n_steps_in,
                        'n_steps_out': model.n_steps_out,
                        'file_path': model.file_path
                    }
                return None
        except Exception as e:
            logger.error(f"Error fetching model {model_code}: {e}")
            return None
    
    def get_sensors_for_model(self, model_code):
        """Get all active sensors using a specific model"""
        try:
            with self.db.session_scope() as session:
                sensors = session.query(MasSensor).filter(
                    and_(
                        MasSensor.mas_model_code == model_code,
                        MasSensor.is_active == True,
                        MasSensor.status == 'active'
                    )
                ).all()
                
                return [{
                    'id': s.id,
                    'code': s.code,
                    'name': s.name,
                    'parameter': s.parameter,
                    'unit': s.unit,
                    'device_code': s.mas_device_code,
                    'forecasting_status': s.forecasting_status
                } for s in sensors]
        except Exception as e:
            logger.error(f"Error fetching sensors for model {model_code}: {e}")
            return []
    
    def get_sensor_by_code(self, sensor_code):
        """Get sensor configuration by code"""
        try:
            with self.db.session_scope() as session:
                sensor = session.query(MasSensor).filter(
                    MasSensor.code == sensor_code
                ).first()
                
                if sensor:
                    return {
                        'id': sensor.id,
                        'code': sensor.code,
                        'name': sensor.name,
                        'parameter': sensor.parameter,
                        'unit': sensor.unit,
                        'device_code': sensor.mas_device_code,
                        'model_code': sensor.mas_model_code,
                        'forecasting_status': sensor.forecasting_status
                    }
                return None
        except Exception as e:
            logger.error(f"Error fetching sensor {sensor_code}: {e}")
            return None
    
    def get_sensor_data_for_training(self, sensor_codes, limit=720):
        """
        Get historical data for multiple sensors for training
        
        Args:
            sensor_codes: List of sensor codes to fetch data for
            limit: Number of most recent records to fetch (default: 720 = 30 days hourly)
        
        Returns:
            DataFrame with columns for each sensor and DateTime
        """
        try:
            query = """
            SELECT 
                mas_sensor_code,
                value,
                received_at as DateTime
            FROM (
                SELECT 
                    mas_sensor_code,
                    value,
                    received_at,
                    ROW_NUMBER() OVER (PARTITION BY mas_sensor_code ORDER BY received_at DESC) as rn
                FROM data_actuals
                WHERE mas_sensor_code IN :sensor_codes
            ) ranked
            WHERE rn <= :limit
            ORDER BY DateTime ASC
            """
            
            result_data, result_columns = self.db.execute_query(
                query,
                {'sensor_codes': tuple(sensor_codes), 'limit': limit}
            )
            
            # Convert to DataFrame
            df = pd.DataFrame(result_data, columns=result_columns)
            
            if df.empty:
                logger.warning(f"No data found for sensors: {sensor_codes}")
                return pd.DataFrame()
            
            # Pivot to have one column per sensor
            df_pivot = df.pivot(index='DateTime', columns='mas_sensor_code', values='value')
            df_pivot.reset_index(inplace=True)
            df_pivot['DateTime'] = pd.to_datetime(df_pivot['DateTime'])
            
            # Sort by DateTime
            df_pivot.sort_values('DateTime', inplace=True)
            df_pivot.reset_index(drop=True, inplace=True)
            
            return df_pivot
            
        except Exception as e:
            logger.error(f"Error fetching training data: {e}")
            return pd.DataFrame()
    
    def get_latest_sensor_data(self, sensor_codes, n_records=5):
        """
        Get the latest N records for specified sensors
        
        Args:
            sensor_codes: List of sensor codes
            n_records: Number of latest records to fetch
        
        Returns:
            DataFrame with latest sensor readings
        """
        try:
            query = """
            SELECT 
                mas_sensor_code,
                value,
                received_at as DateTime
            FROM (
                SELECT 
                    mas_sensor_code,
                    value,
                    received_at,
                    ROW_NUMBER() OVER (PARTITION BY mas_sensor_code ORDER BY received_at DESC) as rn
                FROM data_actuals
                WHERE mas_sensor_code IN :sensor_codes
            ) ranked
            WHERE rn <= :n_records
            ORDER BY DateTime ASC
            """
            
            result_data, result_columns = self.db.execute_query(
                query,
                {'sensor_codes': tuple(sensor_codes), 'n_records': n_records}
            )
            
            df = pd.DataFrame(result_data, columns=result_columns)
            
            if df.empty:
                logger.warning(f"No latest data found for sensors: {sensor_codes}")
                return pd.DataFrame()
            
            # Pivot to have one column per sensor
            df_pivot = df.pivot(index='DateTime', columns='mas_sensor_code', values='value')
            df_pivot.reset_index(inplace=True)
            df_pivot['DateTime'] = pd.to_datetime(df_pivot['DateTime'])
            
            return df_pivot
            
        except Exception as e:
            logger.error(f"Error fetching latest sensor data: {e}")
            return pd.DataFrame()
    
    def get_scalers_for_model(self, model_code):
        """Get scaler file paths for a model"""
        try:
            with self.db.session_scope() as session:
                scalers = session.query(MasScaler).filter(
                    MasScaler.mas_model_code == model_code
                ).all()
                
                scaler_dict = {}
                for scaler in scalers:
                    scaler_dict[scaler.scaler_type] = {
                        'file_path': scaler.file_path,
                        'scaler_class': scaler.scaler_class
                    }
                
                return scaler_dict
        except Exception as e:
            logger.error(f"Error fetching scalers for model {model_code}: {e}")
            return {}
    
    def get_device_by_code(self, device_code):
        """Get device information by code"""
        try:
            with self.db.session_scope() as session:
                device = session.query(MasDevice).filter(
                    MasDevice.code == device_code
                ).first()
                
                if device:
                    return {
                        'id': device.id,
                        'code': device.code,
                        'name': device.name,
                        'latitude': float(device.latitude),
                        'longitude': float(device.longitude),
                        'elevation_m': float(device.elevation_m),
                        'status': device.status
                    }
                return None
        except Exception as e:
            logger.error(f"Error fetching device {device_code}: {e}")
            return None


# Global data fetcher instance
data_fetcher = DataFetcher()


def get_data_fetcher():
    """Get data fetcher instance"""
    return data_fetcher

