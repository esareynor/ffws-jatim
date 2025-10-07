// src/components/map/MapboxMap.js
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapTooltip from "./maptooltip";
import { fetchDevices } from "../../services/devices";
import VectorTilesAPI from "./VectorTilesAPI";

if (!mapboxgl.accessToken) mapboxgl.accessToken = "pk.eyJ1IjoiZGl0b2ZhdGFoaWxsYWgxIiwiYSI6ImNtZjNveGloczAwNncya3E1YzdjcTRtM3MifQ.kIf5rscGYOzvvBcZJ41u8g";

const MapboxMap = ({ tickerData, onStationSelect, onMapFocus }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [devices, setDevices] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedStationCoords, setSelectedStationCoords] = useState(null);
  const [safeAreaCoords, setSafeAreaCoords] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, station: null, coordinates: null });
  const [zoomLevel, setZoomLevel] = useState(8);
  const [riverLayerActive, setRiverLayerActive] = useState(false);
  const [showWaterEffect, setShowWaterEffect] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [autoSwitchActive, setAutoSwitchActive] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [clickedCoordinates, setClickedCoordinates] = useState(null);
  const [showCoordinatesPopup, setShowCoordinatesPopup] = useState(false);

  useEffect(() => {
    console.log("MapboxMap state:", { 
        autoSwitchActive, 
        currentStationIndex,
        selectedStation: selectedStation?.name,
        tickerDataLength: tickerData?.length 
    });
  }, [autoSwitchActive, currentStationIndex, selectedStation, tickerData]);

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
    const iconSize = 24;
    const iconColor = "white";
    switch (status) {
      case "safe":
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      case "warning":
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V13M12 17.0195V17M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      case "alert":
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 7.25V13M12 16.75V16.76M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      default:
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="${iconColor}" stroke-width="2"/>
        </svg>`;
    }
  };

  const getStationCoordinates = (stationName) => {
    if (!devices || devices.length === 0) return null;
    const device = devices.find((d) => d.name === stationName);
    if (device && device.latitude && device.longitude) {
      return [parseFloat(device.longitude), parseFloat(device.latitude)];
    }
    return null;
  };

  const createRectangleAroundPoint = (center, widthInKm, heightInKm) => {
    const [lng, lat] = center;
    const kmToDegrees = (km) => km / 111;
    const halfWidth = kmToDegrees(widthInKm) / 2;
    const halfHeight = kmToDegrees(heightInKm) / 2;
    const nw = [lng - halfWidth, lat + halfHeight];
    const ne = [lng + halfWidth, lat + halfHeight];
    const se = [lng + halfWidth, lat - halfHeight];
    const sw = [lng - halfWidth, lat - halfHeight];
    return {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[nw, ne, se, sw, nw]] },
      properties: {}
    };
  };

  const activateRiverLayer = (coords = null) => {
    const center = coords || selectedStationCoords;
    if (!map.current || !center || !mapLoaded) return;
    setShowWaterEffect(false);
    const safeArea = createRectangleAroundPoint(center, 5, 5);
    const safeAreas = { type: 'FeatureCollection', features: [safeArea] };
    setSafeAreaCoords(safeArea.geometry.coordinates);
    try {
      if (map.current.getSource('safe-areas')) {
        if (map.current.getLayer('safe-areas-fill')) map.current.removeLayer('safe-areas-fill');
        if (map.current.getLayer('safe-areas-border')) map.current.removeLayer('safe-areas-border');
        map.current.removeSource('safe-areas');
      }
      map.current.addSource('safe-areas', { type: 'geojson', data: safeAreas });
      map.current.addLayer({
        id: 'safe-areas-fill', type: 'fill', source: 'safe-areas',
        paint: { 'fill-color': '#10B981', 'fill-opacity': 0.3 }
      }, 'water-layer');
      map.current.addLayer({
        id: 'safe-areas-border', type: 'line', source: 'safe-areas',
        paint: { 'line-color': '#047857', 'line-width': 2, 'line-opacity': 0.8 }
      });
      if (!map.current.getLayer('water-layer')) {
        map.current.addLayer({
          id: 'water-layer', type: 'fill', source: 'composite', 'source-layer': 'water',
          filter: ['all', ['==', 'class', 'river']],
          paint: { 'fill-color': '#1E90FF', 'fill-opacity': 0.5 }
        });
      } else {
        map.current.setFilter('water-layer', ['all', ['==', 'class', 'river']]);
        map.current.setPaintProperty('water-layer', 'fill-color', '#1E90FF');
        map.current.setPaintProperty('water-layer', 'fill-opacity', 0.5);
      }
      setRiverLayerActive(true);
    } catch (error) { console.error("Error activating river layer:", error); }
  };

  const deactivateRiverLayer = () => {
    if (!map.current) return;
    try {
      if (map.current.getLayer('water-layer')) {
        map.current.setFilter('water-layer', ['all', ['==', 'class', 'river']]);
        map.current.setPaintProperty('water-layer', 'fill-color', '#1E90FF');
        map.current.setPaintProperty('water-layer', 'fill-opacity', 0.5);
      }
      if (map.current.getLayer('safe-areas-border')) map.current.removeLayer('safe-areas-border');
      if (map.current.getLayer('safe-areas-fill')) map.current.removeLayer('safe-areas-fill');
      if (map.current.getSource('safe-areas')) map.current.removeSource('safe-areas');
      setRiverLayerActive(false);
      setShowWaterEffect(false);
      setSafeAreaCoords(null);
    } catch (error) { console.error("Error deactivating river layer:", error); }
  };

  const toggleRiverLayer = () => riverLayerActive ? deactivateRiverLayer() : activateRiverLayer();
  const toggleWaterEffect = () => setShowWaterEffect(!showWaterEffect);
  const toggleFilterSidebar = () => setShowFilterSidebar(!showFilterSidebar);

  const handleMapFocus = (focusData) => {
    if (!map.current) return;
    const { lat, lng, zoom, stationId } = focusData;
    const coords = [lng, lat];
    if (!autoSwitchActive) { deactivateRiverLayer(); setShowWaterEffect(false); }
    setSelectedStationCoords(coords);
    const station = tickerData.find((s) => s.id === stationId);
    if (station) setSelectedStation(station);
    map.current.flyTo({
      center: coords, zoom: zoom || 14, pitch: 0, bearing: 0,
      speed: 1.2, curve: 1.4, easing: (t) => t, essential: true
    });
    setTimeout(() => {
      if (station) {
        const coordinates = getStationCoordinates(station.name);
        if (coordinates) setTooltip({ visible: true, station: station, coordinates: coordinates });
      }
    }, 800);
  };

  const handleShowDetail = (station) => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    if (onStationSelect) onStationSelect(station);
  };

  const handleCloseTooltip = () => setTooltip((prev) => ({ ...prev, visible: false }));

  const handleStationChange = (station, index) => {
    console.log("handleStationChange called with:", { station, index });
    if (station && station.latitude && station.longitude) {
      const coords = [station.longitude, station.latitude];
      setCurrentStationIndex(index);
      setSelectedStation(station);
      setSelectedStationCoords(coords);
      if (autoSwitchActive) activateRiverLayer(coords);
      handleMapFocus({ lat: station.latitude, lng: station.longitude, zoom: 14, stationId: station.id });
    }
  };

  const handleAutoSwitchToggle = (isActive) => {
    console.log("Auto switch toggled:", isActive);
    setAutoSwitchActive(isActive);
    if (isActive && selectedStationCoords) activateRiverLayer();
  };

  const handleMapClick = (e) => {
    if (e.originalEvent && e.originalEvent.target && e.originalEvent.target.closest('.custom-marker')) return;
    setClickedCoordinates(e.lngLat);
    setShowCoordinatesPopup(true);
  };

  const handleCloseCoordinatesPopup = () => {
    setShowCoordinatesPopup(false);
    setClickedCoordinates(null);
  };

  useEffect(() => {
    window.mapboxAutoFocus = handleMapFocus;
    return () => { if (window.mapboxAutoFocus) delete window.mapboxAutoFocus; };
  }, [tickerData]);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current, style: "mapbox://styles/mapbox/outdoors-v12",
        center: [112.5, -7.5], zoom: 8, pitch: 0, bearing: 0
      });
      map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");
      map.current.on("zoom", () => { if (map.current) setZoomLevel(map.current.getZoom()); });
      map.current.on('load', () => {
        setTimeout(() => {
          try {
            if (!map.current.getLayer('water-layer')) {
              map.current.addLayer({
                id: 'water-layer', type: 'fill', source: 'composite', 'source-layer': 'water',
                filter: ['all', ['==', 'class', 'river']],
                paint: { 'fill-color': '#1E90FF', 'fill-opacity': 0.5 }
              });
            }
            setMapLoaded(true);
          } catch (error) { console.error('Error adding water layer:', error); setMapLoaded(true); }
        }, 1000);
      });
      map.current.on('click', handleMapClick);
    } catch (error) { console.error('Error initializing map:', error); }
    return () => { if (map.current) { map.current.remove(); map.current = null; } };
  }, []);

  useEffect(() => {
    if (!map.current || !tickerData || !devices.length) return;
    markersRef.current.forEach((marker) => { if (marker && marker.remove) marker.remove(); });
    markersRef.current = [];
    tickerData.forEach((station) => {
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
            setShowCoordinatesPopup(false);
            deactivateRiverLayer();
            setSelectedStation(station);
            setSelectedStationCoords(coordinates);
            const index = tickerData.findIndex(s => s.id === station.id);
            setCurrentStationIndex(index);
            map.current.flyTo({
              center: coordinates, zoom: 12, pitch: 0, bearing: 0,
              speed: 1.2, curve: 1.4, easing: (t) => t, essential: true
            });
            setTooltip({ visible: true, station: station, coordinates: coordinates });
          });
        } catch (error) { console.error("Error creating marker:", error); }
      }
    });
  }, [tickerData, devices, autoSwitchActive]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltip.visible && !event.target.closest(".custom-marker") && 
          !event.target.closest(".mapboxgl-popup-content") && !event.target.closest(".map-tooltip")) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [tooltip.visible]);

  return (
    <div className="w-full h-screen overflow-hidden relative z-0">
      <div ref={mapContainer} className="w-full h-full relative z-0" />
     
      {selectedStationCoords && !riverLayerActive && zoomLevel > 10 && mapLoaded && (
        <button onClick={toggleRiverLayer} className="absolute bottom-16 left-4 z-10 px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center bg-white hover:bg-gray-100 text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Tampilkan Sungai
        </button>
      )}
      {selectedStationCoords && riverLayerActive && zoomLevel > 10 && (
        <>
          <button onClick={toggleRiverLayer} className="absolute bottom-28 left-4 z-10 px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center bg-red-500 hover:bg-red-600 text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Tutup Layer Sungai
          </button>
          <button onClick={toggleWaterEffect} className={`absolute bottom-16 left-4 z-10 px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center ${showWaterEffect ? 'bg-orange-500 hover:bg-orange-600 text-black' : 'bg-blue-500 hover:bg-blue-600 text-black'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            {showWaterEffect ? 'Kembalikan Warna Air Asli' : 'Ubah Warna Air di Area Hijau'}
          </button>
        </>
      )}
      {selectedStationCoords && riverLayerActive && (
        <VectorTilesAPI map={map.current} isVisible={showWaterEffect} coordinates={safeAreaCoords} mapLoaded={mapLoaded} />
      )}
    
      <style jsx>{`
        @keyframes alert-pulse { 0% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.5); opacity: 0.3; } 100% { transform: scale(1); opacity: 0.7; } }
        .mapboxgl-popup-content { border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .coordinates-popup .mapboxgl-popup-content { padding: 0; }
      `}</style>
      <MapTooltip map={map.current} station={tooltip.station} isVisible={tooltip.visible} coordinates={tooltip.coordinates} onShowDetail={handleShowDetail} onClose={handleCloseTooltip} />
    </div>
  );
};

export default MapboxMap;