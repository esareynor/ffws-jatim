<?php


namespace App\Http\Controllers\Admin;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\MasDevice;
use App\Models\MasRiverBasin;

class MasDeviceController extends Controller
{
    public function index(Request $request)
    {
        $query = MasDevice::with('riverBasin');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhereHas('riverBasin', function ($rbQ) use ($search) {
                      $rbQ->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $devices = $query->orderBy('name')->paginate(10)->withQueryString();

        // Prepare data for table component
        $tableHeaders = [
            ['key' => 'id', 'label' => 'ID', 'sortable' => true],
            ['key' => 'river_basin_name', 'label' => 'DAS', 'sortable' => false],
            ['key' => 'name', 'label' => 'Nama Device', 'sortable' => true],
            ['key' => 'code', 'label' => 'Kode', 'sortable' => true],
            ['key' => 'latitude', 'label' => 'Latitude', 'sortable' => false],
            ['key' => 'longitude', 'label' => 'Longitude', 'sortable' => false],
            ['key' => 'elevation_m', 'label' => 'Elevasi (m)', 'sortable' => false],
            ['key' => 'status', 'label' => 'Status', 'format' => 'status', 'sortable' => true],
            ['key' => 'actions', 'label' => 'Aksi', 'format' => 'actions', 'sortable' => false]
        ];

        // Transform devices data for table
        $devices->getCollection()->transform(function ($device) {
            $detailData = [
                'id' => $device->id,
                'name' => addslashes($device->name),
                'code' => addslashes($device->code),
                'mas_river_basin_code' => $device->mas_river_basin_code,
                'latitude' => $device->latitude,
                'longitude' => $device->longitude,
                'elevation_m' => $device->elevation_m,
                'status' => $device->status
            ];
            $detailJson = json_encode($detailData);

            $device->river_basin_name = $device->riverBasin->name ?? '-';
            $device->latitude = number_format($device->latitude, 6);
            $device->longitude = number_format($device->longitude, 6);
            $device->elevation_m = $device->elevation_m ? number_format($device->elevation_m, 2) . ' m' : '-';

            $device->actions = [
                [
                    'label' => 'Edit',
                    'title' => 'Edit Device',
                    'url' => '#',
                    'onclick' => "window.dispatchEvent(new CustomEvent('open-edit-device', { detail: {$detailJson} }))",
                    'icon' => 'pen',
                    'color' => 'blue'
                ],
                [
                    'label' => 'Hapus',
                    'title' => 'Hapus Device',
                    'url' => route('admin.devices.destroy', $device->code),
                    'color' => 'red',
                    'method' => 'DELETE',
                    'icon' => 'trash',
                    'confirm' => 'Apakah Anda yakin ingin menghapus device ini?'
                ]
            ];

            return $device;
        });

        // Get river basins for form select options
        $riverBasins = MasRiverBasin::all()->map(function ($rb) {
            return [
                'value' => $rb->code,
                'label' => $rb->name
            ];
        });

        return view('admin.mas_devices.index', compact('devices', 'tableHeaders', 'riverBasins'));
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:mas_devices,code',
                'mas_river_basin_code' => 'required|string|max:100|exists:mas_river_basins,code',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
                'elevation_m' => 'nullable|numeric|min:0',
                'status' => 'required|in:active,inactive,maintenance'
            ]);

            $device = MasDevice::create($validated);

            return redirect()->route('admin.devices.index')
                ->with('success', "Device '{$device->name}' berhasil ditambahkan.");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput()
                ->with('error', 'Data yang diinput tidak valid. Silakan periksa kembali.');

        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error when creating device: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'error_code' => $e->getCode()
            ]);

            // Handle specific database constraint errors
            if ($e->getCode() == 23000) {
                if (strpos($e->getMessage(), 'mas_devices_code_unique') !== false) {
                    return redirect()->back()
                        ->withInput()
                        ->with('error', "Kode device '{$request->code}' sudah digunakan. Silakan gunakan kode yang berbeda.");
                }
            }

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan database saat menyimpan device. Silakan coba lagi.');

        } catch (\Exception $e) {
            Log::error('Unexpected error when creating device: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan tak terduga. Silakan coba lagi atau hubungi administrator.');
        }
    }

    public function update(Request $request, MasDevice $device)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:100|unique:mas_devices,code,' . $device->id,
                'mas_river_basin_code' => 'required|string|max:100|exists:mas_river_basins,code',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
                'elevation_m' => 'nullable|numeric|min:0',
                'status' => 'required|in:active,inactive,maintenance'
            ]);

            $oldName = $device->name;
            $device->update($validated);

            return redirect()->route('admin.devices.index')
                ->with('success', "Device '{$oldName}' berhasil diperbarui menjadi '{$device->name}'.");

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->route('admin.devices.index')
                ->with('error', 'Device yang akan diperbarui tidak ditemukan.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput()
                ->with('error', 'Data yang diinput tidak valid. Silakan periksa kembali.');

        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error when updating device: ' . $e->getMessage(), [
                'device_code' => $device->code,
                'request_data' => $request->all(),
                'error_code' => $e->getCode()
            ]);

            // Handle specific database constraint errors
            if ($e->getCode() == 23000) {
                if (strpos($e->getMessage(), 'mas_devices_code_unique') !== false) {
                    return redirect()->back()
                        ->withInput()
                        ->with('error', "Kode device '{$request->code}' sudah digunakan. Silakan gunakan kode yang berbeda.");
                }
            }

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan database saat memperbarui device. Silakan coba lagi.');

        } catch (\Exception $e) {
            Log::error('Unexpected error when updating device: ' . $e->getMessage(), [
                'device_code' => $device->code,
                'request_data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan tak terduga. Silakan coba lagi atau hubungi administrator.');
        }
    }

    public function destroy(MasDevice $device)
    {
        try {
            // Check if device has related sensors or data
            $sensorsCount = $device->sensors()->count();
            $dataCount = DB::table('data_actuals')
                        ->join('mas_sensors', 'data_actuals.mas_sensor_id', '=', 'mas_sensors.id')
                        ->where('mas_sensors.mas_device_code', $device->code)
                        ->count();

            if ($sensorsCount > 0 || $dataCount > 0) {
                $errorMsg = "Device '{$device->name}' tidak dapat dihapus karena masih memiliki:";
                $details = [];

                if ($sensorsCount > 0) {
                    $details[] = "{$sensorsCount} sensor yang terkait";
                }
                if ($dataCount > 0) {
                    $details[] = "{$dataCount} data aktual yang terkait";
                }

                $errorMsg .= " " . implode(" dan ", $details) . ".";
                $errorMsg .= " Hapus terlebih dahulu data terkait sebelum menghapus device ini.";

                return redirect()->route('admin.devices.index')
                    ->with('error', $errorMsg);
            }

            $deviceName = $device->name;
            $device->delete();

            return redirect()->route('admin.devices.index')
                ->with('success', "Device '{$deviceName}' berhasil dihapus.");

        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error when deleting device: ' . $e->getMessage(), [
                'device_code' => $device->code,
                'error_code' => $e->getCode(),
                'sql_state' => $e->errorInfo[0] ?? null
            ]);

            // Handle specific database constraint errors
            if ($e->getCode() == 23000 || strpos($e->getMessage(), 'foreign key constraint') !== false) {
                $errorMsg = "Device tidak dapat dihapus karena masih digunakan oleh data lain dalam sistem. ";
                $errorMsg .= "Pastikan untuk menghapus semua sensor dan data terkait terlebih dahulu.";

                return redirect()->route('admin.devices.index')
                    ->with('error', $errorMsg);
            }

            // Generic database error
            return redirect()->route('admin.devices.index')
                ->with('error', 'Terjadi kesalahan database saat menghapus device. Silakan coba lagi atau hubungi administrator.');

        } catch (\Exception $e) {
            Log::error('Unexpected error when deleting device: ' . $e->getMessage(), [
                'device_code' => $device->code,
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('admin.devices.index')
                ->with('error', 'Terjadi kesalahan tak terduga. Silakan coba lagi atau hubungi administrator.');
        }
    }
}
