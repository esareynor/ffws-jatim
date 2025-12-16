@extends('layouts.admin')

@section('title', 'Tambah Predicted Discharge')
@section('page-title', 'Tambah Predicted Discharge')
@section('page-description', 'Tambah data prediksi debit manual')
@section('breadcrumb', 'Tambah Predicted Discharge')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="card-dark shadow-sm rounded-lg">
        <div class="p-6">
            <form action="{{ route('admin.predicted-discharges.store') }}" method="POST">
                @csrf

                <!-- Sensor Selection -->
                <div class="mb-6">
                    <label for="mas_sensor_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sensor <span class="text-red-500">*</span>
                    </label>
                    <select
                        name="mas_sensor_code"
                        id="mas_sensor_code"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-purple-500"
                        required
                        onchange="loadRatingCurve(this.value)"
                    >
                        <option value="">Pilih Sensor</option>
                        @foreach($sensors as $sensor)
                            <option value="{{ $sensor->code }}" {{ old('mas_sensor_code') == $sensor->code ? 'selected' : '' }}>
                                {{ $sensor->description }} ({{ $sensor->code }})
                            </option>
                        @endforeach
                    </select>
                    @error('mas_sensor_code')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Rating Curve (Auto-selected) -->
                <div class="mb-6">
                    <label for="rating_curve_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rating Curve <span class="text-red-500">*</span>
                    </label>
                    <select
                        name="rating_curve_code"
                        id="rating_curve_code"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-purple-500 focus:ring-purple-500"
                        required
                    >
                        <option value="">Pilih sensor terlebih dahulu</option>
                    </select>
                    @error('rating_curve_code')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Rating curve akan otomatis terisi berdasarkan sensor yang dipilih</p>
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
                        value="{{ old('water_level') }}"
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
                        value="{{ old('discharge') }}"
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
                        value="{{ old('predicted_at', now()->addHours(1)->format('Y-m-d\TH:i')) }}"
                        required
                    >
                    @error('predicted_at')
                        <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Biasanya waktu prediksi di masa depan</p>
                </div>

                <!-- Rating Curve Info Display -->
                <div id="rating-curve-info" class="hidden mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
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
                        href="{{ route('admin.predicted-discharges.index') }}"
                        class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                        <i class="fas fa-times mr-2"></i>Batal
                    </a>
                    <button
                        type="submit"
                        class="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <i class="fas fa-save mr-2"></i>Simpan
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
let ratingCurveData = null;

// Load rating curves for selected sensor
async function loadRatingCurve(sensorCode) {
    if (!sensorCode) {
        document.getElementById('rating_curve_code').innerHTML = '<option value="">Pilih sensor terlebih dahulu</option>';
        document.getElementById('rating-curve-info').classList.add('hidden');
        return;
    }

    try {
        const response = await fetch(`/admin/rating-curves/by-sensor/${sensorCode}`);
        const data = await response.json();

        const select = document.getElementById('rating_curve_code');
        select.innerHTML = '<option value="">Pilih Rating Curve</option>';

        if (data.length > 0) {
            data.forEach(rc => {
                const option = document.createElement('option');
                option.value = rc.code;
                option.textContent = `${rc.code} (${rc.effective_date})`;
                option.dataset.formula = rc.formula_string;
                option.dataset.a = rc.a;
                option.dataset.b = rc.b;
                option.dataset.c = rc.c;
                select.appendChild(option);
            });

            // Auto-select first (most recent) rating curve
            select.selectedIndex = 1;
            updateRatingCurveInfo();
        } else {
            select.innerHTML = '<option value="">Tidak ada rating curve untuk sensor ini</option>';
        }
    } catch (error) {
        console.error('Error loading rating curves:', error);
    }
}

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
        document.getElementById('rating-curve-info').classList.remove('hidden');

        calculateDischarge();
    } else {
        document.getElementById('rating-curve-info').classList.add('hidden');
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

// Event listeners
document.getElementById('rating_curve_code').addEventListener('change', updateRatingCurveInfo);
</script>
@endsection
