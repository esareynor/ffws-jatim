import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-CILUtiK9.js';
import { m as mapboxgl } from './mapbox-vendor-C_nsdMnr.js';

const AutoSwitchToggle = ({
  tickerData,
  onStationChange,
  currentStationIndex,
  onAutoSwitchToggle,
  interval = 5e3,
  stopDelay = 5e3
}) => {
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const [currentIndex, setCurrentIndex] = reactExports.useState(currentStationIndex ?? 0);
  const [isPendingStop, setIsPendingStop] = reactExports.useState(false);
  const [isAtMarker, setIsAtMarker] = reactExports.useState(true);
  const intervalRef = reactExports.useRef(null);
  const stopTimeoutRef = reactExports.useRef(null);
  const tickerDataRef = reactExports.useRef(tickerData);
  reactExports.useEffect(() => {
    const sortedData = tickerData ? [...tickerData].sort((a, b) => a.id - b.id) : [];
    tickerDataRef.current = sortedData;
    if (sortedData && sortedData.length > 0) {
      setCurrentIndex((prev) => prev >= sortedData.length ? 0 : prev);
    }
  }, [tickerData]);
  reactExports.useEffect(() => {
    if (isPlaying && (!tickerData || tickerData.length === 0)) {
      console.log("Ticker data is empty, stopping auto switch");
      stopAutoSwitchImmediately();
    }
  }, [tickerData, isPlaying]);
  const tick = reactExports.useCallback(() => {
    const currentTickerData = tickerDataRef.current;
    if (!currentTickerData || currentTickerData.length === 0) {
      console.warn("Tick called but no ticker data available");
      return;
    }
    setIsAtMarker(false);
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % currentTickerData.length;
      const nextStation = currentTickerData[nextIndex];
      console.log(`Tick: Switching from index ${prevIndex} to ${nextIndex}, station: ${nextStation?.name}`);
      if (typeof window.mapboxAutoSwitch === "function" && nextStation) {
        console.log("Auto switching to next station:", nextStation.name);
        try {
          window.mapboxAutoSwitch(nextStation, nextIndex);
          setTimeout(() => {
            setIsAtMarker(true);
          }, 1e3);
        } catch (error) {
          console.error("Error calling mapboxAutoSwitch:", error);
          setIsAtMarker(true);
        }
      } else {
        console.warn("mapboxAutoSwitch is not available or station is undefined");
        setIsAtMarker(true);
      }
      if (onStationChange) {
        onStationChange(nextStation, nextIndex);
      }
      return nextIndex;
    });
  }, [onStationChange]);
  const stopAutoSwitchImmediately = reactExports.useCallback(() => {
    console.log("Stopping auto switch immediately");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    setIsPlaying(false);
    setIsPendingStop(false);
    setIsAtMarker(true);
    document.dispatchEvent(
      new CustomEvent("autoSwitchDeactivated", {
        detail: { active: false }
      })
    );
    if (onAutoSwitchToggle) {
      onAutoSwitchToggle(false);
    }
  }, [onAutoSwitchToggle]);
  reactExports.useEffect(() => {
    console.log("AutoSwitchToggle effect running, isPlaying:", isPlaying);
    if (intervalRef.current) {
      console.log("Clearing existing interval");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (isPlaying) {
      if (stopTimeoutRef.current) {
        console.log("Clearing pending stop timeout");
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
        setIsPendingStop(false);
      }
      if (tickerDataRef.current && tickerDataRef.current.length > 0) {
        const currentData = tickerDataRef.current;
        const firstStation = currentData[currentIndex];
        setIsAtMarker(false);
        if (typeof window.mapboxAutoSwitch === "function" && firstStation) {
          console.log("Initial auto switch to station:", firstStation.name, "at index:", currentIndex);
          try {
            window.mapboxAutoSwitch(firstStation, currentIndex);
            setTimeout(() => {
              setIsAtMarker(true);
            }, 1e3);
          } catch (error) {
            console.error("Error on initial switch:", error);
            setIsAtMarker(true);
          }
        } else {
          console.warn("Cannot perform initial switch: mapboxAutoSwitch not available or no station data");
          setIsAtMarker(true);
        }
        tick();
        console.log(`Starting new interval with ${interval}ms delay`);
        intervalRef.current = setInterval(() => tick(), interval);
        document.dispatchEvent(
          new CustomEvent("autoSwitchActivated", {
            detail: { active: true, currentIndex, stationCount: currentData.length }
          })
        );
      } else {
        console.warn("Cannot start auto switch: No ticker data available");
        stopAutoSwitchImmediately();
      }
    } else if (!isPendingStop) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("Auto switch interval cleared due to isPlaying = false");
        document.dispatchEvent(
          new CustomEvent("autoSwitchDeactivated", {
            detail: { active: false }
          })
        );
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
    };
  }, [isPlaying, isPendingStop, interval, tick, stopAutoSwitchImmediately]);
  const startAutoSwitch = () => {
    const currentData = tickerDataRef.current;
    if (!currentData || currentData.length === 0) {
      console.warn("Cannot start auto switch: No ticker data available");
      return;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
      setIsPendingStop(false);
    }
    console.log("Auto switch starting. Available stations:", currentData.length);
    if (currentData.length > 0) {
      console.log("Station names:", currentData.map((s) => s.name).join(", "));
    }
    console.log("Starting with station index:", currentIndex);
    if (typeof window.mapboxAutoSwitch !== "function") {
      console.warn("mapboxAutoSwitch function is not available on window object!");
      console.log("Window object functions:", Object.keys(window).filter((key) => typeof window[key] === "function"));
    }
    setIsPlaying(true);
  };
  const stopAutoSwitch = () => {
    if (isPendingStop) {
      console.log("Already pending stop, ignoring stopAutoSwitch call");
      return;
    }
    console.log("Auto switch will stop in", stopDelay / 1e3, "seconds");
    setIsPendingStop(true);
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
    }
    stopTimeoutRef.current = setTimeout(() => {
      stopAutoSwitchImmediately();
    }, stopDelay);
  };
  const togglePlayPause = () => {
    console.log("Toggle play/pause called. Current state - isPlaying:", isPlaying, "isPendingStop:", isPendingStop);
    if (isPendingStop) {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
      setIsPendingStop(false);
      console.log("Auto switch stop cancelled, continuing");
      return;
    }
    const newIsPlaying = !isPlaying;
    console.log("Setting isPlaying to:", newIsPlaying);
    if (newIsPlaying) {
      startAutoSwitch();
    } else {
      stopAutoSwitchImmediately();
    }
    if (onAutoSwitchToggle) {
      onAutoSwitchToggle(newIsPlaying);
    }
  };
  reactExports.useEffect(() => {
    if (currentStationIndex !== void 0 && currentStationIndex !== currentIndex) {
      console.log("Syncing with external currentStationIndex:", currentStationIndex);
      setCurrentIndex(currentStationIndex);
      if (isPlaying && tickerDataRef.current && tickerDataRef.current.length > 0) {
        const station = tickerDataRef.current[currentStationIndex];
        if (station && typeof window.mapboxAutoSwitch === "function") {
          console.log("Auto updating to new index station:", station.name);
          setIsAtMarker(false);
          window.mapboxAutoSwitch(station, currentStationIndex);
          setTimeout(() => {
            setIsAtMarker(true);
          }, 1e3);
        }
      }
    }
  }, [currentStationIndex]);
  reactExports.useEffect(() => {
    const handleUserInteraction = (event) => {
      if (isPlaying && !isPendingStop) {
        console.log("User interaction detected, starting stop delay:", event.detail);
        stopAutoSwitch();
        const filterButton = document.querySelector('[aria-label="Buka Filter"]');
        if (filterButton) {
          filterButton.style.backgroundColor = "white";
        }
      }
    };
    document.addEventListener("userInteraction", handleUserInteraction);
    const logAutoSwitchEvent = (event) => {
      console.log("Auto switch event received:", event.type, event.detail);
    };
    const handleMapboxReady = (event) => {
      console.log("Received mapboxReadyForAutoSwitch event:", event.detail);
      if (isPlaying && !intervalRef.current && tickerDataRef.current?.length > 0) {
        console.log("Restarting tick interval after mapbox confirmation");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsAtMarker(false);
        tick();
        intervalRef.current = setInterval(() => tick(), interval);
      }
    };
    document.addEventListener("autoSwitchActivated", logAutoSwitchEvent);
    document.addEventListener("autoSwitchDeactivated", logAutoSwitchEvent);
    document.addEventListener("mapboxReadyForAutoSwitch", handleMapboxReady);
    return () => {
      document.removeEventListener("userInteraction", handleUserInteraction);
      document.removeEventListener("autoSwitchActivated", logAutoSwitchEvent);
      document.removeEventListener("autoSwitchDeactivated", logAutoSwitchEvent);
      document.removeEventListener("mapboxReadyForAutoSwitch", handleMapboxReady);
    };
  }, [isPlaying, isPendingStop, interval, tick]);
  const hasData = tickerData && tickerData.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm border border-gray-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2 sm:mb-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-800", children: "Auto Switch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        isPlaying && !isPendingStop && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2.5 h-2.5 rounded-full ${isAtMarker ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-ping"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${isAtMarker ? "text-green-600" : "text-yellow-600"}`, children: isAtMarker ? "At Marker" : "Moving..." })
        ] }),
        isPendingStop && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-yellow-600", children: "Stopping..." })
        ] }),
        !isPlaying && !isPendingStop && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 bg-gray-400 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-gray-500", children: "Inactive" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: togglePlayPause,
        disabled: !hasData,
        className: `relative inline-flex items-center h-7 rounded-full transition-all duration-200 ease-in-out focus:outline-none select-none ${!hasData ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`,
        title: isPendingStop ? "Cancel stop" : isPlaying ? "Stop Auto Switch" : "Start Auto Switch",
        "aria-label": isPendingStop ? "Cancel auto switch stop" : isPlaying ? "Stop auto switch" : "Start auto switch",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `relative w-12 h-7 rounded-full transition-all duration-200 ease-in-out ${isPendingStop ? "bg-yellow-400" : isPlaying ? "bg-green-500" : "bg-gray-300"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-200 ease-in-out ${isPlaying || isPendingStop ? "translate-x-5" : "translate-x-0"} ${isPendingStop ? "animate-pulse" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-md border border-gray-200" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-gradient-to-b from-white/90 to-transparent" })
                ]
              }
            )
          }
        )
      }
    )
  ] });
};

const AutoSwitchToggle$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: AutoSwitchToggle
}, Symbol.toStringTag, { value: 'Module' }));

const MapTooltip = ({ map, station, isVisible, coordinates, onShowDetail, onClose }) => {
  const popupRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!map || !isVisible || !station || !coordinates) {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      return;
    }
    if (popupRef.current) {
      popupRef.current.remove();
    }
    const getStatusColor = (status) => {
      switch (status) {
        case "safe":
          return "bg-green-500";
        case "warning":
          return "bg-yellow-500";
        case "alert":
          return "bg-red-500";
        default:
          return "bg-gray-500";
      }
    };
    const getStatusText = (status) => {
      switch (status) {
        case "safe":
          return "Aman";
        case "warning":
          return "Waspada";
        case "alert":
          return "Bahaya";
        default:
          return "Tidak Diketahui";
      }
    };
    const popupContent = document.createElement("div");
    popupContent.className = "map-tooltip-content";
    popupContent.innerHTML = `
      <div class="tooltip-header">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full ${getStatusColor(station.status)} mr-2"></div>
          <h3 class="font-bold text-gray-900">${station.name.replace("Stasiun ", "")}</h3>
        </div>
        <button class="tooltip-close-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="tooltip-level">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Level Air:</span>
          <div class="text-right">
            <span class="font-semibold text-lg block">${station.value}</span>
            <span class="text-xs text-gray-500">${station.unit}</span>
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Status: ${getStatusText(station.status)}
        </div>
      </div>
      
      <div class="tooltip-info">
        <div class="text-xs text-gray-500 mb-1">ID: ${station.id}</div>
        <div class="text-xs text-gray-500 truncate">${station.location}</div>
      </div>
      
      <button class="tooltip-detail-btn">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Lihat Detail
      </button>
    `;
    const style = document.createElement("style");
    style.textContent = `
      .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .map-tooltip-content {
        padding: 12px;
        width: 240px;
      }
      
      .tooltip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .tooltip-header h3 {
        font-size: 14px;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
      }
      
      .tooltip-close-btn {
        background: none !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        color: #9CA3AF;
        cursor: pointer;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        height: auto;
        font-weight: bold;
      }
      
      .tooltip-close-btn svg {
        stroke-width: 3;
        font-weight: bold;
      }
      
      .tooltip-close-btn:hover {
        color: #4B5563;
        background: none !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }
      
      .tooltip-close-btn:focus {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
      }
      
      .tooltip-level {
        margin-bottom: 10px;
      }
      
      .tooltip-info {
        margin-bottom: 12px;
        padding-bottom: 10px;
      }
      
      .tooltip-detail-btn {
        width: 100%;
        background-color: #3B82F6;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .tooltip-detail-btn:hover {
        background-color: #2563EB;
      }
    `;
    document.head.appendChild(style);
    popupRef.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: [0, -30]
      // Offset untuk menempatkan popup di atas marker
    }).setLngLat(coordinates).setDOMContent(popupContent).addTo(map);
    const detailBtn = popupContent.querySelector(".tooltip-detail-btn");
    if (detailBtn) {
      detailBtn.addEventListener("click", () => {
        onShowDetail(station);
      });
    }
    const closeBtn = popupContent.querySelector(".tooltip-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        onClose();
      });
    }
    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map, isVisible, station, coordinates, onShowDetail, onClose]);
  return null;
};

const maptooltip = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: MapTooltip
}, Symbol.toStringTag, { value: 'Module' }));

export { AutoSwitchToggle as A, AutoSwitchToggle$1 as a, maptooltip as m };
