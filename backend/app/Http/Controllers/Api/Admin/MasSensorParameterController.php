<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasSensorParameter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasSensorParameterController extends Controller
{
    use ApiResponseTraits;

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');

            $query = MasSensorParameter::query();

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $parameters = $query->paginate($perPage);

            return $this->paginatedResponse($parameters, 'Sensor parameters retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve sensor parameters: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:mas_sensor_parameters,code',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $parameter = MasSensorParameter::create($validator->validated());

            return $this->createdResponse($parameter, 'Sensor parameter created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create sensor parameter: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $parameter = MasSensorParameter::findOrFail($id);
            return $this->successResponse($parameter, 'Sensor parameter retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Sensor parameter not found');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $parameter = MasSensorParameter::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:100|unique:mas_sensor_parameters,code,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $parameter->update($validator->validated());

            return $this->updatedResponse($parameter, 'Sensor parameter updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update sensor parameter: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $parameter = MasSensorParameter::findOrFail($id);
            $parameter->delete();

            return $this->deletedResponse('Sensor parameter deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete sensor parameter: ' . $e->getMessage());
        }
    }
}

