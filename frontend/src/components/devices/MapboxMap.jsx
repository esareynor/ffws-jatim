// src/components/devices/MapboxMap.jsx

import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchDevices } from "../../services/devices";

// Lazy imports
const MapTooltip = lazy(() => import("./maptooltip"));
const FilterPanel = lazy(() => import("../FilterPanel.jsx"));
const VectorTilesAPI = lazy(() => import("../VectorTilesAPI.jsx"));
const StationDetail = lazy(() => import("@/components/StationDetail.jsx"));

const MapboxMap = ({ tickerData }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);
    const [devices, setDevices] = useState([]);
    const [tooltip, setTooltip] = useState({
        visible: false,
        station: null,
        coordinates: null,
    });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    // const [selectedStation, setSelectedStation] = useState(null); // 👈 Comment sementara
    const [activeLayers, setActiveLayers] = useState({
        rivers: false,
        'flood-risk': false,
        rainfall: false,
        elevation: false,
        administrative: false,
    });
    const [mapLoaded, setMapLoaded] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case "safe": return "#10B981";
            case "warning": return "#F59E0B";
            case "alert": return "#EF4444";
            default: return "#6B7280";
        }
    };

    const getStatusIcon = (status) => {
        const iconSize = 27;
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

    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
          @keyframes alert-pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.5); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0.7; }
          }`;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        if (map.current) return;
        mapboxgl.accessToken = "pk.eyJ1IjoiZGl0b2ZhdGFoaWxsYWgxIiwiYSI6ImNtZjNveGloczAwNncya3E1YzdjcTRtM3MifQ.kIf5rscGYOzvvBcZJ41u8g";

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [112.5, -7.5],
            zoom: 8,
            pitch: 45,
            bearing: -17.6,
            antialias: true,
        });

        map.current.on('load', () => {
            setMapLoaded(true);
        });

        map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");

        const emitUserInteraction = (source) => {
            document.dispatchEvent(new CustomEvent("userInteraction", { detail: { source } }));
        };
        map.current.on("dragstart", () => emitUserInteraction("mapDrag"));
        map.current.on("zoomstart", () => emitUserInteraction("mapZoom"));
        map.current.on("click", () => emitUserInteraction("mapClick"));

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    const getStationCoordinates = (stationName) => {
        if (!devices || devices.length === 0) return null;
        const name = stationName.toLowerCase();
        const device = devices.find(d =>
            (d.name?.toLowerCase() === name) ||
            (d.device_name?.toLowerCase() === name) ||
            (d.station_name?.toLowerCase() === name)
        );
        if (device && device.latitude && device.longitude) {
            const lat = parseFloat(device.latitude);
            const lng = parseFloat(device.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                return [lng, lat];
            }
        }
        return null;
    };

    useEffect(() => {
        if (!map.current || !tickerData || !devices.length) return;

        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        tickerData.forEach((station) => {
            const coordinates = getStationCoordinates(station.name);
            if (coordinates) {
                const markerEl = document.createElement("div");
                markerEl.className = "custom-marker";
                markerEl.style.width = "27px";
                markerEl.style.height = "27px";
                markerEl.style.borderRadius = "50%";
                markerEl.style.backgroundColor = getStatusColor(station.status);
                markerEl.style.border = "3px solid white";
                markerEl.style.boxShadow = "0 4px 8px rgba(0,0,0,0.4)";
                markerEl.style.cursor = "pointer";
                markerEl.style.zIndex = "10";
                markerEl.style.display = "flex";
                markerEl.style.alignItems = "center";
                markerEl.style.justifyContent = "center";
                const iconSvg = getStatusIcon(station.status);
                markerEl.innerHTML = iconSvg;

                if (station.status === "alert") {
                    const pulseEl = document.createElement("div");
                    pulseEl.style.position = "absolute";
                    pulseEl.style.width = "100%";
                    pulseEl.style.height = "100%";
                    pulseEl.style.borderRadius = "50%";
                    pulseEl.style.backgroundColor = getStatusColor(station.status);
                    pulseEl.style.opacity = "0.7";
                    pulseEl.style.animation = "alert-pulse 2s infinite";
                    pulseEl.style.zIndex = "-1";
                    markerEl.appendChild(pulseEl);
                }

                markerEl.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const fullDeviceData = devices.find(d => (d.name || d.device_name || d.station_name) === station.name);
                    const selectedData = fullDeviceData || station;
                    const lat = parseFloat(selectedData.latitude);
                    const lng = parseFloat(selectedData.longitude);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        setSelectedMarker({ lat, lng });
                        map.current.flyTo({ center: coordinates, zoom: 14 });
                        setTooltip({ visible: true, station: selectedData, coordinates });
                        setIsFilterOpen(true);
                    } else {
                        console.warn("Koordinat tidak valid:", station.name);
                    }
                });

                const marker = new mapboxgl.Marker(markerEl).setLngLat(coordinates).addTo(map.current);
                markersRef.current.push(marker);
            }
        });
    }, [tickerData, devices]);

    const handleOpenFilter = () => setIsFilterOpen(true);
    const handleCloseFilter = () => setIsFilterOpen(false);

    const handleLayerToggle = (layerId, status) => {
        setActiveLayers(prev => ({ ...prev, [layerId]: status }));
    };

    const handleAutoSwitchToggle = (isEnabled) => {
        console.log("Auto-switch toggled:", isEnabled);
    };

    // 💡 SEMENTARA: Hanya log, tidak buka panel detail
    const handleShowDetail = (station) => {
        setTooltip(prev => ({ ...prev, visible: false }));
        console.log("✅ Lihat Detail diklik:", station.name);
        // setSelectedStation(station); // 👈 Uncomment nanti setelah pastikan StationDetail exist
    };

    const handleCloseTooltip = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    // const handleCloseDetail = () => { setSelectedStation(null); }; // 👈 Comment sementara

    return (
        <div className="w-full h-screen overflow-hidden relative z-0">
            <div ref={mapContainer} className="w-full h-full" />

            {mapLoaded && (
                <Suspense fallback={null}>
                    <VectorTilesAPI
                        map={map.current}
                        mapLoaded={mapLoaded}
                        selectedLocation={selectedMarker}
                        isRiverLayerActive={activeLayers.rivers}
                    />
                </Suspense>
            )}

            <Suspense fallback={null}>
                <FilterPanel
                    isOpen={isFilterOpen}
                    onOpen={handleOpenFilter}
                    onClose={handleCloseFilter}
                    activeLayers={activeLayers}
                    onLayerToggle={handleLayerToggle}
                    tickerData={tickerData}
                    handleStationChange={() => {}}
                    currentStationIndex={0}
                    handleAutoSwitchToggle={handleAutoSwitchToggle}
                />
            </Suspense>

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

            {/* ⚠️ SEMENTARA COMMENT OUT UNTUK HINDARI ERROR 500 */}
            {/* <Suspense fallback={null}>
                <StationDetail
                    selectedStation={selectedStation}
                    onClose={handleCloseDetail}
                    tickerData={tickerData}
                />
            </Suspense> */}
        </div>
    );
};

export default MapboxMap;