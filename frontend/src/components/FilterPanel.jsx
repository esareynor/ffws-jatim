// src/components/FilterPanel.jsx

import React, { useEffect, useState } from "react";
import { Sliders, ToggleRight, Layers, AlertTriangle } from "lucide-react";
import AutoSwitchToggle from "./devices/AutoSwitchToggle"; // Perhatikan titik (.)
const FilterPanel = ({
  isOpen,
  onOpen,
  onClose,
  subtitle,
  widthClass = "w-80",
  tickerData,
  handleStationChange,
  handleRegionChange, // New prop
  currentStationIndex,
  currentRegionIndex, // New prop
  handleAutoSwitchToggle,
  onLayerToggle = () => {},
  activeLayers = {},
  administrativeRegions = [], // New prop
  autoSwitchMode = 'station', // New prop
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const layersData = [
    { id: "rivers", name: "Sungai", color: "#06B6D4" },
    { id: "flood-risk", name: "Area Risiko Banjir", color: "#F59E0B" },
    { id: "rainfall", name: "Data Curah Hujan", color: "#10B981" },
    { id: "elevation", name: "Elevasi Terrain", color: "#8B5CF6" },
    { id: "administrative", name: "Batas Administrasi", color: "#6B7280" }
  ];

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // ✅ Hanya kirim layerId
  const handleLayerToggle = (layerId) => {
    console.log("🖱️ Klik layer di FilterPanel:", layerId);
    if (typeof onLayerToggle === 'function') {
      onLayerToggle(layerId);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Tombol buka filter (di luar panel) */}
      <div className="absolute top-4 right-4 z-[80]">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpen();
          }}
          className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-blue-50 transition-colors shadow-md"
          title="Buka Filter"
          aria-label="Buka Filter"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 w-6 h-6 text-blue-600">
            <path d="M22 3H2l8 9v7l4 2v-9l8-9z"></path>
          </svg>
        </button>
      </div>

      {/* Panel Filter */}
      <div
        className={`fixed rounded-tl-lg rounded-bl-lg top-20 right-0 h-[calc(80%-8%)] ${widthClass} bg-white shadow-2xl z-[1000] transform transition-all duration-300 ease-in-out flex flex-col ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{
          pointerEvents: isVisible ? "auto" : "none", // ✅ KUNCI INTERAKSI
          willChange: "transform, opacity"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="rounded-tl-lg flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Filter &amp; Controls</h2>
              {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
            </div>
          </div>
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
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          {/* Auto Switch */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ToggleRight className="w-4 h-4 text-blue-600" />
              Device Auto Switch
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <AutoSwitchToggle
                tickerData={tickerData}
                administrativeRegions={administrativeRegions}
                autoSwitchMode={autoSwitchMode}
                onStationChange={handleStationChange}
                onRegionChange={handleRegionChange}
                currentStationIndex={currentStationIndex}
                currentRegionIndex={currentRegionIndex}
                onAutoSwitchToggle={handleAutoSwitchToggle}
                interval={5000}
                stopDelay={5000}
              />
            </div>
          </section>

          {/* Layers */}
          <section className="mt-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              Map Layers
            </h3>
            <div className="space-y-3">
              {layersData.map((layer) => (
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

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <div className="font-medium">Layer Control</div>
                  <div className="mt-1">Klik toggle untuk mengaktifkan/menonaktifkan layer.</div>
                  <div className="mt-1">Layer "Batas Administrasi" akan memuat data wilayah saat diaktifkan.</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="rounded-bl-lg border-t border-gray-200 p-4 bg-gray-50/50">
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