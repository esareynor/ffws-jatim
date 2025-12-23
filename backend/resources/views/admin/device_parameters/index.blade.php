@extends('layouts.admin')

@section('title', 'Device Parameters')

@section('content')
<div class="container-fluid px-4 py-6" x-data="parameterManager('device')">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Device Parameters</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage device parameter types</p>
        </div>
        <x-admin.button type="button" variant="primary" @click="openModal()">
            <i class="fas fa-plus mr-2"></i>
            Add Parameter
        </x-admin.button>
    </div>

    <!-- Table -->
    <x-table
        title="Daftar Device Parameters"
        :headers="$tableHeaders"
        :rows="$parameters"
        searchable
        searchPlaceholder="Cari device parameters..."
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openModal()">
                <i class="fas fa-plus mr-2"></i>
                Add Parameter
            </x-admin.button>
        </x-slot:actions>
    </x-table>

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
                                placeholder="e.g., ARR, TMA"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name <span class="text-red-500">*</span>
                            </label>
                            <select x-model="form.name" required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                                <option value="">Pilih Tipe Parameter</option>
                                @foreach($parameterOptions as $key => $value)
                                    <option value="{{ $key }}">{{ $value }}</option>
                                @endforeach
                            </select>
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

            <x-slot name="footer">
                <x-admin.button type="button" variant="secondary" @click="$dispatch('close-modal', 'parameter-modal')">
                    Cancel
                </x-admin.button>
                <x-admin.button type="submit" variant="primary">
                    <span x-text="editingParameter ? 'Update' : 'Create'"></span>
                </x-admin.button>
            </x-slot>
        </form>
    </x-admin.modal>
</div>

<script>
function parameterManager(type) {
    return {
        type: type,
        parameters: @json($parameters->items()),
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
            this.$dispatch('open-modal', 'parameter-modal');
        },

        editParameter(param) {
            this.editingParameter = param;
            this.form = { code: param.code, name: param.name };
            this.$dispatch('open-modal', 'parameter-modal');
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
                    window.AdminUtils?.toastSuccess(data.message || 'Parameter saved successfully');
                    this.showModal = false;
                    setTimeout(() => location.reload(), 1000);
                } else {
                    window.AdminUtils?.toastError(data.message || 'Failed to save parameter');
                }
            } catch (error) {
                window.AdminUtils?.toastError('Failed to save parameter');
            }
        },

        async deleteParameter(id) {
            const confirmed = await window.AdminUtils?.confirmDelete('Parameter ini akan dihapus. Lanjutkan?');
            
            if (confirmed) {
                try {
                    const response = await fetch(`/admin/${this.type}-parameters/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                        }
                    });

                    const data = await response.json();

                    if (data.success) {
                        window.AdminUtils?.toastSuccess(data.message || 'Parameter deleted successfully');
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        window.AdminUtils?.toastError(data.message || 'Failed to delete parameter');
                    }
                } catch (error) {
                    window.AdminUtils?.toastError('Failed to delete parameter');
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

