import React, { useState, useEffect, useRef } from 'react';

const GoogleMapsSearchbar = ({ 
  onSearch, 
  placeholder = "Cari di Maps", 
  isSidebarOpen = false,
  mapboxMap = null // Tambahkan prop untuk instance Mapbox
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  // Koordinat untuk kota-kota besar di Indonesia
  const cityCoordinates = {
    'Jakarta': [106.8456, -6.2088],
    'Surabaya': [112.7508, -7.2575],
    'Bandung': [107.6191, -6.9175],
    'Yogyakarta': [110.3695, -7.7956],
    'Semarang': [110.4204, -6.9667],
    'Medan': [98.6722, 3.5952],
    'Palembang': [104.7458, -2.9765],
    'Makassar': [119.4327, -5.1477],
    'Denpasar': [115.2126, -8.6705],
    'Bali': [115.2126, -8.6705],
    'Malang': [112.6308, -7.9831],
    'Sidoarjo': [112.7183, -7.4478],
    'Probolinggo': [113.7156, -7.7764],
    'Pasuruan': [112.6909, -7.6461],
    'Mojokerto': [112.4694, -7.4706],
    'Lamongan': [112.3333, -7.1167],
    'Gresik': [112.5729, -7.1554],
    'Tuban': [112.0483, -6.8976],
    'Bojonegoro': [111.8816, -7.1500],
    'Jombang': [112.2333, -7.5500],
    'Nganjuk': [111.8833, -7.6000],
    'Kediri': [112.0167, -7.8167],
    'Blitar': [112.1667, -8.1000],
    'Tulungagung': [111.9000, -8.0667],
    'Bangil': [112.7333, -7.6000],
    'Lawang': [112.6833, -7.8333],
    'Singosari': [112.6500, -7.9000],
    'Wates': [110.3569, -7.9133],
    'Lempuyangan': [110.3739, -7.7884],
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      performSearch(searchValue);
    }
  };
  
  const performSearch = (query) => {
    // Cari kota yang cocok
    let found = false;
    for (const city in cityCoordinates) {
      if (query.toLowerCase().includes(city.toLowerCase())) {
        const coords = cityCoordinates[city];
        
        // Pindahkan peta ke lokasi yang dicari
        if (mapboxMap && mapboxMap.current) {
          mapboxMap.current.flyTo({
            center: coords,
            zoom: 12,
            pitch: 45,
            bearing: -17.6,
            speed: 1.2,
            curve: 1.4,
            easing: (t) => t,
            essential: true
          });
        }
        
        // Panggil callback onSearch jika ada
        if (onSearch) {
          onSearch(query);
        }
        
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(`Location not found: ${query}`);
      // Jika tidak ditemukan, tetap panggil callback onSearch
      if (onSearch) {
        onSearch(query);
      }
    }
    
    setSuggestions([]); // Clear suggestions after search
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Generate suggestions based on input
    if (value.trim()) {
      const filteredCities = Object.keys(cityCoordinates).filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      
      if (filteredCities.length > 0) {
        setSuggestions(filteredCities);
      } else {
        // Fallback to dummy suggestions if no city matches
        const dummySuggestions = [
          `${value} Jakarta`,
          `${value} Surabaya`,
          `${value} Bandung`,
          `${value} Yogyakarta`,
          `${value} Bali`
        ];
        setSuggestions(dummySuggestions);
      }
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    setSuggestions([]);
    performSearch(suggestion);
  };
  
  const clearSearch = () => {
    setSearchValue('');
    setSuggestions([]);
  };
  
  return (
    <div className={`fixed top-4 z-[70] transition-all duration-300 ease-in-out ${
      isSidebarOpen 
        ? 'left-4 transform translate-x-0' 
        : 'left-4 transform translate-x-0'
    }`}>
      <div className="w-92">
        <form onSubmit={handleSearch} className="relative">
          <div className={`bg-white rounded-lg shadow-lg transition-all duration-200 p-1.5 sm:p-2 ${
            isFocused ? 'shadow-xl ring-2 ring-blue-500' : ''
          }`}>
            <div className="flex items-center py-1 sm:py-1.5">
              {/* Search Icon */}
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
              
              {/* Search Input */}
              <input
                type="text"
                value={searchValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder={placeholder}
                className="flex-1 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none text-sm leading-none"
              />
              
              {/* Clear Button */}
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
              
              {/* Direction Icon */}
              <div className="flex-shrink-0 ml-2">
                <button
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Petunjuk arah"
                >
                  <svg 
                    className="w-4 h-4 text-blue-600" 
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
          
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {suggestion}
                  </div>
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
