<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasScaler;
use App\Models\MasModel;
use App\Models\MasSensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ScalerController extends Controller
{
    /**
     * Display a listing of scalers
     */
    public function index(Request $request)
    {
        $query = MasScaler::with(['model', 'sensor']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('mas_model_code', 'like', "%{$search}%")
                  ->orWhere('mas_sensor_code', 'like', "%{$search}%");
            });
        }

        // Filter by technique
        if ($request->filled('technique')) {
            $query->where('technique', $request->technique);
        }

        // Filter by axis
        if ($request->filled('axis')) {
            $query->where('io_axis', $request->axis);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $scalers = $query->latest()->paginate($request->get('per_page', 15));

        // Get models and sensors for dropdowns
        $models = MasModel::select('code', 'name')->get();
        $sensors = MasSensor::select('code', 'description')->get();

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'code', 'label' => 'Code'],
            ['key' => 'name', 'label' => 'Name'],
            ['key' => 'technique_label', 'label' => 'Technique'],
            ['key' => 'axis_label', 'label' => 'Axis'],
            ['key' => 'model_name', 'label' => 'Model'],
            ['key' => 'sensor_description', 'label' => 'Sensor'],
            ['key' => 'formatted_status_label', 'label' => 'Status'],
            ['key' => 'actions', 'label' => 'Actions', 'format' => 'actions']
        ];

        // Format rows data
        $scalers->getCollection()->transform(function ($scaler) {
            // Format model and sensor
            $scaler->model_name = $scaler->model->name ?? '-';
            $scaler->sensor_description = $scaler->sensor->description ?? '-';
            
            // Format status dengan Alpine.js button
            $statusClass = $scaler->is_active 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            $scaler->formatted_status_label = sprintf(
                '<button @click="toggleStatus(%d, %s)" class="px-2 py-1 text-xs rounded-full %s">%s</button>',
                $scaler->id,
                $scaler->is_active ? 'true' : 'false',
                $statusClass,
                e($scaler->status_label)
            );
            
            // Prepare actions
            $scaler->actions = [
                [
                    'type' => 'link',
                    'label' => 'Download',
                    'icon' => 'download',
                    'color' => 'green',
                    'url' => route('admin.scalers.download', $scaler->id),
                    'title' => 'Download'
                ],
                [
                    'type' => 'button',
                    'label' => 'Edit',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => 'editScaler(' . json_encode($scaler) . ')',
                    'title' => 'Edit'
                ],
                [
                    'type' => 'button',
                    'label' => 'Delete',
                    'icon' => 'trash',
                    'color' => 'red',
                    'onclick' => 'deleteScaler(' . $scaler->id . ')',
                    'title' => 'Delete'
                ]
            ];
            
            return $scaler;
        });

        return view('admin.scalers.index', compact('scalers', 'models', 'sensors', 'tableHeaders'));
    }

    /**
     * Store a newly created scaler
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_scalers,code',
            'mas_model_code' => 'nullable|string|exists:mas_models,code',
            'mas_sensor_code' => 'nullable|string|exists:mas_sensors,code',
            'io_axis' => 'required|in:x,y',
            'technique' => 'required|in:standard,minmax,robust,custom',
            'version' => 'nullable|string|max:64',
            'scaler_file' => 'required|file|mimes:pkl,joblib,json|max:10240', // 10MB max
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Handle file upload
        $file = $request->file('scaler_file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('scalers', $fileName);
        
        // Calculate file hash
        $fileHash = hash_file('sha256', $file->getRealPath());

        $scaler = MasScaler::create([
            'name' => $request->name,
            'code' => $request->code,
            'mas_model_code' => $request->mas_model_code,
            'mas_sensor_code' => $request->mas_sensor_code,
            'io_axis' => $request->io_axis,
            'technique' => $request->technique,
            'version' => $request->version,
            'file_path' => $filePath,
            'file_hash_sha256' => $fileHash,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()->route('admin.scalers.index')
            ->with('success', 'Scaler created successfully');
    }

    /**
     * Update the specified scaler
     */
    public function update(Request $request, $id)
    {
        $scaler = MasScaler::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_scalers,code,' . $id,
            'mas_model_code' => 'nullable|string|exists:mas_models,code',
            'mas_sensor_code' => 'nullable|string|exists:mas_sensors,code',
            'io_axis' => 'required|in:x,y',
            'technique' => 'required|in:standard,minmax,robust,custom',
            'version' => 'nullable|string|max:64',
            'scaler_file' => 'nullable|file|mimes:pkl,joblib,json|max:10240',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = [
            'name' => $request->name,
            'code' => $request->code,
            'mas_model_code' => $request->mas_model_code,
            'mas_sensor_code' => $request->mas_sensor_code,
            'io_axis' => $request->io_axis,
            'technique' => $request->technique,
            'version' => $request->version,
            'is_active' => $request->boolean('is_active', true),
        ];

        // Handle file upload if new file provided
        if ($request->hasFile('scaler_file')) {
            // Delete old file
            if ($scaler->file_path && Storage::exists($scaler->file_path)) {
                Storage::delete($scaler->file_path);
            }

            $file = $request->file('scaler_file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('scalers', $fileName);
            $fileHash = hash_file('sha256', $file->getRealPath());

            $data['file_path'] = $filePath;
            $data['file_hash_sha256'] = $fileHash;
        }

        $scaler->update($data);

        return redirect()->route('admin.scalers.index')
            ->with('success', 'Scaler updated successfully');
    }

    /**
     * Remove the specified scaler
     */
    public function destroy($id)
    {
        $scaler = MasScaler::findOrFail($id);

        // Delete file
        if ($scaler->file_path && Storage::exists($scaler->file_path)) {
            Storage::delete($scaler->file_path);
        }

        $scaler->delete();

        return redirect()->route('admin.scalers.index')
            ->with('success', 'Scaler deleted successfully');
    }

    /**
     * Toggle scaler active status
     */
    public function toggleActive($id)
    {
        $scaler = MasScaler::findOrFail($id);
        $scaler->is_active = !$scaler->is_active;
        $scaler->save();

        return response()->json([
            'success' => true,
            'message' => 'Scaler status updated',
            'is_active' => $scaler->is_active
        ]);
    }

    /**
     * Download scaler file
     */
    public function download($id)
    {
        $scaler = MasScaler::findOrFail($id);

        if (!$scaler->fileExists()) {
            return redirect()->back()->with('error', 'Scaler file not found');
        }

        return Storage::download($scaler->file_path, $scaler->name . '_scaler.' . pathinfo($scaler->file_path, PATHINFO_EXTENSION));
    }
}


