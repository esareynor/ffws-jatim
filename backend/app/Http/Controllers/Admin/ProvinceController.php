<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasProvince;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProvinceController extends Controller
{
    /**
     * Display a listing of provinces.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');

        $query = MasProvince::withCount('cities');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('provinces_name', 'like', "%{$search}%")
                  ->orWhere('provinces_code', 'like', "%{$search}%");
            });
        }

        $provinces = $query->orderBy('provinces_name', 'asc')->paginate($perPage);

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'provinces_code', 'label' => 'Kode', 'sortable' => true],
            ['key' => 'provinces_name', 'label' => 'Nama Provinsi', 'sortable' => true],
            ['key' => 'formatted_cities_count', 'label' => 'Jumlah Kota'],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions']
        ];

        // Transform data for table component
        $provinces->getCollection()->transform(function ($province) {
            $province->formatted_cities_count = '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">'
                . $province->cities_count . ' kota</span>';

            $province->actions = [
                [
                    'type' => 'edit',
                    'label' => 'Edit',
                    'url' => '#',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => "window.dispatchEvent(new CustomEvent('open-edit-province', { detail: " . json_encode($province) . " }))"
                ],
                [
                    'type' => 'delete',
                    'label' => 'Hapus',
                    'url' => route('admin.region.provinces.destroy', $province->id),
                    'icon' => 'trash',
                    'color' => 'red',
                    'method' => 'DELETE',
                    'confirm' => 'Apakah Anda yakin ingin menghapus provinsi ini?'
                ]
            ];
            return $province;
        });

        if ($request->ajax()) {
            return response()->json([
                'success' => true,
                'data' => $provinces
            ]);
        }

        return view('admin.region.provinces.index', compact('provinces', 'tableHeaders'));
    }

    /**
     * Store a newly created province.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provinces_name' => 'required|string|max:255',
            'provinces_code' => 'required|string|max:100|unique:mas_provinces,provinces_code',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $province = MasProvince::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Province created successfully',
                'data' => $province
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create province: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified province.
     */
    public function update(Request $request, $id)
    {
        $province = MasProvince::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'provinces_name' => 'required|string|max:255',
            'provinces_code' => 'required|string|max:100|unique:mas_provinces,provinces_code,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $province->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Province updated successfully',
                'data' => $province
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update province: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified province.
     */
    public function destroy($id)
    {
        try {
            $province = MasProvince::findOrFail($id);
            
            // Check if province has cities
            if ($province->cities()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete province with existing cities'
                ], 422);
            }

            $province->delete();

            return response()->json([
                'success' => true,
                'message' => 'Province deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete province: ' . $e->getMessage()
            ], 500);
        }
    }
}
