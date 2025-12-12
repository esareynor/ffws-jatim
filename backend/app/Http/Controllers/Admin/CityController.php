<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasCity;
use App\Models\MasProvince;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CityController extends Controller
{
    /**
     * Display a listing of cities.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $provinceCode = $request->input('province_code');

        $query = MasCity::with('province')->withCount('regencies');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($provinceCode) {
            $query->where('provinces_code', $provinceCode);
        }

        $cities = $query->orderBy('name', 'asc')->paginate($perPage);
        $provinces = MasProvince::orderBy('provinces_name', 'asc')->get();

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $cities
            ]);
        }

        return view('admin.region.cities.index', compact('cities', 'provinces'));
    }

    /**
     * Store a newly created city.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_cities,code',
            'provinces_code' => 'required|string|max:100|exists:mas_provinces,provinces_code',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $city = MasCity::create($request->all());
            $city->load('province');

            return response()->json([
                'success' => true,
                'message' => 'City created successfully',
                'data' => $city
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create city: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified city.
     */
    public function update(Request $request, $id)
    {
        $city = MasCity::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_cities,code,' . $id,
            'provinces_code' => 'required|string|max:100|exists:mas_provinces,provinces_code',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $city->update($request->all());
            $city->load('province');

            return response()->json([
                'success' => true,
                'message' => 'City updated successfully',
                'data' => $city
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update city: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified city.
     */
    public function destroy($id)
    {
        try {
            $city = MasCity::findOrFail($id);

            // Check if city has regencies
            if ($city->regencies()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete city with existing regencies'
                ], 422);
            }

            $city->delete();

            return response()->json([
                'success' => true,
                'message' => 'City deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete city: ' . $e->getMessage()
            ], 500);
        }
    }
}
