# FFWS Forecasting System - API Documentation

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, the API does not require authentication. For production, consider adding API key authentication.

---

## Endpoints

### 1. Health Check

Check if the service is running and database is connected.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "healthy",
  "database": "connected"
}
```

**Status Codes:**
- `200 OK` - Service is healthy
- `503 Service Unavailable` - Service or database is down

---

### 2. Home

Get service information.

**Endpoint:** `GET /`

**Response:**

```json
{
  "service": "FFWS Forecasting System",
  "version": "2.0",
  "status": "running"
}
```

---

### 3. Get All Models

Retrieve all active forecasting models.

**Endpoint:** `GET /api/models`

**Response:**

```json
{
  "status": "success",
  "count": 2,
  "models": [
    {
      "id": 1,
      "code": "dhompo_lstm",
      "name": "Dhompo LSTM Model",
      "type": "LSTM",
      "n_steps_in": 5,
      "n_steps_out": 5,
      "file_path": "storage/models/dhompo_lstm.h5"
    },
    {
      "id": 2,
      "code": "purwodadi_gru",
      "name": "Purwodadi GRU Model",
      "type": "GRU",
      "n_steps_in": 3,
      "n_steps_out": 3,
      "file_path": "storage/models/purwodadi_gru.h5"
    }
  ]
}
```

---

### 4. Get Specific Model

Get details of a specific model including its sensors.

**Endpoint:** `GET /api/models/{model_code}`

**Parameters:**
- `model_code` (path) - Model code (e.g., "dhompo_lstm")

**Example:** `GET /api/models/dhompo_lstm`

**Response:**

```json
{
  "status": "success",
  "model": {
    "id": 1,
    "code": "dhompo_lstm",
    "name": "Dhompo LSTM Model",
    "type": "LSTM",
    "n_steps_in": 5,
    "n_steps_out": 5,
    "file_path": "storage/models/dhompo_lstm.h5",
    "sensors": [
      {
        "id": 1,
        "code": "DHM001_WL",
        "name": "Dhompo Water Level",
        "parameter": "water_level",
        "unit": "m",
        "device_code": "DHM001",
        "forecasting_status": "running"
      },
      {
        "id": 2,
        "code": "DHM001_RF",
        "name": "Dhompo Rainfall",
        "parameter": "rainfall",
        "unit": "mm",
        "device_code": "DHM001",
        "forecasting_status": "running"
      }
    ]
  }
}
```

**Error Response (404):**

```json
{
  "status": "error",
  "error": "Model not found: invalid_code"
}
```

---

### 5. Get Sensors

Get sensors filtered by model.

**Endpoint:** `GET /api/sensors?model_code={model_code}`

**Query Parameters:**
- `model_code` (required) - Filter sensors by model code

**Example:** `GET /api/sensors?model_code=dhompo_lstm`

**Response:**

```json
{
  "status": "success",
  "count": 2,
  "sensors": [
    {
      "id": 1,
      "code": "DHM001_WL",
      "name": "Dhompo Water Level",
      "parameter": "water_level",
      "unit": "m",
      "device_code": "DHM001",
      "forecasting_status": "running"
    }
  ]
}
```

---

### 6. Predict All Models

Make predictions for all active models.

**Endpoint:** `POST /api/predict`

**Request Body:** (Optional, empty body is fine)

```json
{}
```

**Response:**

```json
{
  "status": "success",
  "count": 2,
  "results": [
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
  ]
}
```

---

### 7. Predict Specific Model

Make prediction for a specific model.

**Endpoint:** `POST /api/predict/{model_code}`

**Alternative:** `POST /api/predict` with body:

```json
{
  "model_code": "dhompo_lstm"
}
```

**Parameters:**
- `model_code` (path or body) - Model code to predict

**Example:** `POST /api/predict/dhompo_lstm`

**Response:**

```json
{
  "status": "success",
  "model_code": "dhompo_lstm",
  "sensors": ["DHM001_WL", "DHM001_RF", "CEND001_RF", "LAWG001_RF"],
  "prediction_run_at": "2025-11-03 01:30:00",
  "predicted_from": "2025-11-03 01:00:00",
  "predictions": {
    "DHM001_WL": {
      "2025-11-03 02:00:00": {"value": 2.45, "confidence": 0.85},
      "2025-11-03 03:00:00": {"value": 2.52, "confidence": 0.85},
      "2025-11-03 04:00:00": {"value": 2.58, "confidence": 0.85},
      "2025-11-03 05:00:00": {"value": 2.61, "confidence": 0.85},
      "2025-11-03 06:00:00": {"value": 2.63, "confidence": 0.85}
    },
    "DHM001_RF": {
      "2025-11-03 02:00:00": {"value": 5.2, "confidence": 0.85},
      "2025-11-03 03:00:00": {"value": 4.8, "confidence": 0.85},
      "2025-11-03 04:00:00": {"value": 3.5, "confidence": 0.85},
      "2025-11-03 05:00:00": {"value": 2.1, "confidence": 0.85},
      "2025-11-03 06:00:00": {"value": 0.8, "confidence": 0.85}
    }
  }
}
```

---

### 8. Predict Specific Sensor

Make prediction for a specific sensor (uses its assigned model).

**Endpoint:** `POST /api/sensors/{sensor_code}/predict`

**Alternative:** `POST /api/predict` with body:

```json
{
  "sensor_code": "DHM001_WL"
}
```

**Parameters:**
- `sensor_code` (path or body) - Sensor code to predict

**Example:** `POST /api/sensors/DHM001_WL/predict`

**Response:**

```json
{
  "status": "success",
  "sensor_code": "DHM001_WL",
  "model_code": "dhompo_lstm",
  "prediction_run_at": "2025-11-03 01:30:00",
  "predicted_from": "2025-11-03 01:00:00",
  "predictions": {
    "DHM001_WL": {
      "2025-11-03 02:00:00": {"value": 2.45, "confidence": 0.85},
      "2025-11-03 03:00:00": {"value": 2.52, "confidence": 0.85}
    }
  }
}
```

---

## Error Responses

### Common Error Format

```json
{
  "status": "error",
  "error": "Error message here"
}
```

### Status Codes

- `200 OK` - Request successful
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service or database unavailable

---

## Usage Examples

### cURL Examples

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Get All Models:**
```bash
curl http://localhost:8000/api/models
```

**Predict All Models:**
```bash
curl -X POST http://localhost:8000/api/predict
```

**Predict Specific Model:**
```bash
curl -X POST http://localhost:8000/api/predict/dhompo_lstm
```

**Predict Specific Sensor:**
```bash
curl -X POST http://localhost:8000/api/sensors/DHM001_WL/predict
```

### Python Examples

```python
import requests

# Base URL
base_url = "http://localhost:8000"

# Health check
response = requests.get(f"{base_url}/health")
print(response.json())

# Get all models
response = requests.get(f"{base_url}/api/models")
models = response.json()['models']
print(f"Found {len(models)} models")

# Make prediction
response = requests.post(f"{base_url}/api/predict/dhompo_lstm")
predictions = response.json()
print(predictions)
```

### JavaScript Examples

```javascript
// Using fetch API
const baseUrl = 'http://localhost:8000';

// Health check
fetch(`${baseUrl}/health`)
  .then(response => response.json())
  .then(data => console.log(data));

// Get all models
fetch(`${baseUrl}/api/models`)
  .then(response => response.json())
  .then(data => console.log(data.models));

// Make prediction
fetch(`${baseUrl}/api/predict/dhompo_lstm`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## Integration with Laravel Backend

### Reading Predictions in Laravel

```php
use App\Models\DataPrediction;

// Get latest predictions for a sensor
$predictions = DataPrediction::where('mas_sensor_code', 'DHM001_WL')
    ->where('prediction_run_at', '>=', now()->subHours(1))
    ->orderBy('prediction_for_ts', 'asc')
    ->get();

// Get predictions for specific time range
$predictions = DataPrediction::where('mas_sensor_code', 'DHM001_WL')
    ->whereBetween('prediction_for_ts', [now(), now()->addHours(5)])
    ->get();
```

### Triggering Predictions from Laravel

```php
use Illuminate\Support\Facades\Http;

// Trigger prediction for all models
$response = Http::post('http://localhost:8000/api/predict');

// Trigger prediction for specific model
$response = Http::post('http://localhost:8000/api/predict/dhompo_lstm');

// Check response
if ($response->successful()) {
    $data = $response->json();
    // Process predictions
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider:
- Implementing rate limiting middleware
- Using API keys for authentication
- Caching predictions for frequently accessed endpoints

---

## Monitoring

### Logs

Application logs are stored in `logs/` directory:
- `logs/training.log` - Training logs
- Flask logs output to console (can be redirected)

### Health Monitoring

Use the `/health` endpoint for monitoring:
```bash
# Check every 5 minutes
*/5 * * * * curl -f http://localhost:8000/health || echo "Service down"
```

---

## Support

For API issues or questions, please contact the development team.

