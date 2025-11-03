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
        <button @click="openModal()" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Add CCTV
        </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" x-model="filters.search" @input="applyFilters" placeholder="Search..."
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
            
            <select x-model="filters.status" @change="applyFilters"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="error">Error</option>
                <option value="unknown">Unknown</option>
            </select>

            <select x-model="filters.stream_type" @change="applyFilters"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Stream Types</option>
                <option value="rtsp">RTSP</option>
                <option value="hls">HLS</option>
                <option value="mjpeg">MJPEG</option>
                <option value="webrtc">WebRTC</option>
                <option value="youtube">YouTube</option>
                <option value="other">Other</option>
            </select>

            <select x-model="filters.is_active" @change="applyFilters"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Active Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
            </select>
        </div>
    </div>

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
                        <button @click="testConnection(cctv.id)" class="flex-1 btn btn-sm btn-secondary">
                            <i class="fas fa-plug mr-1"></i>
                            Test
                        </button>
                        <button @click="editCctv(cctv)" class="flex-1 btn btn-sm btn-primary">
                            <i class="fas fa-edit mr-1"></i>
                            Edit
                        </button>
                        <button @click="deleteCctv(cctv.id)" class="btn btn-sm btn-danger">
                            <i class="fas fa-trash"></i>
                        </button>
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
        <button @click="openModal()" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Add CCTV
        </button>
    </div>

    <!-- Modal -->
    <div x-show="showModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <span x-text="editingCctv ? 'Edit CCTV Configuration' : 'Add CCTV Configuration'"></span>
                </h3>
                
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

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showModal = false" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <span x-text="editingCctv ? 'Update' : 'Create'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function cctvManager() {
    return {
        cctvs: @json($cctvs->items()),
        devices: @json($devices),
        showModal: false,
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
            this.showModal = true;
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
            this.showModal = true;
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
                    Swal.fire('Success', data.message, 'success');
                    this.showModal = false;
                    location.reload();
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to save CCTV configuration', 'error');
            }
        },
        
        async deleteCctv(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will delete the CCTV configuration",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/admin/device-cctv/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        Swal.fire('Deleted!', data.message, 'success');
                        location.reload();
                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete CCTV configuration', 'error');
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
                    Swal.fire('Testing', data.message, 'info');
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Failed to test connection', 'error');
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

