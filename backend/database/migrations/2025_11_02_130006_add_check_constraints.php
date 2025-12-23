<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration adds CHECK constraints for data validation:
     * 1. mas_sensors: Validate threshold ordering (safe < warning < danger)
     * 2. calculated_discharges: Ensure discharge is non-negative
     * 3. predicted_calculated_discharges: Ensure predicted discharge is non-negative
     * 4. data_predictions: Ensure confidence score is between 0 and 1
     */
    public function up(): void
    {
        // Add CHECK constraint for mas_sensors threshold validation
        DB::statement("
            ALTER TABLE mas_sensors 
            ADD CONSTRAINT chk_sensors_thresholds 
            CHECK (
                threshold_safe IS NULL OR 
                threshold_warning IS NULL OR 
                threshold_danger IS NULL OR 
                (threshold_safe < threshold_warning AND threshold_warning < threshold_danger)
            )
        ");

        // Add CHECK constraint for calculated_discharges
        DB::statement("
            ALTER TABLE calculated_discharges 
            ADD CONSTRAINT chk_cd_discharge 
            CHECK (sensor_discharge >= 0)
        ");

        // Add CHECK constraint for predicted_calculated_discharges
        DB::statement("
            ALTER TABLE predicted_calculated_discharges 
            ADD CONSTRAINT chk_pcd_discharge 
            CHECK (predicted_discharge >= 0)
        ");

        // Add CHECK constraint for data_predictions confidence score
        DB::statement("
            ALTER TABLE data_predictions 
            ADD CONSTRAINT chk_dp_confidence 
            CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1))
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop CHECK constraints (MySQL syntax)
        // MySQL uses DROP CHECK instead of DROP CONSTRAINT for check constraints
        try {
            DB::statement("ALTER TABLE mas_sensors DROP CHECK chk_sensors_thresholds");
        } catch (\Exception $e) {
            // Constraint might not exist
        }

        try {
            DB::statement("ALTER TABLE calculated_discharges DROP CHECK chk_cd_discharge");
        } catch (\Exception $e) {
            // Constraint might not exist
        }

        try {
            DB::statement("ALTER TABLE predicted_calculated_discharges DROP CHECK chk_pcd_discharge");
        } catch (\Exception $e) {
            // Constraint might not exist
        }

        try {
            DB::statement("ALTER TABLE data_predictions DROP CHECK chk_dp_confidence");
        } catch (\Exception $e) {
            // Constraint might not exist
        }
    }
};

