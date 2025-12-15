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

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'code', 'label' => 'Kode', 'sortable' => true],
            ['key' => 'name', 'label' => 'Nama Kota/Kabupaten', 'sortable' => true],
            ['key' => 'formatted_province', 'label' => 'Provinsi'],
            ['key' => 'formatted_regencies_count', 'label' => 'Jumlah Kecamatan'],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions']
        ];

        // Transform data for table component
        $cities->getCollection()->transform(function ($city) {
            $city->formatted_province = $city->province->provinces_name ?? '-';
            $city->formatted_regencies_count = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">'
                . $city->regencies_count . ' kecamatan</span>';

            $city->actions = [
                [
                    'type' => 'edit',
                    'label' => 'Edit',
                    'url' => '#',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => "window.dispatchEvent(new CustomEvent('open-edit-city', { detail: " . json_encode($city) . " }))"
                ],
                [
                    'type' => 'delete',
                    'label' => 'Hapus',
                    'url' => route('admin.region.cities.destroy', $city->id),
                    'icon' => 'trash',
                    'color' => 'red',
                    'method' => 'DELETE',
                    'confirm' => 'Apakah Anda yakin ingin menghapus kota/kabupaten ini?'
                ]
            ];
            return $city;
        });

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $cities
            ]);
        }

        return view('admin.region.cities.index', compact('cities', 'provinces', 'tableHeaders'));
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
