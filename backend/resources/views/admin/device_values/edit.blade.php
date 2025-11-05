@extends('layouts.admin')

@section('title', 'Edit Device Configuration')

@section('content')
<div class="container-fluid px-4 py-6">
    <!-- Header -->
    <div class="mb-6">
        <div class="flex items-center mb-2">
            <a href="{{ route('admin.device-values.index') }}" class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-3">
                <i class="fas fa-arrow-left"></i>
            </a>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Device Configuration</h1>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">Update extended device information, location, and maintenance schedule</p>
    </div>

    <!-- Form -->
    <form action="{{ route('admin.device-values.update', $deviceValue->id) }}" method="POST" class="max-w-4xl">
        @csrf
        @method('PUT')

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Device -->
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Device <span class="text-red-500">*</span>
                    </label>
                    <select name="mas_device_code" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 @error('mas_device_code') border-red-500 @enderror">
                        <option value="">Select Device</option>
                        @foreach($devices as $device)
                            <option value="{{ $device->code }}" {{ old('mas_device_code', $deviceValue->mas_device_code) == $device->code ? 'selected' : '' }}>
                                {{ $device->name }} ({{ $device->code }})
                            </option>
                        @endforeach
                    </select>
                    @error('mas_device_code')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Name -->
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Display Name
                    </label>
                    <input type="text" name="name" value="{{ old('name', $deviceValue->name) }}"
                        placeholder="Optional custom name for this configuration"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 @error('name') border-red-500 @enderror">
                    @error('name')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Status -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status <span class="text-red-500">*</span>
                    </label>
                    <select name="status" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 @error('status') border-red-500 @enderror">
                        <option value="active" {{ old('status', $deviceValue->status) == 'active' ? 'selected' : '' }}>Active</option>
                        <option value="inactive" {{ old('status', $deviceValue->status) == 'inactive' ? 'selected' : '' }}>Inactive</option>
                        <option value="pending" {{ old('status', $deviceValue->status) == 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="maintenance" {{ old('status', $deviceValue->status) == 'maintenance' ? 'selected' : '' }}>Maintenance</option>
                    </select>
                    @error('status')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Device Parameter -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Device Parameter
                    </label>
                    <select name="mas_device_parameter_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Parameter</option>
                        @foreach($deviceParameters as $param)
                            <option value="{{ $param->code }}" {{ old('mas_device_parameter_code', $deviceValue->mas_device_parameter_code) == $param->code ? 'selected' : '' }}>
                                {{ $param->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <!-- Icon Path -->
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Icon Path
                    </label>
                    <input type="text" name="icon_path" value="{{ old('icon_path', $deviceValue->icon_path) }}"
                        placeholder="e.g., /images/devices/icon.png"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
        </div>

        <!-- Location Information -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location Information</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Latitude -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Latitude
                    </label>
                    <input type="number" step="0.000001" name="latitude" value="{{ old('latitude', $deviceValue->latitude) }}"
                        placeholder="-90 to 90"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 @error('latitude') border-red-500 @enderror">
                    @error('latitude')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Longitude -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Longitude
                    </label>
                    <input type="number" step="0.000001" name="longitude" value="{{ old('longitude', $deviceValue->longitude) }}"
                        placeholder="-180 to 180"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 @error('longitude') border-red-500 @enderror">
                    @error('longitude')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Elevation -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Elevation (m)
                    </label>
                    <input type="number" step="0.01" name="elevation" value="{{ old('elevation', $deviceValue->elevation) }}"
                        placeholder="Meters above sea level"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
        </div>

        <!-- Geographic Information -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Geographic Information</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- River Basin -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        River Basin
                    </label>
                    <select name="mas_river_basin_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select River Basin</option>
                        @foreach($riverBasins as $basin)
                            <option value="{{ $basin->code }}" {{ old('mas_river_basin_code', $deviceValue->mas_river_basin_code) == $basin->code ? 'selected' : '' }}>
                                {{ $basin->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <!-- Watershed -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Watershed
                    </label>
                    <select name="mas_watershed_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Watershed</option>
                        @foreach($watersheds as $watershed)
                            <option value="{{ $watershed->code }}" {{ old('mas_watershed_code', $deviceValue->mas_watershed_code) == $watershed->code ? 'selected' : '' }}>
                                {{ $watershed->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <!-- City -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                    </label>
                    <select name="mas_city_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select City</option>
                        @foreach($cities as $city)
                            <option value="{{ $city->code }}" {{ old('mas_city_code', $deviceValue->mas_city_code) == $city->code ? 'selected' : '' }}>
                                {{ $city->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <!-- Regency -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Regency
                    </label>
                    <select name="mas_regency_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Regency</option>
                        @foreach($regencies as $regency)
                            <option value="{{ $regency->code }}" {{ old('mas_regency_code', $deviceValue->mas_regency_code) == $regency->code ? 'selected' : '' }}>
                                {{ $regency->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <!-- Village -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Village
                    </label>
                    <select name="mas_village_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Village</option>
                        @foreach($villages as $village)
                            <option value="{{ $village->code }}" {{ old('mas_village_code', $deviceValue->mas_village_code) == $village->code ? 'selected' : '' }}>
                                {{ $village->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <!-- UPT -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        UPT
                    </label>
                    <select name="mas_upt_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select UPT</option>
                        @foreach($upts as $upt)
                            <option value="{{ $upt->code }}" {{ old('mas_upt_code', $deviceValue->mas_upt_code) == $upt->code ? 'selected' : '' }}>
                                {{ $upt->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <!-- UPTD -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        UPTD
                    </label>
                    <select name="mas_uptd_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select UPTD</option>
                        @foreach($uptds as $uptd)
                            <option value="{{ $uptd->code }}" {{ old('mas_uptd_code', $deviceValue->mas_uptd_code) == $uptd->code ? 'selected' : '' }}>
                                {{ $uptd->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>
        </div>

        <!-- Maintenance Information -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maintenance Schedule</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Installation Date -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Installation Date
                    </label>
                    <input type="date" name="installation_date" value="{{ old('installation_date', $deviceValue->installation_date?->format('Y-m-d')) }}"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- Last Maintenance -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Maintenance
                    </label>
                    <input type="date" name="last_maintenance" value="{{ old('last_maintenance', $deviceValue->last_maintenance?->format('Y-m-d')) }}"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- Next Maintenance -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Next Maintenance
                    </label>
                    <input type="date" name="next_maintenance" value="{{ old('next_maintenance', $deviceValue->next_maintenance?->format('Y-m-d')) }}"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 @error('next_maintenance') border-red-500 @enderror">
                    @error('next_maintenance')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>
        </div>

        <!-- Description -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                </label>
                <textarea name="description" rows="4"
                    placeholder="Additional notes or description..."
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">{{ old('description', $deviceValue->description) }}</textarea>
            </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
            <x-admin.button href="{{ route('admin.device-values.index') }}" variant="secondary">
                <i class="fas fa-times mr-2"></i>
                Cancel
            </x-admin.button>
            <x-admin.button type="submit" variant="primary">
                <i class="fas fa-save mr-2"></i>
                Update Configuration
            </x-admin.button>
        </div>
    </form>
</div>
@endsection

