<?php

namespace App\Observers;

use App\Models\DataPrediction;
use App\Services\DischargeCalculationService;
use Illuminate\Support\Facades\Log;

class DataPredictionObserver
{
    protected $calculationService;

    public function __construct(DischargeCalculationService $calculationService)
    {
        $this->calculationService = $calculationService;
    }

    /**
     * Handle the DataPrediction "created" event.
     * Automatically calculate predicted discharge when new data prediction is created
     */
    public function created(DataPrediction $dataPrediction)
    {
        try {
            // Only calculate if the prediction has water level data
            if ($dataPrediction->predicted_value !== null && $dataPrediction->mas_sensor_code) {
                Log::info("DataPredictionObserver: Triggering predicted discharge calculation for data_prediction ID: {$dataPrediction->id}, sensor: {$dataPrediction->mas_sensor_code}");

                // Process predicted discharge calculation
                $predictedCalculatedDischarge = $this->calculationService->processDataPrediction($dataPrediction);

                if ($predictedCalculatedDischarge) {
                    Log::info("DataPredictionObserver: Predicted discharge calculated successfully. Discharge value: {$predictedCalculatedDischarge->predicted_discharge}");
                } else {
                    Log::warning("DataPredictionObserver: No active rating curve found for sensor {$dataPrediction->mas_sensor_code}");
                }
            }
        } catch (\Exception $e) {
            // Log error but don't throw exception to prevent data_prediction creation from failing
            Log::error("DataPredictionObserver: Error calculating predicted discharge for data_prediction ID {$dataPrediction->id}: " . $e->getMessage());
        }
    }

    /**
     * Handle the DataPrediction "updated" event.
     * Recalculate predicted discharge if predicted water level value is changed
     */
    public function updated(DataPrediction $dataPrediction)
    {
        try {
            // Check if predicted water level value was changed
            if ($dataPrediction->isDirty('predicted_value') && $dataPrediction->predicted_value !== null) {
                Log::info("DataPredictionObserver: Predicted water level changed for data_prediction ID: {$dataPrediction->id}. Recalculating predicted discharge...");

                // Delete old predicted calculated discharge if exists
                $dataPrediction->predictedCalculatedDischarges()->delete();

                // Recalculate
                $predictedCalculatedDischarge = $this->calculationService->processDataPrediction($dataPrediction);

                if ($predictedCalculatedDischarge) {
                    Log::info("DataPredictionObserver: Predicted discharge recalculated successfully. New discharge value: {$predictedCalculatedDischarge->predicted_discharge}");
                }
            }
        } catch (\Exception $e) {
            Log::error("DataPredictionObserver: Error recalculating predicted discharge for data_prediction ID {$dataPrediction->id}: " . $e->getMessage());
        }
    }

    /**
     * Handle the DataPrediction "deleted" event.
     * Clean up associated predicted calculated discharges
     */
    public function deleted(DataPrediction $dataPrediction)
    {
        try {
            // Delete associated predicted calculated discharges
            $deleted = $dataPrediction->predictedCalculatedDischarges()->delete();

            if ($deleted > 0) {
                Log::info("DataPredictionObserver: Deleted {$deleted} predicted calculated discharge(s) for data_prediction ID: {$dataPrediction->id}");
            }
        } catch (\Exception $e) {
            Log::error("DataPredictionObserver: Error deleting predicted calculated discharges for data_prediction ID {$dataPrediction->id}: " . $e->getMessage());
        }
    }
}
