<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasSensor;
use App\Models\MasModel;
use App\Models\DataPrediction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ForecastingControlController extends Controller
{
    /**
     * Get forecasting service base URL from config
     */
    private function getForecastingServiceUrl()
    {
        return config('services.forecasting.url', 'http://localhost:8000');
    }

    /**
     * Check if forecasting service is running
     */
    public function checkService()
    {
        try {
            $url = $this->getForecastingServiceUrl();
            $response = Http::timeout(5)->get("{$url}/health");

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'message' => 'Forecasting service is running',
                    'data' => [
                        'status' => $data['status'] ?? 'unknown',
                        'database' => $data['database'] ?? 'unknown',
                        'url' => $url
                    ]
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Forecasting service is not responding properly',
                'data' => ['url' => $url]
            ], 503);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot connect to forecasting service',
                'error' => $e->getMessage(),
                'data' => ['url' => $this->getForecastingServiceUrl()]
            ], 503);
        }
    }

    /**
     * Get forecasting status for a sensor
     */
    public function getSensorStatus($sensorCode)
    {
        try {
            $sensor = MasSensor::where('code', $sensorCode)->first();

            if (!$sensor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sensor not found'
                ], 404);
            }

            // Get latest predictions
            $latestPrediction = DataPrediction::where('mas_sensor_code', $sensorCode)
                ->orderBy('prediction_run_at', 'desc')
                ->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'sensor_code' => $sensor->code,
                    'sensor_name' => $sensor->name,
                    'forecasting_status' => $sensor->forecasting_status,
                    'model_code' => $sensor->mas_model_code,
                    'is_active' => $sensor->is_active,
                    'last_prediction' => $latestPrediction ? [
                        'run_at' => $latestPrediction->prediction_run_at,
                        'for_ts' => $latestPrediction->prediction_for_ts,
                        'value' => $latestPrediction->predicted_value
                    ] : null
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching sensor status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Start forecasting for a sensor
     */
    public function startSensor(Request $request, $sensorCode)
    {
        try {
            DB::beginTransaction();

            $sensor = MasSensor::where('code', $sensorCode)->first();

            if (!$sensor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sensor not found'
                ], 404);
            }

            // Check if sensor has a model assigned
            if (!$sensor->mas_model_code) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sensor does not have a forecasting model assigned'
                ], 400);
            }

            // Update sensor status to running
            $sensor->forecasting_status = 'running';
            $sensor->is_active = true;
            $sensor->save();

            DB::commit();

            // Log the action
            Log::info("Forecasting started for sensor: {$sensorCode}");

            return response()->json([
                'success' => true,
                'message' => "Forecasting started for sensor {$sensor->name}",
                'data' => [
                    'sensor_code' => $sensor->code,
                    'sensor_name' => $sensor->name,
                    'forecasting_status' => $sensor->forecasting_status,
                    'model_code' => $sensor->mas_model_code
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error starting forecasting for sensor {$sensorCode}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error starting forecasting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Stop forecasting for a sensor
     */
    public function stopSensor(Request $request, $sensorCode)
    {
        try {
            DB::beginTransaction();

            $sensor = MasSensor::where('code', $sensorCode)->first();

            if (!$sensor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sensor not found'
                ], 404);
            }

            // Update sensor status to stopped
            $sensor->forecasting_status = 'stopped';
            $sensor->save();

            DB::commit();

            // Log the action
            Log::info("Forecasting stopped for sensor: {$sensorCode}");

            return response()->json([
                'success' => true,
                'message' => "Forecasting stopped for sensor {$sensor->name}",
                'data' => [
                    'sensor_code' => $sensor->code,
                    'sensor_name' => $sensor->name,
                    'forecasting_status' => $sensor->forecasting_status
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error stopping forecasting for sensor {$sensorCode}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error stopping forecasting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Pause forecasting for a sensor
     */
    public function pauseSensor(Request $request, $sensorCode)
    {
        try {
            DB::beginTransaction();

            $sensor = MasSensor::where('code', $sensorCode)->first();

            if (!$sensor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sensor not found'
                ], 404);
            }

            // Update sensor status to paused
            $sensor->forecasting_status = 'paused';
            $sensor->save();

            DB::commit();

            // Log the action
            Log::info("Forecasting paused for sensor: {$sensorCode}");

            return response()->json([
                'success' => true,
                'message' => "Forecasting paused for sensor {$sensor->name}",
                'data' => [
                    'sensor_code' => $sensor->code,
                    'sensor_name' => $sensor->name,
                    'forecasting_status' => $sensor->forecasting_status
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error pausing forecasting for sensor {$sensorCode}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error pausing forecasting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Trigger prediction for a specific sensor
     */
    public function triggerPrediction(Request $request, $sensorCode)
    {
        try {
            $sensor = MasSensor::where('code', $sensorCode)->first();

            if (!$sensor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sensor not found'
                ], 404);
            }

            // Check if forecasting is running
            if ($sensor->forecasting_status !== 'running') {
                return response()->json([
                    'success' => false,
                    'message' => 'Forecasting is not running for this sensor. Please start it first.'
                ], 400);
            }

            // Call forecasting service
            $url = $this->getForecastingServiceUrl();
            $response = Http::timeout(60)->post("{$url}/api/sensors/{$sensorCode}/predict");

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'message' => 'Prediction triggered successfully',
                    'data' => $data
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Forecasting service returned an error',
                'error' => $response->json()
            ], $response->status());

        } catch (\Exception $e) {
            Log::error("Error triggering prediction for sensor {$sensorCode}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error triggering prediction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Trigger prediction for a model (all sensors)
     */
    public function triggerModelPrediction(Request $request, $modelCode)
    {
        try {
            $model = MasModel::where('code', $modelCode)->first();

            if (!$model) {
                return response()->json([
                    'success' => false,
                    'message' => 'Model not found'
                ], 404);
            }

            // Call forecasting service
            $url = $this->getForecastingServiceUrl();
            $response = Http::timeout(120)->post("{$url}/api/predict/{$modelCode}");

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'message' => 'Model prediction triggered successfully',
                    'data' => $data
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Forecasting service returned an error',
                'error' => $response->json()
            ], $response->status());

        } catch (\Exception $e) {
            Log::error("Error triggering prediction for model {$modelCode}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error triggering prediction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Trigger prediction for all active models
     */
    public function triggerAllPredictions(Request $request)
    {
        try {
            // Call forecasting service
            $url = $this->getForecastingServiceUrl();
            $response = Http::timeout(180)->post("{$url}/api/predict");

            if ($response->successful()) {
                $data = $response->json();

                return response()->json([
                    'success' => true,
                    'message' => 'All predictions triggered successfully',
                    'data' => $data
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Forecasting service returned an error',
                'error' => $response->json()
            ], $response->status());

        } catch (\Exception $e) {
            Log::error("Error triggering all predictions: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error triggering predictions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get forecasting statistics
     */
    public function getStatistics()
    {
        try {
            // Get sensor statistics
            $totalSensors = MasSensor::count();
            $runningSensors = MasSensor::where('forecasting_status', 'running')->count();
            $pausedSensors = MasSensor::where('forecasting_status', 'paused')->count();
            $stoppedSensors = MasSensor::where('forecasting_status', 'stopped')->count();

            // Get prediction statistics
            $totalPredictions = DataPrediction::count();
            $todayPredictions = DataPrediction::whereDate('prediction_run_at', today())->count();
            $lastPredictionTime = DataPrediction::max('prediction_run_at');

            // Get model statistics
            $activeModels = MasModel::where('is_active', true)->count();
            $sensorsWithModels = MasSensor::whereNotNull('mas_model_code')->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'sensors' => [
                        'total' => $totalSensors,
                        'running' => $runningSensors,
                        'paused' => $pausedSensors,
                        'stopped' => $stoppedSensors,
                        'with_models' => $sensorsWithModels
                    ],
                    'predictions' => [
                        'total' => $totalPredictions,
                        'today' => $todayPredictions,
                        'last_run' => $lastPredictionTime
                    ],
                    'models' => [
                        'active' => $activeModels
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Batch control - Start/Stop/Pause multiple sensors
     */
    public function batchControl(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sensor_codes' => 'required|array',
            'sensor_codes.*' => 'required|string|exists:mas_sensors,code',
            'action' => 'required|in:start,stop,pause'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $sensorCodes = $request->sensor_codes;
            $action = $request->action;
            $results = [];

            foreach ($sensorCodes as $sensorCode) {
                $sensor = MasSensor::where('code', $sensorCode)->first();

                if ($sensor) {
                    switch ($action) {
                        case 'start':
                            $sensor->forecasting_status = 'running';
                            $sensor->is_active = true;
                            break;
                        case 'stop':
                            $sensor->forecasting_status = 'stopped';
                            break;
                        case 'pause':
                            $sensor->forecasting_status = 'paused';
                            break;
                    }

                    $sensor->save();
                    $results[] = [
                        'sensor_code' => $sensorCode,
                        'success' => true,
                        'status' => $sensor->forecasting_status
                    ];
                } else {
                    $results[] = [
                        'sensor_code' => $sensorCode,
                        'success' => false,
                        'error' => 'Sensor not found'
                    ];
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Batch {$action} completed",
                'data' => $results
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error in batch control',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

