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
        <x-admin.button type="button" variant="primary" @click="openModal()">
            <i class="fas fa-plus mr-2"></i>
            Add User Role
        </x-admin.button>
    </div>

    <!-- Filters -->
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari',
                'placeholder' => 'Cari berdasarkan phone number, bio, atau UPT...'
            ],
            [
                'type' => 'select',
                'name' => 'role',
                'label' => 'Role',
                'empty_option' => 'Semua Role',
                'options' => [
                    ['value' => 'admin', 'label' => 'Admin'],
                    ['value' => 'moderator', 'label' => 'Moderator'],
                    ['value' => 'user', 'label' => 'User']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'status',
                'label' => 'Status',
                'empty_option' => 'Semua Status',
                'options' => [
                    ['value' => 'active', 'label' => 'Aktif'],
                    ['value' => 'inactive', 'label' => 'Non-aktif'],
                    ['value' => 'pending', 'label' => 'Pending']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'upt_code',
                'label' => 'UPT',
                'empty_option' => 'Semua UPT',
                'options' => $upts->map(function($upt) {
                    return ['value' => $upt->code, 'label' => $upt->name];
                })->toArray()
            ]
        ];
    @endphp

    <x-filter-bar 
        title="Filter & Pencarian User Roles"
        :filters="$filterConfig"
        :action="route('admin.user-by-role.index')"
        gridCols="md:grid-cols-4"
    />

    <!-- User Roles Table -->
    <x-table
        title="Daftar User Roles"
        :headers="$tableHeaders"
        :rows="$userRoles"
        searchable
        searchPlaceholder="Cari user roles..."
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openModal()">
                <i class="fas fa-plus mr-2"></i>
                Add User Role
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    <!-- Modal -->
    <x-admin.modal 
        size="lg"
        name="user-role-modal">
        <x-slot name="title">
            <span x-text="editingUserRole ? 'Edit User Role' : 'Add User Role'"></span>
        </x-slot>
        
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

            <x-slot name="footer">
                <x-admin.button type="button" variant="secondary" @click="$dispatch('close-modal', 'user-role-modal')">
                    Cancel
                </x-admin.button>
                <x-admin.button type="submit" variant="primary">
                    <span x-text="editingUserRole ? 'Update' : 'Create'"></span>
                </x-admin.button>
            </x-slot>
        </form>
    </x-admin.modal>
</div>

<script>
function userRoleManager() {
    return {
        userRoles: @json($userRoles->items()),
        upts: @json($upts),
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
            this.$dispatch('open-modal', 'user-role-modal');
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
            this.$dispatch('open-modal', 'user-role-modal');
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
                    window.AdminUtils?.toastSuccess(data.message || 'User role saved successfully');
                    this.$dispatch('close-modal', 'user-role-modal');
                    setTimeout(() => location.reload(), 1000);
                } else {
                    window.AdminUtils?.toastError(data.message || 'Failed to save user role');
                }
            } catch (error) {
                window.AdminUtils?.toastError('Failed to save user role');
            }
        },
        
        async deleteUserRole(id) {
            const confirmed = await window.AdminUtils?.confirmDelete('User role ini akan dihapus. Lanjutkan?');
            
            if (confirmed) {
                try {
                    const response = await fetch(`/admin/user-by-role/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        window.AdminUtils?.toastSuccess(data.message || 'User role deleted successfully');
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        window.AdminUtils?.toastError(data.message || 'Failed to delete user role');
                    }
                } catch (error) {
                    window.AdminUtils?.toastError('Failed to delete user role');
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

