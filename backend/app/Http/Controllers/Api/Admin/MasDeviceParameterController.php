<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasDeviceParameter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasDeviceParameterController extends Controller
{
    use ApiResponseTraits;

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');

            $query = MasDeviceParameter::query();

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

            return $this->paginatedResponse($parameters, 'Device parameters retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve device parameters: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:mas_device_parameters,code',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $parameter = MasDeviceParameter::create($validator->validated());

            return $this->createdResponse($parameter, 'Device parameter created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create device parameter: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $parameter = MasDeviceParameter::findOrFail($id);
            return $this->successResponse($parameter, 'Device parameter retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Device parameter not found');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $parameter = MasDeviceParameter::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:100|unique:mas_device_parameters,code,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $parameter->update($validator->validated());

            return $this->updatedResponse($parameter, 'Device parameter updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update device parameter: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $parameter = MasDeviceParameter::findOrFail($id);
            $parameter->delete();

            return $this->deletedResponse('Device parameter deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete device parameter: ' . $e->getMessage());
        }
    }
}

