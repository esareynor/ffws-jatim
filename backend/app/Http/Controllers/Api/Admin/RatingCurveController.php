<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\RatingCurve;
use App\Models\MasSensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class RatingCurveController extends Controller
{
    use ApiResponseTraits;

    /**
     * Display a listing of rating curves.
     */
    public function index(Request $request)
    {
        try {
            $query = RatingCurve::with('sensor:code,name,parameter');

            // Filter by sensor
            if ($request->has('sensor_code')) {
                $query->where('mas_sensor_code', $request->sensor_code);
            }

            // Filter by formula type
            if ($request->has('formula_type')) {
                $query->where('formula_type', $request->formula_type);
            }

            // Filter by active status
            if ($request->has('active') && $request->active == 'true') {
                $query->active();
            }

            // Sort
            $sortBy = $request->get('sort_by', 'effective_date');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $ratingCurves = $query->paginate($perPage);

            return $this->successResponse($ratingCurves, 'Rating curves berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil rating curves: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created rating curve.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mas_sensor_code' => 'required|string|exists:mas_sensors,code',
            'code' => 'required|string|max:100|unique:rating_curves,code',
            'formula_type' => 'required|in:power,polynomial,exponential,custom',
            'a' => 'required|numeric',
            'b' => 'nullable|numeric',
            'c' => 'nullable|numeric',
            'effective_date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Verify sensor exists and is water level sensor
            $sensor = MasSensor::where('code', $request->mas_sensor_code)->first();
            if (!$sensor) {
                return $this->notFoundResponse('Sensor tidak ditemukan');
            }

            if ($sensor->parameter !== 'water_level') {
                return $this->validationErrorResponse([
                    'mas_sensor_code' => ['Rating curve hanya dapat dibuat untuk sensor water level']
                ]);
            }

            $ratingCurve = RatingCurve::create($request->all());

            DB::commit();

            return $this->successResponse(
                $ratingCurve->load('sensor'),
                'Rating curve berhasil dibuat',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal membuat rating curve: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified rating curve.
     */
    public function show($id)
    {
        try {
            $ratingCurve = RatingCurve::with([
                'sensor:code,name,parameter,unit',
                'calculatedDischarges' => function($query) {
                    $query->latest('calculated_at')->limit(10);
                }
            ])->findOrFail($id);

            // Add formula string
            $ratingCurve->formula_display = $ratingCurve->formula_string;

            return $this->successResponse($ratingCurve, 'Rating curve berhasil diambil');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Rating curve tidak ditemukan');
        }
    }

    /**
     * Update the specified rating curve.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'mas_sensor_code' => 'sometimes|required|string|exists:mas_sensors,code',
            'code' => 'sometimes|required|string|max:100|unique:rating_curves,code,' . $id,
            'formula_type' => 'sometimes|required|in:power,polynomial,exponential,custom',
            'a' => 'sometimes|required|numeric',
            'b' => 'nullable|numeric',
            'c' => 'nullable|numeric',
            'effective_date' => 'sometimes|required|date'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $ratingCurve = RatingCurve::findOrFail($id);

            DB::beginTransaction();

            // If changing sensor, verify it's water level
            if ($request->has('mas_sensor_code') && $request->mas_sensor_code !== $ratingCurve->mas_sensor_code) {
                $sensor = MasSensor::where('code', $request->mas_sensor_code)->first();
                if ($sensor && $sensor->parameter !== 'water_level') {
                    return $this->validationErrorResponse([
                        'mas_sensor_code' => ['Rating curve hanya dapat dibuat untuk sensor water level']
                    ]);
                }
            }

            $ratingCurve->update($request->all());

            DB::commit();

            return $this->successResponse(
                $ratingCurve->load('sensor'),
                'Rating curve berhasil diupdate'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal mengupdate rating curve: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified rating curve.
     */
    public function destroy($id)
    {
        try {
            $ratingCurve = RatingCurve::findOrFail($id);

            DB::beginTransaction();

            // Check if rating curve is being used
            $dischargeCount = $ratingCurve->calculatedDischarges()->count();
            if ($dischargeCount > 0) {
                return $this->validationErrorResponse([
                    'rating_curve' => ["Rating curve tidak dapat dihapus karena sedang digunakan oleh {$dischargeCount} discharge calculations"]
                ]);
            }

            $ratingCurve->delete();

            DB::commit();

            return $this->successResponse(null, 'Rating curve berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghapus rating curve: ' . $e->getMessage());
        }
    }

    /**
     * Calculate discharge for a given water level.
     */
    public function calculateDischarge(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'water_level' => 'required|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $ratingCurve = RatingCurve::findOrFail($id);
            $discharge = $ratingCurve->calculateDischarge($request->water_level);

            return $this->successResponse([
                'rating_curve_code' => $ratingCurve->code,
                'formula_type' => $ratingCurve->formula_type,
                'formula_display' => $ratingCurve->formula_string,
                'water_level' => $request->water_level,
                'discharge' => round($discharge, 4),
                'unit' => 'm³/s'
            ], 'Discharge berhasil dihitung');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal menghitung discharge: ' . $e->getMessage());
        }
    }

    /**
     * Get active rating curve for a sensor.
     */
    public function getActiveBySensor($sensorCode)
    {
        try {
            $ratingCurve = RatingCurve::getActiveForSensor($sensorCode);

            if (!$ratingCurve) {
                return $this->notFoundResponse('Tidak ada rating curve aktif untuk sensor ini');
            }

            $ratingCurve->load('sensor:code,name,parameter');
            $ratingCurve->formula_display = $ratingCurve->formula_string;
            $ratingCurve->formula_params = $ratingCurve->formula_parameters;

            return $this->successResponse($ratingCurve, 'Active rating curve berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil rating curve: ' . $e->getMessage());
        }
    }
    
    /**
     * Get rating curve history for a sensor.
     * Shows all rating curves with their effective periods.
     */
    public function getHistoryBySensor($sensorCode)
    {
        try {
            // Verify sensor exists
            $sensor = MasSensor::where('code', $sensorCode)->first();
            if (!$sensor) {
                return $this->notFoundResponse('Sensor tidak ditemukan');
            }

            $history = RatingCurve::getHistoryForSensor($sensorCode);

            if (empty($history)) {
                return $this->notFoundResponse('Tidak ada rating curve untuk sensor ini');
            }

            return $this->successResponse([
                'sensor' => [
                    'code' => $sensor->code,
                    'name' => $sensor->name,
                    'parameter' => $sensor->parameter
                ],
                'total_curves' => count($history),
                'current_curve' => $history[0] ?? null,
                'history' => $history
            ], 'Rating curve history berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil history: ' . $e->getMessage());
        }
    }
}

