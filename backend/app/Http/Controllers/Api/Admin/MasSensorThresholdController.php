<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasSensorThreshold;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasSensorThresholdController extends Controller
{
    use ApiResponseTraits;

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');

            $query = MasSensorThreshold::query();

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('sensor_thresholds_name', 'like', "%{$search}%")
                      ->orWhere('sensor_thresholds_code', 'like', "%{$search}%");
                });
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $thresholds = $query->paginate($perPage);

            return $this->paginatedResponse($thresholds, 'Sensor thresholds retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve sensor thresholds: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'sensor_thresholds_name' => 'required|string|max:255',
                'sensor_thresholds_code' => 'required|string|max:100|unique:mas_sensor_thresholds,sensor_thresholds_code',
                'sensor_thresholds_value_1' => 'nullable|numeric|min:0',
                'sensor_thresholds_value_1_color' => 'nullable|string|max:20',
                'sensor_thresholds_value_2' => 'nullable|numeric|min:0',
                'sensor_thresholds_value_2_color' => 'nullable|string|max:20',
                'sensor_thresholds_value_3' => 'nullable|numeric|min:0',
                'sensor_thresholds_value_3_color' => 'nullable|string|max:20',
                'sensor_thresholds_value_4' => 'nullable|numeric|min:0',
                'sensor_thresholds_value_4_color' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $threshold = MasSensorThreshold::create($validator->validated());

            return $this->createdResponse($threshold, 'Sensor threshold created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create sensor threshold: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $threshold = MasSensorThreshold::findOrFail($id);
            return $this->successResponse($threshold, 'Sensor threshold retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Sensor threshold not found');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $threshold = MasSensorThreshold::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'sensor_thresholds_name' => 'sometimes|required|string|max:255',
                'sensor_thresholds_code' => 'sometimes|required|string|max:100|unique:mas_sensor_thresholds,sensor_thresholds_code,' . $id,
                'sensor_thresholds_value_1' => 'nullable|numeric|min:0',
                'sensor_thresholds_value_1_color' => 'nullable|string|max:20',
                'sensor_thresholds_value_2' => 'nullable|numeric|min:0',
                'sensor_thresholds_value_2_color' => 'nullable|string|max:20',
                'sensor_thresholds_value_3' => 'nullable|numeric|min:0',
                'sensor_thresholds_value_3_color' => 'nullable|string|max:20',
                'sensor_thresholds_value_4' => 'nullable|numeric|min:0',
                'sensor_thresholds_value_4_color' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $threshold->update($validator->validated());

            return $this->updatedResponse($threshold, 'Sensor threshold updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update sensor threshold: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $threshold = MasSensorThreshold::findOrFail($id);
            $threshold->delete();

            return $this->deletedResponse('Sensor threshold deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete sensor threshold: ' . $e->getMessage());
        }
    }
}

