<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeviceMedia;
use App\Models\MasDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class DeviceMediaController extends Controller
{
    /**
     * Display a listing of device media
     */
    public function index(Request $request)
    {
        $query = DeviceMedia::with(['device', 'uploader']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%")
                  ->orWhere('mas_device_code', 'like', "%{$search}%");
            });
        }

        // Filter by media type
        if ($request->filled('media_type')) {
            $query->where('media_type', $request->media_type);
        }

        // Filter by device
        if ($request->filled('device_code')) {
            $query->where('mas_device_code', $request->device_code);
        }

        // Filter by visibility
        if ($request->filled('visibility')) {
            $query->where('is_public', $request->visibility === 'public');
        }

        $media = $query->latest()->paginate($request->get('per_page', 15));

        // Get devices for filter dropdown
        $devices = MasDevice::select('code', 'name')->get();

        // Stats
        $stats = [
            'total' => DeviceMedia::count(),
            'images' => DeviceMedia::where('media_type', 'image')->count(),
            'videos' => DeviceMedia::where('media_type', 'video')->count(),
            'documents' => DeviceMedia::where('media_type', 'document')->count(),
        ];

        return view('admin.device_media.index', compact('media', 'devices', 'stats'));
    }

    /**
     * Store a newly uploaded media
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mas_device_code' => 'required|string|exists:mas_devices,code',
            'media_type' => 'required|in:image,video,document,cctv_snapshot,thumbnail,other',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|max:51200', // 50MB max
            'is_primary' => 'boolean',
            'is_public' => 'boolean',
            'captured_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $file = $request->file('file');
        
        // Determine storage path based on media type
        $storagePath = 'device_media/' . $request->media_type . 's/' . date('Y/m');
        
        // Generate unique filename
        $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
        
        // Store file
        $filePath = $file->storeAs($storagePath, $fileName, 'public');
        
        // Calculate file hash
        $fileHash = hash_file('sha256', $file->getRealPath());

        // If this is set as primary, unset other primary media for this device
        if ($request->boolean('is_primary')) {
            DeviceMedia::where('mas_device_code', $request->mas_device_code)
                ->where('media_type', $request->media_type)
                ->update(['is_primary' => false]);
        }

        DeviceMedia::create([
            'mas_device_code' => $request->mas_device_code,
            'media_type' => $request->media_type,
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => $filePath,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'file_hash' => $fileHash,
            'disk' => 'public',
            'is_primary' => $request->boolean('is_primary', false),
            'is_public' => $request->boolean('is_public', true),
            'captured_at' => $request->captured_at,
            'uploaded_by' => auth()->id(),
        ]);

        return redirect()->route('admin.device-media.index')
            ->with('success', 'Media uploaded successfully');
    }

    /**
     * Update the specified media
     */
    public function update(Request $request, $id)
    {
        $media = DeviceMedia::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_primary' => 'boolean',
            'is_public' => 'boolean',
            'captured_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // If this is set as primary, unset other primary media for this device
        if ($request->boolean('is_primary') && !$media->is_primary) {
            DeviceMedia::where('mas_device_code', $media->mas_device_code)
                ->where('media_type', $media->media_type)
                ->where('id', '!=', $id)
                ->update(['is_primary' => false]);
        }

        $media->update([
            'title' => $request->title,
            'description' => $request->description,
            'is_primary' => $request->boolean('is_primary', false),
            'is_public' => $request->boolean('is_public', true),
            'captured_at' => $request->captured_at,
        ]);

        return redirect()->route('admin.device-media.index')
            ->with('success', 'Media updated successfully');
    }

    /**
     * Remove the specified media
     */
    public function destroy($id)
    {
        $media = DeviceMedia::findOrFail($id);

        // Delete file from storage
        $media->deleteFile();

        // Delete database record
        $media->delete();

        return redirect()->route('admin.device-media.index')
            ->with('success', 'Media deleted successfully');
    }

    /**
     * Download the media file
     */
    public function download($id)
    {
        $media = DeviceMedia::findOrFail($id);

        if (!$media->fileExists()) {
            return redirect()->back()->with('error', 'File not found');
        }

        return Storage::disk($media->disk)->download($media->file_path, $media->file_name);
    }

    /**
     * Set media as primary
     */
    public function setPrimary($id)
    {
        $media = DeviceMedia::findOrFail($id);

        // Unset other primary media for this device and type
        DeviceMedia::where('mas_device_code', $media->mas_device_code)
            ->where('media_type', $media->media_type)
            ->update(['is_primary' => false]);

        // Set this as primary
        $media->is_primary = true;
        $media->save();

        return response()->json([
            'success' => true,
            'message' => 'Media set as primary'
        ]);
    }

    /**
     * Get media by device
     */
    public function getByDevice($deviceCode)
    {
        $media = DeviceMedia::where('mas_device_code', $deviceCode)
            ->orderBy('is_primary', 'desc')
            ->orderBy('display_order')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $media
        ]);
    }
}

