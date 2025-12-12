@extends('layouts.admin')

@section('title', 'Predicted Discharge')
@section('page-title', 'Predicted Discharge')
@section('page-description', 'Data debit prediksi berdasarkan prediksi tinggi muka air')
@section('breadcrumb', 'Predicted Discharge')

@section('content')
<div>
    <!-- Header with Create Button -->
    <div class="flex justify-between items-center mb-4">
        <div></div>
        <a
            href="{{ route('admin.predicted-discharges.create') }}"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors inline-flex items-center"
        >
            <i class="fas fa-plus mr-2"></i>Tambah Prediksi
        </a>
    </div>

    <!-- Filter Bar -->
    <x-filter-bar
        :config="$filterConfig"
        searchPlaceholder="Cari sensor atau discharge..."
    />

    <!-- Table -->
    <div class="card-dark rounded-lg shadow-sm overflow-hidden">
        <x-table
            :headers="$tableHeaders"
            :rows="$rows"
            :pagination="$pagination"
        />
    </div>
</div>
@endsection
