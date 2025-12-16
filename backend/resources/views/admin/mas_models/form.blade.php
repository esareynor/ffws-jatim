@extends('layouts.admin')

@section('title', $isEdit ? 'Edit Model' : 'Tambah Model')
@section('page-title', $isEdit ? 'Edit Model' : 'Tambah Model')
@section('page-description', $isEdit ? 'Edit model prediksi' : 'Tambah model prediksi baru')
@section('breadcrumb', 'Model / ' . ($isEdit ? 'Edit' : 'Tambah'))

@section('content')
<div class="space-y-6">
    <x-admin.card 
        title="{{ $isEdit ? 'Form Edit Model' : 'Form Tambah Model' }}" 
        subtitle="{{ $isEdit ? 'Edit informasi model prediksi' : 'Isi form di bawah ini untuk menambah model prediksi baru' }}">
        
        <form action="{{ $isEdit ? route('admin.mas-models.update', $model->id) : route('admin.mas-models.store') }}" method="POST" class="space-y-6">
            @csrf
            @if($isEdit)
                @method('PUT')
            @endif
            <input type="hidden" name="context" value="{{ $isEdit ? 'edit' : 'create' }}" />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <x-admin.form-input 
                    type="text" 
                    name="name" 
                    label="Nama Model" 
                    value="{{ old('name', $isEdit ? $model->name : '') }}"
                    placeholder="Contoh: LSTM Model v1.0" 
                    required="true" 
                    :error="$errors->first('name')"
                />
                <x-admin.form-input 
                    type="select" 
                    name="type" 
                    label="Tipe Model" 
                    value="{{ old('type', $isEdit ? $model->type : '') }}"
                    required="true" 
                    :error="$errors->first('type')"
                    :options="[
                        ['value' => 'lstm', 'label' => 'LSTM'],
                        ['value' => 'gru', 'label' => 'GRU'],
                        ['value' => 'transformer', 'label' => 'Transformer'],
                        ['value' => 'cnn', 'label' => 'CNN'],
                        ['value' => 'rnn', 'label' => 'RNN'],
                        ['value' => 'other', 'label' => 'Lainnya']
                    ]"
                />
                <x-admin.form-input 
                    type="text" 
                    name="version" 
                    label="Versi" 
                    value="{{ old('version', $isEdit ? $model->version : '') }}"
                    placeholder="Contoh: 1.0.0" 
                    :error="$errors->first('version')"
                />
                <x-admin.form-input 
                    type="text" 
                    name="file_path" 
                    label="Path File" 
                    value="{{ old('file_path', $isEdit ? $model->file_path : '') }}"
                    placeholder="Contoh: /models/lstm_v1.pkl" 
                    :error="$errors->first('file_path')"
                />
                <x-admin.form-input 
                    type="number" 
                    name="n_steps_in" 
                    label="Jumlah Step Input" 
                    value="{{ old('n_steps_in', $isEdit ? $model->n_steps_in : '') }}"
                    placeholder="24" 
                    min="1"
                    max="255"
                    :error="$errors->first('n_steps_in')"
                />
                <x-admin.form-input 
                    type="number" 
                    name="n_steps_out" 
                    label="Jumlah Step Output" 
                    value="{{ old('n_steps_out', $isEdit ? $model->n_steps_out : '') }}"
                    placeholder="12" 
                    min="1"
                    max="255"
                    :error="$errors->first('n_steps_out')"
                />
                <x-admin.form-input 
                    type="textarea" 
                    name="description" 
                    label="Deskripsi" 
                    value="{{ old('description', $isEdit ? $model->description : '') }}"
                    placeholder="Deskripsi model prediksi..." 
                    rows="4"
                    class="md:col-span-2"
                    :error="$errors->first('description')"
                />
                <x-admin.form-input 
                    type="select"
                    name="is_active" 
                    label="Status" 
                    value="{{ old('is_active', $isEdit ? ($model->is_active ? '1' : '0') : '1') }}"
                    required="true" 
                    :error="$errors->first('is_active')"
                    :options="[
                        ['value' => '1', 'label' => 'Aktif'],
                        ['value' => '0', 'label' => 'Non-aktif']
                    ]"
                />
            </div>
            
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
                <x-admin.button href="{{ route('admin.mas-models.index') }}" variant="outline">
                    <i class="fas fa-arrow-left -ml-1 mr-2"></i>
                    Kembali
                </x-admin.button>
                <x-admin.button type="submit" variant="primary">
                    <i class="fas fa-save -ml-1 mr-2"></i>
                    {{ $isEdit ? 'Update Model' : 'Simpan Model' }}
                </x-admin.button>
            </div>
        </form>
    </x-admin.card>
</div>
@endsection
