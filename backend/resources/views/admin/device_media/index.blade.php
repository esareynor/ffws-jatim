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
            <button @click="openUploadModal()" class="btn btn-primary">
                <i class="fas fa-upload mr-2"></i>
                Upload Media
            </button>
            <a href="{{ route('admin.device-cctv.index') }}" class="btn btn-secondary">
                <i class="fas fa-video mr-2"></i>
                CCTV Config
            </a>
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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <form method="GET" class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search media..."
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
            
            <select name="media_type" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Types</option>
                <option value="image" {{ request('media_type') == 'image' ? 'selected' : '' }}>Images</option>
                <option value="video" {{ request('media_type') == 'video' ? 'selected' : '' }}>Videos</option>
                <option value="document" {{ request('media_type') == 'document' ? 'selected' : '' }}>Documents</option>
                <option value="cctv_snapshot" {{ request('media_type') == 'cctv_snapshot' ? 'selected' : '' }}>CCTV Snapshots</option>
            </select>

            <select name="device_code" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Devices</option>
                @foreach($devices as $device)
                <option value="{{ $device->code }}" {{ request('device_code') == $device->code ? 'selected' : '' }}>
                    {{ $device->name }}
                </option>
                @endforeach
            </select>

            <select name="visibility" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Visibility</option>
                <option value="public" {{ request('visibility') == 'public' ? 'selected' : '' }}>Public</option>
                <option value="private" {{ request('visibility') == 'private' ? 'selected' : '' }}>Private</option>
            </select>

            <button type="submit" class="btn btn-primary">
                <i class="fas fa-search mr-2"></i>
                Filter
            </button>
        </form>
    </div>

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
                        <button @click="viewMedia({{ json_encode($item) }})" class="flex-1 btn btn-sm btn-secondary">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button @click="editMedia({{ json_encode($item) }})" class="flex-1 btn btn-sm btn-primary">
                            <i class="fas fa-edit"></i>
                        </button>
                        <a href="{{ route('admin.device-media.download', $item->id) }}" class="flex-1 btn btn-sm btn-success">
                            <i class="fas fa-download"></i>
                        </a>
                        <button @click="deleteMedia({{ $item->id }})" class="flex-1 btn btn-sm btn-danger">
                            <i class="fas fa-trash"></i>
                        </button>
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
            <button @click="openUploadModal()" class="mt-4 btn btn-primary">
                <i class="fas fa-upload mr-2"></i>
                Upload Your First Media
            </button>
        </div>
        @endif
    </div>

    <!-- Upload Modal -->
    <div x-show="showUploadModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showUploadModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Media</h3>
                
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

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showUploadModal = false" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Upload</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div x-show="showEditModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showEditModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Media</h3>
                
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

                    <div class="mt-6 flex justify-end space-x-3">
                        <button type="button" @click="showEditModal = false" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- View Modal -->
    <div x-show="showViewModal" x-cloak class="fixed inset-0 z-50 overflow-y-auto" style="display: none;">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="showViewModal = false"></div>
            
            <div class="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4" x-text="viewingMedia.title || viewingMedia.file_name"></h3>
                
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

                <div class="mt-6 flex justify-end">
                    <button type="button" @click="showViewModal = false" class="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function deviceMediaManager() {
    return {
        showUploadModal: false,
        showEditModal: false,
        showViewModal: false,
        editingId: null,
        editForm: {},
        viewingMedia: {},
        
        openUploadModal() {
            this.showUploadModal = true;
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
            this.showEditModal = true;
        },
        
        viewMedia(media) {
            this.viewingMedia = media;
            this.showViewModal = true;
        },
        
        async deleteMedia(id) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "This will permanently delete the media file",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });
            
            if (result.isConfirmed) {
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
