// src/components/common/GoogleMapsSearchbar.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';

const normalizeString = (str) => {
  return str.trim().toLowerCase();
};

// Daftar kota besar dan kecil di seluruh Indonesia beserta koordinatnya
// Sumber: Data umum geografi Indonesia (dapat diperluas atau diimpor dari API)
// Format: "nama_kota": [longitude, latitude]
const cityCoordinates = {
    // --- Aceh ---
    bandaaceh: [95.3333, 5.5500],
    langsa: [97.9500, 4.4750],
    lhokseumawe: [97.1333, 5.1833],
    sabang: [95.3167, 5.8833],
    subulussalam: [97.9500, 2.6833],
    meulaboh: [96.1500, 4.1167],
    calang: [96.0333, 3.9167],
    sinabang: [96.3833, 2.2833],
    tapaktuan: [96.7500, 3.2833],
    simeulue: [96.0833, 2.4167],

    // --- Sumatera Utara ---
    medan: [98.6722, 3.5952],
    binjai: [98.4858, 3.4289],
    lubukpakam: [98.8333, 3.6667],
    tanjungbalai: [99.1111, 2.9833],
    sibolga: [98.7833, 1.7167],
    padangsidempuan: [99.2500, 1.3500],
    gunungsitoli: [97.6250, 1.1667],
    tebingtinggi: [98.9000, 3.3333],
    perbaungan: [98.9667, 3.3500],
    kisaran: [99.6000, 3.7500],

    // --- Sumatera Barat ---
    padang: [100.3500, -0.9500],
    bukittinggi: [100.3500, -0.3000],
    payakumbuh: [100.6333, -0.2500],
    pariaman: [100.1167, -0.6167],
    solok: [100.7833, -0.7833],
    sawahlunto: [100.8167, -0.5833],
    padangpanjang: [100.4167, -0.4667],

    // --- Riau ---
    pekanbaru: [101.4478, 0.5100],
    dumai: [101.4667, 1.6667],
    selatpanjang: [102.5000, 1.5833],

    // --- Jambi ---
    jambi: [103.6000, -1.6000],
    sungaipenuh: [101.4167, -2.1667],

    // --- Sumatera Selatan ---
    palembang: [104.7458, -2.9765],
    lubuklinggau: [102.8667, -3.2833],
    prabumulih: [104.2333, -3.4333],

    // --- Bengkulu ---
    bengkulu: [102.2657, -3.8000],

    // --- Lampung ---
    bandarlampung: [105.2667, -5.4500],
    metro: [105.2667, -5.1167],

    // --- Kepulauan Bangka Belitung ---
    pangkalpinang: [106.1000, -2.1167],

    // --- Kepulauan Riau ---
    tanjungpinang: [104.4500, 0.9500],
    batam: [104.0000, 1.0000],

    // --- Jakarta ---
    jakarta: [106.8456, -6.2088],
    bogor: [106.7952, -6.5947],
    depok: [106.8250, -6.3979],
    tangerang: [106.6290, -6.1789],
    bekasi: [107.0037, -6.2353],
    cimahi: [107.5388, -6.8614],
    cianjur: [107.1333, -6.8167],
    sukabumi: [106.9547, -6.9270],

    // --- Jawa Barat ---
    bandung: [107.6191, -6.9175],

    // --- Jawa Tengah ---
    semarang: [110.4204, -6.9667],
    solo: [110.7000, -7.5667],
    magelang: [110.2167, -7.4833],
    salatiga: [110.6833, -7.3333],
    pekalongan: [109.6667, -6.8833],
    tegal: [109.1333, -6.8667],
    purwokerto: [109.2333, -7.4167],

    // --- DI Yogyakarta ---
    yogyakarta: [110.3695, -7.7956],
    sleman: [110.3500, -7.7500],
    bantul: [110.3333, -7.8833],
    kulonprogo: [110.0000, -7.7500],
    gunungkidul: [110.7500, -7.9167],

    // --- Jawa Timur ---
    surabaya: [112.7508, -7.2575],
    sidoarjo: [112.7183, -7.4478],
    gresik: [112.5729, -7.1554],
    mojokerto: [112.4694, -7.4706],
    jombang: [112.2333, -7.5500],
    nganjuk: [111.8833, -7.6000],
    madiun: [111.5248, -7.6221],
    magetan: [111.3500, -7.6500],
    ngawi: [111.4333, -7.6500],
    bojonegoro: [111.8816, -7.1500],
    tuban: [112.0483, -6.8976],
    lamongan: [112.3333, -7.1167],
    demak: [110.6167, -6.8833],
    kudus: [110.8500, -6.8000],
    jepara: [110.6833, -6.5833],
    pati: [111.0333, -6.7500],
    rembang: [111.3167, -6.6833],
    blora: [111.3833, -7.0833],
    grobogan: [111.1167, -7.0833],
    sragen: [111.0333, -7.4167],
    karanganyar: [111.0833, -7.6167],
    malang: [112.6308, -7.9831],
    probolinggo: [113.7156, -7.7764],
    pasuruan: [112.6909, -7.6461],
    kediri: [112.0167, -7.8167],
    blitar: [112.1667, -8.1],
    tulungagung: [111.9, -8.0667],

    // --- Banten ---
    tangerang: [106.6290, -6.1789],
    tangerangselatan: [106.7167, -6.2833],
    tangerangbarat: [106.4667, -6.1667],
    serang: [106.1500, -6.1000],
    cilegon: [106.0167, -5.9833],

    // --- Bali ---
    denpasar: [115.2126, -8.6705],
    singaraja: [115.0920, -8.1000],

    // --- Nusa Tenggara Barat ---
    mataram: [116.0920, -8.5833],

    // --- Nusa Tenggara Timur ---
    kupang: [123.6000, -10.1833],

    // --- Kalimantan Barat ---
    pontianak: [109.3333, 0.0000],

    // --- Kalimantan Tengah ---
    palangkaraya: [113.9167, -2.2167],

    // --- Kalimantan Selatan ---
    banjarmasin: [114.5898, -3.3194],

    // --- Kalimantan Timur ---
    samarinda: [117.1537, -0.5022],
    balikpapan: [116.8941, -1.2451],

    // --- Kalimantan Utara ---
    tanjungselor: [117.3667, 2.8333],

    // --- Sulawesi Utara ---
    manado: [124.8447, 1.4917],

    // --- Gorontalo ---
    gorontalo: [123.0642, 0.5364],

    // --- Sulawesi Tengah ---
    palu: [119.8333, -0.9167],

    // --- Sulawesi Selatan ---
    makassar: [119.4327, -5.1477],

    // --- Sulawesi Tenggara ---
    kendari: [122.6083, -3.9917],

    // --- Maluku ---
    ambon: [128.1833, -3.7000],

    // --- Papua ---
    jayapura: [140.7000, -2.5333],

    // Anda bisa menambahkan lebih banyak kota di sini sesuai kebutuhan
    // Contoh untuk Jawa Timur tambahan
    bangil: [112.7333, -7.6],
    lawang: [112.6833, -7.8333],
    singosari: [112.65, -7.9],
    wates: [110.3569, -7.9133],
    lempuyangan: [110.3739, -7.7884],

    // Contoh kota-kota kecil lainnya
    probolinggo: [113.7156, -7.7764],
    pasuruan: [112.6909, -7.6461],

    // Tambahkan kota-kota lainnya sesuai kebutuhan Anda...
};

const GoogleMapsSearchbar = ({
  onSearch,
  placeholder = 'Cari di Maps',
  isSidebarOpen = false,
  mapboxMap, // Bisa null
  stationsData = [], // Data marker dari MapboxMap
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Gunakan useMemo untuk menghindari re-calculate setiap render
  const suggestions = useMemo(() => {
    if (!searchValue.trim()) {
      return [];
    }
    const normalizedInput = normalizeString(searchValue);

    // Cari kota berdasarkan input
    const citySuggestions = Object.keys(cityCoordinates)
      .filter(city => normalizeString(city).includes(normalizedInput)) // Gunakan includes untuk pencarian parsial
      .slice(0, 3); // Batasi jumlah hasil kota

    // Cari stasiun berdasarkan input
    const stationSuggestions = stationsData
      .filter(station => normalizeString(station.name).includes(normalizedInput)) // Gunakan includes untuk pencarian parsial
      .map(station => station.name)
      .slice(0, 2); // Batasi jumlah hasil stasiun

    // Gabungkan dan batasi total hasil
    return [...citySuggestions, ...stationSuggestions].slice(0, 5);
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

      // Cek apakah query adalah nama kota (exact match dulu)
      let foundCityKey = Object.keys(cityCoordinates).find(
        (city) => normalizeString(city) === normalizedQuery
      );

      // Jika tidak ada exact match, coba partial match (mencari kota yang mengandung query)
      if (!foundCityKey) {
        foundCityKey = Object.keys(cityCoordinates).find(
          (city) => normalizeString(city).includes(normalizedQuery)
        );
      }

      if (foundCityKey) {
        const coords = cityCoordinates[foundCityKey];
        console.log('🔍 Lokasi kota ditemukan:', foundCityKey, 'Koordinat:', coords);
        executeFlyTo(coords);
        if (onSearch) onSearch(query, coords);
        return;
      }

      // Cek apakah query adalah nama marker (exact match dulu)
      let foundStation = stationsData.find(
        (station) => normalizeString(station.name) === normalizedQuery
      );

      // Jika tidak ada exact match, coba partial match
      if (!foundStation) {
        foundStation = stationsData.find((station) =>
          normalizeString(station.name).includes(normalizedQuery)
        );
      }

      if (foundStation) {
        // ✅ Validasi koordinat
        if (foundStation.longitude && foundStation.latitude) {
          const coords = [parseFloat(foundStation.longitude), parseFloat(foundStation.latitude)];
          if (isNaN(coords[0]) || isNaN(coords[1])) {
            console.error('❌ Koordinat tidak valid untuk marker:', foundStation.name, coords);
            console.log(`📍 Lokasi tidak ditemukan: "${query}"`);
            if (onSearch) onSearch(query, null);
            return;
          }
          console.log('🔍 Marker ditemukan:', foundStation.name, 'Koordinat:', coords);
          executeFlyTo(coords);
          if (onSearch) onSearch(query, coords);
          return;
        } else {
          console.error('❌ Marker tidak memiliki koordinat:', foundStation.name);
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
    [stationsData, onSearch]
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