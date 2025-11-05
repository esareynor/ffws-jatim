<?php

namespace App\Observers;

use App\Models\DataActual;
use App\Services\DischargeCalculationService;
use Illuminate\Support\Facades\Log;

class DataActualObserver
{
    protected $calculationService;

    public function __construct(DischargeCalculationService $calculationService)
    {
        $this->calculationService = $calculationService;
    }

    /**
     * Handle the DataActual "created" event.
     * Automatically calculate discharge when new data actual is created
     */
    public function created(DataActual $dataActual)
    {
        try {
            // Only calculate if the sensor has water level data
            if ($dataActual->value !== null && $dataActual->mas_sensor_code) {
                Log::info("DataActualObserver: Triggering discharge calculation for data_actual ID: {$dataActual->id}, sensor: {$dataActual->mas_sensor_code}");

                // Process discharge calculation in background
                // If you have queue setup, you can dispatch a job here instead
                $calculatedDischarge = $this->calculationService->processDataActual($dataActual);

                if ($calculatedDischarge) {
                    Log::info("DataActualObserver: Discharge calculated successfully. Discharge value: {$calculatedDischarge->sensor_discharge}");
                } else {
                    Log::warning("DataActualObserver: No active rating curve found for sensor {$dataActual->mas_sensor_code}");
                }
            }
        } catch (\Exception $e) {
            // Log error but don't throw exception to prevent data_actual creation from failing
            Log::error("DataActualObserver: Error calculating discharge for data_actual ID {$dataActual->id}: " . $e->getMessage());
        }
    }

    /**
     * Handle the DataActual "updated" event.
     * Recalculate discharge if water level value is changed
     */
    public function updated(DataActual $dataActual)
    {
        try {
            // Check if water level value was changed
            if ($dataActual->isDirty('value') && $dataActual->value !== null) {
                Log::info("DataActualObserver: Water level changed for data_actual ID: {$dataActual->id}. Recalculating discharge...");

                // Delete old calculated discharge if exists
                $dataActual->calculatedDischarges()->delete();

                // Recalculate
                $calculatedDischarge = $this->calculationService->processDataActual($dataActual);

                if ($calculatedDischarge) {
                    Log::info("DataActualObserver: Discharge recalculated successfully. New discharge value: {$calculatedDischarge->sensor_discharge}");
                }
            }
        } catch (\Exception $e) {
            Log::error("DataActualObserver: Error recalculating discharge for data_actual ID {$dataActual->id}: " . $e->getMessage());
        }
    }

    /**
     * Handle the DataActual "deleted" event.
     * Clean up associated calculated discharges
     */
    public function deleted(DataActual $dataActual)
    {
        try {
            // Delete associated calculated discharges
            $deleted = $dataActual->calculatedDischarges()->delete();

            if ($deleted > 0) {
                Log::info("DataActualObserver: Deleted {$deleted} calculated discharge(s) for data_actual ID: {$dataActual->id}");
            }
        } catch (\Exception $e) {
            Log::error("DataActualObserver: Error deleting calculated discharges for data_actual ID {$dataActual->id}: " . $e->getMessage());
        }
    }
}
