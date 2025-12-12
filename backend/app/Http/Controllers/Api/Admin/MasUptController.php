<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasUpt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasUptController extends Controller
{
    use ApiResponseTraits;

    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');
            $riverBasinCode = $request->input('river_basin_code');
            $cityCode = $request->input('city_code');

            $query = MasUpt::with(['riverBasin', 'cities.province', 'uptds'])
                ->withCount('cities');

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            }

            if ($riverBasinCode) {
                $query->where('river_basin_code', $riverBasinCode);
            }

            if ($cityCode) {
                $query->whereHas('cities', function($q) use ($cityCode) {
                    $q->where('code', $cityCode);
                });
            }

            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $upts = $query->paginate($perPage);

            return $this->paginatedResponse($upts, 'UPTs retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve UPTs: ' . $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'river_basin_code' => 'required|string|max:100|exists:mas_river_basins,code',
                'city_codes' => 'required|array|min:1',
                'city_codes.*' => 'required|string|exists:mas_cities,code',
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:mas_upts,code',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $validated = $validator->validated();

            $upt = MasUpt::create([
                'river_basin_code' => $validated['river_basin_code'],
                'name' => $validated['name'],
                'code' => $validated['code'],
            ]);

            // Attach cities
            $upt->cities()->attach($validated['city_codes']);

            return $this->createdResponse($upt->load(['riverBasin', 'cities.province']), 'UPT created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create UPT: ' . $e->getMessage());
        }
    }

    public function show($id)
    {
        try {
            $upt = MasUpt::with(['riverBasin', 'cities.province', 'uptds'])
                ->withCount('cities')
                ->findOrFail($id);
            return $this->successResponse($upt, 'UPT retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('UPT not found');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $upt = MasUpt::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'river_basin_code' => 'sometimes|required|string|max:100|exists:mas_river_basins,code',
                'city_codes' => 'sometimes|required|array|min:1',
                'city_codes.*' => 'required|string|exists:mas_cities,code',
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:100|unique:mas_upts,code,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $validated = $validator->validated();

            // Update basic fields
            $upt->update([
                'river_basin_code' => $validated['river_basin_code'] ?? $upt->river_basin_code,
                'name' => $validated['name'] ?? $upt->name,
                'code' => $validated['code'] ?? $upt->code,
            ]);

            // Sync cities if provided
            if (isset($validated['city_codes'])) {
                $upt->cities()->sync($validated['city_codes']);
            }

            return $this->updatedResponse($upt->load(['riverBasin', 'cities.province']), 'UPT updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update UPT: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        try {
            $upt = MasUpt::withCount('uptds')->findOrFail($id);

            // Check if UPT has UPTDs
            if ($upt->uptds_count > 0) {
                return $this->validationErrorResponse([
                    'message' => 'Cannot delete UPT that has UPTDs. Please delete UPTDs first.'
                ]);
            }

            // Detach all cities before deleting (cascade will handle this but explicit is better)
            $upt->cities()->detach();

            $upt->delete();

            return $this->deletedResponse('UPT deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete UPT: ' . $e->getMessage());
        }
    }
}

