import React, { useState, useEffect, useMemo } from 'react';
import { getStatusColor, getStatusBgColor, getStatusText } from '../../utils/statusUtils';

const StationDetail = ({ selectedStation, onClose, tickerData, showArrow = false, onArrowToggle, isDetailPanelOpen = false, onCloseDetailPanel }) => {
  const [stationData, setStationData] = useState(null);
  
  useEffect(() => {
    if (selectedStation && tickerData) {
      const foundStation = tickerData.find(station => station.id === selectedStation.id);
      if (foundStation) {
        setStationData(foundStation);
      }
    }
  }, [selectedStation, tickerData]);

  
  if (!selectedStation || !stationData) {
    return null;
  }
  
  // Data alamat untuk setiap stasiun
  const addressInfo = {
    fullAddress: 'Jl. Gubernur Suryo No. 15, Kelurahan Genteng, Kecamatan Genteng, Kota Surabaya, Provinsi Jawa Timur, 60275',
    coordinates: `${stationData.location}`,
    elevation: '5.2 m di atas permukaan laut',
    watershed: 'Kali Mas',
    administrativeArea: 'Kelurahan Genteng'
  };
  
  // Fungsi untuk menghasilkan data sensor yang berbeda untuk setiap stasiun
  const getLocationSensors = (stationName) => {
    // Base sensors yang ada di semua stasiun
    const baseSensors = [
      {
        id: 'SN-001',
        name: 'Water Level Sensor',
        type: 'Ultrasonic Distance Sensor',
        model: 'HC-SR04',
        status: 'active',
        installationDate: '15 Januari 2023',
        lastCalibration: '10 Maret 2024',
        batteryLevel: '87%',
        description: 'Mengukur ketinggian air sungai secara real-time'
      },
      {
        id: 'SN-002',
        name: 'Rainfall Sensor',
        type: 'Tipping Bucket Rain Gauge',
        model: 'RG-200',
        status: 'active',
        installationDate: '20 Januari 2023',
        lastCalibration: '15 Maret 2024',
        batteryLevel: '92%',
        description: 'Mengukur intensitas curah hujan di lokasi stasiun'
      }
    ];
    
    // Sensor tambahan berdasarkan stasiun
    const additionalSensors = {};
    
    additionalSensors['Stasiun Surabaya'] = [
      {
        id: 'SN-003',
        name: 'Water Flow Sensor',
        type: 'Electromagnetic Flow Meter',
        model: 'EMF-500',
        status: 'active',
        installationDate: '25 Januari 2023',
        lastCalibration: '20 Maret 2024',
        batteryLevel: '78%',
        description: 'Mengukur kecepatan aliran air sungai'
      },
      {
        id: 'SN-004',
        name: 'Water Quality Sensor',
        type: 'Multiparameter Water Quality Sonde',
        model: 'WQS-3000',
        status: 'maintenance',
        installationDate: '30 Januari 2023',
        lastCalibration: '25 Februari 2024',
        batteryLevel: '65%',
        description: 'Mengukur pH, kekeruhan, dan suhu air'
      },
      {
        id: 'SN-005',
        name: 'Camera CCTV',
        type: 'Weatherproof IP Camera',
        model: 'CCTV-4000',
        status: 'active',
        installationDate: '5 Februari 2023',
        lastCalibration: '1 Maret 2024',
        batteryLevel: 'N/A (terhubung listrik)',
        description: 'Memantau kondisi visual lokasi stasiun'
      }
    ];
    
    additionalSensors['Stasiun Malang'] = [
      {
        id: 'SN-003',
        name: 'Water Flow Sensor',
        type: 'Electromagnetic Flow Meter',
        model: 'EMF-500',
        status: 'active',
        installationDate: '28 Januari 2023',
        lastCalibration: '22 Maret 2024',
        batteryLevel: '82%',
        description: 'Mengukur kecepatan aliran air sungai'
      },
      {
        id: 'SN-004',
        name: 'Camera CCTV',
        type: 'Weatherproof IP Camera',
        model: 'CCTV-4000',
        status: 'active',
        installationDate: '8 Februari 2023',
        lastCalibration: '3 Maret 2024',
        batteryLevel: 'N/A (terhubung listrik)',
        description: 'Memantau kondisi visual lokasi stasiun'
      }
    ];
    
    additionalSensors['Stasiun Sidoarjo'] = [
      {
        id: 'SN-003',
        name: 'Water Quality Sensor',
        type: 'Multiparameter Water Quality Sonde',
        model: 'WQS-3000',
        status: 'active',
        installationDate: '2 Februari 2023',
        lastCalibration: '27 Februari 2024',
        batteryLevel: '70%',
        description: 'Mengukur pH, kekeruhan, dan suhu air'
      },
      {
        id: 'SN-004',
        name: 'Camera CCTV',
        type: 'Weatherproof IP Camera',
        model: 'CCTV-4000',
        status: 'active',
        installationDate: '10 Februari 2023',
        lastCalibration: '5 Maret 2024',
        batteryLevel: 'N/A (terhubung listrik)',
        description: 'Memantau kondisi visual lokasi stasiun'
      },
      {
        id: 'SN-005',
        name: 'Water Pressure Sensor',
        type: 'Pressure Transducer',
        model: 'PT-100',
        status: 'active',
        installationDate: '15 Februari 2023',
        lastCalibration: '10 Maret 2024',
        batteryLevel: '85%',
        description: 'Mengukur tekanan air pada pipa pengukur'
      }
    ];
    
    additionalSensors['Stasiun Probolinggo'] = [
      {
        id: 'SN-003',
        name: 'Water Flow Sensor',
        type: 'Electromagnetic Flow Meter',
        model: 'EMF-500',
        status: 'active',
        installationDate: '1 Februari 2023',
        lastCalibration: '25 Februari 2024',
        batteryLevel: '75%',
        description: 'Mengukur kecepatan aliran air sungai'
      },
      {
        id: 'SN-004',
        name: 'Sediment Sensor',
        type: 'Optical Sediment Sensor',
        model: 'OSS-200',
        status: 'maintenance',
        installationDate: '5 Februari 2023',
        lastCalibration: '28 Februari 2024',
        batteryLevel: '68%',
        description: 'Mengukur kadar sedimen dalam air'
      }
    ];
    
    additionalSensors['Stasiun Pasuruan'] = [
      {
        id: 'SN-003',
        name: 'Water Quality Sensor',
        type: 'Multiparameter Water Quality Sonde',
        model: 'WQS-3000',
        status: 'active',
        installationDate: '7 Februari 2023',
        lastCalibration: '4 Maret 2024',
        batteryLevel: '72%',
        description: 'Mengukur pH, kekeruhan, dan suhu air'
      },
      {
        id: 'SN-004',
        name: 'Camera CCTV',
        type: 'Weatherproof IP Camera',
        model: 'CCTV-4000',
        status: 'active',
        installationDate: '12 Februari 2023',
        lastCalibration: '7 Maret 2024',
        batteryLevel: 'N/A (terhubung listrik)',
        description: 'Memantau kondisi visual lokasi stasiun'
      }
    ];
    
    // Default untuk stasiun lainnya
    const defaultSensors = [
      {
        id: 'SN-003',
        name: 'Camera CCTV',
        type: 'Weatherproof IP Camera',
        model: 'CCTV-4000',
        status: 'active',
        installationDate: '15 Februari 2023',
        lastCalibration: '10 Maret 2024',
        batteryLevel: 'N/A (terhubung listrik)',
        description: 'Memantau kondisi visual lokasi stasiun'
      }
    ];
    
    // Menggabungkan base sensors dengan additional sensors berdasarkan stasiun
    const stationAdditionalSensors = additionalSensors[stationName] || defaultSensors;
    return [...baseSensors, ...stationAdditionalSensors];
  };
  
  // Mendapatkan data sensor untuk stasiun yang dipilih
  const locationSensors = getLocationSensors(stationData.name);
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Aktif</span>;
      case 'maintenance':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Perawatan</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Nonaktif</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Tidak Diketahui</span>;
    }
  };
  
  // Fungsi untuk menangani klik tombol di bagian bawah
  const handleBottomButtonClick = () => {
    if (isDetailPanelOpen) {
      // Jika detail panel sudah terbuka, tutup panel
      if (onCloseDetailPanel) {
        onCloseDetailPanel();
      }
    } else {
      // Jika detail panel belum terbuka, buka panel
      if (onArrowToggle) {
        onArrowToggle();
      }
    }
  };
  
  // Fungsi untuk menangani tombol close di header
  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Close button clicked');
    
    // Panggil onClose jika tersedia
    if (onClose) {
      onClose();
    }
    
    // Jika detail panel terbuka, tutup juga detail panel
    if (isDetailPanelOpen && onCloseDetailPanel) {
      onCloseDetailPanel();
    }
    
    return false;
  };
  
  return (
    <div className="fixed top-20 left-0 bottom-0 max-w-sm flex z-50">
      <div className="relative w-screen max-w-sm">
        <div className="h-full flex flex-col bg-white shadow-2xl rounded-r-xl overflow-hidden">
          {/* Header Section */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{stationData.name}</h2>
                <p className="mt-1 text-sm text-blue-100">{stationData.location}</p>
              </div>
              <button
                type="button"
                className="rounded-full p-1.5 bg-blue-700 bg-opacity-50 hover:bg-opacity-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={handleCloseClick}
                aria-label="Tutup panel"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-5 space-y-6 pb-20">
              {/* Status Card */}
              <div className={`p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${getStatusBgColor(stationData.status)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status Saat Ini</p>
                    <p className={`text-xl font-bold ${getStatusColor(stationData.status)}`}>
                      {getStatusText(stationData.status)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">
                      {stationData.value.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500">{stationData.unit}</p>
                  </div>
                </div>
              </div>
              
              {/* Address Information */}
              <div className="bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
                <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Alamat Lengkap
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Alamat Lengkap</span>
                    <span className="text-sm font-medium text-gray-900 block">{addressInfo.fullAddress}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100">
                      <span className="text-xs text-gray-500 block mb-1">Koordinat</span>
                      <span className="text-sm font-medium text-gray-900 block">{addressInfo.coordinates}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100">
                      <span className="text-xs text-gray-500 block mb-1">Ketinggian</span>
                      <span className="text-sm font-medium text-gray-900 block">{addressInfo.elevation}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100">
                      <span className="text-xs text-gray-500 block mb-1">DAS</span>
                      <span className="text-sm font-medium text-gray-900 block">{addressInfo.watershed}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100">
                      <span className="text-xs text-gray-500 block mb-1">Area Administratif</span>
                      <span className="text-sm font-medium text-gray-900 block">{addressInfo.administrativeArea}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location Sensors */}
              <div className="bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-base font-bold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Sensor di Lokasi
                  </h4>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{locationSensors.length} sensor</span>
                </div>
                <div className="space-y-4">
                  {locationSensors.map((sensor) => (
                    <div key={sensor.id} className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:bg-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">{sensor.name}</h5>
                          <p className="text-xs text-gray-500">{sensor.type}</p>
                        </div>
                        {getStatusBadge(sensor.status)}
                      </div>
                      <div className="text-sm text-gray-600 mb-3">{sensor.description}</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-2 transition-all duration-300 hover:bg-gray-50">
                          <span className="text-xs text-gray-500 block">Model:</span>
                          <span className="text-sm font-medium text-gray-900 block">{sensor.model}</span>
                        </div>
                        <div className="bg-white rounded-lg p-2 transition-all duration-300 hover:bg-gray-50">
                          <span className="text-xs text-gray-500 block">Baterai:</span>
                          <span className="text-sm font-medium text-gray-900 block">{sensor.batteryLevel}</span>
                        </div>
                        <div className="bg-white rounded-lg p-2 transition-all duration-300 hover:bg-gray-50">
                          <span className="text-xs text-gray-500 block">Instalasi:</span>
                          <span className="text-sm font-medium text-gray-900 block">{sensor.installationDate}</span>
                        </div>
                        <div className="bg-white rounded-lg p-2 transition-all duration-300 hover:bg-gray-50">
                          <span className="text-xs text-gray-500 block">Kalibrasi:</span>
                          <span className="text-sm font-medium text-gray-900 block">{sensor.lastCalibration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Detail Panel Toggle */}
          {showArrow && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center">
              <button
                onClick={handleBottomButtonClick}
                className="flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {isDetailPanelOpen ? (
                  <>
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Kembali ke Ringkasan
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Lihat Detail Lengkap
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationDetail;