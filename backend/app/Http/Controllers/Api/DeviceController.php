<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MasDevice;
use App\Models\MasSensor;
use App\Models\DataActual;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DeviceController extends Controller
{
    /**
     * Get all devices with their latest sensor data for map display
     */
    public function getDevicesForMap(): JsonResponse
    {
        try {
            $devices = MasDevice::with(['riverBasin', 'sensors' => function($query) {
                $query->where('status', 'active')->with('latestData');
            }])
            ->where('status', 'active')
            ->get()
            ->map(function ($device) {
                // Get latest data from all sensors of this device
                $latestSensorData = $device->sensors->map(function ($sensor) {
                    $latestData = DataActual::where('mas_sensor_id', $sensor->id)
                        ->orderBy('received_at', 'desc')
                        ->first();
                    
                    if ($latestData) {
                        // Determine status based on thresholds
                        $status = 'safe';
                        if ($latestData->value >= $sensor->threshold_danger) {
                            $status = 'danger';
                        } elseif ($latestData->value >= $sensor->threshold_warning) {
                            $status = 'warning';
                        }
                        
                        return [
                            'sensor_id' => $sensor->id,
                            'sensor_code' => $sensor->sensor_code,
                            'parameter' => $sensor->parameter,
                            'unit' => $sensor->unit,
                            'value' => $latestData->value,
                            'received_at' => $latestData->received_at,
                            'status' => $status,
                            'thresholds' => [
                                'safe' => $sensor->threshold_safe,
                                'warning' => $sensor->threshold_warning,
                                'danger' => $sensor->threshold_danger,
                            ]
                        ];
                    }
                    return null;
                })->filter();

                // Determine overall device status based on worst sensor status
                $overallStatus = 'safe';
                foreach ($latestSensorData as $sensorData) {
                    if ($sensorData['status'] === 'danger') {
                        $overallStatus = 'danger';
                        break;
                    } elseif ($sensorData['status'] === 'warning' && $overallStatus === 'safe') {
                        $overallStatus = 'warning';
                    }
                }

                return [
                    'id' => $device->id,
                    'name' => $device->name,
                    'code' => $device->code,
                    'latitude' => $device->latitude,
                    'longitude' => $device->longitude,
                    'elevation_m' => $device->elevation_m,
                    'status' => $overallStatus,
                    'river_basin' => $device->riverBasin ? [
                        'id' => $device->riverBasin->id,
                        'name' => $device->riverBasin->name,
                        'code' => $device->riverBasin->code,
                    ] : null,
                    'sensors' => $latestSensorData,
                    'sensor_count' => $device->sensors->count(),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Devices data retrieved successfully',
                'data' => $devices
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve devices data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get device detail by ID
     */
    public function show($id): JsonResponse
    {
        try {
            $device = MasDevice::with(['riverBasin', 'sensors.latestData'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Device retrieved successfully',
                'data' => $device
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Device not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}