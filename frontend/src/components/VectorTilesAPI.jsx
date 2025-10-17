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

  useEffect(() => {
    if (!map || !mapLoaded || !isRiverLayerActive || !selectedLocation) return;

    // Fetch GeoJSON dari public/assets
    fetch('/assets/water_areas.geojson')
      .then(res => res.json())
      .then(waterAreas => {
        // Filter fitur air di sekitar marker
        const nearbyFeatures = waterAreas.features.filter(f =>
          isFeatureNearLocation(f, selectedLocation, 1) // 1 km radius
        );

        // Hapus layer/source lama jika ada
        if (map.getLayer('highlighted-water-layer')) map.removeLayer('highlighted-water-layer');
        if (map.getSource('highlighted-water-source')) map.removeSource('highlighted-water-source');

        // Tambahkan layer baru
        map.addSource('highlighted-water-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: nearbyFeatures
          }
        });

        map.addLayer({
          id: 'highlighted-water-layer',
          type: 'fill',
          source: 'highlighted-water-source',
          paint: {
            'fill-color': '#1e40af',
            'fill-opacity': 0.5
          }
        });
      });

    return () => {
      if (map && map.getLayer('highlighted-water-layer')) map.removeLayer('highlighted-water-layer');
      if (map && map.getSource('highlighted-water-source')) map.removeSource('highlighted-water-source');
    };
  }, [map, mapLoaded, isRiverLayerActive, selectedLocation]);

  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Ganti sesuai tileset/source-layer Anda
    const vectorSourceId = "mapbox-streets";
    const sourceLayerName = "water"; // atau "waterway" jika sungai berupa garis
    const redLayerId = "water-red-overlay";

    // Hapus layer lama jika ada
    if (map.getLayer(redLayerId)) map.removeLayer(redLayerId);

    // Tambahkan layer merah transparan di atas air
    map.addLayer({
      id: redLayerId,
      type: "fill", // gunakan "line" jika source-layer sungai berupa garis
      source: vectorSourceId,
      "source-layer": sourceLayerName,
      paint: {
        "fill-color": "#ff0000",
        "fill-opacity": 0.3 // transparan
      }
    });

    // Cleanup
    return () => {
      if (map.getLayer(redLayerId)) map.removeLayer(redLayerId);
    };
  }, [map, mapLoaded]);

  return null;
};

function isFeatureNearLocation(feature, location, radiusKm = 1) {
  // Ambil centroid fitur (atau gunakan turf.js untuk akurasi)
  const [lng, lat] = feature.geometry.type === "Polygon"
    ? feature.geometry.coordinates[0][0]
    : feature.geometry.coordinates[0];
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371; // Radius bumi km
  const dLat = toRad(lat - location.lat);
  const dLng = toRad(lng - location.lng);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(location.lat)) * Math.cos(toRad(lat)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d <= radiusKm;
}

export default VectorTilesAPI;