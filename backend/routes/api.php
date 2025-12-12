<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DataActualController;
use App\Http\Controllers\Api\DataPredictionController;
use App\Http\Controllers\Api\Admin\MasDeviceController;
use App\Http\Controllers\Api\Admin\MasSensorController;
use App\Http\Controllers\Api\Admin\RiverBasinController;
use App\Http\Controllers\Api\Admin\GeojsonFileController;
use App\Http\Controllers\Api\Admin\GeojsonMappingController;
use App\Http\Controllers\Api\Admin\DischargeController;
use App\Http\Controllers\Api\Admin\RatingCurveController;
use App\Http\Controllers\Api\DischargeCalculationController;
use App\Http\Controllers\Api\PredictionDischargeCalculationController;
use App\Http\Controllers\Api\ApiDataSourceController;
use App\Http\Controllers\Api\SensorApiMappingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Test route untuk memastikan API berjalan
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API FFWS Jawa Timur is running!',
        'timestamp' => now()
    ]);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });

    // User routes
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    // Data Actual routes
    Route::prefix('data-actuals')->group(function () {
        Route::get('/', [DataActualController::class, 'index']);
        Route::get('/latest', [DataActualController::class, 'getLatest']);
        Route::get('/by-sensor/{sensorCode}', [DataActualController::class, 'getBySensor']);
        Route::get('/statistics/{sensorCode}', [DataActualController::class, 'getStatistics']);
        Route::post('/bulk', [DataActualController::class, 'bulkStore']);
        Route::post('/', [DataActualController::class, 'store']);
        Route::put('/{id}', [DataActualController::class, 'update']);
        Route::delete('/{id}', [DataActualController::class, 'destroy']);
        Route::delete('/by-date-range', [DataActualController::class, 'deleteByDateRange']);
    });

    // Data Prediction routes
    Route::prefix('data-predictions')->group(function () {
        Route::get('/', [DataPredictionController::class, 'index']);
        Route::get('/latest', [DataPredictionController::class, 'getLatest']);
        Route::get('/latest/{sensorCode}', [DataPredictionController::class, 'getLatest']);
        Route::get('/by-sensor/{sensorCode}', [DataPredictionController::class, 'getBySensor']);
        Route::get('/{id}', [DataPredictionController::class, 'show']);
        Route::post('/', [DataPredictionController::class, 'store']);
        Route::put('/{id}', [DataPredictionController::class, 'update']);
        Route::delete('/{id}', [DataPredictionController::class, 'destroy']);
    });

    // Device routes
    Route::prefix('devices')->group(function () {
        Route::get('/', [MasDeviceController::class, 'index']);
        Route::get('/{id}', [MasDeviceController::class, 'show']);
    });

    // Sensor routes
    Route::prefix('sensors')->group(function () {
        Route::get('/', [MasSensorController::class, 'index']);
        Route::get('/{id}', [MasSensorController::class, 'show']);
        Route::get('/device/{deviceId}', [MasSensorController::class, 'getByDevice']);
        Route::get('/parameter/{parameter}', [MasSensorController::class, 'getByParameter']);
        Route::get('/status/{status}', [MasSensorController::class, 'getByStatus']);
    });

    // River Basin routes
    Route::prefix('river-basins')->group(function () {
        Route::get('/{id}', [RiverBasinController::class, 'show']);
    });

    // GeoJSON files - list and content
    Route::prefix('geojson-files')->group(function () {
        Route::get('/', [GeojsonFileController::class, 'index']);
        Route::get('/{id}/content', [GeojsonFileController::class, 'content']);
    });

    // GeoJSON Mapping - Dynamic flood layers (CRITICAL for flood prediction system)
    Route::prefix('geojson-mapping')->group(function () {
        Route::get('/', [GeojsonMappingController::class, 'index']);
        Route::post('/', [GeojsonMappingController::class, 'store']);
        Route::get('/{id}', [GeojsonMappingController::class, 'show']);
        Route::put('/{id}', [GeojsonMappingController::class, 'update']);
        Route::delete('/{id}', [GeojsonMappingController::class, 'destroy']);

        // Critical endpoints for flood prediction
        Route::get('/by-device/{deviceCode}', [GeojsonMappingController::class, 'getByDevice']);
        Route::get('/by-discharge', [GeojsonMappingController::class, 'getByDischargeValue']); // Main endpoint for matching discharge to flood layer
        Route::get('/{id}/content', [GeojsonMappingController::class, 'getContent']);
    });

    // Rating Curves - For discharge calculation from water level
    Route::prefix('rating-curves')->group(function () {
        Route::get('/', [RatingCurveController::class, 'index']);
        Route::post('/', [RatingCurveController::class, 'store']);
        Route::get('/{id}', [RatingCurveController::class, 'show']);
        Route::put('/{id}', [RatingCurveController::class, 'update']);
        Route::delete('/{id}', [RatingCurveController::class, 'destroy']);

        // Get active rating curve for sensor
        Route::get('/sensor/{sensorCode}/active', [RatingCurveController::class, 'getActiveBySensor']);
        Route::post('/test-calculation', [RatingCurveController::class, 'testCalculation']);
        Route::post('/{id}/activate', [RatingCurveController::class, 'activateCurve']);
    });

    // Discharge Calculation - Convert water level to discharge
    Route::prefix('discharges')->group(function () {
        // Actual discharges (from real sensor data)
        Route::get('/actual', [DischargeController::class, 'indexActual']);
        Route::get('/actual/latest', [DischargeController::class, 'getLatestActual']);
        Route::get('/actual/{id}', [DischargeController::class, 'showActual']);
        Route::post('/actual/calculate', [DischargeController::class, 'calculateFromActual']);
        Route::post('/actual/bulk-calculate', [DischargeController::class, 'bulkCalculateActual']);

        // Predicted discharges (from forecast data)
        Route::get('/predicted', [DischargeController::class, 'indexPredicted']);
        Route::get('/predicted/latest', [DischargeController::class, 'getLatestPredicted']);
        Route::get('/predicted/{id}', [DischargeController::class, 'showPredicted']);
        Route::post('/predicted/calculate', [DischargeController::class, 'calculateFromPrediction']);
        Route::post('/predicted/bulk-calculate', [DischargeController::class, 'bulkCalculatePrediction']);
    });

    // Discharge Calculation Service - New automated calculation system (ACTUAL DATA)
    Route::prefix('discharge-calculation')->group(function () {
        // Calculate discharge from data actual
        Route::post('/calculate/{dataActualId}', [DischargeCalculationController::class, 'calculateSingle']);
        Route::post('/calculate-batch', [DischargeCalculationController::class, 'calculateBatch']);

        // Get GeoJSON visualization data for calculated discharge
        Route::get('/{calculatedDischargeId}/geojson', [DischargeCalculationController::class, 'getGeojsonVisualization']);

        // Get calculation summary for a sensor
        Route::get('/summary/{sensorCode}', [DischargeCalculationController::class, 'getSummary']);

        // Recalculate discharge (when rating curve is updated)
        Route::post('/recalculate/{sensorCode}', [DischargeCalculationController::class, 'recalculate']);

        // Get latest calculated discharges with GeoJSON mappings (for real-time dashboard)
        Route::get('/latest', [DischargeCalculationController::class, 'getLatestWithGeojson']);
    });

    // Prediction Discharge Calculation Service - Automated calculation for forecast data (PREDICTION DATA)
    Route::prefix('prediction-discharge-calculation')->group(function () {
        // Calculate predicted discharge from data prediction
        Route::post('/calculate/{dataPredictionId}', [PredictionDischargeCalculationController::class, 'calculateSingle']);
        Route::post('/calculate-batch', [PredictionDischargeCalculationController::class, 'calculateBatch']);

        // Get GeoJSON visualization data for predicted calculated discharge
        Route::get('/{predictedCalculatedDischargeId}/geojson', [PredictionDischargeCalculationController::class, 'getGeojsonVisualization']);

        // Get calculation summary for a sensor (predictions)
        Route::get('/summary/{sensorCode}', [PredictionDischargeCalculationController::class, 'getSummary']);

        // Recalculate predicted discharge (when rating curve is updated)
        Route::post('/recalculate/{sensorCode}', [PredictionDischargeCalculationController::class, 'recalculate']);

        // Get latest predicted calculated discharges with GeoJSON mappings (for forecast dashboard)
        Route::get('/latest', [PredictionDischargeCalculationController::class, 'getLatestWithGeojson']);

        // Get future predictions (forecast visualization)
        Route::get('/future', [PredictionDischargeCalculationController::class, 'getFuturePredictions']);
    });

    // API Data Source Management Routes
    Route::prefix('api-data-sources')->group(function () {
        Route::get('/', [ApiDataSourceController::class, 'index']);
        Route::post('/', [ApiDataSourceController::class, 'store']);
        Route::get('/{code}', [ApiDataSourceController::class, 'show']);
        Route::put('/{code}', [ApiDataSourceController::class, 'update']);
        Route::delete('/{code}', [ApiDataSourceController::class, 'destroy']);

        // Additional actions
        Route::post('/{code}/test-connection', [ApiDataSourceController::class, 'testConnection']);
        Route::post('/{code}/trigger-fetch', [ApiDataSourceController::class, 'triggerFetch']);
        Route::get('/{code}/fetch-logs', [ApiDataSourceController::class, 'fetchLogs']);
        Route::get('/{code}/statistics', [ApiDataSourceController::class, 'statistics']);
    });

    // Sensor API Mapping Routes
    Route::prefix('sensor-api-mappings')->group(function () {
        Route::get('/', [SensorApiMappingController::class, 'index']);
        Route::post('/', [SensorApiMappingController::class, 'store']);
        Route::post('/bulk', [SensorApiMappingController::class, 'bulkCreate']);
        Route::get('/{id}', [SensorApiMappingController::class, 'show']);
        Route::put('/{id}', [SensorApiMappingController::class, 'update']);
        Route::delete('/{id}', [SensorApiMappingController::class, 'destroy']);
    });
});
