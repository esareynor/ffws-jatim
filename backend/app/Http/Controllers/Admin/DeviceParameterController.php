<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasDeviceParameter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DeviceParameterController extends Controller
{
    /**
     * Display device parameters
     */
    public function index(Request $request)
    {
        $query = MasDeviceParameter::query();

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $parameters = $query->orderBy('name')->paginate(20);
        $parameterOptions = self::getDeviceParameterOptions();

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => $parameters
            ]);
        }

        return view('admin.device_parameters.index', compact('parameters', 'parameterOptions'));
    }

    /**
     * Get device parameter options
     */
    public static function getDeviceParameterOptions()
    {
        return [
            'Manual - Peilschaal' => 'Manual - Peilschaal',
            'Manual - Ombrometer' => 'Manual - Ombrometer',
            'Automatic - AWLR' => 'Automatic - AWLR',
            'Automatic - ARR' => 'Automatic - ARR',
            'Automatic - Radar' => 'Automatic - Radar',
        ];
    }

    /**
     * Store new device parameter
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|in:Manual - Peilschaal,Manual - Ombrometer,Automatic - AWLR,Automatic - ARR,Automatic - Radar',
            'code' => 'required|string|max:100|unique:mas_device_parameters,code'
        ]);

        try {
            DB::beginTransaction();

            $parameter = MasDeviceParameter::create($validated);

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Device parameter created successfully',
                    'data' => $parameter
                ]);
            }

            return redirect()->route('admin.device-parameters.index')
                ->with('success', 'Device parameter created successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create device parameter: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to create device parameter: ' . $e->getMessage());
        }
    }

    /**
     * Update device parameter
     */
    public function update(Request $request, $id)
    {
        $parameter = MasDeviceParameter::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|in:Manual - Peilschaal,Manual - Ombrometer,Automatic - AWLR,Automatic - ARR,Automatic - Radar',
            'code' => 'required|string|max:100|unique:mas_device_parameters,code,' . $id
        ]);

        try {
            $parameter->update($validated);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Device parameter updated successfully',
                    'data' => $parameter
                ]);
            }

            return redirect()->route('admin.device-parameters.index')
                ->with('success', 'Device parameter updated successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update device parameter: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to update device parameter: ' . $e->getMessage());
        }
    }

    /**
     * Delete device parameter
     */
    public function destroy(Request $request, $id)
    {
        try {
            $parameter = MasDeviceParameter::findOrFail($id);
            $parameter->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Device parameter deleted successfully'
                ]);
            }

            return redirect()->route('admin.device-parameters.index')
                ->with('success', 'Device parameter deleted successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete device parameter: ' . $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Failed to delete device parameter: ' . $e->getMessage());
        }
    }
}

