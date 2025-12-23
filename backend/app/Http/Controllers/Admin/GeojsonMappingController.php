<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GeojsonMapping;
use App\Models\MasDevice;
use App\Models\MasRiverBasin;
use App\Models\MasWatershed;
use App\Models\MasCity;
use App\Models\MasRegency;
use App\Models\MasVillage;
use App\Models\MasUpt;
use App\Models\MasUptd;
use App\Models\MasDeviceParameter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GeojsonMappingController extends Controller
{
    public function index(Request $request)
    {
        $query = GeojsonMapping::with([
            'device:code,name',
            'riverBasin:code,name',
            'watershed:code,name',
            'city:code,name',
            'regency:regencies_code,regencies_name',
            'village:code,name',
            'upt:code,name',
            'uptd:code,name'
        ]);

        // Search
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('geojson_code', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('device', function ($dQ) use ($search) {
                      $dQ->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by device
        if ($request->has('device_code')) {
            $query->where('mas_device_code', $request->device_code);
        }

        // Filter by river basin
        if ($request->has('river_basin_code')) {
            $query->where('mas_river_basin_code', $request->river_basin_code);
        }

        // Filter by city
        if ($request->has('city_code')) {
            $query->where('mas_city_code', $request->city_code);
        }

        $mappings = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        // Prepare data for table component
        $tableHeaders = [
            ['key' => 'id', 'label' => 'ID', 'sortable' => true],
            ['key' => 'geojson_code', 'label' => 'Kode GeoJSON', 'sortable' => true],
            ['key' => 'device_name', 'label' => 'Device', 'sortable' => false],
            ['key' => 'river_basin_name', 'label' => 'DAS', 'sortable' => false],
            ['key' => 'city_name', 'label' => 'Kota', 'sortable' => false],
            ['key' => 'file_status', 'label' => 'File', 'format' => 'badge', 'sortable' => false],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions', 'sortable' => false]
        ];

        // Transform mappings data for table
        $mappings->getCollection()->transform(function ($mapping) {
            $detailData = [
                'id' => $mapping->id,
                'geojson_code' => addslashes($mapping->geojson_code),
                'mas_device_code' => $mapping->mas_device_code,
                'mas_river_basin_code' => $mapping->mas_river_basin_code,
                'mas_watershed_code' => $mapping->mas_watershed_code,
                'mas_city_code' => $mapping->mas_city_code,
                'mas_regency_code' => $mapping->mas_regency_code,
                'mas_village_code' => $mapping->mas_village_code,
                'mas_upt_code' => $mapping->mas_upt_code,
                'mas_uptd_code' => $mapping->mas_uptd_code,
                'code' => addslashes($mapping->code ?? ''),
                'value_min' => $mapping->value_min,
                'value_max' => $mapping->value_max,
                'version' => addslashes($mapping->version ?? ''),
                'description' => addslashes($mapping->description ?? ''),
            ];
            $detailJson = json_encode($detailData);

            $mapping->device_name = $mapping->device->name ?? '-';
            $mapping->river_basin_name = $mapping->riverBasin->name ?? '-';
            $mapping->city_name = $mapping->city->name ?? '-';

            // File status badge
            if ($mapping->file_path && Storage::disk('public')->exists($mapping->file_path)) {
                $mapping->file_status = '<span class="badge badge-success">Tersedia</span>';
            } else {
                $mapping->file_status = '<span class="badge badge-secondary">Tidak Ada</span>';
            }

            $mapping->actions = [
                [
                    'label' => 'Edit',
                    'title' => 'Edit Mapping',
                    'url' => '#',
                    'onclick' => "window.dispatchEvent(new CustomEvent('open-edit-mapping', { detail: {$detailJson} }))",
                    'icon' => 'pen',
                    'color' => 'blue'
                ],
                [
                    'label' => 'Hapus',
                    'title' => 'Hapus Mapping',
                    'url' => route('admin.geojson-mappings.destroy', $mapping->id),
                    'color' => 'red',
                    'method' => 'DELETE',
                    'icon' => 'trash',
                    'confirm' => 'Apakah Anda yakin ingin menghapus mapping ini?'
                ]
            ];

            return $mapping;
        });

        // Get filter options
        $devices = MasDevice::select('code', 'name')->orderBy('name')->get()->map(fn($d) => ['value' => $d->code, 'label' => $d->name]);
        $riverBasins = MasRiverBasin::select('code', 'name')->orderBy('name')->get()->map(fn($rb) => ['value' => $rb->code, 'label' => $rb->name]);
        $watersheds = MasWatershed::select('code', 'name')->orderBy('name')->get()->map(fn($w) => ['value' => $w->code, 'label' => $w->name]);
        $cities = MasCity::select('code', 'name')->orderBy('name')->get()->map(fn($c) => ['value' => $c->code, 'label' => $c->name]);
        $regencies = MasRegency::select('regencies_code', 'regencies_name')->orderBy('regencies_name')->get()->map(fn($r) => ['value' => $r->regencies_code, 'label' => $r->regencies_name]);
        $villages = MasVillage::select('code', 'name')->orderBy('name')->get()->map(fn($v) => ['value' => $v->code, 'label' => $v->name]);
        $upts = MasUpt::select('code', 'name')->orderBy('name')->get()->map(fn($u) => ['value' => $u->code, 'label' => $u->name]);
        $uptds = MasUptd::select('code', 'name')->orderBy('name')->get()->map(fn($u) => ['value' => $u->code, 'label' => $u->name]);
        $deviceParameters = MasDeviceParameter::select('code', 'name')->orderBy('name')->get()->map(fn($dp) => ['value' => $dp->code, 'label' => $dp->name]);

        return view('admin.geojson_mappings.index', compact(
            'mappings',
            'tableHeaders',
            'devices',
            'riverBasins',
            'watersheds',
            'cities',
            'regencies',
            'villages',
            'upts',
            'uptds',
            'deviceParameters'
        ));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'geojson_code' => 'required|string|max:100|unique:geojson_mapping,geojson_code',
                'mas_device_code' => 'nullable|string|exists:mas_devices,code',
                'mas_river_basin_code' => 'nullable|string|exists:mas_river_basins,code',
                'mas_watershed_code' => 'nullable|string|exists:mas_watersheds,code',
                'mas_city_code' => 'nullable|string|exists:mas_cities,code',
                'mas_regency_code' => 'nullable|string|exists:mas_regencies,regencies_code',
                'mas_village_code' => 'nullable|string|exists:mas_villages,code',
                'mas_upt_code' => 'nullable|string|exists:mas_upts,code',
                'mas_uptd_code' => 'nullable|string|exists:mas_uptds,code',
                'mas_device_parameter_code' => 'nullable|string|exists:mas_device_parameters,code',
                'code' => 'nullable|string|max:100',
                'value_min' => 'nullable|numeric',
                'value_max' => 'nullable|numeric|gte:value_min',
                'file' => 'nullable|file|mimes:json,geojson|max:51200',
                'version' => 'nullable|string|max:50',
                'description' => 'nullable|string',
            ]);

            DB::beginTransaction();

            $data = $validated;

            // Handle file upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . $validated['geojson_code'] . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('geojson', $fileName, 'public');
                $data['file_path'] = $filePath;
            }

            $mapping = GeojsonMapping::create($data);

            DB::commit();

            return redirect()->route('admin.geojson-mappings.index')
                ->with('success', "GeoJSON Mapping '{$mapping->geojson_code}' berhasil ditambahkan.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput()
                ->with('error', 'Data yang diinput tidak valid. Silakan periksa kembali.');

        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }

            Log::error('Unexpected error when creating geojson mapping: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan tak terduga. Silakan coba lagi atau hubungi administrator.');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $mapping = GeojsonMapping::findOrFail($id);

            $validated = $request->validate([
                'geojson_code' => 'required|string|max:100|unique:geojson_mapping,geojson_code,' . $id,
                'mas_device_code' => 'nullable|string|exists:mas_devices,code',
                'mas_river_basin_code' => 'nullable|string|exists:mas_river_basins,code',
                'mas_watershed_code' => 'nullable|string|exists:mas_watersheds,code',
                'mas_city_code' => 'nullable|string|exists:mas_cities,code',
                'mas_regency_code' => 'nullable|string|exists:mas_regencies,regencies_code',
                'mas_village_code' => 'nullable|string|exists:mas_villages,code',
                'mas_upt_code' => 'nullable|string|exists:mas_upts,code',
                'mas_uptd_code' => 'nullable|string|exists:mas_uptds,code',
                'mas_device_parameter_code' => 'nullable|string|exists:mas_device_parameters,code',
                'code' => 'nullable|string|max:100',
                'value_min' => 'nullable|numeric',
                'value_max' => 'nullable|numeric|gte:value_min',
                'file' => 'nullable|file|mimes:json,geojson|max:51200',
                'version' => 'nullable|string|max:50',
                'description' => 'nullable|string',
            ]);

            $oldFilePath = $mapping->file_path;

            DB::beginTransaction();

            $data = $validated;

            // Handle file upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . $validated['geojson_code'] . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('geojson', $fileName, 'public');
                $data['file_path'] = $filePath;
            }

            $oldCode = $mapping->geojson_code;
            $mapping->update($data);

            // Delete old file if new file was uploaded
            if ($request->hasFile('file') && $oldFilePath) {
                Storage::disk('public')->delete($oldFilePath);
            }

            DB::commit();

            return redirect()->route('admin.geojson-mappings.index')
                ->with('success', "GeoJSON Mapping '{$oldCode}' berhasil diperbarui.");

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->route('admin.geojson-mappings.index')
                ->with('error', 'GeoJSON Mapping yang akan diperbarui tidak ditemukan.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput()
                ->with('error', 'Data yang diinput tidak valid. Silakan periksa kembali.');

        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }

            Log::error('Unexpected error when updating geojson mapping: ' . $e->getMessage(), [
                'mapping_id' => $id,
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan tak terduga. Silakan coba lagi atau hubungi administrator.');
        }
    }

    public function destroy($id)
    {
        try {
            $mapping = GeojsonMapping::findOrFail($id);
            $filePath = $mapping->file_path;

            DB::beginTransaction();

            $mappingCode = $mapping->geojson_code;
            $mapping->delete();

            // Delete file
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
            }

            DB::commit();

            return redirect()->route('admin.geojson-mappings.index')
                ->with('success', "GeoJSON Mapping '{$mappingCode}' berhasil dihapus.");

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Unexpected error when deleting geojson mapping: ' . $e->getMessage(), [
                'mapping_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('admin.geojson-mappings.index')
                ->with('error', 'Terjadi kesalahan tak terduga. Silakan coba lagi atau hubungi administrator.');
        }
    }
}
