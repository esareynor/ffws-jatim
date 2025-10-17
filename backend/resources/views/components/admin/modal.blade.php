@props([
    'show' => false,
    'title' => null,
    'size' => 'md', // sm, md, lg, xl
    'closeOnBackdrop' => true,
    'name' => null, // optional unique name for global open/close events
])

@php
    $sizes = [
        'sm' => 'max-w-md',
        'md' => 'max-w-lg',
        'lg' => 'max-w-2xl',
        'xl' => 'max-w-4xl',
    ];
    $dialogWidth = $sizes[$size] ?? $sizes['md'];
@endphp

@once
    <style>[x-cloak]{ display:none !important; }</style>
@endonce

<div
    x-data="{ internalShow: @js($show) }"
    x-effect="$watch(() => internalShow, value => { if(value) { document.body.classList.add('overflow-hidden') } else { document.body.classList.remove('overflow-hidden') } })"
    x-show="internalShow"
    x-cloak
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-modal="true"
    role="dialog"
    @open-modal.window="if(!$event.detail || $event.detail === @js($name)) internalShow = true"
    @close-modal.window="if(!$event.detail || $event.detail === @js($name)) internalShow = false"
>
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-[#09090b] bg-opacity-40" @if($closeOnBackdrop) @click="internalShow = false" @endif></div>

    <!-- Dialog -->
    <div class="min-h-screen flex items-center justify-center p-4">
        <div class="w-full {{ $dialogWidth }} transform transition-all"
             x-transition:enter="ease-out duration-200"
             x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
             x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave="ease-in duration-150"
             x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
             x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
            <!-- Using Card Component with Modal-specific actions -->
            <x-admin.card 
                :title="$title" 
                class="shadow-xl"
                padding="p-0">
                
                <x-slot name="actions">
                    <button type="button" 
                            class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" 
                            @click="internalShow = false">
                        <i class="fa-solid fa-xmark text-xl"></i>
                    </button>
                </x-slot>

                <!-- Modal Body -->
                <div class="px-6 py-4">
                    {{ $slot }}
                </div>

                <!-- Modal Footer -->
                @isset($footer)
                    <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#18181b] flex items-center justify-end gap-2">
                        {{ $footer }}
                    </div>
                @endisset
            </x-admin.card>
        </div>
    </div>
</div>


