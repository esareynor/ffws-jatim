<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasRiverShape;
use App\Models\MasSensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RiverShapeController extends Controller
{
    /**
     * Display a listing of the river shapes.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $sensorCode = $request->input('sensor_code');

        $query = MasRiverShape::with('sensor');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('sensor_code', 'like', "%{$search}%")
                  ->orWhereHas('sensor', function($sq) use ($search) {
                      $sq->where('code', 'like', "%{$search}%");
                  });
            });
        }

        if ($sensorCode) {
            $query->where('sensor_code', $sensorCode);
        }

        $riverShapes = $query->orderBy('created_at', 'desc')->paginate($perPage)->appends(request()->query());
        $sensors = MasSensor::where('status', 'active')->get(['id', 'code', 'parameter']);

        // Prepare filter configuration
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari',
                'placeholder' => 'Cari berdasarkan kode atau sensor...'
            ],
            [
                'type' => 'select',
                'name' => 'sensor_code',
                'label' => 'Sensor',
                'empty_option' => 'Semua Sensor',
                'options' => $sensors->map(function($sensor) {
                    return [
                        'value' => $sensor->code,
                        'label' => $sensor->code . ' (' . $sensor->parameter . ')'
                    ];
                })->toArray()
            ]
        ];

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'code', 'label' => 'Code'],
            ['key' => 'formatted_sensor', 'label' => 'Sensor Code'],
            ['key' => 'formatted_coordinates', 'label' => 'Coordinates (X, Y)'],
            ['key' => 'formatted_parameters', 'label' => 'Parameters (A, B, C)'],
            ['key' => 'formatted_created_at', 'label' => 'Created', 'format' => 'date'],
            ['key' => 'actions', 'label' => 'Actions', 'format' => 'actions']
        ];

        // Format rows data
        $riverShapes->getCollection()->transform(function ($shape) {
            // Format sensor code
            $shape->formatted_sensor = $shape->sensor_code;
            if ($shape->sensor) {
                $shape->formatted_sensor .= ' <span class="text-xs text-gray-500 dark:text-gray-400">(' . $shape->sensor->parameter . ')</span>';
            }
            
            // Format coordinates
            $shape->formatted_coordinates = 'X: ' . ($shape->x ?? 'N/A') . ', Y: ' . ($shape->y ?? 'N/A');
            
            // Format parameters
            $shape->formatted_parameters = 'A: ' . ($shape->a ?? 'N/A') . ', B: ' . ($shape->b ?? 'N/A') . ', C: ' . ($shape->c ?? 'N/A');
            
            // Format created at
            $shape->formatted_received_at = $shape->created_at;
            
            // Format actions
            $shape->actions = [
                [
                    'label' => 'View',
                    'icon' => 'eye',
                    'url' => '#',
                    'onclick' => 'viewDetail(' . $shape->id . ')',
                    'color' => 'gray'
                ],
                [
                    'label' => 'Edit',
                    'icon' => 'pen',
                    'url' => '#',
                    'onclick' => 'editShape(' . $shape->id . ')',
                    'color' => 'gray'
                ],
                [
                    'label' => 'Delete',
                    'icon' => 'trash',
                    'url' => route('admin.river-shapes.destroy', $shape->id),
                    'method' => 'DELETE',
                    'confirm' => 'Data yang dihapus tidak dapat dikembalikan. Lanjutkan?',
                    'color' => 'red'
                ]
            ];
            
            return $shape;
        });

        return view('admin.river_shapes.index', compact('riverShapes', 'sensors', 'filterConfig', 'tableHeaders'));
    }

    /**
     * Show the form for creating a new river shape.
     */
    public function create()
    {
        $sensors = MasSensor::where('status', 'active')->get(['id', 'code', 'parameter']);
        return view('admin.river_shapes.create', compact('sensors'));
    }

    /**
     * Store a newly created river shape in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'sensor_code' => 'required|string|max:100|exists:mas_sensors,code',
            'code' => 'nullable|string|max:100|unique:mas_river_shape,code',
            'array_codes' => 'nullable|json',
            'x' => 'nullable|numeric',
            'y' => 'nullable|numeric',
            'a' => 'nullable|numeric',
            'b' => 'nullable|numeric',
            'c' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();

            // Generate code if not provided
            if (empty($data['code'])) {
                $data['code'] = 'RS-' . strtoupper(Str::random(8));
            }

            // Decode JSON string if needed
            if (isset($data['array_codes']) && is_string($data['array_codes'])) {
                $data['array_codes'] = json_decode($data['array_codes'], true);
            }

            $riverShape = MasRiverShape::create($data);

            return response()->json([
                'success' => true,
                'message' => 'River shape created successfully',
                'data' => $riverShape->load('sensor')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create river shape: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified river shape.
     */
    public function show($id)
    {
        try {
            $riverShape = MasRiverShape::with('sensor')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $riverShape
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'River shape not found'
            ], 404);
        }
    }

    /**
     * Show the form for editing the specified river shape.
     */
    public function edit($id)
    {
        $riverShape = MasRiverShape::findOrFail($id);
        $sensors = MasSensor::where('status', 'active')->get(['id', 'code', 'parameter']);

        return view('admin.river_shapes.edit', compact('riverShape', 'sensors'));
    }

    /**
     * Update the specified river shape in storage.
     */
    public function update(Request $request, $id)
    {
        $riverShape = MasRiverShape::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'sensor_code' => 'required|string|max:100|exists:mas_sensors,code',
            'code' => 'nullable|string|max:100|unique:mas_river_shape,code,' . $id,
            'array_codes' => 'nullable|json',
            'x' => 'nullable|numeric',
            'y' => 'nullable|numeric',
            'a' => 'nullable|numeric',
            'b' => 'nullable|numeric',
            'c' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();

            // Decode JSON string if needed
            if (isset($data['array_codes']) && is_string($data['array_codes'])) {
                $data['array_codes'] = json_decode($data['array_codes'], true);
            }

            $riverShape->update($data);

            return response()->json([
                'success' => true,
                'message' => 'River shape updated successfully',
                'data' => $riverShape->load('sensor')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update river shape: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified river shape from storage.
     */
    public function destroy($id)
    {
        try {
            $riverShape = MasRiverShape::findOrFail($id);
            $riverShape->delete();

            return response()->json([
                'success' => true,
                'message' => 'River shape deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete river shape: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get river shapes by sensor code.
     */
    public function getBySensor($sensorCode)
    {
        try {
            $riverShapes = MasRiverShape::with('sensor')
                ->where('sensor_code', $sensorCode)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $riverShapes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch river shapes: ' . $e->getMessage()
            ], 500);
        }
    }
}
