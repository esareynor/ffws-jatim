@extends('layouts.admin')

@section('title', 'Provinsi')
@section('page-title', 'Provinsi')
@section('page-description', 'Kelola data provinsi')
@section('breadcrumb', 'Provinsi')

@section('content')
<div class="space-y-6" x-data="provinceData()" x-init="init()">

    {{-- Filter Section --}}
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari Provinsi',
                'placeholder' => 'Cari berdasarkan kode atau nama provinsi...'
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
        title="Filter & Pencarian Provinsi"
        :filters="$filterConfig"
        :action="route('admin.region.provinces.index')"
        gridCols="md:grid-cols-2"
    />

    {{-- Provinces Table --}}
    <x-table
        title="Daftar Provinsi"
        :headers="$tableHeaders"
        :rows="$provinces"
        searchable
        searchPlaceholder="Cari provinsi..."
        :pagination="$provinces->links()"
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreateModal()">
                <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                Tambah Provinsi
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    {{-- Modal Create/Edit --}}
    <x-admin.modal :show="false" name="province-modal" size="md" :close-on-backdrop="true">
        <x-slot:title>
            <span x-text="isEdit ? 'Edit Provinsi' : 'Tambah Provinsi'"></span>
        </x-slot:title>

        <form @submit.prevent="submitForm()" class="space-y-6">
            <x-admin.form-input
                type="text"
                name="provinces_code"
                label="Kode Provinsi"
                x-model="formData.provinces_code"
                placeholder="Contoh: PROV-35"
                required="true"
            />
            <x-admin.form-input
                type="text"
                name="provinces_name"
                label="Nama Provinsi"
                x-model="formData.provinces_name"
                placeholder="Contoh: Jawa Timur"
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
function provinceData() {
    return {
        showModal: false,
        isEdit: false,
        formData: {
            id: null,
            provinces_code: '',
            provinces_name: ''
        },

        init() {
            // Listen for edit event from table
            window.addEventListener('open-edit-province', (e) => {
                const item = e.detail || {};
                this.openEditModal(item);
            });
        },

        openCreateModal() {
            this.isEdit = false;
            this.resetForm();
            this.$dispatch('open-modal', 'province-modal');
        },

        openEditModal(province) {
            this.isEdit = true;
            this.formData = {
                id: province.id,
                provinces_code: province.provinces_code,
                provinces_name: province.provinces_name
            };
            this.$dispatch('open-modal', 'province-modal');
        },

        closeModal() {
            this.$dispatch('close-modal', 'province-modal');
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
