import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapTooltip from './maptooltip'; 
import WaterMeasurementPopup from '../../../components/WaterMeasurementPopup.js';
import ShpLayer from 'ShpLayer';
import { convertShpToGeojson } from 'utils/convertShpToGeojson';
import { useHydrologyLayer } from 'hooks/useHydrologyLayer';
import { useWaterMeasurement } from 'hooks/useWaterMeasurement';
import { useStations } from 'hooks/useStations';
import { useMapInteraction } from 'hooks/useMapInteraction';

// Set access token di luar komponen
mapboxgl.accessToken = 'pk.eyJ1IjoiZGl0b2ZhdGFoaWxsYWgxIiwiYSI6ImNtZjNveGloczAwNncya3E1YzdjcTRtM3MifQ.kIf5rscGYOzvvBcZJ41u8g';

const MapboxMap = ({ tickerData, onStationSelect, onMapFocus, onStationChange }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  
  // State untuk SHP layer
  const [shpLayerVisible, setShpLayerVisible] = useState(false);
  const [shpGeojson, setShpGeojson] = useState(null);
  const [shpFileName, setShpFileName] = useState('');
  const [shpLoading, setShpLoading] = useState(false);
  const [shpError, setShpError] = useState(null);

  // Custom hooks
  const { 
    hydrologyLayerVisible, 
    addHydrologyLayer, 
    removeHydrologyLayer 
  } = useHydrologyLayer(map);
  
  const { 
    measurementActive, 
    measurementData, 
    toggleWaterMeasurement, 
    handleCloseMeasurementPopup 
  } = useWaterMeasurement(map);
  
  const { 
    tooltip, 
    handleShowDetail, 
    handleCloseTooltip, 
    handleMapFocus: handleMapFocusFromHook, 
    handleAutoSwitch 
  } = useStations(map, tickerData);

  // Fungsi untuk menangani file SHP yang diupload
  const handleShpFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setShpFileName(file.name);
    setShpLoading(true);
    setShpError(null);
    setShpGeojson(null); // Reset geojson sebelumnya

    try {
      // Validasi tipe file
      const validTypes = ['.zip', '.shp', '.geojson', '.json'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        throw new Error(`Format file ${fileExtension} tidak didukung. Gunakan: ${validTypes.join(', ')}`);
      }
      
      // Konversi SHP ke GeoJSON
      const geojson = await convertShpToGeojson(file);
      
      // Validasi GeoJSON
      if (!geojson || !geojson.features || geojson.features.length === 0) {
        throw new Error('Tidak ada data valid dalam file');
      }

      setShpGeojson(geojson);
      
    } catch (error) {
      console.error('Error processing SHP file:', error);
      setShpError(error.message || 'Gagal memproses file SHP');
    } finally {
      setShpLoading(false);
    }
  };

  // Callback saat SHP layer selesai dimuat
  const handleShpLayerLoad = (geojson) => {
    console.log('SHP layer loaded:', geojson);
    
    // Hitung bounds dari GeoJSON
    if (map.current && geojson.features.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      geojson.features.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
          feature.geometry.coordinates[0].forEach(coord => {
            bounds.extend(coord);
          });
        } else if (feature.geometry.type === 'MultiPolygon') {
          feature.geometry.coordinates.forEach(polygon => {
            polygon[0].forEach(coord => {
              bounds.extend(coord);
            });
          });
        } else if (feature.geometry.type === 'LineString') {
          feature.geometry.coordinates.forEach(coord => {
            bounds.extend(coord);
          });
        } else if (feature.geometry.type === 'MultiLineString') {
          feature.geometry.coordinates.forEach(lineString => {
            lineString.forEach(coord => {
              bounds.extend(coord);
            });
          });
        } else if (feature.geometry.type === 'Point') {
          bounds.extend(feature.geometry.coordinates);
        } else if (feature.geometry.type === 'MultiPoint') {
          feature.geometry.coordinates.forEach(coord => {
            bounds.extend(coord);
          });
        }
      });
      
      // Zoom ke bounds
      map.current.fitBounds(bounds, {
        padding: 20
      });
    }
  };

  // Handler untuk auto focus dari running bar
  const handleMapFocus = (focusData) => {
    if (onMapFocus) {
      onMapFocus(focusData);
    } else {
      handleMapFocusFromHook(focusData);
    }
  };

  // Handler untuk menampilkan detail sidebar dari tooltip
  const handleShowDetailWithCallback = (station) => {
    handleShowDetail(station);
    if (onStationSelect) {
      onStationSelect(station);
    }
  };

  // Initialize map
  useEffect(() => {
    if (map.current) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [112.5, -7.5],
        zoom: 8,
        pitch: 45,
        bearing: -17.6,
        antialias: true
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
      
      // Tunggu peta dimuat sepenuhnya sebelum menambahkan layer
      map.current.on('load', () => {
        // Tambahkan source untuk genangan air
        map.current.addSource('flood-data', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });
        
        // Tambahkan layer untuk genangan air
        map.current.addLayer({
          id: 'flood-layer',
          type: 'fill',
          source: 'flood-data',
          layout: {
            visibility: 'none'
          },
          paint: {
            'fill-color': ['get', 'fillColor'],
            'fill-opacity': 0.7,
            'fill-outline-color': 'rgba(255, 255, 255, 0.5)'
          }
        });
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
    }
    
    return () => {
      // Hapus peta
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Use map interaction hook
  useMapInteraction(map);

  return (
    <div className="w-full h-screen overflow-hidden relative z-0">
      <div ref={mapContainer} className="w-full h-full relative z-0" />
      
      {/* Kontrol untuk Layer Hidrologi (Sungai dan Perairan) */}
      <div className="absolute top-4 left-4 z-10 bg-white p-3 rounded-lg shadow-md">
        <div className="mb-2 font-semibold text-gray-800">Layer Hidrologi</div>
        <div className="text-xs text-gray-600 mb-2">
          Menampilkan sungai, danau, dan perairan lainnya
        </div>
        <button 
          className={`px-3 py-1 rounded text-sm w-full ${hydrologyLayerVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          onClick={hydrologyLayerVisible ? removeHydrologyLayer : addHydrologyLayer}
        >
          {hydrologyLayerVisible ? 'Sembunyikan Sungai & Air' : 'Tampilkan Sungai & Air'}
        </button>
      </div>
      
      {/* Kontrol untuk SHP Layer */}
      <div className="absolute top-32 left-4 z-10 bg-white p-3 rounded-lg shadow-md">
        <div className="mb-2 font-semibold text-gray-800">SHP Layer</div>
        <div className="mb-2">
          <input 
            type="file" 
            accept=".shp,.zip,.geojson,.json" 
            onChange={handleShpFileUpload}
            className="text-sm text-gray-600 w-full"
            disabled={shpLoading}
          />
          <div className="text-xs text-gray-500 mt-1">
            Format: .zip, .shp, .geojson, .json
          </div>
        </div>
        
        {shpFileName && (
          <div className="text-xs text-gray-500 mb-2 truncate">
            File: {shpFileName}
          </div>
        )}
        
        {shpLoading && (
          <div className="flex items-center text-xs text-blue-600 mb-2 p-2 bg-blue-50 rounded">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
            Memproses file...
          </div>
        )}
        
        {shpError && (
          <div className="text-xs text-red-500 mb-2 p-2 bg-red-50 rounded">
            Error: {shpError}
          </div>
        )}
        
        {shpGeojson && !shpError && (
          <div className="text-xs text-green-600 mb-2 p-2 bg-green-50 rounded">
            ✓ File berhasil diproses ({shpGeojson.features.length} fitur)
          </div>
        )}
        
        <button 
          className={`px-3 py-1 rounded text-sm w-full ${shpLayerVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors disabled:opacity-50`}
          onClick={() => setShpLayerVisible(!shpLayerVisible)}
          disabled={!shpGeojson || shpError}
        >
          {shpLayerVisible ? 'Sembunyikan SHP Layer' : 'Tampilkan SHP Layer'}
        </button>
      </div>
      
      {/* Kontrol untuk Pengukuran Permukaan Air */}
      <div className="absolute top-60 left-4 z-10 bg-white p-3 rounded-lg shadow-md">
        <div className="mb-2 font-semibold text-gray-800">Pengukuran Permukaan Air</div>
        <button 
          className={`px-3 py-1 rounded text-sm w-full ${measurementActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
          onClick={toggleWaterMeasurement}
        >
          {measurementActive ? 'Nonaktifkan Pengukuran' : 'Aktifkan Pengukuran'}
        </button>
        {measurementActive && (
          <div className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded">
            Klik pada sungai untuk mengukur ketinggian permukaan air
          </div>
        )}
      </div>
      
      <MapTooltip
        map={map.current}
        station={tooltip.station}
        isVisible={tooltip.visible}
        coordinates={tooltip.coordinates}
        onShowDetail={handleShowDetailWithCallback}
        onClose={handleCloseTooltip}
      />
      
      {/* Komponen SHP Layer */}
      {shpGeojson && (
        <ShpLayer
          map={map.current}
          geojsonData={shpGeojson}
          layerId="shp-layer"
          visible={shpLayerVisible}
          onLayerLoad={handleShpLayerLoad}
        />
      )}
      
      {/* Komponen popup untuk pengukuran permukaan air */}
      <WaterMeasurementPopup
        map={map.current}
        isVisible={measurementData.visible}
        coordinates={measurementData.coordinates}
        elevation={measurementData.elevation}
        status={measurementData.status}
        statusColor={measurementData.statusColor}
        onClose={handleCloseMeasurementPopup}
      />
      
      {/* Custom CSS */}
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .mapboxgl-popup-tip {
          display: none;
        }
        
        .custom-marker {
          transition: transform 0.2s;
        }
        
        .custom-marker:hover {
          transform: scale(1.1);
        }
        
        .water-measurement-popup-container .mapboxgl-popup-content {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        .water-measurement-popup {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MapboxMap;