@extends('layouts.admin')

@section('title', 'Device Media & CCTV')

@section('content')
<div class="container-fluid px-4 py-6" x-data="deviceMediaManager()">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Device Media & CCTV Management</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage device photos, videos, and CCTV streams</p>
        </div>
        <div class="flex space-x-3">
            <x-admin.button type="button" variant="primary" @click="openUploadModal()">
                <i class="fas fa-upload mr-2"></i>
                Upload Media
            </x-admin.button>
            <x-admin.button href="{{ route('admin.device-cctv.index') }}" variant="secondary">
                <i class="fas fa-video mr-2"></i>
                CCTV Config
            </x-admin.button>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-blue-700 dark:text-blue-300 mb-1">Total Media</p>
                    <p class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ $stats['total'] }}</p>
                </div>
                <div class="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-3">
                    <i class="fas fa-photo-video text-blue-600 dark:text-blue-400 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-green-700 dark:text-green-300 mb-1">Images</p>
                    <p class="text-2xl font-bold text-green-900 dark:text-green-100">{{ $stats['images'] }}</p>
                </div>
                <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-3">
                    <i class="fas fa-image text-green-600 dark:text-green-400 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-purple-700 dark:text-purple-300 mb-1">Videos</p>
                    <p class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ $stats['videos'] }}</p>
                </div>
                <div class="bg-purple-100 dark:bg-purple-900/40 rounded-lg p-3">
                    <i class="fas fa-video text-purple-600 dark:text-purple-400 text-xl"></i>
                </div>
            </div>
        </div>

        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-orange-700 dark:text-orange-300 mb-1">Documents</p>
                    <p class="text-2xl font-bold text-orange-900 dark:text-orange-100">{{ $stats['documents'] }}</p>
                </div>
                <div class="bg-orange-100 dark:bg-orange-900/40 rounded-lg p-3">
                    <i class="fas fa-file-alt text-orange-600 dark:text-orange-400 text-xl"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    @php
        $filterConfig = [
            [
                'type' => 'text',
                'name' => 'search',
                'label' => 'Cari',
                'placeholder' => 'Cari media...'
            ],
            [
                'type' => 'select',
                'name' => 'media_type',
                'label' => 'Tipe Media',
                'empty_option' => 'Semua Tipe',
                'options' => [
                    ['value' => 'image', 'label' => 'Images'],
                    ['value' => 'video', 'label' => 'Videos'],
                    ['value' => 'document', 'label' => 'Documents'],
                    ['value' => 'cctv_snapshot', 'label' => 'CCTV Snapshots']
                ]
            ],
            [
                'type' => 'select',
                'name' => 'device_code',
                'label' => 'Device',
                'empty_option' => 'Semua Device',
                'options' => $devices->map(function($device) {
                    return ['value' => $device->code, 'label' => $device->name];
                })->toArray()
            ],
            [
                'type' => 'select',
                'name' => 'visibility',
                'label' => 'Visibility',
                'empty_option' => 'Semua Visibility',
                'options' => [
                    ['value' => 'public', 'label' => 'Public'],
                    ['value' => 'private', 'label' => 'Private']
                ]
            ]
        ];
    @endphp

    <x-filter-bar 
        title="Filter & Pencarian Device Media"
        :filters="$filterConfig"
        :action="route('admin.device-media.index')"
        gridCols="md:grid-cols-4"
    />

    <!-- Media Grid -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        @if($media->count() > 0)
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @foreach($media as $item)
            <div class="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition">
                <!-- Media Preview -->
                <div class="aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    @if($item->isImage())
                        <img src="{{ $item->url }}" alt="{{ $item->title }}" class="w-full h-full object-cover">
                    @elseif($item->isVideo())
                        <div class="relative w-full h-full">
                            <video class="w-full h-full object-cover">
                                <source src="{{ $item->url }}" type="{{ $item->mime_type }}">
                            </video>
                            <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <i class="fas fa-play-circle text-white text-4xl"></i>
                            </div>
                        </div>
                    @else
                        <i class="fas {{ $item->media_type_icon }} text-4xl text-gray-400"></i>
                    @endif
                </div>

                <!-- Media Info -->
                <div class="p-3">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1 min-w-0">
                            <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {{ $item->title ?: $item->file_name }}
                            </h3>
                            <p class="text-xs text-gray-500 truncate">{{ $item->device->name ?? 'Unknown Device' }}</p>
                        </div>
                        @if($item->is_primary)
                        <span class="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Primary
                        </span>
                        @endif
                    </div>

                    <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{{ $item->file_size_human }}</span>
                        <span>{{ $item->created_at->format('d M Y') }}</span>
                    </div>

                    <!-- Actions -->
                    <div class="flex space-x-2">
                        <x-admin.button type="button" variant="secondary" size="sm" @click="viewMedia({{ json_encode($item) }})" class="flex-1">
                            <i class="fas fa-eye"></i>
                        </x-admin.button>
                        <x-admin.button type="button" variant="primary" size="sm" @click="editMedia({{ json_encode($item) }})" class="flex-1">
                            <i class="fas fa-edit"></i>
                        </x-admin.button>
                        <x-admin.button href="{{ route('admin.device-media.download', $item->id) }}" variant="success" size="sm" class="flex-1">
                            <i class="fas fa-download"></i>
                        </x-admin.button>
                        <x-admin.button type="button" variant="danger" size="sm" @click="deleteMedia({{ $item->id }})" class="flex-1">
                            <i class="fas fa-trash"></i>
                        </x-admin.button>
                    </div>
                </div>

                <!-- Badges -->
                <div class="absolute top-2 left-2">
                    <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {{ $item->media_type_label }}
                    </span>
                </div>
            </div>
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="mt-6">
            {{ $media->links() }}
        </div>
        @else
        <div class="text-center py-12">
            <i class="fas fa-photo-video text-5xl text-gray-300 mb-4"></i>
            <p class="text-gray-500">No media files found</p>
            <x-admin.button type="button" variant="primary" @click="openUploadModal()" class="mt-4">
                <i class="fas fa-upload mr-2"></i>
                Upload Your First Media
            </x-admin.button>
        </div>
        @endif
    </div>

    <!-- Upload Modal -->
    <x-admin.modal 
        size="lg"
        name="upload-media-modal">
        <x-slot name="title">
            Upload Media
        </x-slot>
        
        <form action="{{ route('admin.device-media.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Device <span class="text-red-500">*</span>
                    </label>
                    <select name="mas_device_code" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Device</option>
                        @foreach($devices as $device)
                        <option value="{{ $device->code }}">{{ $device->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Media Type <span class="text-red-500">*</span>
                    </label>
                    <select name="media_type" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                        <option value="cctv_snapshot">CCTV Snapshot</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Captured At
                    </label>
                    <input type="datetime-local" name="captured_at"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                    </label>
                    <input type="text" name="title"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea name="description" rows="3"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        File <span class="text-red-500">*</span>
                    </label>
                    <input type="file" name="file" required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <p class="text-xs text-gray-500 mt-1">Max size: 50MB</p>
                </div>

                <div class="col-span-2 flex space-x-4">
                    <label class="flex items-center">
                        <input type="checkbox" name="is_primary" value="1" class="rounded">
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Set as Primary</span>
                    </label>

                    <label class="flex items-center">
                        <input type="checkbox" name="is_public" value="1" checked class="rounded">
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Public</span>
                    </label>
                </div>
            </div>

            <x-slot name="footer">
                <x-admin.button type="button" variant="secondary" @click="$dispatch('close-modal', 'upload-media-modal')">Cancel</x-admin.button>
                <x-admin.button type="submit" variant="primary">Upload</x-admin.button>
            </x-slot>
        </form>
    </x-admin.modal>

    <!-- Edit Modal -->
    <x-admin.modal 
        size="md"
        name="edit-media-modal">
        <x-slot name="title">
            Edit Media
        </x-slot>
        
        <form :action="'/admin/device-media/' + editingId" method="POST">
            @csrf
            @method('PUT')
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input type="text" name="title" x-model="editForm.title"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea name="description" x-model="editForm.description" rows="3"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Captured At</label>
                    <input type="datetime-local" name="captured_at" x-model="editForm.captured_at"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                </div>

                <div class="flex space-x-4">
                    <label class="flex items-center">
                        <input type="checkbox" name="is_primary" x-model="editForm.is_primary" value="1" class="rounded">
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Set as Primary</span>
                    </label>

                    <label class="flex items-center">
                        <input type="checkbox" name="is_public" x-model="editForm.is_public" value="1" class="rounded">
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Public</span>
                    </label>
                </div>
            </div>

            <x-slot name="footer">
                <x-admin.button type="button" variant="secondary" @click="$dispatch('close-modal', 'edit-media-modal')">Cancel</x-admin.button>
                <x-admin.button type="submit" variant="primary">Update</x-admin.button>
            </x-slot>
        </form>
    </x-admin.modal>

    <!-- View Modal -->
    <x-admin.modal 
        size="xl"
        name="view-media-modal">
        <x-slot name="title">
            <span x-text="viewingMedia.title || viewingMedia.file_name"></span>
        </x-slot>
        
        <div class="mb-4">
            <template x-if="viewingMedia.media_type === 'image' || viewingMedia.media_type === 'cctv_snapshot'">
                <img :src="viewingMedia.url" :alt="viewingMedia.title" class="w-full rounded-lg">
            </template>
            <template x-if="viewingMedia.media_type === 'video'">
                <video controls class="w-full rounded-lg">
                    <source :src="viewingMedia.url" :type="viewingMedia.mime_type">
                </video>
            </template>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
                <span class="text-gray-500">Device:</span>
                <span class="font-medium" x-text="viewingMedia.device?.name"></span>
            </div>
            <div>
                <span class="text-gray-500">Type:</span>
                <span class="font-medium" x-text="viewingMedia.media_type_label"></span>
            </div>
            <div>
                <span class="text-gray-500">Size:</span>
                <span class="font-medium" x-text="viewingMedia.file_size_human"></span>
            </div>
            <div>
                <span class="text-gray-500">Uploaded:</span>
                <span class="font-medium" x-text="viewingMedia.created_at"></span>
            </div>
        </div>

        <div class="mt-4" x-show="viewingMedia.description">
            <p class="text-sm text-gray-600 dark:text-gray-400" x-text="viewingMedia.description"></p>
        </div>

        <x-slot name="footer">
            <x-admin.button type="button" variant="secondary" @click="$dispatch('close-modal', 'view-media-modal')">Close</x-admin.button>
        </x-slot>
    </x-admin.modal>
</div>

<script>
function deviceMediaManager() {
    return {
        editingId: null,
        editForm: {},
        viewingMedia: {},
        
        openUploadModal() {
            this.$dispatch('open-modal', 'upload-media-modal');
        },
        
        editMedia(media) {
            this.editingId = media.id;
            this.editForm = {
                title: media.title || '',
                description: media.description || '',
                captured_at: media.captured_at || '',
                is_primary: media.is_primary,
                is_public: media.is_public
            };
            this.$dispatch('open-modal', 'edit-media-modal');
        },
        
        viewMedia(media) {
            this.viewingMedia = media;
            this.$dispatch('open-modal', 'view-media-modal');
        },
        
        async deleteMedia(id) {
            const confirmed = await window.AdminUtils?.confirmDelete('File media ini akan dihapus secara permanen. Lanjutkan?');
            
            if (confirmed) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `/admin/device-media/${id}`;
                form.innerHTML = `
                    @csrf
                    @method('DELETE')
                `;
                document.body.appendChild(form);
                form.submit();
            }
        }
    }
}
</script>
@endsection
