<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasVillage;
use App\Models\MasRegency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VillageController extends Controller
{
    /**
     * Display a listing of villages.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $regencyCode = $request->input('regency_code');

        $query = MasVillage::with('regency.city.province');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($regencyCode) {
            $query->where('regencies_code', $regencyCode);
        }

        $villages = $query->orderBy('name', 'asc')->paginate($perPage);
        $regencies = MasRegency::with('city')->orderBy('regencies_name', 'asc')->get();

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'code', 'label' => 'Kode', 'sortable' => true],
            ['key' => 'name', 'label' => 'Nama Desa/Kelurahan', 'sortable' => true],
            ['key' => 'formatted_regency', 'label' => 'Kecamatan'],
            ['key' => 'formatted_city', 'label' => 'Kota/Kabupaten'],
            ['key' => 'formatted_province', 'label' => 'Provinsi'],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions']
        ];

        // Transform data for table component
        $villages->getCollection()->transform(function ($village) {
            $village->formatted_regency = $village->regency->regencies_name ?? '-';
            $village->formatted_city = '<span class="text-xs text-gray-500 dark:text-gray-500">' 
                . ($village->regency->city->name ?? '-') . '</span>';
            $village->formatted_province = '<span class="text-xs text-gray-400 dark:text-gray-600">' 
                . ($village->regency->city->province->provinces_name ?? '-') . '</span>';

            $village->actions = [
                [
                    'type' => 'edit',
                    'label' => 'Edit',
                    'url' => '#',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => "window.dispatchEvent(new CustomEvent('open-edit-village', { detail: " . json_encode($village) . " }))"
                ],
                [
                    'type' => 'delete',
                    'label' => 'Hapus',
                    'url' => route('admin.region.villages.destroy', $village->id),
                    'icon' => 'trash',
                    'color' => 'red',
                    'method' => 'DELETE',
                    'confirm' => 'Apakah Anda yakin ingin menghapus desa/kelurahan ini?'
                ]
            ];
            return $village;
        });

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $villages
            ]);
        }

        return view('admin.region.villages.index', compact('villages', 'regencies', 'tableHeaders'));
    }

    /**
     * Store a newly created village.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_villages,code',
            'regencies_code' => 'required|string|max:100|exists:mas_regencies,regencies_code',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $village = MasVillage::create($request->all());
            $village->load('regency.city.province');

            return response()->json([
                'success' => true,
                'message' => 'Village created successfully',
                'data' => $village
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create village: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified village.
     */
    public function update(Request $request, $id)
    {
        $village = MasVillage::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_villages,code,' . $id,
            'regencies_code' => 'required|string|max:100|exists:mas_regencies,regencies_code',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $village->update($request->all());
            $village->load('regency.city.province');

            return response()->json([
                'success' => true,
                'message' => 'Village updated successfully',
                'data' => $village
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update village: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified village.
     */
    public function destroy($id)
    {
        try {
            $village = MasVillage::findOrFail($id);
            $village->delete();

            return response()->json([
                'success' => true,
                'message' => 'Village deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete village: ' . $e->getMessage()
            ], 500);
        }
    }
}
