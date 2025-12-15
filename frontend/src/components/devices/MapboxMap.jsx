import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchDevices } from "../../services/devices";
import { fetchDeviceGeoJSON } from "/src/services/MapGeo";
import GoogleMapsSearchbar from "../common/GoogleMapsSearchbar";
import { REGION_ID_TO_DEVICE_ID, DEVICE_ID_TO_COLOR, getBBox, getStatusColor, getMarkerStyle, getButtonStyleOverride, getUptIdFromStationName, extractKeywords, } from "./mapUtils";

const MapTooltip = lazy(() => import("./maptooltip"));
const FilterPanel = lazy(() => import("/src/components/common/FilterPanel.jsx"));
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
    rivers: false, 'flood-risk': false, rainfall: false, administrative: false,
    'Hujan Jam-Jam an PU SDA': false, 'Pos Duga Air Jam-Jam an PU SDA': false,
  });
  const [regionLayers, setRegionLayers] = useState({});
  const [administrativeGeojson, setAdministrativeGeojson] = useState(null);
  const administrativeSourceId = 'administrative-boundaries';
  const administrativeLayerId = 'administrative-fill';
  const [riversGeojson, setRiversGeojson] = useState(null);
  const riversSourceId = 'rivers-jatim-source';
  const riversLayerId = 'rivers-jatim-layer';
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);
      } catch (error) { console.error("Failed to fetch devices:", error); }
    };
    loadDevices();
  }, []);

  const getStationCoordinates = (stationName) => {
    if (!devices?.length) return null;
    const device = devices.find(d => d.name === stationName);
    if (!device?.latitude || !device?.longitude) return null;
    return [parseFloat(device.longitude), parseFloat(device.latitude)];
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

  const handleRegionLayerToggle = async (regionId, isActive) => {
    if (!map.current || !mapLoaded) return;
    const deviceId = REGION_ID_TO_DEVICE_ID[regionId];
    if (deviceId === undefined) return;
    const sourceId = `region-${regionId}`;
    const layerId = `region-${regionId}-fill`;
    if (isActive) {
      try {
        const geojson = await fetchDeviceGeoJSON(deviceId);
        if (!geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) {
          setActiveLayers(prev => ({ ...prev, [regionId]: false }));
          return;
        }
        if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
        if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);
        map.current.addSource(sourceId, { type: 'geojson', data: geojson });
        map.current.addLayer({
          id: layerId, type: 'fill', source: sourceId,
          paint: { 'fill-color': DEVICE_ID_TO_COLOR[deviceId] || '#6B7280', 'fill-opacity': 0.5, 'fill-outline-color': '#4B5563' }
        });
        const clickHandler = (e) => {
          try {
            const features = e.features || [];
            if (features.length === 0) return;
            const geom = features[0].geometry;
            const bbox = getBBox(geom);
            if (isFinite(bbox[0][0]) && isFinite(bbox[1][0])) {
              map.current.fitBounds(bbox, { padding: 60, maxZoom: 12, duration: 800 });
            }
          } catch (err) { console.error('Error on region click handler:', err); }
        };
        const mouseEnterHandler = () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; };
        const mouseLeaveHandler = () => { if (map.current) map.current.getCanvas().style.cursor = ''; };
        map.current.on('click', layerId, clickHandler);
        map.current.on('mouseenter', layerId, mouseEnterHandler);
        map.current.on('mouseleave', layerId, mouseLeaveHandler);
        setRegionLayers(prev => ({
          ...prev,
          [regionId]: { sourceId, layerId, deviceId, geojson, clickHandler, mouseEnterHandler, mouseLeaveHandler }
        }));
      } catch (e) {
        console.error(`❌ Gagal muat GeoJSON dari API untuk device ID ${deviceId}:`, e);
        setActiveLayers(prev => ({ ...prev, [regionId]: false }));
      }
    } else {
      const existing = regionLayers[regionId];
      if (existing) {
        try {
          if (existing.clickHandler) map.current.off('click', layerId, existing.clickHandler);
          if (existing.mouseEnterHandler) map.current.off('mouseenter', layerId, existing.mouseEnterHandler);
          if (existing.mouseLeaveHandler) map.current.off('mouseleave', layerId, existing.mouseLeaveHandler);
        } catch (err) { console.warn('Error removing handlers for', layerId, err); }
      }
      if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
      if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);
      setRegionLayers(prev => {
        const newLayers = { ...prev };
        delete newLayers[regionId];
        return newLayers;
      });
    }
  };

  const handleLayerToggle = (layerId) => {
    if (layerId.startsWith('ws-')) {
      setActiveLayers(prev => {
        const newState = { ...prev, [layerId]: !prev[layerId] };
        handleRegionLayerToggle(layerId, newState[layerId]);
        return newState;
      });
    } else {
      setActiveLayers(prev => ({ ...prev, [layerId]: !prev[layerId] }));
    }
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
      if (typeof window !== 'undefined') window.mapboxMap = map.current;
      map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");
      map.current.on("zoom", () => map.current && setZoomLevel(map.current.getZoom()));
      map.current.on('load', () => setMapLoaded(true));
    } catch (error) { console.error('Error initializing map:', error); }
    return () => { if (map.current) { map.current.remove(); map.current = null; } };
  }, []);

  useEffect(() => {
    if (!map.current || !tickerData || !devices.length) return;
    markersRef.current.forEach(marker => marker?.remove?.());
    markersRef.current = [];

    const awlrBrantasList = [
      "AWLR Gubeng", "AWLR Gunungsari", "AWLR Jagir", "AWLR Lohor", "AWLR Lodoyo",
      "AWLR Menturus", "AWLR Milirip", "AWLR Mojokerto", "AWLR Mrican", "AWLR New Lengkong",
      "AWLR Neyama 1", "AWLR Pintu Bendo", "AWLR Pintu Wonokromo", "AWLR Pompa Tulungagung",
      "AWLR Segawe", "AWLR Selorejo", "AWLR Sengguruh", "AWLR Sutami", "AWLR Tiudan",
      "AWLR Wlingi", "AWLR Wonokromo", "AWLR Wonorejo",
    ];

    const awlrBengawanSoloList = [
      "AWLR Bendungan Jati", "AWLR BG Babat", "AWLR BG Bojonegoro",
    ];

    const arrBrantasList = [
      "ARR Wagir", "ARR Tangkil", "ARR Poncokusumo", "ARR Dampit", "ARR Sengguruh",
      "ARR Sutami", "ARR Tunggorono", "ARR Doko", "ARR Birowo", "ARR Wates Wlingi",
      "Semen ARR", "ARR Sumberagung", "Bendungan ARR Wlingi", "ARR Tugu", "ARR Kampak",
      "ARR Bendo", "ARR Pagerwojo", "ARR Kediri", "ARR Tampung", "ARR Gunung Sari",
      "ARR Metro", "ARR Gemarang", "ARR Bendungan", "ARR Tawangsari", "ARR Sadar",
      "ARR Bogel", "ARR Karangpilang", "ARR Kedurus", "ARR Wonorejo-1", "ARR Wonorejo-2",
      "ARR Rejotangan", "ARR Kali Biru", "ARR Neyama", "ARR Selorejo",
    ];

    const brantasKeywords = extractKeywords(awlrBrantasList);
    const bengawanKeywords = extractKeywords(awlrBengawanSoloList);
    const arrBrantasListKeywords = extractKeywords(arrBrantasList);

    tickerData.forEach(station => {
      const coordinates = getStationCoordinates(station.name);
      if (!coordinates) return;

      const stationUptId = getUptIdFromStationName(station.name);

      const isBengawanSoloPJT1Active = activeLayers['pos-hujan-ws-bengawan-solo'];
      const isBSStation = station.name.startsWith('BS');

      const isHujanJamJamActive = !!activeLayers['Hujan Jam-Jam an PU SDA'];
      const nameTrim = station.name ? station.name.trim() : '';
      const isDoubleQuotedName = /^".*"$/.test(nameTrim);
      const isHujanJamJamStation = isDoubleQuotedName;

      // --- PERUBAHAN UNTUK POS DUGA AIR ---
      const isPosDugaJamJamActive = (!!activeLayers['Pos Duga Air Jam-Jam an PU SDA']) ||
        Object.keys(activeLayers).some(k => k.toLowerCase().includes('pos-duga') && activeLayers[k]);

      const isPosDugaJamJamStation = station.name.toLowerCase().includes('awlr');
      // --- AKHIR PERUBAHAN ---

      const isHujanBrantasActive = activeLayers['pos-hujan-ws-brantas-pjt1'];
      const isARRBrantasStation = arrBrantasListKeywords.some(keyword =>
        station.name.toLowerCase().includes(keyword.toLowerCase())
      );

      const isDugaAirBengawanSoloActive = activeLayers['pos-duga-air-ws-bengawan-solo'];
      const isAWLRBengawanSoloStation = bengawanKeywords.some(keyword =>
        station.name.toLowerCase().includes(keyword.toLowerCase())
      );

      const isDugaAirBrantasActive = activeLayers['pos-duga-air-ws-brantas-pjt1'];
      const isAWLRBrantasStation = brantasKeywords.some(keyword =>
        station.name.toLowerCase().includes(keyword.toLowerCase())
      );

      const isAnyUptActive = Object.keys(activeLayers).some(key => key.startsWith('upt-') && activeLayers[key]);

      const activeRegionIds = Object.keys(activeLayers).some(k => k.startsWith('ws-') && activeLayers[k]);
      if (activeRegionIds) return;

      let shouldShowMarker = false;

      if (isAnyUptActive && stationUptId && activeLayers[stationUptId]) {
        shouldShowMarker = true;
      } else if (isHujanJamJamActive && isHujanJamJamStation) {
        shouldShowMarker = true;
      } else if (isPosDugaJamJamActive && isPosDugaJamJamStation) {
        shouldShowMarker = true;
      } else if (isHujanBrantasActive && isARRBrantasStation) {
        shouldShowMarker = true;
      } else if (isDugaAirBrantasActive && isAWLRBrantasStation) {
        shouldShowMarker = true;
      } else if (isDugaAirBengawanSoloActive && isAWLRBengawanSoloStation) {
        shouldShowMarker = true;
      } else if (isBengawanSoloPJT1Active && isBSStation) {
        shouldShowMarker = true;
      }

      if (!shouldShowMarker) return;

      try {
        const markerEl = document.createElement("div");
        markerEl.className = "custom-marker";
        const markerStyle = getMarkerStyle(station.name);
        const bgColor = getStatusColor(station.status);
        const override = getButtonStyleOverride({
          isHujanJamJamActive,
          isPosDugaJamJamActive,
          isHujanBrantasActive,
          isDugaAirBrantasActive,
          isDugaAirBengawanSoloActive,
          isBengawanSoloPJT1Active,
        });

        // --- MODIFIKASI TAMBAHAN UNTUK UKURAN & IKON PIN ---
        let iconToUse = override?.icon || markerStyle.icon;
        let size = { width: 24, height: 24 }; // Ukuran default

        if (isPosDugaJamJamActive && isPosDugaJamJamStation) {
          // Ganti ikon dan ukuran jika layer 'Pos Duga Air...' aktif
          iconToUse = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${bgColor}" stroke="white" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`;
          size = { width: 20, height: 24 }; // Lebih kecil
        }

        const borderColor = override?.color || markerStyle.color;
        const overrideBg = override?.color || bgColor;
        let borderRadiusVal = '50%';
        let extraTransform = '';
        if (override?.shape === 'rounded-square') borderRadiusVal = '8px';
        if (override?.shape === 'square') borderRadiusVal = '6px';
        if (override?.shape === 'diamond') { borderRadiusVal = '6px'; extraTransform = ' rotate(45deg)'; }
        if (override?.shape === 'triangle') { borderRadiusVal = '4px'; }
        if (override?.shape === 'pin') { borderRadiusVal = '50% 50% 50% 50%'; }
        if (override?.shape === 'circle-with-square') borderRadiusVal = '50%';

        markerEl.style.cssText = `
          position: absolute;
          width: ${size.width}px; 
          height: ${size.height}px; 
          border-radius: ${borderRadiusVal}; 
          background-color: ${overrideBg}; 
          border: 2px solid ${borderColor}; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3); 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          z-index: 1;
          transform: translate(-50%, -50%)${extraTransform};
        `;

        markerEl.innerHTML = iconToUse;

        if (station.status === "alert") {
          const pulseEl = document.createElement("div");
          pulseEl.style.cssText = `
            position: absolute; 
            width: 100%; 
            height: 100%; 
            border-radius: 50%; 
            background-color: ${bgColor}; 
            opacity: 0.7; 
            animation: alert-pulse 2s infinite; 
            z-index: -1;
            transform: translate(0, 0);
          `;
          markerEl.appendChild(pulseEl);
        }

        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'center',
          offset: [0, 0],
        }).setLngLat(coordinates).addTo(map.current);

        markersRef.current.push(marker);

        markerEl.addEventListener("click", (e) => {
          e.stopPropagation();
          if (autoSwitchActive) setAutoSwitchActive(false);
          handleMarkerClick(station, coordinates);
        });
      } catch (error) { console.error("Error creating marker:", error); }
    });
  }, [tickerData, devices, activeLayers]);

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
      fetch('/src/data/TestMAP.json')
        .then(res => res.ok ? res.json() : Promise.reject('Sungai JSON not found (404)'))
        .then(data => setRiversGeojson(data))
        .catch(e => { console.error('❌ Gagal muat GeoJSON Sungai Jawa Timur:', e); setActiveLayers(prev => ({ ...prev, rivers: false })); });
    }
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
      fetch('/src/data/72_peta_4_peta_Wilayah_Sungai.json')
        .then(res => res.ok ? res.json() : Promise.reject('JSON not found (404)'))
        .then(data => {
          data.features.forEach((f, i) => {
            if (!f.properties.id) f.properties.id = f.properties.name?.toLowerCase().replace(/\s+/g, '-') || `region-${i}`;
          });
          setAdministrativeGeojson(data);
        })
        .catch(e => { console.error('❌ Gagal JSON Batas Administrasi:', e); setActiveLayers(prev => ({ ...prev, administrative: false })); });
    }
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
        if (isFinite(bbox[0][0]) && isFinite(bbox[1][0])) {
          map.current.fitBounds(bbox, { padding: 60, maxZoom: 12, duration: 800 });
        }
      }
    };
    map.current.on('click', administrativeLayerId, handleClick);
    return () => { if (map.current) map.current.off('click', administrativeLayerId, handleClick); };
  }, [mapLoaded, activeLayers.administrative]);

  const handleSearch = (query, coords) => { console.log("Pencarian berhasil:", query, coords); };

  const showFilter = showFilterSidebar && !activeLayers['legenda-peta'];

  return (
    <div className="w-full h-screen overflow-hidden relative z-0">
      <div ref={mapContainer} className="w-full h-full relative z-0" />
      {mapLoaded && map.current ? (
        <GoogleMapsSearchbar
          mapboxMap={map.current}
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
      {showFilter && (
        <Suspense fallback={null}>
          <FilterPanel
            isOpen={showFilter}
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
      )}
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