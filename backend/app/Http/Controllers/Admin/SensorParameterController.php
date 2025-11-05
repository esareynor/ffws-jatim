<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasSensorParameter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SensorParameterController extends Controller
{
    /**
     * Display sensor parameters
     */
    public function index(Request $request)
    {
        $query = MasSensorParameter::query();

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $parameters = $query->orderBy('name')->paginate(20);

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'code', 'label' => 'Code'],
            ['key' => 'name', 'label' => 'Name'],
            ['key' => 'created_at', 'label' => 'Created At', 'format' => 'date'],
            ['key' => 'actions', 'label' => 'Actions', 'format' => 'actions']
        ];

        // Format rows data
        $parameters->getCollection()->transform(function ($parameter) {
            // Prepare actions with Alpine.js
            $parameter->actions = [
                [
                    'type' => 'button',
                    'label' => 'Edit',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'onclick' => 'editParameter(' . json_encode($parameter) . ')',
                    'title' => 'Edit'
                ],
                [
                    'type' => 'button',
                    'label' => 'Delete',
                    'icon' => 'trash',
                    'color' => 'red',
                    'onclick' => 'deleteParameter(' . $parameter->id . ')',
                    'title' => 'Delete'
                ]
            ];
            
            return $parameter;
        });

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => $parameters
            ]);
        }

        return view('admin.sensor_parameters.index', compact('parameters', 'tableHeaders'));
    }

    /**
     * Store new sensor parameter
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_sensor_parameters,code'
        ]);

        try {
            DB::beginTransaction();

            $parameter = MasSensorParameter::create($validated);

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Sensor parameter created successfully',
                    'data' => $parameter
                ]);
            }

            return redirect()->route('admin.sensor-parameters.index')
                ->with('success', 'Sensor parameter created successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create sensor parameter: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to create sensor parameter: ' . $e->getMessage());
        }
    }

    /**
     * Update sensor parameter
     */
    public function update(Request $request, $id)
    {
        $parameter = MasSensorParameter::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:mas_sensor_parameters,code,' . $id
        ]);

        try {
            $parameter->update($validated);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Sensor parameter updated successfully',
                    'data' => $parameter
                ]);
            }

            return redirect()->route('admin.sensor-parameters.index')
                ->with('success', 'Sensor parameter updated successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update sensor parameter: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to update sensor parameter: ' . $e->getMessage());
        }
    }

    /**
     * Delete sensor parameter
     */
    public function destroy(Request $request, $id)
    {
        try {
            $parameter = MasSensorParameter::findOrFail($id);
            $parameter->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Sensor parameter deleted successfully'
                ]);
            }

            return redirect()->route('admin.sensor-parameters.index')
                ->with('success', 'Sensor parameter deleted successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete sensor parameter: ' . $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Failed to delete sensor parameter: ' . $e->getMessage());
        }
    }
}

