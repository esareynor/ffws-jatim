// src/components/devices/MapboxMap.jsx
import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchDevices } from "../../services/devices";
import GoogleMapsSearchbar from "../common/GoogleMapsSearchbar";

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

  const [showDebugger, setShowDebugger] = useState(false);
  const [showZoomDebug, setShowZoomDebug] = useState(false);
  const [markerDebugInfo, setMarkerDebugInfo] = useState([]);
  const zoomEventCounter = useRef(0);

  // ✅ Active layers
  const [activeLayers, setActiveLayers] = useState({
    rivers: false,
    "flood-risk": false,
    rainfall: false,
    administrative: false,
    "test-map-debit-100": true,
  });

  const [regionLayers, setRegionLayers] = useState({});
  const [administrativeGeojson, setAdministrativeGeojson] = useState(null);
  const administrativeSourceId = "administrative-boundaries";
  const administrativeLayerId = "administrative-fill";

  const [riversGeojson, setRiversGeojson] = useState(null);
  const riversSourceId = "rivers-jatim-source";
  const riversLayerId = "rivers-jatim-layer";
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Utils
  const getBBox = (geometry) => {
    const bounds = [
      [Infinity, Infinity],
      [-Infinity, -Infinity],
    ];
    const traverse = (arr) => {
      if (arr.length === 2 && typeof arr[0] === "number" && typeof arr[1] === "number") {
        bounds[0][0] = Math.min(bounds[0][0], arr[0]);
        bounds[0][1] = Math.min(bounds[0][1], arr[1]);
        bounds[1][0] = Math.max(bounds[1][0], arr[0]);
        bounds[1][1] = Math.max(bounds[1][1], arr[1]);
      } else arr.forEach(traverse);
    };
    traverse(geometry.coordinates);
    return bounds;
  };

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
        console.log("📊 Devices Coordinate Statistics:", stats);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };
    loadDevices();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "safe":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "alert":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status) => {
    const iconSize = 24,
      iconColor = "white";
    switch (status) {
      case "safe":
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case "warning":
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9V13M12 17.0195V17M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      case "alert":
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 7.25V13M12 16.75V16.76M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      default:
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="${iconColor}" stroke-width="2"/></svg>`;
    }
  };

  // 🎯 Ukuran marker berbasis zoom (ukuran target visual)
  const getMarkerSize = (z) => {
    if (z < 8) return 18;
    if (z < 10) return 24;
    if (z < 12) return 28;
    return 32;
  };

  // 🎯 Validasi koordinat
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
    const device = devices.find((d) => d.name === stationName);
    if (!device?.latitude || !device?.longitude) return null;
    const lat = parseFloat(device.latitude);
    const lng = parseFloat(device.longitude);
    return [lng, lat];
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

  // ✅ Toggle region layers
  const handleRegionLayerToggle = async (regionId, isActive) => {
    if (!map.current || !mapLoaded) return;

    const regionConfig = {
<<<<<<< HEAD
      'ws-baru-bajul-mati': { filename: 'WSBaruBajulMati.json', color: '#8A2BE2' },
      'ws-bengawan-solo': { filename: 'WSBengawanSolo.json', color: '#FF7F50' },
      'ws-bondoyudo-bedadung': { filename: 'WSBondoyudoBedadung.json', color: '#00CED1' },
      'ws-brantas': { filename: 'WSBrantas.json', color: '#FF4500' },
      'ws-pekalen-sampean': { filename: 'WSPekalenSampean.json', color: '#ff69b45b' },
      'ws-welang-rejoso': { filename: 'WSWelangRejoso.json', color: '#FF00FF' },
      'ws-madura-bawean': { filename: 'WSMaduraBawean.json', color: '#FFD700' },
      // Tambahkan lainnya sesuai kebutuhan
=======
      "ws-baru-bajul-mati": { filename: "WSBaruBajulMati.json", color: "#8A2BE2" },
      "ws-bengawan-solo": { filename: "WSBengawanSolo.json", color: "#FF7F50" },
      "ws-bondoyudo-bedadung": { filename: "WSBondoyudoBedadung.json", color: "#00CED1" },
      "ws-brantas": { filename: "WSBrantas.json", color: "#FF4500" },
      "ws-pekalen-sampean": { filename: "WSPekalenSampean.json", color: "#ff69b45b" },
      "ws-welang-rejoso": { filename: "WSWelangRejoso.json", color: "#FF00FF" },
      "ws-madura-bawean": { filename: "WSMaduraBawean.json", color: "#FFD700" },
      "test-map-debit-100": {
        filename: "welang_debit_100.json",
        color: "#00CED1",
        opacity: 1.0,
      },
>>>>>>> 39c60f841fa3c86ec38e34b2fd05b744dec26bb5
    };

    const config = regionConfig[regionId];
    if (!config) return;

    const sourceId = `region-${regionId}`;
    const layerId = `region-${regionId}-fill`;

    if (isActive) {
      try {
        const response = await fetch(`/src/data/${config.filename}`);
        if (!response.ok) throw new Error(`${config.filename} not found`);
        const geojson = await response.json();

        if (!map.current.getSource(sourceId)) {
          map.current.addSource(sourceId, { type: "geojson", data: geojson });
        }

        if (!map.current.getLayer(layerId)) {
          map.current.addLayer({
            id: layerId,
            type: "fill",
            source: sourceId,
            filter: ["==", ["geometry-type"], "Polygon"],
            paint: {
              "fill-color": ["coalesce", ["get", "color"], config.color],
              "fill-opacity": config.opacity || 1.0,
              "fill-outline-color": "transparent",
            },
          });
        }

        setRegionLayers((prev) => ({ ...prev, [regionId]: { sourceId, layerId } }));
      } catch (e) {
        console.error(`❌ Gagal muat ${config.filename}:`, e);
        setActiveLayers((prev) => ({ ...prev, [regionId]: false }));
      }
    } else {
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
        handleRegionLayerToggle(layerId, newState[layerId]);
        return newState;
      });
    } else {
      setActiveLayers((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
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

      // 📌 Saat zoom berlangsung: hanya scale child marker
      map.current.on("zoom", () => {
        if (!map.current) return;
        const z = map.current.getZoom();
        updateMarkerSizes(z);
        if (showZoomDebug) zoomEventCounter.current += 1;
      });

      // 📌 Setelah zoom selesai: update angka di UI
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

  // ✅ Buat/refresh markers hanya saat data atau map siap (TANPA zoomLevel)
  useEffect(() => {
    if (!map.current || !mapLoaded || !tickerData?.length || !devices?.length) return;

    // Hapus marker lama
    markersRef.current.forEach((m) => m?.remove?.());
    markersRef.current = [];

    const currentZoom = map.current.getZoom() ?? 8;
    const targetSize = getMarkerSize(currentZoom);
    const initialScale = Math.max(0.01, targetSize / BASE_SIZE);
    const debugInfo = [];

    tickerData.forEach((station) => {
      const coords = getStationCoordinates(station.name);
      if (!coords) return;

      const [lng, lat] = [parseFloat(coords[0]), parseFloat(coords[1])];
      const validation = validateCoordinates(lng, lat);
      debugInfo.push({ name: station.name, coordinates: [lng, lat], validation, zoom: currentZoom });

      try {
        // ROOT (tetap)
        const markerEl = document.createElement("div");
        markerEl.className = "custom-marker";
        markerEl.setAttribute("data-station", station.name);
        markerEl.setAttribute("data-lat", String(lat));
        markerEl.setAttribute("data-lng", String(lng));
        markerEl.setAttribute("data-valid", String(validation.isValid));
        const borderColor = validation.isValid
          ? "white"
          : validation.severity === "critical"
          ? "#EF4444"
          : validation.severity === "high"
          ? "#F59E0B"
          : "#FCD34D";

        markerEl.style.cssText = `
          width:${BASE_SIZE}px;
          height:${BASE_SIZE}px;
          border-radius:50%;
          background-color:${getStatusColor(station.status)};
          border:2px solid ${borderColor};
          box-shadow:0 2px 4px rgba(0,0,0,0.3);
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          position:relative;
          overflow:visible; /* penting agar pulse/ badge terlihat */
        `;

        // INNER (yang di-scale)
        const inner = document.createElement("div");
        inner.className = "marker-inner";
        inner.style.cssText = `
          width:100%;
          height:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          transform-origin:center center;
          will-change: transform;
          transform: scale(${initialScale});
        `;
        inner.innerHTML = getStatusIcon(station.status);
        markerEl.appendChild(inner);

        if (!validation.isValid) {
          const warningBadge = document.createElement("div");
          warningBadge.style.cssText = `
            position:absolute; top:-4px; right:-4px; width:12px; height:12px;
            background-color:${validation.severity === "critical" ? "#EF4444" : "#F59E0B"};
            border-radius:50%; border:2px solid white; z-index:10;
          `;
          markerEl.appendChild(warningBadge);
        }

        if (station.status === "alert") {
          const pulseEl = document.createElement("div");
          pulseEl.style.cssText = `
            position:absolute; width:100%; height:100%;
            border-radius:50%;
            background-color:${getStatusColor(station.status)};
            opacity:.7; animation:alert-pulse 2s infinite; z-index:-1;
            pointer-events:none;
          `;
          markerEl.appendChild(pulseEl);
        }

        const marker = new mapboxgl.Marker({ element: markerEl, anchor: "center" })
          .setLngLat([lng, lat])
          .addTo(map.current);

        markersRef.current.push(marker);

        markerEl.addEventListener("click", (e) => {
          e.stopPropagation();
          if (autoSwitchActive) setAutoSwitchActive(false);
          handleMarkerClick(station, [lng, lat]);
        });
      } catch (error) {
        console.error("Error creating marker:", error);
      }
    });

    setMarkerDebugInfo(debugInfo);
    console.log(
      `✅ Markers created: ${markersRef.current.length} at zoom ${currentZoom.toFixed(2)} (scale ${initialScale.toFixed(
        2
      )})`
    );
  }, [tickerData, devices, mapLoaded, autoSwitchActive]);

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
<<<<<<< HEAD
      fetch('/src/data/TestMAP.json')
        .then(res => res.ok ? res.json() : Promise.reject('Sungai JSON not found (404)'))
        .then(data => { console.log('✅ Sungai Jawa Timur JSON dimuat'); setRiversGeojson(data); })
        .catch(e => { console.error('❌ Gagal muat GeoJSON Sungai Jawa Timur:', e); setActiveLayers(prev => ({ ...prev, rivers: false })); });
=======
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
>>>>>>> 39c60f841fa3c86ec38e34b2fd05b744dec26bb5
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
<<<<<<< HEAD
      fetch('/src/data/72_peta_4_peta_Wilayah_Sungai.json')
        .then(res => res.ok ? res.json() : Promise.reject('JSON not found (404)'))
        .then(data => {
=======
      fetch("/src/data/72_peta_4_peta_Wilayah_Sungai.json")
        .then((res) => (res.ok ? res.json() : Promise.reject("JSON not found (404)")))
        .then((data) => {
>>>>>>> 39c60f841fa3c86ec38e34b2fd05b744dec26bb5
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

      {selectedStation && onStationSelect && (
        <Suspense fallback={null}>
          <StationDetail
            selectedStation={selectedStation}
            onClose={() => onStationSelect(null)}
            tickerData={tickerData}
          />
        </Suspense>
      )}

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
