// src/components/common/GoogleMapsSearchbar.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";

const normalizeString = (str) => {
    return str.trim().toLowerCase();
};

const GoogleMapsSearchbar = ({
    onSearch,
    placeholder = "Cari di Maps",
    isSidebarOpen = false,
    mapboxMap, // Bisa null
    stationsData = [], // Data marker dari MapboxMap
}) => {
    const [searchValue, setSearchValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // Gunakan useMemo untuk menghindari re-calculate setiap render
    const suggestions = useMemo(() => {
        if (!searchValue.trim()) {
            return [];
        }
        const normalizedInput = normalizeString(searchValue);
        const citySuggestions = Object.keys(cityCoordinates).filter((city) =>
            normalizeString(city).startsWith(normalizedInput)
        );
        const stationSuggestions = stationsData
            .filter((station) => normalizeString(station.name).includes(normalizedInput))
            .map((station) => station.name);

        return [...new Set([...citySuggestions, ...stationSuggestions])].slice(0, 5);
    }, [searchValue, stationsData]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchValue.trim()) {
            performSearch(searchValue.trim());
        }
    };

    const performSearch = useCallback(
        (query) => {
            const normalizedQuery = normalizeString(query);

            // Cek apakah query adalah nama kota
            const foundCityKey = Object.keys(cityCoordinates).find((city) => normalizeString(city) === normalizedQuery);

            if (foundCityKey) {
                const coords = cityCoordinates[foundCityKey];
                console.log("🔍 Lokasi kota ditemukan:", foundCityKey, "Koordinat:", coords);
                executeFlyTo(coords);
                if (onSearch) onSearch(query, coords);
                return;
            }

            // Cek apakah query adalah nama marker (exact match dulu)
            let foundStation = stationsData.find((station) => normalizeString(station.name) === normalizedQuery);

            // Jika tidak ada exact match, coba partial match
            if (!foundStation) {
                foundStation = stationsData.find((station) => normalizeString(station.name).includes(normalizedQuery));
            }

            if (foundStation) {
                // ✅ Validasi koordinat
                if (foundStation.longitude && foundStation.latitude) {
                    const coords = [parseFloat(foundStation.longitude), parseFloat(foundStation.latitude)];
                    if (isNaN(coords[0]) || isNaN(coords[1])) {
                        console.error("❌ Koordinat tidak valid untuk marker:", foundStation.name, coords);
                        console.log(`📍 Lokasi tidak ditemukan: "${query}"`);
                        if (onSearch) onSearch(query, null);
                        setIsFocused(false);
                        return;
                    }
                    console.log("🔍 Marker ditemukan:", foundStation.name, "Koordinat:", coords);
                    executeFlyTo(coords);
                    if (onSearch) onSearch(query, coords);
                    return;
                } else {
                    console.error("❌ Marker tidak memiliki koordinat:", foundStation.name);
                    console.log(`📍 Lokasi tidak ditemukan: "${query}"`);
                    if (onSearch) onSearch(query, null);
                    setIsFocused(false);
                    return;
                }
            }

            // Jika tidak ditemukan
            console.log(`📍 Lokasi tidak ditemukan: "${query}"`);
            if (onSearch) {
                onSearch(query, null);
            }

            // Reset suggestions & focus
            setTimeout(() => {
                setIsFocused(false);
            }, 200);
        },
        [stationsData, onSearch]
    );

<<<<<<< HEAD
    const executeFlyTo = useCallback(
        (coords) => {
            // Coba akses map via props dulu, lalu fallback ke window
            let targetMap = mapboxMap;
            if (!targetMap && typeof window !== "undefined" && window.mapboxMap) {
                targetMap = window.mapboxMap;
            }

            if (!targetMap) {
                console.error("❌ ERROR: targetMap adalah null/undefined");
                return;
            }

            if (typeof targetMap.flyTo !== "function") {
                console.error("❌ ERROR: targetMap.flyTo bukan fungsi. Bukan instance MapboxGL.");
                console.log("ℹ️ targetMap adalah:", targetMap);
                return;
            }

            try {
                targetMap.flyTo({
                    center: coords,
                    zoom: 12,
                });
                console.log("🚀 flyTo berhasil dipanggil!");
            } catch (error) {
                console.error("💥 Error saat memanggil flyTo:", error);
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
        setSearchValue("");
        // Tidak perlu setSuggestions — sudah dihandle via useMemo
    };

    return (
        <div
            className={`fixed top-4 z-[70] transition-all duration-300 ease-in-out ${
                isSidebarOpen ? "left-4 transform translate-x-0" : "left-4 transform translate-x-0"
            }`}
        >
            <div className="w-92">
                <form onSubmit={handleSearch} className="relative">
                    <div
                        className={`bg-white rounded-lg shadow-lg transition-all duration-200 p-1.5 sm:p-2 ${
                            isFocused ? "shadow-xl ring-2 ring-blue-500" : ""
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
                            <div className="flex-shrink-0 ml-2">
                                <button
                                    type="button"
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Petunjuk arah"
                                    disabled
                                >
                                    <svg
                                        className="w-4 h-4 text-blue-600 opacity-50"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                        />
                                    </svg>
                                </button>
                            </div>
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
=======
  return (
    <div className={`transition-all duration-300 ease-in-out h-full`}>
      <div className="w-full h-full">
        <form onSubmit={handleSearch} className="relative h-full">
          <div className={`bg-white rounded-lg shadow-lg transition-all duration-200 p-1.5 sm:p-2 h-full ${
            isFocused ? 'shadow-xl ring-2 ring-blue-500' : ''
          }`}>
            <div className="flex items-center h-full">
              {/* Search Icon */}
              <div className="flex-shrink-0 mr-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
>>>>>>> b86689dedf9038f83a8013cde8cf1c80a07f3149
            </div>
        </div>
    );
};

// Daftar kota tetap di luar komponen agar tidak direkompute tiap render
const cityCoordinates = {
    jakarta: [106.8456, -6.2088],
    surabaya: [112.7508, -7.2575],
    bandung: [107.6191, -6.9175],
    yogyakarta: [110.3695, -7.7956],
    semarang: [110.4204, -6.9667],
    medan: [98.6722, 3.5952],
    palembang: [104.7458, -2.9765],
    makassar: [119.4327, -5.1477],
    denpasar: [115.2126, -8.6705],
    bali: [115.2126, -8.6705],
    malang: [112.6308, -7.9831],
    sidoarjo: [112.7183, -7.4478],
    probolinggo: [113.7156, -7.7764],
    pasuruan: [112.6909, -7.6461],
    mojokerto: [112.4694, -7.4706],
    lamongan: [112.3333, -7.1167],
    gresik: [112.5729, -7.1554],
    tuban: [112.0483, -6.8976],
    bojonegoro: [111.8816, -7.15],
    jombang: [112.2333, -7.55],
    nganjuk: [111.8833, -7.6],
    kediri: [112.0167, -7.8167],
    blitar: [112.1667, -8.1],
    tulungagung: [111.9, -8.0667],
    bangil: [112.7333, -7.6],
    lawang: [112.6833, -7.8333],
    singosari: [112.65, -7.9],
    wates: [110.3569, -7.9133],
    lempuyangan: [110.3739, -7.7884],
};

export default GoogleMapsSearchbar;
