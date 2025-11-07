<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\CalculatedDischarge;
use App\Models\PredictedCalculatedDischarge;
use App\Models\DataActual;
use App\Models\DataPrediction;
use App\Models\RatingCurve;
use App\Models\MasSensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DischargeController extends Controller
{
    use ApiResponseTraits;

    /**
     * Get calculated discharges.
     */
    public function indexActual(Request $request)
    {
        try {
            $query = CalculatedDischarge::with(['sensor:code,name,parameter', 'ratingCurve:code,formula_type']);

            // Filter by sensor
            if ($request->has('sensor_code')) {
                $query->where('mas_sensor_code', $request->sensor_code);
            }

            // Filter by date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('calculated_at', [$request->start_date, $request->end_date]);
            }

            // Sort
            $sortBy = $request->get('sort_by', 'calculated_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 50);
            $discharges = $query->paginate($perPage);

            return $this->successResponse($discharges, 'Calculated discharges berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Get predicted calculated discharges.
     */
    public function indexPredicted(Request $request)
    {
        try {
            $query = PredictedCalculatedDischarge::with(['sensor:code,name,parameter', 'ratingCurve:code,formula_type']);

            // Filter by sensor
            if ($request->has('sensor_code')) {
                $query->where('mas_sensor_code', $request->sensor_code);
            }

            // Filter by date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('calculated_at', [$request->start_date, $request->end_date]);
            }

            // Filter future only
            if ($request->has('future') && $request->future == 'true') {
                $query->future();
            }

            // Sort
            $sortBy = $request->get('sort_by', 'calculated_at');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 50);
            $discharges = $query->paginate($perPage);

            return $this->successResponse($discharges, 'Predicted discharges berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Calculate discharge from actual data.
     */
    public function calculateFromActual(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_actual_id' => 'required|exists:data_actuals,id'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Get data actual
            $dataActual = DataActual::with('sensor')->findOrFail($request->data_actual_id);

            // Verify sensor is water level
            if ($dataActual->sensor->parameter !== 'water_level') {
                return $this->validationErrorResponse([
                    'sensor' => ['Discharge hanya dapat dihitung untuk sensor water level']
                ]);
            }

            // Get active rating curve
            $ratingCurve = RatingCurve::getActiveForSensor($dataActual->mas_sensor_code);
            if (!$ratingCurve) {
                return $this->notFoundResponse('Tidak ada rating curve aktif untuk sensor ini');
            }

            // Calculate discharge
            $discharge = $ratingCurve->calculateDischarge($dataActual->value);

            // Check if already exists
            $existing = CalculatedDischarge::where('mas_sensor_code', $dataActual->mas_sensor_code)
                ->where('calculated_at', $dataActual->received_at)
                ->first();

            if ($existing) {
                // Update existing
                $existing->update([
                    'sensor_value' => $dataActual->value,
                    'sensor_discharge' => $discharge,
                    'rating_curve_code' => $ratingCurve->code
                ]);
                $calculatedDischarge = $existing;
            } else {
                // Create new
                $calculatedDischarge = CalculatedDischarge::create([
                    'mas_sensor_code' => $dataActual->mas_sensor_code,
                    'sensor_value' => $dataActual->value,
                    'sensor_discharge' => $discharge,
                    'rating_curve_code' => $ratingCurve->code,
                    'calculated_at' => $dataActual->received_at
                ]);
            }

            DB::commit();

            return $this->successResponse(
                $calculatedDischarge->load(['sensor', 'ratingCurve']),
                'Discharge berhasil dihitung',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghitung discharge: ' . $e->getMessage());
        }
    }

    /**
     * Calculate discharge from prediction data.
     */
    public function calculateFromPrediction(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data_prediction_id' => 'required|exists:data_predictions,id'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Get data prediction
            $dataPrediction = DataPrediction::with('sensor')->findOrFail($request->data_prediction_id);

            // Verify sensor is water level
            if ($dataPrediction->sensor->parameter !== 'water_level') {
                return $this->validationErrorResponse([
                    'sensor' => ['Discharge hanya dapat dihitung untuk sensor water level']
                ]);
            }

            // Get active rating curve
            $ratingCurve = RatingCurve::getActiveForSensor($dataPrediction->mas_sensor_code);
            if (!$ratingCurve) {
                return $this->notFoundResponse('Tidak ada rating curve aktif untuk sensor ini');
            }

            // Calculate discharge
            $discharge = $ratingCurve->calculateDischarge($dataPrediction->predicted_value);

            // Check if already exists
            $existing = PredictedCalculatedDischarge::where('mas_sensor_code', $dataPrediction->mas_sensor_code)
                ->where('calculated_at', $dataPrediction->prediction_for_ts)
                ->first();

            if ($existing) {
                // Update existing
                $existing->update([
                    'predicted_value' => $dataPrediction->predicted_value,
                    'predicted_discharge' => $discharge,
                    'rating_curve_code' => $ratingCurve->code
                ]);
                $predictedDischarge = $existing;
            } else {
                // Create new
                $predictedDischarge = PredictedCalculatedDischarge::create([
                    'mas_sensor_code' => $dataPrediction->mas_sensor_code,
                    'predicted_value' => $dataPrediction->predicted_value,
                    'predicted_discharge' => $discharge,
                    'rating_curve_code' => $ratingCurve->code,
                    'calculated_at' => $dataPrediction->prediction_for_ts
                ]);
            }

            DB::commit();

            return $this->successResponse(
                $predictedDischarge->load(['sensor', 'ratingCurve']),
                'Predicted discharge berhasil dihitung',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghitung discharge: ' . $e->getMessage());
        }
    }

    /**
     * Batch calculate discharges for a sensor.
     */
    public function batchCalculateForSensor(Request $request, $sensorCode)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Verify sensor exists and is water level
            $sensor = MasSensor::where('code', $sensorCode)->first();
            if (!$sensor) {
                return $this->notFoundResponse('Sensor tidak ditemukan');
            }

            if ($sensor->parameter !== 'water_level') {
                return $this->validationErrorResponse([
                    'sensor' => ['Discharge hanya dapat dihitung untuk sensor water level']
                ]);
            }

            // Get active rating curve
            $ratingCurve = RatingCurve::getActiveForSensor($sensorCode);
            if (!$ratingCurve) {
                return $this->notFoundResponse('Tidak ada rating curve aktif untuk sensor ini');
            }

            // Get data actuals in date range
            $dataActuals = DataActual::where('mas_sensor_code', $sensorCode)
                ->whereBetween('received_at', [$request->start_date, $request->end_date])
                ->get();

            $processed = 0;
            $errors = [];

            foreach ($dataActuals as $dataActual) {
                try {
                    $discharge = $ratingCurve->calculateDischarge($dataActual->value);

                    CalculatedDischarge::updateOrCreate(
                        [
                            'mas_sensor_code' => $sensorCode,
                            'calculated_at' => $dataActual->received_at
                        ],
                        [
                            'sensor_value' => $dataActual->value,
                            'sensor_discharge' => $discharge,
                            'rating_curve_code' => $ratingCurve->code
                        ]
                    );

                    $processed++;
                } catch (\Exception $e) {
                    $errors[] = "Error at {$dataActual->received_at}: {$e->getMessage()}";
                }
            }

            DB::commit();

            return $this->successResponse([
                'sensor_code' => $sensorCode,
                'total_records' => $dataActuals->count(),
                'processed' => $processed,
                'errors' => $errors
            ], "Batch calculation completed. {$processed} discharges calculated.");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal melakukan batch calculation: ' . $e->getMessage());
        }
    }

    /**
     * Delete calculated discharge.
     */
    public function destroyActual($id)
    {
        try {
            $discharge = CalculatedDischarge::findOrFail($id);
            $discharge->delete();

            return $this->successResponse(null, 'Calculated discharge berhasil dihapus');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal menghapus data: ' . $e->getMessage());
        }
    }

    /**
     * Delete predicted calculated discharge.
     */
    public function destroyPredicted($id)
    {
        try {
            $discharge = PredictedCalculatedDischarge::findOrFail($id);
            $discharge->delete();

            return $this->successResponse(null, 'Predicted discharge berhasil dihapus');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal menghapus data: ' . $e->getMessage());
        }
    }

    /**
     * Get discharge statistics for a sensor.
     */
    public function getStatistics($sensorCode, Request $request)
    {
        try {
            $query = CalculatedDischarge::where('mas_sensor_code', $sensorCode);

            // Filter by date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('calculated_at', [$request->start_date, $request->end_date]);
            }

            $statistics = [
                'sensor_code' => $sensorCode,
                'total_records' => $query->count(),
                'max_discharge' => $query->max('sensor_discharge'),
                'min_discharge' => $query->min('sensor_discharge'),
                'avg_discharge' => $query->avg('sensor_discharge'),
                'latest_discharge' => $query->latest('calculated_at')->first()
            ];

            return $this->successResponse($statistics, 'Statistics berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil statistics: ' . $e->getMessage());
        }
    }
    
    /**
     * Recalculate discharges using a specific rating curve.
     * This allows comparing results with different rating curve formulas.
     */
    public function recalculateWithRatingCurve(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sensor_code' => 'required|string|exists:mas_sensors,code',
            'rating_curve_id' => 'required|exists:rating_curves,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'save_results' => 'nullable|boolean' // If true, save to database; if false, just return comparison
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            // Get the rating curve
            $ratingCurve = RatingCurve::findOrFail($request->rating_curve_id);
            
            // Verify rating curve belongs to this sensor
            if ($ratingCurve->mas_sensor_code !== $request->sensor_code) {
                return $this->validationErrorResponse([
                    'rating_curve_id' => ['Rating curve tidak sesuai dengan sensor']
                ]);
            }

            // Get data actuals in date range
            $dataActuals = DataActual::where('mas_sensor_code', $request->sensor_code)
                ->whereBetween('received_at', [$request->start_date, $request->end_date])
                ->orderBy('received_at')
                ->get();

            if ($dataActuals->isEmpty()) {
                return $this->notFoundResponse('Tidak ada data actual dalam rentang tanggal tersebut');
            }

            $results = [];
            $saveResults = $request->get('save_results', false);

            DB::beginTransaction();

            foreach ($dataActuals as $dataActual) {
                // Calculate discharge with the specified rating curve
                $newDischarge = $ratingCurve->calculateDischarge($dataActual->value);
                
                // Get existing calculated discharge (if any)
                $existing = CalculatedDischarge::where('mas_sensor_code', $request->sensor_code)
                    ->where('calculated_at', $dataActual->received_at)
                    ->first();
                
                $result = [
                    'timestamp' => $dataActual->received_at->format('Y-m-d H:i:s'),
                    'water_level' => $dataActual->value,
                    'new_discharge' => round($newDischarge, 4),
                    'new_rating_curve' => [
                        'code' => $ratingCurve->code,
                        'formula' => $ratingCurve->formula_string,
                        'effective_date' => $ratingCurve->effective_date->format('Y-m-d')
                    ]
                ];
                
                if ($existing) {
                    $result['old_discharge'] = $existing->sensor_discharge;
                    $result['old_rating_curve'] = [
                        'code' => $existing->rating_curve_code,
                        'formula' => $existing->ratingCurve->formula_string ?? 'N/A'
                    ];
                    $result['difference'] = round($newDischarge - $existing->sensor_discharge, 4);
                    $result['difference_percent'] = $existing->sensor_discharge > 0 
                        ? round((($newDischarge - $existing->sensor_discharge) / $existing->sensor_discharge) * 100, 2)
                        : null;
                }
                
                // Save if requested
                if ($saveResults) {
                    CalculatedDischarge::updateOrCreate(
                        [
                            'mas_sensor_code' => $request->sensor_code,
                            'calculated_at' => $dataActual->received_at
                        ],
                        [
                            'sensor_value' => $dataActual->value,
                            'sensor_discharge' => $newDischarge,
                            'rating_curve_code' => $ratingCurve->code
                        ]
                    );
                }
                
                $results[] = $result;
            }

            if ($saveResults) {
                DB::commit();
            } else {
                DB::rollBack();
            }

            return $this->successResponse([
                'sensor_code' => $request->sensor_code,
                'rating_curve' => [
                    'id' => $ratingCurve->id,
                    'code' => $ratingCurve->code,
                    'formula_type' => $ratingCurve->formula_type,
                    'formula_display' => $ratingCurve->formula_string,
                    'parameters' => $ratingCurve->formula_parameters,
                    'effective_date' => $ratingCurve->effective_date->format('Y-m-d')
                ],
                'date_range' => [
                    'start' => $request->start_date,
                    'end' => $request->end_date
                ],
                'total_records' => count($results),
                'saved_to_database' => $saveResults,
                'results' => $results,
                'summary' => [
                    'avg_new_discharge' => round(collect($results)->avg('new_discharge'), 4),
                    'max_new_discharge' => round(collect($results)->max('new_discharge'), 4),
                    'min_new_discharge' => round(collect($results)->min('new_discharge'), 4),
                    'avg_difference' => $existing ? round(collect($results)->avg('difference'), 4) : null,
                    'max_difference' => $existing ? round(collect($results)->max('difference'), 4) : null,
                ]
            ], $saveResults ? 'Discharges berhasil dihitung ulang dan disimpan' : 'Perbandingan discharge berhasil dihitung');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghitung ulang discharge: ' . $e->getMessage());
        }
    }
    
    /**
     * Compare discharge calculations between two rating curves.
     */
    public function compareRatingCurves(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sensor_code' => 'required|string|exists:mas_sensors,code',
            'rating_curve_1_id' => 'required|exists:rating_curves,id',
            'rating_curve_2_id' => 'required|exists:rating_curves,id|different:rating_curve_1_id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            // Get both rating curves
            $curve1 = RatingCurve::findOrFail($request->rating_curve_1_id);
            $curve2 = RatingCurve::findOrFail($request->rating_curve_2_id);
            
            // Verify both curves belong to this sensor
            if ($curve1->mas_sensor_code !== $request->sensor_code || $curve2->mas_sensor_code !== $request->sensor_code) {
                return $this->validationErrorResponse([
                    'rating_curves' => ['Kedua rating curve harus untuk sensor yang sama']
                ]);
            }

            // Get data actuals in date range
            $dataActuals = DataActual::where('mas_sensor_code', $request->sensor_code)
                ->whereBetween('received_at', [$request->start_date, $request->end_date])
                ->orderBy('received_at')
                ->get();

            if ($dataActuals->isEmpty()) {
                return $this->notFoundResponse('Tidak ada data actual dalam rentang tanggal tersebut');
            }

            $comparisons = [];

            foreach ($dataActuals as $dataActual) {
                $discharge1 = $curve1->calculateDischarge($dataActual->value);
                $discharge2 = $curve2->calculateDischarge($dataActual->value);
                
                $comparisons[] = [
                    'timestamp' => $dataActual->received_at->format('Y-m-d H:i:s'),
                    'water_level' => $dataActual->value,
                    'curve_1_discharge' => round($discharge1, 4),
                    'curve_2_discharge' => round($discharge2, 4),
                    'difference' => round($discharge2 - $discharge1, 4),
                    'difference_percent' => $discharge1 > 0 
                        ? round((($discharge2 - $discharge1) / $discharge1) * 100, 2)
                        : null
                ];
            }

            return $this->successResponse([
                'sensor_code' => $request->sensor_code,
                'rating_curve_1' => [
                    'id' => $curve1->id,
                    'code' => $curve1->code,
                    'formula_display' => $curve1->formula_string,
                    'parameters' => $curve1->formula_parameters,
                    'effective_date' => $curve1->effective_date->format('Y-m-d')
                ],
                'rating_curve_2' => [
                    'id' => $curve2->id,
                    'code' => $curve2->code,
                    'formula_display' => $curve2->formula_string,
                    'parameters' => $curve2->formula_parameters,
                    'effective_date' => $curve2->effective_date->format('Y-m-d')
                ],
                'date_range' => [
                    'start' => $request->start_date,
                    'end' => $request->end_date
                ],
                'total_records' => count($comparisons),
                'comparisons' => $comparisons,
                'summary' => [
                    'avg_curve_1' => round(collect($comparisons)->avg('curve_1_discharge'), 4),
                    'avg_curve_2' => round(collect($comparisons)->avg('curve_2_discharge'), 4),
                    'avg_difference' => round(collect($comparisons)->avg('difference'), 4),
                    'max_difference' => round(collect($comparisons)->max('difference'), 4),
                    'min_difference' => round(collect($comparisons)->min('difference'), 4),
                    'avg_difference_percent' => round(collect($comparisons)->whereNotNull('difference_percent')->avg('difference_percent'), 2)
                ]
            ], 'Perbandingan rating curves berhasil dihitung');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal membandingkan rating curves: ' . $e->getMessage());
        }
    }
    
    /**
     * Recalculate PREDICTED discharges using a specific rating curve.
     * Same as recalculateWithRatingCurve but for predictions.
     */
    public function recalculatePredictedWithRatingCurve(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sensor_code' => 'required|string|exists:mas_sensors,code',
            'rating_curve_id' => 'required|exists:rating_curves,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'save_results' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            // Get the rating curve
            $ratingCurve = RatingCurve::findOrFail($request->rating_curve_id);
            
            // Verify rating curve belongs to this sensor
            if ($ratingCurve->mas_sensor_code !== $request->sensor_code) {
                return $this->validationErrorResponse([
                    'rating_curve_id' => ['Rating curve tidak sesuai dengan sensor']
                ]);
            }

            // Get data predictions in date range
            $dataPredictions = DataPrediction::where('mas_sensor_code', $request->sensor_code)
                ->whereBetween('prediction_for_ts', [$request->start_date, $request->end_date])
                ->orderBy('prediction_for_ts')
                ->get();

            if ($dataPredictions->isEmpty()) {
                return $this->notFoundResponse('Tidak ada data prediction dalam rentang tanggal tersebut');
            }

            $results = [];
            $saveResults = $request->get('save_results', false);

            DB::beginTransaction();

            foreach ($dataPredictions as $dataPrediction) {
                // Calculate discharge with the specified rating curve
                $newDischarge = $ratingCurve->calculateDischarge($dataPrediction->predicted_value);
                
                // Get existing predicted calculated discharge (if any)
                $existing = PredictedCalculatedDischarge::where('mas_sensor_code', $request->sensor_code)
                    ->where('calculated_at', $dataPrediction->prediction_for_ts)
                    ->first();
                
                $result = [
                    'timestamp' => $dataPrediction->prediction_for_ts->format('Y-m-d H:i:s'),
                    'predicted_water_level' => $dataPrediction->predicted_value,
                    'new_discharge' => round($newDischarge, 4),
                    'confidence_score' => $dataPrediction->confidence_score,
                    'new_rating_curve' => [
                        'code' => $ratingCurve->code,
                        'formula' => $ratingCurve->formula_string,
                        'effective_date' => $ratingCurve->effective_date->format('Y-m-d')
                    ]
                ];
                
                if ($existing) {
                    $result['old_discharge'] = $existing->predicted_discharge;
                    $result['old_rating_curve'] = [
                        'code' => $existing->rating_curve_code,
                        'formula' => $existing->ratingCurve->formula_string ?? 'N/A'
                    ];
                    $result['difference'] = round($newDischarge - $existing->predicted_discharge, 4);
                    $result['difference_percent'] = $existing->predicted_discharge > 0 
                        ? round((($newDischarge - $existing->predicted_discharge) / $existing->predicted_discharge) * 100, 2)
                        : null;
                }
                
                // Save if requested
                if ($saveResults) {
                    PredictedCalculatedDischarge::updateOrCreate(
                        [
                            'mas_sensor_code' => $request->sensor_code,
                            'calculated_at' => $dataPrediction->prediction_for_ts
                        ],
                        [
                            'predicted_value' => $dataPrediction->predicted_value,
                            'predicted_discharge' => $newDischarge,
                            'rating_curve_code' => $ratingCurve->code
                        ]
                    );
                }
                
                $results[] = $result;
            }

            if ($saveResults) {
                DB::commit();
            } else {
                DB::rollBack();
            }

            return $this->successResponse([
                'sensor_code' => $request->sensor_code,
                'rating_curve' => [
                    'id' => $ratingCurve->id,
                    'code' => $ratingCurve->code,
                    'formula_type' => $ratingCurve->formula_type,
                    'formula_display' => $ratingCurve->formula_string,
                    'parameters' => $ratingCurve->formula_parameters,
                    'effective_date' => $ratingCurve->effective_date->format('Y-m-d')
                ],
                'date_range' => [
                    'start' => $request->start_date,
                    'end' => $request->end_date
                ],
                'total_records' => count($results),
                'saved_to_database' => $saveResults,
                'results' => $results,
                'summary' => [
                    'avg_new_discharge' => round(collect($results)->avg('new_discharge'), 4),
                    'max_new_discharge' => round(collect($results)->max('new_discharge'), 4),
                    'min_new_discharge' => round(collect($results)->min('new_discharge'), 4),
                    'avg_difference' => $existing ? round(collect($results)->avg('difference'), 4) : null,
                    'max_difference' => $existing ? round(collect($results)->max('difference'), 4) : null,
                ]
            ], $saveResults ? 'Predicted discharges berhasil dihitung ulang dan disimpan' : 'Perbandingan predicted discharge berhasil dihitung');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghitung ulang predicted discharge: ' . $e->getMessage());
        }
    }
    
    /**
     * Compare predicted discharge calculations between two rating curves.
     */
    public function comparePredictedRatingCurves(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sensor_code' => 'required|string|exists:mas_sensors,code',
            'rating_curve_1_id' => 'required|exists:rating_curves,id',
            'rating_curve_2_id' => 'required|exists:rating_curves,id|different:rating_curve_1_id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            // Get both rating curves
            $curve1 = RatingCurve::findOrFail($request->rating_curve_1_id);
            $curve2 = RatingCurve::findOrFail($request->rating_curve_2_id);
            
            // Verify both curves belong to this sensor
            if ($curve1->mas_sensor_code !== $request->sensor_code || $curve2->mas_sensor_code !== $request->sensor_code) {
                return $this->validationErrorResponse([
                    'rating_curves' => ['Kedua rating curve harus untuk sensor yang sama']
                ]);
            }

            // Get data predictions in date range
            $dataPredictions = DataPrediction::where('mas_sensor_code', $request->sensor_code)
                ->whereBetween('prediction_for_ts', [$request->start_date, $request->end_date])
                ->orderBy('prediction_for_ts')
                ->get();

            if ($dataPredictions->isEmpty()) {
                return $this->notFoundResponse('Tidak ada data prediction dalam rentang tanggal tersebut');
            }

            $comparisons = [];

            foreach ($dataPredictions as $dataPrediction) {
                $discharge1 = $curve1->calculateDischarge($dataPrediction->predicted_value);
                $discharge2 = $curve2->calculateDischarge($dataPrediction->predicted_value);
                
                $comparisons[] = [
                    'timestamp' => $dataPrediction->prediction_for_ts->format('Y-m-d H:i:s'),
                    'predicted_water_level' => $dataPrediction->predicted_value,
                    'confidence_score' => $dataPrediction->confidence_score,
                    'curve_1_discharge' => round($discharge1, 4),
                    'curve_2_discharge' => round($discharge2, 4),
                    'difference' => round($discharge2 - $discharge1, 4),
                    'difference_percent' => $discharge1 > 0 
                        ? round((($discharge2 - $discharge1) / $discharge1) * 100, 2)
                        : null
                ];
            }

            return $this->successResponse([
                'sensor_code' => $request->sensor_code,
                'rating_curve_1' => [
                    'id' => $curve1->id,
                    'code' => $curve1->code,
                    'formula_display' => $curve1->formula_string,
                    'parameters' => $curve1->formula_parameters,
                    'effective_date' => $curve1->effective_date->format('Y-m-d')
                ],
                'rating_curve_2' => [
                    'id' => $curve2->id,
                    'code' => $curve2->code,
                    'formula_display' => $curve2->formula_string,
                    'parameters' => $curve2->formula_parameters,
                    'effective_date' => $curve2->effective_date->format('Y-m-d')
                ],
                'date_range' => [
                    'start' => $request->start_date,
                    'end' => $request->end_date
                ],
                'total_records' => count($comparisons),
                'comparisons' => $comparisons,
                'summary' => [
                    'avg_curve_1' => round(collect($comparisons)->avg('curve_1_discharge'), 4),
                    'avg_curve_2' => round(collect($comparisons)->avg('curve_2_discharge'), 4),
                    'avg_difference' => round(collect($comparisons)->avg('difference'), 4),
                    'max_difference' => round(collect($comparisons)->max('difference'), 4),
                    'min_difference' => round(collect($comparisons)->min('difference'), 4),
                    'avg_difference_percent' => round(collect($comparisons)->whereNotNull('difference_percent')->avg('difference_percent'), 2),
                    'avg_confidence_score' => round(collect($comparisons)->avg('confidence_score'), 4)
                ]
            ], 'Perbandingan predicted rating curves berhasil dihitung');

        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal membandingkan predicted rating curves: ' . $e->getMessage());
        }
    }
    
    /**
     * Batch calculate predicted discharges for a sensor.
     */
    public function batchCalculatePredictedForSensor(Request $request, $sensorCode)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Verify sensor exists and is water level
            $sensor = MasSensor::where('code', $sensorCode)->first();
            if (!$sensor) {
                return $this->notFoundResponse('Sensor tidak ditemukan');
            }

            if ($sensor->parameter !== 'water_level') {
                return $this->validationErrorResponse([
                    'sensor' => ['Discharge hanya dapat dihitung untuk sensor water level']
                ]);
            }

            // Get active rating curve
            $ratingCurve = RatingCurve::getActiveForSensor($sensorCode);
            if (!$ratingCurve) {
                return $this->notFoundResponse('Tidak ada rating curve aktif untuk sensor ini');
            }

            // Get data predictions in date range
            $dataPredictions = DataPrediction::where('mas_sensor_code', $sensorCode)
                ->whereBetween('prediction_for_ts', [$request->start_date, $request->end_date])
                ->get();

            $processed = 0;
            $errors = [];

            foreach ($dataPredictions as $dataPrediction) {
                try {
                    $discharge = $ratingCurve->calculateDischarge($dataPrediction->predicted_value);

                    PredictedCalculatedDischarge::updateOrCreate(
                        [
                            'mas_sensor_code' => $sensorCode,
                            'calculated_at' => $dataPrediction->prediction_for_ts
                        ],
                        [
                            'predicted_value' => $dataPrediction->predicted_value,
                            'predicted_discharge' => $discharge,
                            'rating_curve_code' => $ratingCurve->code
                        ]
                    );

                    $processed++;
                } catch (\Exception $e) {
                    $errors[] = "Error at {$dataPrediction->prediction_for_ts}: {$e->getMessage()}";
                }
            }

            DB::commit();

            return $this->successResponse([
                'sensor_code' => $sensorCode,
                'total_records' => $dataPredictions->count(),
                'processed' => $processed,
                'errors' => $errors
            ], "Batch calculation completed. {$processed} predicted discharges calculated.");
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal melakukan batch calculation: ' . $e->getMessage());
        }
    }
}

