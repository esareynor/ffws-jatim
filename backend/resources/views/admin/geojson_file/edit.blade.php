@extends('layouts.admin')

@section('title', 'Edit GeoJSON File')
@section('page-title', 'Edit GeoJSON File')
@section('page-description', 'Edit informasi file GeoJSON')
@section('breadcrumb', 'GeoJSON Files')

@section('content')
<div class="space-y-6">
    <!-- Back Button -->
    <div class="flex items-center">
        <a href="{{ route('admin.geojson-files.index') }}" 
           class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="fas fa-arrow-left mr-2"></i>
            Kembali ke Daftar GeoJSON Files
        </a>
    </div>

    <x-admin.card 
        title="Edit File GeoJSON"
        subtitle="Ubah informasi file GeoJSON"
    >
        <form action="{{ route('admin.geojson-files.update', $geojsonFile->id) }}" method="POST" class="space-y-6">
            @csrf
            @method('PUT')
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="original_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nama File Asli
                    </label>
                    <input type="text" 
                           id="original_name" 
                           value="{{ $geojsonFile->original_name }}"
                           disabled
                           class="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm py-2">
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Nama file tidak dapat diubah
                    </p>
                </div>

                <div>
                    <label for="size" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ukuran File
                    </label>
                    <input type="text" 
                           id="size" 
                           value="{{ number_format($geojsonFile->size / 1024, 2) }} KB"
                           disabled
                           class="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm py-2">
                </div>

                <div>
                    <label for="mime_type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipe File
                    </label>
                    <input type="text" 
                           id="mime_type" 
                           value="{{ $geojsonFile->mime_type }}"
                           disabled
                           class="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm py-2">
                </div>

                <div>
                    <label for="created_at" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tanggal Upload
                    </label>
                    <input type="text" 
                           id="created_at" 
                           value="{{ $geojsonFile->created_at->format('d M Y H:i') }}"
                           disabled
                           class="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm py-2">
                </div>
            </div>

            <div>
                <label for="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Label
                </label>
                <input type="text" 
                       id="label" 
                       name="label" 
                       value="{{ old('label', $geojsonFile->label) }}"
                       placeholder="Masukkan label untuk file ini..."
                       class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-[#18181b] dark:text-white sm:text-sm">
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Label untuk memudahkan identifikasi file (misal: "Kontur Sungai", "Batas Administrasi", dll)
                </p>
                @error('label')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            @if($geojsonFile->sha256)
            <div class="bg-gray-50 dark:bg-[#18181b] rounded-lg p-4">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    File Hash (SHA256)
                </h3>
                <code class="text-xs text-gray-600 dark:text-gray-400 break-all">{{ $geojsonFile->sha256 }}</code>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Hash untuk verifikasi integritas file
                </p>
            </div>
            @endif

            <div class="flex items-center justify-end space-x-3">
                <a href="{{ route('admin.geojson-files.index') }}" 
                   class="bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                    Batal
                </a>
                <button type="submit" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                    <i class="fas fa-save -ml-1 mr-2"></i>
                    Simpan Perubahan
                </button>
            </div>
        </form>
    </x-admin.card>
</div>
@endsection
