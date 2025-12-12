<?php

namespace App\Services;

use App\Models\DataActual;
use App\Models\DataPrediction;
use App\Models\MasSensor;
use App\Models\RatingCurve;
use App\Models\CalculatedDischarge;
use App\Models\PredictedCalculatedDischarge;
use App\Models\GeojsonMapping;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DischargeCalculationService
{
    /**
     * Process data actual and calculate discharge using rating curve
     *
     * Flow:
     * 1. Data Actual (water level) → Rating Curve (formula)
     * 2. Calculate Discharge → Calculated Discharge (result)
     * 3. Calculated Discharge → GeojsonMapping (for frontend display)
     *
     * @param DataActual $dataActual
     * @return CalculatedDischarge|null
     */
    public function processDataActual(DataActual $dataActual): ?CalculatedDischarge
    {
        try {
            // Get sensor
            $sensor = $dataActual->sensor;
            if (!$sensor) {
                Log::warning("Sensor not found for data actual ID: {$dataActual->id}");
                return null;
            }

            // Get active rating curve for the sensor
            $ratingCurve = RatingCurve::getActiveForSensor(
                $sensor->code,
                $dataActual->received_at
            );

            if (!$ratingCurve) {
                Log::warning("No active rating curve found for sensor: {$sensor->code}");
                return null;
            }

            // Calculate discharge using rating curve formula
            $waterLevel = $dataActual->value;
            $discharge = $ratingCurve->calculateDischarge($waterLevel);

            // Store calculated discharge
            $calculatedDischarge = CalculatedDischarge::create([
                'mas_sensor_code' => $sensor->code,
                'sensor_value' => $waterLevel,
                'sensor_discharge' => $discharge,
                'rating_curve_code' => $ratingCurve->code,
                'calculated_at' => $dataActual->received_at,
            ]);

            Log::info("Discharge calculated", [
                'sensor_code' => $sensor->code,
                'water_level' => $waterLevel,
                'discharge' => $discharge,
                'rating_curve' => $ratingCurve->code,
                'formula' => $ratingCurve->formula_string
            ]);

            return $calculatedDischarge;

        } catch (\Exception $e) {
            Log::error("Error calculating discharge: " . $e->getMessage(), [
                'data_actual_id' => $dataActual->id,
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Batch process multiple data actual records
     *
     * @param \Illuminate\Support\Collection $dataActuals
     * @return array ['success' => int, 'failed' => int]
     */
    public function batchProcessDataActuals($dataActuals): array
    {
        $successCount = 0;
        $failedCount = 0;

        DB::beginTransaction();
        try {
            foreach ($dataActuals as $dataActual) {
                $result = $this->processDataActual($dataActual);

                if ($result) {
                    $successCount++;
                } else {
                    $failedCount++;
                }
            }

            DB::commit();

            Log::info("Batch discharge calculation completed", [
                'total' => $dataActuals->count(),
                'success' => $successCount,
                'failed' => $failedCount
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Batch discharge calculation failed: " . $e->getMessage());
            throw $e;
        }

        return [
            'success' => $successCount,
            'failed' => $failedCount
        ];
    }

    /**
     * Get applicable GeoJSON mappings for a calculated discharge
     * Returns GeoJSON files that should be displayed based on discharge value
     *
     * @param CalculatedDischarge $calculatedDischarge
     * @return \Illuminate\Support\Collection
     */
    public function getApplicableGeojsonMappings(CalculatedDischarge $calculatedDischarge)
    {
        $sensor = $calculatedDischarge->sensor;
        $discharge = $calculatedDischarge->sensor_discharge;

        if (!$sensor || !$sensor->device) {
            return collect([]);
        }

        // Get GeoJSON mappings where discharge falls within value_min and value_max range
        return GeojsonMapping::where('mas_device_code', $sensor->device->code)
            ->where(function($query) use ($discharge) {
                $query->where(function($q) use ($discharge) {
                    // Discharge is within range
                    $q->where('value_min', '<=', $discharge)
                      ->where('value_max', '>=', $discharge);
                })
                ->orWhere(function($q) use ($discharge) {
                    // No max limit (value_max is null)
                    $q->where('value_min', '<=', $discharge)
                      ->whereNull('value_max');
                })
                ->orWhere(function($q) use ($discharge) {
                    // No min limit (value_min is null)
                    $q->whereNull('value_min')
                      ->where('value_max', '>=', $discharge);
                })
                ->orWhere(function($q) {
                    // No limits at all (both null) - always show
                    $q->whereNull('value_min')
                      ->whereNull('value_max');
                });
            })
            ->with(['riverBasin', 'city', 'regency', 'village', 'upt', 'uptd'])
            ->get();
    }

    /**
     * Get GeoJSON data for frontend visualization
     *
     * @param CalculatedDischarge $calculatedDischarge
     * @return array
     */
    public function getGeojsonDataForVisualization(CalculatedDischarge $calculatedDischarge): array
    {
        $mappings = $this->getApplicableGeojsonMappings($calculatedDischarge);

        $geojsonData = [];

        foreach ($mappings as $mapping) {
            if ($mapping->file_path && file_exists(storage_path('app/' . $mapping->file_path))) {
                $geojsonContent = json_decode(
                    file_get_contents(storage_path('app/' . $mapping->file_path)),
                    true
                );

                $geojsonData[] = [
                    'mapping_id' => $mapping->id,
                    'mapping_code' => $mapping->code,
                    'value_range' => [
                        'min' => $mapping->value_min,
                        'max' => $mapping->value_max
                    ],
                    'current_discharge' => $calculatedDischarge->sensor_discharge,
                    'geojson' => $geojsonContent,
                    'properties' => $mapping->properties_content,
                    'metadata' => [
                        'river_basin' => $mapping->riverBasin->name ?? null,
                        'city' => $mapping->city->name ?? null,
                        'regency' => $mapping->regency->regencies_name ?? null,
                        'village' => $mapping->village->name ?? null,
                        'upt' => $mapping->upt->name ?? null,
                        'uptd' => $mapping->uptd->name ?? null,
                    ]
                ];
            }
        }

        return $geojsonData;
    }

    /**
     * Get calculation summary for a sensor
     *
     * @param string $sensorCode
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getCalculationSummary(string $sensorCode, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = CalculatedDischarge::where('mas_sensor_code', $sensorCode);

        if ($startDate && $endDate) {
            $query->whereBetween('calculated_at', [$startDate, $endDate]);
        }

        $calculations = $query->orderBy('calculated_at', 'desc')->get();

        return [
            'sensor_code' => $sensorCode,
            'total_calculations' => $calculations->count(),
            'latest_discharge' => $calculations->first()?->sensor_discharge,
            'latest_water_level' => $calculations->first()?->sensor_value,
            'latest_calculated_at' => $calculations->first()?->calculated_at,
            'max_discharge' => $calculations->max('sensor_discharge'),
            'min_discharge' => $calculations->min('sensor_discharge'),
            'avg_discharge' => round($calculations->avg('sensor_discharge'), 2),
            'date_range' => [
                'from' => $startDate ?? $calculations->last()?->calculated_at,
                'to' => $endDate ?? $calculations->first()?->calculated_at
            ]
        ];
    }

    /**
     * Recalculate discharge for existing data actual records
     * Useful when rating curve is updated
     *
     * @param string $sensorCode
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function recalculateDischarge(string $sensorCode, ?string $startDate = null, ?string $endDate = null): array
    {
        $query = DataActual::where('mas_sensor_code', $sensorCode);

        if ($startDate && $endDate) {
            $query->whereBetween('received_at', [$startDate, $endDate]);
        }

        $dataActuals = $query->orderBy('received_at', 'desc')->get();

        // Delete existing calculated discharges for this period
        $deleteQuery = CalculatedDischarge::where('mas_sensor_code', $sensorCode);
        if ($startDate && $endDate) {
            $deleteQuery->whereBetween('calculated_at', [$startDate, $endDate]);
        }
        $deletedCount = $deleteQuery->delete();

        // Recalculate
        $result = $this->batchProcessDataActuals($dataActuals);

        return [
            'deleted_old_calculations' => $deletedCount,
            'new_calculations_success' => $result['success'],
            'new_calculations_failed' => $result['failed']
        ];
    }

    /**
     * Process data prediction and calculate discharge using rating curve
     *
     * Flow (PREDICTION):
     * 1. Data Prediction (predicted water level) → Rating Curve (formula)
     * 2. Calculate Discharge → Predicted Calculated Discharge (result)
     * 3. Predicted Calculated Discharge → GeojsonMapping (for frontend display)
     *
     * @param DataPrediction $dataPrediction
     * @return PredictedCalculatedDischarge|null
     */
    public function processDataPrediction(DataPrediction $dataPrediction): ?PredictedCalculatedDischarge
    {
        try {
            // Get sensor
            $sensor = $dataPrediction->masSensor;
            if (!$sensor) {
                Log::warning("Sensor not found for data prediction ID: {$dataPrediction->id}");
                return null;
            }

            // Get active rating curve for the sensor at prediction time
            $ratingCurve = RatingCurve::getActiveForSensor(
                $sensor->code,
                $dataPrediction->prediction_for_ts
            );

            if (!$ratingCurve) {
                Log::warning("No active rating curve found for sensor: {$sensor->code}");
                return null;
            }

            // Calculate discharge using rating curve formula
            $predictedWaterLevel = $dataPrediction->predicted_value;
            $predictedDischarge = $ratingCurve->calculateDischarge($predictedWaterLevel);

            // Store predicted calculated discharge
            $predictedCalculatedDischarge = PredictedCalculatedDischarge::create([
                'mas_sensor_code' => $sensor->code,
                'predicted_value' => $predictedWaterLevel,
                'predicted_discharge' => $predictedDischarge,
                'rating_curve_code' => $ratingCurve->code,
                'calculated_at' => $dataPrediction->prediction_for_ts,
            ]);

            Log::info("Predicted discharge calculated", [
                'data_prediction_id' => $dataPrediction->id,
                'sensor_code' => $sensor->code,
                'predicted_water_level' => $predictedWaterLevel,
                'predicted_discharge' => $predictedDischarge,
                'rating_curve' => $ratingCurve->code
            ]);

            return $predictedCalculatedDischarge;

        } catch (\Exception $e) {
            Log::error("Error calculating predicted discharge for data_prediction ID {$dataPrediction->id}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Batch process multiple data predictions
     *
     * @param \Illuminate\Support\Collection $dataPredictions
     * @return array
     */
    public function batchProcessDataPredictions($dataPredictions): array
    {
        $successCount = 0;
        $failedCount = 0;
        $results = [];

        DB::beginTransaction();
        try {
            foreach ($dataPredictions as $dataPrediction) {
                $result = $this->processDataPrediction($dataPrediction);

                if ($result) {
                    $successCount++;
                    $results[] = [
                        'data_prediction_id' => $dataPrediction->id,
                        'predicted_calculated_discharge_id' => $result->id,
                        'sensor_code' => $result->mas_sensor_code,
                        'predicted_discharge' => $result->predicted_discharge,
                        'status' => 'success'
                    ];
                } else {
                    $failedCount++;
                    $results[] = [
                        'data_prediction_id' => $dataPrediction->id,
                        'status' => 'failed',
                        'reason' => 'No active rating curve or sensor not found'
                    ];
                }
            }

            DB::commit();

            Log::info("Batch prediction discharge calculation completed", [
                'total' => count($dataPredictions),
                'success' => $successCount,
                'failed' => $failedCount
            ]);

            return [
                'success' => $successCount,
                'failed' => $failedCount,
                'total' => count($dataPredictions),
                'results' => $results
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error in batch prediction discharge calculation: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get applicable GeoJSON mappings for a predicted calculated discharge
     * Returns GeoJSON files that should be displayed based on predicted discharge value
     *
     * @param PredictedCalculatedDischarge $predictedCalculatedDischarge
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getApplicableGeojsonMappingsForPrediction(PredictedCalculatedDischarge $predictedCalculatedDischarge)
    {
        $discharge = $predictedCalculatedDischarge->predicted_discharge;
        $sensor = $predictedCalculatedDischarge->sensor;

        if (!$sensor || !$sensor->device) {
            return collect([]);
        }

        // Find GeoJSON mappings where discharge falls within the range
        // Handle 4 cases:
        // 1. Normal range: value_min <= discharge <= value_max
        // 2. No upper limit: value_min <= discharge AND value_max IS NULL
        // 3. No lower limit: value_min IS NULL AND discharge <= value_max
        // 4. Always show: value_min IS NULL AND value_max IS NULL
        return GeojsonMapping::where('mas_device_code', $sensor->device->code)
            ->where(function($query) use ($discharge) {
                $query->where(function($q) use ($discharge) {
                    // Case 1: Normal range
                    $q->where('value_min', '<=', $discharge)
                      ->where('value_max', '>=', $discharge);
                })
                ->orWhere(function($q) use ($discharge) {
                    // Case 2: No upper limit
                    $q->where('value_min', '<=', $discharge)
                      ->whereNull('value_max');
                })
                ->orWhere(function($q) use ($discharge) {
                    // Case 3: No lower limit
                    $q->whereNull('value_min')
                      ->where('value_max', '>=', $discharge);
                })
                ->orWhere(function($q) {
                    // Case 4: Always show
                    $q->whereNull('value_min')
                      ->whereNull('value_max');
                });
            })
            ->with([
                'riverBasin',
                'city',
                'regency',
                'village',
                'upt',
                'uptd'
            ])
            ->get();
    }

    /**
     * Get GeoJSON data with file contents for visualization (PREDICTION)
     *
     * @param PredictedCalculatedDischarge $predictedCalculatedDischarge
     * @return array
     */
    public function getGeojsonDataForPredictionVisualization(PredictedCalculatedDischarge $predictedCalculatedDischarge): array
    {
        $mappings = $this->getApplicableGeojsonMappingsForPrediction($predictedCalculatedDischarge);

        $result = [];
        foreach ($mappings as $mapping) {
            $geojsonPath = storage_path('app/' . $mapping->file_path);

            $geojsonContent = null;
            if (file_exists($geojsonPath)) {
                $geojsonContent = json_decode(file_get_contents($geojsonPath), true);
            }

            $result[] = [
                'mapping' => [
                    'code' => $mapping->code,
                    'label' => $mapping->description ?? "Layer {$mapping->code}",
                    'value_min' => $mapping->value_min,
                    'value_max' => $mapping->value_max,
                    'mas_device_code' => $mapping->mas_device_code,
                    'metadata' => [
                        'river_basin' => $mapping->riverBasin->name ?? null,
                        'city' => $mapping->city->name ?? null,
                        'regency' => $mapping->regency->name ?? null,
                        'village' => $mapping->village->name ?? null,
                        'upt' => $mapping->upt->name ?? null,
                        'uptd' => $mapping->uptd->name ?? null,
                    ]
                ],
                'geojson' => $geojsonContent
            ];
        }

        return $result;
    }

    /**
     * Get calculation summary for predicted discharges
     *
     * @param string $sensorCode
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function getPredictionCalculationSummary(string $sensorCode, $startDate = null, $endDate = null): array
    {
        $query = PredictedCalculatedDischarge::where('mas_sensor_code', $sensorCode);

        if ($startDate && $endDate) {
            $query->whereBetween('calculated_at', [$startDate, $endDate]);
        }

        $calculations = $query->get();

        return [
            'sensor_code' => $sensorCode,
            'total_predictions' => $calculations->count(),
            'max_predicted_discharge' => $calculations->max('predicted_discharge'),
            'min_predicted_discharge' => $calculations->min('predicted_discharge'),
            'avg_predicted_discharge' => $calculations->avg('predicted_discharge'),
            'max_predicted_water_level' => $calculations->max('predicted_value'),
            'min_predicted_water_level' => $calculations->min('predicted_value'),
            'period' => [
                'start' => $startDate,
                'end' => $endDate
            ]
        ];
    }

    /**
     * Recalculate predicted discharges for a sensor (when rating curve is updated)
     *
     * @param string $sensorCode
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function recalculatePredictedDischarge(string $sensorCode, $startDate = null, $endDate = null): array
    {
        $query = DataPrediction::where('mas_sensor_code', $sensorCode);

        if ($startDate && $endDate) {
            $query->whereBetween('prediction_for_ts', [$startDate, $endDate]);
        }

        $dataPredictions = $query->orderBy('prediction_for_ts', 'desc')->get();

        // Delete existing predicted calculated discharges for this period
        $deleteQuery = PredictedCalculatedDischarge::where('mas_sensor_code', $sensorCode);
        if ($startDate && $endDate) {
            $deleteQuery->whereBetween('calculated_at', [$startDate, $endDate]);
        }
        $deletedCount = $deleteQuery->delete();

        // Recalculate
        $result = $this->batchProcessDataPredictions($dataPredictions);

        return [
            'deleted_old_predictions' => $deletedCount,
            'new_predictions_success' => $result['success'],
            'new_predictions_failed' => $result['failed']
        ];
    }
}
