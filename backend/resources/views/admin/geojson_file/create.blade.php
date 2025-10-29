@extends('layouts.admin')

@section('title', 'Upload GeoJSON File')
@section('page-title', 'Upload GeoJSON File')
@section('page-description', 'Upload file GeoJSON untuk sistem peringatan banjir')
@section('breadcrumb', 'GeoJSON Files')

@section('content')
<div class="space-y-6">
    <x-admin.card 
        title="Upload File GeoJSON"
        subtitle="Upload file GeoJSON untuk mengimport data geospasial ke sistem"
    >
        <form action="{{ route('admin.geojson-files.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
            @csrf
            
            <div>
                <label for="file" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    File GeoJSON <span class="text-red-500">*</span>
                </label>
                <input type="file" 
                       id="file" 
                       name="file" 
                       accept=".json,.geojson"
                       required
                       class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300">
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Pilih file GeoJSON yang berisi data geospasial. Format yang didukung: .json, .geojson (Maksimal 50MB)
                </p>
                @error('file')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Label (Opsional)
                </label>
                <input type="text" 
                       id="label" 
                       name="label" 
                       value="{{ old('label') }}"
                       placeholder="Masukkan label untuk file ini..."
                       class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#18181b] dark:text-white sm:text-sm">
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Label untuk memudahkan identifikasi file (misal: "Kontur Sungai", "Batas Administrasi", dll)
                </p>
                @error('label')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
                
            @if(session('error'))
                <div class="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-circle text-red-400"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-800 dark:text-red-200">{{ session('error') }}</p>
                        </div>
                    </div>
                </div>
            @endif

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Informasi Format File
                        </h3>
                        <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <p>File GeoJSON harus memiliki struktur yang valid:</p>
                            <ul class="list-disc list-inside mt-1 space-y-1">
                                <li>Format GeoJSON standar dengan property <code>type</code> dan <code>features</code></li>
                                <li>Setiap feature harus memiliki <code>geometry</code> dan <code>properties</code></li>
                                <li>Mendukung tipe geometri: Point, LineString, Polygon, MultiPolygon, dll</li>
                                <li>Ukuran file maksimal 50MB</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-end space-x-3">
                <a href="{{ route('admin.geojson-files.index') }}" 
                   class="bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                    Batal
                </a>
                <button type="submit" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                    <i class="fas fa-upload -ml-1 mr-2"></i>
                    Upload File
                </button>
            </div>
        </form>
    </x-admin.card>
</div>
@endsection

