// src/components/common/GoogleMapsSearchbar.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import cityCoordinates from "./CityCoordinates";

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
