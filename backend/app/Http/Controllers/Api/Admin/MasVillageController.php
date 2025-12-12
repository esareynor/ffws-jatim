<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasVillage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasVillageController extends Controller
{
    use ApiResponseTraits;

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');

            $query = MasVillage::query();

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $villages = $query->paginate($perPage);

            return $this->paginatedResponse($villages, 'Villages retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve villages: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:mas_villages,code',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $village = MasVillage::create($validator->validated());

            return $this->createdResponse($village, 'Village created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create village: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $village = MasVillage::findOrFail($id);
            return $this->successResponse($village, 'Village retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Village not found');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $village = MasVillage::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:100|unique:mas_villages,code,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $village->update($validator->validated());

            return $this->updatedResponse($village, 'Village updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update village: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $village = MasVillage::findOrFail($id);
            $village->delete();

            return $this->deletedResponse('Village deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete village: ' . $e->getMessage());
        }
    }
}

