"""
Test database connection and basic functionality
"""
import sys
from database.connection import get_db, test_connection
from database.queries import get_data_fetcher
from utils.helpers import setup_logging

# Setup logging
setup_logging(log_level='INFO')

def test_db_connection():
    """Test database connection"""
    print("="*60)
    print("Testing Database Connection")
    print("="*60)
    
    try:
        db = get_db()
        result = test_connection()
        
        if result:
            print("✓ Database connection successful!")
            return True
        else:
            print("✗ Database connection failed!")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_fetch_models():
    """Test fetching models from database"""
    print("\n" + "="*60)
    print("Testing Model Fetching")
    print("="*60)
    
    try:
        data_fetcher = get_data_fetcher()
        models = data_fetcher.get_active_models()
        
        if models:
            print(f"✓ Found {len(models)} active models:")
            for model in models:
                print(f"  - {model['code']}: {model['name']} ({model['type']})")
                print(f"    Steps: {model['n_steps_in']} in, {model['n_steps_out']} out")
            return True
        else:
            print("⚠ No active models found in database")
            print("  Please add models to mas_models table")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_fetch_sensors():
    """Test fetching sensors"""
    print("\n" + "="*60)
    print("Testing Sensor Fetching")
    print("="*60)
    
    try:
        data_fetcher = get_data_fetcher()
        models = data_fetcher.get_active_models()
        
        if not models:
            print("⚠ No models to test sensors")
            return False
        
        model_code = models[0]['code']
        sensors = data_fetcher.get_sensors_for_model(model_code)
        
        if sensors:
            print(f"✓ Found {len(sensors)} sensors for model '{model_code}':")
            for sensor in sensors:
                print(f"  - {sensor['code']}: {sensor['name']} ({sensor['parameter']})")
            return True
        else:
            print(f"⚠ No sensors found for model '{model_code}'")
            print("  Please link sensors to models in mas_sensors table")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_fetch_data():
    """Test fetching sensor data"""
    print("\n" + "="*60)
    print("Testing Data Fetching")
    print("="*60)
    
    try:
        data_fetcher = get_data_fetcher()
        models = data_fetcher.get_active_models()
        
        if not models:
            print("⚠ No models to test data fetching")
            return False
        
        model_code = models[0]['code']
        sensors = data_fetcher.get_sensors_for_model(model_code)
        
        if not sensors:
            print("⚠ No sensors to test data fetching")
            return False
        
        sensor_codes = [s['code'] for s in sensors]
        data = data_fetcher.get_latest_sensor_data(sensor_codes, n_records=5)
        
        if not data.empty:
            print(f"✓ Found data for sensors:")
            print(f"  Shape: {data.shape}")
            print(f"  Columns: {list(data.columns)}")
            print(f"  Date range: {data['DateTime'].min()} to {data['DateTime'].max()}")
            return True
        else:
            print(f"⚠ No data found for sensors: {sensor_codes}")
            print("  Please ensure data_actuals table has recent data")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("FFWS Forecasting System - Connection Test")
    print("="*60 + "\n")
    
    results = []
    
    # Test database connection
    results.append(("Database Connection", test_db_connection()))
    
    # Test model fetching
    results.append(("Model Fetching", test_fetch_models()))
    
    # Test sensor fetching
    results.append(("Sensor Fetching", test_fetch_sensors()))
    
    # Test data fetching
    results.append(("Data Fetching", test_fetch_data()))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {test_name}")
    
    total = len(results)
    passed = sum(1 for _, result in results if result)
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✓ All tests passed! System is ready.")
        return 0
    else:
        print("\n⚠ Some tests failed. Please check configuration.")
        return 1


if __name__ == '__main__':
    sys.exit(main())

