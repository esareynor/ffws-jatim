<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasWatershed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasWatershedController extends Controller
{
    use ApiResponseTraits;

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');
            $riverBasinCode = $request->input('river_basin_code');

            $query = MasWatershed::with('riverBasin');

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            }

            if ($riverBasinCode) {
                $query->where('river_basin_code', $riverBasinCode);
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $watersheds = $query->paginate($perPage);

            return $this->paginatedResponse($watersheds, 'Watersheds retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve watersheds: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'river_basin_code' => 'required|string|max:100|exists:mas_river_basins,code',
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:mas_watersheds,code',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $watershed = MasWatershed::create($validator->validated());

            return $this->createdResponse($watershed->load('riverBasin'), 'Watershed created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create watershed: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $watershed = MasWatershed::with('riverBasin')->findOrFail($id);
            return $this->successResponse($watershed, 'Watershed retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Watershed not found');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $watershed = MasWatershed::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'river_basin_code' => 'sometimes|required|string|max:100|exists:mas_river_basins,code',
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:100|unique:mas_watersheds,code,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $watershed->update($validator->validated());

            return $this->updatedResponse($watershed->load('riverBasin'), 'Watershed updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update watershed: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $watershed = MasWatershed::findOrFail($id);
            $watershed->delete();

            return $this->deletedResponse('Watershed deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete watershed: ' . $e->getMessage());
        }
    }
}

