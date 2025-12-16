<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('geojson_files', function (Blueprint $table) {
            $table->id();
            $table->string('original_name');        // nama file asli, misal contour0.5.geojson
            $table->string('stored_path');         // path di storage, misal uploads/abc123.geojson
            $table->string('disk')->default('local'); // disk Laravel (local/s3/dll)
            $table->unsignedBigInteger('size')->nullable(); // bytes
            $table->string('mime_type', 128)->nullable();   // application/json atau application/geo+json
            $table->string('sha256', 64)->nullable();       // untuk deduplikasi opsional
            $table->string('label')->nullable();            // label opsional, misal “sungai”, “batas kecamatan”
            $table->timestamps();

            $table->index(['label']);
            $table->index(['sha256']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('geojson_files');
    }
};
