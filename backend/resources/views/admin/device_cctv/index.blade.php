@extends('layouts.admin')

@section('title', 'CCTV Configuration')

@section('content')
<div class="container-fluid px-4 py-6" x-data="cctvManager()">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">CCTV Configuration</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage device CCTV streams and monitoring</p>
        </div>
        <x-admin.button type="button" variant="primary" @click="openModal()">
            <i class="fas fa-plus mr-2"></i>
            Add CCTV
        </x-admin.button>
    </div>

    <!-- Filters -->
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari',
                'placeholder' => 'Cari CCTV...'
            ],
            [
                'type' => 'select',
                'name' => 'status',
                'label' => 'Status',
                'empty_option' => 'Semua Status',
                'options' => [
                    ['value' => 'online', 'label' => 'Online'],
                    ['value' => 'offline', 'label' => 'Offline'],
                    ['value' => 'error', 'label' => 'Error'],
                    ['value' => 'unknown', 'label' => 'Unknown']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'stream_type',
                'label' => 'Stream Type',
                'empty_option' => 'Semua Stream Type',
                'options' => [
                    ['value' => 'rtsp', 'label' => 'RTSP'],
                    ['value' => 'hls', 'label' => 'HLS'],
                    ['value' => 'mjpeg', 'label' => 'MJPEG'],
                    ['value' => 'webrtc', 'label' => 'WebRTC'],
                    ['value' => 'youtube', 'label' => 'YouTube'],
                    ['value' => 'other', 'label' => 'Other']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'is_active',
                'label' => 'Active Status',
                'empty_option' => 'Semua Status',
                'options' => [
                    ['value' => '1', 'label' => 'Aktif'],
                    ['value' => '0', 'label' => 'Non-aktif']
                ]
            ]
        ];
    @endphp

    <x-filter-bar 
        title="Filter & Pencarian CCTV"
        :filters="$filterConfig"
        :action="route('admin.device-cctv.index')"
        gridCols="md:grid-cols-4"
    />

    <!-- CCTV Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template x-for="cctv in filteredCctvs" :key="cctv.id">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <!-- CCTV Preview/Placeholder -->
                <div class="relative bg-gray-900 aspect-video flex items-center justify-center">
                    <i class="fas fa-video text-6xl text-gray-600"></i>
                    <div class="absolute top-2 right-2 flex space-x-2">
                        <span :class="cctv.status === 'online' ? 'bg-green-500' : cctv.status === 'offline' ? 'bg-gray-500' : cctv.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'"
                            class="px-2 py-1 text-xs font-medium text-white rounded-full">
                            <span x-text="cctv.status.toUpperCase()"></span>
                        </span>
                        <span :class="cctv.is_active ? 'bg-blue-500' : 'bg-gray-500'"
                            class="px-2 py-1 text-xs font-medium text-white rounded-full">
                            <span x-text="cctv.is_active ? 'Active' : 'Inactive'"></span>
                        </span>
                    </div>
                </div>

                <!-- CCTV Info -->
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2" x-text="cctv.device?.name || 'Unknown Device'"></h3>
                    
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-code w-5"></i>
                            <span x-text="cctv.device?.code"></span>
                        </div>
                        <div class="flex items-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-stream w-5"></i>
                            <span x-text="cctv.stream_type.toUpperCase()"></span>
                        </div>
                        <div class="flex items-center text-gray-600 dark:text-gray-400">
                            <i class="fas fa-link w-5"></i>
                            <span class="truncate" x-text="cctv.cctv_url"></span>
                        </div>
                        <div class="flex items-center text-gray-600 dark:text-gray-400" x-show="cctv.last_check">
                            <i class="fas fa-clock w-5"></i>
                            <span x-text="'Last check: ' + formatDate(cctv.last_check)"></span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="mt-4 flex space-x-2">
                        <x-admin.button type="button" variant="secondary" size="sm" @click="testConnection(cctv.id)" class="flex-1">
                            <i class="fas fa-plug mr-1"></i>
                            Test
                        </x-admin.button>
                        <x-admin.button type="button" variant="primary" size="sm" @click="editCctv(cctv)" class="flex-1">
                            <i class="fas fa-edit mr-1"></i>
                            Edit
                        </x-admin.button>
                        <x-admin.button type="button" variant="danger" size="sm" @click="deleteCctv(cctv.id)">
                            <i class="fas fa-trash"></i>
                        </x-admin.button>
                    </div>
                </div>
            </div>
        </template>
    </div>

    <!-- Empty State -->
    <div x-show="filteredCctvs.length === 0" class="text-center py-12">
        <i class="fas fa-video text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No CCTV Configurations</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">Add your first CCTV configuration to get started</p>
        <x-admin.button type="button" variant="primary" @click="openModal()">
            <i class="fas fa-plus mr-2"></i>
            Add CCTV
        </x-admin.button>
    </div>

    <!-- Create/Edit Modal -->
    <x-admin.modal 
        size="lg"
        name="cctv-modal">
        <x-slot name="title">
            <span x-text="editingCctv ? 'Edit CCTV Configuration' : 'Add CCTV Configuration'"></span>
        </x-slot>
        
        <form @submit.prevent="saveCctv">
            <div class="space-y-4">
                <!-- Device -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Device <span class="text-red-500">*</span>
                    </label>
                    <select x-model="form.mas_device_code" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Device</option>
                        <template x-for="device in devices" :key="device.code">
                            <option :value="device.code" x-text="device.name + ' (' + device.code + ')'"></option>
                        </template>
                    </select>
                </div>

                <!-- CCTV URL -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CCTV URL <span class="text-red-500">*</span>
                    </label>
                    <input type="text" x-model="form.cctv_url" required
                        placeholder="rtsp://example.com/stream"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <!-- Stream Type -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Stream Type <span class="text-red-500">*</span>
                    </label>
                    <select x-model="form.stream_type" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="rtsp">RTSP</option>
                        <option value="hls">HLS</option>
                        <option value="mjpeg">MJPEG</option>
                        <option value="webrtc">WebRTC</option>
                        <option value="youtube">YouTube</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <!-- Credentials -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username
                        </label>
                        <input type="text" x-model="form.username"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input type="password" x-model="form.password"
                            placeholder="Leave empty to keep current"
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <!-- Status -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status <span class="text-red-500">*</span>
                    </label>
                    <select x-model="form.status" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="error">Error</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea x-model="form.description" rows="3"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <!-- Active -->
                <div class="flex items-center">
                    <input type="checkbox" x-model="form.is_active" id="is_active"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <label for="is_active" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Active
                    </label>
                </div>
            </div>

            <x-slot name="footer">
                <x-admin.button type="button" variant="secondary" @click="$dispatch('close-modal', 'cctv-modal')">
                    Cancel
                </x-admin.button>
                <x-admin.button type="submit" variant="primary">
                    <span x-text="editingCctv ? 'Update' : 'Create'"></span>
                </x-admin.button>
            </x-slot>
        </form>
    </x-admin.modal>
</div>

<script>
function cctvManager() {
    return {
        cctvs: @json($cctvs->items()),
        devices: @json($devices),
        editingCctv: null,
        filters: {
            search: '',
            status: '',
            stream_type: '',
            is_active: ''
        },
        form: {
            mas_device_code: '',
            cctv_url: '',
            stream_type: 'rtsp',
            username: '',
            password: '',
            status: 'unknown',
            description: '',
            is_active: true
        },
        
        get filteredCctvs() {
            // Use server-side filtered data from pagination if available
            return this.cctvs.filter(cctv => {
                if (this.filters.search && !cctv.device?.name.toLowerCase().includes(this.filters.search.toLowerCase()) && 
                    !cctv.cctv_url.toLowerCase().includes(this.filters.search.toLowerCase())) {
                    return false;
                }
                if (this.filters.status && cctv.status !== this.filters.status) return false;
                if (this.filters.stream_type && cctv.stream_type !== this.filters.stream_type) return false;
                if (this.filters.is_active !== '' && cctv.is_active != this.filters.is_active) return false;
                return true;
            });
        },
        
        applyFilters() {
            // For client-side filtering, this is reactive
            // If switching to server-side, this would reload the page with query params
        },
        
        openModal() {
            this.editingCctv = null;
            this.form = {
                mas_device_code: '',
                cctv_url: '',
                stream_type: 'rtsp',
                username: '',
                password: '',
                status: 'unknown',
                description: '',
                is_active: true
            };
            this.$dispatch('open-modal', 'cctv-modal');
        },
        
        editCctv(cctv) {
            this.editingCctv = cctv;
            this.form = {
                mas_device_code: cctv.mas_device_code,
                cctv_url: cctv.cctv_url,
                stream_type: cctv.stream_type,
                username: cctv.username || '',
                password: '',
                status: cctv.status,
                description: cctv.description || '',
                is_active: cctv.is_active
            };
            this.$dispatch('open-modal', 'cctv-modal');
        },
        
        async saveCctv() {
            try {
                const url = this.editingCctv 
                    ? `/admin/device-cctv/${this.editingCctv.id}`
                    : '/admin/device-cctv';
                const method = this.editingCctv ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify(this.form)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    window.AdminUtils?.toastSuccess(data.message);
                    this.$dispatch('close-modal', 'cctv-modal');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    window.AdminUtils?.toastError(data.message || 'Failed to save CCTV configuration');
                }
            } catch (error) {
                window.AdminUtils?.toastError('Failed to save CCTV configuration');
            }
        },
        
        async deleteCctv(id) {
            const confirmed = await window.AdminUtils?.confirmDelete('Konfigurasi CCTV ini akan dihapus. Lanjutkan?');
            
            if (confirmed) {
                try {
                    const response = await fetch(`/admin/device-cctv/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        window.AdminUtils?.toastSuccess(data.message || 'CCTV configuration deleted successfully');
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        window.AdminUtils?.toastError(data.message || 'Failed to delete CCTV configuration');
                    }
                } catch (error) {
                    window.AdminUtils?.toastError('Failed to delete CCTV configuration');
                }
            }
        },
        
        async testConnection(id) {
            try {
                const response = await fetch(`/admin/device-cctv/${id}/test`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    window.AdminUtils?.toastInfo(data.message || 'Connection test initiated');
                } else {
                    window.AdminUtils?.toastError(data.message || 'Failed to test connection');
                }
            } catch (error) {
                window.AdminUtils?.toastError('Failed to test connection');
            }
        },
        
        applyFilters() {
            // Filters are reactive, no action needed
        },
        
        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleString();
        }
    }
}
</script>
@endsection

