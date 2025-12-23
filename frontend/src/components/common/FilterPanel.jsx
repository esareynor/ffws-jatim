// src/components/common/FilterPanel.jsx
import React, { useEffect, useState } from "react";
import {
  Sliders,
  ToggleRight,
  Layers,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const FilterPanel = ({
  isOpen,
  onOpen,
  onClose,
  subtitle,
  widthClass = "w-80",
  tickerData,
  handleStationChange,
  handleRegionChange,
  currentStationIndex,
  currentRegionIndex,
  handleAutoSwitchToggle,
  onLayerToggle = () => {},
  activeLayers = {},
  administrativeRegions = [],
  autoSwitchMode = "station",
  deviceList = [],
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [showLayers, setShowLayers] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [showPetaGenangan, setShowPetaGenangan] = useState(false);
  const [showKabupatenKota, setShowKabupatenKota] = useState(false);
  const [showWilayahSungai, setShowWilayahSungai] = useState(false);
  const [showDaerahAliranSungai, setShowDaerahAliranSungai] = useState(false);
  const [showSamplingAir, setShowSamplingAir] = useState(false);
  const [showSensorBanjir, setShowSensorBanjir] = useState(false);
  const [showPosTinggiMukaAir, setShowPosTinggiMukaAir] = useState(false);
  const [showPosHujan, setShowPosHujan] = useState(false);
  const [showPosDugaAir, setShowPosDugaAir] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle swipe down to close on mobile
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragOffset(0);
    
    const touch = e.touches ? e.touches[0] : e;
    const startY = touch.clientY;
    const startTime = Date.now();
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      const currentTouch = e.touches ? e.touches[0] : e;
      const currentY = currentTouch.clientY;
      const deltaY = currentY - startY;
      
      // Only allow downward movement
      if (deltaY > 0) {
        setDragOffset(deltaY);
      }
    };
    
    const handleTouchEnd = (e) => {
      const currentTouch = e.changedTouches ? e.changedTouches[0] : e;
      const currentY = currentTouch.clientY;
      const deltaY = currentY - startY;
      const deltaTime = Date.now() - startTime;
      const velocity = deltaY / deltaTime;
      
      // Close thresholds
      const shouldClose = 
        deltaY > 120 || 
        (velocity > 0.5 && deltaY > 60) || 
        (velocity > 1 && deltaY > 30);
      
      if (shouldClose) {
        setIsVisible(false);
        setTimeout(() => {
          onClose && onClose();
        }, 300);
      }
      
      setIsDragging(false);
      setDragOffset(0);
      cleanup();
    };
    
    const cleanup = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousemove', handleTouchMove);
      document.removeEventListener('mouseup', handleTouchEnd);
    };
    
    if (e.type === 'touchstart') {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.addEventListener('mousemove', handleTouchMove);
      document.addEventListener('mouseup', handleTouchEnd);
    }
  };

  // Prevent body scroll when mobile panel is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isMobile, isOpen]);

  const handleLayerToggle = (layerId) => {
    console.log("🖱️ Klik layer di FilterPanel:", layerId);
    if (typeof onLayerToggle === "function") {
      onLayerToggle(layerId);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed bg-white shadow-2xl z-[1000] transform flex flex-col ${
          isMobile 
            ? `bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl ${
                isVisible ? "opacity-100" : "opacity-0"
              }`
            : `top-16 sm:top-20 right-2 sm:right-0 h-[calc(100vh-2rem)] sm:h-[calc(80%-8%)] ${widthClass} max-w-[300px] sm:max-w-none rounded-tl-lg rounded-bl-lg transition-all duration-300 ease-in-out ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
              }`
        }`}
        style={{ 
          willChange: "transform, opacity",
          transform: isMobile 
            ? isDragging 
              ? `translateY(${dragOffset}px)` 
              : isVisible 
                ? "translateY(0)" 
                : "translateY(100%)"
            : undefined,
          transition: isMobile && !isDragging 
            ? "transform 300ms ease-in-out, opacity 300ms ease-in-out" 
            : undefined,
          pointerEvents: isVisible ? "auto" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className={`flex items-center justify-between p-4 border-b border-gray-200 transition-colors ${
            isMobile ? 'rounded-t-2xl cursor-grab active:cursor-grabbing' : 'rounded-tl-lg'
          } ${
            isMobile && isDragging ? 'bg-gray-100' : 'bg-gray-50/50'
          }`}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onMouseDown={isMobile ? handleTouchStart : undefined}
        >
          {/* Mobile drag handle */}
          {isMobile && (
            <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1.5 rounded-full transition-all duration-200 ${
              isDragging 
                ? 'bg-gray-600 w-12' 
                : 'bg-gray-400 hover:bg-gray-500'
            }`}></div>
          )}
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Filter & Controls</h2>
              {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
            </div>
          </div>
          {/* Desktop close button */}
          {!isMobile && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
              title="Tutup"
              aria-label="Tutup panel filter"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin ${
          isMobile ? 'pb-6' : ''
        }`}>
          {/* Map Layers */}
          <section className="mt-4 space-y-4">
            <div
              onClick={() => setShowLayers(!showLayers)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-700">Map Layers</span>
              </div>
              {showLayers ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>
            {showLayers && (
              <div className="pl-4 pt-2 pb-4 space-y-3">
                {[
                  { id: "rivers", name: "Sungai", color: "#06B6D4" },
                  { id: "administrative", name: "Batas Administrasi", color: "#6B7280" },
                ].map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      ></span>
                      <span className="text-sm font-medium text-gray-700">{layer.name}</span>
                    </div>
                    <button
                      onClick={() => handleLayerToggle(layer.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        activeLayers[layer.id] ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      type="button"
                      aria-pressed={!!activeLayers[layer.id]}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          activeLayers[layer.id] ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Legenda Peta */}
          <section className="mt-4 space-y-4">
            <div
              onClick={() => setShowLegend(!showLegend)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="4" width="18" height="3" rx="1" stroke="currentColor" />
                  <rect x="3" y="10.5" width="14" height="3" rx="1" stroke="currentColor" />
                  <rect x="3" y="17" width="10" height="3" rx="1" stroke="currentColor" />
                </svg>
                <span className="font-semibold text-gray-700">Legenda Peta</span>
              </div>
              {showLegend ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>
            {showLegend && (
              <div className="pl-4 pt-2 pb-4 space-y-3">
                {/* Data Master */}
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Data Master</div>
                  <div className="space-y-1 pl-2">
                    {[
                      { id: "ws-brantas", name: "WS Brantas", color: "#FF4500" },
                      { id: "ws-bengawan-solo", name: "WS Bengawan Solo", color: "#FF7F50" },
                      { id: "ws-bondoyudo-bedadung", name: "WS Bondoyudo Bedadung", color: "#00CED1" },
                      { id: "ws-baru-bajul-mati", name: "WS Baru Bajul Mati", color: "#8A2BE2" },
                      { id: "ws-welang-rejoso", name: "WS Welang Rejoso", color: "#FF00FF" },
                      { id: "ws-pekalen-sampean", name: "WS Pekalen Sampean", color: "#FF69B4" },
                      { id: "ws-madura-bawean", name: "WS Madura Bawean", color: "#FFD700" },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></span>
                          <span className="text-xs text-gray-700">{item.name}</span>
                        </div>
                        <button
                          onClick={() => handleLayerToggle(item.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            activeLayers[item.id] ? "bg-blue-600" : "bg-gray-300"
                          }`}
                          type="button"
                          aria-pressed={!!activeLayers[item.id]}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              activeLayers[item.id] ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Device Marker */}
                <div>
                  <div className="mb-2">
                    <div className="font-medium text-xs text-gray-600">Marker Device</div>
                  </div>
                  {showLegend && deviceList && deviceList.length > 0 && (
                    <div className="space-y-1 pl-2 max-h-60 overflow-y-auto">
                      {deviceList
                        .filter((device) => device.latitude && device.longitude)
                        .map((device) => {
                          const deviceId = device.id || device.device_id;
                          const deviceName = device.name || device.device_name || device.station_name || `Device ${deviceId}`;
                          const layerId = `device-${deviceId}`;
                          const isActive = activeLayers[layerId] || false;
                          
                          return (
                            <div
                              key={deviceId}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  className="w-3 h-3 text-blue-600 shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                  <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span className="text-xs text-gray-700 truncate" title={deviceName}>
                                  {deviceName}
                                </span>
                              </div>
                              <button
                                onClick={() => handleLayerToggle(layerId)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shrink-0 ${
                                  isActive ? "bg-blue-600" : "bg-gray-300"
                                }`}
                                type="button"
                                aria-pressed={isActive}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    isActive ? "translate-x-5" : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  )}
                  {showLegend && (!deviceList || deviceList.length === 0) && (
                    <div className="pl-2 text-xs text-gray-500 italic">
                      Tidak ada device tersedia
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Pos Hujan */}
          <section className="mt-4 space-y-4">
            <div
              onClick={() => setShowPosHujan(!showPosHujan)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path
                    d="M20 16.58A4 4 0 0 0 16 12h-1.26A6 6 0 1 0 6 17"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 19v2M12 19v2M16 19v2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-semibold text-gray-700">Pos Hujan</span>
              </div>
              {showPosHujan ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>
            {showPosHujan && (
              <div className="pl-4 pt-2 pb-4 space-y-2">
                {[
                  {
                    id: "Hujan Jam-Jam an PU SDA",
                    name: "Hujan Jam-Jam an PU SDA",
                    color: "#FF6347",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C12 2 7 8 7 12.5C7 16.6421 9.85786 19.5 14 19.5C18.1421 19.5 21 16.6421 21 12.5C21 8 16.001 2 16.001 2H12Z"
                          fill={item.color}
                        />
                      </svg>
                      <span className="text-xs text-gray-700">{item.name}</span>
                    </div>
                    <button
                      onClick={() => handleLayerToggle(item.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        activeLayers[item.id] ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      type="button"
                      aria-pressed={!!activeLayers[item.id]}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          activeLayers[item.id] ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Pos Duga Air */}
          <section className="mt-4 space-y-4">
            <div
              onClick={() => setShowPosDugaAir(!showPosDugaAir)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path
                    d="M8 2h8l-1 6a4 4 0 0 1-6 0L8 2z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 9v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-semibold text-gray-700">Pos Duga Air</span>
              </div>
              {showPosDugaAir ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>
            {showPosDugaAir && (
              <div className="pl-4 pt-2 pb-4 space-y-2">
                {[
                  {
                    id: "Pos Duga Air Jam-Jam an PU SDA",
                    name: "Pos Duga Air Jam-Jam an PU SDA",
                    color: "#008080",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3"
                        style={{ backgroundColor: item.color, borderRadius: "4px" }}
                      ></span>
                      <span className="text-xs text-gray-700">{item.name}</span>
                    </div>
                    <button
                      onClick={() => handleLayerToggle(item.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        activeLayers[item.id] ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      type="button"
                      aria-pressed={!!activeLayers[item.id]}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          activeLayers[item.id] ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        {/* --- INFO PANEL: EDUKATIF --- */}
          <div className="mt-6 mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex items-start gap-3">
              {/* Anda mungkin perlu import { Info } from 'lucide-react' jika ingin ikon huruf 'i' */}
              <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> 
              <div>
                <h4 className="text-sm font-bold text-black mb-2">Panduan Penggunaan Peta</h4>
                <p className="text-xs text-black mb-2 leading-relaxed">
                  Gunakan panel ini untuk menyaring informasi yang ingin Anda pantau. 
                  Berikut beberapa tips untuk pengalaman terbaik:
                </p>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center p-2 bg-white/60 rounded-lg border border-indigo-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-[11px] text-black font-medium">Klik nama layer untuk melihat detail legenda.</span>
                  </div>
                  <div className="flex gap-2 items-center p-2 bg-white/60 rounded-lg border border-indigo-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-[11px] text-black font-medium">Zoom-in peta untuk melihat lokasi pos lebih akurat.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`border-t border-gray-200 p-4 bg-gray-50/50 ${
          isMobile ? 'rounded-b-2xl pb-6' : 'rounded-bl-lg'
        }`}>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Map Layer Control</span>
            <div className="text-gray-400">Filter v1.0</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FilterPanel;