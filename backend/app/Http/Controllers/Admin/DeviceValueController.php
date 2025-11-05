<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasDevice;
use App\Models\DeviceValue;
use App\Models\MasRiverBasin;
use App\Models\MasWatershed;
use App\Models\MasCity;
use App\Models\MasRegency;
use App\Models\MasVillage;
use App\Models\MasUpt;
use App\Models\MasUptd;
use App\Models\MasDeviceParameter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DeviceValueController extends Controller
{
    /**
     * Display device extended data management
     */
    public function index(Request $request)
    {
        $query = DeviceValue::with([
            'device',
            'riverBasin',
            'watershed',
            'city',
            'regency',
            'village',
            'upt',
            'uptd',
            'deviceParameter'
        ]);

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
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

        // Filter by device
        if ($request->has('device_code')) {
            $query->where('mas_device_code', $request->device_code);
        }

        $deviceValues = $query->paginate(20);
        $devices = MasDevice::select('id', 'code', 'name')->orderBy('name')->get();
        $riverBasins = MasRiverBasin::select('id', 'code', 'name')->orderBy('name')->get();
        $deviceParameters = MasDeviceParameter::select('id', 'code', 'name')->orderBy('name')->get();

        // Prepare table headers
        $tableHeaders = [
            ['key' => 'device', 'label' => 'Device'],
            ['key' => 'location', 'label' => 'Location'],
            ['key' => 'installation_date', 'label' => 'Installation', 'format' => 'date'],
            ['key' => 'maintenance', 'label' => 'Maintenance'],
            ['key' => 'status', 'label' => 'Status', 'format' => 'status'],
            ['key' => 'actions', 'label' => 'Actions', 'format' => 'actions']
        ];

        // Format rows data
        $deviceValues->getCollection()->transform(function ($deviceValue) {
            // Format device name with icon
            $deviceValue->formatted_device = $deviceValue->name ?? $deviceValue->device->name;
            $deviceValue->formatted_device_code = $deviceValue->device->code;
            
            // Format location
            if ($deviceValue->latitude && $deviceValue->longitude) {
                $deviceValue->formatted_location = number_format($deviceValue->latitude, 6) . ', ' . number_format($deviceValue->longitude, 6);
                if ($deviceValue->elevation) {
                    $deviceValue->formatted_location .= ' (Elevation: ' . $deviceValue->elevation . 'm)';
                }
            } else {
                $deviceValue->formatted_location = 'Not set';
            }
            
            // Format maintenance
            if ($deviceValue->next_maintenance) {
                $daysUntil = $deviceValue->daysUntilMaintenance();
                $deviceValue->formatted_maintenance = $deviceValue->next_maintenance->format('M d, Y');
                $deviceValue->formatted_maintenance_status = $daysUntil !== null && $daysUntil < 0 ? 'overdue' : ($daysUntil !== null && $daysUntil <= 7 ? 'upcoming' : 'normal');
                $deviceValue->formatted_maintenance_days = $daysUntil;
            } else {
                $deviceValue->formatted_maintenance = 'Not scheduled';
                $deviceValue->formatted_maintenance_status = null;
            }
            
            // Format threshold status
            $deviceValue->formatted_threshold_status = $deviceValue->status;
            
            // Prepare actions
            $deviceValue->actions = [
                [
                    'type' => 'link',
                    'label' => 'Edit',
                    'icon' => 'edit',
                    'color' => 'blue',
                    'url' => route('admin.device-values.edit', $deviceValue->id),
                    'title' => 'Edit'
                ],
                [
                    'type' => 'delete',
                    'label' => 'Delete',
                    'icon' => 'trash',
                    'color' => 'red',
                    'url' => route('admin.device-values.destroy', $deviceValue->id),
                    'title' => 'Delete',
                    'confirm' => 'Are you sure you want to delete this device configuration?'
                ]
            ];
            
            return $deviceValue;
        });

        return view('admin.device_values.index', compact(
            'deviceValues',
            'devices',
            'riverBasins',
            'deviceParameters',
            'tableHeaders'
        ));
    }

    /**
     * Show create form
     */
    public function create()
    {
        $devices = MasDevice::select('id', 'code', 'name')->orderBy('name')->get();
        $riverBasins = MasRiverBasin::select('id', 'code', 'name')->orderBy('name')->get();
        $watersheds = MasWatershed::select('id', 'code', 'name')->orderBy('name')->get();
        $cities = MasCity::select('id', 'code', 'name')->orderBy('name')->get();
        $regencies = MasRegency::select('id', 'regencies_code as code', 'regencies_name as name')->orderBy('regencies_name')->get();
        $villages = MasVillage::select('id', 'code', 'name')->orderBy('name')->get();
        $upts = MasUpt::select('id', 'code', 'name')->orderBy('name')->get();
        $uptds = MasUptd::select('id', 'code', 'name')->orderBy('name')->get();
        $deviceParameters = MasDeviceParameter::select('id', 'code', 'name')->orderBy('name')->get();

        return view('admin.device_values.create', compact(
            'devices',
            'riverBasins',
            'watersheds',
            'cities',
            'regencies',
            'villages',
            'upts',
            'uptds',
            'deviceParameters'
        ));
    }

    /**
     * Store new device value
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mas_device_code' => 'required|exists:mas_devices,code',
            'mas_river_basin_code' => 'nullable|exists:mas_river_basins,code',
            'mas_watershed_code' => 'nullable|exists:mas_watersheds,code',
            'mas_city_code' => 'nullable|exists:mas_cities,code',
            'mas_regency_code' => 'nullable|exists:mas_regencies,regencies_code',
            'mas_village_code' => 'nullable|exists:mas_villages,code',
            'mas_upt_code' => 'nullable|exists:mas_upts,code',
            'mas_uptd_code' => 'nullable|exists:mas_uptds,code',
            'mas_device_parameter_code' => 'nullable|exists:mas_device_parameters,code',
            'name' => 'nullable|string|max:255',
            'icon_path' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'elevation' => 'nullable|numeric',
            'status' => 'required|in:active,inactive,pending,maintenance',
            'description' => 'nullable|string',
            'installation_date' => 'nullable|date',
            'last_maintenance' => 'nullable|date',
            'next_maintenance' => 'nullable|date|after:last_maintenance'
        ]);

        try {
            DB::beginTransaction();

            $deviceValue = DeviceValue::create($validated);

            DB::commit();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Device extended data created successfully',
                    'data' => $deviceValue->load([
                        'device', 'riverBasin', 'watershed', 'city', 
                        'regency', 'village', 'upt', 'uptd', 'deviceParameter'
                    ])
                ]);
            }

            return redirect()->route('admin.device-values.index')
                ->with('success', 'Device extended data created successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create device extended data: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to create device extended data: ' . $e->getMessage());
        }
    }

    /**
     * Show edit form
     */
    public function edit($id)
    {
        $deviceValue = DeviceValue::with([
            'device', 'riverBasin', 'watershed', 'city',
            'regency', 'village', 'upt', 'uptd', 'deviceParameter'
        ])->findOrFail($id);

        $devices = MasDevice::select('id', 'code', 'name')->orderBy('name')->get();
        $riverBasins = MasRiverBasin::select('id', 'code', 'name')->orderBy('name')->get();
        $watersheds = MasWatershed::select('id', 'code', 'name')->orderBy('name')->get();
        $cities = MasCity::select('id', 'code', 'name')->orderBy('name')->get();
        $regencies = MasRegency::select('id', 'regencies_code as code', 'regencies_name as name')->orderBy('regencies_name')->get();
        $villages = MasVillage::select('id', 'code', 'name')->orderBy('name')->get();
        $upts = MasUpt::select('id', 'code', 'name')->orderBy('name')->get();
        $uptds = MasUptd::select('id', 'code', 'name')->orderBy('name')->get();
        $deviceParameters = MasDeviceParameter::select('id', 'code', 'name')->orderBy('name')->get();

        return view('admin.device_values.edit', compact(
            'deviceValue',
            'devices',
            'riverBasins',
            'watersheds',
            'cities',
            'regencies',
            'villages',
            'upts',
            'uptds',
            'deviceParameters'
        ));
    }

    /**
     * Update device value
     */
    public function update(Request $request, $id)
    {
        $deviceValue = DeviceValue::findOrFail($id);

        $validated = $request->validate([
            'mas_device_code' => 'required|exists:mas_devices,code',
            'mas_river_basin_code' => 'nullable|exists:mas_river_basins,code',
            'mas_watershed_code' => 'nullable|exists:mas_watersheds,code',
            'mas_city_code' => 'nullable|exists:mas_cities,code',
            'mas_regency_code' => 'nullable|exists:mas_regencies,regencies_code',
            'mas_village_code' => 'nullable|exists:mas_villages,code',
            'mas_upt_code' => 'nullable|exists:mas_upts,code',
            'mas_uptd_code' => 'nullable|exists:mas_uptds,code',
            'mas_device_parameter_code' => 'nullable|exists:mas_device_parameters,code',
            'name' => 'nullable|string|max:255',
            'icon_path' => 'nullable|string|max:500',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'elevation' => 'nullable|numeric',
            'status' => 'required|in:active,inactive,pending,maintenance',
            'description' => 'nullable|string',
            'installation_date' => 'nullable|date',
            'last_maintenance' => 'nullable|date',
            'next_maintenance' => 'nullable|date|after:last_maintenance'
        ]);

        try {
            $deviceValue->update($validated);

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Device extended data updated successfully',
                    'data' => $deviceValue->load([
                        'device', 'riverBasin', 'watershed', 'city',
                        'regency', 'village', 'upt', 'uptd', 'deviceParameter'
                    ])
                ]);
            }

            return redirect()->route('admin.device-values.index')
                ->with('success', 'Device extended data updated successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update device extended data: ' . $e->getMessage()
                ], 500);
            }

            return back()->withInput()
                ->with('error', 'Failed to update device extended data: ' . $e->getMessage());
        }
    }

    /**
     * Delete device value
     */
    public function destroy(Request $request, $id)
    {
        try {
            $deviceValue = DeviceValue::findOrFail($id);
            $deviceValue->delete();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Device extended data deleted successfully'
                ]);
            }

            return redirect()->route('admin.device-values.index')
                ->with('success', 'Device extended data deleted successfully');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete device extended data: ' . $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Failed to delete device extended data: ' . $e->getMessage());
        }
    }

    /**
     * Get device values by device code (API)
     */
    public function getByDevice($deviceCode)
    {
        $deviceValues = DeviceValue::with([
            'device', 'riverBasin', 'watershed', 'city',
            'regency', 'village', 'upt', 'uptd', 'deviceParameter'
        ])->where('mas_device_code', $deviceCode)->get();

        return response()->json([
            'success' => true,
            'data' => $deviceValues
        ]);
    }

    /**
     * Get maintenance schedule
     */
    public function maintenanceSchedule(Request $request)
    {
        $query = DeviceValue::with('device')
            ->whereNotNull('next_maintenance')
            ->orderBy('next_maintenance');

        // Filter upcoming only
        if ($request->has('upcoming')) {
            $query->where('next_maintenance', '>=', now());
        }

        // Filter overdue only
        if ($request->has('overdue')) {
            $query->where('next_maintenance', '<', now());
        }

        $schedule = $query->get();

        return response()->json([
            'success' => true,
            'data' => $schedule
        ]);
    }
}

