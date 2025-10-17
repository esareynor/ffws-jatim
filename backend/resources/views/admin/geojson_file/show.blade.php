@extends('layouts.admin')

@section('title', 'Detail GeoJSON File')
@section('page-title', 'Detail GeoJSON File')
@section('page-description', 'Lihat detail file GeoJSON')
@section('breadcrumb', 'GeoJSON Files')

@section('content')
<div class="space-y-6">
    <!-- File Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Information -->
        <x-admin.card title="Informasi File">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Nama File</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ $geojsonFile->original_name }}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Label</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ $geojsonFile->label ?? '-' }}</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Ukuran</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ number_format($geojsonFile->size / 1024, 2) }} KB 
                        <span class="text-gray-500">({{ number_format($geojsonFile->size) }} bytes)</span>
                    </p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Tipe MIME</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ $geojsonFile->mime_type }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Storage Disk</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ $geojsonFile->disk }}</p>
                </div>
            </div>
        </x-admin.card>

        <!-- File Security & Timestamps -->
        <x-admin.card title="Informasi Sistem">
            <div class="space-y-4">
                @if($geojsonFile->sha256)
                <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">SHA256 Hash</label>
                    <div class="mt-1 flex items-center gap-2">
                        <code class="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#18181b] px-2 py-1 rounded break-all">
                            {{ substr($geojsonFile->sha256, 0, 16) }}...
                        </code>
                        <button type="button" 
                                onclick="copyToClipboard('{{ $geojsonFile->sha256 }}')" 
                                class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                @endif
                
                <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Upload</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ $geojsonFile->created_at->format('d M Y H:i:s') }}
                    </p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Terakhir Diperbarui</label>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ $geojsonFile->updated_at->format('d M Y H:i:s') }}
                    </p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Path Storage</label>
                    <p class="mt-1 text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-[#18181b] px-2 py-1 rounded">
                        {{ $geojsonFile->stored_path }}
                    </p>
                </div>
            </div>
        </x-admin.card>
    </div>

    <!-- File Preview -->
    @if(\Illuminate\Support\Facades\Storage::disk($geojsonFile->disk)->exists($geojsonFile->stored_path))
    <x-admin.card title="Preview File">
        <div class="bg-gray-50 dark:bg-[#18181b] rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">Konten GeoJSON</h4>
                <div class="flex gap-2">
                    <button type="button" 
                            onclick="copyFileContent()" 
                            class="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <i class="fas fa-copy mr-1"></i>
                        Copy
                    </button>
                    <a href="{{ route('admin.geojson-files.download', $geojsonFile) }}" 
                       class="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                        <i class="fas fa-download mr-1"></i>
                        Download
                    </a>
                </div>
            </div>
            <div class="h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                <pre id="file-content" class="text-xs text-gray-600 dark:text-gray-300 p-3 m-0 whitespace-pre-wrap">{{ \Illuminate\Support\Facades\Storage::disk($geojsonFile->disk)->get($geojsonFile->stored_path) }}</pre>
            </div>
        </div>
    </x-admin.card>
    @endif

    <!-- Actions -->
    <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <x-admin.button 
                href="{{ route('admin.geojson-files.index') }}" 
                variant="outline"
            >
                <i class="fas fa-arrow-left -ml-1 mr-2"></i>
                Kembali
            </x-admin.button>
        </div>

        <div class="flex items-center space-x-3">
            <x-admin.button 
                href="{{ route('admin.geojson-files.download', $geojsonFile) }}" 
                variant="outline"
            >
                <i class="fas fa-download -ml-1 mr-2"></i>
                Download
            </x-admin.button>
            <x-admin.button 
                href="{{ route('admin.geojson-files.edit', $geojsonFile) }}" 
                variant="primary"
            >
                <i class="fas fa-edit -ml-1 mr-2"></i>
                Edit
            </x-admin.button>
            <form action="{{ route('admin.geojson-files.destroy', $geojsonFile) }}" 
                  method="POST" 
                  class="inline"
                  onsubmit="return confirm('Apakah Anda yakin ingin menghapus file ini?')">
                @csrf
                @method('DELETE')
                <x-admin.button type="submit" variant="danger">
                    <i class="fas fa-trash -ml-1 mr-2"></i>
                    Hapus
                </x-admin.button>
            </form>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast('Hash berhasil disalin ke clipboard', 'success');
    }).catch(function(err) {
        console.error('Error copying text: ', err);
        fallbackCopy(text);
    });
}

function copyFileContent() {
    const element = document.getElementById('file-content');
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(function() {
        showToast('Konten file berhasil disalin ke clipboard', 'success');
    }).catch(function(err) {
        console.error('Error copying text: ', err);
        fallbackCopy(text);
    });
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast('Berhasil disalin ke clipboard', 'success');
}

function showToast(message, type) {
    // Simple toast implementation - you can replace with your preferred toast library
    if (window.AdminUtils && window.AdminUtils.showToast) {
        window.AdminUtils.showToast(message, type);
    } else {
        alert(message);
    }
}
</script>
@endpush
