const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["js/common-components-BNIdnCuC.js","js/react-vendor-CILUtiK9.js","js/mapbox-vendor-C_nsdMnr.js","css/mapbox-vendor-BVO_c2QR.css","js/vendor-HC16imTC.js","js/services-BvR663xD.js","js/device-components-CA_EA_AT.js","js/charts-vendor-Tn6b3eh3.js"])))=>i.map(i=>d[i]);
import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-CILUtiK9.js';
import { S as SidebarTemplate } from './layout-components-DJ5s5Jbu.js';
import { _ as __vitePreload } from './common-components-BNIdnCuC.js';

const getStatusColor = (status) => {
    switch (status) {
        case "safe":
            return "text-green-600";
        case "warning":
            return "text-yellow-600";
        case "alert":
            return "text-red-600";
        default:
            return "text-gray-600";
    }
};

const getStatusBgColor = (status) => {
    switch (status) {
        case "safe":
            return "bg-green-100 border-green-200";
        case "warning":
            return "bg-yellow-100 border-yellow-200";
        case "alert":
            return "bg-red-100 border-red-200";
        default:
            return "bg-gray-100 border-gray-200";
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

const StationDetail = ({
  selectedStation,
  onClose,
  tickerData,
  showArrow = false,
  onArrowToggle,
  isDetailPanelOpen = false,
  onCloseDetailPanel
}) => {
  const [stationData, setStationData] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (selectedStation && tickerData) {
      const foundStation = tickerData.find((station) => station.id === selectedStation.id);
      if (foundStation) {
        setStationData(foundStation);
      }
    }
  }, [selectedStation, tickerData]);
  if (!selectedStation || !stationData) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SidebarTemplate,
    {
      isOpen: !!selectedStation,
      onClose,
      title: stationData.name,
      showArrow,
      onArrowToggle,
      isDetailPanelOpen,
      onCloseDetailPanel,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-6 pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 rounded-lg border-2 ${getStatusBgColor(stationData.status)}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Status Saat Ini" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-bold ${getStatusColor(stationData.status)}`, children: getStatusText(stationData.status) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-gray-900", children: stationData.value.toFixed(1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: stationData.unit })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-lg border border-gray-200 bg-white shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-gray-800 mb-2 flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2 text-gray-600", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z", clipRule: "evenodd" }) }),
            "Alamat"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600", children: stationData.address || "Alamat tidak tersedia" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-lg border border-gray-200 bg-white shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold text-gray-800 flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2 text-gray-600", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" }) }),
              "Informasi Sensor"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full", children: [
              stationData.sensors ? stationData.sensors.length : 0,
              " Sensor"
            ] })
          ] }),
          stationData.sensors && stationData.sensors.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: stationData.sensors.map((sensor, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6 text-blue-600", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z", clipRule: "evenodd" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900", children: sensor.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: sensor.type })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-gray-900", children: [
                sensor.value,
                " ",
                sensor.unit
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
                "Update: ",
                sensor.lastUpdate
              ] })
            ] })
          ] }, index)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-12 w-12 mx-auto text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-gray-500", children: "Tidak ada data sensor" })
          ] })
        ] })
      ] })
    }
  );
};

const StationDetail$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: StationDetail
}, Symbol.toStringTag, { value: 'Module' }));

const MonitoringChart = reactExports.lazy(() => __vitePreload(() => import('./common-components-BNIdnCuC.js').then(n => n.M),true              ?__vite__mapDeps([0,1,2,3,4,5,6,7]):void 0));
const TanggulAktual = reactExports.lazy(() => __vitePreload(() => import('./common-components-BNIdnCuC.js').then(n => n.T),true              ?__vite__mapDeps([0,1,2,3,4,5,6,7]):void 0));
const PredictionChart = reactExports.lazy(() => __vitePreload(() => import('./common-components-BNIdnCuC.js').then(n => n.c),true              ?__vite__mapDeps([0,1,2,3,4,5,6,7]):void 0));
const DETAIL_TABS = [
  { key: "sensor", label: "Sensor" },
  { key: "cuaca", label: "Cuaca" },
  { key: "monitoring", label: "Monitoring" },
  { key: "riwayat", label: "Riwayat" }
];
const DetailPanel = ({ isOpen, onClose, stationData, chartHistory, isAutoSwitchOn = false }) => {
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("sensor");
  const [isTabChanging, setIsTabChanging] = reactExports.useState(false);
  const [previousTab, setPreviousTab] = reactExports.useState(null);
  const [isDotAnimating, setIsDotAnimating] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
      setTimeout(() => {
        setIsNavbarVisible(true);
      }, 200);
    } else {
      setIsVisible(false);
      setIsNavbarVisible(false);
    }
  }, [isOpen]);
  reactExports.useEffect(() => {
    const styleId = "detail-panel-animations";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes underlineSlideIn {
        0% {
          transform: translateX(-50%) scaleX(0);
          opacity: 0;
        }
        30% {
          opacity: 0.8;
        }
        100% {
          transform: translateX(-50%) scaleX(1);
          opacity: 1;
        }
      }
      
      @keyframes dotPopIn {
        0% {
          transform: translateX(-50%) scale(0);
          opacity: 0;
        }
        100% {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
      }
      
      @keyframes dotSlideOut {
        0% {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateX(-50%) scale(0.8);
          opacity: 0.8;
        }
        100% {
          transform: translateX(-50%) scale(0);
          opacity: 0;
        }
      }
      
      @keyframes underlineClose {
        0% {
          transform: translateX(-50%) scaleX(1);
          opacity: 1;
        }
        50% {
          transform: translateX(-50%) scaleX(0.3);
          opacity: 0.6;
        }
        100% {
          transform: translateX(-50%) scaleX(0);
          opacity: 0;
        }
      }
      
      .underline-active {
        animation: underlineSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .dot-hover {
        animation: dotPopIn 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .dot-slide-out {
        animation: dotSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .underline-close {
        animation: underlineClose 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
  reactExports.useEffect(() => {
    if (isAutoSwitchOn && isOpen) {
      handleClose();
    }
  }, [isAutoSwitchOn]);
  const handleClose = reactExports.useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);
  const handleTabClick = reactExports.useCallback((tabKey) => {
    if (isTabChanging || activeTab === tabKey) return;
    setIsTabChanging(true);
    setIsDotAnimating(true);
    setPreviousTab(activeTab);
    setTimeout(() => {
      setActiveTab(tabKey);
      setTimeout(() => {
        setIsTabChanging(false);
        setIsDotAnimating(false);
        setPreviousTab(null);
      }, 400);
    }, 400);
  }, [isTabChanging, activeTab]);
  if (!isOpen) return null;
  if (!stationData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `fixed top-20 left-96 right-150 bottom-0 z-[50] bg-white shadow-2xl transform transition-all duration-300 ease-in-out ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-500 text-lg", children: "Tidak ada data stasiun" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-sm mt-2", children: "Pilih stasiun untuk melihat detail" })
        ] }) })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `rounded-tr-lg fixed top-20 left-96 right-80 bottom-0 z-[50] bg-white shadow-2xl transform transition-all duration-300 ease-in-out ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`,
      style: { willChange: "transform, opacity" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-white-50 via-white-100 to-white-200 p-4 flex-shrink-0 shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleClose,
                  className: "p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl border border-blue-100 hover:border-blue-200",
                  "aria-label": "Kembali",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "svg",
                    {
                      className: "w-6 h-6 text-blue-600 group-hover:text-blue-800 transition-colors duration-300",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2.5,
                          d: "M11 17l-5-5m0 0l5-5m-5 5h14"
                        }
                      )
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold text-gray-900 tracking-tight", style: { fontFamily: "Inter, system-ui, -apple-system, sans-serif" }, children: "Detail Informasi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-gray-700 mt-1 font-semibold", style: { fontFamily: "Inter, system-ui, -apple-system, sans-serif" }, children: stationData.name })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 mb-2", children: [
                isAutoSwitchOn && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-xl text-sm font-semibold border border-blue-300 shadow-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" }),
                  "Auto Switch"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `text-sm font-bold px-4 py-2 rounded-xl border-2 shadow-lg ${stationData.status === "safe" ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300" : stationData.status === "warning" ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300" : stationData.status === "alert" ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300" : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300"}`,
                    children: getStatusText(stationData.status)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-600 font-semibold", style: { fontFamily: "Inter, system-ui, -apple-system, sans-serif" }, children: [
                "Update ",
                (/* @__PURE__ */ new Date()).toLocaleTimeString("id-ID")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `mt-6 pb-3 transition-all duration-500 ease-out ${isNavbarVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center space-x-8 text-base", children: DETAIL_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => handleTabClick(tab.key),
                  disabled: isTabChanging,
                  className: `relative py-4 px-4 transition-all duration-500 ease-out rounded-lg group ${activeTab === tab.key ? "text-gray-800 font-semibold" : "text-gray-600 font-medium hover:text-gray-800"} ${isTabChanging ? "opacity-70 cursor-wait" : "cursor-pointer"}`,
                  role: "tab",
                  "aria-selected": activeTab === tab.key,
                  style: { fontFamily: "Inter, system-ui, -apple-system, sans-serif" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10 whitespace-nowrap text-base font-semibold leading-tight", children: tab.label }),
                    activeTab === tab.key ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-1/2 w-8 h-1 bg-gradient-to-r from-blue-300 to-blue-800 rounded-full shadow-sm underline-active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 left-1/2 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:dot-hover transition-all duration-300 ease-out" })
                  ]
                },
                tab.key
              )) }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `space-y-6 transition-all duration-500 ease-out ${isTabChanging ? "opacity-50 scale-95" : "opacity-100 scale-100"}`,
            children: [
              activeTab !== "sensor" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 pt-8 pb-6 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-2xl font-bold text-gray-900 tracking-tight", style: { fontFamily: "Inter, system-ui, -apple-system, sans-serif" }, children: [
                    activeTab === "riwayat" && "Riwayat Data",
                    activeTab === "cuaca" && "Cuaca",
                    activeTab === "monitoring" && "Aktual & Prediksi"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-gray-600 font-semibold", style: { fontFamily: "Inter, system-ui, -apple-system, sans-serif" }, children: stationData.location })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-8 pb-8", children: [
                  activeTab === "riwayat" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 rounded-lg p-4 text-sm text-gray-600", children: "Riwayat data akan tersedia di sini." }),
                  activeTab === "cuaca" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Cuaca Saat Ini" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "svg",
                            {
                              className: "w-8 h-8 text-blue-500",
                              fill: "currentColor",
                              viewBox: "0 0 24 24",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" })
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Hujan Ringan" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold text-blue-600", children: "2.5 mm/jam" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "svg",
                            {
                              className: "w-8 h-8 text-orange-500",
                              fill: "currentColor",
                              viewBox: "0 0 24 24",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v6h-2z" })
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Suhu" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold text-orange-600", children: "28°C" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "svg",
                            {
                              className: "w-8 h-8 text-green-500",
                              fill: "currentColor",
                              viewBox: "0 0 24 24",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 17h20v2H2zm1.15-4.05L4 12l.85.95L6 11.5l.85.95L8 11l-.85-.95L6 12.5l-.85-.95L4 13l-.85-.95L2 12l.85-.95L4 11.5l.85.95L6 11l-.85-.95L4 12.5l-.85-.95L2 13zm0-8.95L4 3l.85.95L6 2.5l.85.95L8 2l-.85-.95L6 3.5 5.15 2.5 4 3l-.85-.95L2 3.05z" })
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Kecepatan Angin" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold text-green-600", children: "12 km/jam" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "svg",
                            {
                              className: "w-8 h-8 text-blue-500",
                              fill: "currentColor",
                              viewBox: "0 0 24 24",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2C9.24 2 7 4.24 7 7c0 1.5.62 2.85 1.61 3.82L12 14.17l3.39-3.35C16.38 9.85 17 8.5 17 7c0-2.76-2.24-5-5-5zm0 7.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 4.5 12 4.5s2.5 1.12 2.5 2.5S13.38 9.5 12 9.5zM12 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" })
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-600", children: "Kelembaban" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold text-blue-600", children: "85%" })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-lg p-4 shadow-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Indikator Risiko Banjir" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-yellow-50 rounded-lg shadow-sm", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "svg",
                            {
                              className: "w-6 h-6 text-yellow-600",
                              fill: "currentColor",
                              viewBox: "0 0 24 24",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" })
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-yellow-800", children: "Risiko Sedang" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-yellow-600 mt-1", children: "Curah hujan tinggi" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-green-50 rounded-lg shadow-sm", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "svg",
                            {
                              className: "w-6 h-6 text-green-600",
                              fill: "currentColor",
                              viewBox: "0 0 24 24",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" })
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-green-800", children: "Drainase Normal" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-green-600 mt-1", children: "Sistem berfungsi baik" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-3 bg-blue-50 rounded-lg shadow-sm", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "svg",
                            {
                              className: "w-6 h-6 text-blue-600",
                              fill: "currentColor",
                              viewBox: "0 0 24 24",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 3v18h18v-2H5V3H3zm4 12h2v2H7v-2zm0-4h2v2H7v-2zm0-4h2v2H7V7zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7z" })
                            }
                          ) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-blue-800", children: "Monitoring Aktif" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-blue-600 mt-1", children: "Update setiap 15 menit" })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50 rounded-lg p-4 shadow-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold text-amber-800 mb-2", children: "Rekomendasi" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-amber-700 space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Waspada terhadap peningkatan intensitas hujan pada sore hari" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Pantau terus level air sungai setiap 15 menit" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Siapkan rencana evakuasi jika level air mencapai 2.5m" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Koordinasi dengan tim darurat jika diperlukan" })
                      ] })
                    ] })
                  ] }),
                  activeTab === "monitoring" && /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-[320px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Loading chart..." }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MonitoringChart,
                    {
                      actualData: chartHistory || [],
                      width: 640,
                      height: 320,
                      className: "w-full",
                      canvasId: "monitoring-chart-detail"
                    }
                  ) })
                ] })
              ] }),
              activeTab === "sensor" && /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-[220px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Loading chart..." }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                TanggulAktual,
                {
                  stationData,
                  chartHistory,
                  width: 560,
                  height: 220,
                  className: "w-full"
                }
              ) }),
              activeTab === "sensor" && /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-[220px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Loading chart..." }) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PredictionChart,
                {
                  stationData,
                  chartHistory,
                  width: 560,
                  height: 220,
                  className: "w-full"
                }
              ) })
            ]
          }
        ) })
      ] })
    }
  );
};

const DetailPanel$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: DetailPanel
}, Symbol.toStringTag, { value: 'Module' }));

export { DetailPanel$1 as D, StationDetail$1 as S };
