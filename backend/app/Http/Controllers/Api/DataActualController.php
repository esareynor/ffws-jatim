<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\DataActual;
use App\Models\MasSensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DataActualController extends Controller
{
    use ApiResponseTraits;

    /**
     * Display a listing of data actuals.
     */
    public function index(Request $request)
    {
        try {
            $query = DataActual::with('sensor:code,name,parameter,unit');

            // Filter by sensor
            if ($request->has('sensor_code')) {
                $query->where('mas_sensor_code', $request->sensor_code);
            }

            // Filter by date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('received_at', [$request->start_date, $request->end_date]);
            }

            // Filter by threshold status
            if ($request->has('threshold_status')) {
                $query->where('threshold_status', $request->threshold_status);
            }

            // Sort
            $sortBy = $request->get('sort_by', 'received_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 100);
            $dataActuals = $query->paginate($perPage);

            return $this->successResponse($dataActuals, 'Data actuals berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Store sensor data.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mas_sensor_code' => 'required|string|exists:mas_sensors,code',
            'value' => 'required|numeric',
            'received_at' => 'required|date'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Get sensor
            $sensor = MasSensor::where('code', $request->mas_sensor_code)->firstOrFail();

            // Check for duplicate
            $existing = DataActual::where('mas_sensor_code', $request->mas_sensor_code)
                ->where('received_at', $request->received_at)
                ->first();

            if ($existing) {
                return $this->validationErrorResponse([
                    'received_at' => ['Data untuk sensor dan waktu ini sudah ada']
                ]);
            }

            // Create data actual
            $dataActual = new DataActual();
            $dataActual->mas_sensor_code = $request->mas_sensor_code;
            $dataActual->value = $request->value;
            $dataActual->received_at = $request->received_at;
            
            // Calculate threshold status
            $dataActual->threshold_status = $dataActual->calculateThresholdStatus($sensor);
            
            $dataActual->save();

            // Update sensor last_seen
            $sensor->update(['last_seen' => $request->received_at]);

            DB::commit();

            return $this->successResponse(
                $dataActual->load('sensor'),
                'Data berhasil disimpan',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menyimpan data: ' . $e->getMessage());
        }
    }

    /**
     * Bulk store sensor data.
     */
    public function bulkStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|array|min:1',
            'data.*.mas_sensor_code' => 'required|string|exists:mas_sensors,code',
            'data.*.value' => 'required|numeric',
            'data.*.received_at' => 'required|date'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            $results = [
                'success' => [],
                'failed' => [],
                'duplicates' => []
            ];

            foreach ($request->data as $index => $item) {
                try {
                    // Get sensor
                    $sensor = MasSensor::where('code', $item['mas_sensor_code'])->first();
                    
                    if (!$sensor) {
                        $results['failed'][] = [
                            'index' => $index,
                            'data' => $item,
                            'error' => 'Sensor tidak ditemukan'
                        ];
                        continue;
                    }

                    // Check for duplicate
                    $existing = DataActual::where('mas_sensor_code', $item['mas_sensor_code'])
                        ->where('received_at', $item['received_at'])
                        ->first();

                    if ($existing) {
                        $results['duplicates'][] = [
                            'index' => $index,
                            'data' => $item
                        ];
                        continue;
                    }

                    // Create data actual
                    $dataActual = new DataActual();
                    $dataActual->mas_sensor_code = $item['mas_sensor_code'];
                    $dataActual->value = $item['value'];
                    $dataActual->received_at = $item['received_at'];
                    $dataActual->threshold_status = $dataActual->calculateThresholdStatus($sensor);
                    $dataActual->save();

                    // Update sensor last_seen
                    $sensor->update(['last_seen' => $item['received_at']]);

                    $results['success'][] = [
                        'index' => $index,
                        'id' => $dataActual->id
                    ];

                } catch (\Exception $e) {
                    $results['failed'][] = [
                        'index' => $index,
                        'data' => $item,
                        'error' => $e->getMessage()
                    ];
                }
            }

            DB::commit();

            return $this->successResponse([
                'total' => count($request->data),
                'success_count' => count($results['success']),
                'failed_count' => count($results['failed']),
                'duplicate_count' => count($results['duplicates']),
                'results' => $results
            ], 'Bulk import completed');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal melakukan bulk import: ' . $e->getMessage());
        }
    }

    /**
     * Get data actuals by sensor.
     */
    public function getBySensor($sensorCode, Request $request)
    {
        try {
            $query = DataActual::where('mas_sensor_code', $sensorCode)
                ->orderBy('received_at', 'desc');

            // Filter by date range if provided
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('received_at', [
                    $request->start_date,
                    $request->end_date
                ]);
            }

            // Filter by threshold status if provided
            if ($request->has('threshold_status')) {
                $query->where('threshold_status', $request->threshold_status);
            }

            // Pagination
            $perPage = $request->get('per_page', 100);
            $data = $query->paginate($perPage);

            return $this->successResponse($data, 'Data berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Get latest data for all sensors.
     */
    public function getLatest()
    {
        try {
            $latestData = DataActual::select('mas_sensor_code', 
                DB::raw('MAX(received_at) as latest_time'))
                ->groupBy('mas_sensor_code')
                ->get();

            $results = [];
            foreach ($latestData as $item) {
                $data = DataActual::with('sensor:code,name,parameter,unit')
                    ->where('mas_sensor_code', $item->mas_sensor_code)
                    ->where('received_at', $item->latest_time)
                    ->first();
                
                if ($data) {
                    $results[] = $data;
                }
            }

            return $this->successResponse($results, 'Latest data berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Get statistics for a sensor.
     */
    public function getStatistics($sensorCode, Request $request)
    {
        try {
            $query = DataActual::where('mas_sensor_code', $sensorCode);

            // Filter by date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('received_at', [$request->start_date, $request->end_date]);
            }

            $statistics = [
                'sensor_code' => $sensorCode,
                'total_records' => $query->count(),
                'max_value' => $query->max('value'),
                'min_value' => $query->min('value'),
                'avg_value' => $query->avg('value'),
                'latest_value' => $query->latest('received_at')->first(),
                'threshold_counts' => [
                    'normal' => DataActual::where('mas_sensor_code', $sensorCode)
                        ->where('threshold_status', 'normal')->count(),
                    'watch' => DataActual::where('mas_sensor_code', $sensorCode)
                        ->where('threshold_status', 'watch')->count(),
                    'warning' => DataActual::where('mas_sensor_code', $sensorCode)
                        ->where('threshold_status', 'warning')->count(),
                    'danger' => DataActual::where('mas_sensor_code', $sensorCode)
                        ->where('threshold_status', 'danger')->count(),
                ]
            ];

            return $this->successResponse($statistics, 'Statistics berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil statistics: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified data actual.
     */
    public function show($id)
    {
        try {
            $dataActual = DataActual::with('sensor:code,name,parameter,unit')
                ->findOrFail($id);

            return $this->successResponse($dataActual, 'Data berhasil diambil');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Data tidak ditemukan');
        }
    }

    /**
     * Update the specified data actual.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'sometimes|required|numeric',
            'received_at' => 'sometimes|required|date',
            'threshold_status' => 'sometimes|required|in:normal,watch,warning,danger,unknown'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $dataActual = DataActual::findOrFail($id);

            DB::beginTransaction();

            // If value changed, recalculate threshold
            if ($request->has('value')) {
                $sensor = MasSensor::where('code', $dataActual->mas_sensor_code)->first();
                $dataActual->value = $request->value;
                $dataActual->threshold_status = $dataActual->calculateThresholdStatus($sensor);
            }

            if ($request->has('received_at')) {
                $dataActual->received_at = $request->received_at;
            }

            if ($request->has('threshold_status')) {
                $dataActual->threshold_status = $request->threshold_status;
            }

            $dataActual->save();

            DB::commit();

            return $this->successResponse(
                $dataActual->load('sensor'),
                'Data berhasil diupdate'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal mengupdate data: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified data actual.
     */
    public function destroy($id)
    {
        try {
            $dataActual = DataActual::findOrFail($id);

            DB::beginTransaction();

            $dataActual->delete();

            DB::commit();

            return $this->successResponse(null, 'Data berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghapus data: ' . $e->getMessage());
        }
    }

    /**
     * Delete data actuals by date range.
     */
    public function deleteByDateRange(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sensor_code' => 'required|string|exists:mas_sensors,code',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            $deleted = DataActual::where('mas_sensor_code', $request->sensor_code)
                ->whereBetween('received_at', [$request->start_date, $request->end_date])
                ->delete();

            DB::commit();

            return $this->successResponse([
                'deleted_count' => $deleted
            ], "{$deleted} data berhasil dihapus");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghapus data: ' . $e->getMessage());
        }
    }
}

