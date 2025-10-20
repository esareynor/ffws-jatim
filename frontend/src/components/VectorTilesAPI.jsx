// // src/components/VectorTilesAPI.jsx
// import React, { useEffect, useState } from 'react';

// const VectorTilesAPI = ({ map, mapLoaded, isFloodRiskLayerActive }) => {
//   const SOURCE_ID = 'flood-risk-source';
//   const LAYER_ID = 'flood-risk-layer';

//   const [floodRiskGeojson, setFloodRiskGeojson] = useState(null);

//   const cleanup = () => {
//     if (!map) return;
//     try {
//       if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
//       if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
//     } catch (e) {
//       console.warn('Cleanup error:', e.message);
//     }
//   };

//   // Fetch GeoJSON risiko banjir sekali saat komponen mount
//   useEffect(() => {
//     fetch('/flood_risk_areas.geojson')
//       .then(res => {
//         if (!res.ok) throw new Error('GeoJSON not found (404)');
//         return res.json();
//       })
//       .then(data => {
//         console.log('✅ Flood risk GeoJSON loaded successfully');
//         setFloodRiskGeojson(data);
//       })
//       .catch(e => {
//         console.error('❌ Failed to load flood risk GeoJSON. Make sure the file exists at: /public/assets/flood_risk_areas.geojson', e);
//       });
//   }, []);

//   // Kelola layer berdasarkan toggle
//   useEffect(() => {
//     if (!map || !mapLoaded || !floodRiskGeojson) {
//       return;
//     }

//     if (isFloodRiskLayerActive) {
//       // Tambahkan source jika belum ada
//       if (!map.getSource(SOURCE_ID)) {
//         map.addSource(SOURCE_ID, {
//           type: 'geojson',
//            floodRiskGeojson
//         });
//       }

//       // Tambahkan layer jika belum ada
//       if (!map.getLayer(LAYER_ID)) {
//         map.addLayer({
//           id: LAYER_ID,
//           type: 'fill',
//           source: SOURCE_ID,
//           paint: {
//             // Warna berdasarkan level risiko dari properti 'risk_level'
//             'fill-color': [
//               'case',
//               ['==', ['get', 'risk_level'], 'high'], '#dc2626',    // Merah
//               ['==', ['get', 'risk_level'], 'medium'], '#f97316', // Oranye
//               ['==', ['get', 'risk_level'], 'low'], '#fbbf24',    // Kuning
//               '#fbbf24' // fallback (jika tidak ada risk_level)
//             ],
//             'fill-opacity': 0.55,
//             'fill-outline-color': '#7c2d12'
//           }
//         });
//       }
//     } else {
//       cleanup();
//     }

//     return () => {
//       if (!isFloodRiskLayerActive) {
//         cleanup();
//       }
//     };
//   }, [map, mapLoaded, isFloodRiskLayerActive, floodRiskGeojson]);

//   return null;
// };

// export default VectorTilesAPI;