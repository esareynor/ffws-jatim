@extends('layouts.admin')

@section('title', $title ?? 'Master Data')
@section('page-title', $title ?? 'Master Data')
@section('page-description', $description ?? 'Manage master data')

@section('content')
<div class="space-y-6">
    <!-- Filter Section -->
    @if(isset($filterConfig))
        <x-filter-bar 
            :title="'Filter & Search ' . ($title ?? 'Data')"
            :filters="$filterConfig"
            :action="$filterAction ?? '#'"
            gridCols="md:grid-cols-3"
        />
    @endif

    <x-table
        :title="'List of ' . ($title ?? 'Data')"
        :headers="$tableHeaders"
        :rows="$items"
        searchable
        :searchPlaceholder="'Search ' . strtolower($title ?? 'data') . '...'"
    >
        <x-slot:actions>
            @if(isset($createRoute))
                <x-admin.button type="button" variant="primary" @click="$dispatch('open-modal', '{{ $modalName ?? 'create-modal' }}')">
                    <i class="fa-solid fa-plus -ml-1 mr-2"></i>
                    Add {{ $singularTitle ?? 'Item' }}
                </x-admin.button>
            @endif
        </x-slot:actions>
    </x-table>

    <!-- Create/Edit Modal -->
    @if(isset($modalForm))
        {!! $modalForm !!}
    @endif
</div>

@if(isset($customScripts))
    @push('scripts')
        {!! $customScripts !!}
    @endpush
@endif
@endsection

