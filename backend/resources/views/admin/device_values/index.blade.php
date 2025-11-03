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
        <a href="{{ route('admin.device-values.create') }}" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Add Device Configuration
        </a>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <form method="GET" action="{{ route('admin.device-values.index') }}" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                <input type="text" name="search" value="{{ request('search') }}" 
                    placeholder="Search by name or device..."
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select name="status" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">All Status</option>
                    <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>Active</option>
                    <option value="inactive" {{ request('status') == 'inactive' ? 'selected' : '' }}>Inactive</option>
                    <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>Pending</option>
                    <option value="maintenance" {{ request('status') == 'maintenance' ? 'selected' : '' }}>Maintenance</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Device</label>
                <select name="device_code" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">All Devices</option>
                    @foreach($devices as $device)
                        <option value="{{ $device->code }}" {{ request('device_code') == $device->code ? 'selected' : '' }}>
                            {{ $device->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="flex items-end">
                <button type="submit" class="btn btn-primary mr-2">
                    <i class="fas fa-search mr-2"></i>
                    Filter
                </button>
                <a href="{{ route('admin.device-values.index') }}" class="btn btn-secondary">
                    <i class="fas fa-redo mr-2"></i>
                    Reset
                </a>
            </div>
        </form>
    </div>

    <!-- Device Values Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Device
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Location
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Installation
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Maintenance
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    @forelse($deviceValues as $deviceValue)
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    @if($deviceValue->icon_path)
                                        <img src="{{ asset($deviceValue->icon_path) }}" alt="Icon" class="h-10 w-10 rounded-full mr-3">
                                    @else
                                        <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                            <i class="fas fa-microchip text-blue-600 dark:text-blue-300"></i>
                                        </div>
                                    @endif
                                    <div>
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                                            {{ $deviceValue->name ?? $deviceValue->device->name }}
                                        </div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">
                                            {{ $deviceValue->device->code }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">
                                    @if($deviceValue->latitude && $deviceValue->longitude)
                                        <div class="flex items-center">
                                            <i class="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                                            <span>{{ number_format($deviceValue->latitude, 6) }}, {{ number_format($deviceValue->longitude, 6) }}</span>
                                        </div>
                                        @if($deviceValue->elevation)
                                            <div class="text-xs text-gray-500 mt-1">
                                                Elevation: {{ $deviceValue->elevation }}m
                                            </div>
                                        @endif
                                    @else
                                        <span class="text-gray-400">Not set</span>
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">
                                    @if($deviceValue->installation_date)
                                        <div class="flex items-center">
                                            <i class="fas fa-calendar text-gray-400 mr-2"></i>
                                            {{ $deviceValue->installation_date->format('M d, Y') }}
                                        </div>
                                    @else
                                        <span class="text-gray-400">Not set</span>
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($deviceValue->next_maintenance)
                                    @php
                                        $daysUntil = $deviceValue->daysUntilMaintenance();
                                        $isDue = $daysUntil !== null && $daysUntil < 0;
                                        $isUpcoming = $daysUntil !== null && $daysUntil >= 0 && $daysUntil <= 7;
                                    @endphp
                                    <div class="text-sm">
                                        <div class="flex items-center {{ $isDue ? 'text-red-600' : ($isUpcoming ? 'text-yellow-600' : 'text-gray-900 dark:text-white') }}">
                                            <i class="fas fa-wrench mr-2"></i>
                                            {{ $deviceValue->next_maintenance->format('M d, Y') }}
                                        </div>
                                        <div class="text-xs text-gray-500 mt-1">
                                            @if($isDue)
                                                <span class="text-red-600 font-medium">Overdue by {{ abs($daysUntil) }} days</span>
                                            @elseif($isUpcoming)
                                                <span class="text-yellow-600 font-medium">Due in {{ $daysUntil }} days</span>
                                            @else
                                                In {{ $daysUntil }} days
                                            @endif
                                        </div>
                                    </div>
                                @else
                                    <span class="text-gray-400 text-sm">Not scheduled</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    @if($deviceValue->status == 'active') bg-green-100 text-green-800
                                    @elseif($deviceValue->status == 'inactive') bg-gray-100 text-gray-800
                                    @elseif($deviceValue->status == 'pending') bg-yellow-100 text-yellow-800
                                    @elseif($deviceValue->status == 'maintenance') bg-orange-100 text-orange-800
                                    @endif">
                                    {{ ucfirst($deviceValue->status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="{{ route('admin.device-values.edit', $deviceValue->id) }}" 
                                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <form action="{{ route('admin.device-values.destroy', $deviceValue->id) }}" 
                                    method="POST" class="inline-block"
                                    onsubmit="return confirm('Are you sure you want to delete this device configuration?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center">
                                <div class="flex flex-col items-center justify-center">
                                    <i class="fas fa-inbox text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
                                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No device configurations found</h3>
                                    <p class="text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first device configuration</p>
                                    <a href="{{ route('admin.device-values.create') }}" class="btn btn-primary">
                                        <i class="fas fa-plus mr-2"></i>
                                        Add Device Configuration
                                    </a>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($deviceValues->hasPages())
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                {{ $deviceValues->links() }}
            </div>
        @endif
    </div>

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

@if(session('success'))
    <script>
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: '{{ session('success') }}',
            timer: 3000,
            showConfirmButton: false
        });
    </script>
@endif

@if(session('error'))
    <script>
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: '{{ session('error') }}',
            timer: 3000,
            showConfirmButton: false
        });
    </script>
@endif
@endsection

