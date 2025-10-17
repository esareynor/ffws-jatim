// src/components/VectorTilesAPI.jsx
import React, { useEffect } from 'react';

const VectorTilesAPI = ({ map, mapLoaded, isRiverLayerActive, selectedLocation }) => {
  const SOURCE_ID = 'highlighted-water-source';
  const LAYER_ID = 'highlighted-water-layer';

  const cleanup = () => {
    if (!map) return;
    try {
      if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
    } catch (e) {
      console.warn('Cleanup error:', e.message);
    }
  };

  useEffect(() => {
    console.log('VectorTilesAPI:', { isRiverLayerActive, mapLoaded, selectedLocation });
    // Jika layer sungai tidak aktif atau belum ada lokasi terpilih, bersihkan
    if (!isRiverLayerActive || !mapLoaded || !selectedLocation || !map) {
      cleanup();
      return;
    }

    const { lat, lng } = selectedLocation;
    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
      cleanup();
      return;
    }

    const highlightWaterNearby = () => {
      if (!map.isStyleLoaded()) {
        const timeout = setTimeout(highlightWaterNearby, 200);
        return () => clearTimeout(timeout);
      }

      cleanup();

      try {
        // Ambil semua layer di peta
        const allLayers = map.getStyle().layers || [];
        
        // Cari layer yang kemungkinan besar adalah air (berdasarkan nama)
        const waterLayerIds = allLayers
          .filter(layer => 
            layer.id.includes('water') || 
            (layer.type === 'fill' && layer.source === 'mapbox-streets-v8')
          )
          .map(layer => layer.id);

        if (waterLayerIds.length === 0) {
          console.log('No water-related layers found in current style');
          return;
        }

        // Dapatkan koordinat marker
        const point = map.project([lng, lat]);
        
        // Cari fitur air di sekitar marker (radius 300px untuk lebih banyak hasil)
        const radiusInPixels = 300;
        const bbox = [
          [point.x - radiusInPixels, point.y - radiusInPixels],
          [point.x + radiusInPixels, point.y + radiusInPixels]
        ];

        let features = [];
        for (const layerId of waterLayerIds) {
          const layerFeatures = map.queryRenderedFeatures(bbox, {
            layers: [layerId]
          });
          features = [...features, ...layerFeatures];
        }

        // Filter hanya fitur polygon
        const waterFeatures = features.filter(f => 
          f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon'
        );

        if (waterFeatures.length === 0) {
          console.log('No water features found near', [lng, lat]);
          return;
        }

        // Tambahkan sumber data baru
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: waterFeatures
          }
        });

        // Tambahkan layer dengan warna biru tua
        map.addLayer({
          id: LAYER_ID,
          type: 'fill',
          source: SOURCE_ID,
          paint: {
            'fill-color': '#000080',  // Biru sangat tua
            'fill-opacity': 0.7
          },
          layout: {
            visibility: 'visible'
          }
        }, 'building'); // Letakkan di bawah layer building

        console.log(`✅ Highlighted ${waterFeatures.length} water features near station`);

      } catch (error) {
        console.error('Error in VectorTilesAPI:', error);
        cleanup();
      }
    };

    const timer = setTimeout(highlightWaterNearby, 500);
    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [map, mapLoaded, isRiverLayerActive, selectedLocation]);

  return null;
};

export default VectorTilesAPI;