<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DischargeCalculationService;
use App\Models\DataPrediction;
use App\Models\PredictedCalculatedDischarge;
use App\Models\MasSensor;
use Illuminate\Http\Request;

class PredictionDischargeCalculationController extends Controller
{
    protected $calculationService;

    public function __construct(DischargeCalculationService $calculationService)
    {
        $this->calculationService = $calculationService;
    }

    /**
     * Process a single data prediction to calculate discharge
     *
     * POST /api/prediction-discharge-calculation/calculate/{dataPredictionId}
     */
    public function calculateSingle($dataPredictionId)
    {
        try {
            $dataPrediction = DataPrediction::findOrFail($dataPredictionId);

            $predictedCalculatedDischarge = $this->calculationService->processDataPrediction($dataPrediction);

            if (!$predictedCalculatedDischarge) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to calculate predicted discharge. Check if sensor has active rating curve.'
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => 'Predicted discharge calculated successfully',
                'data' => $predictedCalculatedDischarge->load(['sensor', 'ratingCurve'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error calculating predicted discharge: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Batch process multiple data predictions
     *
     * POST /api/prediction-discharge-calculation/calculate-batch
     * Body: { "data_prediction_ids": [1,2,3,4,5] }
     */
    public function calculateBatch(Request $request)
    {
        $request->validate([
            'data_prediction_ids' => 'required|array|min:1',
            'data_prediction_ids.*' => 'exists:data_predictions,id'
        ]);

        try {
            $dataPredictions = DataPrediction::whereIn('id', $request->data_prediction_ids)->get();

            $result = $this->calculationService->batchProcessDataPredictions($dataPredictions);

            return response()->json([
                'success' => true,
                'message' => 'Batch prediction calculation completed',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error in batch prediction calculation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get GeoJSON data for a predicted calculated discharge
     * This returns the GeoJSON files that should be displayed based on predicted discharge value
     *
     * GET /api/prediction-discharge-calculation/{predictedCalculatedDischargeId}/geojson
     */
    public function getGeojsonVisualization($predictedCalculatedDischargeId)
    {
        try {
            $predictedCalculatedDischarge = PredictedCalculatedDischarge::with(['sensor.device', 'ratingCurve'])
                ->findOrFail($predictedCalculatedDischargeId);

            $geojsonData = $this->calculationService->getGeojsonDataForPredictionVisualization($predictedCalculatedDischarge);

            return response()->json([
                'success' => true,
                'data' => [
                    'predicted_calculated_discharge' => [
                        'id' => $predictedCalculatedDischarge->id,
                        'sensor_code' => $predictedCalculatedDischarge->mas_sensor_code,
                        'sensor_name' => $predictedCalculatedDischarge->sensor->code ?? 'N/A',
                        'predicted_water_level' => $predictedCalculatedDischarge->predicted_value,
                        'predicted_discharge' => $predictedCalculatedDischarge->predicted_discharge,
                        'calculated_at' => $predictedCalculatedDischarge->calculated_at,
                        'rating_curve' => $predictedCalculatedDischarge->ratingCurve->formula_string ?? 'N/A'
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
     * Get calculation summary for predicted discharges of a sensor
     *
     * GET /api/prediction-discharge-calculation/summary/{sensorCode}?start_date=2024-01-01&end_date=2024-12-31
     */
    public function getSummary($sensorCode, Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        try {
            $summary = $this->calculationService->getPredictionCalculationSummary(
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
     * Recalculate predicted discharge for a sensor (useful when rating curve is updated)
     *
     * POST /api/prediction-discharge-calculation/recalculate/{sensorCode}
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

            $result = $this->calculationService->recalculatePredictedDischarge(
                $sensorCode,
                $request->start_date,
                $request->end_date
            );

            return response()->json([
                'success' => true,
                'message' => 'Predicted discharge recalculated successfully',
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recalculating predicted discharge: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get latest predicted calculated discharges with applicable GeoJSON mappings
     * This is useful for real-time forecast dashboard display
     *
     * GET /api/prediction-discharge-calculation/latest?limit=10
     */
    public function getLatestWithGeojson(Request $request)
    {
        $limit = $request->input('limit', 10);

        try {
            $latestPredictedDischarges = PredictedCalculatedDischarge::with(['sensor.device', 'ratingCurve'])
                ->orderBy('calculated_at', 'desc')
                ->limit($limit)
                ->get();

            $results = [];
            foreach ($latestPredictedDischarges as $discharge) {
                $mappings = $this->calculationService->getApplicableGeojsonMappingsForPrediction($discharge);

                $results[] = [
                    'predicted_discharge' => [
                        'id' => $discharge->id,
                        'sensor_code' => $discharge->mas_sensor_code,
                        'predicted_water_level' => $discharge->predicted_value,
                        'predicted_discharge' => $discharge->predicted_discharge,
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

    /**
     * Get future predictions (calculated_at > now)
     * Useful for forecast visualization
     *
     * GET /api/prediction-discharge-calculation/future?sensor_code=SNS001&hours=24
     */
    public function getFuturePredictions(Request $request)
    {
        $request->validate([
            'sensor_code' => 'nullable|exists:mas_sensors,code',
            'hours' => 'nullable|integer|min:1|max:168' // Max 1 week
        ]);

        try {
            $hours = $request->input('hours', 24);
            $untilTime = now()->addHours($hours);

            $query = PredictedCalculatedDischarge::with(['sensor.device', 'ratingCurve'])
                ->where('calculated_at', '>', now())
                ->where('calculated_at', '<=', $untilTime);

            if ($request->sensor_code) {
                $query->where('mas_sensor_code', $request->sensor_code);
            }

            $predictions = $query->orderBy('calculated_at', 'asc')->get();

            $results = [];
            foreach ($predictions as $discharge) {
                $mappings = $this->calculationService->getApplicableGeojsonMappingsForPrediction($discharge);

                $results[] = [
                    'predicted_discharge' => [
                        'id' => $discharge->id,
                        'sensor_code' => $discharge->mas_sensor_code,
                        'predicted_water_level' => $discharge->predicted_value,
                        'predicted_discharge' => $discharge->predicted_discharge,
                        'calculated_at' => $discharge->calculated_at,
                        'hours_from_now' => now()->diffInHours($discharge->calculated_at, false)
                    ],
                    'applicable_geojson_count' => $mappings->count(),
                    'geojson_codes' => $mappings->pluck('code')->toArray()
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'predictions' => $results,
                    'total' => count($results),
                    'forecast_period' => [
                        'from' => now()->toDateTimeString(),
                        'to' => $untilTime->toDateTimeString(),
                        'hours' => $hours
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving future predictions: ' . $e->getMessage()
            ], 500);
        }
    }
}
