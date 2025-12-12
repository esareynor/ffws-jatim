# FFWS Forecasting System v2.0

<p align="center">
    <a href="https://www.tensorflow.org/" target="_blank">
        <img src="https://www.tensorflow.org/images/tf_logo_social.png" width="200" alt="TensorFlow Logo">
    </a>
    &nbsp;&nbsp;&nbsp;
    <a href="https://flask.palletsprojects.com/" target="_blank">
        <img src="https://miro.medium.com/v2/resize:fit:438/0*AZd8eYeNvupEXtRK.png" width="200" alt="Flask Logo">
    </a>
</p>

## 📋 Overview

Dynamic flood forecasting system for FFWS (Flood Forecasting Warning System) Dinas PU Sumber Daya Air Jawa Timur. This system is designed to work seamlessly with the Laravel backend, automatically adapting to sensor and model configurations stored in the database.

### Key Features

- ✅ **Dynamic Model Loading**: Automatically loads model configurations from database
- ✅ **Multi-Sensor Support**: Works with any number of sensors configured in the database
- ✅ **Multiple Model Types**: Supports LSTM, GRU, and TCN architectures
- ✅ **Database Integration**: Reads from and writes to the same MySQL database as Laravel backend
- ✅ **RESTful API**: Flask-based API for predictions and model management
- ✅ **Automatic Scaling**: Uses StandardScaler for data normalization
- ✅ **Prediction Storage**: Automatically saves predictions to `data_predictions` table
- ✅ **Production Ready**: Includes Docker support and Gunicorn configuration

## 🏗️ Architecture

```
forecasting/
├── api/                    # Flask API routes
│   ├── __init__.py
│   └── routes.py          # API endpoints
├── config/                 # Configuration
│   ├── __init__.py
│   └── settings.py        # Settings from .env
├── database/              # Database layer
│   ├── __init__.py
│   ├── connection.py      # SQLAlchemy connection
│   ├── models.py          # Database models
│   └── queries.py         # Data fetching utilities
├── models/                # ML models
│   ├── __init__.py
│   ├── time_series_model.py  # Model wrapper
│   └── training.py        # Training utilities
├── services/              # Business logic
│   ├── __init__.py
│   └── prediction_service.py  # Prediction service
├── utils/                 # Utilities
│   ├── __init__.py
│   └── helpers.py         # Helper functions
├── storage/               # Model storage
│   ├── models/            # Trained models (.h5)
│   └── scalers/           # Fitted scalers (.pkl)
├── logs/                  # Application logs
├── app.py                 # Flask application
├── wsgi.py               # WSGI entry point
├── train.py              # Training script
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables
├── Dockerfile            # Docker configuration
└── docker-compose.yml    # Docker Compose
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- MySQL database (shared with Laravel backend)
- pip package manager

### Installation

#### 1. Clone the repository (if not already)

```bash
cd E:\FFWS-V2\ffwsjatimv2\ffws-jatim\forecasting
```

#### 2. Create virtual environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/MacOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 3. Install dependencies

**Windows/Linux:**
```bash
pip install -r requirements.txt
```

**MacOS:**
```bash
pip install -r requirements-macos.txt
```

#### 4. Configure environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Database Configuration (should match backend/.env)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=ffws_v2

# Flask Server Configuration
FLASK_HOST=127.0.0.1
FLASK_PORT=8000
FLASK_DEBUG=False

# Model Training Configuration
DEFAULT_EPOCHS=50
DEFAULT_BATCH_SIZE=64
TRAINING_DATA_LIMIT=720

# Prediction Configuration
DEFAULT_CONFIDENCE_SCORE=0.85

# Logging
LOG_LEVEL=INFO
```

**Note:** The system can also read from `../backend/.env` automatically if it exists.

## 📊 Database Setup

### Required Tables

The system expects the following tables in your MySQL database:

- `mas_models` - Model configurations
- `mas_devices` - Monitoring devices/stations
- `mas_sensors` - Sensor configurations
- `data_actuals` - Historical sensor readings
- `data_predictions` - Prediction results
- `mas_scalers` - Scaler configurations (optional)

### Sample Model Configuration

Insert model configurations into `mas_models` table:

```sql
INSERT INTO mas_models (name, code, type, n_steps_in, n_steps_out, is_active, created_at, updated_at)
VALUES 
('Dhompo LSTM Model', 'dhompo_lstm', 'LSTM', 5, 5, 1, NOW(), NOW()),
('Purwodadi GRU Model', 'purwodadi_gru', 'GRU', 3, 3, 1, NOW(), NOW());
```

### Sample Sensor Configuration

Link sensors to models:

```sql
UPDATE mas_sensors 
SET mas_model_code = 'dhompo_lstm', 
    forecasting_status = 'running'
WHERE code IN ('DHM001_WL', 'DHM001_RF');
```

## 🎓 Training Models

### Train All Active Models

```bash
python train.py
```

### Train Specific Model

```bash
python train.py --model dhompo_lstm
```

### Custom Training Parameters

```bash
python train.py --model dhompo_lstm --epochs 100 --batch-size 32
```

### Training Process

1. Fetches model configuration from database
2. Retrieves sensors associated with the model
3. Loads historical data from `data_actuals`
4. Preprocesses and scales data
5. Builds model architecture (LSTM/GRU/TCN)
6. Trains model with validation split
7. Saves trained model to `storage/models/`
8. Saves fitted scalers to `storage/scalers/`

## 🔮 Making Predictions

### Start Flask Server

**Development:**
```bash
python app.py
```

**Production (with Gunicorn):**
```bash
gunicorn --bind 0.0.0.0:8000 --workers 4 wsgi:gunicorn_app
```

### API Endpoints

#### Health Check
```bash
GET http://localhost:8000/health
```

#### Get All Models
```bash
GET http://localhost:8000/api/models
```

#### Get Specific Model
```bash
GET http://localhost:8000/api/models/dhompo_lstm
```

#### Predict All Active Models
```bash
POST http://localhost:8000/api/predict
```

#### Predict Specific Model
```bash
POST http://localhost:8000/api/predict/dhompo_lstm
```

#### Predict Specific Sensor
```bash
POST http://localhost:8000/api/sensors/DHM001_WL/predict
```

### Example Response

```json
{
  "status": "success",
  "model_code": "dhompo_lstm",
  "sensors": ["DHM001_WL", "DHM001_RF"],
  "prediction_run_at": "2025-11-03 01:30:00",
  "predicted_from": "2025-11-03 01:00:00",
  "predictions": {
    "DHM001_WL": {
      "2025-11-03 02:00:00": {
        "value": 2.45,
        "confidence": 0.85
      },
      "2025-11-03 03:00:00": {
        "value": 2.52,
        "confidence": 0.85
      }
    }
  }
}
```

## 🐳 Docker Deployment

### Build and Run

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f forecasting
```

### Stop Service

```bash
docker-compose down
```

## 🔧 Configuration

### Model Types Supported

- **LSTM** (Long Short-Term Memory)
- **GRU** (Gated Recurrent Unit)
- **TCN** (Temporal Convolutional Network)

### Input/Output Configuration

Configure in database (`mas_models` table):
- `n_steps_in`: Number of historical timesteps to use (e.g., 5 = last 5 hours)
- `n_steps_out`: Number of future timesteps to predict (e.g., 5 = next 5 hours)

### Sensor Configuration

The system automatically determines the number of features based on sensors assigned to each model. For example:
- Model with 4 sensors → 4 features
- Model with 3 sensors → 3 features

## 📈 How It Works

### Dynamic Adaptation

1. **Model Loading**: Reads model configuration from `mas_models` table
2. **Sensor Discovery**: Finds all sensors linked to the model via `mas_model_code`
3. **Data Fetching**: Queries `data_actuals` for the required sensors
4. **Feature Extraction**: Automatically determines number of features from sensor count
5. **Preprocessing**: Scales data using saved scalers
6. **Prediction**: Generates forecasts using trained model
7. **Storage**: Saves results to `data_predictions` table

### Differences from Hardcoded Example

| Aspect | Old System (Example) | New System (Dynamic) |
|--------|---------------------|---------------------|
| Model Config | Hardcoded in Python | Stored in database |
| Sensor List | Fixed in code | Dynamic from database |
| Feature Count | Fixed (3 or 4) | Automatic detection |
| Training Data | Hardcoded SQL | Dynamic query builder |
| Model Selection | Manual dictionary | Database-driven |
| Scalability | Add code for new models | Just add to database |

## 🔍 Troubleshooting

### Database Connection Error

```
Error: Can't connect to MySQL server
```

**Solution:** Check database credentials in `.env` file and ensure MySQL is running.

### Model Not Found

```
Error: Model file not found
```

**Solution:** Train the model first using `python train.py --model <model_code>`

### Import Error: keras_tcn

```
ImportError: No module named 'keras_tcn'
```

**Solution:** TCN models require keras-tcn. Install with:
```bash
pip install keras-tcn
```

### No Data Available

```
Warning: No data found for sensors
```

**Solution:** Ensure `data_actuals` table has recent data for the configured sensors.

## 📝 API Documentation

### Full API Reference

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API documentation with examples.

## 🤝 Integration with Laravel Backend

### Data Flow

```
Laravel Backend (PHP)
    ↓
MySQL Database (ffws_v2)
    ↓
Forecasting System (Python)
    ↓
Predictions saved to database
    ↓
Laravel Backend reads predictions
    ↓
Frontend displays forecasts
```

### Shared Database Tables

- `mas_models` - Model configurations
- `mas_sensors` - Sensor configurations
- `data_actuals` - Input data
- `data_predictions` - Output predictions

## 📊 Performance Considerations

- **Model Caching**: Models are cached in memory after first load
- **Connection Pooling**: Database connections are pooled for efficiency
- **Batch Predictions**: Multiple sensors predicted in single API call
- **Async Support**: Can be extended with Celery for background tasks

## 🔐 Security

- Environment variables for sensitive data
- Database credentials not hardcoded
- Input validation on API endpoints
- SQL injection prevention via parameterized queries

## 📄 License

This project is part of FFWS Dinas PU Sumber Daya Air Jawa Timur.

## 👥 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for Flood Forecasting & Warning System**

