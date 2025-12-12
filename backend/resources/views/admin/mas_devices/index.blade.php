@extends('layouts.admin')

@section('title', 'Device')
@section('page-title', 'Device')
@section('page-description', 'Kelola data device monitoring')
@section('breadcrumb', 'Device')

@section('content')
<div class="space-y-6" x-data="devicesPage()" x-init="init()">

    <!-- Filter Section -->
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari Device',
                'placeholder' => 'Cari berdasarkan nama atau kode device...'
            ],
            [
                'type' => 'select',
                'name' => 'river_basin_id',
                'label' => 'Wilayah Sungai',
                'empty_option' => 'Semua Wilayah Sungai',
                'options' => $riverBasins->map(function($basin) {
                    return ['value' => $basin['value'], 'label' => $basin['label']];
                })->toArray()
            ],
            [
                'type' => 'select',
                'name' => 'status',
                'label' => 'Status',
                'empty_option' => 'Semua Status',
                'options' => [
                    ['value' => 'active', 'label' => 'Aktif'],
                    ['value' => 'inactive', 'label' => 'Non-aktif']
                ]
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
        title="Filter & Pencarian Device"
        :filters="$filterConfig"
        :action="route('admin.devices.index')"
        gridCols="md:grid-cols-4"
    />

    <x-table
        title="Daftar Device"
        :headers="$tableHeaders"
        :rows="$devices"
        searchable
        searchPlaceholder="Cari device..."
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreate()">
                <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                Tambah Device
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    <!-- Modal Create -->
    <x-admin.modal :show="false" name="device-create" title="Tambah Device" size="lg" :close-on-backdrop="true">
        <form id="deviceCreateForm" x-ref="createForm" action="{{ route('admin.devices.store') }}" method="POST" class="space-y-6">
            @csrf
            <input type="hidden" name="context" value="create" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <x-admin.form-input
                    type="text"
                    name="name"
                    label="Nama Device"
                    placeholder="Contoh: AWS Malang 01"
                    required="true"
                    :error="$errors->first('name')"
                />
                <x-admin.form-input
                    type="text"
                    name="code"
                    label="Kode Device"
                    placeholder="Contoh: DEV-MLG-001"
                    required="true"
                    :error="$errors->first('code')"
                />
                <x-admin.form-input
                    type="select"
                    name="mas_river_basin_code"
                    label="Wilayah Sungai"
                    required="true"
                    :error="$errors->first('mas_river_basin_code')"
                    :options="$riverBasins"
                />
                <x-admin.form-input
                    type="number"
                    name="latitude"
                    label="Latitude"
                    placeholder="-7.9666"
                    step="0.000001"
                    required="true"
                    :error="$errors->first('latitude')"
                />
                <x-admin.form-input
                    type="number"
                    name="longitude"
                    label="Longitude"
                    placeholder="112.6326"
                    step="0.000001"
                    required="true"
                    :error="$errors->first('longitude')"
                />
                <x-admin.form-input
                    type="number"
                    name="elevation_m"
                    label="Elevasi (m)"
                    placeholder="500"
                    step="0.01"
                    :error="$errors->first('elevation_m')"
                />
                <x-admin.form-input
                    type="select"
                    name="status"
                    label="Status"
                    required="true"
                    :error="$errors->first('status')"
                    :options="[
                        ['value' => 'active', 'label' => 'Aktif'],
                        ['value' => 'inactive', 'label' => 'Non-aktif'],
                    ]"
                />
            </div>
            <x-slot:footer>
                <button type="button" class="px-4 py-2 border rounded-md" @click="$dispatch('close-modal', 'device-create')">Batal</button>
                <x-admin.button type="submit" variant="primary" form="deviceCreateForm">
                    <i class="fas fa-check -ml-1 mr-2"></i>
                    Simpan
                </x-admin.button>
            </x-slot:footer>
        </form>
    </x-admin.modal>

    <!-- Modal Edit -->
    <x-admin.modal :show="false" name="device-edit" title="Edit Device" size="lg" :close-on-backdrop="true">
        <form id="deviceEditForm" x-ref="editForm" :action="editAction" method="POST" class="space-y-6">
            @csrf
            @method('PUT')
            <input type="hidden" name="context" value="edit" />
            <input type="hidden" name="id" :value="editData.id" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <x-admin.form-input
                    type="text"
                    name="name"
                    label="Nama Device"
                    x-model="editData.name"
                    required="true"
                    :error="$errors->first('name')"
                />
                <x-admin.form-input
                    type="text"
                    name="code"
                    label="Kode Device"
                    x-model="editData.code"
                    required="true"
                    :error="$errors->first('code')"
                />
                <x-admin.form-input
                    type="select"
                    name="mas_river_basin_code"
                    label="Wilayah Sungai"
                    x-model="editData.mas_river_basin_code"
                    required="true"
                    :error="$errors->first('mas_river_basin_code')"
                    :options="$riverBasins"
                />
                <x-admin.form-input
                    type="number"
                    name="latitude"
                    label="Latitude"
                    x-model="editData.latitude"
                    step="0.000001"
                    required="true"
                    :error="$errors->first('latitude')"
                />
                <x-admin.form-input
                    type="number"
                    name="longitude"
                    label="Longitude"
                    x-model="editData.longitude"
                    step="0.000001"
                    required="true"
                    :error="$errors->first('longitude')"
                />
                <x-admin.form-input
                    type="number"
                    name="elevation_m"
                    label="Elevasi (m)"
                    x-model="editData.elevation_m"
                    step="0.01"
                    :error="$errors->first('elevation_m')"
                />
                <x-admin.form-input
                    type="select"
                    name="status"
                    label="Status"
                    x-model="editData.status"
                    required="true"
                    :error="$errors->first('status')"
                    :options="[
                        ['value' => 'active', 'label' => 'Aktif'],
                        ['value' => 'inactive', 'label' => 'Non-aktif']
                    ]"
                />
            </div>
            <x-slot:footer>
                <button type="button" class="px-4 py-2 border rounded-md" @click="$dispatch('close-modal', 'device-edit')">Batal</button>
                <x-admin.button type="submit" variant="primary" form="deviceEditForm">
                    <i class="fas fa-check -ml-1 mr-2"></i>
                    Update
                </x-admin.button>
            </x-slot:footer>
        </form>
    </x-admin.modal>
</div>

@push('scripts')
<script>
function devicesPage() {
    return {
        editData: {
            id: null,
            name: '',
            code: '',
            mas_river_basin_code: '',
            latitude: '',
            longitude: '',
            elevation_m: '',
            status: ''
        },
        editAction: '',
        init() {
            // Listener untuk aksi edit dari tabel
            window.addEventListener('open-edit-device', (e) => {
                const item = e.detail || {};
                this.openEdit(item);
            });
        },
        openCreate() {
            this.$dispatch('open-modal', 'device-create');
        },
        openEdit(item) {
            this.editData = {
                id: item.id,
                name: item.name,
                code: item.code,
                mas_river_basin_code: item.mas_river_basin_code,
                latitude: item.latitude,
                longitude: item.longitude,
                elevation_m: item.elevation_m,
                status: item.status
            };
            this.editAction = `${window.location.origin}/admin/devices/${item.code}`;
            this.$dispatch('open-modal', 'device-edit');
        }
    }
}
</script>
@endpush
@endsection
