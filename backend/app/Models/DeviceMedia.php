<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class DeviceMedia extends Model
{
    use HasFactory;

    protected $table = 'device_media';

    protected $fillable = [
        'mas_device_code',
        'media_type',
        'title',
        'description',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'file_hash',
        'disk',
        'is_primary',
        'is_public',
        'display_order',
        'captured_at',
        'uploaded_by',
        'tags',
        'metadata',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_public' => 'boolean',
        'display_order' => 'integer',
        'file_size' => 'integer',
        'captured_at' => 'datetime',
        'tags' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the device associated with this media
     */
    public function device()
    {
        return $this->belongsTo(MasDevice::class, 'mas_device_code', 'code');
    }

    /**
     * Get the user who uploaded this media
     */
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Scope for images only
     */
    public function scopeImages($query)
    {
        return $query->where('media_type', 'image');
    }

    /**
     * Scope for videos only
     */
    public function scopeVideos($query)
    {
        return $query->where('media_type', 'video');
    }

    /**
     * Scope for documents only
     */
    public function scopeDocuments($query)
    {
        return $query->where('media_type', 'document');
    }

    /**
     * Scope for primary media
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope for public media
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Get media type label
     */
    public function getMediaTypeLabelAttribute()
    {
        return match($this->media_type) {
            'image' => 'Image',
            'video' => 'Video',
            'document' => 'Document',
            'cctv_snapshot' => 'CCTV Snapshot',
            'thumbnail' => 'Thumbnail',
            'other' => 'Other',
            default => ucfirst($this->media_type),
        };
    }

    /**
     * Get media type icon
     */
    public function getMediaTypeIconAttribute()
    {
        return match($this->media_type) {
            'image' => 'fa-image',
            'video' => 'fa-video',
            'document' => 'fa-file-alt',
            'cctv_snapshot' => 'fa-camera',
            'thumbnail' => 'fa-image',
            'other' => 'fa-file',
            default => 'fa-file',
        };
    }

    /**
     * Get file size in human readable format
     */
    public function getFileSizeHumanAttribute()
    {
        if (!$this->file_size) {
            return 'N/A';
        }

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;

        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get full URL to the media file
     */
    public function getUrlAttribute()
    {
        if ($this->disk === 'public') {
            return Storage::disk('public')->url($this->file_path);
        }

        return Storage::disk($this->disk)->url($this->file_path);
    }

    /**
     * Check if file exists
     */
    public function fileExists()
    {
        return Storage::disk($this->disk)->exists($this->file_path);
    }

    /**
     * Delete the file from storage
     */
    public function deleteFile()
    {
        if ($this->fileExists()) {
            return Storage::disk($this->disk)->delete($this->file_path);
        }

        return false;
    }

    /**
     * Check if media is an image
     */
    public function isImage()
    {
        return $this->media_type === 'image' || 
               $this->media_type === 'cctv_snapshot' || 
               $this->media_type === 'thumbnail';
    }

    /**
     * Check if media is a video
     */
    public function isVideo()
    {
        return $this->media_type === 'video';
    }

    /**
     * Get thumbnail URL (for videos, use first frame; for images, use the image itself)
     */
    public function getThumbnailUrlAttribute()
    {
        if ($this->isImage()) {
            return $this->url;
        }

        // For videos, you might want to generate thumbnails
        // For now, return a placeholder
        return asset('images/video-placeholder.png');
    }
}
