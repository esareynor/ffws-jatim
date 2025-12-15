@extends('layouts.admin')

@section('title', 'UPT Management')
@section('page-title', 'UPT Management')
@section('page-description', 'Kelola Unit Pelaksana Teknis')
@section('breadcrumb', 'UPT')

@section('content')
<div class="space-y-6" x-data="uptData()" x-init="init()">

    {{-- Filter Section --}}
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari UPT',
                'placeholder' => 'Cari berdasarkan nama atau kode UPT...'
            ],
            [
                'type' => 'select',
                'name' => 'river_basin_code',
                'label' => 'Wilayah Sungai',
                'empty_option' => 'Semua Wilayah Sungai',
                'options' => $riverBasins->map(function($basin) {
                    return ['value' => $basin->code, 'label' => $basin->name];
                })->toArray()
            ],
            [
                'type' => 'select',
                'name' => 'city_code',
                'label' => 'Kota/Kabupaten',
                'empty_option' => 'Semua Kota/Kabupaten',
                'options' => $cities->map(function($city) {
                    return ['value' => $city->code, 'label' => $city->name . ' (' . $city->province->provinces_name . ')'];
                })->toArray()
            ],
            [
                'type' => 'select',
                'name' => 'per_page',
                'label' => 'Per Halaman',
                'options' => [
                    ['value' => '10', 'label' => '10'],
                    ['value' => '15', 'label' => '15'],
                    ['value' => '25', 'label' => '25'],
                    ['value' => '50', 'label' => '50'],
                    ['value' => '100', 'label' => '100']
                ]
            ]
        ];
    @endphp

    <x-filter-bar 
        title="Filter & Pencarian UPT"
        :filters="$filterConfig"
        :action="route('admin.upt.index')"
        gridCols="md:grid-cols-4"
    />

    {{-- UPT Table --}}
    <x-table
        title="Daftar UPT"
        :headers="$tableHeaders"
        :rows="$upts"
        searchable
        searchPlaceholder="Cari UPT..."
        :pagination="$upts->links()"
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreateModal()">
                <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                Tambah UPT
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    {{-- Modal Create/Edit --}}
    <x-admin.modal :show="false" name="upt-modal" size="lg" :close-on-backdrop="true">
        <x-slot:title>
            <span x-text="isEdit ? 'Edit UPT' : 'Tambah UPT'"></span>
        </x-slot:title>

        <form @submit.prevent="submitForm()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <x-admin.form-input
                    type="text"
                    name="code"
                    label="Kode"
                    x-model="formData.code"
                    placeholder="Contoh: UPT-BRT"
                    required="true"
                />
                <x-admin.form-input
                    type="text"
                    name="name"
                    label="Nama UPT"
                    x-model="formData.name"
                    placeholder="Contoh: UPT Brantas"
                    required="true"
                />
            </div>

            <x-admin.form-input
                type="select"
                name="river_basin_code"
                label="Wilayah Sungai"
                x-model="formData.river_basin_code"
                required="true"
                :options="$riverBasins->map(function($basin) {
                    return ['value' => $basin->code, 'label' => $basin->name];
                })->prepend(['value' => '', 'label' => 'Pilih Wilayah Sungai'])->toArray()"
            />

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kota/Kabupaten <span class="text-red-500">*</span>
                    <span class="text-xs text-gray-500">(Pilih satu atau lebih)</span>
                </label>
                <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-2 max-h-48 overflow-y-auto bg-white dark:bg-gray-700">
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
        </form>

        <x-slot:footer>
            <x-admin.button variant="outline" @click="closeModal()">
                Batal
            </x-admin.button>
            <x-admin.button variant="primary" @click="submitForm()">
                <span x-text="isEdit ? 'Update' : 'Simpan'"></span>
            </x-admin.button>
        </x-slot:footer>
    </x-admin.modal>
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

        init() {
            // Listen for edit event from table
            window.addEventListener('open-edit-upt', (e) => {
                const item = e.detail || {};
                this.openEditModal(item);
            });

            // Listen for delete event
            window.addEventListener('delete-item', (e) => {
                const item = e.detail || {};
                this.confirmDelete(item.id);
            });
        },

        openCreateModal() {
            this.isEdit = false;
            this.resetForm();
            this.$dispatch('open-modal', 'upt-modal');
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
            this.$dispatch('open-modal', 'upt-modal');
        },

        closeModal() {
            this.$dispatch('close-modal', 'upt-modal');
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
