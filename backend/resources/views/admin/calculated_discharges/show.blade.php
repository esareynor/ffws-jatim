@extends('layouts.admin')

@section('title', 'Detail Calculated Discharge')
@section('page-title', 'Detail Calculated Discharge')
@section('page-description', 'Informasi detail data debit terhitung')
@section('breadcrumb', 'Detail Calculated Discharge')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="card-dark shadow-sm rounded-lg">
        <div class="p-6">
            <!-- Sensor Information -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <i class="fas fa-sensor text-blue-600 dark:text-blue-400 mr-2"></i>
                    Informasi Sensor
                </h3>
                <div class="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Nama Sensor
                        </label>
                        <p class="text-base text-gray-900 dark:text-white font-medium">
                            {{ $discharge->sensor->description ?? '-' }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Kode Sensor
                        </label>
                        <p class="text-base text-gray-900 dark:text-white font-medium">
                            {{ $discharge->mas_sensor_code }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Device
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ $discharge->sensor->device->name ?? '-' }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Parameter
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            Water Level
                        </p>
                    </div>
                </div>
            </div>

            <!-- Discharge Data -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <i class="fas fa-water text-blue-600 dark:text-blue-400 mr-2"></i>
                    Data Debit
                </h3>
                <div class="grid grid-cols-2 gap-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <div>
                        <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                            Waktu Pengukuran
                        </label>
                        <p class="text-lg text-blue-900 dark:text-blue-100 font-semibold">
                            {{ $discharge->calculated_at->format('d F Y, H:i') }} WIB
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                            Tinggi Muka Air
                        </label>
                        <p class="text-lg text-blue-900 dark:text-blue-100 font-semibold">
                            {{ number_format($discharge->water_level, 2) }} m
                        </p>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                            Debit Terhitung
                        </label>
                        <p class="text-2xl text-blue-900 dark:text-blue-100 font-bold">
                            {{ number_format($discharge->discharge, 2) }} m³/s
                        </p>
                    </div>
                </div>
            </div>

            <!-- Rating Curve Information -->
            @if($discharge->ratingCurve)
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <i class="fas fa-chart-line text-blue-600 dark:text-blue-400 mr-2"></i>
                    Rating Curve yang Digunakan
                </h3>
                <div class="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Kode Rating Curve
                        </label>
                        <p class="text-base text-gray-900 dark:text-white font-medium">
                            {{ $discharge->ratingCurve->code }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Tanggal Berlaku
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ $discharge->ratingCurve->effective_date->format('d F Y') }}
                        </p>
                    </div>
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Formula
                        </label>
                        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                            <p class="text-base font-mono text-blue-800 dark:text-blue-200">
                                {{ $discharge->ratingCurve->formula_string }}
                            </p>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Parameter A
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ number_format($discharge->ratingCurve->a ?? 0, 4) }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Parameter B
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ number_format($discharge->ratingCurve->b, 4) }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Parameter C
                        </label>
                        <p class="text-base text-gray-900 dark:text-white">
                            {{ number_format($discharge->ratingCurve->c, 4) }}
                        </p>
                    </div>
                </div>
            </div>
            @endif

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                    href="{{ route('admin.calculated-discharges.index') }}"
                    class="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                    <i class="fas fa-arrow-left mr-2"></i>Kembali
                </a>
                <a
                    href="{{ route('admin.calculated-discharges.edit', $discharge->id) }}"
                    class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                    <i class="fas fa-edit mr-2"></i>Edit
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
