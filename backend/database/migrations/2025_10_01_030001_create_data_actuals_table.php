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
        Schema::create('data_actuals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mas_sensor_id')->constrained('mas_sensors')->onUpdate('restrict')->onDelete('restrict');
            $table->string('mas_sensor_code');
            $table->double('value');
            $table->dateTime('received_at');
            $table->enum('threshold_status', ['safe', 'warning', 'danger'])->nullable();
            $table->timestamps();

            // Indexes
            $table->index('received_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_actuals');
    }
};
