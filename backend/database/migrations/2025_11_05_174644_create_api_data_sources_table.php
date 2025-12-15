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
        Schema::create('api_data_sources', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->unique();
            $table->string('api_url');
            $table->string('api_method')->default('GET');
            $table->json('api_headers')->nullable();
            $table->json('api_params')->nullable();
            $table->json('api_body')->nullable();
            $table->string('auth_type')->nullable(); // bearer, basic, api_key, none
            $table->text('auth_credentials')->nullable(); // encrypted
            $table->string('response_format')->default('json'); // json, xml
            $table->json('data_mapping'); // mapping field API ke field sistem
            $table->integer('fetch_interval_minutes')->default(15);
            $table->timestamp('last_fetch_at')->nullable();
            $table->timestamp('last_success_at')->nullable();
            $table->text('last_error')->nullable();
            $table->integer('consecutive_failures')->default(0);
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Tabel untuk log fetch data
        Schema::create('api_data_fetch_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('api_data_source_id')->constrained()->onDelete('cascade');
            $table->timestamp('fetched_at');
            $table->string('status'); // success, failed, partial
            $table->integer('records_fetched')->default(0);
            $table->integer('records_saved')->default(0);
            $table->integer('records_failed')->default(0);
            $table->text('error_message')->nullable();
            $table->json('response_summary')->nullable();
            $table->integer('duration_ms')->nullable();
            $table->timestamps();
        });

        // Tabel untuk mapping sensor ke API source
        Schema::create('sensor_api_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('api_data_source_id')->constrained()->onDelete('cascade');
            $table->string('mas_sensor_code');
            $table->string('mas_device_code');
            $table->string('external_sensor_id')->nullable(); // ID sensor di API eksternal
            $table->json('field_mapping')->nullable(); // mapping spesifik untuk sensor ini
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('mas_sensor_code')->references('code')->on('mas_sensors')->onDelete('cascade');
            $table->foreign('mas_device_code')->references('code')->on('mas_devices')->onDelete('cascade');
            $table->unique(['api_data_source_id', 'mas_sensor_code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_api_mappings');
        Schema::dropIfExists('api_data_fetch_logs');
        Schema::dropIfExists('api_data_sources');
    }
};
