@extends('layouts.admin')

@section('title', 'Data Actuals')
@section('page-title', 'Dashboard Data Actuals')
@section('page-description', 'Monitoring data aktual dari sensor-sensor FFWS')

@section('content')


<div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden shadow-lg sm:rounded-lg">
        <div class="p-6 flex items-center justify-between">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <i class="fas fa-chart-line text-white text-4xl mr-6"></i>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-white mb-1">Data Actuals</h2>
                    <p class="text-white opacity-90">Monitoring data aktual dari sensor-sensor FFWS</p>
                </div>
            </div>
            <div class="flex space-x-3">
                <x-admin.button variant="outline" size="md" 
                    href="{{ route('admin.data-actuals.export', request()->query()) }}"
                    class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white">
                    <i class="fas fa-download mr-2"></i>Export CSV
                </x-admin.button>
                <x-admin.button variant="primary" size="md" 
                    onclick="openCreateModal()"
                    class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white">
                    <i class="fas fa-plus mr-2"></i>Tambah Data
                </x-admin.button>
            </div>
        </div>
    </div>

    <!-- Statistik Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div class="bg-white dark:bg-[#18181b] overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-database text-blue-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Data</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ number_format($stats['total_data']) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-[#18181b] overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-check-circle text-green-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Status Aman</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ number_format($stats['safe_count']) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-[#18181b] overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-triangle text-yellow-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Status Waspada</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ number_format($stats['warning_count']) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-[#18181b] overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-exclamation-circle text-red-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Status Bahaya</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ number_format($stats['danger_count']) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-[#18181b] overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-calendar-day text-purple-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Data Hari Ini</p>
                        <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ number_format($stats['today_data']) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filter Section -->
    @php
        $filterConfig = [
            [
                'type' => 'select',
                'name' => 'sensor_id',
                'label' => 'Sensor',
                'empty_option' => 'Semua Sensor',
                'options' => $sensors->map(function($sensor) { 
                    return [
                        'value' => $sensor->id, 
                        'label' => $sensor->sensor_code . ' - ' . $sensor->parameter
                    ]; 
                })->toArray()
            ],
            [
                'type' => 'select',
                'name' => 'threshold_status',
                'label' => 'Status Threshold',
                'empty_option' => 'Semua Status',
                'options' => [
                    ['value' => 'safe', 'label' => 'Aman'],
                    ['value' => 'warning', 'label' => 'Waspada'],
                    ['value' => 'danger', 'label' => 'Bahaya']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'river_basin_id',
                'label' => 'Daerah Aliran Sungai',
                'empty_option' => 'Semua DAS',
                'options' => $riverBasins->map(function($basin) { 
                    return [
                        'value' => $basin->id, 
                        'label' => $basin->name
                    ]; 
                })->toArray()
            ],
            [
                'type' => 'date',
                'name' => 'date_from',
                'label' => 'Dari Tanggal'
            ],
            [
                'type' => 'date',
                'name' => 'date_to',
                'label' => 'Sampai Tanggal'
            ]
        ];
    @endphp

    <x-filter-bar 
        title="Filter Data Actuals"
        :filters="$filterConfig"
        :action="route('admin.data-actuals.index')"
        gridCols="md:grid-cols-5"
    />

    <!-- Data Table -->
    <x-table 
        title="Data Actuals"
        :headers="$tableHeaders"
        :rows="$dataActuals"
        :pagination="$dataActuals->appends(request()->query())->links()"
        :pagination-text="'Menampilkan ' . ($dataActuals->firstItem() ?? 0) . ' - ' . ($dataActuals->lastItem() ?? 0) . ' dari ' . $dataActuals->total() . ' data'"
    />
</div>

<!-- Modal Create/Edit Data Actual -->
<x-admin.modal name="dataActualModal" size="lg" title="Data Actual">
    <form id="dataActualForm" class="space-y-4">
        @csrf
        <input type="hidden" id="dataActualId" name="id">
        <input type="hidden" id="formMethod" name="_method" value="POST">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="mas_sensor_id" class="block text-sm font-medium text-gray-700 mb-1">Sensor</label>
                <select id="mas_sensor_id" name="mas_sensor_id" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Pilih Sensor</option>
                </select>
                <div id="sensor_info" class="mt-1 text-sm text-gray-500"></div>
            </div>
            
            <div>
                <label for="value" class="block text-sm font-medium text-gray-700 mb-1">Nilai</label>
                <input type="number" id="value" name="value" step="0.01" required
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Masukkan nilai">
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="received_at" class="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu</label>
                <input type="datetime-local" id="received_at" name="received_at" required
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            
            <div>
                <label for="threshold_status" class="block text-sm font-medium text-gray-700 mb-1">Status Threshold</label>
                <select id="threshold_status" name="threshold_status" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Pilih Status</option>
                    <option value="safe">Aman</option>
                    <option value="warning">Waspada</option>
                    <option value="danger">Bahaya</option>
                </select>
            </div>
        </div>
    </form>
    
    <x-slot name="footer">
        <x-admin.button variant="outline" onclick="closeModal()">Batal</x-admin.button>
        <x-admin.button variant="primary" onclick="submitForm()" id="submitBtn">
            <span id="submitText">Simpan</span>
        </x-admin.button>
    </x-slot>
</x-admin.modal>

@endsection

@push('scripts')
@include('admin.data_actuals.script')
@endpush
