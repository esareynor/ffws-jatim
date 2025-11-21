// src/components/devices/MapboxMap.jsx

import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchDevices } from "../../services/devices";
import { fetchDeviceGeoJSON } from "/src/services/MapGeo"; // ✅ Import fungsi
import GoogleMapsSearchbar from "../common/GoogleMapsSearchbar";

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

  // ✅ State untuk active layers — termasuk wilayah legenda dan UPT
  const [activeLayers, setActiveLayers] = useState({
    rivers: false,
    'flood-risk': false,
    rainfall: false,
    administrative: false,
    // Tambahkan ID khusus untuk tombol "Pos Hujan WS Bengawan Solo PJT 1"
    'pos-hujan-ws-bengawan-solo': false,
    // Tambahkan ID khusus untuk tombol "Pos Duga Air WS Bengawan Solo PJT 1"
    'pos-duga-air-ws-bengawan-solo': false,
    // Tambahkan ID khusus untuk tombol "Pos Duga Air WS Brantas PJT 1"
    'pos-duga-air-ws-brantas-pjt1': false, // 👈 ID ini yang digunakan oleh FilterPanel
    // Pos Hujan khusus: Hujan Jam-Jam an PU SDA
    'Hujan Jam-Jam an PU SDA': false,
    // UPT Toggle akan dinamis
  });

  // ✅ State untuk menyimpan reference source & layer per wilayah
  const [regionLayers, setRegionLayers] = useState({});

  const [administrativeGeojson, setAdministrativeGeojson] = useState(null);
  const administrativeSourceId = 'administrative-boundaries';
  const administrativeLayerId = 'administrative-fill';

  const [riversGeojson, setRiversGeojson] = useState(null);
  const riversSourceId = 'rivers-jatim-source';
  const riversLayerId = 'rivers-jatim-layer';
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // ✅ Mapping regionId ke deviceId
  const REGION_ID_TO_DEVICE_ID = {
    'ws-baru-bajul-mati': 9,  // WSBaruBajulMati.geojson
    'ws-bengawan-solo': 8,   // WSBengawanSolo.geojson
    'ws-bondoyudo-bedadung': 5, // WSBondoyudoBedadung.geojson
    'ws-brantas': 10,        // WSBrantas (1).geojson
    'ws-pekalen-sampean': 7, // WSPekalenSampean.geojson
    'ws-welang-rejoso': 6,   // WSWelangRejoso.geojson
    'ws-madura-bawean': 11,  // WSMaduraBawean (1).geojson
  };

  const DEVICE_ID_TO_COLOR = {
    9: '#8A2BE2',
    8: '#FF7F50',
    5: '#00CED1',
    10: '#FF4500',
    7: '#FF69B4',
    6: '#FF00FF',
    11: '#FFD700',
  };

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

  // Helper: point-in-polygon (ray-casting) for Polygon and MultiPolygon
  const pointInRing = (x, y, ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const pointInPolygon = (point, polygon) => {
    // polygon: array of rings (first is outer)
    const x = point[0], y = point[1];
    // check outer ring
    if (!Array.isArray(polygon) || polygon.length === 0) return false;
    if (pointInRing(x, y, polygon[0]) === false) return false;
    // if there are holes, ensure point not in any hole
    for (let i = 1; i < polygon.length; i++) {
      if (pointInRing(x, y, polygon[i])) return false;
    }
    return true;
  };

  const pointInGeoJSON = (geojson, point) => {
    if (!geojson || !geojson.type) return false;
    const coords = point; // [lng, lat]
    if (geojson.type === 'FeatureCollection') {
      return geojson.features.some(f => pointInGeoJSON(f, coords));
    }
    if (geojson.type === 'Feature') {
      return pointInGeoJSON(geojson.geometry, coords);
    }
    if (geojson.type === 'Polygon') {
      return pointInPolygon(coords, geojson.coordinates);
    }
    if (geojson.type === 'MultiPolygon') {
      return geojson.coordinates.some(poly => pointInPolygon(coords, poly));
    }
    return false;
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

  // ✅ Fungsi baru: Tentukan jenis stasiun dan gaya marker-nya
  const getMarkerStyle = (stationName) => {
    // Cek jika nama stasiun mengandung "UPT"
    if (stationName.includes("UPT")) {
      return {
        color: "#1F2937", // Biru tua / abu-abu gelap
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7v10l10 5m0 0v-10M12 12L2 7m10 5v10l10-5M12 12L2 7m10 5v10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        type: "upt",
      };
    }

    // Cek jika nama stasiun mengandung "WS" (Wilayah Sungai)
    if (stationName.includes("WS") || stationName.startsWith("BS")) {
      return {
        color: "#10B981", // Hijau
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2 2-2m2 4l2-2-2-2m2 4l2-2 2 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        type: "ws",
      };
    }

    // Cek jika nama stasiun mengandung "AWLR"
    if (stationName.startsWith("AWLR")) {
      return {
        color: "#F59E0B", // Orange
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2 2-2m2 4l2-2-2-2m2 4l2-2 2 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        type: "awlr",
      };
    }

    // Default: Gunakan warna status
    return {
      color: getStatusColor("default"),
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="white" stroke-width="2"/></svg>`,
      type: "default",
    };
  };

  // ✅ Per-button style overrides: kembalikan warna/icon khusus ketika tombol tertentu aktif
  const getButtonStyleOverride = ({ isHujanJamJamActive, isPosDugaJamJamActive, isHujanBrantasActive, isDugaAirBrantasActive, isDugaAirBengawanSoloActive, isBengawanSoloPJT1Active }) => {
    // Prioritas: Pos Duga Jam-Jam > Hujan Jam-Jam > Hujan Brantas > Duga Air Brantas > Duga Air Bengawan > Bengawan Solo
    if (isPosDugaJamJamActive) {
      return {
        color: '#0369A1', // biru gelap
        shape: 'rounded-square',
        // square-ish icon
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="white" stroke="#0369A1" stroke-width="2"/></svg>`
      };
    }
    if (isHujanJamJamActive) {
      return {
        color: '#1E90FF', // dodger blue
        shape: 'pin',
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-1 2-3 3-3 6 0 3 3 6 3 6s3-3 3-6c0-3-2-4-3-6z" fill="#1E90FF" stroke="white" stroke-width="1"/></svg>`
      };
    }
    if (isHujanBrantasActive) {
      return { color: '#DC2626', shape: 'circle', icon: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="white" stroke="#DC2626" stroke-width="2"/></svg>` };
    }
    if (isDugaAirBrantasActive) {
      return { color: '#F59E0B', shape: 'diamond', icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2 L20 12 L12 22 L4 12 Z" fill="white" stroke="#F59E0B" stroke-width="2"/></svg>` };
    }
    if (isDugaAirBengawanSoloActive) {
      return { color: '#10B981', shape: 'triangle', icon: `<svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2 L19 21 L12 17 L5 21 Z" fill="white" stroke="#10B981" stroke-width="2"/></svg>` };
    }
    if (isBengawanSoloPJT1Active) {
      return { color: '#7C3AED', shape: 'circle-with-square', icon: `<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="white" stroke="#7C3AED" stroke-width="2"/><rect x="8" y="12" width="8" height="8" rx="2" fill="#7C3AED"/></svg>` };
    }
    return null; // no override
  };

  // ✅ Helper: Ambil UPT ID dari nama stasiun — hanya untuk UPT biasa
  const getUptIdFromStationName = (stationName) => {
    if (!stationName) return null;

    // Mapping nama stasiun ke UPT ID — sesuaikan dengan data Anda
    const uptMapping = {
      "UPT PSDA Welang Pekalen Pasuruan": "upt-welang-pekalen",
      "UPT PSDA Madura Pamekasan": "upt-madura",
      "UPT PSDA Bengawan Solo Bojonegoro": "upt-bengawan-solo",
      "UPT PSDA Brantas Kediri": "upt-brantas",
      "UPT PSDA Sampean Setail Bondowoso": "upt-sampean",
      "Dinas PUSDA Jatim": "dinas-pusda",

      // ✅ Tambahkan mapping untuk "Pos Hujan WS Brantas PJT 1"
      "ARR Wagir": "pos-hujan-ws-brantas-pjt1",
      "ARR Tangkil": "pos-hujan-ws-brantas-pjt1",
      "ARR Poncokusumo": "pos-hujan-ws-brantas-pjt1",
      "ARR Dampit": "pos-hujan-ws-brantas-pjt1",
      "ARR Sengguruh": "pos-hujan-ws-brantas-pjt1",
      "ARR Sutami": "pos-hujan-ws-brantas-pjt1",
      "ARR Tunggorono": "pos-hujan-ws-brantas-pjt1",
      "ARR Doko": "pos-hujan-ws-brantas-pjt1",
      "ARR Birowo": "pos-hujan-ws-brantas-pjt1",
      "ARR Wates Wlingi": "pos-hujan-ws-brantas-pjt1",
      "Semen ARR": "pos-hujan-ws-brantas-pjt1",
      "ARR Sumberagung": "pos-hujan-ws-brantas-pjt1",
      "Bendungan ARR Wlingi": "pos-hujan-ws-brantas-pjt1",
      "ARR Tugu": "pos-hujan-ws-brantas-pjt1",
      "ARR Kampak": "pos-hujan-ws-brantas-pjt1",
      "ARR Bendo": "pos-hujan-ws-brantas-pjt1",
      "ARR Pagerwojo": "pos-hujan-ws-brantas-pjt1",
      "ARR Kediri": "pos-hujan-ws-brantas-pjt1",
      "ARR Tampung": "pos-hujan-ws-brantas-pjt1",
      "ARR Gunung Sari": "pos-hujan-ws-brantas-pjt1",
      "ARR Metro": "pos-hujan-ws-brantas-pjt1",
      "ARR Gemarang": "pos-hujan-ws-brantas-pjt1",
      "ARR Bendungan": "pos-hujan-ws-brantas-pjt1",
      "ARR Tawangsari": "pos-hujan-ws-brantas-pjt1",
      "ARR Sadar": "pos-hujan-ws-brantas-pjt1",
      "ARR Bogel": "pos-hujan-ws-brantas-pjt1",
      "ARR Karangpilang": "pos-hujan-ws-brantas-pjt1",
      "ARR Kedurus": "pos-hujan-ws-brantas-pjt1",
      "ARR Wonorejo-1": "pos-hujan-ws-brantas-pjt1",
      "ARR Wonorejo-2": "pos-hujan-ws-brantas-pjt1",
      "ARR Rejotangan": "pos-hujan-ws-brantas-pjt1",
      "ARR Kali Biru": "pos-hujan-ws-brantas-pjt1",
      "ARR Neyama": "pos-hujan-ws-brantas-pjt1",
      "ARR Selorejo": "pos-hujan-ws-brantas-pjt1",
    };

    for (const [name, id] of Object.entries(uptMapping)) {
      if (stationName.includes(name)) {
        return id;
      }
    }

    return null; // Jika tidak cocok
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
    if (deviceId === undefined) {
      console.warn(`❌ Tidak ada deviceId untuk region: ${regionId}`);
      return;
    }

    const sourceId = `region-${regionId}`;
    const layerId = `region-${regionId}-fill`;

    if (isActive) {
      try {
        console.log(`🔄 Memuat GeoJSON dari API untuk ID ${deviceId}...`);
        const geojson = await fetchDeviceGeoJSON(deviceId);
        console.log(`✅ GeoJSON untuk ID ${deviceId} diterima`, geojson);

        // Validasi geojson: harus berisi fitur
        if (!geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) {
          console.error(`❌ GeoJSON kosong atau tidak valid untuk device ID ${deviceId}`);
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
        console.error(`❌ Gagal muat GeoJSON dari API untuk device ID ${deviceId}:`, e);
        // ❗ Set state aktif menjadi false agar tombol toggle kembali ke posisi off
        setActiveLayers(prev => ({ ...prev, [regionId]: false }));
        // 🚫 Jangan biarkan layer tetap aktif jika gagal
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

      // Hapus reference
      setRegionLayers(prev => {
        const newLayers = { ...prev };
        delete newLayers[regionId];
        return newLayers;
      });
    }
  };

  const handleLayerToggle = (layerId) => {
    console.log("🔄 MapboxMap: Toggle layer received:", layerId);

    // Jika layerId adalah wilayah (misal: ws-baru-bajul-mati)
    if (layerId.startsWith('ws-')) {
      setActiveLayers(prev => {
        const newState = { ...prev, [layerId]: !prev[layerId] };
        console.log("🆕 New activeLayers state:", newState);

        // Aktifkan/mematikan layer wilayah dari API
        handleRegionLayerToggle(layerId, newState[layerId]);

        return newState;
      });
    } else {
      // Untuk layer biasa (rivers, flood-risk, dll) atau UPT
      setActiveLayers(prev => {
        const newState = { ...prev, [layerId]: !prev[layerId] };
        console.log("🆕 New activeLayers state:", newState);
        return newState;
      });
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

// ✅ Perbaikan: Gunakan useEffect untuk memperbarui marker hanya saat tickerData, devices, atau activeLayers berubah
useEffect(() => {
  if (!map.current || !tickerData || !devices.length) return;

  console.log("📊 tickerData length:", tickerData.length);
  console.log("📡 devices length:", devices.length);
  console.log("🔄 Active Layers:", activeLayers);

  // Hapus semua marker lama
  markersRef.current.forEach(marker => marker?.remove?.());
  markersRef.current = [];

  // ✅ Daftar AWLR untuk WS Brantas PJT 1
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

  // ✅ Ekstrak kata kunci dari daftar AWLR
  const extractKeywords = (list) => {
    return list.map(name => {
      const parts = name.split(' ');
      return parts[parts.length - 1];
    });
  };

  const brantasKeywords = extractKeywords(awlrBrantasList);
  const bengawanKeywords = extractKeywords(awlrBengawanSoloList);
  const arrBrantasKeywords = extractKeywords(arrBrantasList);

  console.log("🔍 Brantas Keywords:", brantasKeywords);
  console.log("🔍 Bengawan Keywords:", bengawanKeywords);
  console.log("🔍 ARR Brantas Keywords:", arrBrantasKeywords);

  tickerData.forEach(station => {
    console.log(`📍 Checking station: "${station.name}"`);
    const coordinates = getStationCoordinates(station.name);
    if (!coordinates) {
      console.log(`❌ Marker tidak dibuat untuk "${station.name}" - koordinat tidak valid.`);
      return;
    }

    // ✅ Cek apakah UPT stasiun ini aktif
    const stationUptId = getUptIdFromStationName(station.name);

    // ✅ LOGIKA BARU: Jika tombol "Pos Hujan WS Bengawan Solo PJT 1" aktif, tampilkan semua stasiun yang namanya dimulai dengan "BS"
    const isBengawanSoloPJT1Active = activeLayers['pos-hujan-ws-bengawan-solo'];
    const isBSStation = station.name.startsWith('BS');

    // ✅ LOGIKA BARU: Jika tombol "Hujan Jam-Jam an PU SDA" aktif, tampilkan semua device ARR / Pos Hujan
    const isHujanJamJamActive = !!activeLayers['Hujan Jam-Jam an PU SDA'];
    // Trim name once and prepare quoted checks
    const nameTrim = station.name ? station.name.trim() : '';
    // Show only devices whose name starts and ends with double quotes ("...")
    const isDoubleQuotedName = /^".*"$/.test(nameTrim);
    const isHujanJamJamStation = isDoubleQuotedName;

    // ✅ NEW: Pos Duga Air Jam-Jam an PU SDA — show devices with single quotes at start and end (e.g., '\'Name\'')
    // This supports both an explicit activeLayers key named exactly 'Pos Duga Air Jam-Jam an PU SDA'
    // or any active layer key that includes 'pos-duga' (case-insensitive)
    const isPosDugaJamJamActive = (!!activeLayers['Pos Duga Air Jam-Jam an PU SDA']) ||
      Object.keys(activeLayers).some(k => k.toLowerCase().includes('pos-duga') && activeLayers[k]);
    const isSingleQuotedName = /^'.*'$/.test(nameTrim);

    // ✅ LOGIKA BARU: Jika tombol "Pos Hujan WS Brantas PJT 1" aktif, tampilkan ARR di daftar brantas
    const isHujanBrantasActive = activeLayers['pos-hujan-ws-brantas-pjt1'];
    const isARRBrantasStation = arrBrantasKeywords.some(keyword =>
      station.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // ✅ LOGIKA BARU: Jika tombol "Pos Duga Air WS Bengawan Solo PJT 1" aktif, tampilkan AWLR di daftar bengawan solo
    const isDugaAirBengawanSoloActive = activeLayers['pos-duga-air-ws-bengawan-solo'];
    const isAWLRBengawanSoloStation = bengawanKeywords.some(keyword =>
      station.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // ✅ LOGIKA BARU: Jika tombol "Pos Duga Air WS Brantas PJT 1" aktif, tampilkan AWLR di daftar brantas
    const isDugaAirBrantasActive = activeLayers['pos-duga-air-ws-brantas-pjt1'];
    const isAWLRBrantasStation = brantasKeywords.some(keyword =>
      station.name.toLowerCase().includes(keyword.toLowerCase())
    );

    // ✅ LOGIKA BARU: Cek apakah ada tombol UPT aktif
    const isAnyUptActive = Object.keys(activeLayers).some(key => 
      key.startsWith('upt-') && activeLayers[key]
    );

    // ✅ LOGIKA PENAMPILAN MARKER — HANYA SATU KONDISI YANG BOLEH AKTIF
    let shouldShowMarker = false;

    // If any WS region toggles are active, do NOT show markers at all (markers are hidden when region layers active)
    const activeRegionIds = Object.keys(activeLayers).filter(k => k.startsWith('ws-') && activeLayers[k]);
    if (activeRegionIds.length > 0) {
      console.log(`ℹ️ Region layers active (${activeRegionIds.join(',')}) — skipping marker rendering`);
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

    console.log(`✅ Is Hujan Brantas Active? ${isHujanBrantasActive}`);
    console.log(`✅ Is ARR Brantas Station? ${isARRBrantasStation}`);
    console.log(`✅ Should Show Marker? ${shouldShowMarker}`);

    if (!shouldShowMarker) {
      console.log(`⏸️ Marker diabaikan untuk "${station.name}" - tidak memenuhi kondisi tampil.`);
      return; // Skip jika tidak memenuhi syarat
    }

    try {
      const markerEl = document.createElement("div");
      markerEl.className = "custom-marker";
      // ✅ Ambil gaya marker berdasarkan jenis stasiun
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
      const borderColor = override?.color || markerStyle.color; // Warna jenis (untuk border)

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
        position: absolute; /* ✅ Penting! */
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
      
      // ✅ Gunakan icon dari override jika ada, otherwise use markerStyle
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
          transform: translate(0, 0); /* ✅ Agar tidak terpengaruh oleh transform markerEl */
        `;
        markerEl.appendChild(pulseEl);
      }

      // ✅ Marker dengan anchor dan offset tetap agar tidak bergerak saat zoom
      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'center', // 🎯 Pusatkan marker
        offset: [0, 0],   // ✅ Jangan geser
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

  // ✅ Trigger: Jika "legenda-peta" aktif, sembunyikan Filter Panel
  const showFilter = showFilterSidebar && !activeLayers['legenda-peta'];

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

      {selectedStation && onStationSelect && (
        <Suspense fallback={null}>
          <StationDetail
            selectedStation={selectedStation}
            onClose={() => onStationSelect(null)}
            tickerData={tickerData}
          />
        </Suspense>
      )}

      {/* Tombol Filter */}
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