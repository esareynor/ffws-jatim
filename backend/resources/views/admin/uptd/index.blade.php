@extends('layouts.admin')

@section('title', 'UPTD Management')
@section('page-title', 'UPTD Management')
@section('page-description', 'Kelola Unit Pelaksana Teknis Daerah')
@section('breadcrumb', 'UPTD')

@section('content')
<div class="space-y-6" x-data="uptdData()" x-init="init()">

    {{-- Filter Section --}}
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari UPTD',
                'placeholder' => 'Cari berdasarkan nama atau kode UPTD...'
            ],
            [
                'type' => 'select',
                'name' => 'upt_code',
                'label' => 'UPT',
                'empty_option' => 'Semua UPT',
                'options' => $upts->map(function($upt) {
                    return ['value' => $upt->code, 'label' => $upt->name];
                })->toArray()
            ],
            [
                'type' => 'select',
                'name' => 'city_code',
                'label' => 'Kabupaten',
                'empty_option' => 'Semua Kabupaten',
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
        title="Filter & Pencarian UPTD"
        :filters="$filterConfig"
        :action="route('admin.uptd.index')"
        gridCols="md:grid-cols-4"
    />

    {{-- UPTD Table --}}
    <x-table
        title="Daftar UPTD"
        :headers="$tableHeaders"
        :rows="$uptds"
        searchable
        searchPlaceholder="Cari UPTD..."
        :pagination="$uptds->links()"
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreateModal()">
                <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                Tambah UPTD
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    {{-- Modal Create/Edit --}}
    <x-admin.modal :show="false" name="uptd-modal" size="lg" :close-on-backdrop="true">
        <x-slot:title>
            <span x-text="isEdit ? 'Edit UPTD' : 'Tambah UPTD'"></span>
        </x-slot:title>

        <form @submit.prevent="submitForm()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <x-admin.form-input
                    type="text"
                    name="code"
                    label="Kode"
                    x-model="formData.code"
                    placeholder="Contoh: UPTD-SBY"
                    required="true"
                />
                <x-admin.form-input
                    type="text"
                    name="name"
                    label="Nama UPTD"
                    x-model="formData.name"
                    placeholder="Contoh: UPTD Surabaya"
                    required="true"
                />
            </div>

            <x-admin.form-input
                type="select"
                name="upt_code"
                label="UPT"
                x-model="formData.upt_code"
                @change="loadCitiesByUpt()"
                required="true"
                :options="$upts->map(function($upt) {
                    return ['value' => $upt->code, 'label' => $upt->name];
                })->prepend(['value' => '', 'label' => 'Pilih UPT'])->toArray()"
            />

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kabupaten <span class="text-red-500">*</span>
                    <span class="text-xs text-gray-500" x-show="!formData.upt_code">(Pilih UPT terlebih dahulu)</span>
                </label>
                <select x-model="formData.city_code" required 
                    :disabled="!formData.upt_code || availableCities.length === 0"
                    class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="">Pilih Kabupaten</option>
                    <template x-for="city in availableCities" :key="city.code">
                        <option :value="city.code" x-text="city.name + ' (' + city.province.provinces_name + ')'"></option>
                    </template>
                </select>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1" x-show="formData.upt_code && availableCities.length === 0">
                    UPT ini belum memiliki kabupaten yang terdaftar
                </p>
            </div>
        </form>

        <x-slot:footer>
            <x-admin.button variant="outline" @click="closeModal()">
                Batal
            </x-admin.button>
            <x-admin.button variant="primary" @click="submitForm()" :disabled="!formData.upt_code || !formData.city_code">
                <span x-text="isEdit ? 'Update' : 'Simpan'"></span>
            </x-admin.button>
        </x-slot:footer>
    </x-admin.modal>
</div>

@push('scripts')
<script>
function uptdData() {
    return {
        showModal: false,
        isEdit: false,
        availableCities: [],
        formData: {
            id: null,
            name: '',
            code: '',
            upt_code: '',
            city_code: ''
        },

        init() {
            // Listen for edit event from table
            window.addEventListener('open-edit-uptd', (e) => {
                const item = e.detail || {};
                this.openEditModal(item);
            });
        },

        openCreateModal() {
            this.isEdit = false;
            this.resetForm();
            this.$dispatch('open-modal', 'uptd-modal');
        },

        async openEditModal(uptd) {
            this.isEdit = true;
            this.formData = {
                id: uptd.id,
                name: uptd.name,
                code: uptd.code,
                upt_code: uptd.upt_code,
                city_code: uptd.city_code
            };

            // Load cities for the selected UPT
            await this.loadCitiesByUpt();

            this.$dispatch('open-modal', 'uptd-modal');
        },

        closeModal() {
            this.$dispatch('close-modal', 'uptd-modal');
            this.resetForm();
        },

        resetForm() {
            this.formData = {
                id: null,
                name: '',
                code: '',
                upt_code: '',
                city_code: ''
            };
            this.availableCities = [];
        },

        async loadCitiesByUpt() {
            if (!this.formData.upt_code) {
                this.availableCities = [];
                this.formData.city_code = '';
                return;
            }

            try {
                const response = await fetch(`/admin/uptd/cities-by-upt?upt_code=${this.formData.upt_code}`);
                const data = await response.json();

                if (data.success) {
                    this.availableCities = data.data;

                    // Reset city selection if current city is not in available cities
                    if (this.formData.city_code) {
                        const cityExists = this.availableCities.find(c => c.code === this.formData.city_code);
                        if (!cityExists) {
                            this.formData.city_code = '';
                        }
                    }
                } else {
                    this.availableCities = [];
                    this.formData.city_code = '';
                }
            } catch (error) {
                console.error('Error loading cities:', error);
                this.availableCities = [];
                this.formData.city_code = '';
            }
        },

        async submitForm() {
            try {
                const url = this.isEdit
                    ? `/admin/uptd/${this.formData.id}`
                    : '/admin/uptd';

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
            if (confirm('Apakah Anda yakin ingin menghapus UPTD ini?')) {
                this.deleteUptd(id);
            }
        },

        async deleteUptd(id) {
            try {
                const response = await fetch(`/admin/uptd/${id}`, {
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
