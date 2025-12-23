<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponseTraits;
use App\Models\MasScaler;
use App\Models\MasModel;
use App\Models\MasSensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MasScalerController extends Controller
{
    use ApiResponseTraits;

    /**
     * Display a listing of scalers.
     */
    public function index(Request $request)
    {
        try {
            $query = MasScaler::with(['masModel:code,name', 'sensor:code,name']);

            // Filter by model
            if ($request->has('model_code')) {
                $query->where('mas_model_code', $request->model_code);
            }

            // Filter by sensor
            if ($request->has('sensor_code')) {
                $query->where('mas_sensor_code', $request->sensor_code);
            }

            // Filter by axis
            if ($request->has('io_axis')) {
                $query->where('io_axis', $request->io_axis);
            }

            // Filter by technique
            if ($request->has('technique')) {
                $query->where('technique', $request->technique);
            }

            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->is_active === 'true' ? 1 : 0);
            }

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $scalers = $query->paginate($perPage);

            // Add display attributes
            $scalers->getCollection()->transform(function ($scaler) {
                $scaler->technique_display = $scaler->technique_display;
                $scaler->axis_display = $scaler->axis_display;
                return $scaler;
            });

            return $this->successResponse($scalers, 'Scalers berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil scalers: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly created scaler.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mas_model_code' => 'nullable|string|exists:mas_models,code',
            'mas_sensor_code' => 'nullable|string|exists:mas_sensors,code',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_scalers,code',
            'io_axis' => 'required|in:x,y',
            'technique' => 'required|in:standard,minmax,robust,custom',
            'version' => 'nullable|string|max:64',
            'file' => 'required|file|mimes:pkl,joblib,json|max:10240', // 10MB max
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            DB::beginTransaction();

            // Handle file upload
            $file = $request->file('file');
            $fileName = time() . '_' . $request->code . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('scalers', $fileName, 'public');

            // Calculate file hash
            $fileHash = hash_file('sha256', $file->getRealPath());

            // If setting as active, deactivate other scalers with same model/sensor/axis
            if ($request->get('is_active', true)) {
                MasScaler::where('mas_model_code', $request->mas_model_code)
                    ->where('mas_sensor_code', $request->mas_sensor_code)
                    ->where('io_axis', $request->io_axis)
                    ->update(['is_active' => false]);
            }

            $scaler = MasScaler::create([
                'mas_model_code' => $request->mas_model_code,
                'mas_sensor_code' => $request->mas_sensor_code,
                'name' => $request->name,
                'code' => $request->code,
                'io_axis' => $request->io_axis,
                'technique' => $request->technique,
                'version' => $request->version,
                'file_path' => $filePath,
                'file_hash_sha256' => $fileHash,
                'is_active' => $request->get('is_active', true)
            ]);

            DB::commit();

            return $this->successResponse(
                $scaler->load(['masModel', 'sensor']),
                'Scaler berhasil dibuat',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            // Clean up uploaded file if exists
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            return $this->serverErrorResponse('Gagal membuat scaler: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified scaler.
     */
    public function show($id)
    {
        try {
            $scaler = MasScaler::with(['masModel:code,name,type', 'sensor:code,name,parameter'])
                ->findOrFail($id);

            // Add display attributes
            $scaler->technique_display = $scaler->technique_display;
            $scaler->axis_display = $scaler->axis_display;

            // Check if file exists
            $scaler->file_exists = Storage::disk('public')->exists($scaler->file_path);
            $scaler->file_url = $scaler->file_exists ? Storage::disk('public')->url($scaler->file_path) : null;

            return $this->successResponse($scaler, 'Scaler berhasil diambil');
        } catch (\Exception $e) {
            return $this->notFoundResponse('Scaler tidak ditemukan');
        }
    }

    /**
     * Update the specified scaler.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'mas_model_code' => 'sometimes|nullable|string|exists:mas_models,code',
            'mas_sensor_code' => 'sometimes|nullable|string|exists:mas_sensors,code',
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:100|unique:mas_scalers,code,' . $id,
            'io_axis' => 'sometimes|required|in:x,y',
            'technique' => 'sometimes|required|in:standard,minmax,robust,custom',
            'version' => 'nullable|string|max:64',
            'file' => 'sometimes|file|mimes:pkl,joblib,json|max:10240',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $scaler = MasScaler::findOrFail($id);
            $oldFilePath = $scaler->file_path;

            DB::beginTransaction();

            // Handle file upload if provided
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '_' . ($request->code ?? $scaler->code) . '.' . $file->getClientOriginalExtension();
                $filePath = $file->storeAs('scalers', $fileName, 'public');
                $fileHash = hash_file('sha256', $file->getRealPath());

                $scaler->file_path = $filePath;
                $scaler->file_hash_sha256 = $fileHash;
            }

            // If setting as active, deactivate other scalers
            if ($request->has('is_active') && $request->is_active) {
                $modelCode = $request->get('mas_model_code', $scaler->mas_model_code);
                $sensorCode = $request->get('mas_sensor_code', $scaler->mas_sensor_code);
                $ioAxis = $request->get('io_axis', $scaler->io_axis);

                MasScaler::where('id', '!=', $id)
                    ->where('mas_model_code', $modelCode)
                    ->where('mas_sensor_code', $sensorCode)
                    ->where('io_axis', $ioAxis)
                    ->update(['is_active' => false]);
            }

            // Update other fields
            $scaler->fill($request->except(['file']));
            $scaler->save();

            // Delete old file if new file was uploaded
            if ($request->hasFile('file') && $oldFilePath) {
                Storage::disk('public')->delete($oldFilePath);
            }

            DB::commit();

            return $this->successResponse(
                $scaler->load(['masModel', 'sensor']),
                'Scaler berhasil diupdate'
            );
        } catch (\Exception $e) {
            DB::rollBack();
            // Clean up new file if exists
            if (isset($filePath)) {
                Storage::disk('public')->delete($filePath);
            }
            return $this->serverErrorResponse('Gagal mengupdate scaler: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified scaler.
     */
    public function destroy($id)
    {
        try {
            $scaler = MasScaler::findOrFail($id);
            $filePath = $scaler->file_path;

            DB::beginTransaction();

            $scaler->delete();

            // Delete file
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
            }

            DB::commit();

            return $this->successResponse(null, 'Scaler berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal menghapus scaler: ' . $e->getMessage());
        }
    }

    /**
     * Toggle scaler active status.
     */
    public function toggleActive($id)
    {
        try {
            $scaler = MasScaler::findOrFail($id);

            DB::beginTransaction();

            $newStatus = !$scaler->is_active;

            // If activating, deactivate others
            if ($newStatus) {
                MasScaler::where('id', '!=', $id)
                    ->where('mas_model_code', $scaler->mas_model_code)
                    ->where('mas_sensor_code', $scaler->mas_sensor_code)
                    ->where('io_axis', $scaler->io_axis)
                    ->update(['is_active' => false]);
            }

            $scaler->is_active = $newStatus;
            $scaler->save();

            DB::commit();

            return $this->successResponse(
                $scaler,
                'Scaler status berhasil diubah menjadi ' . ($newStatus ? 'active' : 'inactive')
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->serverErrorResponse('Gagal mengubah status: ' . $e->getMessage());
        }
    }

    /**
     * Get active scalers for a model and sensor.
     */
    public function getActiveScalers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'model_code' => 'required|string|exists:mas_models,code',
            'sensor_code' => 'nullable|string|exists:mas_sensors,code'
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $query = MasScaler::with(['masModel:code,name', 'sensor:code,name'])
                ->where('mas_model_code', $request->model_code)
                ->where('is_active', true);

            if ($request->has('sensor_code')) {
                $query->where('mas_sensor_code', $request->sensor_code);
            }

            $scalers = $query->get();

            return $this->successResponse([
                'model_code' => $request->model_code,
                'sensor_code' => $request->sensor_code,
                'scalers' => $scalers,
                'input_scaler' => $scalers->where('io_axis', 'x')->first(),
                'output_scaler' => $scalers->where('io_axis', 'y')->first()
            ], 'Active scalers berhasil diambil');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil scalers: ' . $e->getMessage());
        }
    }

    /**
     * Download scaler file.
     */
    public function downloadFile($id)
    {
        try {
            $scaler = MasScaler::findOrFail($id);

            if (!Storage::disk('public')->exists($scaler->file_path)) {
                return $this->notFoundResponse('File tidak ditemukan');
            }

            return Storage::disk('public')->download($scaler->file_path);
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mendownload file: ' . $e->getMessage());
        }
    }
}

