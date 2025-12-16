@extends('layouts.admin')

@section('title', 'Kota/Kabupaten')
@section('page-title', 'Kota/Kabupaten')
@section('page-description', 'Kelola data kota dan kabupaten')
@section('breadcrumb', 'Kota/Kabupaten')

@section('content')
<div class="space-y-6" x-data="cityData()" x-init="init()">

    {{-- Filter Section --}}
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari Kota/Kabupaten',
                'placeholder' => 'Cari berdasarkan kode atau nama...'
            ],
            [
                'type' => 'select',
                'name' => 'province_code',
                'label' => 'Provinsi',
                'empty_option' => 'Semua Provinsi',
                'options' => $provinces->map(function($province) {
                    return ['value' => $province->provinces_code, 'label' => $province->provinces_name];
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
                    ['value' => '50', 'label' => '50']
                ]
            ]
        ];
    @endphp

    <x-filter-bar 
        title="Filter & Pencarian Kota/Kabupaten"
        :filters="$filterConfig"
        :action="route('admin.region.cities.index')"
        gridCols="md:grid-cols-3"
    />

    {{-- Cities Table --}}
    <x-table
        title="Daftar Kota/Kabupaten"
        :headers="$tableHeaders"
        :rows="$cities"
        searchable
        searchPlaceholder="Cari kota/kabupaten..."
        :pagination="$cities->links()"
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreateModal()">
                <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                Tambah Kota/Kabupaten
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    {{-- Modal Create/Edit --}}
    <x-admin.modal :show="false" name="city-modal" size="md" :close-on-backdrop="true">
        <x-slot:title>
            <span x-text="isEdit ? 'Edit Kota/Kabupaten' : 'Tambah Kota/Kabupaten'"></span>
        </x-slot:title>

        <form @submit.prevent="submitForm()" class="space-y-6">
            <x-admin.form-input
                type="select"
                name="provinces_code"
                label="Provinsi"
                x-model="formData.provinces_code"
                required="true"
                :options="$provinces->map(function($province) {
                    return ['value' => $province->provinces_code, 'label' => $province->provinces_name];
                })->prepend(['value' => '', 'label' => 'Pilih Provinsi'])->toArray()"
            />
            <x-admin.form-input
                type="text"
                name="code"
                label="Kode"
                x-model="formData.code"
                placeholder="Contoh: KAB-SBY"
                required="true"
            />
            <x-admin.form-input
                type="text"
                name="name"
                label="Nama Kota/Kabupaten"
                x-model="formData.name"
                placeholder="Contoh: Surabaya"
                required="true"
            />
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
function cityData() {
    return {
        showModal: false,
        isEdit: false,
        formData: {
            id: null,
            code: '',
            name: '',
            provinces_code: ''
        },

        init() {
            window.addEventListener('open-edit-city', (e) => {
                const item = e.detail || {};
                this.openEditModal(item);
            });
        },

        openCreateModal() {
            this.isEdit = false;
            this.resetForm();
            this.$dispatch('open-modal', 'city-modal');
        },

        openEditModal(city) {
            this.isEdit = true;
            this.formData = {
                id: city.id,
                code: city.code,
                name: city.name,
                provinces_code: city.provinces_code
            };
            this.$dispatch('open-modal', 'city-modal');
        },

        closeModal() {
            this.$dispatch('close-modal', 'city-modal');
            this.resetForm();
        },

        resetForm() {
            this.formData = {
                id: null,
                code: '',
                name: '',
                provinces_code: ''
            };
        },

        async submitForm() {
            try {
                const url = this.isEdit
                    ? `/admin/region/cities/${this.formData.id}`
                    : '/admin/region/cities';

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
        }
    };
}
</script>
@endpush
@endsection
