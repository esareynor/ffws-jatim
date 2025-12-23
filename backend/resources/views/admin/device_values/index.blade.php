@extends('layouts.admin')

@section('title', 'Device Configuration')

@section('content')
<div class="container-fluid px-4 py-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Device Configuration</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage extended device information, location, and maintenance schedules</p>
        </div>
        <x-admin.button href="{{ route('admin.device-values.create') }}" variant="primary">
            <i class="fas fa-plus mr-2"></i>
            Add Device Configuration
        </x-admin.button>
    </div>

    <!-- Filters -->
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari',
                'placeholder' => 'Cari berdasarkan nama atau device...'
            ],
            [
                'type' => 'select',
                'name' => 'status',
                'label' => 'Status',
                'empty_option' => 'Semua Status',
                'options' => [
                    ['value' => 'active', 'label' => 'Aktif'],
                    ['value' => 'inactive', 'label' => 'Non-aktif'],
                    ['value' => 'pending', 'label' => 'Pending'],
                    ['value' => 'maintenance', 'label' => 'Maintenance']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'device_code',
                'label' => 'Device',
                'empty_option' => 'Semua Device',
                'options' => $devices->map(function($device) {
                    return ['value' => $device->code, 'label' => $device->name];
                })->toArray()
            ]
        ];
    @endphp

    <x-filter-bar 
        title="Filter & Pencarian Device Configuration"
        :filters="$filterConfig"
        :action="route('admin.device-values.index')"
        gridCols="md:grid-cols-3"
    />

    <!-- Device Values Table -->
    <x-table
        title="Daftar Device Configuration"
        :headers="$tableHeaders"
        :rows="$deviceValues"
        searchable
        searchPlaceholder="Cari device configuration..."
    >
        <x-slot:actions>
            <x-admin.button href="{{ route('admin.device-values.create') }}" variant="primary">
                <i class="fas fa-plus mr-2"></i>
                Add Device Configuration
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <i class="fas fa-check-circle text-green-600 dark:text-green-300 text-xl"></i>
                    </div>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                        {{ $deviceValues->where('status', 'active')->count() }}
                    </p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <i class="fas fa-wrench text-orange-600 dark:text-orange-300 text-xl"></i>
                    </div>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Maintenance</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                        {{ $deviceValues->where('status', 'maintenance')->count() }}
                    </p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                        <i class="fas fa-clock text-yellow-600 dark:text-yellow-300 text-xl"></i>
                    </div>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                        {{ $deviceValues->where('status', 'pending')->count() }}
                    </p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-300 text-xl"></i>
                    </div>
                </div>
                <div class="ml-4">
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Maintenance</p>
                    <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                        {{ $deviceValues->filter(fn($dv) => $dv->isMaintenanceDue())->count() }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Flash messages are handled by x-admin.sweetalert component in layout --}}
@endsection

