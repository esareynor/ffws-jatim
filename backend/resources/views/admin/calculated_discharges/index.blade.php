@extends('layouts.admin')

@section('title', 'Calculated Discharge')
@section('page-title', 'Calculated Discharge')
@section('page-description', 'Data debit terhitung berdasarkan tinggi muka air dan rating curve')
@section('breadcrumb', 'Calculated Discharge')

@section('content')
<div>
    <!-- Header with Create Button -->
    <div class="flex justify-between items-center mb-4">
        <div></div>
        <a
            href="{{ route('admin.calculated-discharges.create') }}"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors inline-flex items-center"
        >
            <i class="fas fa-plus mr-2"></i>Tambah Data
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
