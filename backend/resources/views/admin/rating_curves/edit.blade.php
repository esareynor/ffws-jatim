@extends('layouts.admin')

@section('title', 'Edit Rating Curve')
@section('page-title', 'Edit Rating Curve')
@section('page-description', 'Edit rating curve')
@section('breadcrumb', 'Edit Rating Curve')

@section('content')
<div class="max-w-3xl mx-auto" x-data="ratingCurveForm()">
    <div class="card-dark shadow-sm rounded-lg">
        <div class="p-6">
            <form action="{{ route('admin.rating-curves.update', $ratingCurve['id']) }}" method="POST" class="space-y-6">
                @csrf
                @method('PUT')

                <!-- Formula Type Selection -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rumus <span class="text-red-500">*</span>
                    </label>
                    <select
                        name="formula_type"
                        x-model="formulaType"
                        @change="updateFormulaDisplay()"
                        required
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">-- Pilih Rumus --</option>
                        @foreach($formulaTypes as $type)
                            <option value="{{ $type['value'] }}" {{ $ratingCurve['formula_type'] == $type['value'] ? 'selected' : '' }}>
                                {{ $type['label'] }}
                            </option>
                        @endforeach
                    </select>
                    @error('formula_type')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Formula Display Box -->
                <div x-show="formulaType" x-cloak>
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                        <div class="flex items-center">
                            <i class="fas fa-calculator text-blue-600 dark:text-blue-400 mr-3"></i>
                            <p class="text-base font-mono text-blue-800 dark:text-blue-200 font-semibold" x-text="formulaDisplay"></p>
                        </div>
                    </div>
                </div>

                <!-- Data Section Title -->
                <div x-show="formulaType" x-cloak>
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white">Data</h3>
                </div>

                <!-- Parameter A (Only for tipe-01 and tipe-03) -->
                <div x-show="showParamA" x-cloak>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        A <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="a"
                        step="0.000001"
                        placeholder="0.0"
                        value="{{ $ratingCurve['a'] ?? '' }}"
                        x-bind:required="showParamA"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    @error('a')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Parameter B (All formula types use this) -->
                <div x-show="formulaType" x-cloak>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        B <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="b"
                        step="0.000001"
                        placeholder="0.0"
                        value="{{ $ratingCurve['b'] ?? '' }}"
                        x-bind:required="formulaType !== ''"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    @error('b')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Parameter C (Always shown when formula selected) -->
                <div x-show="formulaType" x-cloak>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        C <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="c"
                        step="0.000001"
                        placeholder="0.0"
                        value="{{ $ratingCurve['c'] ?? '' }}"
                        x-bind:required="formulaType !== ''"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    @error('c')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Sensor Selection -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kode Sensor <span class="text-red-500">*</span>
                    </label>
                    <select
                        name="mas_sensor_code"
                        required
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">-- Pilih Sensor --</option>
                        @foreach($sensors as $sensor)
                            <option value="{{ $sensor['value'] }}" {{ $ratingCurve['sensor_code'] == $sensor['value'] ? 'selected' : '' }}>
                                {{ $sensor['label'] }}
                            </option>
                        @endforeach
                    </select>
                    @error('mas_sensor_code')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Rating Curve Code -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kode Rating Curve <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="code"
                        placeholder="RC-001"
                        value="{{ $ratingCurve['code'] }}"
                        required
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    @error('code')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Effective Date -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tanggal Berlaku <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="effective_date"
                        value="{{ isset($ratingCurve['effective_date']) ? date('Y-m-d', strtotime($ratingCurve['effective_date'])) : '' }}"
                        required
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    @error('effective_date')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-start space-x-3 pt-4">
                    <a href="{{ route('admin.rating-curves.index') }}" class="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        Kembali
                    </a>
                    <button type="submit" class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

@push('scripts')
<script>
function ratingCurveForm() {
    return {
        formulaType: '{{ $ratingCurve["formula_type"] ?? "" }}',
        formulaDisplay: '',
        showParamA: false,

        init() {
            this.updateFormulaDisplay();
        },

        updateFormulaDisplay() {
            const formulas = {
                'tipe-01': {
                    display: 'Tipe-01 (C x (H-A)^B)',
                    showA: true
                },
                'tipe-02': {
                    display: 'Tipe-02 (C x B x H^3/2)',
                    showA: false
                },
                'tipe-03': {
                    display: 'Tipe-03 (C x (H+A)^B)',
                    showA: true
                }
            };

            const formula = formulas[this.formulaType];
            if (formula) {
                this.formulaDisplay = formula.display;
                this.showParamA = formula.showA;
            } else {
                this.formulaDisplay = '';
                this.showParamA = false;
            }
        }
    }
}
</script>
@endpush
@endsection
