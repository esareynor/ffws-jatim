<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasRegency;
use App\Models\MasCity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegencyController extends Controller
{
    /**
     * Display a listing of regencies.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $cityCode = $request->input('city_code');

        $query = MasRegency::with('city.province')->withCount('villages');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('regencies_name', 'like', "%{$search}%")
                  ->orWhere('regencies_code', 'like', "%{$search}%");
            });
        }

        if ($cityCode) {
            $query->where('cities_code', $cityCode);
        }

        $regencies = $query->orderBy('regencies_name', 'asc')->paginate($perPage);
        $cities = MasCity::with('province')->orderBy('name', 'asc')->get();

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $regencies
            ]);
        }

        return view('admin.region.regencies.index', compact('regencies', 'cities'));
    }

    /**
     * Store a newly created regency.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'regencies_name' => 'required|string|max:255',
            'regencies_code' => 'required|string|max:100|unique:mas_regencies,regencies_code',
            'cities_code' => 'required|string|max:100|exists:mas_cities,code',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $regency = MasRegency::create($request->all());
            $regency->load('city.province');

            return response()->json([
                'success' => true,
                'message' => 'Regency created successfully',
                'data' => $regency
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create regency: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified regency.
     */
    public function update(Request $request, $id)
    {
        $regency = MasRegency::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'regencies_name' => 'required|string|max:255',
            'regencies_code' => 'required|string|max:100|unique:mas_regencies,regencies_code,' . $id,
            'cities_code' => 'required|string|max:100|exists:mas_cities,code',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $regency->update($request->all());
            $regency->load('city.province');

            return response()->json([
                'success' => true,
                'message' => 'Regency updated successfully',
                'data' => $regency
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update regency: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified regency.
     */
    public function destroy($id)
    {
        try {
            $regency = MasRegency::findOrFail($id);

            // Check if regency has villages
            if ($regency->villages()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete regency with existing villages'
                ], 422);
            }

            $regency->delete();

            return response()->json([
                'success' => true,
                'message' => 'Regency deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete regency: ' . $e->getMessage()
            ], 500);
        }
    }
}
