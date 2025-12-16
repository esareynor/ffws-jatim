// src/components/devices/CoordinateDebugger.jsx
import React, { useState, useEffect } from 'react';

/**
 * Component untuk debugging koordinat station
 * Menampilkan perbandingan antara tickerData dan devices data
 */
const CoordinateDebugger = ({ tickerData, devices, isVisible, onClose }) => {
  const [debugInfo, setDebugInfo] = useState([]);
  const [filter, setFilter] = useState('all'); // all, mismatched, missing

  useEffect(() => {
    if (!tickerData || !devices) return;

    const info = tickerData.map(station => {
      // Cari device berdasarkan nama station
      const device = devices.find(d => d.name === station.name);
      
      // Koordinat dari station (jika ada di tickerData)
      const stationLat = station.latitude;
      const stationLng = station.longitude;
      
      // Koordinat dari device (data utama)
      const deviceLat = device?.latitude;
      const deviceLng = device?.longitude;
      
      // Parse koordinat
      const parsedDeviceLat = deviceLat ? parseFloat(deviceLat) : null;
      const parsedDeviceLng = deviceLng ? parseFloat(deviceLng) : null;
      const parsedStationLat = stationLat ? parseFloat(stationLat) : null;
      const parsedStationLng = stationLng ? parseFloat(stationLng) : null;
      
      // Validasi koordinat Jawa Timur
      // Jawa Timur: Lat ~-6.5 to -8.5, Lng ~111 to 114.5
      const isValidLat = parsedDeviceLat && parsedDeviceLat >= -9 && parsedDeviceLat <= -6;
      const isValidLng = parsedDeviceLng && parsedDeviceLng >= 110 && parsedDeviceLng <= 115;
      const isInJatim = isValidLat && isValidLng;
      
      // Check jika koordinat terbalik (lat/lng swap)
      const isPossiblySwapped = 
        parsedDeviceLat && parsedDeviceLng &&
        (parsedDeviceLat > 100 || parsedDeviceLng < 0);
      
      return {
        name: station.name,
        deviceFound: !!device,
        deviceId: device?.id || 'N/A',
        
        // Koordinat dari device (sumber utama)
        deviceLat: deviceLat || 'Missing',
        deviceLng: deviceLng || 'Missing',
        parsedDeviceLat,
        parsedDeviceLng,
        
        // Koordinat dari station (jika ada)
        stationLat: stationLat || 'N/A',
        stationLng: stationLng || 'N/A',
        parsedStationLat,
        parsedStationLng,
        
        // Status validasi
        isInJatim,
        isPossiblySwapped,
        hasCoordinates: !!(parsedDeviceLat && parsedDeviceLng),
        
        // Mismatched check
        hasMismatch: device && stationLat && stationLng && (
          Math.abs(parsedDeviceLat - parsedStationLat) > 0.001 ||
          Math.abs(parsedDeviceLng - parsedStationLng) > 0.001
        )
      };
    });

    setDebugInfo(info);
  }, [tickerData, devices]);

  if (!isVisible) return null;

  const filteredInfo = debugInfo.filter(item => {
    if (filter === 'missing') return !item.hasCoordinates;
    if (filter === 'mismatched') return item.hasMismatch || item.isPossiblySwapped || !item.isInJatim;
    return true;
  });

  const stats = {
    total: debugInfo.length,
    withCoordinates: debugInfo.filter(d => d.hasCoordinates).length,
    missing: debugInfo.filter(d => !d.hasCoordinates).length,
    invalid: debugInfo.filter(d => d.hasCoordinates && !d.isInJatim).length,
    swapped: debugInfo.filter(d => d.isPossiblySwapped).length,
    mismatched: debugInfo.filter(d => d.hasMismatch).length
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
          <div>
            <h2 className="text-xl font-bold">🔍 Coordinate Debugger</h2>
            <p className="text-sm text-blue-100 mt-1">
              Analisis koordinat station pada peta
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Statistics */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Station</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-2xl font-bold text-green-600">{stats.withCoordinates}</div>
              <div className="text-xs text-gray-600">Dengan Koordinat</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-2xl font-bold text-red-600">{stats.missing}</div>
              <div className="text-xs text-gray-600">Koordinat Hilang</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{stats.invalid}</div>
              <div className="text-xs text-gray-600">Di Luar Jatim</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{stats.swapped}</div>
              <div className="text-xs text-gray-600">Kemungkinan Tertukar</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">{stats.mismatched}</div>
              <div className="text-xs text-gray-600">Tidak Cocok</div>
            </div>
          </div>

          {/* Filter */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Semua ({debugInfo.length})
            </button>
            <button
              onClick={() => setFilter('mismatched')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'mismatched' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Bermasalah ({stats.invalid + stats.swapped + stats.mismatched})
            </button>
            <button
              onClick={() => setFilter('missing')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'missing' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Hilang ({stats.missing})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left border-b font-semibold text-gray-700">Station Name</th>
                  <th className="px-3 py-2 text-left border-b font-semibold text-gray-700">Device ID</th>
                  <th className="px-3 py-2 text-center border-b font-semibold text-gray-700">Latitude (Device)</th>
                  <th className="px-3 py-2 text-center border-b font-semibold text-gray-700">Longitude (Device)</th>
                  <th className="px-3 py-2 text-center border-b font-semibold text-gray-700">Status</th>
                  <th className="px-3 py-2 text-center border-b font-semibold text-gray-700">Google Maps</th>
                </tr>
              </thead>
              <tbody>
                {filteredInfo.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-3 py-8 text-center text-gray-500">
                      Tidak ada data untuk filter ini
                    </td>
                  </tr>
                ) : (
                  filteredInfo.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 border-b">
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-3 py-2 border-b text-gray-600">
                        {item.deviceId}
                      </td>
                      <td className="px-3 py-2 border-b text-center">
                        <code className={`text-xs px-2 py-1 rounded ${
                          item.parsedDeviceLat ? 'bg-gray-100' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.deviceLat}
                        </code>
                      </td>
                      <td className="px-3 py-2 border-b text-center">
                        <code className={`text-xs px-2 py-1 rounded ${
                          item.parsedDeviceLng ? 'bg-gray-100' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.deviceLng}
                        </code>
                      </td>
                      <td className="px-3 py-2 border-b">
                        <div className="flex flex-col gap-1 items-center">
                          {!item.hasCoordinates && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded font-medium">
                              ❌ Missing
                            </span>
                          )}
                          {item.hasCoordinates && !item.isInJatim && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">
                              ⚠️ Di Luar Jatim
                            </span>
                          )}
                          {item.isPossiblySwapped && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                              🔄 Tertukar?
                            </span>
                          )}
                          {item.hasMismatch && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">
                              ⚡ Tidak Cocok
                            </span>
                          )}
                          {item.hasCoordinates && item.isInJatim && !item.isPossiblySwapped && !item.hasMismatch && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                              ✅ Valid
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 border-b text-center">
                        {item.parsedDeviceLat && item.parsedDeviceLng ? (
                          <a
                            href={`https://www.google.com/maps?q=${item.parsedDeviceLat},${item.parsedDeviceLng}&ll=${item.parsedDeviceLat},${item.parsedDeviceLng}&z=15`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            Buka
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <strong>Catatan:</strong> 
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Koordinat Jawa Timur yang valid: Latitude ~-6.5 hingga -8.5, Longitude ~111 hingga 114.5</li>
              <li>Status "Tertukar" menandakan kemungkinan latitude dan longitude tertukar posisi</li>
              <li>Gunakan tombol "Buka" untuk memverifikasi lokasi di Google Maps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinateDebugger;
