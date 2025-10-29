// src/components/devices/MapboxMap.jsx
import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchDevices } from "../../services/devices";
import GoogleMapsSearchbar from "/src/components/common/GoogleMapsSearchbar";

const MapTooltip = lazy(() => import("./maptooltip"));
const FilterPanel = lazy(() => import("../FilterPanel.jsx"));
const StationDetail = lazy(() => import("../StationDetail.jsx"));

mapboxgl.accessToken = "pk.eyJ1IjoiZGl0b2ZhdGFoaWxsYWgxIiwiYSI6ImNtZjNveGloczAwNncya3E1YzdjcTRtM3MifQ.kIf5rscGYOzvvBcZJ41u8g";

const MapboxMap = ({ tickerData, onStationSelect, onMapFocus }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [devices, setDevices] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, station: null, coordinates: null });
  const [zoomLevel, setZoomLevel] = useState(8);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [autoSwitchActive, setAutoSwitchActive] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [selectedStationCoords, setSelectedStationCoords] = useState(null);

  const [activeLayers, setActiveLayers] = useState({
    rivers: false,
    'flood-risk': false,
    rainfall: false,
    elevation: false,
    administrative: false,
  });

  const [administrativeGeojson, setAdministrativeGeojson] = useState(null);
  const administrativeSourceId = 'administrative-boundaries';
  const administrativeLayerId = 'administrative-fill';

  const [riversGeojson, setRiversGeojson] = useState(null);
  const riversSourceId = 'rivers-jatim-source';
  const riversLayerId = 'rivers-jatim-layer';
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const getBBox = (geometry) => {
    const bounds = [[Infinity, Infinity], [-Infinity, -Infinity]];
    const traverse = (arr) => {
      if (arr.length === 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number') {
        bounds[0][0] = Math.min(bounds[0][0], arr[0]);
        bounds[0][1] = Math.min(bounds[0][1], arr[1]);
        bounds[1][0] = Math.max(bounds[1][0], arr[0]);
        bounds[1][1] = Math.max(bounds[1][1], arr[1]);
      } else arr.forEach(traverse);
    };
    traverse(geometry.coordinates);
    return bounds;
  };
  
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };
    loadDevices();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "safe": return "#10B981";
      case "warning": return "#F59E0B";
      case "alert": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const getStatusIcon = (status) => {
    const iconSize = 24, iconColor = "white";
    switch (status) {
      case "safe": return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case "warning": return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9V13M12 17.0195V17M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case "alert": return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 7.25V13M12 16.75V16.76M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      default: return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="${iconColor}" stroke-width="2"/></svg>`;
    }
  };

  const getStationCoordinates = (stationName) => {
    if (!devices?.length) return null;
    const device = devices.find(d => d.name === stationName);
    return device?.latitude && device.longitude ? [parseFloat(device.longitude), parseFloat(device.latitude)] : null;
  };

  const handleMarkerClick = (station, coordinates) => {
    setSelectedStation(station);
    setSelectedStationCoords(coordinates);
    if (map.current) map.current.flyTo({ center: coordinates, zoom: 14 });
    setTooltip({ visible: true, station, coordinates });
  };

  const handleShowDetail = (station) => {
    setTooltip(prev => ({ ...prev, visible: false }));
    if (onStationSelect) onStationSelect(station);
  };

  const handleCloseTooltip = () => setTooltip(prev => ({ ...prev, visible: false }));

  const handleStationChange = (station, index) => {
    if (station?.latitude && station.longitude) {
      const coords = [station.longitude, station.latitude];
      setCurrentStationIndex(index);
      setSelectedStation(station);
      if (map.current) map.current.flyTo({ center: coords, zoom: 14 });
      setTooltip({ visible: true, station, coordinates: coords });
    }
  };

  const handleAutoSwitchToggle = (isActive) => setAutoSwitchActive(isActive);

  const handleLayerToggle = (layerId) => {
    setActiveLayers(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [112.5, -7.5],
        zoom: 8
      });

      // Simpan instance map ke window sebagai fallback
      if (typeof window !== 'undefined') {
        window.mapboxMap = map.current;
      }

      map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");
      map.current.on("zoom", () => map.current && setZoomLevel(map.current.getZoom()));
      map.current.on('load', () => setMapLoaded(true));
    } catch (error) {
      console.error('Error initializing map:', error);
    }
    return () => { if (map.current) { map.current.remove(); map.current = null; } };
  }, []);

  useEffect(() => {
    if (!map.current || !tickerData || !devices.length) return;
    markersRef.current.forEach(marker => marker?.remove?.());
    markersRef.current = [];
    tickerData.forEach(station => {
      const coordinates = getStationCoordinates(station.name);
      if (coordinates) {
        try {
          const markerEl = document.createElement("div");
          markerEl.className = "custom-marker";
          markerEl.style.cssText = `
            width: 24px; height: 24px; border-radius: 50%; 
            background-color: ${getStatusColor(station.status)}; 
            border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); 
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            position: relative;
          `;
          markerEl.innerHTML = getStatusIcon(station.status);
          if (station.status === "alert") {
            const pulseEl = document.createElement("div");
            pulseEl.style.cssText = `
              position: absolute; width: 100%; height: 100%; border-radius: 50%; 
              background-color: ${getStatusColor(station.status)}; opacity: 0.7; 
              animation: alert-pulse 2s infinite; z-index: -1;
            `;
            markerEl.appendChild(pulseEl);
          }
          const marker = new mapboxgl.Marker(markerEl).setLngLat(coordinates).addTo(map.current);
          markersRef.current.push(marker);
          markerEl.addEventListener("click", (e) => {
            e.stopPropagation();
            if (autoSwitchActive) setAutoSwitchActive(false);
            handleMarkerClick(station, coordinates);
          });
        } catch (error) {
          console.error("Error creating marker:", error);
        }
      }
    });
  }, [tickerData, devices, autoSwitchActive]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltip.visible &&
        !event.target.closest(".custom-marker") &&
        !event.target.closest(".mapboxgl-popup-content") &&
        !event.target.closest(".map-tooltip")) {
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [tooltip.visible]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const isRiversActive = activeLayers.rivers;
    if (!isRiversActive) {
      if (map.current.getLayer(riversLayerId)) map.current.removeLayer(riversLayerId);
      if (map.current.getSource(riversSourceId)) map.current.removeSource(riversSourceId);
      return;
    }
    if (riversGeojson) {
      if (!map.current.getSource(riversSourceId)) {
        map.current.addSource(riversSourceId, { type: 'geojson', data: riversGeojson });
      }
      if (!map.current.getLayer(riversLayerId)) {
        map.current.addLayer({
          id: riversLayerId,
          type: 'line',
          source: riversSourceId,
          paint: { 'line-color': '#0000FF', 'line-width': 2.5, 'line-opacity': 0.8 }
        });
      }
    } else {
      fetch('TestMAP.json')
        .then(res => res.ok ? res.json() : Promise.reject('Sungai JSON not found (404)'))
        .then(data => { console.log('✅ Sungai Jawa Timur JSON dimuat'); setRiversGeojson(data); })
        .catch(e => { console.error('❌ Gagal muat GeoJSON Sungai Jawa Timur:', e); setActiveLayers(prev => ({ ...prev, rivers: false })); });
    }
    return () => {
      if (map.current.getLayer(riversLayerId)) map.current.removeLayer(riversLayerId);
      if (map.current.getSource(riversSourceId)) map.current.removeSource(riversSourceId);
    };
  }, [mapLoaded, activeLayers.rivers, riversGeojson]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const isLayerActive = activeLayers.administrative;
    if (!isLayerActive) {
      ['administrative-fill', 'administrative-highlight', 'administrative-fill-highlight'].forEach(id => {
        if (map.current.getLayer(id)) map.current.removeLayer(id);
      });
      if (map.current.getSource(administrativeSourceId)) map.current.removeSource(administrativeSourceId);
      return;
    }
    if (administrativeGeojson) {
      if (!map.current.getSource(administrativeSourceId)) {
        map.current.addSource(administrativeSourceId, { type: 'geojson', data: administrativeGeojson });
      }
      if (!map.current.getLayer(administrativeLayerId)) {
        map.current.addLayer({
          id: administrativeLayerId,
          type: 'fill',
          source: administrativeSourceId,
          paint: {
            'fill-color': ['coalesce', ['get', 'fill_color'], '#6B7280'],
            'fill-opacity': 0.5,
            'fill-outline-color': '#4B5563'
          }
        });
      }
      if (!map.current.getLayer('administrative-highlight')) {
        map.current.addLayer({
          id: 'administrative-highlight',
          type: 'line',
          source: administrativeSourceId,
          paint: { 'line-color': '#000', 'line-width': 4, 'line-opacity': 0.8 },
          filter: ['==', ['get', 'id'], '']
        });
      }
      if (!map.current.getLayer('administrative-fill-highlight')) {
        map.current.addLayer({
          id: 'administrative-fill-highlight',
          type: 'fill',
          source: administrativeSourceId,
          paint: { 'fill-color': '#6ee7b7', 'fill-opacity': 0.6 },
          filter: ['==', ['get', 'id'], '']
        });
      }
    } else {
      fetch('/72_peta_4_peta_Wilayah_Sungai.json')
        .then(res => res.ok ? res.json() : Promise.reject('JSON not found (404)'))
        .then(data => {
          data.features.forEach((f, i) => {
            if (!f.properties.id) f.properties.id = f.properties.name?.toLowerCase().replace(/\s+/g, '-') || `region-${i}`;
          });
          setAdministrativeGeojson(data);
        })
        .catch(e => { console.error('❌ Gagal JSON Batas Administrasi:', e); setActiveLayers(prev => ({ ...prev, administrative: false })); });
    }
    return () => {
      ['administrative-fill', 'administrative-highlight', 'administrative-fill-highlight'].forEach(id => {
        if (map.current.getLayer(id)) map.current.removeLayer(id);
      });
      if (map.current.getSource(administrativeSourceId)) map.current.removeSource(administrativeSourceId);
    };
  }, [mapLoaded, activeLayers.administrative, administrativeGeojson]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !activeLayers.administrative) return;
    const handleMouseMove = (e) => {
      const features = map.current.queryRenderedFeatures(e.point, { layers: [administrativeLayerId] });
      if (features.length > 0) {
        const f = features[0], id = f.properties.id;
        setHoveredFeature(f);
        map.current.setFilter('administrative-highlight', ['==', ['get', 'id'], id]);
        map.current.setFilter('administrative-fill-highlight', ['==', ['get', 'id'], id]);
      } else {
        setHoveredFeature(null);
        map.current.setFilter('administrative-highlight', ['==', ['get', 'id'], '']);
        map.current.setFilter('administrative-fill-highlight', ['==', ['get', 'id'], '']);
      }
    };
    const handleMouseLeave = () => {
      setHoveredFeature(null);
      map.current.setFilter('administrative-highlight', ['==', ['get', 'id'], '']);
      map.current.setFilter('administrative-fill-highlight', ['==', ['get', 'id'], '']);
    };
    map.current.on('mousemove', handleMouseMove);
    map.current.on('mouseleave', handleMouseLeave);
    return () => {
      map.current.off('mousemove', handleMouseMove);
      map.current.off('mouseleave', handleMouseLeave);
    };
  }, [mapLoaded, activeLayers.administrative]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !activeLayers.administrative) return;
    const handleClick = (e) => {
      const features = map.current.queryRenderedFeatures(e.point, { layers: [administrativeLayerId] });
      if (features.length > 0) {
        const bbox = getBBox(features[0].geometry);
        if (isFinite(bbox[0][0]) && isFinite(bbox[1][0]) && bbox[0][0] !== Infinity) {
          map.current.fitBounds(bbox, { padding: 60, maxZoom: 12, duration: 800 });
        }
      }
    };
    map.current.on('click', administrativeLayerId, handleClick);
    return () => { if (map.current) map.current.off('click', administrativeLayerId, handleClick); };
  }, [mapLoaded, activeLayers.administrative]);

  const handleSearch = (query, coords) => {
    console.log("Pencarian berhasil:", query, coords);
  };

  return (
    <div className="w-full h-screen overflow-hidden relative z-0">
      <div ref={mapContainer} className="w-full h-full relative z-0" />
      
      {/* --- Searchbar hanya ditampilkan setelah map siap --- */}
      {mapLoaded && map.current ? (
        <GoogleMapsSearchbar
          mapboxMap={map.current} // ✅ Kirim instance langsung
          stationsData={tickerData}
          onSearch={handleSearch}
          isSidebarOpen={showFilterSidebar}
          placeholder="Cari Lokasi di Jawa Timur..."
        />
      ) : (
        <div className="fixed top-4 left-4 z-[70] bg-white rounded-lg shadow-lg p-2">
          <span className="text-sm text-gray-500">Memuat peta...</span>
        </div>
      )}
      {/* --- Akhir Searchbar --- */}
      
      <Suspense fallback={null}>
        <FilterPanel
          isOpen={showFilterSidebar}
          onOpen={() => setShowFilterSidebar(true)}
          onClose={() => setShowFilterSidebar(false)}
          tickerData={tickerData}
          handleStationChange={handleStationChange}
          currentStationIndex={currentStationIndex}
          handleAutoSwitchToggle={handleAutoSwitchToggle}
          onLayerToggle={handleLayerToggle}
          activeLayers={activeLayers}
        />
      </Suspense>
      <style>{`
        @keyframes alert-pulse { 
          0% { transform: scale(1); opacity: 0.7; } 
          50% { transform: scale(1.5); opacity: 0.3; } 
          100% { transform: scale(1); opacity: 0.7; } 
        }
        .mapboxgl-popup-content { border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .coordinates-popup .mapboxgl-popup-content { padding: 0; }
      `}</style>
      <Suspense fallback={null}>
        <MapTooltip 
          map={map.current} 
          station={tooltip.station} 
          isVisible={tooltip.visible} 
          coordinates={tooltip.coordinates} 
          onShowDetail={handleShowDetail} 
          onClose={handleCloseTooltip} 
        />
      </Suspense>
      {selectedStation && onStationSelect && (
        <Suspense fallback={null}>
          <StationDetail
            selectedStation={selectedStation}
            onClose={() => onStationSelect(null)}
            tickerData={tickerData}
          />
        </Suspense>
      )}
      <div className="absolute top-4 right-4 z-[80]">
        <button
          onClick={() => setShowFilterSidebar(true)}
          className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-blue-50 transition-colors shadow-md"
          title="Buka Filter"
          aria-label="Buka Filter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 w-6 h-6 text-blue-600">
            <path d="M22 3H2l8 9v7l4 2v-9l8-9z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MapboxMap;