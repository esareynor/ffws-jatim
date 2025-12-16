@extends('layouts.admin')

@section('title', 'Provinsi')

@section('content')
<div x-data="provinceData()">
    <!-- Header Section -->
    <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Provinsi</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola data provinsi</p>
            </div>
            <button @click="openCreateModal()" type="button" 
                class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                <i class="fas fa-plus mr-2"></i>
                Tambah Provinsi
            </button>
        </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <form method="GET" action="{{ route('admin.region.provinces.index') }}" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
                <input type="text" name="search" value="{{ request('search') }}" 
                    placeholder="Cari provinsi..."
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div class="flex items-end gap-2">
                <button type="submit" class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    <i class="fas fa-search mr-2"></i>Filter
                </button>
                <a href="{{ route('admin.region.provinces.index') }}" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors">
                    <i class="fas fa-redo"></i>
                </a>
            </div>
        </form>
    </div>

    <!-- Table Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kode</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Provinsi</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jumlah Kota</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    @forelse($provinces as $province)
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $province->provinces_code }}</span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="text-sm text-gray-900 dark:text-white">{{ $province->provinces_name }}</span>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {{ $province->cities_count }} kota
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button @click="openEditModal({{ json_encode($province) }})" 
                                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-3">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button @click="confirmDelete({{ $province->id }})" 
                                class="text-red-600 hover:text-red-900 dark:text-red-400">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                            <i class="fas fa-inbox text-4xl mb-2"></i>
                            <p>Tidak ada data provinsi</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($provinces->hasPages())
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {{ $provinces->links() }}
        </div>
        @endif
    </div>

    <!-- Create/Edit Modal -->
    <div x-show="showModal" x-cloak
        class="fixed inset-0 z-50 overflow-y-auto" 
        @click.self="closeModal()">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full shadow-xl">
                <!-- Modal Header -->
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white" x-text="isEdit ? 'Edit Provinsi' : 'Tambah Provinsi'"></h3>
                </div>

                <!-- Modal Body -->
                <form @submit.prevent="submitForm()" class="px-6 py-4">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kode Provinsi <span class="text-red-500">*</span>
                            </label>
                            <input type="text" x-model="formData.provinces_code" required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Contoh: PROV-35">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nama Provinsi <span class="text-red-500">*</span>
                            </label>
                            <input type="text" x-model="formData.provinces_name" required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Contoh: Jawa Timur">
                        </div>
                    </div>

                    <!-- Modal Footer -->
                    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button type="button" @click="closeModal()" 
                            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors">
                            Batal
                        </button>
                        <button type="submit" 
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            <span x-text="isEdit ? 'Update' : 'Simpan'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
function provinceData() {
    return {
        showModal: false,
        isEdit: false,
        formData: {
            id: null,
            provinces_code: '',
            provinces_name: ''
        },

        openCreateModal() {
            this.isEdit = false;
            this.resetForm();
            this.showModal = true;
        },

        openEditModal(province) {
            this.isEdit = true;
            this.formData = {
                id: province.id,
                provinces_code: province.provinces_code,
                provinces_name: province.provinces_name
            };
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.resetForm();
        },

        resetForm() {
            this.formData = {
                id: null,
                provinces_code: '',
                provinces_name: ''
            };
        },

        async submitForm() {
            try {
                const url = this.isEdit 
                    ? `/admin/region/provinces/${this.formData.id}`
                    : '/admin/region/provinces';
                
                const method = this.isEdit ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify(this.formData)
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.reload();
                } else {
                    alert(data.message || 'Terjadi kesalahan');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat menyimpan data');
            }
        },

        confirmDelete(id) {
            if (confirm('Apakah Anda yakin ingin menghapus provinsi ini?')) {
                this.deleteProvince(id);
            }
        },

        async deleteProvince(id) {
            try {
                const response = await fetch(`/admin/region/provinces/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    window.location.reload();
                } else {
                    alert(data.message || 'Gagal menghapus data');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat menghapus data');
            }
        }
    };
}
</script>
@endpush
@endsection
