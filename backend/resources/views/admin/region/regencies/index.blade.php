@extends('layouts.admin')

@section('title', 'Kecamatan')
@section('page-title', 'Kecamatan')
@section('page-description', 'Kelola data kecamatan')
@section('breadcrumb', 'Kecamatan')

@section('content')
<div class="space-y-6" x-data="regencyData()" x-init="init()">

    {{-- Filter Section --}}
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari Kecamatan',
                'placeholder' => 'Cari berdasarkan kode atau nama...'
            ],
            [
                'type' => 'select',
                'name' => 'city_code',
                'label' => 'Kota/Kabupaten',
                'empty_option' => 'Semua Kota/Kabupaten',
                'options' => $cities->map(function($city) {
                    return ['value' => $city->code, 'label' => $city->name . ' (' . ($city->province->provinces_name ?? '-') . ')'];
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
        title="Filter & Pencarian Kecamatan"
        :filters="$filterConfig"
        :action="route('admin.region.regencies.index')"
        gridCols="md:grid-cols-3"
    />

    {{-- Regencies Table --}}
    <x-table
        title="Daftar Kecamatan"
        :headers="$tableHeaders"
        :rows="$regencies"
        searchable
        searchPlaceholder="Cari kecamatan..."
        :pagination="$regencies->links()"
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreateModal()">
                <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                Tambah Kecamatan
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    {{-- Modal Create/Edit --}}
    <x-admin.modal :show="false" name="regency-modal" size="md" :close-on-backdrop="true">
        <x-slot:title>
            <span x-text="isEdit ? 'Edit Kecamatan' : 'Tambah Kecamatan'"></span>
        </x-slot:title>

        <form @submit.prevent="submitForm()" class="space-y-6">
            <x-admin.form-input
                type="select"
                name="cities_code"
                label="Kota/Kabupaten"
                x-model="formData.cities_code"
                required="true"
                :options="$cities->map(function($city) {
                    return ['value' => $city->code, 'label' => $city->name . ' (' . ($city->province->provinces_name ?? '-') . ')'];
                })->prepend(['value' => '', 'label' => 'Pilih Kota/Kabupaten'])->toArray()"
            />
            <x-admin.form-input
                type="text"
                name="regencies_code"
                label="Kode Kecamatan"
                x-model="formData.regencies_code"
                placeholder="Contoh: KEC-001"
                required="true"
            />
            <x-admin.form-input
                type="text"
                name="regencies_name"
                label="Nama Kecamatan"
                x-model="formData.regencies_name"
                placeholder="Contoh: Tegalsari"
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
function regencyData() {
    return {
        showModal: false,
        isEdit: false,
        formData: {
            id: null,
            regencies_code: '',
            regencies_name: '',
            cities_code: ''
        },

        init() {
            window.addEventListener('open-edit-regency', (e) => {
                const item = e.detail || {};
                this.openEditModal(item);
            });
        },

        openCreateModal() {
            this.isEdit = false;
            this.resetForm();
            this.$dispatch('open-modal', 'regency-modal');
        },

        openEditModal(regency) {
            this.isEdit = true;
            this.formData = {
                id: regency.id,
                regencies_code: regency.regencies_code,
                regencies_name: regency.regencies_name,
                cities_code: regency.cities_code
            };
            this.$dispatch('open-modal', 'regency-modal');
        },

        closeModal() {
            this.$dispatch('close-modal', 'regency-modal');
            this.resetForm();
        },

        resetForm() {
            this.formData = {
                id: null,
                regencies_code: '',
                regencies_name: '',
                cities_code: ''
            };
        },

        async submitForm() {
            try {
                const url = this.isEdit
                    ? `/admin/region/regencies/${this.formData.id}`
                    : '/admin/region/regencies';

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
