import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-CILUtiK9.js';
import { f as fetchDevices } from './services-BHoYLIlq.js';
import { A as AutoSwitchToggle } from './device-components-CA_EA_AT.js';
import { R as ResponsiveContainer, L as LineChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Legend, b as Line, A as AreaChart, c as Area } from './charts-vendor-Tn6b3eh3.js';

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (true               && deps && deps.length > 0) {
		document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises$2) {
			return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
				status: "fulfilled",
				value: value$1
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			const cssSelector = isCss ? "[rel=\"stylesheet\"]" : "";
			if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err$2) {
		const e$1 = new Event("vite:preloadError", { cancelable: true });
		e$1.payload = err$2;
		window.dispatchEvent(e$1);
		if (!e$1.defaultPrevented) throw err$2;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};

const GoogleMapsSearchbar = ({
  onSearch,
  placeholder = "Cari di Maps",
  isSidebarOpen = false,
  mapboxMap = null
  // Tambahkan prop untuk instance Mapbox
}) => {
  const [searchValue, setSearchValue] = reactExports.useState("");
  const [isFocused, setIsFocused] = reactExports.useState(false);
  const [suggestions, setSuggestions] = reactExports.useState([]);
  const cityCoordinates = {
    "Jakarta": [106.8456, -6.2088],
    "Surabaya": [112.7508, -7.2575],
    "Bandung": [107.6191, -6.9175],
    "Yogyakarta": [110.3695, -7.7956],
    "Semarang": [110.4204, -6.9667],
    "Medan": [98.6722, 3.5952],
    "Palembang": [104.7458, -2.9765],
    "Makassar": [119.4327, -5.1477],
    "Denpasar": [115.2126, -8.6705],
    "Bali": [115.2126, -8.6705],
    "Malang": [112.6308, -7.9831],
    "Sidoarjo": [112.7183, -7.4478],
    "Probolinggo": [113.7156, -7.7764],
    "Pasuruan": [112.6909, -7.6461],
    "Mojokerto": [112.4694, -7.4706],
    "Lamongan": [112.3333, -7.1167],
    "Gresik": [112.5729, -7.1554],
    "Tuban": [112.0483, -6.8976],
    "Bojonegoro": [111.8816, -7.15],
    "Jombang": [112.2333, -7.55],
    "Nganjuk": [111.8833, -7.6],
    "Kediri": [112.0167, -7.8167],
    "Blitar": [112.1667, -8.1],
    "Tulungagung": [111.9, -8.0667],
    "Bangil": [112.7333, -7.6],
    "Lawang": [112.6833, -7.8333],
    "Singosari": [112.65, -7.9],
    "Wates": [110.3569, -7.9133],
    "Lempuyangan": [110.3739, -7.7884]
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      performSearch(searchValue);
    }
  };
  const performSearch = (query) => {
    let found = false;
    for (const city in cityCoordinates) {
      if (query.toLowerCase().includes(city.toLowerCase())) {
        const coords = cityCoordinates[city];
        if (mapboxMap && mapboxMap.current) {
          mapboxMap.current.flyTo({
            center: coords,
            zoom: 12,
            pitch: 45,
            bearing: -17.6,
            speed: 1.2,
            curve: 1.4,
            easing: (t) => t,
            essential: true
          });
        }
        if (onSearch) {
          onSearch(query);
        }
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(`Location not found: ${query}`);
      if (onSearch) {
        onSearch(query);
      }
    }
    setSuggestions([]);
  };
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim()) {
      const filteredCities = Object.keys(cityCoordinates).filter(
        (city) => city.toLowerCase().includes(value.toLowerCase())
      );
      if (filteredCities.length > 0) {
        setSuggestions(filteredCities);
      } else {
        const dummySuggestions = [
          `${value} Jakarta`,
          `${value} Surabaya`,
          `${value} Bandung`,
          `${value} Yogyakarta`,
          `${value} Bali`
        ];
        setSuggestions(dummySuggestions);
      }
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    setSuggestions([]);
    performSearch(suggestion);
  };
  const clearSearch = () => {
    setSearchValue("");
    setSuggestions([]);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `fixed top-4 z-[70] transition-all duration-300 ease-in-out ${isSidebarOpen ? "left-4 transform translate-x-0" : "left-4 transform translate-x-0"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-92", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearch, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-white rounded-lg shadow-lg transition-all duration-200 p-1.5 sm:p-2 ${isFocused ? "shadow-xl ring-2 ring-blue-500" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center py-1 sm:py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "svg",
        {
          className: "w-4 h-4 text-gray-400",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: searchValue,
          onChange: handleInputChange,
          onFocus: () => setIsFocused(true),
          onBlur: () => setTimeout(() => setIsFocused(false), 200),
          placeholder,
          className: "flex-1 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none text-sm leading-none"
        }
      ),
      searchValue && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: clearSearch,
          className: "p-1 hover:bg-gray-100 rounded-full transition-colors",
          title: "Hapus pencarian",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              className: "w-4 h-4 text-gray-400",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M6 18L18 6M6 6l12 12"
                }
              )
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "p-1 hover:bg-gray-100 rounded-full transition-colors",
          title: "Petunjuk arah",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              className: "w-4 h-4 text-blue-600",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                }
              )
            }
          )
        }
      ) })
    ] }) }),
    suggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 overflow-hidden", children: suggestions.map((suggestion, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors text-sm",
        onClick: () => handleSuggestionClick(suggestion),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-4 h-4 text-gray-400 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
          ] }),
          suggestion
        ] })
      },
      index
    )) })
  ] }) }) });
};

const GoogleMapsSearchbar$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: GoogleMapsSearchbar
}, Symbol.toStringTag, { value: 'Module' }));

const FloatingLegend = () => {
  const statusLevels = ["Aman", "Waspada", "Bahaya"];
  const ArrowIcon = () => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      className: "w-3 h-3 text-gray-600",
      fill: "currentColor",
      viewBox: "0 0 20 20",
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10 16l6-12H4l6 12z" })
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "w-80 rounded-lg bg-white/20 backdrop-blur-lg p-4 sm:p-1 border border-white/30 flex flex-col gap-2 overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h3",
          {
            className: "text-sm sm:text-base font-semibold text-gray-800 text-center",
            children: "Level Ketinggian Air"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 rounded-full shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full",
              style: { background: "linear-gradient(to right, #10b981, #f59e0b, #ef4444)" }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 text-center -mx-2", children: statusLevels.map((level) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowIcon, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[11px] font-medium text-gray-700",
                children: level
              }
            )
          ] }, level)) })
        ] })
      ]
    }
  );
};

const FloatingLegend$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: FloatingLegend
}, Symbol.toStringTag, { value: 'Module' }));

const Chart$3 = reactExports.lazy(() => __vitePreload(() => Promise.resolve().then(() => Chart$2),true              ?void 0:void 0));
const FloodRunningBar = ({ onDataUpdate, onStationSelect, onMapFocus, isSidebarOpen = false }) => {
  const [tickerData, setTickerData] = reactExports.useState([]);
  const generateDetailedHistory = (currentValue) => {
    const history = [];
    let baseValue = currentValue - (Math.random() * 0.5 + 0.2);
    for (let i = 0; i < 20; i++) {
      const change = (Math.random() - 0.5) * 0.15;
      baseValue = Math.max(0.5, Math.min(5, baseValue + change));
      history.push(parseFloat(baseValue.toFixed(2)));
    }
    return history;
  };
  reactExports.useEffect(() => {
    const initializeStationData = (devices) => {
      const initialStations = devices.map((device) => {
        const initialValue = parseFloat((Math.random() * 4.5 + 0.5).toFixed(2));
        return {
          id: device.id,
          name: device.name,
          value: initialValue,
          unit: "m",
          location: device.river_basin ? device.river_basin.name : "Unknown",
          coordinates: [parseFloat(device.longitude), parseFloat(device.latitude)],
          status: "safe",
          // Default status
          history: generateDetailedHistory(initialValue)
        };
      });
      setTickerData(initialStations);
    };
    const loadInitialData = async () => {
      try {
        const devicesData = await fetchDevices();
        if (devicesData && devicesData.length > 0) {
          initializeStationData(devicesData);
        }
      } catch (error) {
        console.error("Failed to fetch devices for running bar:", error);
      }
    };
    loadInitialData();
  }, []);
  reactExports.useEffect(() => {
    if (tickerData.length === 0) return;
    const updateTickerData = () => {
      setTickerData(
        (prev) => prev.map((item) => {
          let newValue = Math.max(0.5, Math.min(5, item.value + (Math.random() - 0.5) * 0.2));
          const newStatus = "safe";
          const newHistory = [...item.history.slice(1), newValue];
          return {
            ...item,
            value: newValue,
            status: newStatus,
            history: newHistory
          };
        })
      );
    };
    const interval = setInterval(updateTickerData, 3e3);
    return () => clearInterval(interval);
  }, [tickerData]);
  reactExports.useEffect(() => {
    if (onDataUpdate && tickerData && tickerData.length > 0) {
      onDataUpdate(tickerData);
    }
  }, [tickerData, onDataUpdate]);
  const getStatusBgColor = (status) => {
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
  const formatValue = (value) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  };
  if (tickerData.length === 0) {
    return null;
  }
  const animationDuration = tickerData.length * 4;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `fixed top-4 z-[70] transition-all duration-300 ease-in-out left-[calc(368px+2rem)] flood-running-bar`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1.5 sm:p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex space-x-2 sm:space-x-2 whitespace-nowrap",
            style: {
              animation: `infiniteScroll ${animationDuration}s linear infinite`,
              width: "fit-content"
            },
            children: [
              tickerData.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center space-x-1.5 sm:space-x-2 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 min-w-max border border-gray-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusBgColor(
                          item.status
                        )}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-700 font-medium truncate max-w-12 sm:max-w-16", children: item.name.replace("Stasiun ", "") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-0.5 sm:space-x-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-900", children: formatValue(item.value) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500", children: item.unit })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-6 bg-gray-200 rounded animate-pulse" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Chart$3,
                      {
                        data: item.history,
                        width: 48,
                        height: 22,
                        showTooltip: false,
                        miniMode: true,
                        status: item.status,
                        canvasId: `chart-first-${item.id}`,
                        className: "w-12 h-6 rounded"
                      }
                    ) })
                  ]
                },
                `first-${item.id}`
              )),
              tickerData.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center space-x-1.5 sm:space-x-2 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 min-w-max border border-gray-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusBgColor(
                          item.status
                        )}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-700 font-medium truncate max-w-12 sm:max-w-16", children: item.name.replace("Stasiun ", "") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-0.5 sm:space-x-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-gray-900", children: formatValue(item.value) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500", children: item.unit })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-6 bg-gray-200 rounded animate-pulse" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Chart$3,
                      {
                        data: item.history,
                        width: 48,
                        height: 22,
                        showTooltip: false,
                        miniMode: true,
                        status: item.status,
                        canvasId: `chart-second-${item.id}`,
                        className: "w-12 h-6 rounded"
                      }
                    ) })
                  ]
                },
                `second-${item.id}`
              ))
            ]
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                @keyframes infiniteScroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
<<<<<<< HEAD:frontend/src/components/FloodRunningBar.jsx
                /* Responsive right positioning based on FilterButton size */
                .flood-running-bar {
                    right: calc(1.5rem + 40px + 2rem); /* Mobile: 1.5rem margin + 40px button + 2rem margin */
=======
                /* Right spacing = outer margin (1rem) + FilterButton (48px) + gap (1rem) */
                .flood-running-bar {
                    right: calc(1rem + 48px + 1rem);
>>>>>>> 001df2bf4b5158ab0d9ab0f11161b180954cc48c:frontend/src/components/common/FloodRunningBar.jsx
                }
                
                @media (min-width: 640px) {
                    .flood-running-bar {
<<<<<<< HEAD:frontend/src/components/FloodRunningBar.jsx
                        right: calc(1.5rem + 40px + 2rem); /* Desktop: 1.5rem margin + 40px button + 2rem margin */
=======
                        right: calc(1rem + 48px + 1rem);
>>>>>>> 001df2bf4b5158ab0d9ab0f11161b180954cc48c:frontend/src/components/common/FloodRunningBar.jsx
                    }
                }
            ` })
      ]
    }
  );
};

const FloodRunningBar$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: FloodRunningBar
}, Symbol.toStringTag, { value: 'Module' }));

const FilterPanel = ({
  isOpen,
  onOpen,
  // tambahkan prop baru untuk membuka panel
  onClose,
  title = "Filter",
  subtitle,
  children,
  widthClass = "w-80",
  tickerData,
  handleStationChange,
  currentStationIndex,
  handleAutoSwitchToggle
}) => {
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("controls");
  const [layersState, setLayersState] = reactExports.useState([
    { id: "stations", name: "Stasiun Monitoring", color: "#3B82F6", enabled: false },
    { id: "rivers", name: "Sungai", color: "#06B6D4", enabled: false },
    { id: "flood-risk", name: "Area Risiko Banjir", color: "#F59E0B", enabled: false },
    { id: "rainfall", name: "Data Curah Hujan", color: "#10B981", enabled: false },
    { id: "elevation", name: "Elevasi Terrain", color: "#8B5CF6", enabled: false },
    { id: "administrative", name: "Batas Administrasi", color: "#6B7280", enabled: false }
  ]);
  reactExports.useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);
  const handleLayerToggle = (layerId) => {
    setLayersState(
      (prev) => prev.map(
        (layer) => layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 z-[80]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: onOpen,
        className: "relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-blue-50 transition-colors",
        title: "Buka Filter",
        "aria-label": "Buka Filter",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "relative z-10 w-6 h-6 text-blue-600 mix-blend-normal pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22 3H2l8 9v7l4 2v-9l8-9z" }) })
      }
    ) }),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `fixed rounded-tl-lg rounded-bl-lg top-20 right-0 h-[calc(80%-8%)] ${widthClass} bg-white shadow-2xl z-[70] transform transition-all duration-300 ease-in-out flex flex-col ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`,
        style: { willChange: "transform, opacity" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-tl-lg flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sliders, { className: "w-5 h-5 text-blue-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Filter & Controls" }),
                subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500 text-sm", children: subtitle })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setIsVisible(false);
                  setTimeout(() => {
                    onClose && onClose();
                  }, 300);
                },
                className: "p-1.5 hover:bg-gray-200 rounded-md transition-colors",
                title: "Tutup",
                "aria-label": "Tutup panel filter",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto overflow-x-hidden p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-gray-700 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "w-4 h-4 text-blue-600" }),
                "Device Auto Switch"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-50 rounded-lg p-4 border border-blue-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                AutoSwitchToggle,
                {
                  tickerData,
                  onStationChange: handleStationChange,
                  currentStationIndex,
                  onAutoSwitchToggle: handleAutoSwitchToggle
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-4 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-gray-700 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 text-blue-600" }),
                "Map Layers"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: layersState.map((layer) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "w-3 h-3 rounded-full",
                          style: { backgroundColor: layer.color }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-700", children: layer.name })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleLayerToggle(layer.id),
                        className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${layer.enabled ? "bg-blue-600" : "bg-gray-300"}`,
                        type: "button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${layer.enabled ? "translate-x-5" : "translate-x-1"}`
                          }
                        )
                      }
                    )
                  ]
                },
                layer.id
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTriangle, { className: "w-4 h-4 text-amber-600 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-amber-800", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Layer Control" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: "Beberapa layer mungkin memerlukan waktu loading tambahan." })
                ] })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-bl-lg border-t border-gray-200 p-4 bg-gray-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Map Layer Control" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400", children: "Filter v1.0" })
          ] }) })
        ]
      }
    )
  ] });
};

const FilterPanel$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: FilterPanel
}, Symbol.toStringTag, { value: 'Module' }));

const Chart = ({
  data = [],
  width = 320,
  height = 160,
  showTooltip = true,
  className = "",
  onDataPointHover = null,
  miniMode = false,
  status = "safe",
  canvasId = "chart-canvas"
}) => {
  const [tooltip, setTooltip] = reactExports.useState({
    visible: false,
    x: 0,
    y: 0,
    data: null,
    position: "top"
    // 'top' or 'bottom'
  });
  const tooltipTimeoutRef = reactExports.useRef(null);
  const generateTimestamps = reactExports.useCallback((dataLength) => {
    const timestamps = [];
    const now = /* @__PURE__ */ new Date();
    for (let i = dataLength - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 30 * 1e3);
      timestamps.push(time);
    }
    return timestamps;
  }, []);
  const calculateTooltipPosition = reactExports.useCallback((pointX, pointY, canvasRect) => {
    const tooltipHeight = 60;
    const tooltipWidth = 100;
    const margin = 8;
    const spaceAbove = pointY;
    canvasRect.height - pointY;
    const shouldPositionBelow = spaceAbove < tooltipHeight + margin;
    let tooltipX = pointX;
    const halfWidth = tooltipWidth / 2;
    if (pointX - halfWidth < margin) {
      tooltipX = margin + halfWidth;
    } else if (pointX + halfWidth > canvasRect.width - margin) {
      tooltipX = canvasRect.width - margin - halfWidth;
    }
    let tooltipY = shouldPositionBelow ? pointY + 10 : pointY - 10;
    return {
      x: tooltipX,
      y: tooltipY,
      position: shouldPositionBelow ? "bottom" : "top"
    };
  }, []);
  reactExports.useEffect(() => {
    if (data.length === 0) return;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (data.length < 2) return;
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1;
    let lineColor = "#10B981";
    if (status) {
      switch (status) {
        case "safe":
          lineColor = "#10B981";
          break;
        // green
        case "warning":
          lineColor = "#F59E0B";
          break;
        // yellow
        case "alert":
          lineColor = "#EF4444";
          break;
        // red
        default:
          lineColor = "#6B7280";
          break;
      }
    } else {
      if (maxValue > 4) lineColor = "#EF4444";
      else if (maxValue > 2.5) lineColor = "#F59E0B";
    }
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, lineColor + "50");
    gradient.addColorStop(0.3, lineColor + "40");
    gradient.addColorStop(0.6, lineColor + "25");
    gradient.addColorStop(1, lineColor + "05");
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.moveTo(0, canvasHeight);
    data.forEach((value, index) => {
      const x = index / (data.length - 1) * canvasWidth;
      const y = canvasHeight - (value - minValue) / range * canvasHeight;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    data.forEach((value, index) => {
      const x = index / (data.length - 1) * canvasWidth;
      const y = canvasHeight - (value - minValue) / range * canvasHeight;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    if (!miniMode && tooltip.visible && tooltip.data) {
      const pointIndex = tooltip.data.index;
      if (pointIndex >= 0 && pointIndex < data.length) {
        const x = pointIndex / (data.length - 1) * canvasWidth;
        const actualValue = data[pointIndex];
        const y = canvasHeight - (actualValue - minValue) / range * canvasHeight;
        ctx.beginPath();
        ctx.fillStyle = lineColor;
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [data, tooltip, showTooltip, miniMode, status, canvasId]);
  const handleChartMouseMove = reactExports.useCallback((event) => {
    if (!showTooltip || data.length === 0 || miniMode) return;
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    tooltipTimeoutRef.current = setTimeout(() => {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        setTooltip({ visible: false, x: 0, y: 0, data: null });
        return;
      }
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const pointIndex = Math.round(x / canvasWidth * (data.length - 1));
      if (pointIndex >= 0 && pointIndex < data.length) {
        const value = data[pointIndex];
        const timestamps = generateTimestamps(data.length);
        const timestamp = timestamps[pointIndex];
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        const range = maxValue - minValue || 1;
        const pointX = pointIndex / (data.length - 1) * canvasWidth;
        const pointY = canvasHeight - (value - minValue) / range * canvasHeight;
        const canvasRect = { width: canvasWidth, height: canvasHeight };
        const tooltipPos = calculateTooltipPosition(pointX, pointY, canvasRect);
        const tooltipData = {
          value,
          // Use actual data value from array
          timestamp,
          index: pointIndex
        };
        setTooltip({
          visible: true,
          x: tooltipPos.x,
          y: tooltipPos.y,
          data: tooltipData,
          position: tooltipPos.position
        });
        if (onDataPointHover) {
          onDataPointHover(tooltipData);
        }
      }
    }, 16);
  }, [showTooltip, data, miniMode, canvasId, generateTimestamps, calculateTooltipPosition, onDataPointHover]);
  const handleChartMouseLeave = reactExports.useCallback(() => {
    if (miniMode) return;
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setTooltip({ visible: false, x: 0, y: 0, data: null });
  }, [miniMode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "canvas",
      {
        id: canvasId,
        width,
        height,
        className: `w-full rounded bg-white ${showTooltip && !miniMode ? "cursor-crosshair" : ""} ${miniMode ? "transition-all duration-300 hover:scale-105" : ""}`,
        onMouseMove: handleChartMouseMove,
        onMouseLeave: handleChartMouseLeave
      }
    ),
    !miniMode && showTooltip && tooltip.visible && tooltip.data && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute bg-gray-900 text-white text-xs rounded-md px-2 py-1.5 shadow-lg pointer-events-none z-50 border border-gray-700 transition-all duration-150 ease-out",
        style: {
          left: `${tooltip.x}px`,
          top: `${tooltip.y}px`,
          transform: tooltip.position === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0%)",
          minWidth: "80px",
          maxWidth: "120px"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-white text-xs", children: [
            tooltip.data.value.toFixed(2),
            "m"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-300 text-xs", children: tooltip.data.timestamp.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gray-400 text-xs", children: tooltip.data.timestamp.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          }) })
        ] })
      }
    )
  ] });
};
const Chart$1 = reactExports.memo(Chart);

const Chart$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: Chart$1
}, Symbol.toStringTag, { value: 'Module' }));

const MonitoringChart = ({
  actualData = [],
  predictedData = [],
  width = 640,
  height = 320,
  className = "",
  canvasId = "monitoring-chart"
}) => {
  const predicted = reactExports.useMemo(() => {
    if (predictedData.length > 0) return predictedData;
    return actualData.map((value, index) => {
      if (index === 0) return value;
      const prevValue = actualData[index - 1];
      const drift = (value - prevValue) * 0.6;
      return Math.max(0, value + drift);
    });
  }, [actualData, predictedData]);
  const chartData = reactExports.useMemo(() => {
    return actualData.map((value, index) => ({
      time: `T${index + 1}`,
      actual: value,
      predicted: predicted[index] || 0
    }));
  }, [actualData, predicted]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-3 border border-gray-200 rounded-lg shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-gray-700", children: `Waktu: ${label}` }),
        payload.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: entry.color }, children: `${entry.dataKey}: ${entry.value.toFixed(2)}m` }, index))
      ] });
    }
    return null;
  };
  if (actualData.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `relative ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 rounded-lg p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-gray-500 text-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-16 h-16 mx-auto mb-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-gray-600", children: "Tidak Ada Data" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Data monitoring akan ditampilkan di sini" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white rounded-lg p-4 shadow-sm border border-gray-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      LineChart,
      {
        data: chartData,
        margin: {
          top: 20,
          right: 30,
          left: 20,
          bottom: 20
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f3f4f6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            XAxis,
            {
              dataKey: "time",
              stroke: "#6b7280",
              fontSize: 12,
              tickLine: false,
              axisLine: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            YAxis,
            {
              stroke: "#6b7280",
              fontSize: 12,
              tickLine: false,
              axisLine: false,
              label: { value: "Level Air (m)", angle: -90, position: "insideLeft" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Legend,
            {
              verticalAlign: "top",
              height: 36,
              wrapperStyle: { paddingBottom: "10px" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Line,
            {
              type: "monotone",
              dataKey: "actual",
              stroke: "#3b82f6",
              strokeWidth: 3,
              dot: { fill: "#3b82f6", strokeWidth: 2, r: 4 },
              activeDot: { r: 6, stroke: "#3b82f6", strokeWidth: 2 },
              name: "Data Aktual"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Line,
            {
              type: "monotone",
              dataKey: "predicted",
              stroke: "#ef4444",
              strokeWidth: 2,
              strokeDasharray: "5 5",
              dot: { fill: "#ef4444", strokeWidth: 2, r: 3 },
              activeDot: { r: 5, stroke: "#ef4444", strokeWidth: 2 },
              name: "Prediksi"
            }
          )
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-blue-50 rounded-lg p-3 border border-blue-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-blue-800", children: "Data Aktual" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-600", children: actualData.length > 0 ? `Terakhir: ${actualData[actualData.length - 1].toFixed(1)}m` : "Tidak ada data" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 rounded-lg p-3 border border-red-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-red-800", children: "Prediksi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-600", children: predicted.length > 0 ? `Terakhir: ${predicted[predicted.length - 1].toFixed(1)}m` : "Tidak ada data" })
      ] })
    ] })
  ] });
};

const MonitoringDualLinet = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: MonitoringChart
}, Symbol.toStringTag, { value: 'Module' }));

const RiverDevelopmentChart = ({ stationData, chartHistory = [], width = 560, height = 220, className = "w-full" }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "safe":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "alert":
        return "text-red-500";
      default:
        return "text-gray-400";
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
        return "Normal";
    }
  };
  if (!stationData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 rounded-lg p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-gray-500 text-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "svg",
        {
          className: "w-16 h-16 mx-auto mb-4 text-gray-400",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 1,
              d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-gray-600", children: "Tidak Ada Data" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Data perkembangan air sungai akan ditampilkan di sini" })
    ] }) });
  }
  const chartData = reactExports.useMemo(() => {
    const waterLevel = stationData.value || 0.2;
    const leveeData = [
      { x: 0, levee: 3.5 },
      // Puncak kiri
      { x: 1, levee: 3.5 },
      // Puncak kiri
      { x: 2, levee: 3.5 },
      // Puncak kiri
      { x: 3, levee: 3.5 },
      // Puncak kiri
      { x: 4, levee: 3.5 },
      // Puncak kiri
      { x: 5, levee: 3.2 },
      // Mulai miring landai
      { x: 6, levee: 2.5 },
      // Sisi miring landai
      { x: 7, levee: 2 },
      // Sisi miring landai
      { x: 8, levee: 1 },
      // Sisi miring landai
      { x: 9, levee: 0.8 },
      // Sisi miring landai
      { x: 10, levee: 0.4 },
      // Dasar sungai
      { x: 11, levee: 0.2 },
      // Dasar sungai
      { x: 12, levee: 0.2 },
      // Dasar sungai
      { x: 13, levee: 0.2 },
      // Dasar sungai
      { x: 14, levee: 0.2 },
      // Dasar sungai
      { x: 15, levee: 0.4 },
      // Dasar sungai
      { x: 16, levee: 0.8 },
      // Sisi miring landai
      { x: 17, levee: 1 },
      // Sisi miring landai
      { x: 18, levee: 2 },
      // Sisi miring landai
      { x: 19, levee: 2.5 },
      // Sisi miring landai
      { x: 20, levee: 3.2 },
      // Mulai miring landai
      { x: 21, levee: 3.5 },
      // Puncak kanan
      { x: 22, levee: 3.5 },
      // Puncak kanan
      { x: 23, levee: 3.5 },
      // Puncak kanan
      { x: 24, levee: 3.5 }
      // Puncak kanan
    ];
    const data = leveeData.map((point) => {
      return {
        x: point.x,
        levee: point.levee,
        water: waterLevel
        // Nilai konstan untuk muka air rata
      };
    });
    console.log("TanggulAktual chartData (muka air rata):", data);
    return data;
  }, [stationData.value]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const waterLevel = stationData.value || 0.2;
      const leveePayload = payload.find((p) => p.name === "Bingkai Tanggul");
      const leveeValue = leveePayload ? leveePayload.value : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-3 border border-gray-200 rounded-lg shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-gray-700", children: [
          "Level Air: ",
          waterLevel.toFixed(2),
          "m"
        ] }),
        leveeValue !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", children: [
          "Tinggi Tanggul: ",
          leveeValue.toFixed(2),
          "m"
        ] })
      ] });
    }
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white rounded-xl shadow-sm ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-6 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Perkembangan Air Sungai Aktual" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-3 h-3 rounded-full ${getStatusColor(stationData.status).replace(
                "text-",
                "bg-"
              )}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-medium ${getStatusColor(stationData.status)}`, children: getStatusText(stationData.status) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", children: stationData.location })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: chartData, margin: { top: 20, right: 80, left: 60, bottom: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "leveeGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#E5E7EB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#D1D5DB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#9CA3AF" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "waterGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#87CEEB", stopOpacity: 0.9 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#87CEEB", stopOpacity: 0.7 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#4682B4", stopOpacity: 0.5 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "2 2", stroke: "#ffffff", strokeOpacity: 0.8 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "x", hide: true, domain: [0, 24] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        YAxis,
        {
          domain: [0, 4],
          tickLine: false,
          axisLine: false,
          fontSize: 12,
          label: { value: "Tinggi Air (m)", angle: -90, position: "insideLeft" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { verticalAlign: "top", height: 36, wrapperStyle: { paddingBottom: "10px" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Area,
        {
          type: "monotone",
          dataKey: "water",
          fill: "url(#waterGradient)",
          fillOpacity: 0.6,
          stroke: "none",
          strokeWidth: 0,
          name: "Level Air"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Area,
        {
          type: "monotone",
          dataKey: "levee",
          fill: "url(#leveeGradient)",
          fillOpacity: 1,
          stroke: "#9CA3AF",
          strokeWidth: 2,
          name: "Bingkai Tanggul"
        }
      )
    ] }) }) }) })
  ] });
};

const TanggulAktual = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: RiverDevelopmentChart
}, Symbol.toStringTag, { value: 'Module' }));

const PredictionChart = ({ stationData, chartHistory = [], width = 560, height = 220, className = "w-full" }) => {
  if (!stationData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gray-50 rounded-lg p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-gray-500 text-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "svg",
        {
          className: "w-16 h-16 mx-auto mb-4 text-gray-400",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 1,
              d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-gray-600", children: "Tidak Ada Data" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Data prediksi banjir akan ditampilkan di sini" })
    ] }) });
  }
  const chartData = reactExports.useMemo(() => {
    const predictedWaterLevel = (stationData.value || 0.4) + 0.2;
    const leveeData = [
      { x: 0, levee: 3.5 },
      // Puncak kiri
      { x: 1, levee: 3.5 },
      // Puncak kiri
      { x: 2, levee: 3.5 },
      // Puncak kiri
      { x: 3, levee: 3.5 },
      // Puncak kiri
      { x: 4, levee: 3.5 },
      // Puncak kiri
      { x: 5, levee: 3.2 },
      // Mulai miring landai
      { x: 6, levee: 2.5 },
      // Sisi miring landai
      { x: 7, levee: 2 },
      // Sisi miring landai
      { x: 8, levee: 1 },
      // Sisi miring landai
      { x: 9, levee: 0.8 },
      // Sisi miring landai
      { x: 10, levee: 0.4 },
      // Dasar sungai
      { x: 11, levee: 0.2 },
      // Dasar sungai
      { x: 12, levee: 0.2 },
      // Dasar sungai
      { x: 13, levee: 0.2 },
      // Dasar sungai
      { x: 14, levee: 0.2 },
      // Dasar sungai
      { x: 15, levee: 0.4 },
      // Dasar sungai
      { x: 16, levee: 0.8 },
      // Sisi miring landai
      { x: 17, levee: 1 },
      // Sisi miring landai
      { x: 18, levee: 2 },
      // Sisi miring landai
      { x: 19, levee: 2.5 },
      // Sisi miring landai
      { x: 20, levee: 3.2 },
      // Mulai miring landai
      { x: 21, levee: 3.5 },
      // Puncak kanan
      { x: 22, levee: 3.5 },
      // Puncak kanan
      { x: 23, levee: 3.5 },
      // Puncak kanan
      { x: 24, levee: 3.5 }
      // Puncak kanan
    ];
    const data = leveeData.map((point) => {
      return {
        x: point.x,
        levee: point.levee,
        predicted: predictedWaterLevel
        // Nilai konstan untuk muka air rata
      };
    });
    console.log("TanggulPrediksi chartData (muka air rata):", data);
    return data;
  }, [stationData.value]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const predictedLevel = (stationData.value || 0.4) + 0.2;
      const leveePayload = payload.find((p) => p.name === "Bingkai Tanggul");
      const leveeValue = leveePayload ? leveePayload.value : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-3 border border-gray-200 rounded-lg shadow-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-gray-700", children: [
          "Prediksi Level Air: ",
          predictedLevel.toFixed(2),
          "m"
        ] }),
        leveeValue !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", children: [
          "Tinggi Tanggul: ",
          leveeValue.toFixed(2),
          "m"
        ] })
      ] });
    }
    return null;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `bg-white rounded-xl shadow-sm ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pt-6 pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Prediksi" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Parameter dan threshold untuk prediksi banjir" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "100%", height }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: chartData, margin: { top: 20, right: 80, left: 60, bottom: 20 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "leveeGradientPred", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#E5E7EB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#D1D5DB" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#9CA3AF" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "waterPredGradient", x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#ef4444", stopOpacity: 0.8 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#ef4444", stopOpacity: 0.6 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#dc2626", stopOpacity: 0.4 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "2 2", stroke: "#ffffff", strokeOpacity: 0.8 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "x", hide: true, domain: [0, 24] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        YAxis,
        {
          domain: [0, 4],
          tickLine: false,
          axisLine: false,
          fontSize: 12,
          label: { value: "Tinggi Air (m)", angle: -90, position: "insideLeft" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { verticalAlign: "top", height: 36, wrapperStyle: { paddingBottom: "10px" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Area,
        {
          type: "monotone",
          dataKey: "predicted",
          fill: "url(#waterPredGradient)",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 0,
          name: "Prediksi"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Line,
        {
          type: "monotone",
          dataKey: "predicted",
          stroke: "#b91c1c",
          strokeWidth: 0,
          dot: false,
          activeDot: false,
          legendType: "none"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Area,
        {
          type: "monotone",
          dataKey: "levee",
          fill: "url(#leveeGradientPred)",
          fillOpacity: 1,
          stroke: "#9CA3AF",
          strokeWidth: 2,
          name: "Bingkai Tanggul"
        }
      )
    ] }) }) }) })
  ] });
};

const TanggulPrediksi = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: PredictionChart
}, Symbol.toStringTag, { value: 'Module' }));

export { FloatingLegend$1 as F, GoogleMapsSearchbar$1 as G, MonitoringDualLinet as M, TanggulAktual as T, __vitePreload as _, FloodRunningBar$1 as a, FilterPanel$1 as b, TanggulPrediksi as c };
