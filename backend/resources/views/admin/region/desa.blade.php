@extends('layouts.admin')

@section('title', 'Desa/Kelurahan')

@section('content')
<script>
    // Redirect to Villages page
    window.location.href = "{{ route('admin.region.villages.index') }}";
</script>

<div class="text-center py-12">
    <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
    <p class="text-gray-600">Redirecting to Desa/Kelurahan page...</p>
</div>
@endsection
