@extends('layouts.admin')

@section('title', 'Forecasting Control')
@section('page-title', 'Forecasting Control')
@section('page-description', 'Kontrol sensor dan model yang melakukan prediksi data')
@section('breadcrumb', 'Forecasting Control')

@section('content')
<div>
    <!-- Filter Bar -->
    <x-filter-bar
        :config="$filterConfig"
        searchPlaceholder="Cari sensor..."
    />

    <!-- Table -->
    <div class="card-dark rounded-lg shadow-sm overflow-hidden">
        <x-table
            :headers="$tableHeaders"
            :rows="$rows"
            :pagination="$pagination"
        />
    </div>
</div>

@push('scripts')
<script>
async function updateForecastingStatus(sensorId, status) {
    if (!confirm(`Apakah Anda yakin ingin mengubah status forecasting?`)) {
        return;
    }

    try {
        const response = await fetch(`/admin/forecasting-control/${sensorId}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ forecasting_status: status })
        });

        const data = await response.json();

        if (data.success) {
            // Show success message
            showNotification('success', data.message);

            // Reload page to update table
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            showNotification('error', data.message);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showNotification('error', 'Terjadi kesalahan saat mengupdate status');
    }
}

function showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
</script>
@endpush
@endsection
