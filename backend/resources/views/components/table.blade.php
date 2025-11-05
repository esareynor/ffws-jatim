   @props([
    'title' => null,
    'headers' => [],
    'rows' => [],
    'sortable' => false,
    'sortColumn' => null,
    'sortDirection' => 'asc',
    'pagination' => null,
    'paginationText' => null,
    'searchable' => false,
    'searchQuery' => '',
    'searchPlaceholder' => 'Cari...',
    'class' => ''
])

@php
    // Auto detect if rows is a paginator instance
    $isPaginated = $rows instanceof \Illuminate\Pagination\LengthAwarePaginator || 
                   $rows instanceof \Illuminate\Pagination\Paginator ||
                   method_exists($rows, 'hasPages');
    
    // Extract data from paginator
    $tableRows = $isPaginated ? $rows->items() : $rows;
@endphp

<div class="card-dark shadow-sm rounded-lg {{ $class }}">
    @if($title || $searchable || isset($filters) || isset($actions))
        <div class="card-header-dark px-6 py-4 border-b">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div class="flex items-center gap-3">
                    @if($title)
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $title }}</h2>
                    @endif
                    @isset($filters)
                        <div class="flex items-center gap-2">
                            {{ $filters }}
                        </div>
                    @endisset
                </div>
                <div class="flex items-center gap-2">
                    @if($searchable)
                        <form method="GET" action="{{ request()->url() }}" class="flex items-center gap-2">
                            @foreach(request()->except(['search', 'page']) as $key => $value)
                                <input type="hidden" name="{{ $key }}" value="{{ $value }}">
                            @endforeach
                            <label for="search" class="sr-only">Cari</label>
                            <div class="relative">
                                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                    <i class="fa-solid fa-magnifying-glass h-5 w-5"></i>
                                </span>
                                <input id="search" name="search" type="text" placeholder="{{ $searchPlaceholder }}" 
                                       value="{{ request('search', $searchQuery) }}"
                                       class="pl-10 pr-3 py-2 border rounded w-64 focus:outline-none focus:ring focus:border-blue-300" />
                            </div>
                            <button type="submit" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <i class="fa-solid fa-search"></i>
                            </button>
                            @if(request('search'))
                                <a href="{{ request()->url() }}" class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                    <i class="fa-solid fa-times"></i>
                                </a>
                            @endif
                        </form>
                    @endif
                    @isset($actions)
                        <div class="flex items-center gap-2">
                            {{ $actions }}
                        </div>
                    @endisset
                </div>
            </div>
        </div>
    @endif
    
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-[#18181b]">
                <tr>
                    @foreach($headers as $header)
                        <th scope="col" 
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
                                   {{ $sortable && isset($header['sortable']) && $header['sortable'] ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : '' }}"
                            @if($sortable && isset($header['sortable']) && $header['sortable'])
                                @click="window.location.href='{{ request()->fullUrlWithQuery(['sort' => $header['key'], 'direction' => $sortColumn === $header['key'] && $sortDirection === 'asc' ? 'desc' : 'asc']) }}'"
                            @endif>
                            <div class="flex items-center space-x-1">
                                <span>{{ $header['label'] }}</span>
                                @if($sortable && isset($header['sortable']) && $header['sortable'])
                                    @if($sortColumn === $header['key'])
                                        @if($sortDirection === 'asc')
                                            <i class="fas fa-sort-up w-4 h-4 text-gray-400"></i>
                                        @else
                                            <i class="fas fa-sort-down w-4 h-4 text-gray-400"></i>
                                        @endif
                                    @else
                                        <i class="fas fa-sort w-4 h-4 text-gray-400"></i>
                                    @endif
                                @endif
                            </div>
                        </th>
                    @endforeach
                </tr>
            </thead>
            <tbody class="bg-white dark:bg-[#18181b] divide-y divide-gray-200 dark:divide-gray-700">
                @forelse($tableRows as $row)
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                        @foreach($headers as $header)
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                @if(isset($header['format']))
                                    @switch($header['format'])
                                        @case('date')
                                            @if(isset($row->formatted_received_at))
                                                {{ \Carbon\Carbon::parse($row->formatted_received_at)->format('d/m/Y H:i') }}
                                            @else
                                                {{ \Carbon\Carbon::parse(is_array($row) ? $row[$header['key']] : $row->{$header['key']})->format('d/m/Y H:i') }}
                                            @endif
                                            @break
                                        @case('sensor')
                                            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ $row->formatted_sensor ?? (is_array($row) ? $row[$header['key']] : $row->{$header['key']}) }}</div>
                                            @if(isset($row->formatted_sensor_device))
                                                <div class="text-sm text-gray-500 dark:text-gray-400">{{ $row->formatted_sensor_device }}</div>
                                            @endif
                                            @break
                                        @case('parameter')
                                            <div class="text-sm text-gray-900 dark:text-gray-100">{{ $row->formatted_parameter ?? (is_array($row) ? $row[$header['key']] : $row->{$header['key']}) }}</div>
                                            @if(isset($row->formatted_parameter_unit) && $row->formatted_parameter_unit)
                                                <div class="text-sm text-gray-500 dark:text-gray-400">{{ $row->formatted_parameter_unit }}</div>
                                            @endif
                                            @break
                                        @case('value')
                                            <span class="font-mono text-sm">{{ $row->formatted_value ?? (is_array($row) ? $row[$header['key']] : $row->{$header['key']}) }}</span>
                                            @break
                                        @case('percentage')
                                            <span class="font-mono text-sm">{{ $row->formatted_confidence ?? (is_array($row) ? $row[$header['key']] : $row->{$header['key']}) }}</span>
                                            @break
                                        @case('decimal')
                                            <span class="font-mono text-sm">{{ number_format(is_array($row) ? $row[$header['key']] : $row->{$header['key']}, 2) }}</span>
                                            @break
                                        @case('status')
                                            @php
                                                $statusValue = $row->formatted_threshold_status ?? (is_array($row) ? $row[$header['key']] : $row->{$header['key']});
                                                $statusClasses = [
                                                    'active' => 'bg-green-100 text-green-800',
                                                    'inactive' => 'bg-red-100 text-red-800',
                                                    'maintenance' => 'bg-yellow-100 text-yellow-800',
                                                    'pending' => 'bg-yellow-100 text-yellow-800',
                                                    'draft' => 'bg-gray-100 text-gray-800',
                                                    'safe' => 'bg-green-100 text-green-800',
                                                    'warning' => 'bg-yellow-100 text-yellow-800',
                                                    'danger' => 'bg-red-100 text-red-800'
                                                ];
                                                $statusClass = $statusClasses[$statusValue ?? 'draft'] ?? 'bg-gray-100 text-gray-800';
                                                
                                                // Custom labels for threshold status
                                                $statusLabels = [
                                                    'safe' => 'Aman',
                                                    'warning' => 'Waspada',
                                                    'danger' => 'Bahaya'
                                                ];
                                                $statusLabel = $statusLabels[$statusValue] ?? ucfirst($statusValue ?? 'Unknown');
                                            @endphp
                                            <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full {{ $statusClass }}">
                                                {{ $statusLabel }}
                                            </span>
                                            @break
                                        @case('actions')
                                            <div class="flex items-center space-x-2">
                                                @php
                                                    // Check for both 'actions' and 'formatted_actions' properties
                                                    $actions = $row->actions ?? $row->formatted_actions ?? [];
                                                @endphp
                                                @if(!empty($actions))
                                                    @foreach($actions as $action)
                                                        @php
                                                            // Get action properties with fallbacks
                                                            $rawType = strtolower(trim($action['type'] ?? ($action['label'] ?? '')));
                                                            $isDeleteByType = str_contains($rawType, 'hapus') || str_contains($rawType, 'delete') || str_contains($rawType, 'destroy');
                                                            $isViewByType = str_contains($rawType, 'detail') || str_contains($rawType, 'lihat') || str_contains($rawType, 'view') || str_contains($rawType, 'show');
                                                            $isEditByType = str_contains($rawType, 'edit');

                                                            // Check for delete action by method or type
                                                            $isDelete = (isset($action['method']) && strtoupper($action['method']) === 'DELETE') || $isDeleteByType;

                                                            // Determine icon with better fallbacks
                                                            $icon = $action['icon'] ?? null;
                                                            if (!$icon) {
                                                                if ($isDelete) {
                                                                    $icon = 'trash';
                                                                } elseif ($isEditByType) {
                                                                    $icon = 'pen';
                                                                } elseif ($isViewByType) {
                                                                    $icon = 'eye';
                                                                } else {
                                                                    $icon = 'ellipsis';
                                                                }
                                                            }

                                                            // Get other properties with fallbacks
                                                            $label = $action['label'] ?? 'Aksi';
                                                            $color = $action['color'] ?? ($isDelete ? 'red' : 'gray');
                                                            $title = $action['title'] ?? $label;
                                                            $url = $action['url'] ?? '#';
                                                            $onclick = $action['onclick'] ?? null;
                                                            $confirm = $action['confirm'] ?? null;

                                                            // Button classes
                                                            $baseBtn = 'inline-flex items-center justify-center w-9 h-9 rounded-lg border text-sm transition';
                                                            $normalClasses = ' border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900';
                                                            $dangerClasses = ' border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700';
                                                            $btnClasses = $baseBtn . ($color === 'red' ? $dangerClasses : $normalClasses);
                                                        @endphp

                                                        @if($isDelete)
                                                            <form action="{{ $url }}" method="POST" class="inline delete-form" data-confirm-delete="{{ $confirm ?? 'Data yang dihapus tidak dapat dikembalikan. Lanjutkan?' }}">
                                                                @csrf
                                                                @method('DELETE')
                                                                <button type="submit" class="{{ $btnClasses }}" title="{{ $title }}">
                                                                    <i class="fas fa-{{ $icon }}"></i>
                                                                    <span class="sr-only">{{ $label }}</span>
                                                                </button>
                                                            </form>
                                                        @elseif($onclick)
                                                            <button type="button" onclick="{{ $onclick }}" class="{{ $btnClasses }}" title="{{ $title }}">
                                                                <i class="fas fa-{{ $icon }}"></i>
                                                                <span class="sr-only">{{ $label }}</span>
                                                            </button>
                                                        @else
                                                            <a href="{{ $url }}" class="{{ $btnClasses }}" title="{{ $title }}">
                                                                <i class="fas fa-{{ $icon }}"></i>
                                                                <span class="sr-only">{{ $label }}</span>
                                                            </a>
                                                        @endif
                                                    @endforeach
                                                @else
                                                    <span class="text-gray-400 text-sm">Tidak ada aksi</span>
                                                @endif
                                            </div>
                                            @break
                                        @default
                                            @if(isset($row->{'formatted_' . $header['key']}))
                                                @php
                                                    $formattedValue = is_array($row) ? $row['formatted_' . $header['key']] : $row->{'formatted_' . $header['key']};
                                                    // Check if formatted value should be rendered as raw HTML (contains HTML tags or Alpine.js directives)
                                                    $needsRawRender = is_string($formattedValue) && (strpos($formattedValue, '<') !== false || strpos($formattedValue, '@click') !== false || strpos($formattedValue, 'x-') !== false);
                                                @endphp
                                                @if($needsRawRender)
                                                    {!! $formattedValue !!}
                                                @else
                                                    {{ $formattedValue }}
                                                @endif
                                            @else
                                                @php
                                                    // Handle both array and object access
                                                    if (is_array($row)) {
                                                        $value = $row[$header['key']] ?? '';
                                                    } else {
                                                        $value = $row->{$header['key']} ?? '';
                                                    }
                                                    if (is_array($value)) {
                                                        $value = json_encode($value);
                                                    }
                                                @endphp
                                                {{ $value }}
                                            @endif
                                    @endswitch
                                @else
                                    @if(isset($row->{'formatted_' . $header['key']}))
                                        @php
                                            $formattedValue = is_array($row) ? $row['formatted_' . $header['key']] : $row->{'formatted_' . $header['key']};
                                            // Check if formatted value should be rendered as raw HTML (contains HTML tags or Alpine.js directives)
                                            $needsRawRender = is_string($formattedValue) && (strpos($formattedValue, '<') !== false || strpos($formattedValue, '@click') !== false || strpos($formattedValue, 'x-') !== false);
                                        @endphp
                                        @if($needsRawRender)
                                            {!! $formattedValue !!}
                                        @else
                                            {{ $formattedValue }}
                                        @endif
                                    @else
                                        @php
                                            // Handle both array and object access
                                            if (is_array($row)) {
                                                $value = $row[$header['key']] ?? '';
                                            } else {
                                                $value = $row->{$header['key']} ?? '';
                                            }
                                            if (is_array($value)) {
                                                $value = json_encode($value);
                                            }
                                        @endphp
                                        {{ $value }}
                                    @endif
                                @endif
                            </td>
                        @endforeach
                    </tr>
                @empty
                    <tr>
                        <td colspan="{{ count($headers) }}" class="px-6 py-12 text-center text-gray-500">
                            <div class="flex flex-col items-center">
                                <i class="fas fa-inbox w-12 h-12 text-gray-400 mb-4"></i>
                                <p class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Tidak ada data</p>
                                <p class="text-gray-500 dark:text-gray-400">Belum ada data yang tersedia.</p>
                            </div>
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
    
    <!-- Auto Pagination Section -->
    @if($isPaginated && $rows->hasPages())
        <div class="px-6 py-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                    Menampilkan {{ $rows->firstItem() }} sampai {{ $rows->lastItem() }} dari {{ $rows->total() }} data
                </div>
                <div class="flex items-center space-x-1">
                    {{-- Previous Page Link --}}
                    @if ($rows->onFirstPage())
                        <span class="px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">
                            <i class="fas fa-chevron-left"></i>
                        </span>
                    @else
                        <a href="{{ $rows->previousPageUrl() }}" class="pagination-item px-3 py-2 text-sm border rounded-lg transition-colors">
                            <i class="fas fa-chevron-left"></i>
                        </a>
                    @endif

                    {{-- Pagination Elements --}}
                    @php
                        $currentPage = $rows->currentPage();
                        $lastPage = $rows->lastPage();
                        $startPage = max(1, $currentPage - 1);
                        $endPage = min($lastPage, $currentPage + 1);
                    @endphp

                    {{-- First page if not in range --}}
                    @if ($startPage > 1)
                        <a href="{{ $rows->url(1) }}" class="pagination-item px-3 py-2 text-sm border rounded-lg transition-colors">1</a>
                        @if ($startPage > 2)
                            <span class="px-2 text-gray-400">...</span>
                        @endif
                    @endif

                    {{-- Page Numbers --}}
                    @for ($i = $startPage; $i <= $endPage; $i++)
                        @if ($i == $currentPage)
                            <span class="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg">{{ $i }}</span>
                        @else
                            <a href="{{ $rows->url($i) }}" class="pagination-item px-3 py-2 text-sm border rounded-lg transition-colors">{{ $i }}</a>
                        @endif
                    @endfor

                    {{-- Last page if not in range --}}
                    @if ($endPage < $lastPage)
                        @if ($endPage < $lastPage - 1)
                            <span class="px-2 text-gray-400">...</span>
                        @endif
                        <a href="{{ $rows->url($lastPage) }}" class="pagination-item px-3 py-2 text-sm border rounded-lg transition-colors">{{ $lastPage }}</a>
                    @endif

                    {{-- Next Page Link --}}
                    @if ($rows->hasMorePages())
                        <a href="{{ $rows->nextPageUrl() }}" class="pagination-item px-3 py-2 text-sm border rounded-lg transition-colors">
                            <i class="fas fa-chevron-right"></i>
                        </a>
                    @else
                        <span class="px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">
                            <i class="fas fa-chevron-right"></i>
                        </span>
                    @endif
                </div>
            </div>
        </div>
    @elseif($pagination || $paginationText)
        <!-- Manual Pagination Section -->
        <div class="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            @if($paginationText)
                <p class="text-sm text-gray-600">{{ $paginationText }}</p>
            @else
                <span></span>
            @endif
            <div>
                @if($pagination && is_string($pagination))
                    {!! $pagination !!}
                @else
                    {{ $pagination ?? '' }}
                @endif
            </div>
        </div>
    @endif
</div>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle delete confirmation with SweetAlert
    document.querySelectorAll('.delete-form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const confirmMessage = this.getAttribute('data-confirm-delete') || 'Data yang dihapus tidak dapat dikembalikan. Lanjutkan?';
            
            // Use SweetAlert for confirmation
            if (window.AdminUtils && window.AdminUtils.confirmDelete) {
                window.AdminUtils.confirmDelete(confirmMessage).then(function(confirmed) {
                    if (confirmed) {
                        form.submit();
                    }
                });
            } else {
                // Fallback to native confirm if SweetAlert not available
                if (confirm(confirmMessage)) {
                    form.submit();
                }
            }
        });
    });
});
</script>
@endpush
