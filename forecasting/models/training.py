"""
Model training utilities for FFWS Forecasting System
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import logging
from pathlib import Path
from config.settings import MODELS_DIR, SCALERS_DIR, DEFAULT_EPOCHS, DEFAULT_BATCH_SIZE
from utils.helpers import save_pickle, get_model_filename, get_scaler_filename
from keras import backend as K

logger = logging.getLogger(__name__)


def root_mean_squared_error(y_true, y_pred):
    """Custom RMSE metric for Keras"""
    return K.sqrt(K.mean(K.square(y_pred - y_true)))


def split_sequences_sliding(sequences, n_steps_in, n_steps_out):
    """
    Split multivariate sequences into samples using sliding window
    
    Args:
        sequences: Input sequences array
        n_steps_in: Number of input timesteps
        n_steps_out: Number of output timesteps
    
    Returns:
        X, y arrays for training
    """
    X, y = [], []
    
    for i in range(len(sequences)):
        # Find the end of this pattern
        end_ix = i + n_steps_in
        out_end_ix = end_ix + n_steps_out
        
        # Check if we are beyond the dataset
        if out_end_ix > len(sequences):
            break
        
        # Gather input and output parts of the pattern
        seq_x, seq_y = sequences[i:end_ix, :], sequences[end_ix:out_end_ix, :]
        X.append(seq_x)
        y.append(seq_y)
    
    return np.array(X), np.array(y)


def scale_data(X_train, y_train, X_test=None, y_test=None):
    """
    Scale training and test data
    
    Args:
        X_train: Training input data
        y_train: Training output data
        X_test: Test input data (optional)
        y_test: Test output data (optional)
    
    Returns:
        Scaled data and fitted scalers
    """
    # Initialize scalers
    x_scaler = StandardScaler()
    y_scaler = StandardScaler()
    
    # Reshape for scaling
    n_samples, n_steps, n_features = X_train.shape
    X_train_reshaped = X_train.reshape(-1, n_features)
    
    # Fit and transform training data
    X_train_scaled = x_scaler.fit_transform(X_train_reshaped)
    X_train_scaled = X_train_scaled.reshape(n_samples, n_steps, n_features)
    
    # Scale y data
    y_train_reshaped = y_train.reshape(-1, y_train.shape[-1])
    y_train_scaled = y_scaler.fit_transform(y_train_reshaped)
    y_train_scaled = y_train_scaled.reshape(y_train.shape)
    
    # Scale test data if provided
    if X_test is not None and y_test is not None:
        n_samples_test, n_steps_test, n_features_test = X_test.shape
        X_test_reshaped = X_test.reshape(-1, n_features_test)
        X_test_scaled = x_scaler.transform(X_test_reshaped)
        X_test_scaled = X_test_scaled.reshape(n_samples_test, n_steps_test, n_features_test)
        
        y_test_reshaped = y_test.reshape(-1, y_test.shape[-1])
        y_test_scaled = y_scaler.transform(y_test_reshaped)
        y_test_scaled = y_test_scaled.reshape(y_test.shape)
        
        return X_train_scaled, y_train_scaled, X_test_scaled, y_test_scaled, x_scaler, y_scaler
    
    return X_train_scaled, y_train_scaled, x_scaler, y_scaler


def build_lstm_model(n_steps_in, n_steps_out, n_features):
    """Build LSTM model"""
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout
    
    model = Sequential([
        LSTM(128, activation='relu', return_sequences=True, input_shape=(n_steps_in, n_features)),
        Dropout(0.2),
        LSTM(64, activation='relu'),
        Dropout(0.2),
        Dense(n_steps_out * n_features)
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=[root_mean_squared_error])
    return model


def build_gru_model(n_steps_in, n_steps_out, n_features):
    """Build GRU model"""
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import GRU, Dense, Dropout
    
    model = Sequential([
        GRU(128, activation='relu', return_sequences=True, input_shape=(n_steps_in, n_features)),
        Dropout(0.2),
        GRU(64, activation='relu'),
        Dropout(0.2),
        Dense(n_steps_out * n_features)
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=[root_mean_squared_error])
    return model


def build_tcn_model(n_steps_in, n_steps_out, n_features):
    """Build TCN model"""
    try:
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Dense
        from keras_tcn import TCN
        
        model = Sequential([
            TCN(
                nb_filters=64,
                kernel_size=3,
                dilations=[1, 2, 4, 8],
                return_sequences=False,
                input_shape=(n_steps_in, n_features)
            ),
            Dense(n_steps_out * n_features)
        ])
        
        model.compile(optimizer='adam', loss='mse', metrics=[root_mean_squared_error])
        return model
    except ImportError:
        logger.error("keras_tcn not installed. Cannot build TCN model.")
        raise


def train_model(model_code, model_type, df_data, n_steps_in, n_steps_out, 
                epochs=None, batch_size=None, test_size=0.2):
    """
    Train a time series forecasting model
    
    Args:
        model_code: Unique model code
        model_type: Model type (LSTM, GRU, TCN)
        df_data: DataFrame with training data (no DateTime column)
        n_steps_in: Number of input timesteps
        n_steps_out: Number of output timesteps
        epochs: Number of training epochs
        batch_size: Batch size for training
        test_size: Proportion of data for testing
    
    Returns:
        Dictionary with training results
    """
    try:
        logger.info(f"Starting training for model: {model_code}")
        
        # Use default values if not provided
        epochs = epochs or DEFAULT_EPOCHS
        batch_size = batch_size or DEFAULT_BATCH_SIZE
        
        # Convert to numpy array
        data = df_data.to_numpy()
        n_features = data.shape[1]
        
        logger.info(f"Data shape: {data.shape}, Features: {n_features}")
        
        # Create sequences
        X, y = split_sequences_sliding(data, n_steps_in, n_steps_out)
        logger.info(f"Sequences created - X: {X.shape}, y: {y.shape}")
        
        # Split into train and test
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, shuffle=False
        )
        
        # Scale data
        X_train_scaled, y_train_scaled, X_test_scaled, y_test_scaled, x_scaler, y_scaler = scale_data(
            X_train, y_train, X_test, y_test
        )
        
        # Build model based on type
        model_type_upper = model_type.upper()
        if model_type_upper == 'LSTM':
            model = build_lstm_model(n_steps_in, n_steps_out, n_features)
        elif model_type_upper == 'GRU':
            model = build_gru_model(n_steps_in, n_steps_out, n_features)
        elif model_type_upper == 'TCN':
            model = build_tcn_model(n_steps_in, n_steps_out, n_features)
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
        
        logger.info(f"Model architecture built: {model_type_upper}")
        
        # Reshape y for training (flatten output dimension)
        y_train_flat = y_train_scaled.reshape(y_train_scaled.shape[0], -1)
        y_test_flat = y_test_scaled.reshape(y_test_scaled.shape[0], -1)
        
        # Train model
        logger.info(f"Training model with {epochs} epochs, batch size {batch_size}")
        history = model.fit(
            X_train_scaled, y_train_flat,
            validation_data=(X_test_scaled, y_test_flat),
            epochs=epochs,
            batch_size=batch_size,
            verbose=1
        )
        
        # Save model
        model_path = MODELS_DIR / get_model_filename(model_code)
        model.save(str(model_path))
        logger.info(f"Model saved: {model_path}")
        
        # Save scalers
        x_scaler_path = SCALERS_DIR / get_scaler_filename(model_code, 'x_scaler')
        y_scaler_path = SCALERS_DIR / get_scaler_filename(model_code, 'y_scaler')
        
        save_pickle(x_scaler, x_scaler_path)
        save_pickle(y_scaler, y_scaler_path)
        logger.info(f"Scalers saved: {x_scaler_path}, {y_scaler_path}")
        
        # Get final metrics
        final_loss = history.history['loss'][-1]
        final_val_loss = history.history['val_loss'][-1]
        
        result = {
            'status': 'success',
            'model_code': model_code,
            'model_type': model_type,
            'epochs': epochs,
            'final_loss': float(final_loss),
            'final_val_loss': float(final_val_loss),
            'model_path': str(model_path),
            'x_scaler_path': str(x_scaler_path),
            'y_scaler_path': str(y_scaler_path)
        }
        
        logger.info(f"Training completed successfully for {model_code}")
        return result
        
    except Exception as e:
        logger.error(f"Error training model {model_code}: {e}")
        return {
            'status': 'failed',
            'model_code': model_code,
            'error': str(e)
        }

