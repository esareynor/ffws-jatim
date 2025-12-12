<!-- Sidebar -->
<aside
   class="sidebar-custom min-h-screen flex-shrink-0 transition-all duration-200 ease-out fixed top-0 left-0 lg:sticky lg:top-0 z-30 overflow-y-auto"
   x-cloak
   :class="{
       '-translate-x-full w-0': !$store.sidebar.open && window.innerWidth < 1024,
       'translate-x-0 w-full max-w-xs sidebar-mobile': $store.sidebar.open && window.innerWidth < 1024,
       'w-16': !$store.sidebar.open && window.innerWidth >= 1024,
       'w-64': $store.sidebar.open && window.innerWidth >= 1024
   }">

   <!-- Logo -->
   <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
      <a href="{{ route('admin.dashboard') }}" class="flex items-center group sidebar-logo">
         <div class="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white dark:bg-gray-700">
            <img src="{{ asset('assets/images/PUSDAJATIM.png') }}" alt="Logo PUSDAJATIM"
               class="object-contain w-full h-full" />
         </div>
         <!-- Full logo text (hidden when sidebar is collapsed) -->
         <span class="ml-3 text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200"
            :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0 w-0 overflow-hidden': !$store.sidebar.open && window.innerWidth >= 1024 }">FFWS</span>
      </a>


   </div>

   <!-- Navigation Menu -->
   <nav class="mt-6"
      :class="{ 'px-3': $store.sidebar.open || window.innerWidth < 1024, 'px-2': !$store.sidebar.open && window.innerWidth >= 1024 }">
      <div class="space-y-1">
         <!-- Dashboard -->
         <a href="{{ route('admin.dashboard') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                      {{ request()->routeIs('admin.dashboard')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
            :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
            <i class="fas fa-tachometer-alt text-base"
               :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
            <span
               :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Dashboard</span>
         </a>
      </div>

      <!-- SYSTEM SECTION -->
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
         <div class="space-y-1">
            <!-- System Heading -->
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
               :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0 h-0 py-0 overflow-hidden': !$store.sidebar.open && window.innerWidth >= 1024 }">
               System</div>

            <!-- Users Management -->
            <a href="{{ route('admin.users.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                         {{ request()->routeIs('admin.users.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-users text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Manajemen User</span>
            </a>

            <!-- User by Role -->
            <a href="{{ route('admin.user-by-role.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                         {{ request()->routeIs('admin.user-by-role.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-user-tag text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">User by Role</span>
            </a>

            <!-- Settings -->
            <a href="{{ route('admin.settings.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                         {{ request()->routeIs('admin.settings.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-cog text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Pengaturan</span>
            </a>

            <!-- WhatsApp Numbers -->
            <a href="{{ route('admin.whatsapp-numbers.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                         {{ request()->routeIs('admin.whatsapp-numbers.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fab fa-whatsapp text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">WhatsApp Numbers</span>
            </a>
         </div>
      </div>

      <!-- MASTER DATA SECTION -->
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
         <div class="space-y-1">
            <!-- Master Data Heading -->
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
               :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0 h-0 py-0 overflow-hidden': !$store.sidebar.open && window.innerWidth >= 1024 }">
               Master Data</div>

            <!-- Devices -->
            <a href="{{ route('admin.devices.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.devices.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-screwdriver-wrench text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Devices</span>
            </a>

            <!-- Device Parameters -->
            <a href="{{ route('admin.device-parameters.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.device-parameters.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-sliders text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Device Parameters</span>
            </a>

            <!-- Device Values -->
            <a href="{{ route('admin.device-values.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.device-values.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-database text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Device Values</span>
            </a>

            <!-- Device CCTV -->
            <a href="{{ route('admin.device-cctv.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.device-cctv.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-video text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Device CCTV</span>
            </a>

            <!-- Device Media -->
            <a href="{{ route('admin.device-media.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.device-media.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-photo-film text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Device Media</span>
            </a>

            <!-- Sensors -->
            <a href="{{ route('admin.sensors.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.sensors.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fa-solid fa-microchip text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Sensors</span>
            </a>

            <!-- Sensor Parameters -->
            <a href="{{ route('admin.sensor-parameters.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.sensor-parameters.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-gauge text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Sensor Parameters</span>
            </a>
         </div>
      </div>

      <!-- DATA SECTION -->
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
         <div class="space-y-1">
            <!-- Data Heading -->
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
               :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0 h-0 py-0 overflow-hidden': !$store.sidebar.open && window.innerWidth >= 1024 }">
               Data</div>

            <!-- Data Actuals -->
            <a href="{{ route('admin.data-actuals.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.data-actuals.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-chart-line text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Data Actuals</span>
            </a>

            <!-- Rating Curves -->
            <a href="{{ route('admin.rating-curves.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.rating-curves.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-chart-area text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Rating Curves</span>
            </a>

            <!-- Scalers -->
            <a href="{{ route('admin.scalers.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.scalers.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-balance-scale text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Scalers</span>
            </a>

            <!-- Thresholds -->
            <a href="{{ route('admin.thresholds.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.thresholds.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-wave-square text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Thresholds</span>
            </a>
         </div>
      </div>

      <!-- FORECASTING SECTION -->
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
         <div class="space-y-1">
            <!-- Forecasting Heading -->
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
               :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0 h-0 py-0 overflow-hidden': !$store.sidebar.open && window.innerWidth >= 1024 }">
               Forecasting</div>

            <!-- Models -->
            <a href="{{ route('admin.mas-models.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                               {{ request()->routeIs('admin.mas-models.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-brain text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Models</span>
            </a>

            <!-- Data Predictions -->
            <a href="{{ route('admin.data_predictions.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                                  {{ request()->routeIs('admin.data_predictions.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-chart-simple text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Data Predictions</span>
            </a>
         </div>
      </div>

      <!-- REGION SECTION -->
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
         <div class="space-y-1">
            <!-- Region Heading -->
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200"
               :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0 h-0 py-0 overflow-hidden': !$store.sidebar.open && window.innerWidth >= 1024 }">
               Region</div>

            <!-- GeoJSON Files -->
            <a href="{{ route('admin.geojson-files.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                              {{ request()->routeIs('admin.geojson-files.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-file-code text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">GeoJSON Files</span>
            </a>

            <!-- Daerah Aliran Sungai -->
            <a href="{{ route('admin.region.river-basins.index') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                            {{ request()->routeIs('admin.region.river-basins.*')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-water text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Daerah Aliran Sungai</span>
            </a>

            <!-- Kabupaten -->
            <a href="{{ route('admin.region.kabupaten') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                          {{ request()->routeIs('admin.region.kabupaten')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-city text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Kabupaten</span>
            </a>

            <!-- Kecamatan -->
            <a href="{{ route('admin.region.kecamatan') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                          {{ request()->routeIs('admin.region.kecamatan')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-layer-group text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Kecamatan</span>
            </a>

            <!-- Desa -->
            <a href="{{ route('admin.region.desa') }}" class="sidebar-nav-item group flex items-center text-sm font-medium rounded-md relative transition-colors duration-200
                          {{ request()->routeIs('admin.region.desa')
   ? 'active bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
   : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white' }}"
               :class="{ 'px-3 py-2': $store.sidebar.open || window.innerWidth < 1024, 'px-2 py-2 justify-center': !$store.sidebar.open && window.innerWidth >= 1024 }">
               <i class="fas fa-home text-base"
                  :class="{ 'mr-3': $store.sidebar.open || window.innerWidth < 1024, 'mr-0': !$store.sidebar.open && window.innerWidth >= 1024 }"></i>
               <span
                  :class="{ 'opacity-100': $store.sidebar.open || window.innerWidth < 1024, 'opacity-0': !$store.sidebar.open && window.innerWidth >= 1024 }">Desa</span>
            </a>
         </div>
      </div>
   </nav>
</aside>