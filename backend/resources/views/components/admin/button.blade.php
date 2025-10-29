@props([
    'type' => 'button',
    'href' => null, // jika ada href, akan render sebagai link
    'variant' => 'primary', // primary, secondary, success, danger, warning, info, outline, ghost
    'size' => 'md', // sm, md, lg
    'disabled' => false,
    'loading' => false,
    'target' => null, // untuk link: _blank, _self, dll
    'class' => ''
])

@php
    $baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 no-underline';
    
    $variants = [
        'primary' => 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
        'secondary' => 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600',
        'success' => 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600',
        'danger' => 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
        'warning' => 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600',
        'info' => 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 dark:bg-blue-400 dark:hover:bg-blue-500',
        'outline' => 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500',
        'ghost' => 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500'
    ];
    
    $sizes = [
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-4 py-2 text-sm',
        'lg' => 'px-6 py-3 text-base'
    ];
    
    $isLink = !is_null($href);
    $classes = $baseClasses . ' ' . $variants[$variant] . ' ' . $sizes[$size] . ' ' . $class;
    
    if (!$isLink) {
        $classes .= ' disabled:opacity-50 disabled:cursor-not-allowed';
    }
@endphp

@if($isLink)
    <a href="{{ $href }}" 
       @if($target) target="{{ $target }}" @endif
       {{ $attributes->merge(['class' => $classes]) }}>
        @if($loading)
            <i class="fas fa-spinner animate-spin -ml-1 mr-2 h-4 w-4"></i>
        @endif
        {{ $slot }}
    </a>
@else
    <button type="{{ $type }}" 
            {{ $disabled ? 'disabled' : '' }}
            {{ $attributes->merge(['class' => $classes]) }}>
        @if($loading)
            <i class="fas fa-spinner animate-spin -ml-1 mr-2 h-4 w-4"></i>
        @endif
        {{ $slot }}
    </button>
@endif


