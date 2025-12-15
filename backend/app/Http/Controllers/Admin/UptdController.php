<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasUptd;
use App\Models\MasUpt;
use App\Models\MasCity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UptdController extends Controller
{
    /**
     * Display a listing of UPTDs with pagination and filters
     */
    public function index(Request $request)
    {
        $query = MasUptd::with(['upt', 'city.province']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // UPT filter
        if ($request->filled('upt_code')) {
            $query->where('upt_code', $request->upt_code);
        }

        // City filter
        if ($request->filled('city_code')) {
            $query->where('city_code', $request->city_code);
        }

        $uptds = $query->orderBy('created_at', 'desc')->paginate(15);

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'code', 'label' => 'Kode', 'sortable' => true],
            ['key' => 'name', 'label' => 'Nama UPTD', 'sortable' => true],
            ['key' => 'formatted_upt', 'label' => 'UPT'],
            ['key' => 'formatted_city', 'label' => 'Kabupaten'],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions']
        ];

        // Transform data for table component
        $uptds->getCollection()->transform(function ($uptd) {
            $uptd->formatted_upt = $uptd->upt->name ?? '-';
            
            if ($uptd->city) {
                $cityHtml = '<div class="text-sm">';
                $cityHtml .= '<div class="text-gray-900 dark:text-white font-medium">' . $uptd->city->name . '</div>';
                if ($uptd->city->province) {
                    $cityHtml .= '<div class="text-gray-500 dark:text-gray-400 text-xs">' . $uptd->city->province->provinces_name . '</div>';
                }
                $cityHtml .= '</div>';
                $uptd->formatted_city = $cityHtml;
            } else {
                $uptd->formatted_city = '<span class="text-sm text-gray-400">-</span>';
            }

            $uptd->actions = [
                [
                    'type' => 'edit',
                    'label' => 'Edit',
                    'url' => '#',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => "window.dispatchEvent(new CustomEvent('open-edit-uptd', { detail: " . json_encode($uptd) . " }))"
                ],
                [
                    'type' => 'delete',
                    'label' => 'Hapus',
                    'url' => route('admin.uptd.destroy', $uptd->id),
                    'icon' => 'trash',
                    'color' => 'red',
                    'method' => 'DELETE',
                    'confirm' => 'Apakah Anda yakin ingin menghapus UPTD ini?'
                ]
            ];
            return $uptd;
        });

        // For filters dropdown
        $upts = MasUpt::orderBy('name')->get();
        $cities = MasCity::with('province')->orderBy('name')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $uptds
            ]);
        }

        return view('admin.uptd.index', compact('uptds', 'upts', 'cities', 'tableHeaders'));
    }

    /**
     * Store a newly created UPTD
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_uptds,code',
            'upt_code' => 'required|string|exists:mas_upts,code',
            'city_code' => 'required|string|exists:mas_cities,code',
        ], [
            'name.required' => 'Nama UPTD harus diisi',
            'code.required' => 'Kode UPTD harus diisi',
            'code.unique' => 'Kode UPTD sudah digunakan',
            'upt_code.required' => 'UPT harus dipilih',
            'upt_code.exists' => 'UPT tidak valid',
            'city_code.required' => 'Kabupaten harus dipilih',
            'city_code.exists' => 'Kabupaten tidak valid',
        ]);

        // Validate that the selected city is managed by the selected UPT
        $upt = MasUpt::with('cities')->where('code', $validated['upt_code'])->first();
        $isCityInUpt = $upt->cities->contains('code', $validated['city_code']);

        if (!$isCityInUpt) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kabupaten yang dipilih tidak berada di bawah naungan UPT yang dipilih.'
                ], 422);
            }

            return back()->withInput()->withErrors([
                'city_code' => 'Kabupaten yang dipilih tidak berada di bawah naungan UPT yang dipilih.'
            ]);
        }

        try {
            $uptd = MasUptd::create($validated);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'UPTD berhasil ditambahkan',
                    'data' => $uptd->load(['upt', 'city.province'])
                ], 201);
            }

            return redirect()->route('admin.uptd.index')
                ->with('success', 'UPTD berhasil ditambahkan');

        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menambahkan UPTD: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->withErrors(['error' => 'Gagal menambahkan UPTD: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified UPTD
     */
    public function update(Request $request, $id)
    {
        $uptd = MasUptd::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_uptds,code,' . $id,
            'upt_code' => 'required|string|exists:mas_upts,code',
            'city_code' => 'required|string|exists:mas_cities,code',
        ], [
            'name.required' => 'Nama UPTD harus diisi',
            'code.required' => 'Kode UPTD harus diisi',
            'code.unique' => 'Kode UPTD sudah digunakan',
            'upt_code.required' => 'UPT harus dipilih',
            'upt_code.exists' => 'UPT tidak valid',
            'city_code.required' => 'Kabupaten harus dipilih',
            'city_code.exists' => 'Kabupaten tidak valid',
        ]);

        // Validate that the selected city is managed by the selected UPT
        $upt = MasUpt::with('cities')->where('code', $validated['upt_code'])->first();
        $isCityInUpt = $upt->cities->contains('code', $validated['city_code']);

        if (!$isCityInUpt) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kabupaten yang dipilih tidak berada di bawah naungan UPT yang dipilih.'
                ], 422);
            }

            return back()->withInput()->withErrors([
                'city_code' => 'Kabupaten yang dipilih tidak berada di bawah naungan UPT yang dipilih.'
            ]);
        }

        try {
            $uptd->update($validated);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'UPTD berhasil diupdate',
                    'data' => $uptd->load(['upt', 'city.province'])
                ]);
            }

            return redirect()->route('admin.uptd.index')
                ->with('success', 'UPTD berhasil diupdate');

        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengupdate UPTD: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->withErrors(['error' => 'Gagal mengupdate UPTD: ' . $e->getMessage()]);
        }
    }

    /**
     * Get cities for selected UPT (AJAX endpoint)
     */
    public function getCitiesByUpt(Request $request)
    {
        $uptCode = $request->input('upt_code');

        if (!$uptCode) {
            return response()->json([
                'success' => false,
                'message' => 'UPT code is required'
            ], 400);
        }

        $upt = MasUpt::with('cities.province')->where('code', $uptCode)->first();

        if (!$upt) {
            return response()->json([
                'success' => false,
                'message' => 'UPT not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $upt->cities
        ]);
    }

    /**
     * Remove the specified UPTD
     */
    public function destroy(Request $request, $id)
    {
        try {
            $uptd = MasUptd::findOrFail($id);

            // Check if UPTD has related records (devices, sensors, etc.)
            // Add checks here if needed based on your relationships

            $uptd->delete();

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'UPTD berhasil dihapus'
                ]);
            }

            return redirect()->route('admin.uptd.index')
                ->with('success', 'UPTD berhasil dihapus');

        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal menghapus UPTD: ' . $e->getMessage()
                ], 500);
            }

            return back()->withErrors([
                'error' => 'Gagal menghapus UPTD: ' . $e->getMessage()
            ]);
        }
    }
}
