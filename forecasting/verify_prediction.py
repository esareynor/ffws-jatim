"""
Comprehensive verification script for FFWS Forecasting System
Tests the complete prediction workflow from database to API
"""
import sys
import requests
from datetime import datetime
from database.connection import get_db, test_connection
from database.queries import get_data_fetcher
from services.prediction_service import get_prediction_service
from utils.helpers import setup_logging

# Setup logging
setup_logging(log_level='INFO')


def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)


def print_success(message):
    """Print success message"""
    print(f"✓ {message}")


def print_warning(message):
    """Print warning message"""
    print(f"⚠ {message}")


def print_error(message):
    """Print error message"""
    print(f"✗ {message}")


def test_database_connection():
    """Test 1: Database Connection"""
    print_header("TEST 1: Database Connection")
    
    try:
        db = get_db()
        result = test_connection()
        
        if result:
            print_success("Database connection successful")
            print(f"  Database: Connected to MySQL")
            return True
        else:
            print_error("Database connection failed")
            return False
    except Exception as e:
        print_error(f"Database connection error: {e}")
        return False


def test_models_configuration():
    """Test 2: Models Configuration"""
    print_header("TEST 2: Models Configuration")
    
    try:
        data_fetcher = get_data_fetcher()
        models = data_fetcher.get_active_models()
        
        if not models:
            print_warning("No active models found in database")
            print("  Action needed: Add models to mas_models table")
            print("  Example SQL:")
            print("    INSERT INTO mas_models (name, code, type, n_steps_in, n_steps_out, is_active)")
            print("    VALUES ('Test LSTM', 'test_lstm', 'LSTM', 5, 5, 1);")
            return False
        
        print_success(f"Found {len(models)} active models:")
        for model in models:
            print(f"  • {model['code']}")
            print(f"    Name: {model['name']}")
            print(f"    Type: {model['type']}")
            print(f"    Input steps: {model['n_steps_in']}, Output steps: {model['n_steps_out']}")
        
        return True
    except Exception as e:
        print_error(f"Error fetching models: {e}")
        return False


def test_sensors_configuration():
    """Test 3: Sensors Configuration"""
    print_header("TEST 3: Sensors Configuration")
    
    try:
        data_fetcher = get_data_fetcher()
        models = data_fetcher.get_active_models()
        
        if not models:
            print_warning("No models available to test sensors")
            return False
        
        all_sensors_found = True
        total_sensors = 0
        
        for model in models:
            sensors = data_fetcher.get_sensors_for_model(model['code'])
            
            if sensors:
                print_success(f"Model '{model['code']}' has {len(sensors)} sensors:")
                for sensor in sensors:
                    print(f"  • {sensor['code']}: {sensor['name']} ({sensor['parameter']})")
                    print(f"    Status: {sensor['forecasting_status']}")
                total_sensors += len(sensors)
            else:
                print_warning(f"Model '{model['code']}' has no sensors linked")
                print("  Action needed: Link sensors to this model")
                print(f"    UPDATE mas_sensors SET mas_model_code = '{model['code']}' WHERE code IN ('SENSOR1', 'SENSOR2');")
                all_sensors_found = False
        
        if total_sensors == 0:
            return False
        
        return all_sensors_found
    except Exception as e:
        print_error(f"Error fetching sensors: {e}")
        return False


def test_data_availability():
    """Test 4: Data Availability"""
    print_header("TEST 4: Data Availability")
    
    try:
        data_fetcher = get_data_fetcher()
        models = data_fetcher.get_active_models()
        
        if not models:
            print_warning("No models available to test data")
            return False
        
        all_data_found = True
        
        for model in models:
            sensors = data_fetcher.get_sensors_for_model(model['code'])
            
            if not sensors:
                continue
            
            sensor_codes = [s['code'] for s in sensors]
            data = data_fetcher.get_latest_sensor_data(sensor_codes, n_records=model['n_steps_in'])
            
            if not data.empty:
                print_success(f"Model '{model['code']}' has sufficient data:")
                print(f"  • Data shape: {data.shape}")
                print(f"  • Sensors: {[col for col in data.columns if col != 'DateTime']}")
                print(f"  • Date range: {data['DateTime'].min()} to {data['DateTime'].max()}")
                print(f"  • Records needed: {model['n_steps_in']}, Available: {len(data)}")
            else:
                print_warning(f"Model '{model['code']}' has no data available")
                print(f"  Sensors checked: {sensor_codes}")
                print("  Action needed: Ensure data_actuals table has recent data for these sensors")
                all_data_found = False
        
        return all_data_found
    except Exception as e:
        print_error(f"Error fetching data: {e}")
        return False


def test_trained_models():
    """Test 5: Trained Models Availability"""
    print_header("TEST 5: Trained Models Availability")
    
    try:
        import os
        from config.settings import MODELS_DIR, SCALERS_DIR
        
        data_fetcher = get_data_fetcher()
        models = data_fetcher.get_active_models()
        
        if not models:
            print_warning("No models to check for training")
            return False
        
        all_trained = True
        
        for model in models:
            model_file = MODELS_DIR / f"{model['code']}.h5"
            x_scaler_file = SCALERS_DIR / f"{model['code']}_x_scaler.pkl"
            y_scaler_file = SCALERS_DIR / f"{model['code']}_y_scaler.pkl"
            
            model_exists = model_file.exists()
            x_scaler_exists = x_scaler_file.exists()
            y_scaler_exists = y_scaler_file.exists()
            
            if model_exists and x_scaler_exists and y_scaler_exists:
                print_success(f"Model '{model['code']}' is trained:")
                print(f"  • Model file: {model_file.name}")
                print(f"  • X scaler: {x_scaler_file.name}")
                print(f"  • Y scaler: {y_scaler_file.name}")
            else:
                print_warning(f"Model '{model['code']}' is NOT trained:")
                if not model_exists:
                    print(f"  ✗ Missing: {model_file.name}")
                if not x_scaler_exists:
                    print(f"  ✗ Missing: {x_scaler_file.name}")
                if not y_scaler_exists:
                    print(f"  ✗ Missing: {y_scaler_file.name}")
                print(f"  Action needed: Train the model with:")
                print(f"    python train.py --model {model['code']}")
                all_trained = False
        
        return all_trained
    except Exception as e:
        print_error(f"Error checking trained models: {e}")
        return False


def test_prediction_service():
    """Test 6: Prediction Service"""
    print_header("TEST 6: Prediction Service (Direct)")
    
    try:
        data_fetcher = get_data_fetcher()
        prediction_service = get_prediction_service()
        
        models = data_fetcher.get_active_models()
        
        if not models:
            print_warning("No models available to test predictions")
            return False
        
        # Test prediction for first model
        model = models[0]
        print(f"Testing prediction for model: {model['code']}")
        
        result = prediction_service.predict_for_model(model['code'])
        
        if result.get('status') == 'success':
            print_success("Prediction successful!")
            print(f"  • Model: {result['model_code']}")
            print(f"  • Sensors: {', '.join(result['sensors'])}")
            print(f"  • Prediction run at: {result['prediction_run_at']}")
            print(f"  • Predicted from: {result['predicted_from']}")
            
            # Show sample predictions
            if result.get('predictions'):
                first_sensor = result['sensors'][0]
                sensor_predictions = result['predictions'].get(first_sensor, {})
                print(f"  • Sample predictions for {first_sensor}:")
                for timestamp, pred in list(sensor_predictions.items())[:3]:
                    print(f"    - {timestamp}: {pred['value']:.4f} (confidence: {pred['confidence']})")
            
            return True
        else:
            print_error(f"Prediction failed: {result.get('error', 'Unknown error')}")
            return False
            
    except Exception as e:
        print_error(f"Error in prediction service: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_api_server():
    """Test 7: API Server"""
    print_header("TEST 7: API Server")
    
    try:
        from config.settings import FLASK_HOST, FLASK_PORT
        base_url = f"http://{FLASK_HOST}:{FLASK_PORT}"
        
        print(f"Testing API at: {base_url}")
        
        # Test health endpoint
        try:
            response = requests.get(f"{base_url}/health", timeout=5)
            
            if response.status_code == 200:
                print_success("API server is running")
                data = response.json()
                print(f"  • Status: {data.get('status')}")
                print(f"  • Database: {data.get('database')}")
                return True
            else:
                print_warning(f"API server responded with status {response.status_code}")
                return False
                
        except requests.exceptions.ConnectionError:
            print_warning("API server is not running")
            print("  Action needed: Start the API server with:")
            print("    python app.py")
            return False
            
    except Exception as e:
        print_error(f"Error testing API: {e}")
        return False


def test_api_prediction():
    """Test 8: API Prediction Endpoint"""
    print_header("TEST 8: API Prediction Endpoint")
    
    try:
        from config.settings import FLASK_HOST, FLASK_PORT
        base_url = f"http://{FLASK_HOST}:{FLASK_PORT}"
        
        # Check if server is running first
        try:
            health_response = requests.get(f"{base_url}/health", timeout=5)
            if health_response.status_code != 200:
                print_warning("API server not healthy, skipping prediction test")
                return False
        except:
            print_warning("API server not running, skipping prediction test")
            return False
        
        # Test prediction endpoint
        print("Testing prediction endpoint...")
        response = requests.post(f"{base_url}/api/predict", timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('status') == 'success':
                print_success("API prediction successful!")
                results = data.get('results', [])
                print(f"  • Predictions made for {len(results)} models")
                
                for result in results:
                    if result.get('status') == 'success':
                        print(f"  • Model '{result['model_code']}': Success")
                    else:
                        print(f"  • Model '{result['model_code']}': {result.get('status')}")
                
                return True
            else:
                print_warning(f"API prediction returned: {data.get('status')}")
                return False
        else:
            print_error(f"API prediction failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Error testing API prediction: {e}")
        return False


def test_database_predictions():
    """Test 9: Check Predictions in Database"""
    print_header("TEST 9: Predictions Saved in Database")
    
    try:
        db = get_db()
        
        # Check if predictions exist
        query = """
        SELECT 
            COUNT(*) as total,
            MAX(prediction_run_at) as latest_run,
            COUNT(DISTINCT mas_sensor_code) as sensor_count,
            COUNT(DISTINCT mas_model_code) as model_count
        FROM data_predictions
        WHERE prediction_run_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
        """
        
        result, columns = db.execute_query(query)
        
        if result:
            row = result[0]
            total = row[0]
            latest_run = row[1]
            sensor_count = row[2]
            model_count = row[3]
            
            if total > 0:
                print_success(f"Found {total} predictions in database")
                print(f"  • Latest prediction run: {latest_run}")
                print(f"  • Sensors with predictions: {sensor_count}")
                print(f"  • Models used: {model_count}")
                
                # Get sample predictions
                sample_query = """
                SELECT mas_sensor_code, prediction_for_ts, predicted_value, confidence_score
                FROM data_predictions
                ORDER BY prediction_run_at DESC
                LIMIT 5
                """
                
                samples, _ = db.execute_query(sample_query)
                print("  • Sample predictions:")
                for sample in samples:
                    print(f"    - {sample[0]}: {sample[2]:.4f} at {sample[1]} (confidence: {sample[3]})")
                
                return True
            else:
                print_warning("No recent predictions found in database")
                print("  Action needed: Run a prediction to populate the database")
                return False
        else:
            print_warning("Could not query predictions table")
            return False
            
    except Exception as e:
        print_error(f"Error checking database predictions: {e}")
        return False


def main():
    """Run all verification tests"""
    print("\n" + "="*70)
    print("  FFWS FORECASTING SYSTEM - COMPREHENSIVE VERIFICATION")
    print("="*70)
    print(f"  Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70)
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Models Configuration", test_models_configuration),
        ("Sensors Configuration", test_sensors_configuration),
        ("Data Availability", test_data_availability),
        ("Trained Models", test_trained_models),
        ("Prediction Service", test_prediction_service),
        ("API Server", test_api_server),
        ("API Prediction", test_api_prediction),
        ("Database Predictions", test_database_predictions),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print_error(f"Test crashed: {e}")
            results.append((test_name, False))
    
    # Final Summary
    print_header("VERIFICATION SUMMARY")
    
    for test_name, result in results:
        if result:
            print_success(f"{test_name}")
        else:
            print_error(f"{test_name}")
    
    total = len(results)
    passed = sum(1 for _, result in results if result)
    failed = total - passed
    
    print("\n" + "-"*70)
    print(f"  Total Tests: {total}")
    print(f"  Passed: {passed}")
    print(f"  Failed: {failed}")
    print(f"  Success Rate: {(passed/total*100):.1f}%")
    print("-"*70)
    
    if passed == total:
        print("\n✓ ALL TESTS PASSED! Forecasting system is fully operational.")
        print("\nNext steps:")
        print("  • System is ready for production use")
        print("  • Monitor predictions regularly")
        print("  • Set up automated prediction scheduling")
        return 0
    elif passed >= total * 0.7:
        print("\n⚠ MOST TESTS PASSED. System is partially operational.")
        print("\nRecommended actions:")
        print("  • Review failed tests above")
        print("  • Fix critical issues (database, models, data)")
        print("  • Re-run verification after fixes")
        return 1
    else:
        print("\n✗ MULTIPLE TESTS FAILED. System needs configuration.")
        print("\nRequired actions:")
        print("  • Check database connection and credentials")
        print("  • Add models to mas_models table")
        print("  • Link sensors to models")
        print("  • Ensure data_actuals has recent data")
        print("  • Train models: python train.py")
        print("  • Start API: python app.py")
        return 2


if __name__ == '__main__':
    sys.exit(main())

