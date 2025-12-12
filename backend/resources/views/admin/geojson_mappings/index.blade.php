@extends('layouts.admin')

@section('title', 'GeoJSON Mapping')
@section('page-title', 'GeoJSON Mapping')
@section('page-description', 'Kelola data pemetaan GeoJSON')
@section('breadcrumb', 'GeoJSON Mapping')

@section('content')
<div class="space-y-6" x-data="geojsonMappingsPage()">

    <!-- Filter Section -->
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari',
                'placeholder' => 'Kode, deskripsi...'
            ],
            [
                'type' => 'select',
                'name' => 'device_code',
                'label' => 'Device',
                'empty_option' => 'Semua Device',
                'options' => $devices->toArray()
            ],
            [
                'type' => 'select',
                'name' => 'river_basin_code',
                'label' => 'DAS',
                'empty_option' => 'Semua DAS',
                'options' => $riverBasins->toArray()
            ],
            [
                'type' => 'select',
                'name' => 'city_code',
                'label' => 'Kota',
                'empty_option' => 'Semua Kota',
                'options' => $cities->toArray()
            ]
        ];
    @endphp

    <x-filter-bar
        title="Filter & Pencarian GeoJSON Mapping"
        :filters="$filterConfig"
        :action="route('admin.geojson-mappings.index')"
        gridCols="md:grid-cols-4"
    />

    <!-- Table -->
    <x-table
        title="Daftar GeoJSON Mapping"
        :headers="$tableHeaders"
        :rows="$mappings"
        searchable
        searchPlaceholder="Cari mapping..."
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreate()">
                <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                Tambah Mapping
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    <!-- Modal Create -->
    <x-admin.modal :show="false" name="mapping-create" title="Tambah GeoJSON Mapping" size="2xl" :close-on-backdrop="true">
        <form id="mappingCreateForm" action="{{ route('admin.geojson-mappings.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
            @csrf
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                    <x-admin.form-input
                        type="text"
                        name="geojson_code"
                        label="Kode GeoJSON"
                        placeholder="GEOJSON-001"
                        required="true"
                        :error="$errors->first('geojson_code')"
                    />
                </div>

                <x-admin.form-input
                    type="select"
                    name="mas_device_code"
                    label="Device"
                    :options="$devices"
                    :error="$errors->first('mas_device_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_river_basin_code"
                    label="DAS"
                    :options="$riverBasins"
                    :error="$errors->first('mas_river_basin_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_watershed_code"
                    label="DTA"
                    :options="$watersheds"
                    :error="$errors->first('mas_watershed_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_city_code"
                    label="Kota"
                    :options="$cities"
                    :error="$errors->first('mas_city_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_regency_code"
                    label="Kabupaten"
                    :options="$regencies"
                    :error="$errors->first('mas_regency_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_village_code"
                    label="Desa"
                    :options="$villages"
                    :error="$errors->first('mas_village_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_upt_code"
                    label="UPT"
                    :options="$upts"
                    :error="$errors->first('mas_upt_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_uptd_code"
                    label="UPTD"
                    :options="$uptds"
                    :error="$errors->first('mas_uptd_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_device_parameter_code"
                    label="Parameter Device"
                    :options="$deviceParameters"
                    :error="$errors->first('mas_device_parameter_code')"
                />

                <x-admin.form-input
                    type="text"
                    name="code"
                    label="Kode"
                    placeholder="Optional code"
                    :error="$errors->first('code')"
                />

                <x-admin.form-input
                    type="number"
                    name="value_min"
                    label="Nilai Min"
                    step="0.01"
                    placeholder="0.00"
                    :error="$errors->first('value_min')"
                />

                <x-admin.form-input
                    type="number"
                    name="value_max"
                    label="Nilai Max"
                    step="0.01"
                    placeholder="0.00"
                    :error="$errors->first('value_max')"
                />

                <x-admin.form-input
                    type="text"
                    name="version"
                    label="Versi"
                    placeholder="v1.0"
                    :error="$errors->first('version')"
                />

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File GeoJSON</label>
                    <input type="file" name="file" accept=".json,.geojson"
                        class="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none">
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Format: JSON/GeoJSON, Maks: 50MB</p>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                    <textarea name="description" rows="3"
                        class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Deskripsi mapping..."></textarea>
                </div>
            </div>

            <x-slot:footer>
                <button type="button" class="px-4 py-2 border rounded-md dark:border-gray-600 dark:text-gray-300" @click="$dispatch('close-modal', 'mapping-create')">Batal</button>
                <x-admin.button type="submit" variant="primary" form="mappingCreateForm">
                    <i class="fas fa-check -ml-1 mr-2"></i>
                    Simpan
                </x-admin.button>
            </x-slot:footer>
        </form>
    </x-admin.modal>

    <!-- Modal Edit -->
    <x-admin.modal :show="false" name="mapping-edit" title="Edit GeoJSON Mapping" size="2xl" :close-on-backdrop="true">
        <form id="mappingEditForm" :action="editAction" method="POST" enctype="multipart/form-data" class="space-y-6">
            @csrf
            @method('PUT')
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                    <x-admin.form-input
                        type="text"
                        name="geojson_code"
                        label="Kode GeoJSON"
                        placeholder="GEOJSON-001"
                        required="true"
                        x-model="editData.geojson_code"
                        :error="$errors->first('geojson_code')"
                    />
                </div>

                <x-admin.form-input
                    type="select"
                    name="mas_device_code"
                    label="Device"
                    :options="$devices"
                    x-model="editData.mas_device_code"
                    :error="$errors->first('mas_device_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_river_basin_code"
                    label="DAS"
                    :options="$riverBasins"
                    x-model="editData.mas_river_basin_code"
                    :error="$errors->first('mas_river_basin_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_watershed_code"
                    label="DTA"
                    :options="$watersheds"
                    x-model="editData.mas_watershed_code"
                    :error="$errors->first('mas_watershed_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_city_code"
                    label="Kota"
                    :options="$cities"
                    x-model="editData.mas_city_code"
                    :error="$errors->first('mas_city_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_regency_code"
                    label="Kabupaten"
                    :options="$regencies"
                    x-model="editData.mas_regency_code"
                    :error="$errors->first('mas_regency_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_village_code"
                    label="Desa"
                    :options="$villages"
                    x-model="editData.mas_village_code"
                    :error="$errors->first('mas_village_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_upt_code"
                    label="UPT"
                    :options="$upts"
                    x-model="editData.mas_upt_code"
                    :error="$errors->first('mas_upt_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_uptd_code"
                    label="UPTD"
                    :options="$uptds"
                    x-model="editData.mas_uptd_code"
                    :error="$errors->first('mas_uptd_code')"
                />

                <x-admin.form-input
                    type="select"
                    name="mas_device_parameter_code"
                    label="Parameter Device"
                    :options="$deviceParameters"
                    x-model="editData.mas_device_parameter_code"
                    :error="$errors->first('mas_device_parameter_code')"
                />

                <x-admin.form-input
                    type="text"
                    name="code"
                    label="Kode"
                    placeholder="Optional code"
                    x-model="editData.code"
                    :error="$errors->first('code')"
                />

                <x-admin.form-input
                    type="number"
                    name="value_min"
                    label="Nilai Min"
                    step="0.01"
                    x-model="editData.value_min"
                    :error="$errors->first('value_min')"
                />

                <x-admin.form-input
                    type="number"
                    name="value_max"
                    label="Nilai Max"
                    step="0.01"
                    x-model="editData.value_max"
                    :error="$errors->first('value_max')"
                />

                <x-admin.form-input
                    type="text"
                    name="version"
                    label="Versi"
                    x-model="editData.version"
                    :error="$errors->first('version')"
                />

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File GeoJSON (Opsional - Ganti File)</label>
                    <input type="file" name="file" accept=".json,.geojson"
                        class="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none">
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Kosongkan jika tidak ingin mengganti file. Format: JSON/GeoJSON, Maks: 50MB</p>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                    <textarea name="description" rows="3" x-model="editData.description"
                        class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                </div>
            </div>

            <x-slot:footer>
                <button type="button" class="px-4 py-2 border rounded-md dark:border-gray-600 dark:text-gray-300" @click="$dispatch('close-modal', 'mapping-edit')">Batal</button>
                <x-admin.button type="submit" variant="primary" form="mappingEditForm">
                    <i class="fas fa-check -ml-1 mr-2"></i>
                    Perbarui
                </x-admin.button>
            </x-slot:footer>
        </form>
    </x-admin.modal>

</div>

@push('scripts')
<script>
function geojsonMappingsPage() {
    return {
        editData: {
            id: null,
            geojson_code: '',
            mas_device_code: '',
            mas_river_basin_code: '',
            mas_watershed_code: '',
            mas_city_code: '',
            mas_regency_code: '',
            mas_village_code: '',
            mas_upt_code: '',
            mas_uptd_code: '',
            mas_device_parameter_code: '',
            code: '',
            value_min: '',
            value_max: '',
            version: '',
            description: ''
        },
        editAction: '',
        init() {
            // Listener untuk aksi edit dari tabel
            window.addEventListener('open-edit-mapping', (e) => {
                const item = e.detail || {};
                this.openEdit(item);
            });
        },
        openCreate() {
            this.$dispatch('open-modal', 'mapping-create');
        },
        openEdit(item) {
            this.editData = {
                id: item.id,
                geojson_code: item.geojson_code,
                mas_device_code: item.mas_device_code,
                mas_river_basin_code: item.mas_river_basin_code,
                mas_watershed_code: item.mas_watershed_code,
                mas_city_code: item.mas_city_code,
                mas_regency_code: item.mas_regency_code,
                mas_village_code: item.mas_village_code,
                mas_upt_code: item.mas_upt_code,
                mas_uptd_code: item.mas_uptd_code,
                mas_device_parameter_code: item.mas_device_parameter_code,
                code: item.code,
                value_min: item.value_min,
                value_max: item.value_max,
                version: item.version,
                description: item.description
            };
            this.editAction = `${window.location.origin}/admin/geojson-mappings/${item.id}`;
            this.$dispatch('open-modal', 'mapping-edit');
        }
    }
}
</script>
@endpush
@endsection
