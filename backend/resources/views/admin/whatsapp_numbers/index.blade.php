@extends('layouts.admin')

@section('title', 'WhatsApp Notifications')

@section('content')
<div class="container-fluid px-4 py-6" x-data="whatsappManager()">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp Notification Management</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage WhatsApp numbers for flood warning notifications</p>
        </div>
        <button @click="openCreateModal()" class="btn btn-primary">
            <i class="fab fa-whatsapp mr-2"></i>
            Add Number
        </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-green-700 dark:text-green-300 mb-1">Active Numbers</p>
                    <p class="text-3xl font-bold text-green-900 dark:text-green-100">{{ $stats['active'] }}</p>
                </div>
                <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-3">
                    <i class="fab fa-whatsapp text-green-600 dark:text-green-400 text-2xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-blue-700 dark:text-blue-300 mb-1">Total Recipients</p>
                    <p class="text-3xl font-bold text-blue-900 dark:text-blue-100">{{ $stats['total'] }}</p>
                </div>
                <div class="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-3">
                    <i class="fas fa-users text-blue-600 dark:text-blue-400 text-2xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-6">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-700 dark:text-gray-300 mb-1">Inactive</p>
                    <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ $stats['inactive'] }}</p>
                </div>
                <div class="bg-gray-100 dark:bg-gray-900/40 rounded-lg p-3">
                    <i class="fas fa-ban text-gray-600 dark:text-gray-400 text-2xl"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <form method="GET" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search name or number..."
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
            
            <select name="status" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Status</option>
                <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>Active</option>
                <option value="inactive" {{ request('status') == 'inactive' ? 'selected' : '' }}>Inactive</option>
            </select>

            <select name="per_page" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="15" {{ request('per_page') == '15' ? 'selected' : '' }}>15 per page</option>
                <option value="25" {{ request('per_page') == '25' ? 'selected' : '' }}>25 per page</option>
                <option value="50" {{ request('per_page') == '50' ? 'selected' : '' }}>50 per page</option>
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone Number</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Added</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    @forelse($numbers as $number)
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-10 w-10">
                                    <div class="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                        <i class="fab fa-whatsapp text-green-600 dark:text-green-400"></i>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ $number->name }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-mono text-gray-900 dark:text-white">{{ $number->formatted_number }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <button @click="toggleStatus({{ $number->id }}, {{ $number->is_active ? 'true' : 'false' }})"
                                class="px-2 py-1 text-xs rounded-full {{ $number->is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' }}">
                                {{ $number->status_label }}
                            </button>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ $number->created_at->format('d M Y') }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button @click="testNumber({{ $number->id }})" class="text-green-600 hover:text-green-900 mr-3" title="Test">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                            <button @click="editNumber({{ json_encode($number) }})" class="text-blue-600 hover:text-blue-900 mr-3">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button @click="deleteNumber({{ $number->id }})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center">
                            <i class="fab fa-whatsapp text-5xl text-gray-300 mb-4"></i>
                            <p class="text-gray-500">No WhatsApp numbers configured</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {{ $numbers->links() }}
        </div>
    </div>

    <!-- Features Info -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                <i class="fas fa-bell mr-2"></i>
                Automatic Notifications
            </h4>
            <p class="text-sm text-blue-800 dark:text-blue-200">
                Send automatic flood warnings when water levels exceed thresholds
            </p>
        </div>

        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">
                <i class="fas fa-filter mr-2"></i>
                Filtered by Location
            </h4>
            <p class="text-sm text-green-800 dark:text-green-200">
                Recipients can be filtered by regency, village, or watershed
            </p>
        </div>
    </div>

    <!-- Create/Edit Modal -->
    <div x-show="showModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <span x-text="editingId ? 'Edit WhatsApp Number' : 'Add WhatsApp Number'"></span>
                </h3>
                
                <form :action="editingId ? '{{ url('admin/whatsapp-numbers') }}/' + editingId : '{{ route('admin.whatsapp-numbers.store') }}'" 
                      method="POST">
                    @csrf
                    <input type="hidden" name="_method" x-bind:value="editingId ? 'PUT' : 'POST'">
                    
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name <span class="text-red-500">*</span>
                            </label>
                            <input type="text" name="name" x-model="form.name" required
                                placeholder="e.g., Budi Santoso"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number <span class="text-red-500">*</span>
                            </label>
                            <input type="text" name="number" x-model="form.number" required
                                placeholder="e.g., 081234567890 or 6281234567890"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <p class="text-xs text-gray-500 mt-1">Indonesian format: 08xx or 628xx</p>
                        </div>

                        <div>
                            <label class="flex items-center">
                                <input type="checkbox" name="is_active" x-model="form.is_active" value="1" class="rounded">
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Active (will receive notifications)</span>
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
function whatsappManager() {
    return {
        showModal: false,
        editingId: null,
        form: {
            name: '',
            number: '',
            is_active: true
        },
        
        openCreateModal() {
            this.editingId = null;
            this.form = {
                name: '',
                number: '',
                is_active: true
            };
            this.showModal = true;
        },
        
        editNumber(number) {
            this.editingId = number.id;
            this.form = {
                name: number.name,
                number: number.number,
                is_active: number.is_active
            };
            this.showModal = true;
        },
        
        async deleteNumber(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This number will no longer receive notifications",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/admin/whatsapp-numbers/${id}`;
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
                const response = await fetch(`/admin/whatsapp-numbers/${id}/toggle`, {
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
        },
        
        async testNumber(id) {
            try {
                const response = await fetch(`/admin/whatsapp-numbers/${id}/test`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    Swal.fire('Test', data.message, 'info');
                } else {
                    Swal.fire('Error', 'Failed to test connection', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to test connection', 'error');
            }
        }
    }
}
</script>
@endsection
