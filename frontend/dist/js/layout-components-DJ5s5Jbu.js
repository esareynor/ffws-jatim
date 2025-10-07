const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["js/common-components-BNIdnCuC.js","js/react-vendor-CILUtiK9.js","js/mapbox-vendor-C_nsdMnr.js","css/mapbox-vendor-BVO_c2QR.css","js/vendor-HC16imTC.js","js/services-BvR663xD.js","js/device-components-CA_EA_AT.js","js/charts-vendor-Tn6b3eh3.js","js/MapboxMap-BLNZ3bnw.js","js/sensor-components-PLz1u0tk.js"])))=>i.map(i=>d[i]);
import { _ as __vitePreload } from './common-components-BNIdnCuC.js';
import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-CILUtiK9.js';

const GoogleMapsSearchbar = reactExports.lazy(() => __vitePreload(() => import('./common-components-BNIdnCuC.js').then(n => n.G),true              ?__vite__mapDeps([0,1,2,3,4,5,6,7]):void 0));
const MapboxMap = reactExports.lazy(() => __vitePreload(() => import('./MapboxMap-BLNZ3bnw.js'),true              ?__vite__mapDeps([8,0,1,2,3,4,5,6,7]):void 0));
const FloatingLegend = reactExports.lazy(() => __vitePreload(() => import('./common-components-BNIdnCuC.js').then(n => n.F),true              ?__vite__mapDeps([0,1,2,3,4,5,6,7]):void 0));
const FloodRunningBar = reactExports.lazy(() => __vitePreload(() => import('./common-components-BNIdnCuC.js').then(n => n.a),true              ?__vite__mapDeps([0,1,2,3,4,5,6,7]):void 0));
const StationDetail = reactExports.lazy(() => __vitePreload(() => import('./sensor-components-PLz1u0tk.js').then(n => n.S),true              ?__vite__mapDeps([9,1,2,3,4,0,5,6,7]):void 0));
const DetailPanel = reactExports.lazy(() => __vitePreload(() => import('./sensor-components-PLz1u0tk.js').then(n => n.D),true              ?__vite__mapDeps([9,1,2,3,4,0,5,6,7]):void 0));
const FilterPanel = reactExports.lazy(() => __vitePreload(() => import('./common-components-BNIdnCuC.js').then(n => n.b),true              ?__vite__mapDeps([0,1,2,3,4,5,6,7]):void 0));
reactExports.lazy(() => __vitePreload(() => import('./device-components-CA_EA_AT.js').then(n => n.a),true              ?__vite__mapDeps([6,1,2,3,4]):void 0));
const Layout = ({ children }) => {
  const [tickerData, setTickerData] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedStation, setSelectedStation] = reactExports.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = reactExports.useState(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = reactExports.useState(false);
  const [currentStationIndex, setCurrentStationIndex] = reactExports.useState(0);
  const [isAutoSwitchOn, setIsAutoSwitchOn] = reactExports.useState(false);
  const mapRef = reactExports.useRef(null);
  const [isFilterOpen, setIsFilterOpen] = reactExports.useState(false);
  const handleSearch = reactExports.useCallback((query) => {
    setSearchQuery(query);
  }, []);
  const handleStationSelect = reactExports.useCallback((station) => {
    setSelectedStation(station);
    setIsSidebarOpen(true);
  }, []);
  reactExports.useCallback((isOn) => {
    console.log("=== LAYOUT: AUTO SWITCH TOGGLE REQUESTED ===");
    console.log("Requested state:", isOn);
    console.log("Current isAutoSwitchOn:", isAutoSwitchOn);
    console.log("Current tickerData length:", tickerData?.length || 0);
    const timeoutId = setTimeout(() => {
      console.log("Setting isAutoSwitchOn to:", isOn);
      setIsAutoSwitchOn(isOn);
      if (!isOn) {
        console.log("Auto switch OFF - closing sidebar");
        setIsSidebarOpen(false);
        setSelectedStation(null);
      } else {
        console.log("Auto switch ON - closing detail panel");
        setIsDetailPanelOpen(false);
      }
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [isAutoSwitchOn, tickerData]);
  const handleCloseStationDetail = reactExports.useCallback(() => {
    setSelectedStation(null);
    setIsSidebarOpen(false);
  }, []);
  const handleToggleDetailPanel = reactExports.useCallback(() => {
    if (isDetailPanelOpen) {
      handleCloseDetailPanel();
    } else {
      setIsDetailPanelOpen(true);
    }
  }, [isDetailPanelOpen]);
  const handleCloseDetailPanel = reactExports.useCallback(() => {
    setIsDetailPanelOpen(false);
  }, []);
  reactExports.useCallback((layerId, enabled) => {
    console.log(`Layer ${layerId} toggled: ${enabled}`);
  }, []);
  const handleAutoSwitch = reactExports.useCallback((station, index) => {
    setCurrentStationIndex(index);
    setSelectedStation(station);
    setIsSidebarOpen(true);
  }, []);
  reactExports.useCallback(
    (device, index) => {
      const deviceName = device?.name || device?.device_name || device?.station_name;
      console.log("Layout: Device change requested:", deviceName, "index:", index);
      if (!device || index === void 0) {
        console.warn("Layout: Invalid device or index provided");
        return;
      }
      const timeoutId = setTimeout(() => {
        setCurrentStationIndex(index);
        setSelectedStation(device);
        setIsSidebarOpen(true);
        if (isAutoSwitchOn) {
          setIsDetailPanelOpen(false);
        }
      }, 10);
      if (window.mapboxAutoSwitch) {
        try {
          window.mapboxAutoSwitch(device, index);
        } catch (error) {
          console.error("Layout: Error calling mapboxAutoSwitch:", error);
        }
      }
      return () => clearTimeout(timeoutId);
    },
    [isAutoSwitchOn]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen bg-gray-50 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full relative z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      reactExports.Suspense,
      {
        fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full bg-gray-200 animate-pulse flex items-center justify-center", children: "Loading Map..." }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          MapboxMap,
          {
            ref: mapRef,
            tickerData,
            onStationSelect: handleStationSelect,
            onAutoSwitch: handleAutoSwitch,
            isAutoSwitchOn,
            onCloseSidebar: () => {
              if (!isAutoSwitchOn) {
                setIsSidebarOpen(false);
                setSelectedStation(null);
              }
            }
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 left-4 right-4 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 bg-white/80 rounded-lg animate-pulse" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleMapsSearchbar, { onSearch: handleSearch, placeholder: "Cari stasiun monitoring banjir..." }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-white/80 animate-pulse" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      FloodRunningBar,
      {
        onDataUpdate: setTickerData,
        onStationSelect: handleStationSelect,
        isSidebarOpen
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 right-2 sm:bottom-4 sm:right-2 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 bg-white/80 rounded animate-pulse" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingLegend, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      reactExports.Suspense,
      {
        fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-lg p-8 animate-pulse", children: "Loading..." }) }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          StationDetail,
          {
            selectedStation,
            onClose: handleCloseStationDetail,
            tickerData,
            isAutoSwitchOn,
            showArrow: true,
            onArrowToggle: handleToggleDetailPanel,
            isDetailPanelOpen,
            onCloseDetailPanel: handleCloseDetailPanel
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      reactExports.Suspense,
      {
        fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed right-0 top-0 h-full w-80 bg-white shadow-lg animate-pulse" }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DetailPanel,
          {
            isOpen: isDetailPanelOpen,
            onClose: handleCloseDetailPanel,
            stationData: selectedStation,
            chartHistory: selectedStation?.history || [],
            isAutoSwitchOn
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed right-0 top-0 h-full w-80 bg-white shadow-lg animate-pulse" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      FilterPanel,
      {
        isOpen: isFilterOpen,
        onOpen: () => setIsFilterOpen(true)
      }
    ) })
  ] });
};
const Layout$1 = reactExports.memo(Layout);

const SidebarTemplate = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  headerContent,
  showArrow = false,
  onArrowToggle,
  isDetailPanelOpen = false,
  onCloseDetailPanel
}) => {
  const [isVisible, setIsVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);
  const handleClose = () => {
    setIsVisible(false);
    if (isDetailPanelOpen && onCloseDetailPanel) {
      onCloseDetailPanel();
    }
    setTimeout(onClose, 300);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `fixed top-20 left-0 h-[calc(100vh-5rem)] w-96 bg-white shadow-2xl z-[60] transform transition-all duration-300 ease-in-out flex flex-col ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`,
      style: { willChange: "transform, opacity" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-4 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleClose,
              className: "p-2 hover:bg-gray-100 rounded-full transition-colors self-start mt-1",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: headerContent || /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900", children: title }),
            subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm", children: subtitle }),
            showArrow && !isDetailPanelOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: onArrowToggle,
                className: "group w-full flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 ease-in-out",
                title: "Buka Detail Panel",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800 group-hover:text-blue-800 transition-colors", children: "Detail Informasi" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 group-hover:text-blue-600 transition-colors", children: "Lihat data lengkap stasiun" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) }) })
                ]
              }
            ) })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto overflow-x-hidden", children })
      ]
    }
  );
};

export { Layout$1 as L, SidebarTemplate as S };
