@extends('layouts.admin')

@section('title', 'Scaler Management')

@section('content')
<div class="container-fluid px-4 py-6" x-data="scalerManager()">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">ML Model Scalers</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage normalization scalers for machine learning models</p>
        </div>
        <x-admin.button type="button" variant="primary" @click="openCreateModal()">
            <i class="fas fa-plus mr-2"></i>
            Add Scaler
        </x-admin.button>
    </div>

    <!-- Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-blue-700 dark:text-blue-300 mb-1">Total Scalers</p>
                    <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ $scalers->total() }}</p>
                </div>
                <div class="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-3">
                    <i class="fas fa-sliders-h text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-green-700 dark:text-green-300 mb-1">Active</p>
                    <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ $scalers->where('is_active', true)->count() }}</p>
                </div>
                <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-3">
                    <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-purple-700 dark:text-purple-300 mb-1">Input (X)</p>
                    <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ $scalers->where('io_axis', 'x')->count() }}</p>
                </div>
                <div class="bg-purple-100 dark:bg-purple-900/40 rounded-lg p-3">
                    <i class="fas fa-arrow-right text-purple-600 dark:text-purple-400 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-orange-700 dark:text-orange-300 mb-1">Output (Y)</p>
                    <p class="text-2xl font-bold text-orange-900 dark:text-orange-100">{{ $scalers->where('io_axis', 'y')->count() }}</p>
                </div>
                <div class="bg-orange-100 dark:bg-orange-900/40 rounded-lg p-3">
                    <i class="fas fa-arrow-left text-orange-600 dark:text-orange-400 text-xl"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari',
                'placeholder' => 'Cari scalers...'
            ],
            [
                'type' => 'select',
                'name' => 'technique',
                'label' => 'Technique',
                'empty_option' => 'Semua Technique',
                'options' => [
                    ['value' => 'standard', 'label' => 'Standard'],
                    ['value' => 'minmax', 'label' => 'MinMax'],
                    ['value' => 'robust', 'label' => 'Robust'],
                    ['value' => 'custom', 'label' => 'Custom']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'axis',
                'label' => 'Axis',
                'empty_option' => 'Semua Axis',
                'options' => [
                    ['value' => 'x', 'label' => 'Input (X)'],
                    ['value' => 'y', 'label' => 'Output (Y)']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'status',
                'label' => 'Status',
                'empty_option' => 'Semua Status',
                'options' => [
                    ['value' => 'active', 'label' => 'Aktif'],
                    ['value' => 'inactive', 'label' => 'Non-aktif']
                ]
            ]
        ];
    @endphp

    <x-filter-bar 
        title="Filter & Pencarian Scalers"
        :filters="$filterConfig"
        :action="route('admin.scalers.index')"
        gridCols="md:grid-cols-4"
    />

    <!-- Table -->
    <x-table
        title="Daftar Scalers"
        :headers="$tableHeaders"
        :rows="$scalers"
        searchable
        searchPlaceholder="Cari scalers..."
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreateModal()">
                <i class="fas fa-plus mr-2"></i>
                Add Scaler
            </x-admin.button>
        </x-slot:actions>
    </x-table>
    
    @push('scripts')
    <script>
    // Custom rendering untuk status button dengan Alpine.js
    document.addEventListener('DOMContentLoaded', function() {
        // Status buttons akan di-render oleh x-table component
        // Tapi kita perlu handle Alpine.js untuk toggle status
    });
    </script>
    @endpush

    <!-- Create/Edit Modal -->
    <x-admin.modal 
        size="lg"
        name="scaler-modal">
        <x-slot name="title">
            <span x-text="editingId ? 'Edit Scaler' : 'Add Scaler'"></span>
        </x-slot>
        
        <form :action="editingId ? '{{ url('admin/scalers') }}/' + editingId : '{{ route('admin.scalers.store') }}'" 
              method="POST" enctype="multipart/form-data">
            @csrf
            <input type="hidden" name="_method" x-bind:value="editingId ? 'PUT' : 'POST'">
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Code <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="code" x-model="form.code" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="name" x-model="form.name" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Technique <span class="text-red-500">*</span>
                    </label>
                    <select name="technique" x-model="form.technique" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="standard">Standard Scaler</option>
                        <option value="minmax">MinMax Scaler</option>
                        <option value="robust">Robust Scaler</option>
                        <option value="custom">Custom Scaler</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        IO Axis <span class="text-red-500">*</span>
                    </label>
                    <select name="io_axis" x-model="form.io_axis" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="x">Input (X)</option>
                        <option value="y">Output (Y)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Model
                    </label>
                    <select name="mas_model_code" x-model="form.mas_model_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Model</option>
                        @foreach($models as $model)
                        <option value="{{ $model->code }}">{{ $model->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sensor
                    </label>
                    <select name="mas_sensor_code" x-model="form.mas_sensor_code"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Sensor</option>
                        @foreach($sensors as $sensor)
                        <option value="{{ $sensor->code }}">{{ $sensor->description }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Version
                    </label>
                    <input type="text" name="version" x-model="form.version"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Scaler File <span class="text-red-500" x-show="!editingId">*</span>
                    </label>
                    <input type="file" name="scaler_file" :required="!editingId" accept=".pkl,.joblib,.json"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <p class="text-xs text-gray-500 mt-1">Supported: .pkl, .joblib, .json (Max 10MB)</p>
                </div>

                <div class="col-span-2">
                    <label class="flex items-center">
                        <input type="checkbox" name="is_active" x-model="form.is_active" value="1" class="rounded">
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
                    </label>
                </div>
            </div>

            <x-slot name="footer">
                <x-admin.button type="button" variant="secondary" @click="$dispatch('close-modal', 'scaler-modal')">Cancel</x-admin.button>
                <x-admin.button type="submit" variant="primary">
                    <span x-text="editingId ? 'Update' : 'Create'"></span>
                </x-admin.button>
            </x-slot>
        </form>
    </x-admin.modal>
</div>

<script>
function scalerManager() {
    return {
        editingId: null,
        form: {
            code: '',
            name: '',
            technique: 'custom',
            io_axis: 'x',
            mas_model_code: '',
            mas_sensor_code: '',
            version: '',
            is_active: true
        },
        
        openCreateModal() {
            this.editingId = null;
            this.form = {
                code: '',
                name: '',
                technique: 'custom',
                io_axis: 'x',
                mas_model_code: '',
                mas_sensor_code: '',
                version: '',
                is_active: true
            };
            this.$dispatch('open-modal', 'scaler-modal');
        },
        
        editScaler(scaler) {
            this.editingId = scaler.id;
            this.form = {
                code: scaler.code,
                name: scaler.name,
                technique: scaler.technique,
                io_axis: scaler.io_axis,
                mas_model_code: scaler.mas_model_code || '',
                mas_sensor_code: scaler.mas_sensor_code || '',
                version: scaler.version || '',
                is_active: scaler.is_active
            };
            this.$dispatch('open-modal', 'scaler-modal');
        },
        
        async deleteScaler(id) {
            const confirmed = await window.AdminUtils?.confirmDelete('Scaler ini akan dihapus beserta filenya. Lanjutkan?');
            
            if (confirmed) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/admin/scalers/${id}`;
                form.innerHTML = `
                    @csrf
                    @method('DELETE')
                `;
                document.body.appendChild(form);
                form.submit();
            }
        },
        
        async toggleStatus(id, currentStatus) {
            try {
                const response = await fetch(`/admin/scalers/${id}/toggle`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    window.AdminUtils?.toastSuccess(data.message || 'Status updated successfully');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    window.AdminUtils?.toastError('Failed to update status');
                }
            } catch (error) {
                window.AdminUtils?.toastError('Failed to update status');
            }
        }
    }
}
</script>
@endsection
