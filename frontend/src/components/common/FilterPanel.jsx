import React, { useEffect, useState } from "react";
import AutoSwitchToggle from "../devices/AutoSwitchToggle";
import { Sliders, ToggleLeft, ToggleRight, Layers, Keyboard, AlertTriangle } from "lucide-react";

/**
 * FilterPanel
 * A responsive panel that slides in from the right on desktop and from the bottom on mobile.
 * Intended to host filter controls like AutoSwitchToggle, checkboxes, etc.
 */
const FilterPanel = ({
  isOpen,
  onOpen, // tambahkan prop baru untuk membuka panel
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
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("controls");
  const [isMobile, setIsMobile] = useState(false);
  const [layersState, setLayersState] = useState([
    { id: "stations", name: "Stasiun Monitoring", color: "#3B82F6", enabled: false},
    { id: "rivers", name: "Sungai", color: "#06B6D4", enabled: false },
    { id: "flood-risk", name: "Area Risiko Banjir", color: "#F59E0B", enabled: false },
    { id: "rainfall", name: "Data Curah Hujan", color: "#10B981", enabled: false },
    { id: "elevation", name: "Elevasi Terrain", color: "#8B5CF6", enabled: false },
    { id: "administrative", name: "Batas Administrasi", color: "#6B7280", enabled: false }
  ]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300); // Delay untuk transisi
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle swipe down to close on mobile
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    const touch = e.touches ? e.touches[0] : e;
    const startY = touch.clientY;
    
    const handleTouchMove = (e) => {
      const currentTouch = e.touches ? e.touches[0] : e;
      const currentY = currentTouch.clientY;
      const deltaY = currentY - startY;
      
      // If swiping down more than 100px, close the panel
      if (deltaY > 100) {
        setIsVisible(false);
        setTimeout(() => {
          onClose && onClose();
        }, 300);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('mousemove', handleTouchMove);
        document.removeEventListener('mouseup', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousemove', handleTouchMove);
      document.removeEventListener('mouseup', handleTouchEnd);
    };
    
    if (e.type === 'touchstart') {
      document.addEventListener('touchmove', handleTouchMove);
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
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  const handleLayerToggle = (layerId) => {
    setLayersState((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  // Tombol trigger filter
  // Selalu tampil di kanan atas, di luar panel
  // Panel tetap muncul seperti biasa
  return (
    <>
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-[80] h-12">
        <button
          onClick={onOpen}
          className="relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-blue-50 transition-colors shadow-lg"
          title="Buka Filter"
          aria-label="Buka Filter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 w-6 h-6 text-blue-600 mix-blend-normal pointer-events-none">
            <path d="M22 3H2l8 9v7l4 2v-9l8-9z"></path>
          </svg>
        </button>
      </div>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
        <div
              className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              onClose && onClose();
            }, 300);
          }}
        />
      )}

          {/* Panel */}
          <div
            className={`fixed bg-white shadow-2xl z-[70] transform transition-all duration-300 ease-in-out flex flex-col ${
              isMobile 
                ? `bottom-0 left-0 right-0 h-[75vh] rounded-t-2xl ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`
                : `top-16 sm:top-20 right-2 sm:right-0 h-[calc(100vh-2rem)] sm:h-[calc(80%-8%)] w-[75%] sm:w-50 md:w-82 max-w-[300px] sm:max-w-none rounded-lg ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                  }`
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          {/* Header */}
          <div 
            className={`flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50/50 ${
              isMobile ? 'rounded-t-2xl' : 'rounded-t-lg'
            }`}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div 
                className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-300 rounded-full cursor-pointer"
                onTouchStart={handleTouchStart}
                onMouseDown={handleTouchStart}
              ></div>
            )}
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Filter &amp; Controls</h2>
                {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
              </div>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  onClose && onClose();
                }, 300);
              }}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
              title="Tutup"
              aria-label="Tutup panel filter"
            >
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 ${
            isMobile ? 'pb-6' : ''
          }`}>
            {/* Section Controls */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ToggleRight className="w-4 h-4 text-blue-600" />
                Device Auto Switch
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <AutoSwitchToggle
                  tickerData={tickerData}
                  onStationChange={handleStationChange}
                  currentStationIndex={currentStationIndex}
                  onAutoSwitchToggle={handleAutoSwitchToggle}
                />
              </div>
            </section>

            {/* Section Layers */}
            <section className="mt-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Map Layers
              </h3>
              <div className="space-y-3">
                {layersState.map((layer) => (
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
                        layer.enabled ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      type="button"
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          layer.enabled ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div className="text-xs text-amber-800">
                    <div className="font-medium">Layer Control</div>
                    <div className="mt-1">Beberapa layer mungkin memerlukan waktu loading tambahan.</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className={`border-t border-gray-200 p-4 bg-gray-50/50 ${
            isMobile ? 'rounded-b-2xl pb-6' : 'rounded-b-lg'
          }`}>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                {/* <div className="flex items-center gap-1">
                  <Keyboard className="w-3 h-3" />
                  <span>ESC to close</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Ctrl+Tab to switch</span>
                </div> */}
              <div className="flex items-center gap-1">
                <span>Map Layer Control</span>
                </div>
              </div>
              <div className="text-gray-400">Filter v1.0</div>
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
};

export default FilterPanel;
