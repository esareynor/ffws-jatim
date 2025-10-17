@props([
    'title' => 'Filter Data',
    'filters' => [],
    'action' => request()->url(),
    'method' => 'GET',
    'showReset' => true,
    'resetUrl' => null,
    'gridCols' => 'md:grid-cols-5',
    'compact' => false,
    'class' => ''
])

@php
    $resetUrl = $resetUrl ?? request()->url();
    $defaultGridCols = $compact ? 'md:grid-cols-4' : 'md:grid-cols-5';
@endphp

<x-admin.card 
    :title="$compact ? null : $title"
    :class="$class"
>
    <form method="{{ $method }}" action="{{ $action }}" class="space-y-4">
        <!-- Preserve existing query parameters except for filter fields -->
        @foreach(request()->except(array_merge(array_column($filters, 'name'), ['page'])) as $key => $value)
            <input type="hidden" name="{{ $key }}" value="{{ $value }}">
        @endforeach
        
        <div class="grid grid-cols-1 {{ $gridCols ?? $defaultGridCols }} gap-4">
            @foreach($filters as $filter)
                @php
                    $filterType = $filter['type'] ?? 'text';
                    $filterName = $filter['name'] ?? '';
                    $filterLabel = $filter['label'] ?? '';
                    $filterValue = request($filterName, $filter['value'] ?? '');
                    $filterOptions = $filter['options'] ?? [];
                    $filterPlaceholder = $filter['placeholder'] ?? '';
                    $filterRequired = $filter['required'] ?? false;
                    $filterClass = $filter['class'] ?? '';
                    $filterId = $filter['id'] ?? $filterName;
                @endphp
                
                <div class="{{ $filterClass }}">
                    @if($filterType !== 'checkbox')
                        <label for="{{ $filterId }}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {{ $filterLabel }}
                            @if($filterRequired)
                                <span class="text-red-500">*</span>
                            @endif
                        </label>
                    @endif
                    
                    @switch($filterType)
                        @case('select')
                            <select name="{{ $filterName }}" 
                                    id="{{ $filterId }}" 
                                    class="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white">
                                @if(isset($filter['empty_option']))
                                    <option value="">{{ $filter['empty_option'] }}</option>
                                @endif
                                @foreach($filterOptions as $option)
                                    @if(is_array($option))
                                        <option value="{{ $option['value'] }}" {{ $filterValue == $option['value'] ? 'selected' : '' }}>
                                            {{ $option['label'] }}
                                        </option>
                                    @else
                                        <option value="{{ $option }}" {{ $filterValue == $option ? 'selected' : '' }}>
                                            {{ $option }}
                                        </option>
                                    @endif
                                @endforeach
                            </select>
                            @break
                                
                        @case('date')
                            <input type="date" 
                                   name="{{ $filterName }}" 
                                   id="{{ $filterId }}"
                                   value="{{ $filterValue }}"
                                   class="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white">
                            @break
                                
                        @case('datetime-local')
                            <input type="datetime-local" 
                                   name="{{ $filterName }}" 
                                   id="{{ $filterId }}"
                                   value="{{ $filterValue }}"
                                   class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2">
                            @break
                                
                        @case('number')
                            <input type="number" 
                                   name="{{ $filterName }}" 
                                   id="{{ $filterId }}"
                                   value="{{ $filterValue }}"
                                   placeholder="{{ $filterPlaceholder }}"
                                   min="{{ $filter['min'] ?? '' }}"
                                   max="{{ $filter['max'] ?? '' }}"
                                   step="{{ $filter['step'] ?? '' }}"
                                   class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2">
                            @break
                                
                        @case('range')
                            <div>
                                <input type="range" 
                                       name="{{ $filterName }}" 
                                       id="{{ $filterId }}"
                                       value="{{ $filterValue }}"
                                       min="{{ $filter['min'] ?? 0 }}"
                                       max="{{ $filter['max'] ?? 100 }}"
                                       step="{{ $filter['step'] ?? 1 }}"
                                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider">
                                <div class="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{{ $filter['min'] ?? 0 }}</span>
                                    <span id="{{ $filterId }}-value" class="font-medium">{{ $filterValue }}</span>
                                    <span>{{ $filter['max'] ?? 100 }}</span>
                                </div>
                            </div>
                            @break
                                
                        @case('checkbox')
                            <div class="flex items-center">
                                <input type="checkbox" 
                                       name="{{ $filterName }}" 
                                       id="{{ $filterId }}"
                                       value="1"
                                       {{ $filterValue ? 'checked' : '' }}
                                       class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                                <label for="{{ $filterId }}" class="ml-2 block text-sm text-gray-700">
                                    {{ $filter['checkbox_label'] ?? $filterLabel }}
                                </label>
                            </div>
                            @break
                                
                        @case('radio')
                            <div class="space-y-2">
                                @foreach($filterOptions as $option)
                                    @php
                                        $optionValue = is_array($option) ? $option['value'] : $option;
                                        $optionLabel = is_array($option) ? $option['label'] : $option;
                                    @endphp
                                    <div class="flex items-center">
                                        <input type="radio" 
                                               name="{{ $filterName }}" 
                                               id="{{ $filterId }}-{{ $optionValue }}"
                                               value="{{ $optionValue }}"
                                               {{ $filterValue == $optionValue ? 'checked' : '' }}
                                               class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                                        <label for="{{ $filterId }}-{{ $optionValue }}" class="ml-2 block text-sm text-gray-700">
                                            {{ $optionLabel }}
                                        </label>
                                    </div>
                                @endforeach
                            </div>
                            @break
                                
                        @case('textarea')
                            <textarea name="{{ $filterName }}" 
                                      id="{{ $filterId }}"
                                      rows="{{ $filter['rows'] ?? 3 }}"
                                      placeholder="{{ $filterPlaceholder }}"
                                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm">{{ $filterValue }}</textarea>
                            @break
                                
                        @default
                            <input type="text" 
                                   name="{{ $filterName }}" 
                                   id="{{ $filterId }}"
                                   value="{{ $filterValue }}"
                                   placeholder="{{ $filterPlaceholder }}"
                                   class="block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400">
                    @endswitch
                </div>
            @endforeach
        </div>
        
        <!-- Action Buttons - Positioned at bottom right -->
        <div class="flex justify-end space-x-3 mt-4">
            @if($showReset)
                <a href="{{ $resetUrl }}" 
                   class="btn-reset bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm">
                    Reset Filter
                </a>
            @endif
            
            <button type="submit" 
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm">
                Terapkan Filter
            </button>
        </div>
    </form>
</x-admin.card>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle range sliders
    document.querySelectorAll('input[type="range"]').forEach(function(slider) {
        const valueDisplay = document.getElementById(slider.id + '-value');
        if (valueDisplay) {
            slider.addEventListener('input', function() {
                valueDisplay.textContent = this.value;
            });
        }
    });
});
</script>
@endpush
