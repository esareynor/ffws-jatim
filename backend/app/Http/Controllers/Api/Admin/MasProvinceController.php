<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasProvince;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasProvinceController extends Controller
{
    use ApiResponseTraits;

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');

            $query = MasProvince::query();

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('provinces_name', 'like', "%{$search}%")
                      ->orWhere('provinces_code', 'like', "%{$search}%");
                });
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $provinces = $query->paginate($perPage);

            return $this->paginatedResponse($provinces, 'Provinces retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve provinces: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'provinces_name' => 'required|string|max:255',
                'provinces_code' => 'required|string|max:100|unique:mas_provinces,provinces_code',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $province = MasProvince::create($validator->validated());

            return $this->createdResponse($province, 'Province created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create province: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $province = MasProvince::findOrFail($id);
            return $this->successResponse($province, 'Province retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Province not found');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $province = MasProvince::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'provinces_name' => 'sometimes|required|string|max:255',
                'provinces_code' => 'sometimes|required|string|max:100|unique:mas_provinces,provinces_code,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $province->update($validator->validated());

            return $this->updatedResponse($province, 'Province updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update province: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $province = MasProvince::findOrFail($id);
            $province->delete();

            return $this->deletedResponse('Province deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete province: ' . $e->getMessage());
        }
    }
}

