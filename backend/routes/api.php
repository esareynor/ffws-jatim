<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\Admin\MasDeviceController;
use App\Http\Controllers\Api\Admin\MasSensorController;
use App\Http\Controllers\Api\Admin\RiverBasinController;

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

// Public device routes for map
Route::prefix('devices')->group(function () {
    Route::get('/map', [MasDeviceController::class, 'getDevicesForMap']);
    Route::get('/{id}', [MasDeviceController::class, 'show']);
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

    // Data routes (contoh untuk data actuals)
    Route::prefix('data')->group(function () {
        Route::get('/actuals', function () {
            return response()->json([
                'success' => true,
                'message' => 'Data actuals endpoint - implementasi selanjutnya'
            ]);
        });
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
        Route::get('/', [\App\Http\Controllers\Api\Admin\GeojsonFileController::class, 'index']);
        Route::get('/{id}/content', [\App\Http\Controllers\Api\Admin\GeojsonFileController::class, 'content']);
    });
});

// Test route untuk memastikan API berjalan
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API berjalan dengan baik'
    ]);
});
