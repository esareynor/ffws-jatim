import { useState } from 'react';
import mapboxgl from 'mapbox-gl';

export const useHydrologyLayer = (map) => {
  const [hydrologyLayerVisible, setHydrologyLayerVisible] = useState(false);

  const addHydrologyLayer = () => {
    if (!map.current || hydrologyLayerVisible) return;
    
    try {
      // Cek apakah source sudah ada
      if (!map.current.getSource('hydrology-raster-source')) {
        // Tambahkan source untuk Raster Tiles - menggunakan style yang menampilkan fitur air
        map.current.addSource('hydrology-raster-source', {
          type: 'raster',
          tiles: [
            // Menggunakan Mapbox Light style yang menampilkan perairan dengan jelas
            'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=' + mapboxgl.accessToken
          ],
          tileSize: 256
        });
      }
      
      // Cek apakah layer sudah ada
      if (!map.current.getLayer('hydrology-raster-layer')) {
        // Tambahkan layer untuk hidrologi (sungai dan perairan)
        map.current.addLayer({
          id: 'hydrology-raster-layer',
          type: 'raster',
          source: 'hydrology-raster-source',
          layout: {
            visibility: 'visible'
          },
          paint: {
            // Atur opacity agar hanya perairan yang terlihat dengan jelas
            'raster-opacity': 0.8,
            // Tingkatkan kontras untuk membuat perairan lebih menonjol
            'raster-contrast': 0.5,
            // Atur brightness untuk menyesuaikan tampilan
            'raster-brightness-min': 0.5,
            'raster-brightness-max': 1
          }
        });
      }
      
      setHydrologyLayerVisible(true);
      console.log('Hydrology layer added successfully');
    } catch (error) {
      console.error('Error adding hydrology layer:', error);
    }
  };

  const removeHydrologyLayer = () => {
    if (!map.current || !hydrologyLayerVisible) return;
    
    try {
      if (map.current.getLayer('hydrology-raster-layer')) {
        map.current.removeLayer('hydrology-raster-layer');
      }
      // Jangan hapus source karena mungkin digunakan oleh layer lain
      
      setHydrologyLayerVisible(false);
      console.log('Hydrology layer removed successfully');
    } catch (error) {
      console.error('Error removing hydrology layer:', error);
    }
  };

  return {
    hydrologyLayerVisible,
    addHydrologyLayer,
    removeHydrologyLayer
  };
};