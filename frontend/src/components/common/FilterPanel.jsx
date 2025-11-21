// src/components/FilterPanel.jsx

import React, { useEffect, useState } from "react";
import { Sliders, ToggleRight, Layers, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

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
  autoSwitchMode = 'station',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLayers, setShowLayers] = useState(false); // ✅ Collapsible Map Layers
  const [showLegend, setShowLegend] = useState(false); // ✅ Collapsible Legenda Peta

  // ✅ Tambahkan state untuk section baru
  const [showPetaGenangan, setShowPetaGenangan] = useState(false);
  const [showKabupatenKota, setShowKabupatenKota] = useState(false);
  const [showWilayahSungai, setShowWilayahSungai] = useState(false);
  const [showDaerahAliranSungai, setShowDaerahAliranSungai] = useState(false);
  const [showSamplingAir, setShowSamplingAir] = useState(false);
  const [showSensorBanjir, setShowSensorBanjir] = useState(false);
  const [showPosTinggiMukaAir, setShowPosTinggiMukaAir] = useState(false);
  const [showPosHujan, setShowPosHujan] = useState(false);
  const [showPosDugaAir, setShowPosDugaAir] = useState(false);
  const [showHujanHarian, setShowHujanHarian] = useState(false);
  const [showLainnya, setShowLainnya] = useState(false);

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
      {/* Tombol buka filter */}
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
          pointerEvents: isVisible ? "auto" : "none",
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
          {/* SECTION 1: MAP LAYERS */}
          <section className="mt-4 space-y-4">
            {/* Header Map Layers + Panah */}
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

            {/* Isi Layers — MUNCUL SAAT showLayers = true */}
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

          {/* SECTION 2: LEGENDA PETA */}
          <section className="mt-4 space-y-4">
            {/* Header Legenda Peta + Panah */}
            <div
              onClick={() => setShowLegend(!showLegend)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                {/* Ikon legenda — bisa gunakan Layers atau custom */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-600">
                  <path d="M12 2L2 7l10 5 10-5M2 12l10 5 10-5M2 7v10l10 5m0 0v-10M12 12v10l10-5M12 12L2 7m10 5v10"/>
                </svg>
                <span className="font-semibold text-gray-700">Legenda Peta</span>
              </div>
              {showLegend ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </div>

            {/* Isi Legenda Peta — MUNCUL SAAT showLegend = true */}
            {showLegend && (
              <div className="pl-4 pt-2 pb-4 space-y-3">
                {/* Data Master */}
                <div>
                  <div className="font-medium text-xs text-gray-600 mb-1">Data Master</div>
                  <div className="space-y-1 pl-2">
                    {[
                      { id: "dinas-pusda", name: "Dinas PUSDA Jatim", color: "#00008B" },
                      { id: "upt-welang-pekalen", name: "UPT PSDA Welang Pekalen Pasuruan", color: "#00008B" },
                      { id: "upt-madura", name: "UPT PSDA Madura Pamekasan", color: "#00008B" },
                      { id: "upt-bengawan-solo", name: "UPT PSDA Bengawan Solo Bojonegoro", color: "#00008B" },
                      { id: "upt-brantas", name: "UPT PSDA Brantas Kediri", color: "#00008B" },
                      { id: "upt-sampean", name: "UPT PSDA Sampean Setail Bondowoso", color: "#00008B" },
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
              </div>
            )}
          </section>

          {/* SECTION 10: POS HUJAN */}
          <section className="mt-4 space-y-4">
            <div
              onClick={() => setShowPosHujan(!showPosHujan)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-600">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2 2-2m2 4l2-2-2-2m2 4l2-2 2 2"/>
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
                  { id: "pos-hujan-ws-brantas-pjt1", name: "Pos Hujan WS Brantas PJT 1", color: "#FF6347" },
                  { id: "pos-hujan-ws-bengawan-solo", name: "Pos Hujan WS Bengawan Solo PJT 1", color: "#FFA500" },
                  { id: "Hujan Jam-Jam an PU SDA", name: "Hujan Jam-Jam an PU SDA", color: "#FF6347" },
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
            )}
          </section>

          {/* SECTION 11: POS DUGA AIR */}
          <section className="mt-4 space-y-4">
            <div
              onClick={() => setShowPosDugaAir(!showPosDugaAir)}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-600">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-2-2 2-2m2 4l2-2-2-2m2 4l2-2 2 2"/>
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
                  { id: "pos-duga-air-ws-brantas-pjt1", name: "Pos Duga Air WS Brantas PJT 1", color: "#FF6347" },
                  { id: "pos-duga-air-ws-bengawan-solo", name: "Pos Duga Air WS Bengawan Solo PJT 1", color: "#FFA500" },
                  { id: "pos-duga-air-jam-jam-an", name: "Pos Duga Air Jam-jam an PU SDA", color: "#008080" },
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
            )}
          </section>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-xs text-amber-800">
                <div className="font-medium">Layer Control</div>
                <div className="mt-1">Klik toggle untuk mengaktifkan/menonaktifkan layer.</div>
                <div className="mt-1">Klik panah di sebelah "Map Layers" atau "Legenda Peta" untuk melihat detailnya.</div>
              </div>
            </div>
          </div>
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