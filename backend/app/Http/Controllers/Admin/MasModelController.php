<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasModel;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class MasModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): View
    {
        $query = MasModel::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('version', 'like', "%{$search}%");
            });
        }

        // Filter by model type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $perPage = $request->get('per_page', 10);
        $models = $query->orderBy('created_at', 'desc')->paginate($perPage)->appends(request()->query());

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'name', 'label' => 'Nama Model', 'sortable' => true],
            ['key' => 'formatted_model_type', 'label' => 'Tipe Model', 'sortable' => true],
            ['key' => 'version', 'label' => 'Versi', 'sortable' => true],
            ['key' => 'formatted_is_active', 'label' => 'Status', 'sortable' => true],
            ['key' => 'formatted_created_at', 'label' => 'Dibuat', 'sortable' => true],
            ['key' => 'actions', 'label' => 'Aksi', 'sortable' => false, 'format' => 'actions']
        ];

        // Transform paginator items to include formatted data and actions
        $models->getCollection()->transform(function ($model) {
            // Ensure all fields are strings for display and handle null values
            $model->name = $model->name ? (string) $model->name : '';
            $model->type = $model->type ? (string) $model->type : 'other';
            $model->version = $model->version ? (string) $model->version : '';
            $model->description = $model->description ? (string) $model->description : '';
            $model->file_path = $model->file_path ? (string) $model->file_path : '';
            
            // Format data for display
            $model->formatted_model_type = $this->formatModelType($model->type);
            $model->formatted_is_active = $model->is_active ? 'Aktif' : 'Non-aktif';
            $model->formatted_created_at = $model->created_at ? $model->created_at->format('d/m/Y H:i') : '';
            
            $model->actions = [
                [
                    'type' => 'view',
                    'label' => 'Detail',
                    'url' => route('admin.mas-models.show', $model),
                    'icon' => 'eye',
                    'color' => 'blue'
                ],
                [
                    'type' => 'edit',
                    'label' => 'Edit',
                    'url' => route('admin.mas-models.form.edit', $model),
                    'icon' => 'pen',
                    'color' => 'green'
                ],
                [
                    'type' => 'toggle',
                    'label' => $model->is_active ? 'Nonaktifkan' : 'Aktifkan',
                    'url' => '#',
                    'icon' => $model->is_active ? 'pause' : 'play',
                    'color' => $model->is_active ? 'yellow' : 'green',
                    'onclick' => "MasModelsPage.toggleStatus({$model->id}, " . ($model->is_active ? 'true' : 'false') . ")"
                ],
                [
                    'type' => 'delete',
                    'label' => 'Hapus',
                    'url' => route('admin.mas-models.destroy', $model),
                    'icon' => 'trash',
                    'color' => 'red',
                    'method' => 'DELETE'
                ]
            ];
            return $model;
        });

        return view('admin.mas_models.index', compact('models', 'tableHeaders'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        $isEdit = false;
        $model = new MasModel();
        return view('admin.mas_models.form', compact('isEdit', 'model'));
    }

    /**
     * Show the unified form for creating or editing a resource.
     */
    public function form(MasModel $masModel = null): View
    {
        $isEdit = $masModel !== null;
        $model = $masModel ?? new MasModel();
        return view('admin.mas_models.form', compact('isEdit', 'model'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:lstm,gru,transformer,cnn,rnn,other',
            'version' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'file_path' => 'nullable|string|max:500',
            'n_steps_in' => 'nullable|integer|min:1|max:255',
            'n_steps_out' => 'nullable|integer|min:1|max:255',
            'is_active' => 'required|boolean'
        ]);

        MasModel::create($validated);

        return redirect()->route('admin.mas-models.index')
            ->with('success', 'Model berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(MasModel $masModel): View
    {
        $masModel->load('sensors');
        
        // Ensure all fields are safe for display
        $masModel->name = $masModel->name ? (string) $masModel->name : 'Unknown Model';
        $masModel->type = $masModel->type ? (string) $masModel->type : 'other';
        $masModel->version = $masModel->version ? (string) $masModel->version : '';
        $masModel->description = $masModel->description ? (string) $masModel->description : '';
        $masModel->file_path = $masModel->file_path ? (string) $masModel->file_path : '';
        
        // Format data for display
        $masModel->formatted_model_type = $this->formatModelType($masModel->type);
        $masModel->formatted_is_active = $masModel->is_active ? 'Aktif' : 'Non-aktif';
        $masModel->formatted_created_at = $masModel->created_at ? $masModel->created_at->format('d/m/Y H:i') : '';
        $masModel->formatted_updated_at = $masModel->updated_at ? $masModel->updated_at->format('d/m/Y H:i') : '';
        
        return view('admin.mas_models.show', ['model' => $masModel]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MasModel $masModel): View
    {
        $isEdit = true;
        return view('admin.mas_models.form', compact('isEdit', 'masModel'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MasModel $masModel): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:lstm,gru,transformer,cnn,rnn,other',
            'version' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'file_path' => 'nullable|string|max:500',
            'n_steps_in' => 'nullable|integer|min:1|max:255',
            'n_steps_out' => 'nullable|integer|min:1|max:255',
            'is_active' => 'required|boolean'
        ]);

        $masModel->update($validated);

        return redirect()->route('admin.mas-models.index')
            ->with('success', 'Model berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MasModel $masModel): RedirectResponse
    {
        // Check if model is being used by sensors
        if ($masModel->sensors()->count() > 0) {
            return redirect()->route('admin.mas-models.index')
                ->with('error', 'Tidak dapat menghapus model yang sedang digunakan oleh sensor.');
        }

        $masModel->delete();

        return redirect()->route('admin.mas-models.index')
            ->with('success', 'Model berhasil dihapus.');
    }

    /**
     * Toggle the status of the specified resource.
     */
    public function toggleStatus(Request $request, MasModel $masModel): RedirectResponse
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $masModel->update(['is_active' => $validated['is_active']]);

        $status = $validated['is_active'] ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->route('admin.mas-models.index')
            ->with('success', "Model berhasil {$status}.");
    }

    /**
     * Export models data.
     */
    public function export(Request $request)
    {
        $query = MasModel::query();

        // Apply same filters as index
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('version', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $models = $query->orderBy('created_at', 'desc')->get();

        $format = $request->get('format', 'csv');

        if ($format === 'csv') {
            return $this->exportToCsv($models);
        }

        return response()->json($models);
    }

    /**
     * Import models data.
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048'
        ]);

        // TODO: Implement CSV import logic
        // This is a placeholder implementation

        return response()->json([
            'success' => false,
            'message' => 'Fitur import belum diimplementasikan.'
        ]);
    }

    /**
     * Export data to CSV format.
     */
    private function exportToCsv($models)
    {
        $filename = 'mas_models_' . date('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($models) {
            $file = fopen('php://output', 'w');
            
            // CSV headers
            fputcsv($file, [
                'ID', 'Nama Model', 'Tipe Model', 'Versi', 'Deskripsi', 
                'File Path', 'N Steps In', 'N Steps Out', 'Status', 'Dibuat', 'Diperbarui'
            ]);

            // CSV data
            foreach ($models as $model) {
                fputcsv($file, [
                    $model->id,
                    $model->name,
                    $model->type,
                    $model->version,
                    $model->description,
                    $model->file_path,
                    $model->n_steps_in,
                    $model->n_steps_out,
                    $model->is_active ? 'Aktif' : 'Non-aktif',
                    $model->created_at->format('Y-m-d H:i:s'),
                    $model->updated_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Format model type for display.
     */
    private function formatModelType($type)
    {
        $types = [
            'lstm' => 'LSTM',
            'gru' => 'GRU',
            'transformer' => 'Transformer',
            'cnn' => 'CNN',
            'rnn' => 'RNN',
            'other' => 'Lainnya'
        ];
        return $types[$type] ?? strtoupper($type);
    }
}
