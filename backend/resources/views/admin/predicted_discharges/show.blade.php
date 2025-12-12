@extends('layouts.admin')

@section('title', 'Detail Predicted Discharge')
@section('page-title', 'Detail Predicted Discharge')
@section('page-description', 'Informasi detail data debit prediksi')
@section('breadcrumb', 'Detail Predicted Discharge')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="card-dark shadow-sm rounded-lg">
        <div class="p-6">
            <!-- Sensor Information -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <i class="fas fa-sensor text-purple-600 dark:text-purple-400 mr-2"></i>
                    Informasi Sensor
                </h3>
                <div class="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Nama Sensor
                        </label>
                        <p class="text-base text-gray-900 dark:text-white font-medium">
                            {{ $prediction->sensor->description ?? '-' }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Kode Sensor
                        </label>
                        <p class="text-base text-gray-900 dark:text-white font-medium">
                            {{ $prediction->mas_sensor_code }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Device
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ $prediction->sensor->device->name ?? '-' }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Parameter
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            Water Level (Predicted)
                        </p>
                    </div>
                </div>
            </div>

            <!-- Prediction Data -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <i class="fas fa-crystal-ball text-purple-600 dark:text-purple-400 mr-2"></i>
                    Data Prediksi
                </h3>
                <div class="grid grid-cols-2 gap-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                    <div>
                        <label class="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                            Waktu Prediksi
                        </label>
                        <p class="text-lg text-purple-900 dark:text-purple-100 font-semibold">
                            {{ $prediction->predicted_at->format('d F Y, H:i') }} WIB
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                            Tinggi Muka Air Prediksi
                        </label>
                        <p class="text-lg text-purple-900 dark:text-purple-100 font-semibold">
                            {{ number_format($prediction->water_level, 2) }} m
                        </p>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                            Debit Prediksi
                        </label>
                        <p class="text-2xl text-purple-900 dark:text-purple-100 font-bold">
                            {{ number_format($prediction->discharge, 2) }} m³/s
                        </p>
                    </div>
                </div>
            </div>

            <!-- Rating Curve Information -->
            @if($prediction->ratingCurve)
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <i class="fas fa-chart-line text-purple-600 dark:text-purple-400 mr-2"></i>
                    Rating Curve yang Digunakan
                </h3>
                <div class="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Kode Rating Curve
                        </label>
                        <p class="text-base text-gray-900 dark:text-white font-medium">
                            {{ $prediction->ratingCurve->code }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Tanggal Berlaku
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ $prediction->ratingCurve->effective_date->format('d F Y') }}
                        </p>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Formula
                        </label>
                        <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3">
                            <p class="text-base font-mono text-purple-800 dark:text-purple-200">
                                {{ $prediction->ratingCurve->formula_string }}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Parameter A
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ number_format($prediction->ratingCurve->a ?? 0, 4) }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Parameter B
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ number_format($prediction->ratingCurve->b, 4) }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Parameter C
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ number_format($prediction->ratingCurve->c, 4) }}
                        </p>
                    </div>
                </div>
            </div>
            @endif

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                    href="{{ route('admin.predicted-discharges.index') }}"
                    class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                    <i class="fas fa-arrow-left mr-2"></i>Kembali
                </a>
                <a
                    href="{{ route('admin.predicted-discharges.edit', $prediction->id) }}"
                    class="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                    <i class="fas fa-edit mr-2"></i>Edit
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
