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

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'regencies_code', 'label' => 'Kode', 'sortable' => true],
            ['key' => 'regencies_name', 'label' => 'Nama Kecamatan', 'sortable' => true],
            ['key' => 'formatted_city', 'label' => 'Kota/Kabupaten'],
            ['key' => 'formatted_province', 'label' => 'Provinsi'],
            ['key' => 'formatted_villages_count', 'label' => 'Jumlah Desa'],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions']
        ];

        // Transform data for table component
        $regencies->getCollection()->transform(function ($regency) {
            $regency->formatted_city = $regency->city->name ?? '-';
            $regency->formatted_province = '<span class="text-xs text-gray-500 dark:text-gray-500">' 
                . ($regency->city->province->provinces_name ?? '-') . '</span>';
            $regency->formatted_villages_count = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">'
                . $regency->villages_count . ' desa</span>';

            $regency->actions = [
                [
                    'type' => 'edit',
                    'label' => 'Edit',
                    'url' => '#',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => "window.dispatchEvent(new CustomEvent('open-edit-regency', { detail: " . json_encode($regency) . " }))"
                ],
                [
                    'type' => 'delete',
                    'label' => 'Hapus',
                    'url' => route('admin.region.regencies.destroy', $regency->id),
                    'icon' => 'trash',
                    'color' => 'red',
                    'method' => 'DELETE',
                    'confirm' => 'Apakah Anda yakin ingin menghapus kecamatan ini?'
                ]
            ];
            return $regency;
        });

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $regencies
            ]);
        }

        return view('admin.region.regencies.index', compact('regencies', 'cities', 'tableHeaders'));
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
