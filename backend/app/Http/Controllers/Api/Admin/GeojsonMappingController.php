<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\GeojsonMapping;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GeojsonMappingController extends Controller
{
    use ApiResponseTraits;

    /**
     * Display a listing of geojson mappings.
     */
    public function index(Request $request)
    {
        try {
            $query = GeojsonMapping::with([
                'device:code,name',
                'riverBasin:code,name',
                'watershed:code,name',
                'city:code,name',
                'regency:regencies_code,regencies_name',
                'village:code,name',
                'upt:code,name',
                'uptd:code,name',
                'deviceParameter:code,name'
            ]);

            // Filters
            if ($request->has('device_code')) {
                $query->where('mas_device_code', $request->device_code);
            }
            if ($request->has('river_basin_code')) {
                $query->where('mas_river_basin_code', $request->river_basin_code);
            }
            if ($request->has('city_code')) {
                $query->where('mas_city_code', $request->city_code);
            }

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $mappings = $query->paginate($perPage);

            return $this->successResponse($mappings, 'GeoJSON mappings berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created geojson mapping.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
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
            'file' => 'nullable|file|mimes:json,geojson|max:51200', // 50MB
            'version' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'properties_content' => 'nullable|json'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            $data = $request->except(['file']);

            // Handle file upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . $request->geojson_code . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('geojson', $fileName, 'public');
                $data['file_path'] = $filePath;
            }

            // Parse properties_content if provided as string
            if ($request->has('properties_content') && is_string($request->properties_content)) {
                $data['properties_content'] = json_decode($request->properties_content, true);
            }

            $mapping = GeojsonMapping::create($data);

            DB::commit();

            return $this->successResponse(
                $mapping->load(['device', 'riverBasin', 'city']),
                'GeoJSON mapping berhasil dibuat',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            return $this->serverErrorResponse('Gagal membuat mapping: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified geojson mapping.
     */
    public function show($id)
    {
        try {
            $mapping = GeojsonMapping::with([
                'device:code,name,latitude,longitude',
                'riverBasin:code,name',
                'watershed:code,name',
                'city:code,name',
                'regency:regencies_code,regencies_name',
                'village:code,name',
                'upt:code,name',
                'uptd:code,name',
                'deviceParameter:code,name'
            ])->findOrFail($id);

            // Check if file exists
            if ($mapping->file_path) {
                $mapping->file_exists = Storage::disk('public')->exists($mapping->file_path);
                $mapping->file_url = $mapping->file_exists ? Storage::disk('public')->url($mapping->file_path) : null;
            }

            return $this->successResponse($mapping, 'GeoJSON mapping berhasil diambil');
        } catch (\Exception $e) {
            return $this->notFoundResponse('GeoJSON mapping tidak ditemukan');
        }
    }

    /**
     * Update the specified geojson mapping.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'geojson_code' => 'sometimes|required|string|max:100|unique:geojson_mapping,geojson_code,' . $id,
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
            'properties_content' => 'nullable|json'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $mapping = GeojsonMapping::findOrFail($id);
            $oldFilePath = $mapping->file_path;

            DB::beginTransaction();

            $data = $request->except(['file']);

            // Handle file upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . ($request->geojson_code ?? $mapping->geojson_code) . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('geojson', $fileName, 'public');
                $data['file_path'] = $filePath;
            }

            // Parse properties_content if provided as string
            if ($request->has('properties_content') && is_string($request->properties_content)) {
                $data['properties_content'] = json_decode($request->properties_content, true);
            }

            $mapping->update($data);

            // Delete old file if new file was uploaded
            if ($request->hasFile('file') && $oldFilePath) {
                Storage::disk('public')->delete($oldFilePath);
            }

            DB::commit();

            return $this->successResponse(
                $mapping->load(['device', 'riverBasin', 'city']),
                'GeoJSON mapping berhasil diupdate'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            return $this->serverErrorResponse('Gagal mengupdate mapping: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified geojson mapping.
     */
    public function destroy($id)
    {
        try {
            $mapping = GeojsonMapping::findOrFail($id);
            $filePath = $mapping->file_path;

            DB::beginTransaction();

            $mapping->delete();

            // Delete file
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
            }

            DB::commit();

            return $this->successResponse(null, 'GeoJSON mapping berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghapus mapping: ' . $e->getMessage());
        }
    }

    /**
     * Get GeoJSON content.
     */
    public function getGeojsonContent($id)
    {
        try {
            $mapping = GeojsonMapping::findOrFail($id);

            if (!$mapping->file_path || !Storage::disk('public')->exists($mapping->file_path)) {
                return $this->notFoundResponse('File GeoJSON tidak ditemukan');
            }

            $content = Storage::disk('public')->get($mapping->file_path);
            $geojson = json_decode($content, true);

            return response()->json($geojson);
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil GeoJSON: ' . $e->getMessage());
        }
    }

    /**
     * Get mappings by location.
     */
    public function getByLocation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:device,river_basin,watershed,city,regency,village,upt,uptd',
            'code' => 'required|string'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $column = match($request->type) {
                'device' => 'mas_device_code',
                'river_basin' => 'mas_river_basin_code',
                'watershed' => 'mas_watershed_code',
                'city' => 'mas_city_code',
                'regency' => 'mas_regency_code',
                'village' => 'mas_village_code',
                'upt' => 'mas_upt_code',
                'uptd' => 'mas_uptd_code',
                default => null
            };

            if (!$column) {
                return $this->validationErrorResponse(['type' => 'Invalid location type']);
            }

            $mappings = GeojsonMapping::with(['device', 'riverBasin', 'city'])
                ->where($column, $request->code)
                ->get();

            return $this->successResponse($mappings, 'GeoJSON mappings berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil data: ' . $e->getMessage());
        }
    }
}

