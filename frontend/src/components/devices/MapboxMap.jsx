// src/components/devices/MapboxMap.jsx
import React, { useEffect, useRef, useState, lazy } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchDevices } from "../../services/devices";
import { fetchDeviceGeoJSON } from "/src/services/MapGeo";
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

    // eslint-disable-next-line no-unused-vars
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const [autoSwitchActive, setAutoSwitchActive] = useState(false);
    const [currentStationIndex, setCurrentStationIndex] = useState(0);
    const [selectedStationCoords, setSelectedStationCoords] = useState(null);

    const [showDebugger, setShowDebugger] = useState(false);
    const [showZoomDebug, setShowZoomDebug] = useState(false);
    const [markerDebugInfo, setMarkerDebugInfo] = useState([]);
    const zoomEventCounter = useRef(0);

    // Active layers state
    const [activeLayers, setActiveLayers] = useState({
        rivers: false,
        "flood-risk": false,
        rainfall: false,
        administrative: false,
        // Special local layer
        "test-map-debit-100": true,
        // UPT and Region layers
        "pos-hujan-ws-bengawan-solo": false,
        "pos-duga-air-ws-bengawan-solo": false,
        "pos-duga-air-ws-brantas-pjt1": false,
        "Hujan Jam-Jam an PU SDA": false,
        // UPT keys will be handled dynamically or added here if needed
    });

    const [regionLayers, setRegionLayers] = useState({});
    const [administrativeGeojson, setAdministrativeGeojson] = useState(null);
    const administrativeSourceId = "administrative-boundaries";
    const administrativeLayerId = "administrative-fill";

    const [riversGeojson, setRiversGeojson] = useState(null);
    const riversSourceId = "rivers-jatim-source";
    const riversLayerId = "rivers-jatim-layer";

    // Load devices
    useEffect(() => {
        const loadDevices = async () => {
            try {
                const devicesData = await fetchDevices();
                setDevices(devicesData);
                // Logging validation
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

    // Helper: Marker Size based on Zoom
    const getMarkerSize = (z) => {
        if (z < 8) return 18;
        if (z < 10) return 24;
        if (z < 12) return 28;
        return 32;
    };

    // Helper: Validate Coordinates
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
        if (!device) {
            // console.warn(`⚠️ Stasiun "${stationName}" tidak ditemukan di devices.`);
            return null;
        }
        if (!device.latitude || !device.longitude) {
            // console.warn(`⚠️ Stasiun "${stationName}" tidak memiliki koordinat yang valid.`);
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

    // eslint-disable-next-line no-unused-vars
    const handleShowDetail = (station) => {
        setTooltip((prev) => ({ ...prev, visible: false }));
        if (onStationSelect) onStationSelect(station);
    };

    // eslint-disable-next-line no-unused-vars
    const handleCloseTooltip = () => setTooltip((prev) => ({ ...prev, visible: false }));

    // eslint-disable-next-line no-unused-vars
    const handleStationChange = (station, index) => {
        if (station?.latitude && station.longitude) {
            const coords = [parseFloat(station.longitude), parseFloat(station.latitude)];
            setCurrentStationIndex(index);
            setSelectedStation(station);
            if (map.current) map.current.flyTo({ center: coords, zoom: 14 });
            setTooltip({ visible: true, station, coordinates: coords });
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleAutoSwitchToggle = (isActive) => setAutoSwitchActive(isActive);

    // Toggle Region Layers
    const handleRegionLayerToggle = async (regionId, isActive) => {
        if (!map.current || !mapLoaded) return;

        // Special case for local file layer
        if (regionId === "test-map-debit-100") {
            const sourceId = "test-map-debit-100-source";
            const layerId = "test-map-debit-100-layer";

            if (isActive) {
                try {
                    // Try to fetch local file if exists
                    if (!map.current.getSource(sourceId)) {
                        // Assuming file is in public or accessible.
                        // If file is missing, this fetch will fail effectively.
                        // We map local file fetch here manually.
                        const response = await fetch("/welang_debit_100.json");
                        if (!response.ok) throw new Error("File not found");
                        const geojson = await response.json();

                        map.current.addSource(sourceId, { type: "geojson", data: geojson });
                    }

                    if (!map.current.getLayer(layerId)) {
                        map.current.addLayer({
                            id: layerId,
                            type: "fill",
                            source: sourceId,
                            paint: {
                                "fill-color": "#00CED1",
                                "fill-opacity": 1.0,
                                "fill-outline-color": "transparent",
                            },
                        });
                    }
                } catch (e) {
                    console.error("Failed to load welang_debit_100.json", e);
                    setActiveLayers((prev) => ({ ...prev, [regionId]: false }));
                }
            } else {
                if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
                if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);
            }
            return;
        }

        // Standard API based regions
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
                console.log(`✅ GeoJSON untuk ID ${deviceId} diterima`); // shrunk log

                // Validasi geojson: harus berisi fitur
                if (!geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) {
                    console.error(`❌ GeoJSON kosong atau tidak valid untuk device ID ${deviceId}`);
                    setActiveLayers((prev) => ({ ...prev, [regionId]: false }));
                    return;
                }

                // Hapus dulu jika sudah ada
                if (map.current.getLayer(layerId)) map.current.removeLayer(layerId);
                if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);

                // Tambahkan source baru
                map.current.addSource(sourceId, { type: "geojson", data: geojson });

                // Tambahkan layer baru
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
                        console.error("Error on region click handler:", err);
                    }
                };

                const mouseEnterHandler = () => {
                    if (map.current) map.current.getCanvas().style.cursor = "pointer";
                };
                const mouseLeaveHandler = () => {
                    if (map.current) map.current.getCanvas().style.cursor = "";
                };

                // Register handlers
                map.current.on("click", layerId, clickHandler);
                map.current.on("mouseenter", layerId, mouseEnterHandler);
                map.current.on("mouseleave", layerId, mouseLeaveHandler);

                setRegionLayers((prev) => ({
                    ...prev,
                    [regionId]: {
                        sourceId,
                        layerId,
                        deviceId,
                        geojson,
                        clickHandler,
                        mouseEnterHandler,
                        mouseLeaveHandler,
                    },
                }));
            } catch (e) {
                console.error(`❌ Gagal muat GeoJSON dari API untuk device ID ${deviceId}:`, e);
                // ❗ Set state aktif menjadi false agar tombol toggle kembali ke posisi off
                setActiveLayers((prev) => ({ ...prev, [regionId]: false }));
            }
        } else {
            // Hapus layer & source
            // Remove event handlers if any
            const existing = regionLayers[regionId];
            if (existing) {
                try {
                    // Check if map still exists before removing handlers
                    if (map.current) {
                        if (existing.clickHandler) map.current.off("click", layerId, existing.clickHandler);
                        if (existing.mouseEnterHandler)
                            map.current.off("mouseenter", layerId, existing.mouseEnterHandler);
                        if (existing.mouseLeaveHandler)
                            map.current.off("mouseleave", layerId, existing.mouseLeaveHandler);
                    }
                } catch (err) {
                    console.warn("Error removing handlers for", layerId, err);
                }
            }

            if (map.current && map.current.getLayer(layerId)) map.current.removeLayer(layerId);
            if (map.current && map.current.getSource(sourceId)) map.current.removeSource(sourceId);
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
                console.log("🆕 New activeLayers state:", newState);

                // Aktifkan/mematikan layer wilayah
                handleRegionLayerToggle(layerId, newState[layerId]);
                return newState;
            });
        } else {
            // Untuk layer biasa (rivers, flood-risk, dll) atau UPT
            setActiveLayers((prev) => {
                const newState = { ...prev, [layerId]: !prev[layerId] };
                console.log("🆕 New activeLayers state:", newState);
                return newState;
            });
        }
    };

    // Init Map
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

    // Handle Markers Creation
    useEffect(() => {
        if (!map.current || !tickerData || !devices.length) return;

        // Hapus semua marker lama
        markersRef.current.forEach((marker) => marker?.remove?.());
        markersRef.current = [];

        // Filter Logic
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
        // Daftar AWLR untuk WS Bengawan Solo PJT 1
        const awlrBengawanSoloList = ["AWLR Bendungan Jati", "AWLR BG Babat", "AWLR BG Bojonegoro"];
        // Daftar ARR (Pos Hujan) untuk WS Brantas PJT 1
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

        const brantasKeywords = extractKeywords(awlrBrantasList);
        const bengawanKeywords = extractKeywords(awlrBengawanSoloList);
        const arrBrantasKeywords = extractKeywords(arrBrantasList);

        const currentZoom = map.current.getZoom() ?? 8;
        const targetSize = getMarkerSize(currentZoom);
        const initialScale = Math.max(0.01, targetSize / BASE_SIZE);

        const debugInfo = [];

        tickerData.forEach((station) => {
            const coordinates = getStationCoordinates(station.name);
            if (!coordinates) return;

            const [lng, lat] = coordinates;
            const validation = validateCoordinates(lng, lat);
            debugInfo.push({ name: station.name, coordinates, validation, zoom: currentZoom });

            // Logic Check
            const stationUptId = getUptIdFromStationName(station.name);
            const isBengawanSoloPJT1Active = activeLayers["pos-hujan-ws-bengawan-solo"];
            const isBSStation = station.name.startsWith("BS");
            const isHujanJamJamActive = !!activeLayers["Hujan Jam-Jam an PU SDA"];
            const nameTrim = station.name ? station.name.trim() : "";
            const isDoubleQuotedName = /^".*"$/.test(nameTrim);
            const isHujanJamJamStation = isDoubleQuotedName;
            const isPosDugaJamJamActive =
                !!activeLayers["Pos Duga Air Jam-Jam an PU SDA"] ||
                Object.keys(activeLayers).some((k) => k.toLowerCase().includes("pos-duga") && activeLayers[k]);
            const isSingleQuotedName = /^'.*'$/.test(nameTrim);
            const isHujanBrantasActive = activeLayers["pos-hujan-ws-brantas-pjt1"];
            const isARRBrantasStation = arrBrantasKeywords.some((keyword) =>
                station.name.toLowerCase().includes(keyword.toLowerCase())
            );
            const isDugaAirBengawanSoloActive = activeLayers["pos-duga-air-ws-bengawan-solo"];
            const isAWLRBengawanSoloStation = bengawanKeywords.some((keyword) =>
                station.name.toLowerCase().includes(keyword.toLowerCase())
            );
            const isDugaAirBrantasActive = activeLayers["pos-duga-air-ws-brantas-pjt1"];
            const isAWLRBrantasStation = brantasKeywords.some((keyword) =>
                station.name.toLowerCase().includes(keyword.toLowerCase())
            );
            const isAnyUptActive = Object.keys(activeLayers).some((key) => key.startsWith("upt-") && activeLayers[key]);

            let shouldShowMarker = false;

            const activeRegionIds = Object.keys(activeLayers).filter((k) => k.startsWith("ws-") && activeLayers[k]);
            if (activeRegionIds.length > 0) return; // Hide markers if regions active

            if (isAnyUptActive && stationUptId && activeLayers[stationUptId]) {
                shouldShowMarker = true;
            } else if (isHujanJamJamActive && isHujanJamJamStation) {
                shouldShowMarker = true;
            } else if (isPosDugaJamJamActive && isSingleQuotedName) {
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
                const borderColor = override?.color || markerStyle.color;
                const overrideBg = override?.color || bgColor;

                let borderRadiusVal = "50%";
                let extraTransform = "";
                if (override?.shape === "rounded-square") borderRadiusVal = "8px";
                if (override?.shape === "square") borderRadiusVal = "6px";
                if (override?.shape === "diamond") {
                    borderRadiusVal = "6px";
                    extraTransform = " rotate(45deg)";
                }
                if (override?.shape === "triangle") {
                    borderRadiusVal = "4px";
                }
                if (override?.shape === "pin") {
                    borderRadiusVal = "50% 50% 50% 50%";
                }
                if (override?.shape === "circle-with-square") borderRadiusVal = "50%";

                markerEl.style.cssText = `
                position: absolute;
                width: 24px; height: 24px;
                border-radius: ${borderRadiusVal};
                background-color: ${overrideBg};
                border: 2px solid ${borderColor};
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                z-index: 1;
                transform: translate(-50%, -50%)${extraTransform};
             `;
                markerEl.innerHTML = override?.icon || markerStyle.icon;

                if (station.status === "alert") {
                    const pulseEl = document.createElement("div");
                    pulseEl.style.cssText = `
                    position: absolute; width: 100%; height: 100%;
                    border-radius: 50%; background-color: ${bgColor};
                    opacity: 0.7; animation: alert-pulse 2s infinite; z-index: -1;
                    transform: translate(0, 0);
                 `;
                    markerEl.appendChild(pulseEl);
                }

                const marker = new mapboxgl.Marker({
                    element: markerEl,
                    anchor: "center",
                    offset: [0, 0],
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
                console.error("Error creating marker", error);
            }
        });
        setMarkerDebugInfo(debugInfo);
    }, [tickerData, devices, activeLayers, autoSwitchActive]);

    // Update marker sizes on zoom
    const updateMarkerSizes = (newZoom) => {
        const target = getMarkerSize(newZoom);
        const scale = Math.max(0.01, target / BASE_SIZE);
        markersRef.current.forEach((marker) => {
            const el = marker.getElement();
            if (!el) return;
            // We are not using inner div scale anymore for custom shapes, but keeping this safe
            // Actually, my new marker creation logic above does NOT use .marker-inner anymore
            // So this might break or do nothing
            // Let's re-add marker-inner structure IF we want dynamic scaling supported
            // But looking at the new logic, it sets width/height fixed to 24px in cssText
            // So probably dynamic scaling is removed in favor of fixed size 24px?
            // Incoming code had fixed size 24px in style.
            // HEAD had BASE_SIZE=32 and scaling.
            // I will trust Incoming's fixed size approach for now as it supports shapes better.
        });
    };

    // Click Outside
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

    // Rivers Layer
    useEffect(() => {
        if (!map.current || !mapLoaded) return;
        const isRiversActive = activeLayers.rivers;
        if (!isRiversActive) {
            if (map.current.getLayer(riversLayerId)) map.current.removeLayer(riversLayerId);
            if (map.current.getSource(riversSourceId)) map.current.removeSource(riversSourceId);
            return;
        }

        if (riversGeojson) {
            if (!map.current.getSource(riversSourceId))
                map.current.addSource(riversSourceId, { type: "geojson", data: riversGeojson });
            if (!map.current.getLayer(riversLayerId))
                map.current.addLayer({
                    id: riversLayerId,
                    type: "line",
                    source: riversSourceId,
                    paint: { "line-color": "#0000FF", "line-width": 2.5, "line-opacity": 0.8 },
                });
        } else {
            fetch("/src/data/TestMAP.json")
                .then((res) => (res.ok ? res.json() : Promise.reject("Sungai JSON not found")))
                .then((data) => {
                    console.log("✅ Sungai Jawa Timur JSON dimuat");
                    setRiversGeojson(data);
                })
                .catch((e) => {
                    console.error("❌ Gagal muat GeoJSON Sungai:", e);
                    setActiveLayers((prev) => ({ ...prev, rivers: false }));
                });
        }

        return () => {
            if (map.current?.getLayer(riversLayerId)) map.current.removeLayer(riversLayerId);
            if (map.current?.getSource(riversSourceId)) map.current.removeSource(riversSourceId);
        };
    }, [mapLoaded, activeLayers.rivers, riversGeojson]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

            <GoogleMapsSearchbar
                onSearch={(query, coords) => {
                    if (coords && map.current) {
                        map.current.flyTo({ center: coords, zoom: 12 });
                    }
                }}
                isSidebarOpen={showFilterSidebar}
                mapboxMap={map.current}
                stationsData={tickerData || []}
            />

            {/* Debuggers */}
            {showDebugger && (
                <CoordinateDebugger
                    mouseCoordinates={null}
                    selectedStationCoords={selectedStationCoords}
                    zoomLevel={zoomLevel}
                />
            )}

            {/* Tooltip */}
            {tooltip.visible && tooltip.station && tooltip.coordinates && (
                <Suspense fallback={<div>Loading...</div>}>
                    <MapTooltip
                        station={tooltip.station}
                        coordinates={tooltip.coordinates}
                        onClose={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                        onShowDetail={() => handleShowDetail(tooltip.station)}
                    />
                </Suspense>
            )}

            {/* Filter Sidebar would be here if implemented inside map */}
        </div>
    );
};

export default MapboxMap;
