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
        Schema::create('device_media', function (Blueprint $table) {
            $table->id();
            $table->string('mas_device_code', 100);
            $table->enum('media_type', ['image', 'video', 'document', 'cctv_snapshot', 'thumbnail', 'other'])->default('image');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('file_path', 512);
            $table->string('file_name');
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('mime_type', 128)->nullable();
            $table->char('file_hash', 64)->nullable();
            $table->string('disk', 50)->default('public');
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_public')->default(true);
            $table->integer('display_order')->default(0);
            $table->dateTime('captured_at')->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->json('tags')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('mas_device_code', 'idx_dm_device_code');
            $table->index('media_type', 'idx_dm_media_type');
            $table->index('is_primary', 'idx_dm_is_primary');
            $table->index('captured_at', 'idx_dm_captured_at');
            $table->index('display_order', 'idx_dm_display_order');
            $table->index('uploaded_by', 'idx_dm_uploaded_by');

            // Foreign keys
            $table->foreign('mas_device_code', 'fk_dm_device_code')
                ->references('code')
                ->on('mas_devices')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('uploaded_by', 'fk_dm_uploaded_by')
                ->references('id')
                ->on('users')
                ->onDelete('set null')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_media');
    }
};

