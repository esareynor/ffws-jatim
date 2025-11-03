@props(['sensorCode', 'sensorName', 'forecastingStatus' => 'stopped', 'size' => 'md'])

@php
$sizeClasses = [
    'sm' => 'px-2 py-1 text-xs',
    'md' => 'px-3 py-2 text-sm',
    'lg' => 'px-4 py-2 text-base'
];
$buttonSize = $sizeClasses[$size] ?? $sizeClasses['md'];
@endphp

<div class="forecasting-control-group" data-sensor-code="{{ $sensorCode }}">
    <!-- Status Badge -->
    <div class="mb-2">
        <span class="forecasting-status-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            @if($forecastingStatus === 'running') bg-green-100 text-green-800
            @elseif($forecastingStatus === 'paused') bg-yellow-100 text-yellow-800
            @else bg-gray-100 text-gray-800
            @endif">
            <span class="status-indicator w-2 h-2 mr-1.5 rounded-full
                @if($forecastingStatus === 'running') bg-green-400 animate-pulse
                @elseif($forecastingStatus === 'paused') bg-yellow-400
                @else bg-gray-400
                @endif"></span>
            <span class="status-text">{{ ucfirst($forecastingStatus) }}</span>
        </span>
    </div>

    <!-- Control Buttons -->
    <div class="flex flex-wrap gap-2">
        <!-- Start Button -->
        <button 
            type="button"
            class="btn-forecasting-start {{ $buttonSize }} inline-flex items-center border border-transparent rounded-md shadow-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            data-action="start"
            @if($forecastingStatus === 'running') disabled @endif>
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Start</span>
        </button>

        <!-- Pause Button -->
        <button 
            type="button"
            class="btn-forecasting-pause {{ $buttonSize }} inline-flex items-center border border-transparent rounded-md shadow-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            data-action="pause"
            @if($forecastingStatus !== 'running') disabled @endif>
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Pause</span>
        </button>

        <!-- Stop Button -->
        <button 
            type="button"
            class="btn-forecasting-stop {{ $buttonSize }} inline-flex items-center border border-transparent rounded-md shadow-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            data-action="stop"
            @if($forecastingStatus === 'stopped') disabled @endif>
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            <span>Stop</span>
        </button>

        <!-- Predict Now Button -->
        <button 
            type="button"
            class="btn-forecasting-predict {{ $buttonSize }} inline-flex items-center border border-gray-300 rounded-md shadow-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            data-action="predict"
            @if($forecastingStatus !== 'running') disabled @endif>
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Predict Now</span>
        </button>
    </div>

    <!-- Loading Indicator -->
    <div class="forecasting-loading hidden mt-2">
        <div class="flex items-center text-sm text-gray-600">
            <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="loading-text">Processing...</span>
        </div>
    </div>

    <!-- Message Area -->
    <div class="forecasting-message mt-2 hidden">
        <div class="message-content rounded-md p-3 text-sm"></div>
    </div>
</div>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    const controlGroups = document.querySelectorAll('.forecasting-control-group');
    
    controlGroups.forEach(group => {
        const sensorCode = group.dataset.sensorCode;
        const buttons = group.querySelectorAll('[data-action]');
        const statusBadge = group.querySelector('.forecasting-status-badge');
        const statusText = statusBadge.querySelector('.status-text');
        const statusIndicator = statusBadge.querySelector('.status-indicator');
        const loadingDiv = group.querySelector('.forecasting-loading');
        const loadingText = loadingDiv.querySelector('.loading-text');
        const messageDiv = group.querySelector('.forecasting-message');
        const messageContent = messageDiv.querySelector('.message-content');
        
        buttons.forEach(button => {
            button.addEventListener('click', async function() {
                const action = this.dataset.action;
                
                // Show loading
                loadingDiv.classList.remove('hidden');
                loadingText.textContent = `${action.charAt(0).toUpperCase() + action.slice(1)}ing...`;
                messageDiv.classList.add('hidden');
                
                // Disable all buttons
                buttons.forEach(btn => btn.disabled = true);
                
                try {
                    const endpoint = action === 'predict' 
                        ? `/api/forecasting/sensors/${sensorCode}/predict`
                        : `/api/forecasting/sensors/${sensorCode}/${action}`;
                    
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Update status badge
                        if (action !== 'predict' && data.data?.forecasting_status) {
                            const newStatus = data.data.forecasting_status;
                            statusText.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                            
                            // Update badge colors
                            statusBadge.className = 'forecasting-status-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
                            statusIndicator.className = 'status-indicator w-2 h-2 mr-1.5 rounded-full';
                            
                            if (newStatus === 'running') {
                                statusBadge.classList.add('bg-green-100', 'text-green-800');
                                statusIndicator.classList.add('bg-green-400', 'animate-pulse');
                            } else if (newStatus === 'paused') {
                                statusBadge.classList.add('bg-yellow-100', 'text-yellow-800');
                                statusIndicator.classList.add('bg-yellow-400');
                            } else {
                                statusBadge.classList.add('bg-gray-100', 'text-gray-800');
                                statusIndicator.classList.add('bg-gray-400');
                            }
                            
                            // Update button states
                            updateButtonStates(newStatus);
                        }
                        
                        // Show success message
                        showMessage(data.message, 'success');
                    } else {
                        showMessage(data.message || 'Operation failed', 'error');
                    }
                } catch (error) {
                    showMessage('Network error: ' + error.message, 'error');
                } finally {
                    loadingDiv.classList.add('hidden');
                }
            });
        });
        
        function updateButtonStates(status) {
            const startBtn = group.querySelector('[data-action="start"]');
            const pauseBtn = group.querySelector('[data-action="pause"]');
            const stopBtn = group.querySelector('[data-action="stop"]');
            const predictBtn = group.querySelector('[data-action="predict"]');
            
            startBtn.disabled = status === 'running';
            pauseBtn.disabled = status !== 'running';
            stopBtn.disabled = status === 'stopped';
            predictBtn.disabled = status !== 'running';
        }
        
        function showMessage(text, type) {
            messageContent.textContent = text;
            messageContent.className = 'message-content rounded-md p-3 text-sm';
            
            if (type === 'success') {
                messageContent.classList.add('bg-green-50', 'text-green-800', 'border', 'border-green-200');
            } else {
                messageContent.classList.add('bg-red-50', 'text-red-800', 'border', 'border-red-200');
            }
            
            messageDiv.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 5000);
        }
    });
});
</script>
@endpush

