<?php

namespace App\Http\Controllers\Api\Admin;

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
     * Display a listing of media for a device.
     */
    public function index(Request $request, $deviceCode)
    {
        try {
            $device = MasDevice::where('code', $deviceCode)->first();
            
            if (!$device) {
                return $this->notFoundResponse('Device tidak ditemukan');
            }

            $query = DeviceMedia::where('mas_device_code', $deviceCode);

            // Filter by media type
            if ($request->has('media_type')) {
                $query->where('media_type', $request->media_type);
            }

            // Filter by public/private
            if ($request->has('is_public')) {
                $query->where('is_public', $request->boolean('is_public'));
            }

            // Search by title
            if ($request->has('search')) {
                $query->where('title', 'like', '%' . $request->search . '%');
            }

            // Filter by tag
            if ($request->has('tag')) {
                $query->withTag($request->tag);
            }

            $media = $query->ordered()
                ->with('uploader:id,name,email')
                ->paginate($request->get('per_page', 15));

            // Add URLs to each media item
            $media->getCollection()->transform(function ($item) {
                $item->url = $item->url;
                $item->file_size_human = $item->file_size_human;
                return $item;
            });

            return $this->successResponse($media, 'Media retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil media: ' . $e->getMessage());
        }
    }

    /**
     * Store a newly uploaded media file.
     */
    public function store(Request $request, $deviceCode)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:51200', // Max 50MB
            'media_type' => 'required|in:image,video,document,cctv_snapshot,thumbnail,other',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_primary' => 'nullable|boolean',
            'is_public' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
            'captured_at' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $device = MasDevice::where('code', $deviceCode)->first();
            
            if (!$device) {
                return $this->notFoundResponse('Device tidak ditemukan');
            }

            $file = $request->file('file');
            $mediaType = $request->input('media_type');
            
            // Generate file name
            $fileName = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) 
                        . '_' . time() 
                        . '.' . $file->getClientOriginalExtension();
            
            // Store file
            $filePath = $file->storeAs(
                "devices/{$deviceCode}/{$mediaType}s",
                $fileName,
                'public'
            );

            // Calculate file hash
            $fileHash = hash_file('sha256', $file->getRealPath());

            // Create media record
            $media = DeviceMedia::create([
                'mas_device_code' => $deviceCode,
                'media_type' => $mediaType,
                'title' => $request->input('title', $file->getClientOriginalName()),
                'description' => $request->input('description'),
                'file_path' => $filePath,
                'file_name' => $fileName,
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'file_hash' => $fileHash,
                'disk' => 'public',
                'is_primary' => $request->boolean('is_primary', false),
                'is_public' => $request->boolean('is_public', true),
                'display_order' => $request->input('display_order', 0),
                'captured_at' => $request->input('captured_at', now()),
                'uploaded_by' => auth()->id(),
                'tags' => $request->input('tags', []),
                'metadata' => [
                    'original_name' => $file->getClientOriginalName(),
                    'uploaded_at' => now()->toISOString(),
                ],
            ]);

            // Update device gallery count
            $device->increment('gallery_count');

            // If this is set as primary, unset other primary media
            if ($media->is_primary) {
                DeviceMedia::where('mas_device_code', $deviceCode)
                    ->where('id', '!=', $media->id)
                    ->update(['is_primary' => false]);
            }

            $media->url = $media->url;
            $media->file_size_human = $media->file_size_human;

            return $this->successResponse($media, 'Media uploaded successfully', 201);
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengupload media: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified media.
     */
    public function show($deviceCode, $id)
    {
        try {
            $media = DeviceMedia::where('mas_device_code', $deviceCode)
                ->where('id', $id)
                ->with(['device', 'uploader:id,name,email'])
                ->first();

            if (!$media) {
                return $this->notFoundResponse('Media tidak ditemukan');
            }

            $media->url = $media->url;
            $media->file_size_human = $media->file_size_human;
            $media->exists = $media->exists();

            return $this->successResponse($media, 'Media retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil media: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified media.
     */
    public function update(Request $request, $deviceCode, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_primary' => 'nullable|boolean',
            'is_public' => 'nullable|boolean',
            'display_order' => 'nullable|integer',
            'captured_at' => 'nullable|date',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator->errors());
        }

        try {
            $media = DeviceMedia::where('mas_device_code', $deviceCode)
                ->where('id', $id)
                ->first();

            if (!$media) {
                return $this->notFoundResponse('Media tidak ditemukan');
            }

            $media->update($request->only([
                'title',
                'description',
                'is_primary',
                'is_public',
                'display_order',
                'captured_at',
                'tags',
            ]));

            // If this is set as primary, unset other primary media
            if ($request->has('is_primary') && $request->boolean('is_primary')) {
                DeviceMedia::where('mas_device_code', $deviceCode)
                    ->where('id', '!=', $media->id)
                    ->update(['is_primary' => false]);
            }

            $media->url = $media->url;
            $media->file_size_human = $media->file_size_human;

            return $this->successResponse($media, 'Media updated successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengupdate media: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified media.
     */
    public function destroy($deviceCode, $id)
    {
        try {
            $media = DeviceMedia::where('mas_device_code', $deviceCode)
                ->where('id', $id)
                ->first();

            if (!$media) {
                return $this->notFoundResponse('Media tidak ditemukan');
            }

            $media->delete(); // File will be deleted automatically via model boot method

            // Update device gallery count
            $device = MasDevice::where('code', $deviceCode)->first();
            if ($device && $device->gallery_count > 0) {
                $device->decrement('gallery_count');
            }

            return $this->successResponse(null, 'Media deleted successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal menghapus media: ' . $e->getMessage());
        }
    }

    /**
     * Download the specified media file.
     */
    public function download($deviceCode, $id)
    {
        try {
            $media = DeviceMedia::where('mas_device_code', $deviceCode)
                ->where('id', $id)
                ->first();

            if (!$media) {
                return $this->notFoundResponse('Media tidak ditemukan');
            }

            if (!$media->exists()) {
                return $this->notFoundResponse('File tidak ditemukan di storage');
            }

            return Storage::disk($media->disk)->download($media->file_path, $media->file_name);
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mendownload media: ' . $e->getMessage());
        }
    }

    /**
     * Get gallery for a device (images only).
     */
    public function gallery($deviceCode)
    {
        try {
            $device = MasDevice::where('code', $deviceCode)->first();
            
            if (!$device) {
                return $this->notFoundResponse('Device tidak ditemukan');
            }

            $images = DeviceMedia::where('mas_device_code', $deviceCode)
                ->whereIn('media_type', ['image', 'thumbnail', 'cctv_snapshot'])
                ->where('is_public', true)
                ->ordered()
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'url' => $item->url,
                        'thumbnail_url' => $item->url, // Could be optimized with actual thumbnails
                        'captured_at' => $item->captured_at,
                        'is_primary' => $item->is_primary,
                    ];
                });

            return $this->successResponse([
                'device_code' => $deviceCode,
                'device_name' => $device->name,
                'total_images' => $images->count(),
                'images' => $images,
            ], 'Gallery retrieved successfully');
        } catch (\Exception $e) {
            return $this->serverErrorResponse('Gagal mengambil gallery: ' . $e->getMessage());
        }
    }

    /**
     * Helper method for success response.
     */
    private function successResponse($data, $message = 'Success', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Helper method for validation error response.
     */
    private function validationErrorResponse($errors)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $errors,
        ], 422);
    }

    /**
     * Helper method for not found response.
     */
    private function notFoundResponse($message = 'Resource not found')
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 404);
    }

    /**
     * Helper method for server error response.
     */
    private function serverErrorResponse($message = 'Internal server error')
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 500);
    }
}

