import React, { useState, useEffect } from 'react';
import LeveeChart from '../ui/LeveeChart';
import DualLineChart from '../ui/DualLineChart';
import { getStationThreshold } from '../../config/stationThresholds';
import { getStatusColor, getStatusText } from '../../utils/statusUtils';

/**
 * Komponen panel detail dengan layout two column
 * Menampilkan informasi lengkap tentang stasiun monitoring banjir
 */
const DetailPanel = ({ 
  isOpen, 
  onClose, 
  stationData, 
  chartHistory,
  isAutoSwitchOn = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('sensor'); // 'sensor' | 'cuaca' | 'monitoring' | 'riwayat'

  // Mengatur animasi visibility saat panel dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      // Animasi close - geser ke kiri dengan fade out
      setIsVisible(false);
    }
  }, [isOpen]);

  // Auto close detail panel saat auto switch berjalan
  useEffect(() => {
    if (isAutoSwitchOn && isOpen) {
      // Tutup detail panel dengan animasi saat auto switch aktif
      handleClose();
    }
  }, [isAutoSwitchOn]);

  // Handler untuk close dengan animasi
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Sama dengan durasi animasi
  };

  // Tidak render jika panel tidak dibuka atau data tidak ada
  if (!isOpen || !stationData) return null;

  return (
    <div className={`fixed top-20 left-96 right-80 bottom-0 bg-white transform transition-all duration-300 ease-in-out ${
      isVisible 
        ? 'translate-x-0 opacity-100 z-[50] shadow-2xl' 
        : '-translate-x-full opacity-0 z-[30] shadow-lg'
    } rounded-r-xl overflow-hidden`}
    style={{ willChange: 'transform, opacity' }}>
      <div className="h-full flex flex-col">
        {/* Header Panel */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 flex-shrink-0">
          {/* Baris judul + tombol close dengan alignment yang rapi */}
          <div className="flex items-center justify-between">
            {/* Bagian kiri - tombol back + judul */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                className="p-2 hover:bg-blue-700 hover:bg-opacity-50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Kembali"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h14" />
                </svg>
              </button>
              <div className="min-w-0">
                <h3 className="text-lg font-bold">Detail Informasi Stasiun</h3>
                <p className="text-sm text-blue-100 mt-0.5">{stationData.name}</p>
              </div>
            </div>
            
            {/* Bagian kanan - status info */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                {isAutoSwitchOn && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-700 bg-opacity-50 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Auto Switch
                  </div>
                )}
                <div className={`text-sm font-medium ${getStatusColor(stationData.status)}`}>{getStatusText(stationData.status)}</div>
              </div>
              <div className="text-xs text-blue-100">Update {new Date().toLocaleTimeString('id-ID')}</div>
            </div>
          </div>
          
          {/* Navigation tabs yang disempurnakan */}
          <div className="mt-6">
            <nav className="relative">
              <div className="flex items-center justify-center space-x-20 text-sm">
                {[
                  { key: 'sensor', label: 'Sensor' },
                  { key: 'cuaca', label: 'Cuaca' },
                  { key: 'monitoring', label: 'Monitoring' },
                  { key: 'riwayat', label: 'Riwayat' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative py-4 px-4 transition-all duration-200 ease-in-out ${
                      activeTab === tab.key 
                        ? 'text-white font-bold' 
                        : 'text-blue-100 hover:text-white font-medium'
                    }`}
                    role="tab"
                    aria-selected={activeTab === tab.key}
                  >
                    <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
                    {/* Active indicator yang lebih clean */}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              {/* Clean bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-400 bg-opacity-50" />
            </nav>
          </div>
        </div>

        {/* Konten Panel - Layout yang lebih rapi */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
          <div className="space-y-6">
            {/* Chart utama */}
            <div className="bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {activeTab === 'sensor' && 'Perkembangan Air Sungai Aktual'}
                  {activeTab === 'riwayat' && 'Riwayat Data'}
                  {activeTab === 'cuaca' && 'Cuaca'}
                  {activeTab === 'monitoring' && 'Aktual & Prediksi'}
                </h3>
                {activeTab === 'sensor' && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(stationData.status).replace('text-', 'bg-')}`}></div>
                      <span className={`text-sm font-medium ${getStatusColor(stationData.status)}`}>
                        {getStatusText(stationData.status)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">{stationData.location}</p>
              
              <div className="mt-4">
                {activeTab === 'sensor' && (() => {
                  const th = getStationThreshold(stationData.name);
                  const maxH = Math.max(th.alert ?? 4, stationData.value + 1);
                  return (
                    <LeveeChart
                      currentLevel={stationData.value}
                      unit={stationData.unit || 'm'}
                      maxHeight={maxH}
                      width={560}
                      height={220}
                      className="w-full"
                      historyData={chartHistory}
                      status={stationData.status}
                    />
                  );
                })()}
                {activeTab === 'riwayat' && (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">Riwayat data akan tersedia di sini.</div>
                )}
                {activeTab === 'cuaca' && (
                  <div className="space-y-4">
                    {/* Cuaca Saat Ini */}
                    <div className="mb-3">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Cuaca Saat Ini</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                           <div className="flex justify-center mb-2">
                            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600">Hujan Ringan</div>
                          <div className="text-lg font-bold text-blue-600">2.5 mm/jam</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="flex justify-center mb-2">
                            <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v6h-2z"/>
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600">Suhu</div>
                          <div className="text-lg font-bold text-orange-600">28°C</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="flex justify-center mb-2">
                            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M2 17h20v2H2zm1.15-4.05L4 12l.85.95L6 11.5l.85.95L8 11l-.85-.95L6 12.5l-.85-.95L4 13l-.85-.95zM6 5l.85.95L8 4.5l.85.95L10 4l-.85-.95L8 5.5l-.85-.95L6 6l-.85-.95L4 7l-.85-.95L2 6l.85-.95L4 4.5l.85-.95L6 5zm12 0l.85.95L20 4.5l.85.95L22 4l-.85-.95L20 5.5l-.85-.95L18 6l-.85-.95L16 7l-.85-.95L14 6l.85-.95L16 4.5l.85-.95L18 5z"/>
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600">Kecepatan Angin</div>
                          <div className="text-lg font-bold text-green-600">12 km/jam</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="flex justify-center mb-2">
                            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C9.24 2 7 4.24 7 7c0 1.5.62 2.85 1.61 3.82L12 14.17l3.39-3.35C16.38 9.85 17 8.5 17 7c0-2.76-2.24-5-5-5zm0 7.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 4.5 12 4.5s2.5 1.12 2.5 2.5S13.38 9.5 12 9.5zM12 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600">Kelembaban</div>
                          <div className="text-lg font-bold text-blue-600">85%</div>
                        </div>
                      </div>
                    </div>

                    {/* Indikator Risiko Banjir */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Indikator Risiko Banjir</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="flex justify-center mb-2">
                            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-yellow-800">Risiko Sedang</div>
                          <div className="text-xs text-yellow-600 mt-1">Curah hujan tinggi</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="flex justify-center mb-2">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-green-800">Drainase Normal</div>
                          <div className="text-xs text-green-600 mt-1">Sistem berfungsi baik</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                          <div className="flex justify-center mb-2">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 3v18h18v-2H5V3H3zm4 12h2v2H7v-2zm0-4h2v2H7v-2zm0-4h2v2H7V7zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7z"/>
                            </svg>
                          </div>
                          <div className="text-sm font-bold text-blue-800">Monitoring Aktif</div>
                          <div className="text-xs text-blue-600 mt-1">Update setiap 15 menit</div>
                        </div>
                      </div>
                    </div>

                    {/* Rekomendasi */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
                      <h4 className="text-lg font-bold text-amber-800 mb-2">Rekomendasi</h4>
                      <ul className="text-sm text-amber-700 space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-2"></span>
                          Waspada terhadap peningkatan intensitas hujan pada sore hari
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-2"></span>
                          Pantau terus level air sungai setiap 15 menit
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-2"></span>
                          Siapkan rencana evakuasi jika level air mencapai 2.5m
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-2"></span>
                          Koordinasi dengan tim darurat jika diperlukan
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                {activeTab === 'monitoring' && (() => {
                  const actual = chartHistory || [];
                  const predicted = (chartHistory || []).map((v, i) => {
                    const prev = i === 0 ? v : chartHistory[i - 1];
                    const drift = (v - prev) * 0.6;
                    return Math.max(0, v + drift);
                  });
                  return (
                    <DualLineChart
                      actual={actual}
                      predicted={predicted}
                      width={640}
                      height={320}
                      className="w-full"
                      canvasId="dual-line-detail"
                    />
                  );
                })()}
              </div>
            </div>

            {/* Kartu kedua: Konfigurasi Prediksi - hanya untuk tab sensor */}
            {activeTab === 'sensor' && (
              <div className="bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Prediksi</h3>
                  <p className="text-sm text-gray-500 mt-1">Parameter dan threshold untuk prediksi banjir</p>
                </div>
                <div>
                  {(() => {
                    const th = getStationThreshold(stationData.name);
                    const maxH = Math.max(th.alert ?? 4, stationData.value + 1);
                    return (
                      <LeveeChart
                        currentLevel={stationData.value}
                        unit={stationData.unit || 'm'}
                        maxHeight={maxH}
                        width={560}
                        height={220}
                        className="w-full"
                        historyData={chartHistory}
                        status={stationData.status}
                      />
                    );
                  })()}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;