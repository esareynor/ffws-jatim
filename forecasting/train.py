"""
Training script for FFWS Forecasting System
Trains models dynamically based on database configuration
"""
import argparse
import logging
from database.queries import get_data_fetcher
from models.training import train_model
from config.settings import TRAINING_DATA_LIMIT, LOG_LEVEL
from utils.helpers import setup_logging

# Setup logging
setup_logging(log_level=LOG_LEVEL, log_file='logs/training.log')
logger = logging.getLogger(__name__)


def train_single_model(model_code, epochs=None, batch_size=None):
    """
    Train a single model
    
    Args:
        model_code: Model code to train
        epochs: Number of training epochs (optional)
        batch_size: Batch size (optional)
    
    Returns:
        Training result dictionary
    """
    try:
        logger.info(f"Starting training for model: {model_code}")
        
        # Get data fetcher
        data_fetcher = get_data_fetcher()
        
        # Get model configuration
        model_config = data_fetcher.get_model_by_code(model_code)
        if not model_config:
            raise ValueError(f"Model not found: {model_code}")
        
        logger.info(f"Model config: {model_config}")
        
        # Get sensors for this model
        sensors = data_fetcher.get_sensors_for_model(model_code)
        if not sensors:
            raise ValueError(f"No sensors found for model: {model_code}")
        
        logger.info(f"Found {len(sensors)} sensors for model")
        
        # Get sensor codes
        sensor_codes = [s['code'] for s in sensors]
        
        # Fetch training data
        logger.info(f"Fetching training data for sensors: {sensor_codes}")
        df_data = data_fetcher.get_sensor_data_for_training(
            sensor_codes,
            limit=TRAINING_DATA_LIMIT
        )
        
        if df_data.empty:
            raise ValueError(f"No training data available for sensors: {sensor_codes}")
        
        logger.info(f"Training data shape: {df_data.shape}")
        
        # Remove DateTime column for training
        if 'DateTime' in df_data.columns:
            df_data = df_data.drop(columns=['DateTime'])
        
        # Train model
        result = train_model(
            model_code=model_code,
            model_type=model_config['type'],
            df_data=df_data,
            n_steps_in=model_config['n_steps_in'],
            n_steps_out=model_config['n_steps_out'],
            epochs=epochs,
            batch_size=batch_size
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error training model {model_code}: {e}")
        return {
            'status': 'failed',
            'model_code': model_code,
            'error': str(e)
        }


def train_all_models(epochs=None, batch_size=None):
    """
    Train all active models
    
    Args:
        epochs: Number of training epochs (optional)
        batch_size: Batch size (optional)
    
    Returns:
        List of training results
    """
    try:
        logger.info("Starting training for all active models")
        
        # Get data fetcher
        data_fetcher = get_data_fetcher()
        
        # Get all active models
        models = data_fetcher.get_active_models()
        
        if not models:
            logger.warning("No active models found")
            return []
        
        logger.info(f"Found {len(models)} active models")
        
        results = []
        for model in models:
            logger.info(f"\n{'='*60}")
            logger.info(f"Training model: {model['code']} ({model['name']})")
            logger.info(f"{'='*60}\n")
            
            result = train_single_model(
                model['code'],
                epochs=epochs,
                batch_size=batch_size
            )
            
            results.append(result)
            
            # Log result
            if result['status'] == 'success':
                logger.info(f"✓ Model {model['code']} trained successfully")
                logger.info(f"  Final loss: {result['final_loss']:.6f}")
                logger.info(f"  Final val loss: {result['final_val_loss']:.6f}")
            else:
                logger.error(f"✗ Model {model['code']} training failed: {result.get('error')}")
        
        # Summary
        logger.info(f"\n{'='*60}")
        logger.info("TRAINING SUMMARY")
        logger.info(f"{'='*60}")
        
        success_count = sum(1 for r in results if r['status'] == 'success')
        failed_count = len(results) - success_count
        
        logger.info(f"Total models: {len(results)}")
        logger.info(f"Successful: {success_count}")
        logger.info(f"Failed: {failed_count}")
        
        return results
        
    except Exception as e:
        logger.error(f"Error training all models: {e}")
        return []


def main():
    """Main training function"""
    parser = argparse.ArgumentParser(description='Train FFWS forecasting models')
    
    parser.add_argument(
        '--model',
        type=str,
        help='Specific model code to train (optional, trains all if not specified)'
    )
    
    parser.add_argument(
        '--epochs',
        type=int,
        help='Number of training epochs (optional, uses default from config)'
    )
    
    parser.add_argument(
        '--batch-size',
        type=int,
        help='Batch size for training (optional, uses default from config)'
    )
    
    args = parser.parse_args()
    
    logger.info("="*60)
    logger.info("FFWS Forecasting System - Model Training")
    logger.info("="*60)
    
    if args.model:
        # Train specific model
        logger.info(f"Training mode: Single model ({args.model})")
        result = train_single_model(args.model, args.epochs, args.batch_size)
        
        if result['status'] == 'success':
            logger.info("\n✓ Training completed successfully!")
        else:
            logger.error(f"\n✗ Training failed: {result.get('error')}")
    else:
        # Train all models
        logger.info("Training mode: All active models")
        results = train_all_models(args.epochs, args.batch_size)
        
        if results:
            logger.info("\n✓ Training process completed!")
        else:
            logger.error("\n✗ No models were trained")


if __name__ == '__main__':
    main()

