<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasDevice;
use App\Http\Traits\ApiResponseTraits;

class MasDeviceController extends Controller
{
    use ApiResponseTraits;

    public function index()
    {
        try {
            $devices = MasDevice::with([
                    'riverBasin',
                    'sensors' => function($query) {
                        $query->select('id', 'mas_device_code', 'code', 'parameter', 'unit', 'description');
                    },
                    'sensors.latestData' => function($query) {
                        $query->select('id', 'mas_sensor_code', 'value', 'received_at', 'threshold_status');
                    }
                ])
                ->select([
                    'id',
                    'name',
                    'code',
                    'latitude',
                    'longitude',
                    'elevation_m',
                    'status',
                    'mas_river_basin_code'
                ])
                ->get();

            // Format data to include latest readings
            $devicesWithData = $devices->map(function($device) {
                $waterLevelSensor = $device->sensors->where('parameter', 'water_level')->first();
                $latestData = $waterLevelSensor?->latestData;

                return [
                    'id' => $device->id,
                    'name' => $device->name,
                    'code' => $device->code,
                    'latitude' => $device->latitude,
                    'longitude' => $device->longitude,
                    'elevation_m' => $device->elevation_m,
                    'status' => $device->status,
                    'mas_river_basin_code' => $device->mas_river_basin_code,
                    'river_basin' => $device->riverBasin,
                    'sensor_code' => $waterLevelSensor?->code, // Include sensor code for fetching history
                    'latest_value' => $latestData?->value,
                    'latest_received_at' => $latestData?->received_at,
                    'threshold_status' => $latestData?->threshold_status,
                ];
            });

            return $this->successResponse($devicesWithData, 'Data device berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data device');
        }
    }

    public function show($id)
    {
        try {
            $device = MasDevice::select('name', 'code', 'latitude', 'longitude', 'elevation_m', 'status', 'mas_river_basin_code')
                ->with('riverBasin:code,name')
                ->findOrFail($id);

            // Format data untuk response
            $formattedDevice = [
                'name' => $device->name,
                'code' => $device->code,
                'latitude' => number_format($device->latitude, 6),
                'longitude' => number_format($device->longitude, 6),
                'elevation_m' => $device->elevation_m ? number_format($device->elevation_m, 2) : '-',
                'status' => $device->status,
                'mas_river_basin_code' => $device->mas_river_basin_code,
                'river_basin_name' => $device->riverBasin->name ?? '-'
            ];

            return $this->successResponse($formattedDevice, 'Device retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Terjadi kesalahan saat mengambil data device');
        }
    }
}
