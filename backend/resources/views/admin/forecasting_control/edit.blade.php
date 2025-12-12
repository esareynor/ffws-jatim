@extends('layouts.admin')

@section('title', 'Edit Forecasting Control')
@section('page-title', 'Edit Forecasting Control')
@section('page-description', 'Edit konfigurasi forecasting untuk sensor')
@section('breadcrumb', 'Edit Forecasting Control')

@section('content')
<div class="max-w-3xl mx-auto">
    <div class="card-dark shadow-sm rounded-lg">
        <div class="p-6">
            <form action="{{ route('admin.forecasting-control.update', $sensor->id) }}" method="POST" class="space-y-6">
                @csrf
                @method('PUT')

                <!-- Sensor Info (Read-only) -->
                <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">Informasi Sensor</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Nama Sensor
                            </label>
                            <p class="text-base text-gray-900 dark:text-white font-medium">{{ $sensor->description }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Kode Sensor
                            </label>
                            <p class="text-base text-gray-900 dark:text-white font-medium">{{ $sensor->code }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Parameter
                            </label>
                            <p class="text-base text-gray-900 dark:text-white">{{ ucfirst(str_replace('_', ' ', $sensor->parameter)) }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Device
                            </label>
                            <p class="text-base text-gray-900 dark:text-white">{{ $sensor->device->name ?? '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Model Selection -->
                <div>
                    <label for="mas_model_code" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model <span class="text-red-500">*</span>
                    </label>
                    <select
                        id="mas_model_code"
                        name="mas_model_code"
                        required
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">-- Pilih Model --</option>
                        @foreach($models as $model)
                            <option
                                value="{{ $model['value'] }}"
                                {{ old('mas_model_code', $sensor->mas_model_code) == $model['value'] ? 'selected' : '' }}
                            >
                                {{ $model['label'] }}
                            </option>
                        @endforeach
                    </select>
                    @error('mas_model_code')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <i class="fas fa-info-circle"></i> Pilih model yang akan digunakan untuk prediksi data
                    </p>
                </div>

                <!-- Forecasting Status -->
                <div>
                    <label for="forecasting_status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status Forecasting <span class="text-red-500">*</span>
                    </label>
                    <select
                        id="forecasting_status"
                        name="forecasting_status"
                        required
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        @foreach($statusOptions as $option)
                            <option
                                value="{{ $option['value'] }}"
                                {{ old('forecasting_status', $sensor->forecasting_status ?? 'inactive') == $option['value'] ? 'selected' : '' }}
                            >
                                {{ $option['label'] }}
                            </option>
                        @endforeach
                    </select>
                    @error('forecasting_status')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                    <div class="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p><i class="fas fa-info-circle"></i> <strong>Active:</strong> Forecasting sedang berjalan</p>
                        <p><i class="fas fa-info-circle"></i> <strong>Paused:</strong> Forecasting dijeda sementara</p>
                        <p><i class="fas fa-info-circle"></i> <strong>Stopped:</strong> Forecasting dihentikan</p>
                        <p><i class="fas fa-info-circle"></i> <strong>Inactive:</strong> Forecasting tidak aktif</p>
                    </div>
                </div>

                <!-- Current Model Info (if exists) -->
                @if($sensor->masModel)
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                        <i class="fas fa-brain"></i> Model Saat Ini
                    </h4>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span class="text-blue-700 dark:text-blue-300 font-medium">Nama:</span>
                            <span class="text-blue-900 dark:text-blue-100">{{ $sensor->masModel->name }}</span>
                        </div>
                        <div>
                            <span class="text-blue-700 dark:text-blue-300 font-medium">Tipe:</span>
                            <span class="text-blue-900 dark:text-blue-100">{{ $sensor->masModel->type }}</span>
                        </div>
                        <div>
                            <span class="text-blue-700 dark:text-blue-300 font-medium">Versi:</span>
                            <span class="text-blue-900 dark:text-blue-100">{{ $sensor->masModel->version ?? '-' }}</span>
                        </div>
                        <div>
                            <span class="text-blue-700 dark:text-blue-300 font-medium">Akurasi:</span>
                            <span class="text-blue-900 dark:text-blue-100">{{ $sensor->masModel->accuracy ?? '-' }}</span>
                        </div>
                    </div>
                </div>
                @endif

                <!-- Action Buttons -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                        href="{{ route('admin.forecasting-control.index') }}"
                        class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                        <i class="fas fa-arrow-left mr-2"></i>Kembali
                    </a>
                    <button
                        type="submit"
                        class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        <i class="fas fa-save mr-2"></i>Simpan
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
