@extends('layouts.admin')

@section('title', 'Kabupaten')

@section('content')
<script>
    // Redirect to Cities page
    window.location.href = "{{ route('admin.region.cities.index') }}";
</script>

<div class="text-center py-12">
    <i class="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
    <p class="text-gray-600">Redirecting to Kota/Kabupaten page...</p>
</div>
@endsection
