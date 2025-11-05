@extends('layouts.admin')

@section('title', 'Sensor Values')
@section('page-title', 'Sensor Values Management')
@section('page-description', 'Manage sensor display values and metadata')

@section('content')
<div class="space-y-6">
    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-sm p-6">
        <form method="GET" action="{{ route('admin.sensor-values.index') }}" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input type="text" name="search" value="{{ request('search') }}"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by name or sensor code...">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select name="status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Status</option>
                    <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>Active</option>
                    <option value="inactive" {{ request('status') == 'inactive' ? 'selected' : '' }}>Inactive</option>
                    <option value="fault" {{ request('status') == 'fault' ? 'selected' : '' }}>Fault</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sensor</label>
                <select name="sensor_code" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Sensors</option>
                    @foreach($sensors as $sensor)
                        <option value="{{ $sensor->code }}" {{ request('sensor_code') == $sensor->code ? 'selected' : '' }}>
                            {{ $sensor->code }} ({{ $sensor->parameter }})
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="flex items-end space-x-2">
                <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <i class="fa-solid fa-search mr-2"></i>Filter
                </button>
                <a href="{{ route('admin.sensor-values.index') }}" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    <i class="fa-solid fa-redo mr-2"></i>Reset
                </a>
            </div>
        </form>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Sensor Values List</h3>
            <button type="button" onclick="openCreateModal()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <i class="fa-solid fa-plus mr-2"></i>Add Sensor Value
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensor Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sensor Code</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($sensorValues as $value)
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    @if($value->sensor_icon_path)
                                        <img src="{{ asset('storage/' . $value->sensor_icon_path) }}" class="h-8 w-8 rounded mr-3" alt="Icon">
                                    @else
                                        <div class="h-8 w-8 rounded bg-gray-200 flex items-center justify-center mr-3">
                                            <i class="fa-solid fa-sensor text-gray-400"></i>
                                        </div>
                                    @endif
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">{{ $value->sensor_name ?? 'N/A' }}</div>
                                        @if($value->is_active)
                                            <span class="text-xs text-green-600">Active</span>
                                        @else
                                            <span class="text-xs text-gray-500">Inactive</span>
                                        @endif
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {{ $value->mas_sensor_code }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                @if($value->sensorParameter)
                                    {{ $value->sensorParameter->name }}
                                @else
                                    <span class="text-gray-400">-</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {{ $value->sensor_unit ?? '-' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                @if($value->status == 'active')
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                @elseif($value->status == 'inactive')
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>
                                @else
                                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Fault</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ $value->last_seen ? $value->last_seen->diffForHumans() : 'Never' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <button onclick="viewDetail({{ $value->id }})" class="text-blue-600 hover:text-blue-900 mx-1">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                                <button onclick="editValue({{ $value->id }})" class="text-yellow-600 hover:text-yellow-900 mx-1">
                                    <i class="fa-solid fa-edit"></i>
                                </button>
                                <button onclick="deleteValue({{ $value->id }})" class="text-red-600 hover:text-red-900 mx-1">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                                <i class="fa-solid fa-inbox text-4xl mb-3 text-gray-300"></i>
                                <p>No sensor values found.</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="px-6 py-4 border-t border-gray-200">
            {{ $sensorValues->links() }}
        </div>
    </div>
</div>

<!-- Create/Edit Modal -->
<div id="valueModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white">
        <div class="flex justify-between items-center pb-3 border-b">
            <h3 id="modalTitle" class="text-xl font-semibold text-gray-900">Add Sensor Value</h3>
            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                <i class="fa-solid fa-times text-xl"></i>
            </button>
        </div>
        <form id="valueForm" class="mt-4 space-y-4" enctype="multipart/form-data">
            @csrf
            <input type="hidden" id="valueId" name="id">
            <input type="hidden" id="formMethod" value="POST">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sensor Code <span class="text-red-500">*</span></label>
                    <select id="mas_sensor_code" name="mas_sensor_code" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Sensor</option>
                        @foreach($sensors as $sensor)
                            <option value="{{ $sensor->code }}">{{ $sensor->code }} ({{ $sensor->parameter }})</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sensor Parameter <span class="text-red-500">*</span></label>
                    <select id="mas_sensor_parameter_code" name="mas_sensor_parameter_code" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Parameter</option>
                        @foreach($parameters as $param)
                            <option value="{{ $param->code }}">{{ $param->name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sensor Name</label>
                    <input type="text" id="sensor_name" name="sensor_name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Display name">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <input type="text" id="sensor_unit" name="sensor_unit" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., m, mm, °C">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status <span class="text-red-500">*</span></label>
                    <select id="status" name="status" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="fault">Fault</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Threshold Template</label>
                    <select id="mas_sensor_threshold_code" name="mas_sensor_threshold_code" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">None</option>
                        @foreach($thresholds as $threshold)
                            <option value="{{ $threshold->code }}">{{ $threshold->name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea id="sensor_description" name="sensor_description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Sensor description..."></textarea>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sensor Icon</label>
                <input type="file" id="sensor_icon" name="sensor_icon" accept="image/*" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <small class="text-gray-500">Max 2MB (JPEG, PNG, SVG)</small>
            </div>

            <div class="flex items-center">
                <input type="checkbox" id="is_active" name="is_active" value="1" checked class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <label for="is_active" class="ml-2 block text-sm text-gray-700">
                    Is Active
                </label>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Cancel
                </button>
                <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <i class="fa-solid fa-save mr-2"></i>Save
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Add Sensor Value';
    document.getElementById('valueForm').reset();
    document.getElementById('valueId').value = '';
    document.getElementById('formMethod').value = 'POST';
    document.getElementById('is_active').checked = true;
    document.getElementById('valueModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('valueModal').classList.add('hidden');
}

function editValue(id) {
    fetch(`/admin/sensor-values/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const value = data.data;
                document.getElementById('modalTitle').textContent = 'Edit Sensor Value';
                document.getElementById('valueId').value = value.id;
                document.getElementById('formMethod').value = 'PUT';
                document.getElementById('mas_sensor_code').value = value.mas_sensor_code;
                document.getElementById('mas_sensor_parameter_code').value = value.mas_sensor_parameter_code;
                document.getElementById('mas_sensor_threshold_code').value = value.mas_sensor_threshold_code || '';
                document.getElementById('sensor_name').value = value.sensor_name || '';
                document.getElementById('sensor_unit').value = value.sensor_unit || '';
                document.getElementById('sensor_description').value = value.sensor_description || '';
                document.getElementById('status').value = value.status;
                document.getElementById('is_active').checked = value.is_active;
                document.getElementById('valueModal').classList.remove('hidden');
            }
        });
}

function viewDetail(id) {
    fetch(`/admin/sensor-values/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const value = data.data;
                const statusBadge = value.status === 'active' ? '<span class="badge bg-success">Active</span>' :
                                   value.status === 'inactive' ? '<span class="badge bg-secondary">Inactive</span>' :
                                   '<span class="badge bg-danger">Fault</span>';
                Swal.fire({
                    title: 'Sensor Value Details',
                    html: `
                        <div class="text-left space-y-2">
                            <p><strong>Sensor Name:</strong> ${value.sensor_name || 'N/A'}</p>
                            <p><strong>Sensor Code:</strong> ${value.mas_sensor_code}</p>
                            <p><strong>Parameter:</strong> ${value.sensor_parameter?.name || 'N/A'}</p>
                            <p><strong>Unit:</strong> ${value.sensor_unit || 'N/A'}</p>
                            <p><strong>Status:</strong> ${statusBadge}</p>
                            <p><strong>Description:</strong> ${value.sensor_description || 'N/A'}</p>
                            <p><strong>Last Seen:</strong> ${value.last_seen || 'Never'}</p>
                            <p><strong>Is Active:</strong> ${value.is_active ? 'Yes' : 'No'}</p>
                        </div>
                    `,
                    icon: 'info',
                    width: 600
                });
            }
        });
}

function deleteValue(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/admin/sensor-values/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Deleted!', data.message, 'success')
                        .then(() => location.reload());
                } else {
                    Swal.fire('Error!', data.message, 'error');
                }
            });
        }
    });
}

document.getElementById('valueForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const id = document.getElementById('valueId').value;
    const method = document.getElementById('formMethod').value;
    const url = id ? `/admin/sensor-values/${id}` : '/admin/sensor-values';

    // Handle checkbox
    if (!document.getElementById('is_active').checked) {
        formData.set('is_active', '0');
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}',
            'Accept': 'application/json',
            'X-HTTP-Method-Override': method
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire('Success!', data.message, 'success')
                .then(() => location.reload());
        } else {
            Swal.fire('Error!', data.message || 'Something went wrong', 'error');
        }
    })
    .catch(error => {
        Swal.fire('Error!', 'Failed to save data', 'error');
    });
});
</script>
@endpush
@endsection
