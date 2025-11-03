@extends('layouts.admin')

@section('title', 'Sensor Parameters')

@section('content')
<div class="container-fluid px-4 py-6" x-data="parameterManager('sensor')">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sensor Parameters</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage sensor parameter types</p>
        </div>
        <button @click="openModal()" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Add Parameter
        </button>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <input type="text" x-model="search" @input="applySearch" placeholder="Search parameters..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
    </div>

    <!-- Parameters Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Code
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Created At
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <template x-for="param in filteredParameters" :key="param.id">
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm font-mono text-gray-900 dark:text-white" x-text="param.code"></span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm text-gray-900 dark:text-white" x-text="param.name"></span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <span x-text="formatDate(param.created_at)"></span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="editParameter(param)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button @click="deleteParameter(param.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Empty State -->
        <div x-show="filteredParameters.length === 0" class="text-center py-12">
            <i class="fas fa-list text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Parameters</h3>
            <p class="text-gray-500 dark:text-gray-400">No parameters found matching your criteria</p>
        </div>
    </div>

    <!-- Modal -->
    <div x-show="showModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <span x-text="editingParameter ? 'Edit Parameter' : 'Add Parameter'"></span>
                </h3>
                
                <form @submit.prevent="saveParameter">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Code <span class="text-red-500">*</span>
                            </label>
                            <input type="text" x-model="form.code" required
                                placeholder="e.g., WL, RF"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name <span class="text-red-500">*</span>
                            </label>
                            <input type="text" x-model="form.name" required
                                placeholder="e.g., Water Level, Rainfall"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showModal = false" class="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <span x-text="editingParameter ? 'Update' : 'Create'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function parameterManager(type) {
    return {
        type: type,
        parameters: @json($parameters->items()),
        showModal: false,
        editingParameter: null,
        search: '',
        form: {
            code: '',
            name: ''
        },
        
        get filteredParameters() {
            if (!this.search) return this.parameters;
            return this.parameters.filter(param => 
                param.code.toLowerCase().includes(this.search.toLowerCase()) ||
                param.name.toLowerCase().includes(this.search.toLowerCase())
            );
        },
        
        openModal() {
            this.editingParameter = null;
            this.form = { code: '', name: '' };
            this.showModal = true;
        },
        
        editParameter(param) {
            this.editingParameter = param;
            this.form = { code: param.code, name: param.name };
            this.showModal = true;
        },
        
        async saveParameter() {
            try {
                const url = this.editingParameter 
                    ? `/admin/${this.type}-parameters/${this.editingParameter.id}`
                    : `/admin/${this.type}-parameters`;
                const method = this.editingParameter ? 'PUT' : 'POST';
                
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
                Swal.fire('Error', 'Failed to save parameter', 'error');
            }
        },
        
        async deleteParameter(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will delete the parameter",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/admin/${this.type}-parameters/${id}`, {
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
                    Swal.fire('Error', 'Failed to delete parameter', 'error');
                }
            }
        },
        
        applySearch() {
            // Search is reactive
        },
        
        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleDateString();
        }
    }
}
</script>
@endsection

