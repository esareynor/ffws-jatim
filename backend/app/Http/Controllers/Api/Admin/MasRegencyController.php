<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasRegency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasRegencyController extends Controller
{
    use ApiResponseTraits;

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');

            $query = MasRegency::query();

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('regencies_name', 'like', "%{$search}%")
                      ->orWhere('regencies_code', 'like', "%{$search}%");
                });
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $regencies = $query->paginate($perPage);

            return $this->paginatedResponse($regencies, 'Regencies retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve regencies: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'regencies_name' => 'required|string|max:255',
                'regencies_code' => 'required|string|max:100|unique:mas_regencies,regencies_code',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $regency = MasRegency::create($validator->validated());

            return $this->createdResponse($regency, 'Regency created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create regency: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $regency = MasRegency::findOrFail($id);
            return $this->successResponse($regency, 'Regency retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Regency not found');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $regency = MasRegency::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'regencies_name' => 'sometimes|required|string|max:255',
                'regencies_code' => 'sometimes|required|string|max:100|unique:mas_regencies,regencies_code,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $regency->update($validator->validated());

            return $this->updatedResponse($regency, 'Regency updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update regency: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $regency = MasRegency::findOrFail($id);
            $regency->delete();

            return $this->deletedResponse('Regency deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete regency: ' . $e->getMessage());
        }
    }
}

