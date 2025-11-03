"""
Database models for FFWS Forecasting System
Maps to existing Laravel database tables
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Text, Boolean, ForeignKey, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class MasModel(Base):
    """Forecasting model configuration"""
    __tablename__ = 'mas_models'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    code = Column(String(100), unique=True, nullable=False)
    type = Column(String(100), nullable=False)  # e.g., 'LSTM', 'GRU', 'TCN'
    version = Column(String(50))
    description = Column(Text)
    file_path = Column(String(512))
    n_steps_in = Column(Integer)  # Input timesteps
    n_steps_out = Column(Integer)  # Output timesteps
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sensors = relationship("MasSensor", back_populates="model")


class MasDevice(Base):
    """Monitoring device/station"""
    __tablename__ = 'mas_devices'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    mas_river_basin_code = Column(String(100), nullable=False)
    name = Column(String(255), nullable=False)
    code = Column(String(100), unique=True, nullable=False)
    latitude = Column(DECIMAL(10, 6), nullable=False)
    longitude = Column(DECIMAL(10, 6), nullable=False)
    elevation_m = Column(DECIMAL(8, 2), nullable=False)
    status = Column(Enum('active', 'inactive'), default='active')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sensors = relationship("MasSensor", back_populates="device")


class MasSensor(Base):
    """Sensor configuration"""
    __tablename__ = 'mas_sensors'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    mas_device_code = Column(String(100), ForeignKey('mas_devices.code'), nullable=False)
    code = Column(String(100), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    parameter = Column(Enum('water_level', 'rainfall', 'temperature', 'discharge', 'other'), nullable=False)
    unit = Column(String(50))
    mas_model_code = Column(String(100), ForeignKey('mas_models.code'))
    status = Column(Enum('active', 'inactive'), default='active')
    is_active = Column(Boolean, default=True)
    forecasting_status = Column(Enum('stopped', 'running', 'paused'), default='stopped')
    last_seen = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    device = relationship("MasDevice", back_populates="sensors")
    model = relationship("MasModel", back_populates="sensors")
    data_actuals = relationship("DataActual", back_populates="sensor")
    data_predictions = relationship("DataPrediction", back_populates="sensor")


class DataActual(Base):
    """Actual sensor readings"""
    __tablename__ = 'data_actuals'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    mas_sensor_code = Column(String(100), ForeignKey('mas_sensors.code'), nullable=False)
    value = Column(DECIMAL(12, 4), nullable=False)
    received_at = Column(DateTime, nullable=False)
    threshold_status = Column(Enum('normal', 'watch', 'warning', 'danger', 'unknown'), default='unknown')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sensor = relationship("MasSensor", back_populates="data_actuals")


class DataPrediction(Base):
    """Predicted sensor values"""
    __tablename__ = 'data_predictions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    mas_sensor_code = Column(String(100), ForeignKey('mas_sensors.code'), nullable=False)
    mas_model_code = Column(String(100), ForeignKey('mas_models.code'))
    prediction_run_at = Column(DateTime, nullable=False)
    prediction_for_ts = Column(DateTime, nullable=False)
    predicted_value = Column(DECIMAL(12, 4), nullable=False)
    confidence_score = Column(DECIMAL(5, 4))
    threshold_status = Column(Enum('normal', 'watch', 'warning', 'danger', 'unknown'), default='unknown')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sensor = relationship("MasSensor", back_populates="data_predictions")
    model = relationship("MasModel")


class MasScaler(Base):
    """Scaler configuration for models"""
    __tablename__ = 'mas_scalers'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    mas_model_code = Column(String(100), ForeignKey('mas_models.code'), nullable=False)
    scaler_type = Column(Enum('x_scaler', 'y_scaler'), nullable=False)
    file_path = Column(String(512), nullable=False)
    scaler_class = Column(String(100))  # e.g., 'StandardScaler', 'MinMaxScaler'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

