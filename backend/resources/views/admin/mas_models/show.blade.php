@extends('layouts.admin')

@section('title', 'Detail Model')
@section('page-title', 'Detail Model')
@section('page-description', 'Detail informasi model prediksi')
@section('breadcrumb', 'Model / Detail')

@section('content')
<div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ $model->name }}</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Detail informasi model prediksi</p>
        </div>
        <div class="flex space-x-3">
            <x-admin.button href="{{ route('admin.mas-models.form.edit', $model->id) }}" variant="primary">
                <i class="fas fa-edit -ml-1 mr-2"></i>
                Edit Model
            </x-admin.button>
            <x-admin.button href="{{ route('admin.mas-models.index') }}" variant="outline">
                <i class="fas fa-arrow-left -ml-1 mr-2"></i>
                Kembali
            </x-admin.button>
        </div>
    </div>

        <!-- Model Information -->
    <x-admin.card title="Informasi Model">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Nama Model</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $model->name }}</dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Tipe Model</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        @if($model->model_type === 'lstm') bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200
                        @elseif($model->model_type === 'gru') bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200
                        @elseif($model->model_type === 'transformer') bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200
                        @elseif($model->model_type === 'cnn') bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200
                        @elseif($model->model_type === 'rnn') bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200
                        @else bg-gray-100 text-gray-800 dark:bg-[#18181b] dark:text-gray-200
                        @endif">
                        {{ strtoupper($model->model_type) }}
                    </span>
                </dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Versi</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $model->version ?? '-' }}</dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        {{ $model->is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }}">
                        {{ $model->is_active ? 'Aktif' : 'Non-aktif' }}
                    </span>
                </dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Path File</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    @if($model->file_path)
                        <code class="bg-gray-100 dark:bg-[#18181b] px-2 py-1 rounded text-xs">{{ $model->file_path }}</code>
                    @else
                        -
                    @endif
                </dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Dibuat</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $model->created_at->format('d M Y H:i') }}</dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Diupdate</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ $model->updated_at->format('d M Y H:i') }}</dd>
            </div>
        </dl>
    </x-admin.card>

    <!-- Model Configuration -->
    <x-admin.card title="Konfigurasi Model">
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Jumlah Step Input</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    @if($model->n_steps_in)
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {{ $model->n_steps_in }} steps
                        </span>
                    @else
                        -
                    @endif
                </dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Jumlah Step Output</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    @if($model->n_steps_out)
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {{ $model->n_steps_out }} steps
                        </span>
                    @else
                        -
                    @endif
                </dd>
            </div>
        </dl>
    </x-admin.card>

    <!-- Description -->
    @if($model->description)
    <x-admin.card title="Deskripsi">
        <p class="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-line">{{ $model->description }}</p>
    </x-admin.card>
    @endif

    <!-- Related Sensors -->
    <x-admin.card title="Sensor Terkait" subtitle="Sensor yang menggunakan model ini">
        @if($model->sensors->count() > 0)
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                @foreach($model->sensors as $sensor)
                    <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-[#18181b]">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ $sensor->name }}</h4>
                                <p class="text-xs text-gray-500 dark:text-gray-400">{{ $sensor->code }}</p>
                            </div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                {{ $sensor->is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }}">
                                {{ $sensor->is_active ? 'Aktif' : 'Non-aktif' }}
                            </span>
                        </div>
                    </div>
                @endforeach
            </div>
        @else
            <div class="text-center py-6">
                <i class="fas fa-microchip text-4xl text-gray-300 dark:text-gray-600 mb-2"></i>
                <p class="text-sm text-gray-500 dark:text-gray-400">Belum ada sensor yang menggunakan model ini</p>
            </div>
        @endif
    </x-admin.card>
</div>
@endsection
