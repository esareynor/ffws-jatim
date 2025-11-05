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
        <x-admin.button type="button" variant="primary" @click="openCreateModal()">
            <i class="fab fa-whatsapp mr-2"></i>
            Add Number
        </x-admin.button>
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
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari',
                'placeholder' => 'Cari nama atau nomor...'
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
            ],
            [
                'type' => 'select',
                'name' => 'per_page',
                'label' => 'Per Halaman',
                'options' => [
                    ['value' => '15', 'label' => '15'],
                    ['value' => '25', 'label' => '25'],
                    ['value' => '50', 'label' => '50']
                ]
            ]
        ];
    @endphp

    <x-filter-bar 
        title="Filter & Pencarian WhatsApp Numbers"
        :filters="$filterConfig"
        :action="route('admin.whatsapp-numbers.index')"
        gridCols="md:grid-cols-3"
    />

    <!-- Table -->
    <x-table
        title="Daftar WhatsApp Numbers"
        :headers="$tableHeaders"
        :rows="$numbers"
        searchable
        searchPlaceholder="Cari WhatsApp numbers..."
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreateModal()">
                <i class="fab fa-whatsapp mr-2"></i>
                Add Number
            </x-admin.button>
        </x-slot:actions>
    </x-table>

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
    <x-admin.modal 
        size="md"
        name="whatsapp-modal">
        <x-slot name="title">
            <span x-text="editingId ? 'Edit WhatsApp Number' : 'Add WhatsApp Number'"></span>
        </x-slot>
        
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

            <x-slot name="footer">
                <x-admin.button type="button" variant="secondary" @click="$dispatch('close-modal', 'whatsapp-modal')">Cancel</x-admin.button>
                <x-admin.button type="submit" variant="primary">
                    <span x-text="editingId ? 'Update' : 'Create'"></span>
                </x-admin.button>
            </x-slot>
        </form>
    </x-admin.modal>
</div>

<script>
function whatsappManager() {
    return {
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
            this.$dispatch('open-modal', 'whatsapp-modal');
        },
        
        editNumber(number) {
            this.editingId = number.id;
            this.form = {
                name: number.name,
                number: number.number,
                is_active: number.is_active
            };
            this.$dispatch('open-modal', 'whatsapp-modal');
        },
        
        async deleteNumber(id) {
            const confirmed = await window.AdminUtils?.confirmDelete('Nomor WhatsApp ini akan dihapus dan tidak akan menerima notifikasi lagi. Lanjutkan?');
            
            if (confirmed) {
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
                    window.AdminUtils?.toastSuccess(data.message || 'Status updated successfully');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    window.AdminUtils?.toastError(data.message || 'Failed to update status');
                }
            } catch (error) {
                window.AdminUtils?.toastError('Failed to update status');
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
                    window.AdminUtils?.toastInfo(data.message || 'Test connection initiated');
                } else {
                    window.AdminUtils?.toastError(data.message || 'Failed to test connection');
                }
            } catch (error) {
                window.AdminUtils?.toastError('Failed to test connection');
            }
        }
    }
}
</script>
@endsection
