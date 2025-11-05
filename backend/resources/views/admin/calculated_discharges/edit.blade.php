@extends('layouts.admin')

@section('title', 'Edit Calculated Discharge')
@section('page-title', 'Edit Calculated Discharge')
@section('page-description', 'Edit data debit terhitung')
@section('breadcrumb', 'Edit Calculated Discharge')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="card-dark shadow-sm rounded-lg">
        <div class="p-6">
            <form action="{{ route('admin.calculated-discharges.update', $discharge->id) }}" method="POST">
                @csrf
                @method('PUT')

                <!-- Sensor (Read-only) -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sensor
                    </label>
                    <div class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3">
                        <p class="text-gray-900 dark:text-white">
                            {{ $discharge->sensor->description }} ({{ $discharge->mas_sensor_code }})
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
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                        required
                        onchange="updateRatingCurveInfo()"
                    >
                        <option value="">Pilih Rating Curve</option>
                        @foreach($ratingCurves as $rc)
                            <option
                                value="{{ $rc->code }}"
                                {{ old('rating_curve_code', $discharge->rating_curve_code) == $rc->code ? 'selected' : '' }}
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

                <!-- Water Level -->
                <div class="mb-6">
                    <label for="water_level" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tinggi Muka Air (m) <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="water_level"
                        id="water_level"
                        step="0.01"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                        value="{{ old('water_level', $discharge->water_level) }}"
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
                        Debit (m³/s) <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="discharge"
                        id="discharge"
                        step="0.01"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                        value="{{ old('discharge', $discharge->discharge) }}"
                        placeholder="Akan otomatis terhitung"
                        required
                        readonly
                    >
                    @error('discharge')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Debit akan otomatis terhitung berdasarkan rating curve</p>
                </div>

                <!-- Calculation Time -->
                <div class="mb-6">
                    <label for="calculated_at" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Waktu Pengukuran <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        name="calculated_at"
                        id="calculated_at"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                        value="{{ old('calculated_at', $discharge->calculated_at->format('Y-m-d\TH:i')) }}"
                        required
                    >
                    @error('calculated_at')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Rating Curve Info Display -->
                <div id="rating-curve-info" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>Rating Curve Formula
                    </h4>
                    <p id="formula-display" class="text-sm font-mono text-blue-700 dark:text-blue-400"></p>
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
                        href="{{ route('admin.calculated-discharges.show', $discharge->id) }}"
                        class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                        <i class="fas fa-times mr-2"></i>Batal
                    </a>
                    <button
                        type="submit"
                        class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
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
