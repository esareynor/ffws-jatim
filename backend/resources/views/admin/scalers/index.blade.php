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
        <button @click="openCreateModal()" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Add Scaler
        </button>
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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <form method="GET" class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search scalers..."
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
            
            <select name="technique" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Techniques</option>
                <option value="standard" {{ request('technique') == 'standard' ? 'selected' : '' }}>Standard</option>
                <option value="minmax" {{ request('technique') == 'minmax' ? 'selected' : '' }}>MinMax</option>
                <option value="robust" {{ request('technique') == 'robust' ? 'selected' : '' }}>Robust</option>
                <option value="custom" {{ request('technique') == 'custom' ? 'selected' : '' }}>Custom</option>
            </select>

            <select name="axis" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Axes</option>
                <option value="x" {{ request('axis') == 'x' ? 'selected' : '' }}>Input (X)</option>
                <option value="y" {{ request('axis') == 'y' ? 'selected' : '' }}>Output (Y)</option>
            </select>

            <select name="status" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Status</option>
                <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>Active</option>
                <option value="inactive" {{ request('status') == 'inactive' ? 'selected' : '' }}>Inactive</option>
            </select>

            <button type="submit" class="btn btn-primary">
                <i class="fas fa-search mr-2"></i>
                Filter
            </button>
        </form>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Code</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Technique</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Axis</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Model</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sensor</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    @forelse($scalers as $scaler)
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-mono text-gray-900 dark:text-white">{{ $scaler->code }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm text-gray-900 dark:text-white">{{ $scaler->name }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {{ $scaler->technique_label }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 py-1 text-xs rounded-full {{ $scaler->io_axis == 'x' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }}">
                                {{ $scaler->axis_label }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ $scaler->model->name ?? '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ $scaler->sensor->description ?? '-' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button @click="toggleStatus({{ $scaler->id }}, {{ $scaler->is_active ? 'true' : 'false' }})"
                                class="px-2 py-1 text-xs rounded-full {{ $scaler->is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }}">
                                {{ $scaler->status_label }}
                            </button>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a href="{{ route('admin.scalers.download', $scaler->id) }}" class="text-green-600 hover:text-green-900 mr-3" title="Download">
                                <i class="fas fa-download"></i>
                            </a>
                            <button @click="editScaler({{ json_encode($scaler) }})" class="text-blue-600 hover:text-blue-900 mr-3">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button @click="deleteScaler({{ $scaler->id }})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="8" class="px-6 py-12 text-center">
                            <i class="fas fa-sliders-h text-5xl text-gray-300 mb-4"></i>
                            <p class="text-gray-500">No scalers found</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {{ $scalers->links() }}
        </div>
    </div>

    <!-- Create/Edit Modal -->
    <div x-show="showModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <span x-text="editingId ? 'Edit Scaler' : 'Add Scaler'"></span>
                </h3>
                
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

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showModal = false" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <span x-text="editingId ? 'Update' : 'Create'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function scalerManager() {
    return {
        showModal: false,
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
            this.showModal = true;
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
            this.showModal = true;
        },
        
        async deleteScaler(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will delete the scaler and its file",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
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
                    Swal.fire('Success', data.message, 'success').then(() => location.reload());
                } else {
                    Swal.fire('Error', 'Failed to update status', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to update status', 'error');
            }
        }
    }
}
</script>
@endsection
