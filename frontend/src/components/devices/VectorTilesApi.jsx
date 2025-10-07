import React, { useEffect, useRef } from 'react';
import * as turf from '@turf/turf';

const VectorTilesAPI = ({ map, isVisible, coordinates, mapLoaded }) => {
    // Fungsi untuk mengubah warna air di area hijau dengan gradiasi ketinggian
    const changeWaterColorInSafeArea = () => {
        if (!map || !mapLoaded || !coordinates) return;

        if (!map.getSource('safe-areas')) {
            console.warn('Safe areas not found. River layer must be activated first.');
            return;
        }

        try {
            // Hapus layer efek sebelumnya jika ada
            if (map.getLayer('water-in-safe-area')) {
                map.removeLayer('water-in-safe-area');
            }
            
            if (map.getSource('water-in-safe-area-source')) {
                map.removeSource('water-in-safe-area-source');
            }

            const safeAreasSource = map.getSource('safe-areas');
            let safeAreaData = null;

            if (safeAreasSource._data && safeAreasSource._data.features && safeAreasSource._data.features.length > 0) {
                safeAreaData = safeAreasSource._data.features[0];
            } else {
                console.warn('Safe area data not available');
                return;
            }

            // Buat sumber data baru untuk air di dalam safe area
            map.addSource('water-in-safe-area-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            // Tambahkan layer untuk air di dalam safe area dengan gradiasi ketinggian
            map.addLayer({
                id: 'water-in-safe-area',
                type: 'fill',
                source: 'water-in-safe-area-source',
                paint: {
                    // Gradiasi warna berdasarkan ketinggian air
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['to-number', ['coalesce', ['get', 'elevation'], ['get', 'height'], '0']],
                        0, '#87CEEB',      // Biru muda (kering/dangkal)
                        2, '#4682B4',      // Biru baja (sedang)
                        5, '#191970',      // Biru midnight (tinggi)
                        10, '#000080',     // Biru navy (sangat tinggi)
                        15, '#000033'      // Biru kehitaman (banjir)
                    ],
                    'fill-opacity': 0.8
                }
            }, 'safe-areas-border');

            // Cari layer air di peta
            const waterLayer = map.getStyle().layers.find(layer => 
                layer.id === 'water-layer' || 
                (layer.type === 'fill' && 
                 layer['source-layer'] === 'water' && 
                 layer.filter && layer.filter.includes('river'))
            );
            
            if (!waterLayer) {
                console.warn('Water layer not found. Available layers:', 
                    map.getStyle().layers.map(l => l.id));
                return;
            }

            const waterSource = waterLayer.source;
            const waterSourceLayer = waterLayer['source-layer'];

            // Hitung bounding box dari safe area
            const bounds = safeAreaData.geometry.coordinates[0];
            const bbox = [
                Math.min(...bounds.map(coord => coord[0])),
                Math.min(...bounds.map(coord => coord[1])),
                Math.max(...bounds.map(coord => coord[0])),
                Math.max(...bounds.map(coord => coord[1]))
            ];

            // Coba beberapa pendekatan untuk mendapatkan fitur air
            let waterFeatures = [];
            
            try {
                // Perbaiki filter untuk menangani MultiPolygon
                waterFeatures = map.querySourceFeatures(waterSource, {
                    sourceLayer: waterSourceLayer,
                    filter: ['any', 
                        ['==', '$type', 'Polygon'],
                        ['==', '$type', 'MultiPolygon']
                    ],
                    bounds: bbox
                });
                console.log(`Found ${waterFeatures.length} water features using querySourceFeatures`);
            } catch (e) {
                console.warn('Error with querySourceFeatures:', e);
                
                // Coba pendekatan alternatif tanpa filter tipe
                try {
                    waterFeatures = map.querySourceFeatures(waterSource, {
                        sourceLayer: waterSourceLayer,
                        bounds: bbox
                    });
                    console.log(`Found ${waterFeatures.length} water features using querySourceFeatures without type filter`);
                } catch (e2) {
                    console.warn('Error with querySourceFeatures without filter:', e2);
                }
            }
            
            if (waterFeatures.length === 0) {
                try {
                    const sw = [bbox[0], bbox[1]];
                    const ne = [bbox[2], bbox[3]];
                    
                    waterFeatures = map.queryRenderedFeatures(
                        map.project(sw),
                        map.project(ne),
                        { 
                            layers: [waterLayer.id]
                        }
                    );
                    console.log(`Found ${waterFeatures.length} water features using queryRenderedFeatures`);
                } catch (e) {
                    console.warn('Error with queryRenderedFeatures:', e);
                }
            }

            const featuresInSafeArea = [];
            const safeAreaPolygon = turf.polygon(safeAreaData.geometry.coordinates);

            // Loop melalui setiap fitur air dan potong dengan safe area
            for (const feature of waterFeatures) {
                try {
                    // Handle MultiPolygon dengan benar
                    if (feature.geometry.type === 'MultiPolygon') {
                        // Konversi MultiPolygon ke koleksi Polygon
                        for (const polygonCoords of feature.geometry.coordinates) {
                            // Pastikan polygonCoords valid
                            if (!polygonCoords || polygonCoords.length === 0) continue;
                            
                            const polygonFeature = turf.polygon(polygonCoords, feature.properties);
                            
                            // Cek apakah fitur berpotongan dengan safe area
                            if (turf.booleanIntersects(polygonFeature, safeAreaPolygon)) {
                                // Coba dapatkan ketinggian dari properti fitur
                                let elevation = 0;
                                
                                if (feature.properties) {
                                    elevation = parseFloat(feature.properties.elevation) || 
                                               parseFloat(feature.properties.height) || 
                                               parseFloat(feature.properties.depth) || 
                                               parseFloat(feature.properties.level) || 
                                               0;
                                }
                                
                                // Jika tidak ada properti ketinggian, coba dapatkan dari terrain
                                if (elevation === 0 && map.getSource('mapbox-dem')) {
                                    elevation = getElevationFromTerrain(polygonFeature);
                                }
                                
                                // Jika masih 0, gunakan simulasi berdasarkan posisi
                                if (elevation === 0) {
                                    elevation = simulateElevationByPosition(polygonFeature);
                                }
                                
                                polygonFeature.properties.elevation = elevation;
                                featuresInSafeArea.push(polygonFeature);
                            }
                        }
                    } 
                    // Handle Polygon
                    else if (feature.geometry.type === 'Polygon') {
                        // Pastikan koordinat valid
                        if (!feature.geometry.coordinates || feature.geometry.coordinates.length === 0) continue;
                        
                        const polygonFeature = turf.polygon(feature.geometry.coordinates, feature.properties);
                        
                        // Cek apakah fitur berpotongan dengan safe area
                        if (turf.booleanIntersects(polygonFeature, safeAreaPolygon)) {
                            // Coba dapatkan ketinggian dari properti fitur
                            let elevation = 0;
                            
                            if (feature.properties) {
                                elevation = parseFloat(feature.properties.elevation) || 
                                           parseFloat(feature.properties.height) || 
                                           parseFloat(feature.properties.depth) || 
                                           parseFloat(feature.properties.level) || 
                                           0;
                            }
                            
                            // Jika tidak ada properti ketinggian, coba dapatkan dari terrain
                            if (elevation === 0 && map.getSource('mapbox-dem')) {
                                elevation = getElevationFromTerrain(polygonFeature);
                            }
                            
                            // Jika masih 0, gunakan simulasi berdasarkan posisi
                            if (elevation === 0) {
                                elevation = simulateElevationByPosition(polygonFeature);
                            }
                            
                            polygonFeature.properties.elevation = elevation;
                            featuresInSafeArea.push(polygonFeature);
                        }
                    }
                } catch (e) {
                    console.warn('Error processing feature:', e);
                }
            }

            console.log(`Found ${featuresInSafeArea.length} water features in safe area`);

            // Update sumber data dengan fitur yang sudah dipotong
            map.getSource('water-in-safe-area-source').setData({
                type: 'FeatureCollection',
                features: featuresInSafeArea
            });

            console.log('Water color in safe area changed with elevation gradient');

        } catch (error) {
            console.error('Error changing water color in safe area:', error);
        }
    };

    // Fungsi untuk mendapatkan elevasi dari Mapbox Terrain
    const getElevationFromTerrain = (feature) => {
        try {
            // Pastikan sumber terrain ada
            if (!map.getSource('mapbox-dem')) {
                console.warn('Mapbox DEM source not available');
                return 0;
            }
            
            // Dapatkan titik tengah fitur
            const center = turf.center(feature);
            const [lng, lat] = center.geometry.coordinates;
            
            // Pastikan koordinat valid
            if (!lng || !lat || isNaN(lng) || isNaN(lat)) {
                console.warn('Invalid coordinates for terrain query');
                return 0;
            }
            
            // Dapatkan elevasi pada titik tersebut
            const elevation = map.queryTerrainElevation([lng, lat]);
            
            // Kembalikan elevasi dalam meter (biasanya sudah dalam meter)
            return Math.max(0, elevation || 0);
        } catch (error) {
            console.warn('Error getting elevation from terrain:', error);
            return 0;
        }
    };

    // Fungsi untuk mensimulasikan elevasi berdasarkan posisi geografis
    const simulateElevationByPosition = (feature) => {
        try {
            // Dapatkan koordinat fitur
            const coords = feature.geometry.coordinates[0];
            
            // Pastikan koordinat valid
            if (!coords || coords.length === 0) {
                console.warn('Invalid coordinates for elevation simulation');
                return 2;
            }
            
            // Hitung rata-rata latitude dan longitude
            const avgLat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
            const avgLng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;
            
            // Pastikan koordinat valid
            if (isNaN(avgLat) || isNaN(avgLng)) {
                console.warn('Invalid average coordinates for elevation simulation');
                return 2;
            }
            
            // Simulasi elevasi berdasarkan posisi
            const distanceFromEquator = Math.abs(avgLat);
            const westFactor = (110 - avgLng) / 50;
            
            const simulatedElevation = Math.max(0, 
                (distanceFromEquator * 0.5) + 
                (westFactor * 2) +           
                (Math.random() * 3)          
            );
            
            return Math.round(simulatedElevation * 10) / 10;
        } catch (error) {
            console.warn('Error simulating elevation by position:', error);
            return 2;
        }
    };

    // Fungsi helper untuk mendapatkan titik tengah polygon
    const getPolygonCenter = (coords) => {
        let x = 0;
        let y = 0;
        let n = coords.length;
        
        for (let i = 0; i < n; i++) {
            x += coords[i][0];
            y += coords[i][1];
        }
        
        return [x / n, y / n];
    };

    // Fungsi helper untuk mengecek apakah titik berada di dalam polygon
    const isPointInPolygon = (point, polygon) => {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][0], yi = polygon[i][1];
            const xj = polygon[j][0], yj = polygon[j][1];
            
            const intersect = ((yi > point[1]) !== (yj > point[1]))
                && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    // Fungsi untuk mengembalikan warna air ke semula
    const revertWaterColor = () => {
        if (!map) return;

        try {
            if (map.getLayer('water-in-safe-area')) {
                map.removeLayer('water-in-safe-area');
            }
            
            if (map.getSource('water-in-safe-area-source')) {
                map.removeSource('water-in-safe-area-source');
            }
            
            console.log('Water color reverted to original');
        } catch (error) {
            console.error('Error reverting water color:', error);
        }
    };

    useEffect(() => {
        if (!map || !mapLoaded) return;

        if (isVisible && coordinates) {
            const timer = setTimeout(() => {
                changeWaterColorInSafeArea();
            }, 500);
            
            return () => {
                clearTimeout(timer);
                revertWaterColor();
            };
        } else {
            revertWaterColor();
        }

        return () => {
            revertWaterColor();
        };
    }, [map, isVisible, coordinates, mapLoaded]);

    // Cleanup saat komponen unmount
    useEffect(() => {
        return () => {
            revertWaterColor();
        };
    }, []);

    // Komponen ini tidak merender apapun secara visual
    return null;
};

export default VectorTilesAPI;