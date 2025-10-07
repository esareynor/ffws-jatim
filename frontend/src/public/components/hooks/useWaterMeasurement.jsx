import { useState, useEffect } from 'react';

export const useWaterMeasurement = (map) => {
  const [measurementActive, setMeasurementActive] = useState(false);
  const [measurementData, setMeasurementData] = useState({
    visible: false,
    coordinates: null,
    elevation: null,
    status: null,
    statusColor: null
  });

  const toggleWaterMeasurement = () => {
    if (!map.current) return;
    
    const newActiveState = !measurementActive;
    console.log('Toggling measurement mode:', newActiveState);
    
    // Tutup popup pengukuran jika menonaktifkan
    if (!newActiveState) {
      setMeasurementData({
        visible: false,
        coordinates: null,
        elevation: null,
        status: null,
        statusColor: null
      });
    }
    
    setMeasurementActive(newActiveState);
    
    if (newActiveState) {
      // Tambahkan event listener untuk klik pada peta
      map.current.getCanvas().style.cursor = 'crosshair';
      map.current.on('click', handleMapClickForMeasurement);
      console.log('Measurement mode activated, click listener added');
    } else {
      // Hapus event listener
      map.current.getCanvas().style.cursor = '';
      map.current.off('click', handleMapClickForMeasurement);
      console.log('Measurement mode deactivated, click listener removed');
    }
  };

  const handleMapClickForMeasurement = (e) => {
    if (!map.current || !measurementActive) return;
    
    console.log('Map clicked for measurement:', e.lngLat);
    
    const coordinates = [e.lngLat.lng, e.lngLat.lat];
    
    // Simulasi pengukuran ketinggian air
    const elevation = Math.random() * 10;
    console.log('Simulated elevation:', elevation);
    
    // Tentukan status berdasarkan ketinggian
    let status, statusColor;
    if (elevation > 5) {
      status = 'Bahaya';
      statusColor = '#EF4444';
    } else if (elevation > 2) {
      status = 'Waspada';
      statusColor = '#F59E0B';
    } else {
      status = 'Aman';
      statusColor = '#10B981';
    }
    
    console.log('Determined status:', status, 'with color:', statusColor);
    
    // Tampilkan popup pengukuran
    setMeasurementData({
      visible: true,
      coordinates,
      elevation,
      status,
      statusColor
    });
  };

  const handleCloseMeasurementPopup = () => {
    setMeasurementData({
      visible: false,
      coordinates: null,
      elevation: null,
      status: null,
      statusColor: null
    });
  };

  // Cleanup event listener saat komponen unmount
  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.off('click', handleMapClickForMeasurement);
      }
    };
  }, []);

  return {
    measurementActive,
    measurementData,
    toggleWaterMeasurement,
    handleCloseMeasurementPopup
  };
};