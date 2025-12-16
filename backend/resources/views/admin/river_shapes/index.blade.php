@extends('layouts.admin')

@section('title', 'River Shapes')
@section('page-title', 'River Shapes Management')
@section('page-description', 'Manage river shape data for sensors')

@section('content')
<div class="space-y-6">
    <!-- Filter Section -->
    <x-filter-bar 
        title="Filter & Pencarian River Shapes"
        :filters="$filterConfig"
        :action="route('admin.river-shapes.index')"
        gridCols="md:grid-cols-2"
    />

    <!-- Table Section -->
    <x-table
        title="Daftar River Shapes"
        :headers="$tableHeaders"
        :rows="$riverShapes"
        searchable
        searchPlaceholder="Cari river shapes..."
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" onclick="openCreateModal()">
                <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                Tambah River Shape
            </x-admin.button>
        </x-slot:actions>
    </x-table>
</div>

<!-- Create/Edit Modal -->
<div id="shapeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
        <div class="flex justify-between items-center pb-3 border-b">
            <h3 id="modalTitle" class="text-xl font-semibold text-gray-900">Add River Shape</h3>
            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                <i class="fa-solid fa-times text-xl"></i>
            </button>
        </div>
        <form id="shapeForm" class="mt-4 space-y-4">
            @csrf
            <input type="hidden" id="shapeId" name="id">
            <input type="hidden" id="formMethod" value="POST">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sensor Code <span class="text-red-500">*</span></label>
                    <select id="sensor_code" name="sensor_code" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Sensor</option>
                        @foreach($sensors as $sensor)
                            <option value="{{ $sensor->code }}">{{ $sensor->code }} ({{ $sensor->parameter }})</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Code</label>
                    <input type="text" id="code" name="code" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Auto-generated if empty">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">X Coordinate</label>
                    <input type="number" step="0.000001" id="x" name="x" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Y Coordinate</label>
                    <input type="number" step="0.000001" id="y" name="y" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Parameter A</label>
                    <input type="number" step="0.000001" id="a" name="a" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Parameter B</label>
                    <input type="number" step="0.000001" id="b" name="b" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Parameter C</label>
                    <input type="number" step="0.000001" id="c" name="c" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Array Codes (JSON)</label>
                <textarea id="array_codes" name="array_codes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder='["code1", "code2"]'></textarea>
                <small class="text-gray-500">Optional: JSON array of related codes</small>
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
    document.getElementById('modalTitle').textContent = 'Add River Shape';
    document.getElementById('shapeForm').reset();
    document.getElementById('shapeId').value = '';
    document.getElementById('formMethod').value = 'POST';
    document.getElementById('shapeModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('shapeModal').classList.add('hidden');
}

function editShape(id) {
    fetch(`/admin/river-shapes/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const shape = data.data;
                document.getElementById('modalTitle').textContent = 'Edit River Shape';
                document.getElementById('shapeId').value = shape.id;
                document.getElementById('formMethod').value = 'PUT';
                document.getElementById('sensor_code').value = shape.sensor_code;
                document.getElementById('code').value = shape.code || '';
                document.getElementById('x').value = shape.x || '';
                document.getElementById('y').value = shape.y || '';
                document.getElementById('a').value = shape.a || '';
                document.getElementById('b').value = shape.b || '';
                document.getElementById('c').value = shape.c || '';
                document.getElementById('array_codes').value = shape.array_codes ? JSON.stringify(shape.array_codes) : '';
                document.getElementById('shapeModal').classList.remove('hidden');
            }
        });
}

function viewDetail(id) {
    fetch(`/admin/river-shapes/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const shape = data.data;
                Swal.fire({
                    title: 'River Shape Details',
                    html: `
                        <div class="text-left space-y-2">
                            <p><strong>Code:</strong> ${shape.code || 'N/A'}</p>
                            <p><strong>Sensor:</strong> ${shape.sensor_code}</p>
                            <p><strong>X:</strong> ${shape.x || 'N/A'}</p>
                            <p><strong>Y:</strong> ${shape.y || 'N/A'}</p>
                            <p><strong>A:</strong> ${shape.a || 'N/A'}</p>
                            <p><strong>B:</strong> ${shape.b || 'N/A'}</p>
                            <p><strong>C:</strong> ${shape.c || 'N/A'}</p>
                            <p><strong>Array Codes:</strong> ${shape.array_codes ? JSON.stringify(shape.array_codes) : 'N/A'}</p>
                        </div>
                    `,
                    icon: 'info',
                    width: 600
                });
            }
        });
}

function deleteShape(id) {
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
            fetch(`/admin/river-shapes/${id}`, {
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

document.getElementById('shapeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const id = document.getElementById('shapeId').value;
    const method = document.getElementById('formMethod').value;
    const url = id ? `/admin/river-shapes/${id}` : '/admin/river-shapes';

    const data = {};
    formData.forEach((value, key) => {
        if (key !== 'id' && value) data[key] = value;
    });

    fetch(url, {
        method: method === 'PUT' ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': '{{ csrf_token() }}',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
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
