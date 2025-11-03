<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasCity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MasCityController extends Controller
{
    use ApiResponseTraits;

    /**
     * Display a listing of cities
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');

            $query = MasCity::query();

            // Search functionality
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $cities = $query->paginate($perPage);

            return $this->paginatedResponse($cities, 'Cities retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to retrieve cities: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created city
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:mas_cities,code',
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $city = MasCity::create($validator->validated());

            return $this->createdResponse($city, 'City created successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to create city: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified city
     */
    public function show($id)
    {
        try {
            $city = MasCity::with(['riverBasins', 'upts'])->findOrFail($id);
            return $this->successResponse($city, 'City retrieved successfully');
        } catch (\Exception $e) {
            return $this->notFoundResponse('City not found');
        }
    }

    /**
     * Update the specified city
     */
    public function update(Request $request, $id)
    {
        try {
            $city = MasCity::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:100|unique:mas_cities,code,' . $id,
            ]);

            if ($validator->fails()) {
                return $this->validationErrorResponse($validator->errors());
            }

            $city->update($validator->validated());

            return $this->updatedResponse($city, 'City updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to update city: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified city
     */
    public function destroy($id)
    {
        try {
            $city = MasCity::findOrFail($id);
            $city->delete();

            return $this->deletedResponse('City deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Failed to delete city: ' . $e->getMessage());
        }
    }
}

