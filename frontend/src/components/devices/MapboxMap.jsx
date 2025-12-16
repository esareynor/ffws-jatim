// src/components/devices/MapboxMap.jsx
import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchDevices } from "../../services/devices";
import { fetchDeviceGeoJSON } from "/src/services/MapGeo"; 
import GoogleMapsSearchbar from "../common/GoogleMapsSearchbar";                                                                                                            
import {
  REGION_ID_TO_DEVICE_ID,
  DEVICE_ID_TO_COLOR,
  getBBox,
  pointInGeoJSON,
  getStatusColor,
  getMarkerStyle,
  getButtonStyleOverride,
  getUptIdFromStationName,
  extractKeywords,
} from "./mapUtils";

const MapTooltip = lazy(() => import("./maptooltip"));
const FilterPanel = lazy(() => import("/src/components/common/FilterPanel.jsx"));
const StationDetail = lazy(() => import("../StationDetail.jsx"));
const CoordinateDebugger = lazy(() => import("./CoordinateDebugger.jsx"));

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGl0b2ZhdGFoaWxsYWgxIiwiYSI6ImNtZjNveGloczAwNncya3E1YzdjcTRtM3MifQ.kIf5rscGYOzvvBcZJ41u8g";

const BASE_SIZE = 32; // ukuran tetap elemen root marker

const MapboxMap = ({ tickerData, onStationSelect }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [devices, setDevices] = useState([]);

  const [selectedStation, setSelectedStation] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    station: null,
    coordinates: null,
  });

  const [zoomLevel, setZoomLevel] = useState(8);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [autoSwitchActive, setAutoSwitchActive] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [selectedStationCoords, setSelectedStationCoords] = useState(null);

  // State untuk active layers — termasuk wilayah legenda dan UPT
  const [activeLayers, setActiveLayers] = useState({
    rivers: false,
    "flood-risk": false,
    rainfall: false,
    administrative: false,
    // Tambahkan ID khusus untuk tombol "Pos Hujan WS Bengawan Solo PJT 1"
    'pos-hujan-ws-bengawan-solo': false,
    // Tambahkan ID khusus untuk tombol "Pos Duga Air WS Bengawan Solo PJT 1"
    'pos-duga-air-ws-bengawan-solo': false,
    // Tambahkan ID khusus untuk tombol "Pos Duga Air WS Brantas PJT 1"
    'pos-duga-air-ws-brantas-pjt1': false, //ID ini yang digunakan oleh FilterPanel
    // Pos Hujan khusus: Hujan Jam-Jam an PU SDA
    'Hujan Jam-Jam an PU SDA': false,
    // UPT Toggle akan dinamis
  });

  const [regionLayers, setRegionLayers] = useState({});
  const [administrativeGeojson, setAdministrativeGeojson] = useState(null);
  const administrativeSourceId = "administrative-boundaries";
  const administrativeLayerId = "administrative-fill";

  const [riversGeojson, setRiversGeojson] = useState(null);
  const riversSourceId = "rivers-jatim-source";
  const riversLayerId = "rivers-jatim-layer";
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [showZoomDebug, setShowZoomDebug] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false);
  const zoomEventCounter = useRef(0);
  const [markerDebugInfo, setMarkerDebugInfo] = useState([]);

  // Helper function untuk getStatusIcon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'safe':
        return '<svg width="16" height="16" viewBox="0 0 16 16" fill="white"><circle cx="8" cy="8" r="6"/></svg>';
      case 'warning':
        return '<svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M8 2L2 14h12L8 2zm0 3l4 7H4l4-7z"/></svg>';
      case 'alert':
        return '<svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M8 1L1 15h14L8 1zm0 3l4 8H4l4-8z"/></svg>';
      default:
        return '<svg width="16" height="16" viewBox="0 0 16 16" fill="white"><circle cx="8" cy="8" r="4"/></svg>';
    }
  };

  // Helper utilities are imported from mapUtils.js

  // Load devices
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);
        // ringkas: logging validasi
        const stats = {
          total: devicesData.length,
          withCoords: devicesData.filter((d) => d.latitude && d.longitude).length,
          missing: devicesData.filter((d) => !d.latitude || !d.longitude).length,
          invalid: devicesData.filter((d) => {
            if (!d.latitude || !d.longitude) return false;
            const lat = parseFloat(d.latitude);
            const lng = parseFloat(d.longitude);
            return lat < -9 || lat > -6 || lng < 110 || lng > 115;
          }).length,
        };
        console.log("Devices Coordinate Statistics:", stats);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };
    loadDevices();
  }, []);

  // getStatusColor imported from mapUtils.js

  // Fungsi baru: Tentukan jenis stasiun dan gaya marker-nya
  // getMarkerStyle imported from mapUtils.js

  // Per-button style overrides: kembalikan warna/icon khusus ketika tombol tertentu aktif
  // getButtonStyleOverride imported from mapUtils.js

  // NOTE: getUptIdFromStationName imported from mapUtils.js

  // Ukuran marker berbasis zoom (ukuran target visual)
  const getMarkerSize = (z) => {
    if (z < 8) return 18;
    if (z < 10) return 24;
    if (z < 12) return 28;
    return 32;
  };

  // Validasi koordinat
  const validateCoordinates = (lng, lat) => {
    const issues = [];
    if (lat < -9 || lat > -6) issues.push(`Latitude ${lat.toFixed(4)} out of East Java range`);
    if (lng < 110 || lng > 115) issues.push(`Longitude ${lng.toFixed(4)} out of East Java range`);
    if (lng < 0 && lat > 100) issues.push("⚠️ lat/lng swap suspected");
    if (lng === 0 || lat === 0) issues.push("Zero coordinate");
    return {
      isValid: issues.length === 0,
      issues,
      severity: issues.some((i) => i.includes("swap"))
        ? "critical"
        : issues.length > 1
        ? "high"
        : issues.length === 1
        ? "medium"
        : "none",
    };
  };

  const getStationCoordinates = (stationName) => {
    if (!devices?.length) return null;
    const device = devices.find(d => d.name === stationName);
    if (!device) {
      console.warn(`⚠️ Stasiun "${stationName}" tidak ditemukan di devices.`);
      return null;
    }
    if (!device.latitude || !device.longitude) {
      console.warn(`⚠️ Stasiun "${stationName}" tidak memiliki koordinat yang valid.`);
      return null;
    }
    return [parseFloat(device.longitude), parseFloat(device.latitude)];
  };

  const handleMarkerClick = (station, coordinates) => {
    setSelectedStation(station);
    setSelectedStationCoords(coordinates);
    if (map.current) map.current.flyTo({ center: coordinates, zoom: 14 });
    setTooltip({ visible: true, station, coordinates });
  };

  const handleShowDetail = (station) => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    if (onStationSelect) onStationSelect(station);
  };

  const handleCloseTooltip = () => setTooltip((prev) => ({ ...prev, visible: false }));

  const handleStationChange = (station, index) => {
    if (station?.latitude && station.longitude) {
      const coords = [parseFloat(station.longitude), parseFloat(station.latitude)];
      setCurrentStationIndex(index);
      setSelectedStation(station);
      if (map.current) map.current.flyTo({ center: coords, zoom: 14 });
      setTooltip({ visible: true, station, coordinates: coords });
    }
  };            

  const handleAutoSwitchToggle = (isActive) => setAutoSwitchActive(isActive);

  // Toggle region layers
  const handleRegionLayerToggle = async (regionId, isActive) => {
    if (!map.current || !mapLoaded) return;

    const deviceId = REGION_ID_TO_DEVICE_ID[regionId];
    if (deviceId === undefined) {
      console.warn(`Tidak ada deviceId untuk region: ${regionId}`);
      return;
    }

    const sourceId = `region-${regionId}`;
    const layerId = `region-${regionId}-fill`;

    if (isActive) {
      try {
        console.log(`Memuat GeoJSON dari API untuk ID ${deviceId}...`);
        const geojson = await fetchDeviceGeoJSON(deviceId);
        console.log(`GeoJSON untuk ID ${deviceId} diterima`, geojson);

        // Validasi geojson: harus berisi fitur
        if (!geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) {
          console.error(`GeoJSON kosong atau tidak valid untuk device ID ${deviceId}`);
          setActiveLayers(prev => ({ ...prev, [regionId]: false }));
          return;
        }

        // Hapus dulu jika sudah ada
        if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
        if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);

        // Tambahkan source baru
        map.current.addSource(sourceId, { type: 'geojson', data: geojson });

        // Tambahkan layer baru
        map.current.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': DEVICE_ID_TO_COLOR[deviceId] || '#6B7280',
            'fill-opacity': 0.5,
            'fill-outline-color': '#4B5563'
          }
        });

        // Click handler: fit bounds to clicked feature
        const clickHandler = (e) => {
          try {
            const features = e.features || [];
            if (features.length === 0) return;
            const geom = features[0].geometry;
            const bbox = getBBox(geom);
            if (isFinite(bbox[0][0]) && isFinite(bbox[1][0]) && bbox[0][0] !== Infinity) {
              map.current.fitBounds(bbox, { padding: 60, maxZoom: 12, duration: 800 });
            }
          } catch (err) {
            console.error('Error on region click handler:', err);
          }
        };

        const mouseEnterHandler = () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; };
        const mouseLeaveHandler = () => { if (map.current) map.current.getCanvas().style.cursor = ''; };

        // Register handlers
        map.current.on('click', layerId, clickHandler);
        map.current.on('mouseenter', layerId, mouseEnterHandler);
        map.current.on('mouseleave', layerId, mouseLeaveHandler);

        setRegionLayers(prev => ({
          ...prev,
          [regionId]: { sourceId, layerId, deviceId, geojson, clickHandler, mouseEnterHandler, mouseLeaveHandler }
        }));

      } catch (e) {
        console.error(`Gagal muat GeoJSON dari API untuk device ID ${deviceId}:`, e);
        //  Set state aktif menjadi false agar tombol toggle kembali ke posisi off
        setActiveLayers(prev => ({ ...prev, [regionId]: false }));
        // Jangan biarkan layer tetap aktif jika gagal
      }
    } else {
      // Hapus layer & source
      // Remove event handlers if any
      const existing = regionLayers[regionId];
      if (existing) {
        try {
          if (existing.clickHandler) map.current.off('click', layerId, existing.clickHandler);
          if (existing.mouseEnterHandler) map.current.off('mouseenter', layerId, existing.mouseEnterHandler);
          if (existing.mouseLeaveHandler) map.current.off('mouseleave', layerId, existing.mouseLeaveHandler);
        } catch (err) {
          console.warn('Error removing handlers for', layerId, err);
        }
      }

      if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
      if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);
      setRegionLayers((prev) => {
        const n = { ...prev };
        delete n[regionId];
        return n;
      });
    }
  };

  const handleLayerToggle = (layerId) => {
    if (layerId.startsWith("ws-") || layerId === "test-map-debit-100") {
      setActiveLayers((prev) => {
        const newState = { ...prev, [layerId]: !prev[layerId] };
        console.log("New activeLayers state:", newState);

        // Aktifkan/mematikan layer wilayah dari API
        handleRegionLayerToggle(layerId, newState[layerId]);
        return newState;
      });
    } else {
      // Untuk layer biasa (rivers, flood-risk, dll) atau UPT
      setActiveLayers(prev => {
        const newState = { ...prev, [layerId]: !prev[layerId] };
        console.log("New activeLayers state:", newState);
        return newState;
      });
    }
  };

  // Init map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [112.5, -7.5],
        zoom: 8,
      });

      if (typeof window !== "undefined") {
        window.mapboxMap = map.current;
      }

      map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");

      //  Saat zoom berlangsung: hanya scale child marker
      map.current.on("zoom", () => {
        if (!map.current) return;
        const z = map.current.getZoom();
        updateMarkerSizes(z);
        if (showZoomDebug) zoomEventCounter.current += 1;
      });

      //  Setelah zoom selesai: update angka di UI
      map.current.on("zoomend", () => {
        if (!map.current) return;
        setZoomLevel(map.current.getZoom());
      });

      map.current.on("load", () => setMapLoaded(true));
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [showZoomDebug]);

  // Auto-load layer welang_debit_100 saat map selesai dimuat
  useEffect(() => {
    if (mapLoaded && activeLayers["test-map-debit-100"]) {
      handleRegionLayerToggle("test-map-debit-100", true);
    }
  }, [mapLoaded]);

  // Perbaikan: Gunakan useEffect untuk memperbarui marker hanya saat tickerData, devices, atau activeLayers berubah
  useEffect(() => {
    if (!map.current || !tickerData || !devices.length) return;

    console.log("tickerData length:", tickerData.length);
    console.log("devices length:", devices.length);
    console.log("Active Layers:", activeLayers);

    // Hapus semua marker lama
    markersRef.current.forEach(marker => marker?.remove?.());
    markersRef.current = [];

    // Daftar AWLR untuk WS Brantas PJT 1
    const awlrBrantasList = [
    "AWLR Gubeng",
    "AWLR Gunungsari",
    "AWLR Jagir",
    "AWLR Lohor",
    "AWLR Lodoyo",
    "AWLR Menturus",
    "AWLR Milirip",
    "AWLR Mojokerto",
    "AWLR Mrican",
    "AWLR New Lengkong",
    "AWLR Neyama 1",
    "AWLR Pintu Bendo",
    "AWLR Pintu Wonokromo",
    "AWLR Pompa Tulungagung",
    "AWLR Segawe",
    "AWLR Selorejo",
    "AWLR Sengguruh",
    "AWLR Sutami",
    "AWLR Tiudan",
    "AWLR Wlingi",
    "AWLR Wonokromo",
    "AWLR Wonorejo",
  ];

  // ✅ Daftar AWLR untuk WS Bengawan Solo PJT 1
  const awlrBengawanSoloList = [
    "AWLR Bendungan Jati",
    "AWLR BG Babat",
    "AWLR BG Bojonegoro",
  ];

  // ✅ Daftar ARR (Pos Hujan) untuk WS Brantas PJT 1
  const arrBrantasList = [
    "ARR Wagir",
    "ARR Tangkil",
    "ARR Poncokusumo",
    "ARR Dampit",
    "ARR Sengguruh",
    "ARR Sutami",
    "ARR Tunggorono",
    "ARR Doko",
    "ARR Birowo",
    "ARR Wates Wlingi",
    "Semen ARR",
    "ARR Sumberagung",
    "Bendungan ARR Wlingi",
    "ARR Tugu",
    "ARR Kampak",
    "ARR Bendo",
    "ARR Pagerwojo",
    "ARR Kediri",
    "ARR Tampung",
    "ARR Gunung Sari",
    "ARR Metro",
    "ARR Gemarang",
    "ARR Bendungan",
    "ARR Tawangsari",
    "ARR Sadar",
    "ARR Bogel",
    "ARR Karangpilang",
    "ARR Kedurus",
    "ARR Wonorejo-1",
    "ARR Wonorejo-2",
    "ARR Rejotangan",
    "ARR Kali Biru",
    "ARR Neyama",
    "ARR Selorejo",
  ];

  // extractKeywords imported from mapUtils.js

  const brantasKeywords = extractKeywords(awlrBrantasList);
  const bengawanKeywords = extractKeywords(awlrBengawanSoloList);
  const arrBrantasKeywords = extractKeywords(arrBrantasList);

  console.log("Brantas Keywords:", brantasKeywords);
  console.log("Bengawan Keywords:", bengawanKeywords);
  console.log("ARR Brantas Keywords:", arrBrantasKeywords);

  tickerData.forEach(station => {
    console.log(`Checking station: "${station.name}"`);
    const coordinates = getStationCoordinates(station.name);
    if (!coordinates) {
      console.log(`Marker tidak dibuat untuk "${station.name}" - koordinat tidak valid.`);
      return;
    }

    // Cek apakah UPT stasiun ini aktif
    const stationUptId = getUptIdFromStationName(station.name);

    // LOGIKA BARU: Jika tombol "Pos Hujan WS Bengawan Solo PJT 1" aktif, tampilkan semua stasiun yang namanya dimulai dengan "BS"
    const isBengawanSoloPJT1Active = activeLayers['pos-hujan-ws-bengawan-solo'];
    const isBSStation = station.name.startsWith('BS');

    // LOGIKA BARU: Jika tombol "Hujan Jam-Jam an PU SDA" aktif, tampilkan semua device ARR / Pos Hujan
    const isHujanJamJamActive = !!activeLayers['Hujan Jam-Jam an PU SDA'];
    // Trim name once and prepare quoted checks
    const nameTrim = station.name ? station.name.trim() : '';
    // Show only devices whose name starts and ends with double quotes ("...")
    const isDoubleQuotedName = /^".*"$/.test(nameTrim);
    const isHujanJamJamStation = isDoubleQuotedName;

    // NEW: Pos Duga Air Jam-Jam an PU SDA — show devices with single quotes at start and end (e.g., '\'Name\'')
    // This supports both an explicit activeLayers key named exactly 'Pos Duga Air Jam-Jam an PU SDA'
    // or any active layer key that includes 'pos-duga' (case-insensitive)
    const isPosDugaJamJamActive = (!!activeLayers['Pos Duga Air Jam-Jam an PU SDA']) ||
      Object.keys(activeLayers).some(k => k.toLowerCase().includes('pos-duga') && activeLayers[k]);
    const isSingleQuotedName = /^'.*'$/.test(nameTrim);

    // LOGIKA BARU: Jika tombol "Pos Hujan WS Brantas PJT 1" aktif, tampilkan ARR di daftar brantas
    const isHujanBrantasActive = activeLayers['pos-hujan-ws-brantas-pjt1'];
    const isARRBrantasStation = arrBrantasKeywords.some(keyword =>
      station.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // LOGIKA BARU: Jika tombol "Pos Duga Air WS Bengawan Solo PJT 1" aktif, tampilkan AWLR di daftar bengawan solo
    const isDugaAirBengawanSoloActive = activeLayers['pos-duga-air-ws-bengawan-solo'];
    const isAWLRBengawanSoloStation = bengawanKeywords.some(keyword =>
      station.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // LOGIKA BARU: Jika tombol "Pos Duga Air WS Brantas PJT 1" aktif, tampilkan AWLR di daftar brantas
    const isDugaAirBrantasActive = activeLayers['pos-duga-air-ws-brantas-pjt1'];
    const isAWLRBrantasStation = brantasKeywords.some(keyword =>
      station.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // LOGIKA BARU: Cek apakah ada tombol UPT aktif
    const isAnyUptActive = Object.keys(activeLayers).some(key => 
      key.startsWith('upt-') && activeLayers[key]
    );

    // LOGIKA PENAMPILAN MARKER — HANYA SATU KONDISI YANG BOLEH AKTIF
    let shouldShowMarker = false;

    // If any WS region toggles are active, do NOT show markers at all (markers are hidden when region layers active)
    const activeRegionIds = Object.keys(activeLayers).filter(k => k.startsWith('ws-') && activeLayers[k]);
    if (activeRegionIds.length > 0) {
      console.log(`Region layers active (${activeRegionIds.join(',')}) — skipping marker rendering`);
      return; // skip marker creation entirely while region layers are active
    }

    // 1. Jika ada tombol UPT aktif → tampilkan hanya UPT yang sesuai
    if (isAnyUptActive && stationUptId && activeLayers[stationUptId]) {
      shouldShowMarker = true;
    }
    // Jika tombol Hujan Jam-Jam an PU SDA aktif → tampilkan semua station ARR / POS
    else if (isHujanJamJamActive && isHujanJamJamStation) {
      shouldShowMarker = true;
    }
    // Jika tombol Pos Duga Air Jam-Jam an PU SDA aktif → tampilkan hanya device yang namanya diawali dan diakhiri dengan tanda petik tunggal (')
    else if (isPosDugaJamJamActive && isSingleQuotedName) {
      shouldShowMarker = true;
    }
    // 2. Jika tombol Pos Hujan WS Brantas PJT 1 aktif → tampilkan hanya ARR Brantas
    else if (isHujanBrantasActive && isARRBrantasStation) {
      shouldShowMarker = true;
    }
    // 3. Jika tombol Pos Duga Air WS Brantas PJT 1 aktif → tampilkan hanya AWLR Brantas
    else if (isDugaAirBrantasActive && isAWLRBrantasStation) {
      shouldShowMarker = true;
    }
    // 4. Jika tombol Pos Duga Air WS Bengawan Solo PJT 1 aktif → tampilkan hanya AWLR Bengawan Solo
    else if (isDugaAirBengawanSoloActive && isAWLRBengawanSoloStation) {
      shouldShowMarker = true;
    }
    // 5. Jika tombol Pos Hujan WS Bengawan Solo PJT 1 aktif → tampilkan hanya stasiun BS
    else if (isBengawanSoloPJT1Active && isBSStation) {
      shouldShowMarker = true;
    }

    console.log(`Is Hujan Brantas Active? ${isHujanBrantasActive}`);
    console.log(`Is ARR Brantas Station? ${isARRBrantasStation}`);
    console.log(`Should Show Marker? ${shouldShowMarker}`);

    if (!shouldShowMarker) {
      console.log(`⏸️ Marker diabaikan untuk "${station.name}" - tidak memenuhi kondisi tampil.`);
      return; // Skip jika tidak memenuhi syarat
    }

    try {
      const markerEl = document.createElement("div");
      markerEl.className = "custom-marker";
      // Ambil gaya marker berdasarkan jenis stasiun
      const markerStyle = getMarkerStyle(station.name);
      const bgColor = getStatusColor(station.status); // Warna status (untuk background)
      // Apply per-button override if present
      const override = getButtonStyleOverride({
        isHujanJamJamActive,
        isPosDugaJamJamActive,
        isHujanBrantasActive,
        isDugaAirBrantasActive: isDugaAirBrantasActive,
        isDugaAirBengawanSoloActive: isDugaAirBengawanSoloActive,
        isBengawanSoloPJT1Active: isBengawanSoloPJT1Active,
      });
      const borderColor = override?.color || markerStyle.color; 

      // Apply override visual styles when present
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
        width: 24px; 
        height: 24px; 
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
      
      // Gunakan icon dari override jika ada, otherwise use markerStyle
      markerEl.innerHTML = override?.icon || markerStyle.icon;

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

      // Marker dengan anchor dan offset tetap agar tidak bergerak saat zoom
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'center', 
        offset: [0, 0],   //Jangan geser
      }).setLngLat(coordinates).addTo(map.current);

      markersRef.current.push(marker);

      markerEl.addEventListener("click", (e) => {
        e.stopPropagation();
        if (autoSwitchActive) setAutoSwitchActive(false);
        handleMarkerClick(station, coordinates);
      });
    } catch (error) {
      console.error("Error creating marker:", error);
    }
  });
  }, [tickerData, devices, activeLayers]); // ✅ Tambahkan activeLayers ke dependency

  // Ubah ukuran marker saat zoom → scale child ".marker-inner"
  const updateMarkerSizes = (newZoom) => {
    const target = getMarkerSize(newZoom);
    const scale = Math.max(0.01, target / BASE_SIZE);
    markersRef.current.forEach((marker) => {
      const el = marker.getElement();
      if (!el) return;
      const inner = el.querySelector(".marker-inner");
      if (!inner) return;
      inner.style.transform = `scale(${scale})`;
    });
  };

  // Klik luar popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltip.visible &&
        !event.target.closest(".custom-marker") &&
        !event.target.closest(".mapboxgl-popup-content") &&
        !event.target.closest(".map-tooltip")
      ) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [tooltip.visible]);

  // Rivers layer
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
        map.current.addSource(riversSourceId, { type: "geojson", data: riversGeojson });
      }
      if (!map.current.getLayer(riversLayerId)) {
        map.current.addLayer({
          id: riversLayerId,
          type: "line",
          source: riversSourceId,
          paint: { "line-color": "#0000FF", "line-width": 2.5, "line-opacity": 0.8 },
        });
      }
    } else {
      fetch("/src/data/TestMAP.json")
        .then((res) => (res.ok ? res.json() : Promise.reject("Sungai JSON not found (404)")))
        .then((data) => {
          console.log("✅ Sungai Jawa Timur JSON dimuat");
          setRiversGeojson(data);
        })
        .catch((e) => {
          console.error("❌ Gagal muat GeoJSON Sungai Jawa Timur:", e);
          setActiveLayers((prev) => ({ ...prev, rivers: false }));
        });
    }

    return () => {
      if (map.current?.getLayer(riversLayerId)) map.current.removeLayer(riversLayerId);
      if (map.current?.getSource(riversSourceId)) map.current.removeSource(riversSourceId);
    };
  }, [mapLoaded, activeLayers.rivers, riversGeojson]);

  // Administrative layer
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const isLayerActive = activeLayers.administrative;

    if (!isLayerActive) {
      ["administrative-fill", "administrative-highlight", "administrative-fill-highlight"].forEach((id) => {
        if (map.current.getLayer(id)) map.current.removeLayer(id);
      });
      if (map.current.getSource(administrativeSourceId)) map.current.removeSource(administrativeSourceId);
      return;
    }

    if (administrativeGeojson) {
      if (!map.current.getSource(administrativeSourceId)) {
        map.current.addSource(administrativeSourceId, { type: "geojson", data: administrativeGeojson });
      }
      if (!map.current.getLayer(administrativeLayerId)) {
        map.current.addLayer({
          id: administrativeLayerId,
          type: "fill",
          source: administrativeSourceId,
          paint: {
            "fill-color": ["coalesce", ["get", "fill_color"], "#6B7280"],
            "fill-opacity": 0.5,
            "fill-outline-color": "#4B5563",
          },
        });
      }
      if (!map.current.getLayer("administrative-highlight")) {
        map.current.addLayer({
          id: "administrative-highlight",
          type: "line",
          source: administrativeSourceId,
          paint: { "line-color": "#000", "line-width": 4, "line-opacity": 0.8 },
          filter: ["==", ["get", "id"], ""],
        });
      }
      if (!map.current.getLayer("administrative-fill-highlight")) {
        map.current.addLayer({
          id: "administrative-fill-highlight",
          type: "fill",
          source: administrativeSourceId,
          paint: { "fill-color": "#6ee7b7", "fill-opacity": 0.6 },
          filter: ["==", ["get", "id"], ""],
        });
      }
    } else {
      fetch("/src/data/72_peta_4_peta_Wilayah_Sungai.json")
        .then((res) => (res.ok ? res.json() : Promise.reject("JSON not found (404)")))
        .then((data) => {
          data.features.forEach((f, i) => {
            if (!f.properties.id)
              f.properties.id = f.properties.name?.toLowerCase().replace(/\s+/g, "-") || `region-${i}`;
          });
          setAdministrativeGeojson(data);
        })
        .catch((e) => {
          console.error("❌ Gagal JSON Batas Administrasi:", e);
          setActiveLayers((prev) => ({ ...prev, administrative: false }));
        });
    }

    return () => {
      ["administrative-fill", "administrative-highlight", "administrative-fill-highlight"].forEach((id) => {
        if (map.current?.getLayer(id)) map.current.removeLayer(id);
      });
      if (map.current?.getSource(administrativeSourceId)) map.current.removeSource(administrativeSourceId);
    };
  }, [mapLoaded, activeLayers.administrative, administrativeGeojson]);

  // Hover/click administrative highlight
  useEffect(() => {
    if (!map.current || !mapLoaded || !activeLayers.administrative) return;

    const handleMouseMove = (e) => {
      const features = map.current.queryRenderedFeatures(e.point, { layers: [administrativeLayerId] });
      if (features.length > 0) {
        const f = features[0],
          id = f.properties.id;
        setHoveredFeature(f);
        map.current.setFilter("administrative-highlight", ["==", ["get", "id"], id]);
        map.current.setFilter("administrative-fill-highlight", ["==", ["get", "id"], id]);
      } else {
        setHoveredFeature(null);
        map.current.setFilter("administrative-highlight", ["==", ["get", "id"], ""]);
        map.current.setFilter("administrative-fill-highlight", ["==", ["get", "id"], ""]);
      }
    };
    const handleMouseLeave = () => {
      setHoveredFeature(null);
      map.current.setFilter("administrative-highlight", ["==", ["get", "id"], ""]);
      map.current.setFilter("administrative-fill-highlight", ["==", ["get", "id"], ""]);
    };

    map.current.on("mousemove", handleMouseMove);
    map.current.on("mouseleave", handleMouseLeave);

    return () => {
      map.current?.off("mousemove", handleMouseMove);
      map.current?.off("mouseleave", handleMouseLeave);
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
    map.current.on("click", administrativeLayerId, handleClick);
    return () => {
      map.current?.off("click", administrativeLayerId, handleClick);
    };
  }, [mapLoaded, activeLayers.administrative]);

  const handleSearch = (query, coords) => {
    console.log("Pencarian berhasil:", query, coords);
  };

  const showFilter = showFilterSidebar && !activeLayers["legenda-peta"];

  return (
    <div className="w-full h-screen overflow-hidden relative z-0">
      <div ref={mapContainer} className="w-full h-full relative z-0" />

      {/* Searchbar */}
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

      {/* ✅ Filter Panel */}
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

      {/* StationDetail is rendered by the top-level Layout to avoid duplicate sidebars */}

      {/* Tombol Filter & Debug */}
      <div className="absolute top-4 right-4 z-[80] flex gap-2">
        {/* Tombol Zoom Debug */}
        <button
          onClick={() => setShowZoomDebug(!showZoomDebug)}
          className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors shadow-md ${
            showZoomDebug ? "bg-green-500 text-white" : "bg-white hover:bg-green-50 text-green-600"
          }`}
          title="Toggle Zoom Debug Mode"
          aria-label="Zoom Debug"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10 w-6 h-6"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>

        {/* Tombol Debug Koordinat */}
        <button
          onClick={() => setShowDebugger(true)}
          className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-purple-50 transition-colors shadow-md"
          title="Debug Koordinat Station"
          aria-label="Debug Koordinat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10 w-6 h-6 text-purple-600"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>

        {/* Tombol Filter */}
        <button
          onClick={() => setShowFilterSidebar(true)}
          className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-blue-50 transition-colors shadow-md"
          title="Buka Filter"
          aria-label="Buka Filter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10 w-6 h-6 text-blue-600"
          >
            <path d="M22 3H2l8 9v7l4 2v-9l8-9z"></path>
          </svg>
        </button>
      </div>

      {/* Zoom Level Indicator */}
      {showZoomDebug && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[80] bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <div className="text-sm font-mono">
              <span className="text-gray-300">Zoom:</span>{" "}
              <span className="text-green-400 font-bold">{zoomLevel.toFixed(2)}</span>
            </div>
            <div className="h-4 w-px bg-gray-600"></div>
            <div className="text-sm font-mono">
              <span className="text-gray-300">Markers:</span>{" "}
              <span className="text-blue-400 font-bold">{markersRef.current.length}</span>
            </div>
            <div className="h-4 w-px bg-gray-600"></div>
            <div className="text-sm font-mono">
              <span className="text-gray-300">Invalid:</span>{" "}
              <span className="text-red-400 font-bold">
                {markerDebugInfo.filter((m) => !m.validation.isValid).length}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-600"></div>
            <div className="text-sm font-mono">
              <span className="text-gray-300">Zoom Events:</span>{" "}
              <span className="text-yellow-400 font-bold">{zoomEventCounter.current}</span>
            </div>
          </div>
        </div>
      )}

      {/* Marker Size Guide */}
      {showZoomDebug && (
        <div className="absolute bottom-20 right-4 z-[80] bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="text-sm font-bold text-gray-800 mb-2">🎯 Zoom Guide</h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center justify-between">
              <span>Zoom {"<"} 8:</span>
              <span className="font-mono text-blue-600">18px (Small)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Zoom 8-10:</span>
              <span className="font-mono text-blue-600">24px (Medium)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Zoom 10-12:</span>
              <span className="font-mono text-blue-600">28px (Large)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Zoom {">"} 12:</span>
              <span className="font-mono text-blue-600">32px (XL)</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-700 font-semibold mb-1">Border Colors:</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full border-2 border-white bg-gray-400"></div>
              <span>Valid</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full border-2 border-yellow-400 bg-gray-400"></div>
              <span>Medium Issue</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full border-2 border-orange-500 bg-gray-400"></div>
              <span>High Issue</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-gray-400"></div>
              <span>Critical (Swapped)</span>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={null}>
        <CoordinateDebugger
          tickerData={tickerData}
          devices={devices}
          isVisible={showDebugger}
          onClose={() => setShowDebugger(false)}
        />
      </Suspense>
    </div>
  );
};

export default MapboxMap;
