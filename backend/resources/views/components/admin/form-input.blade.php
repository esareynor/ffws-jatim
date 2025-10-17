@props([
    'type' => 'text',
    'name' => '',
    'label' => '',
    'value' => '',
    'placeholder' => '',
    'required' => false,
    'disabled' => false,
    'readonly' => false,
    'help' => '',
    'error' => '',
    'class' => '',
    'options' => []
])

<div class="{{ $class }}">
    @if($label)
        <label for="{{ $name }}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ $label }}
            @if($required)
                <span class="text-red-500">*</span>
            @endif
        </label>
    @endif
    
    @switch($type)
        @case('textarea')
            <textarea
                name="{{ $name }}"
                id="{{ $name }}"
                rows="4"
                placeholder="{{ $placeholder }}"
                {{ $required ? 'required' : '' }}
                {{ $disabled ? 'disabled' : '' }}
                {{ $readonly ? 'readonly' : '' }}
                {{ $attributes->merge(['class' => 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 ' . ($error ? 'border-red-300' : '')]) }}
            >{{ old($name, $value) }}</textarea>
            @break
            
        @case('select')
            <select
                name="{{ $name }}"
                id="{{ $name }}"
                {{ $required ? 'required' : '' }}
                {{ $disabled ? 'disabled' : '' }}
                {{ $attributes->merge(['class' => 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 ' . ($error ? 'border-red-300' : '')]) }}
            >
                <option value="">{{ $placeholder ?: 'Pilih opsi...' }}</option>
                @if(!empty($options))
                    @foreach($options as $option)
                        @if(is_array($option))
                            <option value="{{ $option['value'] }}" {{ old($name, $value) == $option['value'] ? 'selected' : '' }}>
                                {{ $option['label'] }}
                            </option>
                        @else
                            <option value="{{ $option }}" {{ old($name, $value) == $option ? 'selected' : '' }}>
                                {{ $option }}
                            </option>
                        @endif
                    @endforeach
                @endif
                {{ $slot }}
            </select>
            @break
            
        @case('checkbox')
            <div class="flex items-center">
                <input
                    type="checkbox"
                    name="{{ $name }}"
                    id="{{ $name }}"
                    value="1"
                    {{ old($name, $value) ? 'checked' : '' }}
                    {{ $required ? 'required' : '' }}
                    {{ $disabled ? 'disabled' : '' }}
                    {{ $attributes->merge(['class' => 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#18181b]']) }}
                >
                @if($label)
                    <label for="{{ $name }}" class="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                        {{ $label }}
                        @if($required)
                            <span class="text-red-500">*</span>
                        @endif
                    </label>
                @endif
            </div>
            @break
            
        @case('radio')
            <div class="flex items-center">
                <input
                    type="radio"
                    name="{{ $name }}"
                    id="{{ $name }}"
                    value="{{ $value }}"
                    {{ old($name) == $value ? 'checked' : '' }}
                    {{ $required ? 'required' : '' }}
                    {{ $disabled ? 'disabled' : '' }}
                    {{ $attributes->merge(['class' => 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#18181b]']) }}
                >
                @if($label)
                    <label for="{{ $name }}" class="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                        {{ $label }}
                        @if($required)
                            <span class="text-red-500">*</span>
                        @endif
                    </label>
                @endif
            </div>
            @break
            
        @case('file')
            <input
                type="file"
                name="{{ $name }}"
                id="{{ $name }}"
                {{ $required ? 'required' : '' }}
                {{ $disabled ? 'disabled' : '' }}
                {{ $attributes->merge(['class' => 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 ' . ($error ? 'border-red-300' : '')]) }}
            >
            @break
            
        @default
            <input
                type="{{ $type }}"
                name="{{ $name }}"
                id="{{ $name }}"
                value="{{ old($name, $value) }}"
                placeholder="{{ $placeholder }}"
                {{ $required ? 'required' : '' }}
                {{ $disabled ? 'disabled' : '' }}
                {{ $readonly ? 'readonly' : '' }}
                {{ $attributes->merge(['class' => 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 ' . ($error ? 'border-red-300' : '')]) }}
            >
    @endswitch
    
    @if($help)
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $help }}</p>
    @endif
    
    @if($error)
        <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $error }}</p>
    @endif
</div>


