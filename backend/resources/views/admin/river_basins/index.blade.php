@extends('layouts.admin')

@section('title', 'Wilayah Sungai')
@section('page-title', 'Wilayah Sungai')
@section('page-description', 'Kelola data Wilayah Sungai')
@section('breadcrumb', 'Wilayah Sungai')

@section('content')
<div class="space-y-6" x-data="riverBasinsPage()" x-init="init()">

    <!-- Filter Section -->
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari Wilayah Sungai',
                'placeholder' => 'Cari berdasarkan nama atau kode Wilayah Sungai...'
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
        title="Filter & Pencarian Wilayah Sungai"
        :filters="$filterConfig"
        :action="route('admin.region.river-basins.index')"
        gridCols="md:grid-cols-2"
        compact="true"
    />

    <x-table
        title="Daftar Wilayah Sungai"
        :headers="$tableHeaders"
        :rows="$riverBasins"
        searchable
        :pagination="$riverBasins->links()"
    >
        <x-slot:actions>
            <x-admin.button type="button" variant="primary" @click="openCreate()">
                <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                Tambah Wilayah Sungai
            </x-admin.button>
        </x-slot:actions>
    </x-table>

    <!-- Modal Create -->
    <x-admin.modal :show="false" name="river-basin-create" title="Tambah Wilayah Sungai" size="md" :close-on-backdrop="true">
        <form id="rbCreateForm" x-ref="createForm" action="{{ route('admin.region.river-basins.store') }}" method="POST" class="space-y-6">
            @csrf
            <input type="hidden" name="context" value="create" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <x-admin.form-input
                    type="text"
                    name="name"
                    label="Nama Wilayah Sungai"
                    placeholder="Contoh: Brantas"
                    required="true"
                    :error="$errors->first('name')"
                />
                <x-admin.form-input
                    type="text"
                    name="code"
                    label="Kode Wilayah Sungai"
                    placeholder="Contoh: WS-BRANTAS"
                    required="true"
                    :error="$errors->first('code')"
                />
            </div>
            <x-slot:footer>
                <button type="button" class="px-4 py-2 border rounded-md" @click="$dispatch('close-modal', 'river-basin-create')">Batal</button>
                <x-admin.button type="submit" variant="primary" form="rbCreateForm">
                    <i class="fas fa-check -ml-1 mr-2"></i>
                    Simpan
                </x-admin.button>
            </x-slot:footer>
        </form>
    </x-admin.modal>

    <!-- Modal Edit -->
    <x-admin.modal :show="false" name="river-basin-edit" title="Edit Wilayah Sungai" size="md" :close-on-backdrop="true">
        <form id="rbEditForm" x-ref="editForm" :action="editAction" method="POST" class="space-y-6">
            @csrf
            @method('PUT')
            <input type="hidden" name="context" value="edit" />
            <input type="hidden" name="id" :value="editData.id" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <x-admin.form-input
                    type="text"
                    name="name"
                    label="Nama Wilayah Sungai"
                    x-model="editData.name"
                    required="true"
                    :error="$errors->first('name')"
                />
                <x-admin.form-input
                    type="text"
                    name="code"
                    label="Kode Wilayah Sungai"
                    x-model="editData.code"
                    required="true"
                    :error="$errors->first('code')"
                />
            </div>
            <x-slot:footer>
                <button type="button" class="px-4 py-2 border rounded-md" @click="$dispatch('close-modal', 'river-basin-edit')">Batal</button>
                <x-admin.button type="submit" variant="primary" form="rbEditForm">
                    <i class="fas fa-check -ml-1 mr-2"></i>
                    Update
                </x-admin.button>
            </x-slot:footer>
        </form>
    </x-admin.modal>
</div>

@push('scripts')
<script>
function riverBasinsPage() {
    return {
        editData: { id: null, name: '', code: '' },
        editAction: '',
        init() {
            // Listener untuk aksi edit dari tabel
            window.addEventListener('open-edit-river-basin', (e) => {
                const item = e.detail || {};
                this.openEdit(item);
            });
        },
        openCreate() {
            this.$dispatch('open-modal', 'river-basin-create');
        },
        openEdit(item) {
            this.editData = { id: item.id, name: item.name, code: item.code };
            this.editAction = `${window.location.origin}/admin/region/river-basins/${item.id}`;
            this.$dispatch('open-modal', 'river-basin-edit');
        }
    }
}
</script>
@endpush
@endsection
