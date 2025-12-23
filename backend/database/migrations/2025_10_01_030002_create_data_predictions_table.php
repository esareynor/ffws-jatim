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
        Schema::create('data_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mas_sensor_id')->constrained('mas_sensors')->onUpdate('restrict')->onDelete('restrict');
            $table->string('mas_sensor_code');
            $table->foreignId('mas_model_id')->constrained('mas_models')->onUpdate('restrict')->onDelete('restrict');
            $table->dateTime('prediction_run_at');
            $table->dateTime('prediction_for_ts');
            $table->double('predicted_value');
            $table->double('confidence_score')->nullable();
            $table->enum('threshold_prediction_status', ['safe', 'warning', 'danger'])->nullable();
            $table->timestamps();

            // Indexes
            $table->index('prediction_run_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_predictions');
    }
};
