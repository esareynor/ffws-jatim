<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasSensorThresholdTemplate;
use App\Models\MasSensorThresholdLevel;
use App\Models\MasSensorThresholdAssignment;
use App\Models\MasSensor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ThresholdController extends Controller
{
    /**
     * Display threshold management page
     */
    public function index()
    {
        $templates = MasSensorThresholdTemplate::with(['levels' => function($query) {
            $query->orderBy('level_order');
        }])->get();

        $sensors = MasSensor::select('id', 'code', 'parameter', 'unit')
            ->where('status', 'active')
            ->get();

        return view('admin.thresholds.index', compact('templates', 'sensors'));
    }

    /**
     * Display template management page
     */
    public function templates()
    {
        return view('admin.thresholds.templates');
    }

    /**
     * Get all templates (API)
     */
    public function getTemplates(Request $request)
    {
        $query = MasSensorThresholdTemplate::with(['levels' => function($q) {
            $q->orderBy('level_order');
        }]);

        if ($request->has('parameter_type')) {
            $query->where('parameter_type', $request->parameter_type);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $templates = $query->get();

        return response()->json([
            'success' => true,
            'data' => $templates
        ]);
    }

    /**
     * Store new template
     */
    public function storeTemplate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parameter_type' => 'required|in:water_level,rainfall,discharge,temperature,other',
            'unit' => 'nullable|string|max:50',
            'is_active' => 'boolean'
        ]);

        try {
            DB::beginTransaction();

            // Generate unique code
            $validated['code'] = 'THR-' . strtoupper(Str::random(8));
            $validated['is_active'] = $request->has('is_active') ? $request->is_active : true;

            $template = MasSensorThresholdTemplate::create($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Threshold template created successfully',
                'data' => $template
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create template: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update template
     */
    public function updateTemplate(Request $request, $id)
    {
        $template = MasSensorThresholdTemplate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parameter_type' => 'required|in:water_level,rainfall,discharge,temperature,other',
            'unit' => 'nullable|string|max:50',
            'is_active' => 'boolean'
        ]);

        try {
            $template->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Template updated successfully',
                'data' => $template
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update template: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete template
     */
    public function destroyTemplate($id)
    {
        try {
            $template = MasSensorThresholdTemplate::findOrFail($id);
            
            // Check if template is assigned to any sensors
            $assignmentCount = MasSensorThresholdAssignment::where('threshold_template_code', $template->code)->count();
            
            if ($assignmentCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete template. It is assigned to {$assignmentCount} sensor(s)."
                ], 422);
            }

            $template->delete();

            return response()->json([
                'success' => true,
                'message' => 'Template deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete template: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get levels for a template
     */
    public function getLevels($templateId)
    {
        $levels = MasSensorThresholdLevel::where('threshold_template_code', function($query) use ($templateId) {
            $query->select('code')
                  ->from('mas_sensor_threshold_templates')
                  ->where('id', $templateId);
        })->orderBy('level_order')->get();

        return response()->json([
            'success' => true,
            'data' => $levels
        ]);
    }

    /**
     * Store new level
     */
    public function storeLevel(Request $request, $templateId)
    {
        $template = MasSensorThresholdTemplate::findOrFail($templateId);

        $validated = $request->validate([
            'level_name' => 'required|string|max:100',
            'level_order' => 'required|integer|min:1',
            'min_value' => 'nullable|numeric',
            'max_value' => 'nullable|numeric',
            'color' => 'nullable|string|max:20',
            'color_hex' => 'nullable|string|max:7',
            'severity' => 'required|in:normal,watch,warning,danger,critical',
            'alert_enabled' => 'boolean',
            'alert_message' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            // Generate unique code
            $validated['level_code'] = 'LVL-' . strtoupper(Str::random(8));
            $validated['threshold_template_code'] = $template->code;
            $validated['alert_enabled'] = $request->has('alert_enabled') ? $request->alert_enabled : false;

            $level = MasSensorThresholdLevel::create($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Threshold level created successfully',
                'data' => $level
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create level: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update level
     */
    public function updateLevel(Request $request, $templateId, $levelId)
    {
        $level = MasSensorThresholdLevel::findOrFail($levelId);

        $validated = $request->validate([
            'level_name' => 'required|string|max:100',
            'level_order' => 'required|integer|min:1',
            'min_value' => 'nullable|numeric',
            'max_value' => 'nullable|numeric',
            'color' => 'nullable|string|max:20',
            'color_hex' => 'nullable|string|max:7',
            'severity' => 'required|in:normal,watch,warning,danger,critical',
            'alert_enabled' => 'boolean',
            'alert_message' => 'nullable|string'
        ]);

        try {
            $level->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Level updated successfully',
                'data' => $level
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update level: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete level
     */
    public function destroyLevel($templateId, $levelId)
    {
        try {
            $level = MasSensorThresholdLevel::findOrFail($levelId);
            $level->delete();

            return response()->json([
                'success' => true,
                'message' => 'Level deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete level: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sensor assignments
     */
    public function getAssignments(Request $request)
    {
        $query = MasSensorThresholdAssignment::with(['sensor', 'template.levels']);

        if ($request->has('sensor_code')) {
            $query->where('mas_sensor_code', $request->sensor_code);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $assignments = $query->get();

        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    /**
     * Assign template to sensor
     */
    public function assignTemplate(Request $request)
    {
        $validated = $request->validate([
            'mas_sensor_code' => 'required|exists:mas_sensors,code',
            'threshold_template_code' => 'required|exists:mas_sensor_threshold_templates,code',
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after:effective_from',
            'notes' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            // Deactivate existing active assignments for this sensor
            MasSensorThresholdAssignment::where('mas_sensor_code', $validated['mas_sensor_code'])
                ->where('is_active', true)
                ->update(['is_active' => false]);

            // Create new assignment
            $validated['is_active'] = true;
            $assignment = MasSensorThresholdAssignment::create($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Template assigned to sensor successfully',
                'data' => $assignment->load(['sensor', 'template.levels'])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign template: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update assignment
     */
    public function updateAssignment(Request $request, $id)
    {
        $assignment = MasSensorThresholdAssignment::findOrFail($id);

        $validated = $request->validate([
            'effective_from' => 'required|date',
            'effective_to' => 'nullable|date|after:effective_from',
            'is_active' => 'boolean',
            'notes' => 'nullable|string'
        ]);

        try {
            $assignment->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Assignment updated successfully',
                'data' => $assignment->load(['sensor', 'template.levels'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update assignment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete assignment
     */
    public function destroyAssignment($id)
    {
        try {
            $assignment = MasSensorThresholdAssignment::findOrFail($id);
            $assignment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Assignment deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete assignment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get active threshold for sensor
     */
    public function getActiveThreshold($sensorCode)
    {
        $assignment = MasSensorThresholdAssignment::with(['template.levels' => function($q) {
            $q->orderBy('level_order');
        }])
        ->where('mas_sensor_code', $sensorCode)
        ->where('is_active', true)
        ->whereDate('effective_from', '<=', now())
        ->where(function($q) {
            $q->whereNull('effective_to')
              ->orWhereDate('effective_to', '>=', now());
        })
        ->first();

        if (!$assignment) {
            return response()->json([
                'success' => false,
                'message' => 'No active threshold found for this sensor'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $assignment
        ]);
    }
}

