<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GeojsonFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Response;

class GeojsonFileController extends Controller
{
    /**
     * Return a simple list of uploaded geojson files.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $files = GeojsonFile::select('id', 'original_name', 'label', 'created_at')
                ->orderByDesc('id')
                ->get();

            return response()->json($files);
        } catch (\Exception $e) {
            Log::error('Error fetching geojson files list: '.$e->getMessage(), [
                'exception' => $e
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan saat mengambil daftar file'
            ], 500);
        }
    }

    /**
     * Return the raw content of a stored GeoJSON file.
     * The response will contain the file body and the correct Content-Type header
     * so API clients receive the actual GeoJSON payload as uploaded via admin panel.
     *
     * @param  int|string $id
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function content($id)
    {
        try {
            $row = GeojsonFile::findOrFail($id);

            if (!Storage::disk($row->disk)->exists($row->stored_path)) {
                return response()->json(['error' => 'File tidak ditemukan'], 404);
            }

            $raw = Storage::disk($row->disk)->get($row->stored_path);

            // Prefer stored mime type, but fall back to a GeoJSON-friendly type
            $mime = $row->mime_type ?: 'application/geo+json';

            // If mime looks like plain json, normalize to application/json
            if (str_contains($mime, 'json')) {
                $mime = 'application/json';
            }

            return response($raw, 200)
                ->header('Content-Type', $mime)
                ->header('Cache-Control', 'public, max-age=60');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Geojson file not found: '.$e->getMessage(), ['id' => $id]);
            
            return response()->json([
                'error' => 'File tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error retrieving geojson file content: '.$e->getMessage(), [
                'id' => $id,
                'exception' => $e
            ]);

            return response()->json([
                'error' => 'Terjadi kesalahan saat mengambil konten file'
            ], 500);
        }
    }
}
