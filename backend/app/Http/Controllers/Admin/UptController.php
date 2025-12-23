<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasUpt;
use App\Models\MasRiverBasin;
use App\Models\MasCity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UptController extends Controller
{
    /**
     * Display a listing of UPTs with pagination and filters
     */
    public function index(Request $request)
    {
        $query = MasUpt::with(['riverBasin', 'cities.province'])
            ->withCount('cities');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // River Basin filter
        if ($request->filled('river_basin_code')) {
            $query->where('river_basin_code', $request->river_basin_code);
        }

        // City filter
        if ($request->filled('city_code')) {
            $query->whereHas('cities', function($q) use ($request) {
                $q->where('code', $request->city_code);
            });
        }

        $upts = $query->orderBy('created_at', 'desc')->paginate(15);

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'code', 'label' => 'Kode', 'sortable' => true],
            ['key' => 'name', 'label' => 'Nama UPT', 'sortable' => true],
            ['key' => 'formatted_river_basin', 'label' => 'Wilayah Sungai'],
            ['key' => 'formatted_cities', 'label' => 'Kota/Kabupaten'],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions']
        ];

        // Transform data for table component
        $upts->getCollection()->transform(function ($upt) {
            $upt->formatted_river_basin = $upt->riverBasin->name ?? '-';
            $upt->formatted_cities = $upt->cities->map(function($city) {
                return '<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-1 mb-1">' 
                    . $city->name . '</span>';
            })->join('');
            
            if (empty($upt->formatted_cities)) {
                $upt->formatted_cities = '<span class="text-sm text-gray-400">-</span>';
            }

            $upt->actions = [
                [
                    'type' => 'edit',
                    'label' => 'Edit',
                    'url' => '#',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => "window.dispatchEvent(new CustomEvent('open-edit-upt', { detail: " . json_encode($upt) . " }))"
                ],
                [
                    'type' => 'delete',
                    'label' => 'Hapus',
                    'url' => route('admin.upt.destroy', $upt->id),
                    'icon' => 'trash',
                    'color' => 'red',
                    'method' => 'DELETE',
                    'confirm' => 'Apakah Anda yakin ingin menghapus UPT ini?'
                ]
            ];
            return $upt;
        });

        // For filters dropdown
        $riverBasins = MasRiverBasin::orderBy('name')->get();
        $cities = MasCity::with('province')->orderBy('name')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $upts
            ]);
        }

        return view('admin.upt.index', compact('upts', 'riverBasins', 'cities', 'tableHeaders'));
    }

    /**
     * Store a newly created UPT
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_upts,code',
            'river_basin_code' => 'required|string|exists:mas_river_basins,code',
            'city_codes' => 'required|array|min:1',
            'city_codes.*' => 'required|string|exists:mas_cities,code',
        ], [
            'name.required' => 'Nama UPT harus diisi',
            'code.required' => 'Kode UPT harus diisi',
            'code.unique' => 'Kode UPT sudah digunakan',
            'river_basin_code.required' => 'Wilayah Sungai harus dipilih',
            'river_basin_code.exists' => 'Wilayah Sungai tidak valid',
            'city_codes.required' => 'Minimal satu kota/kabupaten harus dipilih',
            'city_codes.min' => 'Minimal satu kota/kabupaten harus dipilih',
            'city_codes.*.exists' => 'Salah satu kota/kabupaten tidak valid',
        ]);

        try {
            DB::beginTransaction();

            $upt = MasUpt::create([
                'name' => $validated['name'],
                'code' => $validated['code'],
                'river_basin_code' => $validated['river_basin_code'],
            ]);

            // Attach cities
            $upt->cities()->attach($validated['city_codes']);

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'UPT berhasil ditambahkan',
                    'data' => $upt->load(['riverBasin', 'cities.province'])
                ], 201);
            }

            return redirect()->route('admin.upt.index')
                ->with('success', 'UPT berhasil ditambahkan');

        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menambahkan UPT: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->withErrors(['error' => 'Gagal menambahkan UPT: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified UPT
     */
    public function update(Request $request, $id)
    {
        $upt = MasUpt::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_upts,code,' . $id,
            'river_basin_code' => 'required|string|exists:mas_river_basins,code',
            'city_codes' => 'required|array|min:1',
            'city_codes.*' => 'required|string|exists:mas_cities,code',
        ], [
            'name.required' => 'Nama UPT harus diisi',
            'code.required' => 'Kode UPT harus diisi',
            'code.unique' => 'Kode UPT sudah digunakan',
            'river_basin_code.required' => 'Wilayah Sungai harus dipilih',
            'river_basin_code.exists' => 'Wilayah Sungai tidak valid',
            'city_codes.required' => 'Minimal satu kota/kabupaten harus dipilih',
            'city_codes.min' => 'Minimal satu kota/kabupaten harus dipilih',
            'city_codes.*.exists' => 'Salah satu kota/kabupaten tidak valid',
        ]);

        try {
            DB::beginTransaction();

            $upt->update([
                'name' => $validated['name'],
                'code' => $validated['code'],
                'river_basin_code' => $validated['river_basin_code'],
            ]);

            // Sync cities (replace all)
            $upt->cities()->sync($validated['city_codes']);

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'UPT berhasil diupdate',
                    'data' => $upt->load(['riverBasin', 'cities.province'])
                ]);
            }

            return redirect()->route('admin.upt.index')
                ->with('success', 'UPT berhasil diupdate');

        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengupdate UPT: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->withErrors(['error' => 'Gagal mengupdate UPT: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified UPT
     */
    public function destroy(Request $request, $id)
    {
        try {
            $upt = MasUpt::withCount('uptds')->findOrFail($id);

            // Check if UPT has UPTDs
            if ($upt->uptds_count > 0) {
                if ($request->wantsJson()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Tidak dapat menghapus UPT yang memiliki UPTD. Hapus UPTD terlebih dahulu.'
                    ], 422);
                }

                return back()->withErrors([
                    'error' => 'Tidak dapat menghapus UPT yang memiliki UPTD. Hapus UPTD terlebih dahulu.'
                ]);
            }

            DB::beginTransaction();

            // Detach all cities
            $upt->cities()->detach();

            // Delete UPT
            $upt->delete();

            DB::commit();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'UPT berhasil dihapus'
                ]);
            }

            return redirect()->route('admin.upt.index')
                ->with('success', 'UPT berhasil dihapus');

        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menghapus UPT: ' . $e->getMessage()
                ], 500);
            }

            return back()->withErrors([
                'error' => 'Gagal menghapus UPT: ' . $e->getMessage()
            ]);
        }
    }
}
