"""
Dynamic Architecture Configuration Handler
Supports per-model architecture settings from database
"""
import json
import logging
from config.settings import (
    LSTM_LAYER_1_SIZE, LSTM_LAYER_2_SIZE, DROPOUT_RATE,
    TCN_NB_FILTERS, TCN_KERNEL_SIZE, TCN_DILATIONS
)

logger = logging.getLogger(__name__)


class ArchitectureConfig:
    """
    Handle dynamic architecture configuration for LSTM, GRU, and TCN models.
    Configuration can come from database (per-model) or fall back to environment defaults.
    """
    
    # Default configurations for each model type
    DEFAULT_CONFIGS = {
        'LSTM': {
            'layer_1_size': LSTM_LAYER_1_SIZE,
            'layer_2_size': LSTM_LAYER_2_SIZE,
            'dropout_rate': DROPOUT_RATE,
            'activation': 'relu',
            'return_sequences_layer_1': True,
        },
        'GRU': {
            'layer_1_size': LSTM_LAYER_1_SIZE,  # Use same defaults
            'layer_2_size': LSTM_LAYER_2_SIZE,
            'dropout_rate': DROPOUT_RATE,
            'activation': 'relu',
            'return_sequences_layer_1': True,
        },
        'TCN': {
            'nb_filters': TCN_NB_FILTERS,
            'kernel_size': TCN_KERNEL_SIZE,
            'dilations': TCN_DILATIONS,
            'return_sequences': False,
        }
    }
    
    @staticmethod
    def parse_config(model_config_dict):
        """
        Parse model configuration from database
        
        Args:
            model_config_dict: Dictionary containing model configuration including:
                - type: Model type (LSTM, GRU, TCN)
                - architecture_config: JSON string or dict with architecture parameters
        
        Returns:
            Dictionary with parsed architecture configuration
        """
        model_type = model_config_dict.get('type', '').upper()
        architecture_config = model_config_dict.get('architecture_config')
        
        # Get default config for model type
        default_config = ArchitectureConfig.DEFAULT_CONFIGS.get(
            model_type, 
            ArchitectureConfig.DEFAULT_CONFIGS['LSTM']
        ).copy()
        
        # If no custom config, return defaults
        if not architecture_config:
            logger.info(f"Using default architecture for {model_type}: {default_config}")
            return default_config
        
        # Parse JSON if string
        try:
            if isinstance(architecture_config, str):
                custom_config = json.loads(architecture_config)
            else:
                custom_config = architecture_config
            
            # Merge custom config with defaults
            merged_config = default_config.copy()
            merged_config.update(custom_config)
            
            logger.info(f"Using custom architecture for {model_type}: {merged_config}")
            return merged_config
            
        except (json.JSONDecodeError, TypeError) as e:
            logger.warning(f"Failed to parse architecture_config: {e}. Using defaults.")
            return default_config
    
    @staticmethod
    def get_lstm_config(architecture_config):
        """Extract LSTM-specific configuration"""
        return {
            'layer_1_size': int(architecture_config.get('layer_1_size', LSTM_LAYER_1_SIZE)),
            'layer_2_size': int(architecture_config.get('layer_2_size', LSTM_LAYER_2_SIZE)),
            'dropout_rate': float(architecture_config.get('dropout_rate', DROPOUT_RATE)),
            'activation': architecture_config.get('activation', 'relu'),
            'return_sequences_layer_1': architecture_config.get('return_sequences_layer_1', True),
        }
    
    @staticmethod
    def get_gru_config(architecture_config):
        """Extract GRU-specific configuration"""
        return {
            'layer_1_size': int(architecture_config.get('layer_1_size', LSTM_LAYER_1_SIZE)),
            'layer_2_size': int(architecture_config.get('layer_2_size', LSTM_LAYER_2_SIZE)),
            'dropout_rate': float(architecture_config.get('dropout_rate', DROPOUT_RATE)),
            'activation': architecture_config.get('activation', 'relu'),
            'return_sequences_layer_1': architecture_config.get('return_sequences_layer_1', True),
        }
    
    @staticmethod
    def get_tcn_config(architecture_config):
        """Extract TCN-specific configuration"""
        dilations = architecture_config.get('dilations', TCN_DILATIONS)
        
        # Ensure dilations is a list
        if isinstance(dilations, str):
            dilations = [int(x.strip()) for x in dilations.split(',')]
        elif not isinstance(dilations, list):
            dilations = TCN_DILATIONS
        
        return {
            'nb_filters': int(architecture_config.get('nb_filters', TCN_NB_FILTERS)),
            'kernel_size': int(architecture_config.get('kernel_size', TCN_KERNEL_SIZE)),
            'dilations': dilations,
            'return_sequences': architecture_config.get('return_sequences', False),
        }


class TrainingConfig:
    """
    Handle dynamic training configuration for models.
    Configuration can come from database (per-model) or fall back to environment defaults.
    """
    
    @staticmethod
    def parse_config(model_config_dict, epochs=None, batch_size=None, test_size=None):
        """
        Parse training configuration from database or parameters
        
        Args:
            model_config_dict: Dictionary containing model configuration
            epochs: Override epochs (from command line or API)
            batch_size: Override batch size (from command line or API)
            test_size: Override test size (from command line or API)
        
        Returns:
            Dictionary with training configuration
        """
        from config.settings import DEFAULT_EPOCHS, DEFAULT_BATCH_SIZE, TEST_SIZE
        
        training_config = model_config_dict.get('training_config')
        
        # Parse JSON if string
        custom_config = {}
        if training_config:
            try:
                if isinstance(training_config, str):
                    custom_config = json.loads(training_config)
                else:
                    custom_config = training_config
            except (json.JSONDecodeError, TypeError) as e:
                logger.warning(f"Failed to parse training_config: {e}. Using defaults.")
        
        # Build final config with priority: parameter > database > environment > default
        config = {
            'epochs': epochs or custom_config.get('epochs') or DEFAULT_EPOCHS,
            'batch_size': batch_size or custom_config.get('batch_size') or DEFAULT_BATCH_SIZE,
            'test_size': test_size or custom_config.get('test_size') or TEST_SIZE,
            'optimizer': custom_config.get('optimizer', 'adam'),
            'learning_rate': custom_config.get('learning_rate'),  # None means use optimizer default
            'loss': custom_config.get('loss', 'mse'),
            'validation_split': custom_config.get('validation_split', 0.0),  # 0 means use test_size
        }
        
        logger.info(f"Training configuration: {config}")
        return config


def get_architecture_info(model_type, architecture_config):
    """
    Get human-readable architecture information
    
    Args:
        model_type: Model type (LSTM, GRU, TCN)
        architecture_config: Parsed architecture configuration
    
    Returns:
        String with architecture summary
    """
    model_type = model_type.upper()
    
    if model_type in ['LSTM', 'GRU']:
        return (f"{model_type}(layer1={architecture_config.get('layer_1_size')}, "
                f"layer2={architecture_config.get('layer_2_size')}, "
                f"dropout={architecture_config.get('dropout_rate')})")
    elif model_type == 'TCN':
        return (f"TCN(filters={architecture_config.get('nb_filters')}, "
                f"kernel={architecture_config.get('kernel_size')}, "
                f"dilations={architecture_config.get('dilations')})")
    else:
        return f"{model_type}(config={architecture_config})"
