import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { fetchDevices } from "../services/devices";

// Lazy load MapTooltip untuk optimasi bundle
const MapTooltip = lazy(() => import("./devices/maptooltip"));

const MapboxMap = ({ tickerData, onStationSelect, onMapFocus, onStationChange }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);
    const [selectedStationCoords, setSelectedStationCoords] = useState(null);
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const loadDevices = async () => {
            try {
                const devicesData = await fetchDevices();
                console.log('MapboxMap: Fetched devices:', devicesData?.length || 0);
                console.log('MapboxMap: First device structure:', devicesData?.[0]);
                setDevices(devicesData);
            } catch (error) {
                console.error("Failed to fetch devices:", error);
            }
        };
        loadDevices();
    }, []);

    // State untuk tooltip
    const [tooltip, setTooltip] = useState({
        visible: false,
        station: null,
        coordinates: null,
    });
    // Tambahkan animasi CSS untuk pulse effect
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
      @keyframes alert-pulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.5); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.7; }
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    // Handler untuk auto focus dari running bar
    const handleMapFocus = (focusData) => {
        if (!map.current) return;
        const { lat, lng, zoom, stationId, stationName } = focusData;
        setSelectedStationCoords([lng, lat]);

        map.current.flyTo({
            center: [lng, lat],
            zoom: zoom || 14,
            pitch: 45,
            bearing: -17.6,
            speed: 1.2,
            curve: 1.4,
            easing: (t) => t,
            essential: true,
        });
        // Tampilkan tooltip setelah jeda singkat
        setTimeout(() => {
            if (tickerData) {
                const station = tickerData.find((s) => s.id === stationId);
                if (station) {
                    const coordinates = getStationCoordinates(station.name);
                    if (coordinates) {
                        setTooltip({
                            visible: true,
                            station: station,
                            coordinates: coordinates,
                        });
                    }
                }
            }
        }, 800);
    };
    // Handler untuk auto switch dari toggle
    const handleAutoSwitch = (device, index) => {
        console.log(`handleAutoSwitch called with device: ${device?.name || device?.device_name || device?.station_name || 'undefined'}, index: ${index}`);
        
        if (!map.current || !device) {
            console.warn("Map or device not available for auto switch");
            return;
        }
        
        let coordinates = null;
        
        try {
            // Check if device has direct coordinates
            if (device.coordinates && Array.isArray(device.coordinates)) {
                coordinates = device.coordinates;
                console.log("Using direct coordinates from device object:", coordinates);
            } else if (device.latitude && device.longitude) {
                coordinates = [parseFloat(device.longitude), parseFloat(device.latitude)];
                console.log("Using lat/lng from device object:", coordinates);
            } else {
                // Fallback to searching by name
                const deviceName = device.name || device.device_name || device.station_name;
                coordinates = getStationCoordinates(deviceName);
                console.log("Looked up coordinates by name:", coordinates);
            }
            
            if (!coordinates) {
                const deviceName = device.name || device.device_name || device.station_name;
                console.warn("No coordinates found for device:", deviceName);
                
                // Coba lakukan pencarian lebih agresif berdasarkan nama
                const deviceLowerName = deviceName.toLowerCase();
                // Log semua perangkat untuk debug
                console.log("Attempting fuzzy match with devices:", devices.map(d => d.name || d.device_name || d.station_name));
                
                const matchedDevice = devices.find(d => {
                    const dName = d.name || d.device_name || d.station_name;
                    return dName.toLowerCase() === deviceLowerName || 
                           dName.toLowerCase().includes(deviceLowerName) || 
                           deviceLowerName.includes(dName.toLowerCase());
                });
                
                if (matchedDevice && matchedDevice.latitude && matchedDevice.longitude) {
                    coordinates = [parseFloat(matchedDevice.longitude), parseFloat(matchedDevice.latitude)];
                    console.log("Found coordinates through fuzzy matching:", coordinates);
                } else {
                    console.error("Still could not find coordinates after fuzzy matching");
                    
                    // Jika tidak ada koordinat ditemukan, gunakan koordinat default
                    if (devices.length > 0 && devices[0].latitude && devices[0].longitude) {
                        coordinates = [parseFloat(devices[0].longitude), parseFloat(devices[0].latitude)];
                        console.log("Using first device coordinates as fallback:", coordinates);
                    } else {
                        return;
                    }
                }
            }
        } catch (error) {
            console.error("Error processing device coordinates:", error);
            return;
        }
        
        const deviceName = device.name || device.device_name || device.station_name;
        console.log("Auto switching to device:", deviceName, "at coordinates:", coordinates, "index:", index);
        setSelectedStationCoords(coordinates);
        
        // Fly to device
        map.current.flyTo({
            center: coordinates,
            zoom: 12,
            pitch: 45,
            bearing: -17.6,
            speed: 1.2,
            curve: 1.4,
            easing: (t) => t,
            essential: true,
        });
        
        // Munculkan tooltip dengan jeda kecil
        setTimeout(() => {
            setTooltip({
                visible: true,
                station: device, // Keep as station for tooltip compatibility
                coordinates: coordinates,
            });
        }, 800);
        
        // Jika fungsi onStationChange tersedia, panggil dengan device saat ini
        if (onStationChange) {
            onStationChange(device, index);
        }
    };
    // Handler untuk menampilkan detail sidebar dari tooltip
    const handleShowDetail = (station) => {
        // Tutup tooltip
        setTooltip((prev) => ({ ...prev, visible: false }));
        // Panggil onStationSelect untuk membuka sidebar
        if (onStationSelect) {
            onStationSelect(station);
        }
    };
    // Handler untuk menutup tooltip
    const handleCloseTooltip = () => {
        setTooltip((prev) => ({ ...prev, visible: false }));
    };
    // Helper functions
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
    // Function untuk mendapatkan icon SVG sesuai status - UKURAN DIPERBESAR
    const getStatusIcon = (status) => {
        const iconSize = 27; // Diperbesar dari 20 menjadi 30
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
        // console.log(`Looking for coordinates for station: "${stationName}"`);
        if (!devices || devices.length === 0) {
            // console.log("Devices array is empty or not yet loaded.");
            return null;
        }
        
        // Pertama coba pencarian yang tepat - cek berbagai field name
        let device = devices.find((d) => 
            d.name === stationName || 
            d.device_name === stationName || 
            d.station_name === stationName
        );
        
        // Jika tidak ditemukan, coba pencarian case-insensitive
        if (!device) {
            device = devices.find((d) => 
                (d.name && d.name.toLowerCase() === stationName.toLowerCase()) ||
                (d.device_name && d.device_name.toLowerCase() === stationName.toLowerCase()) ||
                (d.station_name && d.station_name.toLowerCase() === stationName.toLowerCase())
            );
        }
        
        // Jika masih tidak ditemukan, coba pencarian parsial
        if (!device) {
            device = devices.find((d) => {
                const name = d.name || d.device_name || d.station_name;
                if (!name) return false;
                return name.toLowerCase().includes(stationName.toLowerCase()) || 
                       stationName.toLowerCase().includes(name.toLowerCase());
            });
        }
        
        if (device && device.latitude && device.longitude) {
            const coords = [parseFloat(device.longitude), parseFloat(device.latitude)];
            const deviceName = device.name || device.device_name || device.station_name;
            console.log(`Found coordinates for "${stationName}":`, coords);
            console.log(`Matched to device: "${deviceName}"`);
            return coords;
        }
        
        console.warn(`Coordinates not found for station: "${stationName}"`);
        console.log("Available devices:", devices.map(d => d.name || d.device_name || d.station_name || 'unnamed').join(", "));
        return null;
    };
    // Expose handleMapFocus ke window object
    useEffect(() => {
        window.mapboxAutoFocus = handleMapFocus;
        return () => {
            if (window.mapboxAutoFocus) {
                delete window.mapboxAutoFocus;
            }
        };
    }, [tickerData]);
    // Expose handleAutoSwitch ke window object dengan error handling yang robust
    useEffect(() => {
        // Pastikan kita tidak memindahkan fungsi ketika devices atau tickerData berubah
        // Sebagai gantinya kita akan mengakses devices dan tickerData terbaru melalui fungsi
        console.log("=== REGISTERING MAPBOX AUTO SWITCH FUNCTION ===");
        console.log("Map instance available:", !!map.current);
        console.log("Devices available:", devices.length);
        
        // Always re-register the function to ensure it's up to date
        window.mapboxAutoSwitch = (device, index) => {
                const deviceName = device?.name || device?.device_name || device?.station_name;
                console.log("MapboxMap: mapboxAutoSwitch called with device:", deviceName, "index:", index);
                
                try {
                    // Validasi input yang lebih ketat
                    if (!device) {
                        console.error("Error: Device is undefined or null");
                        // Dispatch error event untuk notifikasi ke parent
                        document.dispatchEvent(new CustomEvent('autoSwitchError', {
                            detail: { 
                                error: 'Device is undefined or null',
                                type: 'validation_error',
                                device: device,
                                index: index
                            }
                        }));
                        return;
                    }
                    
                    if (!map.current) {
                        console.error("Error: Map is not initialized yet");
                        // Dispatch error event untuk notifikasi ke parent
                        document.dispatchEvent(new CustomEvent('autoSwitchError', {
                            detail: { 
                                error: 'Map is not initialized yet',
                                type: 'map_not_ready',
                                device: device,
                                index: index
                            }
                        }));
                        return;
                    }
                    
                    // Validasi koordinat sebelum memanggil handleAutoSwitch
                    const hasDirectCoordinates = device.coordinates && Array.isArray(device.coordinates) && device.coordinates.length === 2;
                    const hasLatLng = device.latitude && device.longitude && 
                        !isNaN(parseFloat(device.latitude)) && !isNaN(parseFloat(device.longitude));
                    const hasLookupCoordinates = getStationCoordinates(deviceName);
                    
                    const hasValidCoordinates = hasDirectCoordinates || hasLatLng || hasLookupCoordinates;
                    
                    if (!hasValidCoordinates) {
                        console.error("Error: No valid coordinates found for device:", deviceName);
                        console.log("Device data:", device);
                        console.log("Direct coordinates:", device.coordinates);
                        console.log("Lat/Lng:", device.latitude, device.longitude);
                        console.log("Lookup coordinates:", hasLookupCoordinates);
                        document.dispatchEvent(new CustomEvent('autoSwitchError', {
                            detail: { 
                                error: 'No valid coordinates found',
                                type: 'coordinate_error',
                                device: device,
                                index: index
                            }
                        }));
                        return;
                    }
                    
                    // Akses devices terbaru langsung dari state
                    handleAutoSwitch(device, index);
                    
                    // Dispatch success event
                    document.dispatchEvent(new CustomEvent('autoSwitchSuccess', {
                        detail: { 
                            device: device,
                            index: index,
                            timestamp: Date.now()
                        }
                    }));
                    
                } catch (error) {
                    console.error("Unexpected error in mapboxAutoSwitch:", error);
                    // Dispatch error event untuk notifikasi ke parent
                        document.dispatchEvent(new CustomEvent('autoSwitchError', {
                            detail: { 
                                error: error.message,
                                type: 'unexpected_error',
                                device: device,
                                index: index,
                                stack: error.stack
                            }
                        }));
                }
            };
        
        // Log untuk debugging
        console.log("Window mapboxAutoSwitch status:", typeof window.mapboxAutoSwitch === 'function' ? "Available" : "Not available");
        console.log("Available devices:", devices.length);
        console.log("Available ticker data:", tickerData?.length || 0);
        console.log("=== MAPBOX AUTO SWITCH FUNCTION REGISTERED ===");
        
        return () => {
            // Jangan hapus fungsi mapboxAutoSwitch pada setiap perubahan dependencies
            // Hanya hapus ketika komponen unmount
            // Ini akan ditangani di useEffect cleanup level teratas
        };
    }, [devices, tickerData]);
    
    // Pastikan membersihkan window.mapboxAutoSwitch saat komponen unmount
    useEffect(() => {
        return () => {
            if (window.mapboxAutoSwitch) {
                delete window.mapboxAutoSwitch;
                console.log("mapboxAutoSwitch function removed from window object during unmount");
            }
        };
    }, []);
    // Initialize map
    useEffect(() => {
        if (!mapboxgl.accessToken) {
            mapboxgl.accessToken =
            import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        }
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [112.5, -7.5],
            zoom: 8,
            pitch: 45,
            bearing: -17.6,
            antialias: true,
        });
        map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");
        
        // Tambahkan event listener untuk interaksi peta
        const emitUserInteraction = (source) => {
            console.log(`Map interaction detected: ${source}`);
            // Trigger custom event to stop auto switch
            const event = new CustomEvent("userInteraction", {
                detail: { source: source },
            });
            document.dispatchEvent(event);
        };
        
        // Tambahkan event listener untuk drag
        map.current.on("dragstart", () => emitUserInteraction("mapDrag"));
        // Tambahkan event listener untuk zoom
        map.current.on("zoomstart", () => emitUserInteraction("mapZoom"));
        // Tambahkan event listener untuk click pada peta (bukan marker)
        map.current.on("click", () => emitUserInteraction("mapClick"));
        
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);
    // Listen for auto switch events
    useEffect(() => {
        const handleAutoSwitchActivated = (event) => {
            console.log("MapboxMap: Auto switch activated event received", event.detail);
            
            // Verifikasi apakah window.mapboxAutoSwitch berfungsi
            if (typeof window.mapboxAutoSwitch !== 'function') {
                console.error("WARNING: mapboxAutoSwitch function not available when auto switch activated");
                
                // Re-register fungsi jika hilang
                if (map.current) {
                    console.log("Re-registering mapboxAutoSwitch function");
                    window.mapboxAutoSwitch = (station, index) => {
                        console.log("Re-registered mapboxAutoSwitch called with:", station?.name);
                        handleAutoSwitch(station, index);
                    };
                }
            }
            
            // Kirim event konfirmasi kembali ke AutoSwitchToggle
            document.dispatchEvent(
                new CustomEvent("mapboxReadyForAutoSwitch", {
                    detail: { 
                        ready: true, 
                        devicesCount: devices.length,
                        hasMapInstance: !!map.current
                    }
                })
            );
        };
        
        const handleAutoSwitchDeactivated = (event) => {
            console.log("MapboxMap: Auto switch deactivated event received", event.detail);
        };
        
        document.addEventListener("autoSwitchActivated", handleAutoSwitchActivated);
        document.addEventListener("autoSwitchDeactivated", handleAutoSwitchDeactivated);
        
        return () => {
            document.removeEventListener("autoSwitchActivated", handleAutoSwitchActivated);
            document.removeEventListener("autoSwitchDeactivated", handleAutoSwitchDeactivated);
        };
    }, [devices]);
    
    // Update markers when tickerData changes
    useEffect(() => {
        if (!map.current || !tickerData || !devices.length) return;
        // Hapus marker yang ada
        markersRef.current.forEach((marker) => {
            if (marker && marker.remove) {
                marker.remove();
            }
        });
        markersRef.current = [];
        tickerData.forEach((station) => {
            const coordinates = getStationCoordinates(station.name);
            if (coordinates) {
                try {
                    const markerEl = document.createElement("div");
                    markerEl.className = "custom-marker";
                    // UKURAN MARKER DIPERBESAR
                    markerEl.style.width = "27px"; // Diperbesar dari 20px menjadi 30px
                    markerEl.style.height = "27px"; // Diperbesar dari 20px menjadi 30px
                    markerEl.style.borderRadius = "50%";
                    markerEl.style.backgroundColor = getStatusColor(station.status);
                    markerEl.style.border = "3px solid white"; // Diperbesar dari 2px menjadi 3px
                    markerEl.style.boxShadow = "0 4px 8px rgba(0,0,0,0.4)";
                    markerEl.style.cursor = "pointer";
                    markerEl.style.zIndex = "10";
                    markerEl.style.display = "flex";
                    markerEl.style.alignItems = "center";
                    markerEl.style.justifyContent = "center";
                    // Tambahkan icon sesuai status
                    const iconSvg = getStatusIcon(station.status);
                    markerEl.innerHTML = iconSvg;
                    // Tambahkan pulse animation untuk status alert
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
                    const marker = new mapboxgl.Marker(markerEl).setLngLat(coordinates).addTo(map.current);
                    markersRef.current.push(marker);
                    // Event untuk klik marker
                    markerEl.addEventListener("click", (e) => {
                        e.stopPropagation(); // Mencegah event bubbling
                        // Animasi flyTo
                        map.current.flyTo({
                            center: coordinates,
                            zoom: 12,
                            pitch: 45,
                            bearing: -17.6,
                            speed: 1.2,
                            curve: 1.4,
                            easing: (t) => t,
                            essential: true,
                        });
                        // Tampilkan tooltip
                        setTooltip({
                            visible: true,
                            station: station,
                            coordinates: coordinates,
                        });
                        // Trigger custom event to stop auto switch
                        const event = new CustomEvent("userInteraction", {
                            detail: { source: "mapMarker", stationId: station.id },
                        });
                        document.dispatchEvent(event);
                    });
                } catch (error) {
                    console.error("Error creating marker for station:", station.name, error);
                }
            }
        });
    }, [tickerData, devices]);
    // Event listener untuk klik di luar tooltip
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
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [tooltip.visible]);
    return (
        <div className="w-full h-screen overflow-hidden relative z-0">
            <div ref={mapContainer} className="w-full h-full relative z-0" />
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
        </div>
    );
};
export default MapboxMap;
