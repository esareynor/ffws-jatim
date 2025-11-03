@extends('layouts.admin')

@section('title', $title)

@section('content')
<div class="container-fluid px-4 py-6" x-data="masterDataManager('{{ $endpoint }}', '{{ $singular }}', '{{ $plural }}', {{ json_encode($fields) }})">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $title }}</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $description }}</p>
        </div>
        <button @click="openModal()" class="btn btn-primary">
            <i class="fas fa-plus mr-2"></i>
            Add {{ $singular }}
        </button>
    </div>

    <!-- Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <input type="text" x-model="search" @input="applySearch" placeholder="Search {{ strtolower($plural) }}..."
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        @foreach($fields as $field)
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            {{ $field['label'] }}
                        </th>
                        @endforeach
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <template x-for="item in filteredItems" :key="item.id">
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            @foreach($fields as $field)
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm text-gray-900 dark:text-white" 
                                      :class="{ 'font-mono': '{{ $field['name'] }}' === 'code' }"
                                      x-text="item.{{ $field['name'] }}"></span>
                            </td>
                            @endforeach
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button @click="editItem(item)" class="text-blue-600 hover:text-blue-900 mr-3">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Empty State -->
        <div x-show="filteredItems.length === 0" class="text-center py-12">
            <i class="fas fa-list text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No {{ $plural }}</h3>
            <p class="text-gray-500">No {{ strtolower($plural) }} found</p>
        </div>
    </div>

    <!-- Modal -->
    <div x-show="showModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    <span x-text="editingItem ? 'Edit {{ $singular }}' : 'Add {{ $singular }}'"></span>
                </h3>
                
                <form @submit.prevent="saveItem">
                    <div class="space-y-4">
                        <template x-for="field in fields" :key="field.name">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <span x-text="field.label"></span>
                                    <span class="text-red-500" x-show="field.required">*</span>
                                </label>
                                <input :type="field.type || 'text'" 
                                       x-model="form[field.name]" 
                                       :required="field.required"
                                       :placeholder="field.placeholder || ''"
                                       class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                            </div>
                        </template>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showModal = false" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <span x-text="editingItem ? 'Update' : 'Create'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function masterDataManager(endpoint, singular, plural, fields) {
    return {
        endpoint: endpoint,
        fields: fields,
        items: @json($items ?? []),
        showModal: false,
        editingItem: null,
        search: '',
        form: {},
        
        init() {
            // Initialize form with empty values
            this.fields.forEach(field => {
                this.form[field.name] = '';
            });
        },
        
        get filteredItems() {
            if (!this.search) return this.items;
            const searchLower = this.search.toLowerCase();
            return this.items.filter(item => {
                return this.fields.some(field => {
                    const value = item[field.name];
                    return value && value.toString().toLowerCase().includes(searchLower);
                });
            });
        },
        
        openModal() {
            this.editingItem = null;
            this.fields.forEach(field => {
                this.form[field.name] = '';
            });
            this.showModal = true;
        },
        
        editItem(item) {
            this.editingItem = item;
            this.fields.forEach(field => {
                this.form[field.name] = item[field.name] || '';
            });
            this.showModal = true;
        },
        
        async saveItem() {
            try {
                const url = this.editingItem 
                    ? `/api/admin/${this.endpoint}/${this.editingItem.id}`
                    : `/api/admin/${this.endpoint}`;
                const method = this.editingItem ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(this.form)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    Swal.fire('Success', data.message || 'Saved successfully', 'success');
                    this.showModal = false;
                    location.reload();
                } else {
                    Swal.fire('Error', data.message || 'Failed to save', 'error');
                }
            } catch (error) {
                console.error('Save error:', error);
                Swal.fire('Error', 'Failed to save data', 'error');
            }
        },
        
        async deleteItem(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This action cannot be undone",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/admin/${this.endpoint}/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                            'Accept': 'application/json'
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        Swal.fire('Deleted!', data.message || 'Deleted successfully', 'success');
                        location.reload();
                    } else {
                        Swal.fire('Error', data.message || 'Failed to delete', 'error');
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    Swal.fire('Error', 'Failed to delete data', 'error');
                }
            }
        },
        
        applySearch() {},
    }
}
</script>
@endsection

