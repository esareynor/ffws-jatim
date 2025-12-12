# FFWS Forecasting System - Verification Guide

## 🔍 How to Verify the Forecasting System is Working

This guide helps you verify that the forecasting system is properly configured and can make predictions.

---

## Quick Verification (2 minutes)

### Run the Verification Script

```bash
cd E:\FFWS-V2\ffwsjatimv2\ffws-jatim\forecasting
python verify_prediction.py
```

This comprehensive script tests:
1. ✅ Database connection
2. ✅ Models configuration
3. ✅ Sensors configuration
4. ✅ Data availability
5. ✅ Trained models
6. ✅ Prediction service
7. ✅ API server
8. ✅ API prediction endpoint
9. ✅ Predictions saved in database

---

## Manual Verification Steps

### Step 1: Check Database Connection

```bash
python test_connection.py
```

**Expected Output:**
```
✓ Database connection successful!
✓ Found 2 active models
✓ Found 4 sensors for model 'dhompo_lstm'
✓ Found data for sensors
```

### Step 2: Check Models in Database

**SQL Query:**
```sql
SELECT code, name, type, n_steps_in, n_steps_out, is_active 
FROM mas_models 
WHERE is_active = 1;
```

**Expected Result:**
- At least 1 active model
- Model has `n_steps_in` and `n_steps_out` configured

**If no models found:**
```sql
-- Add a test model
INSERT INTO mas_models (name, code, type, n_steps_in, n_steps_out, is_active, created_at, updated_at)
VALUES ('Test LSTM Model', 'test_lstm', 'LSTM', 5, 5, 1, NOW(), NOW());
```

### Step 3: Check Sensors Linked to Models

**SQL Query:**
```sql
SELECT 
    s.code, 
    s.name, 
    s.parameter, 
    s.mas_model_code,
    s.forecasting_status
FROM mas_sensors s
WHERE s.mas_model_code IS NOT NULL
AND s.is_active = 1;
```

**Expected Result:**
- Sensors have `mas_model_code` set
- `forecasting_status` is 'running' or 'paused'

**If no sensors linked:**
```sql
-- Link sensors to a model
UPDATE mas_sensors 
SET mas_model_code = 'test_lstm', 
    forecasting_status = 'running'
WHERE code IN ('DHM001_WL', 'DHM001_RF')
LIMIT 2;
```

### Step 4: Check Data Availability

**SQL Query:**
```sql
SELECT 
    mas_sensor_code,
    COUNT(*) as record_count,
    MAX(received_at) as latest_data
FROM data_actuals
WHERE mas_sensor_code IN (
    SELECT code FROM mas_sensors WHERE mas_model_code IS NOT NULL
)
GROUP BY mas_sensor_code;
```

**Expected Result:**
- Each sensor has recent data (within last 24 hours)
- At least 5-10 records per sensor

**If no data:**
- Check if data collection is running
- Verify sensors are sending data
- Check `data_actuals` table has entries

### Step 5: Check Trained Models

**Check files exist:**
```bash
# Windows
dir storage\models\*.h5
dir storage\scalers\*.pkl

# Linux/Mac
ls storage/models/*.h5
ls storage/scalers/*.pkl
```

**Expected Result:**
- For each model code, you should have:
  - `{model_code}.h5` (trained model)
  - `{model_code}_x_scaler.pkl` (input scaler)
  - `{model_code}_y_scaler.pkl` (output scaler)

**If models not trained:**
```bash
# Train all models
python train.py

# Or train specific model
python train.py --model test_lstm
```

### Step 6: Test Prediction Service (Direct)

**Python Test:**
```python
from services.prediction_service import get_prediction_service

service = get_prediction_service()
result = service.predict_for_model('test_lstm')

print(result)
```

**Expected Output:**
```python
{
    'status': 'success',
    'model_code': 'test_lstm',
    'sensors': ['DHM001_WL', 'DHM001_RF'],
    'prediction_run_at': '2025-11-03 10:30:00',
    'predictions': {
        'DHM001_WL': {
            '2025-11-03 11:00:00': {'value': 2.45, 'confidence': 0.85},
            ...
        }
    }
}
```

### Step 7: Test API Server

**Start the server:**
```bash
python app.py
```

**Test health endpoint:**
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Step 8: Test API Prediction

**Get all models:**
```bash
curl http://localhost:8000/api/models
```

**Make prediction:**
```bash
curl -X POST http://localhost:8000/api/predict
```

**Expected Response:**
```json
{
  "status": "success",
  "count": 1,
  "results": [
    {
      "status": "success",
      "model_code": "test_lstm",
      "sensors": ["DHM001_WL", "DHM001_RF"],
      "predictions": { ... }
    }
  ]
}
```

### Step 9: Verify Predictions in Database

**SQL Query:**
```sql
SELECT 
    mas_sensor_code,
    mas_model_code,
    prediction_run_at,
    prediction_for_ts,
    predicted_value,
    confidence_score
FROM data_predictions
ORDER BY prediction_run_at DESC
LIMIT 10;
```

**Expected Result:**
- Recent predictions (within last hour if you just ran prediction)
- Multiple timesteps per sensor
- Confidence scores between 0 and 1

---

## Common Issues and Solutions

### Issue 1: No Models Found

**Symptom:**
```
⚠ No active models found in database
```

**Solution:**
```sql
INSERT INTO mas_models (name, code, type, n_steps_in, n_steps_out, is_active, created_at, updated_at)
VALUES 
('Dhompo LSTM', 'dhompo_lstm', 'LSTM', 5, 5, 1, NOW(), NOW()),
('Purwodadi GRU', 'purwodadi_gru', 'GRU', 3, 3, 1, NOW(), NOW());
```

### Issue 2: No Sensors Linked

**Symptom:**
```
⚠ No sensors found for model 'test_lstm'
```

**Solution:**
```sql
-- Check available sensors
SELECT code, name, parameter FROM mas_sensors WHERE is_active = 1;

-- Link sensors to model
UPDATE mas_sensors 
SET mas_model_code = 'test_lstm', 
    forecasting_status = 'running'
WHERE code IN ('DHM001_WL', 'DHM001_RF', 'CEND001_RF', 'LAWG001_RF');
```

### Issue 3: No Data Available

**Symptom:**
```
⚠ No data found for sensors
```

**Solution:**
1. Check if data collection is running
2. Verify sensors are active
3. Check `data_actuals` table:
```sql
SELECT COUNT(*), MAX(received_at) 
FROM data_actuals 
WHERE mas_sensor_code = 'DHM001_WL';
```

### Issue 4: Model Not Trained

**Symptom:**
```
⚠ Model 'test_lstm' is NOT trained
✗ Missing: test_lstm.h5
```

**Solution:**
```bash
# Train the model
python train.py --model test_lstm

# Or train all models
python train.py
```

### Issue 5: API Server Not Running

**Symptom:**
```
⚠ API server is not running
```

**Solution:**
```bash
# Start the server
python app.py

# Or with Gunicorn (production)
gunicorn --bind 0.0.0.0:8000 wsgi:gunicorn_app
```

### Issue 6: Database Connection Failed

**Symptom:**
```
✗ Database connection failed
```

**Solution:**
1. Check `.env` file has correct credentials
2. Verify MySQL is running
3. Test connection:
```bash
mysql -u root -p -h localhost ffws_v2
```

### Issue 7: Prediction Error

**Symptom:**
```
✗ Prediction failed: Model file not found
```

**Solution:**
1. Ensure model is trained
2. Check file paths in `storage/models/` and `storage/scalers/`
3. Verify model code matches database

---

## Verification Checklist

Use this checklist to ensure everything is working:

- [ ] Database connection successful
- [ ] At least 1 active model in `mas_models` table
- [ ] Sensors linked to models (`mas_model_code` set)
- [ ] Recent data in `data_actuals` for linked sensors
- [ ] Model files exist in `storage/models/`
- [ ] Scaler files exist in `storage/scalers/`
- [ ] Prediction service works (direct test)
- [ ] API server is running
- [ ] API health check returns "healthy"
- [ ] API prediction endpoint works
- [ ] Predictions saved to `data_predictions` table

---

## Integration with Laravel Backend

### Check Laravel Can Read Predictions

**PHP Code:**
```php
use App\Models\DataPrediction;

// Get latest predictions
$predictions = DataPrediction::where('mas_sensor_code', 'DHM001_WL')
    ->where('prediction_run_at', '>=', now()->subHour())
    ->orderBy('prediction_for_ts', 'asc')
    ->get();

foreach ($predictions as $pred) {
    echo "Prediction for {$pred->prediction_for_ts}: {$pred->predicted_value}\n";
}
```

### Trigger Prediction from Laravel

**PHP Code:**
```php
use Illuminate\Support\Facades\Http;

$response = Http::post('http://localhost:8000/api/predict/test_lstm');

if ($response->successful()) {
    $data = $response->json();
    // Process predictions
}
```

---

## Automated Verification

### Schedule Regular Checks

**Cron Job (Linux):**
```bash
# Run verification every hour
0 * * * * cd /path/to/forecasting && python verify_prediction.py >> logs/verification.log 2>&1
```

**Windows Task Scheduler:**
```powershell
# Create scheduled task
$action = New-ScheduledTaskAction -Execute "python" -Argument "verify_prediction.py" -WorkingDirectory "E:\FFWS-V2\ffwsjatimv2\ffws-jatim\forecasting"
$trigger = New-ScheduledTaskTrigger -Daily -At 9am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "FFWS Verification"
```

---

## Performance Metrics

### Expected Performance

| Metric | Expected Value |
|--------|---------------|
| Database connection | < 1 second |
| Model loading | < 5 seconds |
| Prediction (single model) | < 10 seconds |
| API response time | < 15 seconds |
| Predictions per hour | 1-24 (configurable) |

### Monitoring Queries

**Check prediction frequency:**
```sql
SELECT 
    DATE_FORMAT(prediction_run_at, '%Y-%m-%d %H:00:00') as hour,
    COUNT(*) as prediction_count
FROM data_predictions
WHERE prediction_run_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY hour
ORDER BY hour DESC;
```

**Check prediction accuracy (if you have actual vs predicted):**
```sql
SELECT 
    dp.mas_sensor_code,
    AVG(ABS(dp.predicted_value - da.value)) as avg_error
FROM data_predictions dp
JOIN data_actuals da ON 
    dp.mas_sensor_code = da.mas_sensor_code 
    AND dp.prediction_for_ts = da.received_at
WHERE dp.prediction_run_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY dp.mas_sensor_code;
```

---

## Next Steps After Verification

Once all tests pass:

1. **Set up automated predictions**
   - Schedule predictions to run every hour
   - Use cron job or Task Scheduler

2. **Monitor system health**
   - Check logs regularly
   - Monitor prediction accuracy
   - Track API response times

3. **Integrate with frontend**
   - Display predictions in dashboard
   - Show confidence scores
   - Visualize forecast trends

4. **Set up alerts**
   - Alert when predictions fail
   - Alert on high/low predicted values
   - Alert on low confidence scores

---

## Support

If verification fails:
1. Run `python verify_prediction.py` for detailed diagnostics
2. Check logs in `logs/` directory
3. Review [TROUBLESHOOTING.md](README.md#troubleshooting)
4. Contact development team

---

**Last Updated:** 2025-11-03

