# FFWS Forecasting System - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

```bash
cd E:\FFWS-V2\ffwsjatimv2\ffws-jatim\forecasting

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

### Step 2: Configure Database (1 minute)

Edit `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=ffws_v2
```

### Step 3: Setup Database Models (1 minute)

Run this SQL in your MySQL database:

```sql
-- Add sample model
INSERT INTO mas_models (name, code, type, n_steps_in, n_steps_out, is_active, created_at, updated_at)
VALUES ('Test LSTM Model', 'test_lstm', 'LSTM', 5, 5, 1, NOW(), NOW());

-- Link sensors to model
UPDATE mas_sensors 
SET mas_model_code = 'test_lstm', 
    forecasting_status = 'running'
WHERE code IN ('DHM001_WL', 'DHM001_RF')
LIMIT 2;
```

### Step 4: Train Model (Varies)

```bash
python train.py --model test_lstm --epochs 10
```

### Step 5: Start API Server (< 1 minute)

```bash
python app.py
```

Visit: http://localhost:8000/health

## ✅ Verify Installation

```bash
# Check health
curl http://localhost:8000/health

# Get models
curl http://localhost:8000/api/models

# Make prediction
curl -X POST http://localhost:8000/api/predict
```

## 🎯 Common Tasks

### Train a Model

```bash
python train.py --model dhompo_lstm
```

### Make Predictions

```bash
curl -X POST http://localhost:8000/api/predict/dhompo_lstm
```

### View Logs

```bash
# Training logs
cat logs/training.log

# API logs (console output)
python app.py
```

## 🐛 Troubleshooting

### Database Connection Failed

```bash
# Test connection
python -c "from database.connection import test_connection; print(test_connection())"
```

### Model Not Found

```bash
# Check if model file exists
ls storage/models/

# Retrain if needed
python train.py --model your_model_code
```

### No Data Available

```sql
-- Check if data exists
SELECT COUNT(*) FROM data_actuals WHERE mas_sensor_code = 'DHM001_WL';

-- Check date range
SELECT MIN(received_at), MAX(received_at) FROM data_actuals;
```

## 📚 Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. Configure production deployment with Docker

## 🆘 Need Help?

- Check logs in `logs/` directory
- Verify database configuration
- Ensure models are trained before prediction
- Contact development team for support

