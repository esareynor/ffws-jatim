import React, { useEffect, useRef, useState, lazy, Suspense, useImperativeHandle, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchDevices } from "../../services/devices";
import { fetchDeviceGeoJSON } from "/src/services/MapGeo";
import GoogleMapsSearchbar from "../common/GoogleMapsSearchbar";
import { useStation, useDevices, useAutoSwitch, useMap, useUI } from "@/hooks/useAppContext";
import {
  REGION_ID_TO_DEVICE_ID,
  DEVICE_ID_TO_COLOR,
  getBBox,
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

const BASE_SIZE = 32;

const MapboxMap = React.forwardRef((props, ref) => {
  // Get data from Context
  const { handleStationSelect, handleAutoSwitch, handleCloseStationDetail } = useStation();
  const { tickerData } = useDevices();
  const { isAutoSwitchOn } = useAutoSwitch();
  const { mapRef: contextMapRef } = useMap();
  
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

  // ✅ Active layers — termasuk layer wilayah, UPT, dan layer khusus
  const [activeLayers, setActiveLayers] = useState({
    rivers: false,
    "flood-risk": false,
    rainfall: false,
    administrative: false,
    "pos-hujan-ws-bengawan-solo": false,
    "pos-duga-air-ws-bengawan-solo": false,
    "pos-duga-air-ws-brantas-pjt1": false,
    "Hujan Jam-Jam an PU SDA": false,
    "Pos Duga Air Jam-Jam an PU SDA": false,
  });

  const [regionLayers, setRegionLayers] = useState({});
  const [administrativeGeojson, setAdministrativeGeojson] = useState(null);
  const administrativeSourceId = "administrative-boundaries";
  const administrativeLayerId = "administrative-fill";

  const [riversGeojson, setRiversGeojson] = useState(null);
  const riversSourceId = "rivers-jatim-source";
  const riversLayerId = "rivers-jatim-layer";

  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Wrap handleLayerToggle dengan useCallback agar dapat digunakan di useImperativeHandle
  const memoizedHandleRegionLayerToggle = useCallback(
    (regionId, isActive) => {
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
          (async () => {
            const geojson = await fetchDeviceGeoJSON(deviceId);
            if (!geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) {
              setActiveLayers((prev) => ({ ...prev, [regionId]: false }));
              return;
            }
            if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
            if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);

            map.current.addSource(sourceId, { type: "geojson", data: geojson });
            map.current.addLayer({
              id: layerId,
              type: "fill",
              source: sourceId,
              paint: {
                "fill-color": DEVICE_ID_TO_COLOR[deviceId] || "#6B7280",
                "fill-opacity": 0.5,
                "fill-outline-color": "#4B5563",
              },
            });

            const clickHandler = (e) => {
              try {
                const features = e?.features || [];
                if (features.length === 0) return;
                const bbox = getBBox(features[0].geometry);
                if (isFinite(bbox[0][0]) && isFinite(bbox[1][0])) {
                  map.current.fitBounds(bbox, { padding: 60, maxZoom: 12, duration: 800 });
                }
              } catch (err) {
                console.error("Error on region click:", err);
              }
            };

            const mouseEnterHandler = () => {
              if (map.current) map.current.getCanvas().style.cursor = "pointer";
            };
            const mouseLeaveHandler = () => {
              if (map.current) map.current.getCanvas().style.cursor = "";
            };

            map.current.on("click", layerId, clickHandler);
            map.current.on("mouseenter", layerId, mouseEnterHandler);
            map.current.on("mouseleave", layerId, mouseLeaveHandler);

            setRegionLayers((prev) => ({
              ...prev,
              [regionId]: { sourceId, layerId, clickHandler, mouseEnterHandler, mouseLeaveHandler },
            }));
          })();
        } catch (e) {
          console.error(`❌ Gagal muat GeoJSON untuk device ID ${deviceId}:`, e);
          setActiveLayers((prev) => ({ ...prev, [regionId]: false }));
        }
      } else {
        const existing = regionLayers[regionId];
        if (existing) {
          if (existing.clickHandler) map.current.off("click", layerId, existing.clickHandler);
          if (existing.mouseEnterHandler) map.current.off("mouseenter", layerId, existing.mouseEnterHandler);
          if (existing.mouseLeaveHandler) map.current.off("mouseleave", layerId, existing.mouseLeaveHandler);
        }
        if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
        if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);

        setRegionLayers((prev) => {
          const n = { ...prev };
          delete n[regionId];
          return n;
        });
      }
    },
    [mapLoaded, regionLayers]
  );

  // Expose handleLayerToggle melalui ref untuk dipanggil dari parent
  useImperativeHandle(ref, () => ({
    handleLayerToggle: (layerId) => {
      console.log("🎯 handleLayerToggle called from parent:", layerId);
      setActiveLayers((prev) => {
        const newState = { ...prev, [layerId]: !prev[layerId] };
        if (layerId.startsWith("ws-")) {
          memoizedHandleRegionLayerToggle(layerId, newState[layerId]);
        }
        return newState;
      });
    },
  }), [memoizedHandleRegionLayerToggle]);

  // Load devices
  useEffect(() => {
    const loadDevices = async () => {
      try {
        const devicesData = await fetchDevices();
        setDevices(devicesData);
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
    return [parseFloat(device.longitude), parseFloat(device.latitude)];
  };

  const handleMarkerClick = (station, coordinates) => {
    // Untuk tooltip, adaptasi data agar sesuai dengan sidebar khususnya untuk ARR
    const stationNameUpper = (station?.name || "").trim().toUpperCase();
    const isARRStation = stationNameUpper.startsWith("ARR") || stationNameUpper.includes(" ARR");

    const tooltipStation = isARRStation
      ? { ...station, value: 0, unit: 'mm' }
      : station;

    setSelectedStation(station);
    setSelectedStationCoords(coordinates);
    if (map.current) map.current.flyTo({ center: coordinates, zoom: 14 });
    setTooltip({ visible: true, station: tooltipStation, coordinates });
  };

  const handleShowDetail = (station) => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    handleStationSelect(station);
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

  const handleLayerToggle = (layerId) => {
    if (layerId.startsWith("ws-")) {
      setActiveLayers((prev) => {
        const newState = { ...prev, [layerId]: !prev[layerId] };
        memoizedHandleRegionLayerToggle(layerId, newState[layerId]);
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

      if (typeof window !== "undefined") window.mapboxMap = map.current;
      map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");

      map.current.on("zoom", () => {
        if (!map.current) return;
        const z = map.current.getZoom();
        if (showZoomDebug) zoomEventCounter.current += 1;
      });

      map.current.on("zoomend", () => {
        if (map.current) setZoomLevel(map.current.getZoom());
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

  // ✅ Buat/refresh markers saat data atau activeLayers berubah
  useEffect(() => {
    if (!map.current || !tickerData?.length || !devices?.length) return;

    markersRef.current.forEach((m) => m?.remove?.());
    markersRef.current = [];

    const awlrBrantasList = [
      "AWLR Gubeng", "AWLR Gunungsari", "AWLR Jagir", "AWLR Lohor", "AWLR Lodoyo",
      "AWLR Menturus", "AWLR Milirip", "AWLR Mojokerto", "AWLR Mrican", "AWLR New Lengkong",
      "AWLR Neyama 1", "AWLR Pintu Bendo", "AWLR Pintu Wonokromo", "AWLR Pompa Tulungagung",
      "AWLR Segawe", "AWLR Selorejo", "AWLR Sengguruh", "AWLR Sutami", "AWLR Tiudan",
      "AWLR Wlingi", "AWLR Wonokromo", "AWLR Wonorejo",
    ];
    const awlrBengawanSoloList = ["AWLR Bendungan Jati", "AWLR BG Babat", "AWLR BG Bojonegoro"];
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

    const debugInfo = [];

    tickerData.forEach((station) => {
      const coordinates = getStationCoordinates(station.name);
      if (!coordinates) return;

      const stationUptId = getUptIdFromStationName(station.name);
      const isHujanJamJamActive = activeLayers["Hujan Jam-Jam an PU SDA"];
      const isPosDugaJamJamActive = activeLayers["Pos Duga Air Jam-Jam an PU SDA"];
      const isHujanBrantasActive = activeLayers["pos-hujan-ws-brantas-pjt1"];
      const isDugaAirBrantasActive = activeLayers["pos-duga-air-ws-brantas-pjt1"];
      const isDugaAirBengawanSoloActive = activeLayers["pos-duga-air-ws-bengawan-solo"];
      const isBengawanSoloPJT1Active = activeLayers["pos-hujan-ws-bengawan-solo"];

      const nameTrim = station.name?.trim() || "";
      const isHujanJamJamStation = nameTrim.toUpperCase().startsWith("ARR");
      const isPosDugaJamJamStation = station.name.toLowerCase().includes("awlr");
      const isARRBrantasStation = arrBrantasListKeywords.some((kw) =>
        station.name.toLowerCase().includes(kw.toLowerCase())
      );
      const isAWLRBrantasStation = brantasKeywords.some((kw) =>
        station.name.toLowerCase().includes(kw.toLowerCase())
      );
      const isAWLRBengawanSoloStation = bengawanKeywords.some((kw) =>
        station.name.toLowerCase().includes(kw.toLowerCase())
      );
      const isBSStation = station.name.startsWith("BS");

      const isAnyUptActive = Object.keys(activeLayers).some(
        (key) => key.startsWith("upt-") && activeLayers[key]
      );

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

      const [lng, lat] = coordinates;
      const validation = validateCoordinates(lng, lat);
      debugInfo.push({ name: station.name, coordinates, validation });

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

      let iconToUse = override?.icon || markerStyle.icon || "";
        // Default size
        let size = { width: 24, height: 24 };

        // 1. Kustomisasi untuk POS DUGA AIR (AWLR) - Ikon Tetesan Air
        if (isPosDugaJamJamActive && isPosDugaJamJamStation) {
          iconToUse = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${bgColor}" stroke="white" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`;
          size = { width: 20, height: 24 };
        }

        // 2. Kustomisasi KHUSUS untuk ARR (Hujan Jam-Jam an) - Ikon Awan Hujan
        else if (isHujanJamJamActive && isHujanJamJamStation) {
          // Desain: Ikon Awan dengan warna status, background putih transparan
          iconToUse = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <path d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.132 20.177 10.244 17.819 10.037C17.457 6.452 14.394 4 10.5 4C6.273 4 2.912 7.158 2.508 11.23C2.348 11.222 2.181 11.22 2 11.22C2 11.22 2 11.22 2 11.22C0.895 11.22 0 12.115 0 13.22C0 14.325 0.895 15.22 2 15.22H3V17H2C0.895 17 0 17.895 0 19C0 20.105 0.895 21 2 21H17.5Z" fill="${bgColor}" stroke="white" stroke-width="1.5"/>
              <path d="M8 13V15" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 13V16" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <path d="M16 13V15" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `;
          // Ukuran diperkecil (Lebih kecil dari default 24px)
          size = { width: 22, height: 22 }; 
        }

        const borderColor = override?.color || markerStyle.color || "white";
        const overrideBg = override?.color || bgColor;
        let borderRadiusVal = "50%";
        let extraTransform = "";

        if (override?.shape === "rounded-square") borderRadiusVal = "8px";
        if (override?.shape === "square") borderRadiusVal = "6px";
        if (override?.shape === "diamond") {
          borderRadiusVal = "6px";
          extraTransform = " rotate(45deg)";
        }

        // Disable icon-only for AWLR and ARR — show background unless explicitly overridden by style override
        const isIconOnly = !!override?.noBackground;

        if (isIconOnly) {
          // Hanya tampilkan ikon SVG tanpa latar / border
          markerEl.style.cssText = `
            width: ${size.width}px;
            height: ${size.height}px;
            background: transparent;
            border: none;
            box-shadow: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
            transform: translate(-50%, -50%)${extraTransform};
            padding: 0;
          `;
        } else {
          markerEl.style.cssText = `
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
        }

        markerEl.innerHTML = iconToUse;

        // Hanya tampilkan pulse untuk marker yang bukan icon-only
        if (station.status === "alert" && !isIconOnly) {
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
          `;
          markerEl.appendChild(pulseEl);
        }

        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: "center",
        })
          .setLngLat(coordinates)
          .addTo(map.current);

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

    setMarkerDebugInfo(debugInfo);
  }, [tickerData, devices, activeLayers, mapLoaded]);

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
  }, [mapLoaded, activeLayers.administrative, administrativeGeojson]);

  // Hover/click administrative
  useEffect(() => {
    if (!map.current || !mapLoaded || !activeLayers.administrative) return;

    const handleMouseMove = (e) => {
      const features = map.current.queryRenderedFeatures(e.point, { layers: [administrativeLayerId] });
      if (features.length > 0) {
        const id = features[0].properties.id;
        setHoveredFeature(features[0]);
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
        if (isFinite(bbox[0][0]) && isFinite(bbox[1][0])) {
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

      {mapLoaded && map.current ? (
        <GoogleMapsSearchbar
          mapboxMap={map.current}
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

      <div className="absolute top-5 right-4 z-[80] flex gap-2">
        <button
          onClick={() => setShowFilterSidebar((s) => !s)}
          className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-blue-50 transition-colors shadow-md"
          title={showFilterSidebar ? "Tutup Filter" : "Buka Filter"}
          aria-label={showFilterSidebar ? "Tutup Filter" : "Buka Filter"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 w-6 h-6 text-blue-600">
            <path d="M22 3H2l8 9v7l4 2v-9l8-9z"></path>
          </svg>
        </button>
      </div>

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
      </Suspense>
    </div>
  );
});

MapboxMap.displayName = "MapboxMap";

export default MapboxMap;