<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Rename remaining columns in calculated_discharges table (water_level sudah ada)
        try {
            DB::statement('ALTER TABLE calculated_discharges DROP CHECK chk_cd_discharge');
        } catch (\Exception $e) {
            // Constraint might not exist, ignore
        }

        Schema::table('calculated_discharges', function (Blueprint $table) {
            // Hanya rename sensor_discharge ke discharge (water_level sudah ada)
            $table->renameColumn('sensor_discharge', 'discharge');
        });

        DB::statement('ALTER TABLE calculated_discharges ADD CONSTRAINT chk_cd_discharge CHECK (discharge >= 0)');

        // Rename columns in predicted_calculated_discharges table
        try {
            DB::statement('ALTER TABLE predicted_calculated_discharges DROP CHECK chk_pcd_value');
        } catch (\Exception $e) {
            // Constraint might not exist, ignore
        }

        try {
            DB::statement('ALTER TABLE predicted_calculated_discharges DROP CHECK chk_pcd_discharge');
        } catch (\Exception $e) {
            // Constraint might not exist, ignore
        }

        Schema::table('predicted_calculated_discharges', function (Blueprint $table) {
            $table->renameColumn('predicted_value', 'water_level');
            $table->renameColumn('predicted_discharge', 'discharge');
            $table->renameColumn('calculated_at', 'predicted_at');
        });

        DB::statement('ALTER TABLE predicted_calculated_discharges ADD CONSTRAINT chk_pcd_value CHECK (water_level >= 0)');
        DB::statement('ALTER TABLE predicted_calculated_discharges ADD CONSTRAINT chk_pcd_discharge CHECK (discharge >= 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert columns in calculated_discharges table
        try {
            DB::statement('ALTER TABLE calculated_discharges DROP CHECK chk_cd_discharge');
        } catch (\Exception $e) {
            // Ignore
        }

        Schema::table('calculated_discharges', function (Blueprint $table) {
            $table->renameColumn('discharge', 'sensor_discharge');
        });

        DB::statement('ALTER TABLE calculated_discharges ADD CONSTRAINT chk_cd_discharge CHECK (sensor_discharge >= 0)');

        // Revert columns in predicted_calculated_discharges table
        try {
            DB::statement('ALTER TABLE predicted_calculated_discharges DROP CHECK chk_pcd_value');
        } catch (\Exception $e) {
            // Ignore
        }

        try {
            DB::statement('ALTER TABLE predicted_calculated_discharges DROP CHECK chk_pcd_discharge');
        } catch (\Exception $e) {
            // Ignore
        }

        Schema::table('predicted_calculated_discharges', function (Blueprint $table) {
            $table->renameColumn('water_level', 'predicted_value');
            $table->renameColumn('discharge', 'predicted_discharge');
            $table->renameColumn('predicted_at', 'calculated_at');
        });

        DB::statement('ALTER TABLE predicted_calculated_discharges ADD CONSTRAINT chk_pcd_value CHECK (predicted_value >= 0)');
        DB::statement('ALTER TABLE predicted_calculated_discharges ADD CONSTRAINT chk_pcd_discharge CHECK (predicted_discharge >= 0)');
    }
};
