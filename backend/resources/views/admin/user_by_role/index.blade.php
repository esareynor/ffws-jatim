@extends('layouts.admin')

@section('title', 'User Role Management')

@section('content')
<div class="container-fluid px-4 py-6" x-data="userRoleManager()">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Role Management</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage user roles and UPT assignments</p>
        </div>
        <button @click="openModal()" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Add User Role
        </button>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" x-model="filters.search" @input="applyFilters" placeholder="Search..."
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
            
            <select x-model="filters.role" @change="applyFilters"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
            </select>

            <select x-model="filters.status" @change="applyFilters"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
            </select>

            <select x-model="filters.upt_code" @change="applyFilters"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All UPTs</option>
                <template x-for="upt in upts" :key="upt.code">
                    <option :value="upt.code" x-text="upt.name"></option>
                </template>
            </select>
        </div>
    </div>

    <!-- User Roles Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Phone Number
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            UPT
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Role
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Bio
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <template x-for="userRole in filteredUserRoles" :key="userRole.id">
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <i class="fas fa-phone text-gray-400 mr-2"></i>
                                    <span class="text-sm text-gray-900 dark:text-white" x-text="userRole.phone_number || '-'"></span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white" x-text="userRole.upt?.name || '-'"></div>
                                <div class="text-xs text-gray-500" x-text="userRole.upt?.code || '-'"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="{
                                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': userRole.role === 'admin',
                                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': userRole.role === 'moderator',
                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': userRole.role === 'user'
                                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    <span x-text="userRole.role.charAt(0).toUpperCase() + userRole.role.slice(1)"></span>
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="{
                                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': userRole.status === 'active',
                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': userRole.status === 'inactive',
                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': userRole.status === 'pending'
                                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                    <span x-text="userRole.status.charAt(0).toUpperCase() + userRole.status.slice(1)"></span>
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" x-text="userRole.bio || '-'"></div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="editUserRole(userRole)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button @click="deleteUserRole(userRole.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Empty State -->
        <div x-show="filteredUserRoles.length === 0" class="text-center py-12">
            <i class="fas fa-user-tag text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No User Roles</h3>
            <p class="text-gray-500 dark:text-gray-400">No user roles found matching your criteria</p>
        </div>
    </div>

    <!-- Modal -->
    <div x-show="showModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <span x-text="editingUserRole ? 'Edit User Role' : 'Add User Role'"></span>
                </h3>
                
                <form @submit.prevent="saveUserRole">
                    <div class="space-y-4">
                        <!-- Phone Number -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Phone Number
                            </label>
                            <input type="text" x-model="form.phone_number"
                                placeholder="+62..."
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- UPT -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                UPT
                            </label>
                            <select x-model="form.upt_code"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select UPT</option>
                                <template x-for="upt in upts" :key="upt.code">
                                    <option :value="upt.code" x-text="upt.name + ' (' + upt.code + ')'"></option>
                                </template>
                            </select>
                        </div>

                        <!-- Role -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Role <span class="text-red-500">*</span>
                            </label>
                            <select x-model="form.role" required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status <span class="text-red-500">*</span>
                            </label>
                            <select x-model="form.status" required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        <!-- Bio -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Bio
                            </label>
                            <textarea x-model="form.bio" rows="3"
                                placeholder="User description or notes..."
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showModal = false" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <span x-text="editingUserRole ? 'Update' : 'Create'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function userRoleManager() {
    return {
        userRoles: @json($userRoles->items()),
        upts: @json($upts),
        showModal: false,
        editingUserRole: null,
        filters: {
            search: '',
            role: '',
            status: '',
            upt_code: ''
        },
        form: {
            phone_number: '',
            upt_code: '',
            role: 'user',
            status: 'active',
            bio: ''
        },
        
        get filteredUserRoles() {
            return this.userRoles.filter(userRole => {
                if (this.filters.search && 
                    !userRole.phone_number?.toLowerCase().includes(this.filters.search.toLowerCase()) &&
                    !userRole.bio?.toLowerCase().includes(this.filters.search.toLowerCase()) &&
                    !userRole.upt?.name.toLowerCase().includes(this.filters.search.toLowerCase())) {
                    return false;
                }
                if (this.filters.role && userRole.role !== this.filters.role) return false;
                if (this.filters.status && userRole.status !== this.filters.status) return false;
                if (this.filters.upt_code && userRole.upt_code !== this.filters.upt_code) return false;
                return true;
            });
        },
        
        openModal() {
            this.editingUserRole = null;
            this.form = {
                phone_number: '',
                upt_code: '',
                role: 'user',
                status: 'active',
                bio: ''
            };
            this.showModal = true;
        },
        
        editUserRole(userRole) {
            this.editingUserRole = userRole;
            this.form = {
                phone_number: userRole.phone_number || '',
                upt_code: userRole.upt_code || '',
                role: userRole.role,
                status: userRole.status,
                bio: userRole.bio || ''
            };
            this.showModal = true;
        },
        
        async saveUserRole() {
            try {
                const url = this.editingUserRole 
                    ? `/admin/user-by-role/${this.editingUserRole.id}`
                    : '/admin/user-by-role';
                const method = this.editingUserRole ? 'PUT' : 'POST';
                
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
                Swal.fire('Error', 'Failed to save user role', 'error');
            }
        },
        
        async deleteUserRole(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will delete the user role",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/admin/user-by-role/${id}`, {
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
                    Swal.fire('Error', 'Failed to delete user role', 'error');
                }
            }
        },
        
        applyFilters() {
            // Filters are reactive, no action needed
        }
    }
}
</script>
@endsection

