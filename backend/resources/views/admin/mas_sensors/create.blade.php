@extends('layouts.admin')

@section('title', 'Tambah Sensor')
@section('page-title', 'Tambah Sensor')
@section('page-description', 'Tambah sensor monitoring baru')
@section('breadcrumb', 'Sensors / Tambah')

@section('content')
<div class="space-y-6">
    <x-admin.card title="Form Tambah Sensor">
        <form action="{{ route('admin.sensors.store') }}" method="POST" class="space-y-6">
            @csrf
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Device Selection -->
                <x-admin.form-input 
                    type="select"
                    name="mas_device_code" 
                    label="Device" 
                    required="true" 
                    :error="$errors->first('mas_device_code')"
                    :options="collect($devices)->map(function($device) {
                        return ['value' => $device->code, 'label' => $device->name . ' (' . $device->code . ')'];
                    })->toArray()"
                    class="md:col-span-2"
                />

                <!-- Sensor Code -->
                <x-admin.form-input 
                    type="text" 
                    name="code" 
                    label="Kode Sensor" 
                    placeholder="Contoh: SENSOR-WL-001" 
                    required="true" 
                    :error="$errors->first('code')"
                />

                <!-- Parameter -->
                <x-admin.form-input 
                    type="select"
                    name="parameter" 
                    label="Parameter" 
                    required="true" 
                    :error="$errors->first('parameter')"
                    :options="collect($parameterOptions)->map(function($label, $value) {
                        return ['value' => $value, 'label' => $label];
                    })->values()->toArray()"
                />

                <!-- Unit -->
                <x-admin.form-input 
                    type="text" 
                    name="unit" 
                    label="Unit" 
                    placeholder="Contoh: cm, mm, m" 
                    required="true" 
                    :error="$errors->first('unit')"
                />

                <!-- Status -->
                <x-admin.form-input 
                    type="select"
                    name="status" 
                    label="Status" 
                    required="true" 
                    :error="$errors->first('status')"
                    :options="collect($statusOptions)->map(function($label, $value) {
                        return ['value' => $value, 'label' => $label];
                    })->values()->toArray()"
                />

                <!-- Model Selection -->
                <x-admin.form-input 
                    type="select"
                    name="mas_model_code" 
                    label="Model Sensor"
                    placeholder="Pilih Model (Opsional)"
                    :error="$errors->first('mas_model_code')"
                    :options="collect($models)->map(function($model) {
                        return ['value' => $model->code, 'label' => $model->name . ' - ' . $model->code];
                    })->toArray()"
                />

                <!-- Description -->
                <x-admin.form-input 
                    type="textarea" 
                    name="description" 
                    label="Deskripsi" 
                    placeholder="Deskripsi sensor (opsional)"
                    :error="$errors->first('description')"
                    class="md:col-span-2"
                />
            </div>

            <!-- Threshold Section -->
            <div class="border-t pt-6">
                <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Threshold Settings</h4>
                <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <p class="text-sm text-blue-800 dark:text-blue-200">
                        <i class="fas fa-info-circle mr-1"></i>
                        <strong>Catatan:</strong> Nilai threshold harus berurutan: Safe &lt; Warning &lt; Danger
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Safe Threshold -->
                    <x-admin.form-input 
                        type="number" 
                        name="threshold_safe" 
                        label="Threshold Safe" 
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        :error="$errors->first('threshold_safe')"
                    />

                    <!-- Warning Threshold -->
                    <x-admin.form-input 
                        type="number" 
                        name="threshold_warning" 
                        label="Threshold Warning" 
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        :error="$errors->first('threshold_warning')"
                    />

                    <!-- Danger Threshold -->
                    <x-admin.form-input 
                        type="number" 
                        name="threshold_danger" 
                        label="Threshold Danger" 
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        :error="$errors->first('threshold_danger')"
                    />
                </div>
            </div>

            <!-- Last Seen -->
            <x-admin.form-input 
                type="datetime-local" 
                name="last_seen" 
                label="Last Seen" 
                :error="$errors->first('last_seen')"
            />

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 pt-6 border-t">
                <a href="{{ route('admin.sensors.index') }}" 
                   class="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Kembali
                </a>
                <button type="submit" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <i class="fas fa-save mr-2"></i>
                    Simpan Sensor
                </button>
            </div>
        </form>
    </x-admin.card>
</div>
@endsection
