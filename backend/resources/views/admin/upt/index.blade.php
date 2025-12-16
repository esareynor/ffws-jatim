@extends('layouts.admin')

@section('title', 'UPT Management')

@section('content')
<div x-data="uptData()">
    <!-- Header Section -->
    <div class="mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">UPT Management</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Kelola Unit Pelaksana Teknis</p>
            </div>
            <button @click="openCreateModal()" type="button"
                class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                <i class="fas fa-plus mr-2"></i>
                Tambah UPT
            </button>
        </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <form method="GET" action="{{ route('admin.upt.index') }}" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
                <input type="text" name="search" value="{{ request('search') }}"
                    placeholder="Cari nama atau kode UPT..."
                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Wilayah Sungai</label>
                <select name="river_basin_code" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    <option value="">Semua Wilayah Sungai</option>
                    @foreach($riverBasins as $basin)
                        <option value="{{ $basin->code }}" {{ request('river_basin_code') == $basin->code ? 'selected' : '' }}>
                            {{ $basin->name }}
                        </option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kota/Kabupaten</label>
                <select name="city_code" class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    <option value="">Semua Kota/Kabupaten</option>
                    @foreach($cities as $city)
                        <option value="{{ $city->code }}" {{ request('city_code') == $city->code ? 'selected' : '' }}>
                            {{ $city->name }} ({{ $city->province->provinces_name }})
                        </option>
                    @endforeach
                </select>
            </div>
            <div class="flex items-end gap-2">
                <button type="submit" class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    <i class="fas fa-search mr-2"></i>Filter
                </button>
                <a href="{{ route('admin.upt.index') }}" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors">
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
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama UPT</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wilayah Sungai</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kota/Kabupaten</th>
                        <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    @forelse($upts as $upt)
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $upt->code }}</span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="text-sm text-gray-900 dark:text-white">{{ $upt->name }}</span>
                        </td>
                        <td class="px-6 py-4">
                            <span class="text-sm text-gray-600 dark:text-gray-400">
                                {{ $upt->riverBasin->name ?? '-' }}
                            </span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex flex-wrap gap-1">
                                @forelse($upt->cities as $city)
                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {{ $city->name }}
                                    </span>
                                @empty
                                    <span class="text-sm text-gray-400">-</span>
                                @endforelse
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button @click="openEditModal({{ json_encode($upt) }})"
                                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 mr-3">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button @click="confirmDelete({{ $upt->id }})"
                                class="text-red-600 hover:text-red-900 dark:text-red-400">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                            <i class="fas fa-inbox text-4xl mb-2"></i>
                            <p>Tidak ada data UPT</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($upts->hasPages())
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {{ $upts->links() }}
        </div>
        @endif
    </div>

    <!-- Create/Edit Modal -->
    <div x-show="showModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal()">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full shadow-xl">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white" x-text="isEdit ? 'Edit UPT' : 'Tambah UPT'"></h3>
                </div>

                <form @submit.prevent="submitForm()" class="px-6 py-4">
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Kode <span class="text-red-500">*</span>
                                </label>
                                <input type="text" x-model="formData.code" required
                                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Contoh: UPT-BRT">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nama UPT <span class="text-red-500">*</span>
                                </label>
                                <input type="text" x-model="formData.name" required
                                    class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Contoh: UPT Brantas">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Wilayah Sungai <span class="text-red-500">*</span>
                            </label>
                            <select x-model="formData.river_basin_code" required
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                                <option value="">Pilih Wilayah Sungai</option>
                                @foreach($riverBasins as $basin)
                                    <option value="{{ $basin->code }}">{{ $basin->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Kota/Kabupaten <span class="text-red-500">*</span>
                                <span class="text-xs text-gray-500">(Pilih satu atau lebih)</span>
                            </label>
                            <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-2 max-h-48 overflow-y-auto dark:bg-gray-700">
                                @foreach($cities as $city)
                                    <label class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded cursor-pointer">
                                        <input type="checkbox"
                                            :value="'{{ $city->code }}'"
                                            x-model="formData.city_codes"
                                            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            {{ $city->name }} ({{ $city->province->provinces_name }})
                                        </span>
                                    </label>
                                @endforeach
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span x-text="formData.city_codes.length"></span> kota/kabupaten dipilih
                            </p>
                        </div>
                    </div>

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
function uptData() {
    return {
        showModal: false,
        isEdit: false,
        formData: {
            id: null,
            name: '',
            code: '',
            river_basin_code: '',
            city_codes: []
        },

        openCreateModal() {
            this.isEdit = false;
            this.resetForm();
            this.showModal = true;
        },

        openEditModal(upt) {
            this.isEdit = true;
            this.formData = {
                id: upt.id,
                name: upt.name,
                code: upt.code,
                river_basin_code: upt.river_basin_code,
                city_codes: upt.cities.map(city => city.code)
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
                name: '',
                code: '',
                river_basin_code: '',
                city_codes: []
            };
        },

        async submitForm() {
            if (this.formData.city_codes.length === 0) {
                alert('Minimal satu kota/kabupaten harus dipilih');
                return;
            }

            try {
                const url = this.isEdit
                    ? `/admin/upt/${this.formData.id}`
                    : '/admin/upt';

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
            if (confirm('Apakah Anda yakin ingin menghapus UPT ini?')) {
                this.deleteUpt(id);
            }
        },

        async deleteUpt(id) {
            try {
                const response = await fetch(`/admin/upt/${id}`, {
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
