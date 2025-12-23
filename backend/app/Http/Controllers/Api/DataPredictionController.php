<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\DataPrediction;
use App\Models\MasSensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DataPredictionController extends Controller
{
    use ApiResponseTraits;

    /**
     * Display a listing of data predictions.
     */
    public function index(Request $request)
    {
        try {
            $query = DataPrediction::with('masSensor:code,name,parameter,unit', 'masModel:code,name');

            // Filter by sensor
            if ($request->has('sensor_code')) {
                $query->where('mas_sensor_code', $request->sensor_code);
            }

            // Filter by model
            if ($request->has('model_code')) {
                $query->where('mas_model_code', $request->model_code);
            }

            // Filter by date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('prediction_run_at', [$request->start_date, $request->end_date]);
            }

            // Filter by threshold status
            if ($request->has('threshold_status')) {
                $query->where('threshold_prediction_status', $request->threshold_status);
            }

            // Sort
            $sortBy = $request->get('sort_by', 'prediction_run_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 100);
            $predictions = $query->paginate($perPage);

            return $this->successResponse($predictions, 'Data predictions berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Store prediction data.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mas_sensor_code' => 'required|string|exists:mas_sensors,code',
            'mas_model_code' => 'required|string|max:100|exists:mas_models,code',
            'predicted_value' => 'required|numeric',
            'prediction_run_at' => 'required|date',
            'prediction_for_ts' => 'required|date',
            'confidence_score' => 'nullable|numeric|between:0,1',
            'threshold_prediction_status' => 'nullable|in:safe,warning,danger'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Get sensor
            $sensor = MasSensor::where('code', $request->mas_sensor_code)->firstOrFail();

            // Create data prediction
            $prediction = DataPrediction::create([
                'mas_sensor_code' => $request->mas_sensor_code,
                'mas_model_code' => $request->mas_model_code,
                'predicted_value' => $request->predicted_value,
                'prediction_run_at' => $request->prediction_run_at,
                'prediction_for_ts' => $request->prediction_for_ts,
                'confidence_score' => $request->confidence_score ?? 0.8,
                'threshold_prediction_status' => $request->threshold_prediction_status ?? 'safe'
            ]);

            DB::commit();

            return $this->successResponse(
                $prediction->load('masSensor', 'masModel'),
                'Data prediction berhasil disimpan',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menyimpan data: ' . $e->getMessage());
        }
    }

    /**
     * Get predictions by sensor.
     */
    public function getBySensor($sensorCode, Request $request)
    {
        try {
            $query = DataPrediction::where('mas_sensor_code', $sensorCode);

            // Filter by date range if provided
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('prediction_for_ts', [
                    $request->start_date,
                    $request->end_date
                ]);
            }

            // Sort
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy('prediction_for_ts', $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 100);
            $data = $query->paginate($perPage);

            return $this->successResponse($data, 'Data berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Get latest predictions for a sensor.
     */
    public function getLatest($sensorCode = null)
    {
        try {
            $query = DataPrediction::with('masSensor:code,name,parameter,unit', 'masModel:code,name');

            if ($sensorCode) {
                $query->where('mas_sensor_code', $sensorCode);
            }

            $latestPredictions = $query
                ->orderBy('prediction_run_at', 'desc')
                ->limit(50)
                ->get();

            return $this->successResponse($latestPredictions, 'Latest predictions berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified data prediction.
     */
    public function show($id)
    {
        try {
            $prediction = DataPrediction::with('masSensor:code,name,parameter,unit', 'masModel:code,name')
                ->findOrFail($id);

            return $this->successResponse($prediction, 'Data berhasil diambil');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Data tidak ditemukan');
        }
    }

    /**
     * Update the specified data prediction.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'predicted_value' => 'sometimes|required|numeric',
            'confidence_score' => 'nullable|numeric|between:0,1',
            'threshold_prediction_status' => 'nullable|in:safe,warning,danger'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $prediction = DataPrediction::findOrFail($id);

            DB::beginTransaction();

            if ($request->has('predicted_value')) {
                $prediction->predicted_value = $request->predicted_value;
            }

            if ($request->has('confidence_score')) {
                $prediction->confidence_score = $request->confidence_score;
            }

            if ($request->has('threshold_prediction_status')) {
                $prediction->threshold_prediction_status = $request->threshold_prediction_status;
            }

            $prediction->save();

            DB::commit();

            return $this->successResponse(
                $prediction->load('masSensor', 'masModel'),
                'Data berhasil diupdate'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal mengupdate data: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified data prediction.
     */
    public function destroy($id)
    {
        try {
            $prediction = DataPrediction::findOrFail($id);

            DB::beginTransaction();

            $prediction->delete();

            DB::commit();

            return $this->successResponse(null, 'Data berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghapus data: ' . $e->getMessage());
        }
    }
}

