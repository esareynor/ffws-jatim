<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DataPrediction;
use App\Models\MasSensor;
use App\Models\MasModel;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DataPredictionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): View
    {
        $query = DataPrediction::with(['masSensor', 'masModel'])
            ->orderBy('prediction_run_at', 'desc');

        // Filter berdasarkan sensor
        if ($request->filled('sensor_id')) {
            $query->where('mas_sensor_id', $request->sensor_id);
        }

        // Filter berdasarkan model
        if ($request->filled('model_id')) {
            $query->where('mas_model_id', $request->model_id);
        }

        // Filter berdasarkan status threshold
        if ($request->filled('status')) {
            $query->where('threshold_prediction_status', $request->status);
        }

        // Filter berdasarkan tanggal
        if ($request->filled('date_from')) {
            $query->whereDate('prediction_run_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('prediction_run_at', '<=', $request->date_to);
        }

        $predictions = $query->paginate(20);

        // Ambil data untuk filter dropdown
        $sensors = MasSensor::select('id', 'description', 'code')->get();
        $models = MasModel::select('id', 'name')->get();

        return view('admin.data_predictions.index', compact(
            'predictions',
            'sensors',
            'models'
        ));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): View
    {
        $sensors = MasSensor::select('id', 'description', 'code')->get();
        $models = MasModel::select('id', 'name')->get();

        return view('admin.data_predictions.create', compact('sensors', 'models'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mas_sensor_id' => 'required|exists:mas_sensors,id',
            'mas_sensor_code' => 'required|string|max:255',
            'mas_model_id' => 'required|exists:mas_models,id',
            'prediction_run_at' => 'required|date',
            'prediction_for_ts' => 'required|date',
            'predicted_value' => 'required|numeric',
            'confidence_score' => 'nullable|numeric|between:0,1',
            'threshold_prediction_status' => 'nullable|in:safe,warning,danger',
        ]);

        DataPrediction::create($validated);

        return redirect()->route('admin.data_predictions.index')
            ->with('success', 'Data prediksi berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(DataPrediction $dataPrediction): View
    {
        $dataPrediction->load(['masSensor', 'masModel']);
        
        return view('admin.data_predictions.show', compact('dataPrediction'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DataPrediction $dataPrediction): View
    {
        $sensors = MasSensor::select('id', 'description', 'code')->get();
        $models = MasModel::select('id', 'name')->get();

        return view('admin.data_predictions.edit', compact('dataPrediction', 'sensors', 'models'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DataPrediction $dataPrediction)
    {
        $validated = $request->validate([
            'mas_sensor_id' => 'required|exists:mas_sensors,id',
            'mas_sensor_code' => 'required|string|max:255',
            'mas_model_id' => 'required|exists:mas_models,id',
            'prediction_run_at' => 'required|date',
            'prediction_for_ts' => 'required|date',
            'predicted_value' => 'required|numeric',
            'confidence_score' => 'nullable|numeric|between:0,1',
            'threshold_prediction_status' => 'nullable|in:safe,warning,danger',
        ]);

        $dataPrediction->update($validated);

        return redirect()->route('admin.data_predictions.index')
            ->with('success', 'Data prediksi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DataPrediction $dataPrediction)
    {
        $dataPrediction->delete();

        return redirect()->route('admin.data_predictions.index')
            ->with('success', 'Data prediksi berhasil dihapus.');
    }
}
