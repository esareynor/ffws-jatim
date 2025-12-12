<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeviceCctv;
use App\Models\MasDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class DeviceCctvController extends Controller
{
    /**
     * Display CCTV configurations
     */
    public function index(Request $request)
    {
        $query = DeviceCctv::with('device');

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('cctv_url', 'like', "%{$search}%")
                  ->orWhereHas('device', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('code', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by stream type
        if ($request->has('stream_type')) {
            $query->where('stream_type', $request->stream_type);
        }

        // Filter by active
        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $cctvs = $query->paginate(20);
        $devices = MasDevice::select('id', 'code', 'name')->orderBy('name')->get();

        return view('admin.device_cctv.index', compact('cctvs', 'devices'));
    }

    /**
     * Show create form
     */
    public function create()
    {
        $devices = MasDevice::select('id', 'code', 'name')->orderBy('name')->get();
        return view('admin.device_cctv.create', compact('devices'));
    }

    /**
     * Store new CCTV configuration
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mas_device_code' => 'required|exists:mas_devices,code|unique:device_cctv,mas_device_code',
            'cctv_url' => 'required|string|max:1024',
            'stream_type' => 'required|in:rtsp,hls,mjpeg,webrtc,youtube,other',
            'username' => 'nullable|string|max:255',
            'password' => 'nullable|string|max:255',
            'status' => 'required|in:online,offline,error,unknown',
            'is_active' => 'boolean',
            'description' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            // Encrypt password if provided
            if (!empty($validated['password'])) {
                $validated['password'] = Crypt::encryptString($validated['password']);
            }

            $validated['is_active'] = $request->has('is_active') ? true : false;

            $cctv = DeviceCctv::create($validated);

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'CCTV configuration created successfully',
                    'data' => $cctv->load('device')
                ]);
            }

            return redirect()->route('admin.device-cctv.index')
                ->with('success', 'CCTV configuration created successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create CCTV configuration: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to create CCTV configuration: ' . $e->getMessage());
        }
    }

    /**
     * Show edit form
     */
    public function edit($id)
    {
        $cctv = DeviceCctv::with('device')->findOrFail($id);
        $devices = MasDevice::select('id', 'code', 'name')->orderBy('name')->get();

        return view('admin.device_cctv.edit', compact('cctv', 'devices'));
    }

    /**
     * Update CCTV configuration
     */
    public function update(Request $request, $id)
    {
        $cctv = DeviceCctv::findOrFail($id);

        $validated = $request->validate([
            'mas_device_code' => 'required|exists:mas_devices,code|unique:device_cctv,mas_device_code,' . $id,
            'cctv_url' => 'required|string|max:1024',
            'stream_type' => 'required|in:rtsp,hls,mjpeg,webrtc,youtube,other',
            'username' => 'nullable|string|max:255',
            'password' => 'nullable|string|max:255',
            'status' => 'required|in:online,offline,error,unknown',
            'is_active' => 'boolean',
            'description' => 'nullable|string'
        ]);

        try {
            // Encrypt password if provided and changed
            if (!empty($validated['password'])) {
                $validated['password'] = Crypt::encryptString($validated['password']);
            } else {
                // Keep existing password if not provided
                unset($validated['password']);
            }

            $validated['is_active'] = $request->has('is_active') ? true : false;

            $cctv->update($validated);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'CCTV configuration updated successfully',
                    'data' => $cctv->load('device')
                ]);
            }

            return redirect()->route('admin.device-cctv.index')
                ->with('success', 'CCTV configuration updated successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update CCTV configuration: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to update CCTV configuration: ' . $e->getMessage());
        }
    }

    /**
     * Delete CCTV configuration
     */
    public function destroy(Request $request, $id)
    {
        try {
            $cctv = DeviceCctv::findOrFail($id);
            $cctv->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'CCTV configuration deleted successfully'
                ]);
            }

            return redirect()->route('admin.device-cctv.index')
                ->with('success', 'CCTV configuration deleted successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete CCTV configuration: ' . $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Failed to delete CCTV configuration: ' . $e->getMessage());
        }
    }

    /**
     * Test CCTV connection
     */
    public function testConnection($id)
    {
        try {
            $cctv = DeviceCctv::findOrFail($id);
            
            // Update last check time
            $cctv->update(['last_check' => now()]);

            // Here you would implement actual connection testing
            // For now, we'll return a success response
            
            return response()->json([
                'success' => true,
                'message' => 'CCTV connection test initiated',
                'data' => [
                    'status' => 'testing',
                    'last_check' => $cctv->last_check
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to test connection: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle active status
     */
    public function toggleActive($id)
    {
        try {
            $cctv = DeviceCctv::findOrFail($id);
            $cctv->update(['is_active' => !$cctv->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'CCTV status updated successfully',
                'data' => ['is_active' => $cctv->is_active]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get CCTV by device
     */
    public function getByDevice($deviceCode)
    {
        $cctv = DeviceCctv::with('device')
            ->where('mas_device_code', $deviceCode)
            ->first();

        if (!$cctv) {
            return response()->json([
                'success' => false,
                'message' => 'CCTV configuration not found for this device'
            ], 404);
        }

        // Don't expose encrypted password
        $cctv->makeHidden(['password']);

        return response()->json([
            'success' => true,
            'data' => $cctv
        ]);
    }
}

