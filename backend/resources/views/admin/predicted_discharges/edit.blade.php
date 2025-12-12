@extends('layouts.admin')

@section('title', 'Edit Predicted Discharge')
@section('page-title', 'Edit Predicted Discharge')
@section('page-description', 'Edit data prediksi debit')
@section('breadcrumb', 'Edit Predicted Discharge')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="card-dark shadow-sm rounded-lg">
        <div class="p-6">
            <form action="{{ route('admin.predicted-discharges.update', $prediction->id) }}" method="POST">
                @csrf
                @method('PUT')

                <!-- Sensor (Read-only) -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sensor
                    </label>
                    <div class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3">
                        <p class="text-gray-900 dark:text-white">
                            {{ $prediction->sensor->description }} ({{ $prediction->mas_sensor_code }})
                        </p>
                    </div>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Sensor tidak dapat diubah</p>
                </div>

                <!-- Rating Curve -->
                <div class="mb-6">
                    <label for="rating_curve_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rating Curve <span class="text-red-500">*</span>
                    </label>
                    <select
                        name="rating_curve_code"
                        id="rating_curve_code"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-purple-500"
                        required
                        onchange="updateRatingCurveInfo()"
                    >
                        <option value="">Pilih Rating Curve</option>
                        @foreach($ratingCurves as $rc)
                            <option
                                value="{{ $rc->code }}"
                                {{ old('rating_curve_code', $prediction->rating_curve_code) == $rc->code ? 'selected' : '' }}
                                data-formula="{{ $rc->formula_string }}"
                                data-a="{{ $rc->a }}"
                                data-b="{{ $rc->b }}"
                                data-c="{{ $rc->c }}"
                            >
                                {{ $rc->code }} ({{ $rc->effective_date->format('d/m/Y') }})
                            </option>
                        @endforeach
                    </select>
                    @error('rating_curve_code')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Water Level (Predicted) -->
                <div class="mb-6">
                    <label for="water_level" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tinggi Muka Air Prediksi (m) <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="water_level"
                        id="water_level"
                        step="0.01"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-purple-500"
                        value="{{ old('water_level', $prediction->water_level) }}"
                        placeholder="Contoh: 2.50"
                        required
                        onchange="calculateDischarge()"
                    >
                    @error('water_level')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Discharge (Auto-calculated) -->
                <div class="mb-6">
                    <label for="discharge" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Debit Prediksi (m³/s) <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="discharge"
                        id="discharge"
                        step="0.01"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-purple-500"
                        value="{{ old('discharge', $prediction->discharge) }}"
                        placeholder="Akan otomatis terhitung"
                        required
                        readonly
                    >
                    @error('discharge')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Debit akan otomatis terhitung berdasarkan rating curve</p>
                </div>

                <!-- Prediction Time -->
                <div class="mb-6">
                    <label for="predicted_at" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Waktu Prediksi <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        name="predicted_at"
                        id="predicted_at"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-purple-500"
                        value="{{ old('predicted_at', $prediction->predicted_at->format('Y-m-d\TH:i')) }}"
                        required
                    >
                    @error('predicted_at')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Rating Curve Info Display -->
                <div id="rating-curve-info" class="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <h4 class="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>Rating Curve Formula
                    </h4>
                    <p id="formula-display" class="text-sm font-mono text-purple-700 dark:text-purple-400"></p>
                    <div class="grid grid-cols-3 gap-2 mt-2 text-xs">
                        <div>
                            <span class="text-gray-600 dark:text-gray-400">A:</span>
                            <span id="param-a" class="font-semibold text-gray-900 dark:text-white ml-1">-</span>
                        </div>
                        <div>
                            <span class="text-gray-600 dark:text-gray-400">B:</span>
                            <span id="param-b" class="font-semibold text-gray-900 dark:text-white ml-1">-</span>
                        </div>
                        <div>
                            <span class="text-gray-600 dark:text-gray-400">C:</span>
                            <span id="param-c" class="font-semibold text-gray-900 dark:text-white ml-1">-</span>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                        href="{{ route('admin.predicted-discharges.show', $prediction->id) }}"
                        class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                        <i class="fas fa-times mr-2"></i>Batal
                    </a>
                    <button
                        type="submit"
                        class="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <i class="fas fa-save mr-2"></i>Update
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
let ratingCurveData = null;

// Update rating curve info display
function updateRatingCurveInfo() {
    const select = document.getElementById('rating_curve_code');
    const selectedOption = select.options[select.selectedIndex];

    if (selectedOption.value && selectedOption.dataset.formula) {
        ratingCurveData = {
            a: parseFloat(selectedOption.dataset.a),
            b: parseFloat(selectedOption.dataset.b),
            c: parseFloat(selectedOption.dataset.c)
        };

        document.getElementById('formula-display').textContent = selectedOption.dataset.formula;
        document.getElementById('param-a').textContent = parseFloat(selectedOption.dataset.a).toFixed(4);
        document.getElementById('param-b').textContent = parseFloat(selectedOption.dataset.b).toFixed(4);
        document.getElementById('param-c').textContent = parseFloat(selectedOption.dataset.c).toFixed(4);

        calculateDischarge();
    }
}

// Calculate discharge based on water level and rating curve
function calculateDischarge() {
    const waterLevel = parseFloat(document.getElementById('water_level').value);

    if (ratingCurveData && !isNaN(waterLevel)) {
        const { a, b, c } = ratingCurveData;
        // Formula: Q = a * (H - c)^b
        const discharge = a * Math.pow(waterLevel - c, b);
        document.getElementById('discharge').value = discharge.toFixed(2);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateRatingCurveInfo();
});
</script>
@endsection
