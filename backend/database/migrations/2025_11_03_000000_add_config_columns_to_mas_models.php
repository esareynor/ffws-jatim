<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds architecture_config and training_config columns to mas_models table
     * These columns store JSON configuration for dynamic model architecture
     */
    public function up(): void
    {
        Schema::table('mas_models', function (Blueprint $table) {
            // Architecture configuration (JSON)
            // Stores: layer_sizes, dropout_rate, filters, kernel_size, dilations, etc.
            $table->text('architecture_config')->nullable()->after('n_steps_out');

            // Training configuration (JSON)
            // Stores: epochs, batch_size, test_size, optimizer, learning_rate, etc.
            $table->text('training_config')->nullable()->after('architecture_config');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mas_models', function (Blueprint $table) {
            $table->dropColumn(['architecture_config', 'training_config']);
        });
    }
};
