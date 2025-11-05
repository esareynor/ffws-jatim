@extends('layouts.admin')

@section('title', 'Kecamatan')

@section('content')
<script>
    // Redirect to Regencies page
    window.location.href = "{{ route('admin.region.regencies.index') }}";
</script>

<div class="text-center py-12">
    <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
    <p class="text-gray-600">Redirecting to Kecamatan page...</p>
</div>
@endsection
