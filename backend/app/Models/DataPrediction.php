<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DataPrediction extends Model
{
    use HasFactory;

    protected $fillable = [
        'mas_sensor_code',
        'mas_model_code',
        'prediction_run_at',
        'prediction_for_ts',
        'predicted_value',
        'confidence_score',
        'threshold_prediction_status',
    ];

    protected $casts = [
        'prediction_run_at' => 'datetime',
        'prediction_for_ts' => 'datetime',
        'predicted_value' => 'double',
        'confidence_score' => 'double',
    ];

    /**
     * Get the sensor that owns the prediction.
     */
    public function masSensor(): BelongsTo
    {
        return $this->belongsTo(MasSensor::class, 'mas_sensor_code', 'code');
    }

    /**
     * Get the model that owns the prediction.
     */
    public function masModel(): BelongsTo
    {
        return $this->belongsTo(MasModel::class, 'mas_model_code', 'code');
    }

    /**
     * Get predicted calculated discharges for this data prediction
     */
    public function predictedCalculatedDischarges(): HasMany
    {
        return $this->hasMany(PredictedCalculatedDischarge::class, 'data_prediction_id');
    }
}
