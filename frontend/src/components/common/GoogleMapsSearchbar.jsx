// src/components/common/GoogleMapsSearchbar.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchDevices } from '../../services/devices';

const normalizeString = (str) => {
  return str.trim().toLowerCase();
};

const GoogleMapsSearchbar = ({
  onSearch,
  placeholder = 'Cari di Maps',
  isSidebarOpen = false,
  mapboxMap, // Bisa null
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [devicesData, setDevicesData] = useState([]);

  // Fetch devices data dari API
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devices = await fetchDevices();
        setDevicesData(devices);
        console.log('📦 Devices loaded for search:', devices.length);
      } catch (error) {
        console.error('❌ Failed to load devices for search:', error);
      }
    };
    loadDevices();
  }, []);

  // Gunakan useMemo untuk menghindari re-calculate setiap render
  const suggestions = useMemo(() => {
    if (!searchValue.trim()) {
      return [];
    }
    const normalizedInput = normalizeString(searchValue);

    // Cari devices berdasarkan input dari API
    const deviceSuggestions = devicesData
      .filter(device => normalizeString(device.name).includes(normalizedInput))
      .map(device => device.name)
      .slice(0, 8); // Tampilkan lebih banyak hasil karena hanya dari API

    return deviceSuggestions;
  }, [searchValue, devicesData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      performSearch(searchValue.trim());
    }
  };

  const performSearch = useCallback(
    (query) => {
      const normalizedQuery = normalizeString(query);

      // Cari device dari API (exact match dulu)
      let foundDevice = devicesData.find(
        (device) => normalizeString(device.name) === normalizedQuery
      );

      // Jika tidak ada exact match, coba partial match
      if (!foundDevice) {
        foundDevice = devicesData.find((device) =>
          normalizeString(device.name).includes(normalizedQuery)
        );
      }

      if (foundDevice) {
        // ✅ Validasi koordinat
        if (foundDevice.longitude && foundDevice.latitude) {
          const coords = [parseFloat(foundDevice.longitude), parseFloat(foundDevice.latitude)];
          if (isNaN(coords[0]) || isNaN(coords[1])) {
            console.error('❌ Koordinat tidak valid untuk device:', foundDevice.name, coords);
            console.log(`📍 Lokasi tidak ditemukan: "${query}"`);
            if (onSearch) onSearch(query, null);
            return;
          }
          console.log('🔍 Device ditemukan:', foundDevice.name, 'Koordinat:', coords);
          executeFlyTo(coords);
          if (onSearch) onSearch(query, coords);
          return;
        } else {
          console.error('❌ Device tidak memiliki koordinat:', foundDevice.name);
          console.log(`📍 Lokasi tidak ditemukan: "${query}"`);
          if (onSearch) onSearch(query, null);
          return;
        }
      }

      // Jika tidak ditemukan
      console.log(`📍 Lokasi tidak ditemukan: "${query}"`);
      if (onSearch) {
        onSearch(query, null);
      }
    },
    [devicesData, onSearch]
  );

  const executeFlyTo = useCallback(
    (coords) => {
      // Coba akses map via props dulu, lalu fallback ke window
      let targetMap = mapboxMap;
      if (!targetMap && typeof window !== 'undefined' && window.mapboxMap) {
        targetMap = window.mapboxMap;
      }

      if (!targetMap) {
        console.error('❌ ERROR: targetMap adalah null/undefined');
        return;
      }

      if (typeof targetMap.flyTo !== 'function') {
        console.error(
          '❌ ERROR: targetMap.flyTo bukan fungsi. Bukan instance MapboxGL.'
        );
        console.log('ℹ️ targetMap adalah:', targetMap);
        return;
      }

      try {
        targetMap.flyTo({
          center: coords,
          zoom: 12,
        });
        console.log('🚀 flyTo berhasil dipanggil!');
      } catch (error) {
        console.error('💥 Error saat memanggil flyTo:', error);
      }
    },
    [mapboxMap]
  );

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      setSearchValue(suggestion);
      performSearch(suggestion);
    },
    [performSearch]
  );

  const clearSearch = () => {
    setSearchValue('');
  };

  return (
    <div
      className={`fixed top-5 z-[70] transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'left-4' : 'left-4'
      }`}
    >
      <div className="w-92">
        <form onSubmit={handleSearch} className="relative">
          <div
            className={`bg-white rounded-lg shadow-lg transition-all duration-200 p-1.5 sm:p-2 ${
              isFocused ? 'shadow-xl ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-center py-1 sm:py-1.5">
              <div className="flex-shrink-0 mr-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder={placeholder}
                className="flex-1 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none text-sm leading-none"
              />
              {searchValue && (
                <div className="flex-shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Hapus pencarian"
                  >
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          {isFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-sm flex items-center"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GoogleMapsSearchbar;