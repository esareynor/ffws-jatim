const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["js/device-components-CA_EA_AT.js","js/react-vendor-CILUtiK9.js","js/mapbox-vendor-C_nsdMnr.js","css/mapbox-vendor-BVO_c2QR.css","js/vendor-HC16imTC.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from './common-components-KO07M7D3.js';
import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-CILUtiK9.js';
import { m as mapboxgl } from './mapbox-vendor-C_nsdMnr.js';
import { f as fetchDevices } from './services-BHoYLIlq.js';
import './device-components-CA_EA_AT.js';
import './charts-vendor-Tn6b3eh3.js';
import './vendor-HC16imTC.js';

const MapTooltip = reactExports.lazy(() => __vitePreload(() => import('./device-components-CA_EA_AT.js').then(n => n.m),true              ?__vite__mapDeps([0,1,2,3,4]):void 0));
const MapboxMap = ({ tickerData, onStationSelect, onMapFocus, onStationChange }) => {
  const mapContainer = reactExports.useRef(null);
  const map = reactExports.useRef(null);
  const markersRef = reactExports.useRef([]);
  const [selectedStationCoords, setSelectedStationCoords] = reactExports.useState(null);
  const [devices, setDevices] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const loadDevices = async () => {
      try {
        const devicesData = await fetchDevices();
        console.log("MapboxMap: Fetched devices:", devicesData?.length || 0);
        console.log("MapboxMap: First device structure:", devicesData?.[0]);
        setDevices(devicesData);
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      }
    };
    loadDevices();
  }, []);
  const [tooltip, setTooltip] = reactExports.useState({
    visible: false,
    station: null,
    coordinates: null
  });
  reactExports.useEffect(() => {
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
      essential: true
    });
    setTimeout(() => {
      if (tickerData) {
        const station = tickerData.find((s) => s.id === stationId);
        if (station) {
          const coordinates = getStationCoordinates(station.name);
          if (coordinates) {
            setTooltip({
              visible: true,
              station,
              coordinates
            });
          }
        }
      }
    }, 800);
  };
  const handleAutoSwitch = (device, index) => {
    console.log(`handleAutoSwitch called with device: ${device?.name || device?.device_name || device?.station_name || "undefined"}, index: ${index}`);
    if (!map.current || !device) {
      console.warn("Map or device not available for auto switch");
      return;
    }
    let coordinates = null;
    try {
      if (device.coordinates && Array.isArray(device.coordinates)) {
        coordinates = device.coordinates;
        console.log("Using direct coordinates from device object:", coordinates);
      } else if (device.latitude && device.longitude) {
        coordinates = [parseFloat(device.longitude), parseFloat(device.latitude)];
        console.log("Using lat/lng from device object:", coordinates);
      } else {
        const deviceName2 = device.name || device.device_name || device.station_name;
        coordinates = getStationCoordinates(deviceName2);
        console.log("Looked up coordinates by name:", coordinates);
      }
      if (!coordinates) {
        const deviceName2 = device.name || device.device_name || device.station_name;
        console.warn("No coordinates found for device:", deviceName2);
        const deviceLowerName = deviceName2.toLowerCase();
        console.log("Attempting fuzzy match with devices:", devices.map((d) => d.name || d.device_name || d.station_name));
        const matchedDevice = devices.find((d) => {
          const dName = d.name || d.device_name || d.station_name;
          return dName.toLowerCase() === deviceLowerName || dName.toLowerCase().includes(deviceLowerName) || deviceLowerName.includes(dName.toLowerCase());
        });
        if (matchedDevice && matchedDevice.latitude && matchedDevice.longitude) {
          coordinates = [parseFloat(matchedDevice.longitude), parseFloat(matchedDevice.latitude)];
          console.log("Found coordinates through fuzzy matching:", coordinates);
        } else {
          console.error("Still could not find coordinates after fuzzy matching");
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
    map.current.flyTo({
      center: coordinates,
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
      speed: 1.2,
      curve: 1.4,
      easing: (t) => t,
      essential: true
    });
    setTimeout(() => {
      setTooltip({
        visible: true,
        station: device,
        // Keep as station for tooltip compatibility
        coordinates
      });
    }, 800);
    if (onStationChange) {
      onStationChange(device, index);
    }
  };
  const handleShowDetail = (station) => {
    setTooltip((prev) => ({ ...prev, visible: false }));
    if (onStationSelect) {
      onStationSelect(station);
    }
  };
  const handleCloseTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };
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
  const getStationCoordinates = (stationName) => {
    if (!devices || devices.length === 0) {
      return null;
    }
    let device = devices.find(
      (d) => d.name === stationName || d.device_name === stationName || d.station_name === stationName
    );
    if (!device) {
      device = devices.find(
        (d) => d.name && d.name.toLowerCase() === stationName.toLowerCase() || d.device_name && d.device_name.toLowerCase() === stationName.toLowerCase() || d.station_name && d.station_name.toLowerCase() === stationName.toLowerCase()
      );
    }
    if (!device) {
      device = devices.find((d) => {
        const name = d.name || d.device_name || d.station_name;
        if (!name) return false;
        return name.toLowerCase().includes(stationName.toLowerCase()) || stationName.toLowerCase().includes(name.toLowerCase());
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
    console.log("Available devices:", devices.map((d) => d.name || d.device_name || d.station_name || "unnamed").join(", "));
    return null;
  };
  reactExports.useEffect(() => {
    window.mapboxAutoFocus = handleMapFocus;
    return () => {
      if (window.mapboxAutoFocus) {
        delete window.mapboxAutoFocus;
      }
    };
  }, [tickerData]);
  reactExports.useEffect(() => {
    console.log("=== REGISTERING MAPBOX AUTO SWITCH FUNCTION ===");
    console.log("Map instance available:", !!map.current);
    console.log("Devices available:", devices.length);
    window.mapboxAutoSwitch = (device, index) => {
      const deviceName = device?.name || device?.device_name || device?.station_name;
      console.log("MapboxMap: mapboxAutoSwitch called with device:", deviceName, "index:", index);
      try {
        if (!device) {
          console.error("Error: Device is undefined or null");
          document.dispatchEvent(new CustomEvent("autoSwitchError", {
            detail: {
              error: "Device is undefined or null",
              type: "validation_error",
              device,
              index
            }
          }));
          return;
        }
        if (!map.current) {
          console.error("Error: Map is not initialized yet");
          document.dispatchEvent(new CustomEvent("autoSwitchError", {
            detail: {
              error: "Map is not initialized yet",
              type: "map_not_ready",
              device,
              index
            }
          }));
          return;
        }
        const hasDirectCoordinates = device.coordinates && Array.isArray(device.coordinates) && device.coordinates.length === 2;
        const hasLatLng = device.latitude && device.longitude && !isNaN(parseFloat(device.latitude)) && !isNaN(parseFloat(device.longitude));
        const hasLookupCoordinates = getStationCoordinates(deviceName);
        const hasValidCoordinates = hasDirectCoordinates || hasLatLng || hasLookupCoordinates;
        if (!hasValidCoordinates) {
          console.error("Error: No valid coordinates found for device:", deviceName);
          console.log("Device data:", device);
          console.log("Direct coordinates:", device.coordinates);
          console.log("Lat/Lng:", device.latitude, device.longitude);
          console.log("Lookup coordinates:", hasLookupCoordinates);
          document.dispatchEvent(new CustomEvent("autoSwitchError", {
            detail: {
              error: "No valid coordinates found",
              type: "coordinate_error",
              device,
              index
            }
          }));
          return;
        }
        handleAutoSwitch(device, index);
        document.dispatchEvent(new CustomEvent("autoSwitchSuccess", {
          detail: {
            device,
            index,
            timestamp: Date.now()
          }
        }));
      } catch (error) {
        console.error("Unexpected error in mapboxAutoSwitch:", error);
        document.dispatchEvent(new CustomEvent("autoSwitchError", {
          detail: {
            error: error.message,
            type: "unexpected_error",
            device,
            index,
            stack: error.stack
          }
        }));
      }
    };
    console.log("Window mapboxAutoSwitch status:", typeof window.mapboxAutoSwitch === "function" ? "Available" : "Not available");
    console.log("Available devices:", devices.length);
    console.log("Available ticker data:", tickerData?.length || 0);
    console.log("=== MAPBOX AUTO SWITCH FUNCTION REGISTERED ===");
    return () => {
    };
  }, [devices, tickerData]);
  reactExports.useEffect(() => {
    return () => {
      if (window.mapboxAutoSwitch) {
        delete window.mapboxAutoSwitch;
        console.log("mapboxAutoSwitch function removed from window object during unmount");
      }
    };
  }, []);
  reactExports.useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = "pk.eyJ1IjoiZGl0b2ZhdGFoaWxsYWgxIiwiYSI6ImNtZjNveGloczAwNncya3E1YzdjcTRtM3MifQ.kIf5rscGYOzvvBcZJ41u8g";
    }
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [112.5, -7.5],
      zoom: 8,
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });
    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");
    const emitUserInteraction = (source) => {
      console.log(`Map interaction detected: ${source}`);
      const event = new CustomEvent("userInteraction", {
        detail: { source }
      });
      document.dispatchEvent(event);
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
  reactExports.useEffect(() => {
    const handleAutoSwitchActivated = (event) => {
      console.log("MapboxMap: Auto switch activated event received", event.detail);
      if (typeof window.mapboxAutoSwitch !== "function") {
        console.error("WARNING: mapboxAutoSwitch function not available when auto switch activated");
        if (map.current) {
          console.log("Re-registering mapboxAutoSwitch function");
          window.mapboxAutoSwitch = (station, index) => {
            console.log("Re-registered mapboxAutoSwitch called with:", station?.name);
            handleAutoSwitch(station, index);
          };
        }
      }
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
  reactExports.useEffect(() => {
    if (!map.current || !tickerData || !devices.length) return;
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
          const marker = new mapboxgl.Marker(markerEl).setLngLat(coordinates).addTo(map.current);
          markersRef.current.push(marker);
          markerEl.addEventListener("click", (e) => {
            e.stopPropagation();
            map.current.flyTo({
              center: coordinates,
              zoom: 12,
              pitch: 45,
              bearing: -17.6,
              speed: 1.2,
              curve: 1.4,
              easing: (t) => t,
              essential: true
            });
            setTooltip({
              visible: true,
              station,
              coordinates
            });
            const event = new CustomEvent("userInteraction", {
              detail: { source: "mapMarker", stationId: station.id }
            });
            document.dispatchEvent(event);
          });
        } catch (error) {
          console.error("Error creating marker for station:", station.name, error);
        }
      }
    });
  }, [tickerData, devices]);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltip.visible && !event.target.closest(".custom-marker") && !event.target.closest(".mapboxgl-popup-content") && !event.target.closest(".map-tooltip")) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [tooltip.visible]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full h-screen overflow-hidden relative z-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: mapContainer, className: "w-full h-full relative z-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MapTooltip,
      {
        map: map.current,
        station: tooltip.station,
        isVisible: tooltip.visible,
        coordinates: tooltip.coordinates,
        onShowDetail: handleShowDetail,
        onClose: handleCloseTooltip
      }
    ) })
  ] });
};

export { MapboxMap as default };
