<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DischargeCalculationService;
use App\Models\DataActual;
use App\Models\CalculatedDischarge;
use App\Models\MasSensor;
use Illuminate\Http\Request;

class DischargeCalculationController extends Controller
{
    protected $calculationService;

    public function __construct(DischargeCalculationService $calculationService)
    {
        $this->calculationService = $calculationService;
    }

    /**
     * Process a single data actual to calculate discharge
     *
     * POST /api/discharge/calculate/{dataActualId}
     */
    public function calculateSingle($dataActualId)
    {
        try {
            $dataActual = DataActual::findOrFail($dataActualId);

            $calculatedDischarge = $this->calculationService->processDataActual($dataActual);

            if (!$calculatedDischarge) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to calculate discharge. Check if sensor has active rating curve.'
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => 'Discharge calculated successfully',
                'data' => $calculatedDischarge->load(['sensor', 'ratingCurve'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error calculating discharge: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Batch process multiple data actuals
     *
     * POST /api/discharge/calculate-batch
     * Body: { "data_actual_ids": [1,2,3,4,5] }
     */
    public function calculateBatch(Request $request)
    {
        $request->validate([
            'data_actual_ids' => 'required|array|min:1',
            'data_actual_ids.*' => 'exists:data_actuals,id'
        ]);

        try {
            $dataActuals = DataActual::whereIn('id', $request->data_actual_ids)->get();

            $result = $this->calculationService->batchProcessDataActuals($dataActuals);

            return response()->json([
                'success' => true,
                'message' => 'Batch calculation completed',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error in batch calculation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get GeoJSON data for a calculated discharge
     * This returns the GeoJSON files that should be displayed based on discharge value
     *
     * GET /api/discharge/{calculatedDischargeId}/geojson
     */
    public function getGeojsonVisualization($calculatedDischargeId)
    {
        try {
            $calculatedDischarge = CalculatedDischarge::with(['sensor.device', 'ratingCurve'])
                ->findOrFail($calculatedDischargeId);

            $geojsonData = $this->calculationService->getGeojsonDataForVisualization($calculatedDischarge);

            return response()->json([
                'success' => true,
                'data' => [
                    'calculated_discharge' => [
                        'id' => $calculatedDischarge->id,
                        'sensor_code' => $calculatedDischarge->mas_sensor_code,
                        'sensor_name' => $calculatedDischarge->sensor->code ?? 'N/A',
                        'water_level' => $calculatedDischarge->sensor_value,
                        'discharge' => $calculatedDischarge->sensor_discharge,
                        'calculated_at' => $calculatedDischarge->calculated_at,
                        'rating_curve' => $calculatedDischarge->ratingCurve->formula_string ?? 'N/A'
                    ],
                    'geojson_layers' => $geojsonData,
                    'total_layers' => count($geojsonData)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving GeoJSON data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get calculation summary for a sensor
     *
     * GET /api/discharge/summary/{sensorCode}?start_date=2024-01-01&end_date=2024-12-31
     */
    public function getSummary($sensorCode, Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        try {
            $summary = $this->calculationService->getCalculationSummary(
                $sensorCode,
                $request->start_date,
                $request->end_date
            );

            return response()->json([
                'success' => true,
                'data' => $summary
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error generating summary: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Recalculate discharge for a sensor (useful when rating curve is updated)
     *
     * POST /api/discharge/recalculate/{sensorCode}
     * Body: { "start_date": "2024-01-01", "end_date": "2024-12-31" }
     */
    public function recalculate($sensorCode, Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        try {
            $sensor = MasSensor::where('code', $sensorCode)->firstOrFail();

            $result = $this->calculationService->recalculateDischarge(
                $sensorCode,
                $request->start_date,
                $request->end_date
            );

            return response()->json([
                'success' => true,
                'message' => 'Discharge recalculated successfully',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recalculating discharge: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get latest calculated discharges with applicable GeoJSON mappings
     * This is useful for real-time dashboard display
     *
     * GET /api/discharge/latest?limit=10
     */
    public function getLatestWithGeojson(Request $request)
    {
        $limit = $request->input('limit', 10);

        try {
            $latestDischarges = CalculatedDischarge::with(['sensor.device', 'ratingCurve'])
                ->orderBy('calculated_at', 'desc')
                ->limit($limit)
                ->get();

            $results = [];
            foreach ($latestDischarges as $discharge) {
                $mappings = $this->calculationService->getApplicableGeojsonMappings($discharge);

                $results[] = [
                    'discharge' => [
                        'id' => $discharge->id,
                        'sensor_code' => $discharge->mas_sensor_code,
                        'water_level' => $discharge->sensor_value,
                        'discharge' => $discharge->sensor_discharge,
                        'calculated_at' => $discharge->calculated_at,
                    ],
                    'applicable_geojson_count' => $mappings->count(),
                    'geojson_codes' => $mappings->pluck('code')->toArray()
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $results
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving data: ' . $e->getMessage()
            ], 500);
        }
    }
}
