import React, { useEffect, useRef } from 'react';
import * as turf from '@turf/turf';

const VectorTilesAPI = ({ map, isVisible, coordinates, mapLoaded }) => {
    const processingRef = useRef(false); // Untuk mencegah multiple execution

    const changeWaterColorInSafeArea = () => {
        if (!map || !mapLoaded || !coordinates || processingRef.current) return;

        processingRef.current = true;

        if (!map.getSource('safe-areas')) {
            console.warn('Safe areas not found. River layer must be activated first.');
            processingRef.current = false;
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
                processingRef.current = false;
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
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['to-number', ['coalesce', ['get', 'elevation'], ['get', 'height'], '0']],
                        0, '#87CEEB',
                        2, '#4682B4',
                        5, '#191970',
                        10, '#000080',
                        15, '#000033'
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
                processingRef.current = false;
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

            let waterFeatures = [];

            try {
                // Ambil semua fitur tanpa filter tipe
                waterFeatures = map.querySourceFeatures(waterSource, {
                    sourceLayer: waterSourceLayer,
                    bounds: bbox
                });
                console.log(`Found ${waterFeatures.length} water features using querySourceFeatures (no type filter)`);

                // Filter secara manual untuk Polygon dan MultiPolygon
                waterFeatures = waterFeatures.filter(feature => 
                    feature.geometry && 
                    (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')
                );
                console.log(`Filtered to ${waterFeatures.length} Polygon/MultiPolygon features`);

            } catch (e) {
                console.warn('Error with querySourceFeatures:', e);

                // Fallback: gunakan queryRenderedFeatures
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

                    // Filter juga di sini
                    waterFeatures = waterFeatures.filter(feature => 
                        feature.geometry && 
                        (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')
                    );
                    console.log(`Filtered to ${waterFeatures.length} Polygon/MultiPolygon features (from rendered)`);

                } catch (e2) {
                    console.warn('Error with queryRenderedFeatures:', e2);
                }
            }

            const featuresInSafeArea = [];
            const safeAreaPolygon = turf.polygon(safeAreaData.geometry.coordinates);

            for (const feature of waterFeatures) {
                try {
                    if (feature.geometry.type === 'MultiPolygon') {
                        for (const polygonCoords of feature.geometry.coordinates) {
                            if (!polygonCoords || polygonCoords.length === 0) continue;
                            
                            const polygonFeature = turf.polygon(polygonCoords, feature.properties);
                            
                            if (turf.booleanIntersects(polygonFeature, safeAreaPolygon)) {
                                let elevation = 0;
                                
                                if (feature.properties) {
                                    elevation = parseFloat(feature.properties.elevation) || 
                                               parseFloat(feature.properties.height) || 
                                               parseFloat(feature.properties.depth) || 
                                               parseFloat(feature.properties.level) || 
                                               0;
                                }
                                
                                if (elevation === 0 && map.getSource('mapbox-dem')) {
                                    elevation = getElevationFromTerrain(polygonFeature);
                                }
                                
                                if (elevation === 0) {
                                    elevation = simulateElevationByPosition(polygonFeature);
                                }
                                
                                polygonFeature.properties.elevation = elevation;
                                featuresInSafeArea.push(polygonFeature);
                            }
                        }
                    } else if (feature.geometry.type === 'Polygon') {
                        if (!feature.geometry.coordinates || feature.geometry.coordinates.length === 0) continue;
                        
                        const polygonFeature = turf.polygon(feature.geometry.coordinates, feature.properties);
                        
                        if (turf.booleanIntersects(polygonFeature, safeAreaPolygon)) {
                            let elevation = 0;
                            
                            if (feature.properties) {
                                elevation = parseFloat(feature.properties.elevation) || 
                                           parseFloat(feature.properties.height) || 
                                           parseFloat(feature.properties.depth) || 
                                           parseFloat(feature.properties.level) || 
                                           0;
                            }
                            
                            if (elevation === 0 && map.getSource('mapbox-dem')) {
                                elevation = getElevationFromTerrain(polygonFeature);
                            }
                            
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

            map.getSource('water-in-safe-area-source').setData({
                type: 'FeatureCollection',
                features: featuresInSafeArea
            });

            console.log('Water color in safe area changed with elevation gradient');

        } catch (error) {
            console.error('Error changing water color in safe area:', error);
        } finally {
            processingRef.current = false;
        }
    };

    const getElevationFromTerrain = (feature) => {
        try {
            if (!map.getSource('mapbox-dem')) {
                console.warn('Mapbox DEM source not available');
                return 0;
            }
            
            const center = turf.center(feature);
            const [lng, lat] = center.geometry.coordinates;
            
            if (!lng || !lat || isNaN(lng) || isNaN(lat)) {
                console.warn('Invalid coordinates for terrain query');
                return 0;
            }
            
            const elevation = map.queryTerrainElevation([lng, lat]);
            return Math.max(0, elevation || 0);
        } catch (error) {
            console.warn('Error getting elevation from terrain:', error);
            return 0;
        }
    };

    const simulateElevationByPosition = (feature) => {
        try {
            const coords = feature.geometry.coordinates[0];
            if (!coords || coords.length === 0) {
                console.warn('Invalid coordinates for elevation simulation');
                return 2;
            }
            
            const avgLat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
            const avgLng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;
            
            if (isNaN(avgLat) || isNaN(avgLng)) {
                console.warn('Invalid average coordinates for elevation simulation');
                return 2;
            }
            
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
            // Hilangkan delay agar lebih responsif
            requestAnimationFrame(() => {
                changeWaterColorInSafeArea();
            });
        } else {
            revertWaterColor();
        }

        return () => {
            revertWaterColor();
        };
    }, [map, isVisible, coordinates, mapLoaded]);

    useEffect(() => {
        return () => {
            revertWaterColor();
        };
    }, []);

    return null;
};

export default VectorTilesAPI;