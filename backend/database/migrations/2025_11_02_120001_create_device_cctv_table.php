<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('device_cctv', function (Blueprint $table) {
            $table->id();
            $table->string('mas_device_code', 100)->unique();
            $table->string('cctv_url', 1024);
            $table->enum('stream_type', ['rtsp', 'hls', 'mjpeg', 'webrtc', 'youtube', 'other'])->default('rtsp');
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->enum('status', ['online', 'offline', 'error', 'unknown'])->default('unknown');
            $table->dateTime('last_check')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('status', 'idx_dc_status');
            $table->index('is_active', 'idx_dc_active');

            // Foreign key
            $table->foreign('mas_device_code', 'fk_dc_device_code')
                ->references('code')
                ->on('mas_devices')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_cctv');
    }
};

