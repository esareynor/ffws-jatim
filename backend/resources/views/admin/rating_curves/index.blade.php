@extends('layouts.admin')

@section('title', 'Rating Curves')
@section('page-title', 'Rating Curves')
@section('page-description', 'Kelola rating curves untuk perhitungan debit')

@section('content')
<div class="space-y-6" x-data="ratingCurvesPage()" x-init="init()">

    <!-- Filter Section -->
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari Rating Curve',
                'placeholder' => 'Cari berdasarkan sensor...'
            ],
            [
                'type' => 'select',
                'name' => 'sensor_code',
                'label' => 'Sensor',
                'empty_option' => 'Semua Sensor',
                'options' => $sensors->toArray()
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
        title="Filter & Pencarian Rating Curves"
        :filters="$filterConfig"
        :action="route('admin.rating-curves.index')"
        gridCols="md:grid-cols-3"
    />

    <x-table
        title="Daftar Rating Curves"
        :headers="$tableHeaders"
        :rows="$ratingCurves"
        searchable
        searchPlaceholder="Cari rating curve..."
    >
        <x-slot:actions>
            <a href="{{ route('admin.rating-curves.create') }}">
                <x-admin.button type="button" variant="primary">
                    <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                    Tambah Rating Curve
                </x-admin.button>
            </a>
        </x-slot:actions>
    </x-table>

    <!-- Modal Calculate Discharge -->
    <x-admin.modal :show="false" name="rating-curve-calculate" title="Calculate Discharge" size="lg">
        <div class="space-y-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Formula</h4>
                <p class="text-blue-800 dark:text-blue-200 font-mono" x-text="calculateData.formula"></p>
            </div>
            
            <x-admin.form-input 
                type="number" 
                name="water_level" 
                label="Water Level (H)" 
                placeholder="Enter water level in meters" 
                step="0.01"
                x-model="calculateData.waterLevel"
            />
            
            <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg" x-show="calculateData.result !== null">
                <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Result</h4>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    <span x-text="calculateData.result"></span> m³/s
                </p>
            </div>
        </div>
        
        <x-slot:footer>
            <button type="button" class="px-4 py-2 border rounded-md" @click="$dispatch('close-modal', 'rating-curve-calculate')">Close</button>
            <x-admin.button type="button" variant="primary" @click="performCalculation()">
                <i class="fas fa-calculator -ml-1 mr-2"></i>
                Calculate
            </x-admin.button>
        </x-slot:footer>
    </x-admin.modal>

</div>

@push('scripts')
<script>
function ratingCurvesPage() {
    return {
        calculateData: {
            id: null,
            formula: '',
            coefficient_c: 0,
            exponent_b: 0,
            offset_a: 0,
            waterLevel: 0,
            result: null
        },
        
        init() {
            // Listen for calculate event
            window.addEventListener('open-calculate', (e) => {
                const item = e.detail || {};
                this.openCalculate(item);
            });
            
            // Listen for delete event
            window.addEventListener('delete-item', (e) => {
                const item = e.detail || {};
                this.deleteItem(item.id);
            });
        },
        
        openCalculate(item) {
            this.calculateData = {
                id: item.id,
                formula: item.formula,
                coefficient_c: parseFloat(item.coefficient_c),
                exponent_b: parseFloat(item.exponent_b),
                offset_a: parseFloat(item.offset_a),
                waterLevel: 0,
                result: null
            };
            this.$dispatch('open-modal', 'rating-curve-calculate');
        },
        
        performCalculation() {
            const H = parseFloat(this.calculateData.waterLevel);
            const C = this.calculateData.coefficient_c;
            const B = this.calculateData.exponent_b;
            const A = this.calculateData.offset_a;
            
            if (isNaN(H)) {
                alert('Please enter a valid water level');
                return;
            }
            
            // Q = C × (H - A)^B
            const discharge = C * Math.pow((H - A), B);
            this.calculateData.result = discharge.toFixed(4);
        },
        
        deleteItem(id) {
            if (confirm('Are you sure you want to delete this rating curve?')) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/admin/rating-curves/${id}`;
                
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = '_token';
                csrfInput.value = csrfToken;
                
                const methodInput = document.createElement('input');
                methodInput.type = 'hidden';
                methodInput.name = '_method';
                methodInput.value = 'DELETE';
                
                form.appendChild(csrfInput);
                form.appendChild(methodInput);
                document.body.appendChild(form);
                form.submit();
            }
        }
    }
}
</script>
@endpush
@endsection

