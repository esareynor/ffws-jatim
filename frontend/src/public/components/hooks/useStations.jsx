import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export const useStations = (map, tickerData) => {
  const markersRef = useRef([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    station: null,
    coordinates: null
  });

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'alert': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    const iconSize = 27;
    const iconColor = 'white';
    switch (status) {
      case 'safe':
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      case 'warning':
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V13M12 17.0195V17M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      case 'alert':
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 7.25V13M12 16.75V16.76M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      default:
        return `<svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="${iconColor}" stroke-width="2"/>
        </svg>`;
    }
  };

  const getStationCoordinates = (stationName) => {
    const coordinates = {
      'Stasiun Surabaya': [112.7508, -7.2575],
      'Stasiun Malang': [112.6308, -7.9831],
      'Stasiun Sidoarjo': [112.7183, -7.4478],
      'Stasiun Probolinggo': [113.7156, -7.7764],
      'Stasiun Pasuruan': [112.6909, -7.6461],
      'Stasiun Mojokerto': [112.4694, -7.4706],
      'Stasiun Lamongan': [112.3333, -7.1167],
      'Stasiun Gresik': [112.5729, -7.1554],
      'Stasiun Tuban': [112.0483, -6.8976],
      'Stasiun Bojonegoro': [111.8816, -7.1500],
      'Stasiun Jombang': [112.2333, -7.5500],
      'Stasiun Nganjuk': [111.8833, -7.6000],
      'Stasiun Kediri': [112.0167, -7.8167],
      'Stasiun Blitar': [112.1667, -8.1000],
      'Stasiun Tulungagung': [111.9000, -8.0667],
      'Stasiun Bangil': [112.7333, -7.6000],
      'Stasiun Lawang': [112.6833, -7.8333],
      'Stasiun Singosari': [112.6500, -7.9000],
      'Stasiun Wates': [110.3569, -7.9133],
      'Stasiun Lempuyangan': [110.3739, -7.7884],
    };
    return coordinates[stationName] || null;
  };

  const generateFloodData = (stations) => {
    if (!stations || stations.length === 0) return null;
    
    const features = stations.map(station => {
      const coordinates = getStationCoordinates(station.name);
      if (!coordinates) return null;
      
      let radius;
      if (station.status === 'alert') {
        radius = 0.015 * (station.value / 5);
      } else if (station.status === 'warning') {
        radius = 0.01 * (station.value / 5);
      } else {
        radius = 0.005 * (station.value / 5);
      }
      
      const circlePoints = [];
      const points = 64;
      
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const x = coordinates[0] + Math.cos(angle) * radius;
        const y = coordinates[1] + Math.sin(angle) * radius;
        circlePoints.push([x, y]);
      }
      
      circlePoints.push(circlePoints[0]);
      
      let fillColor;
      if (station.status === 'alert') {
        fillColor = 'rgba(239, 68, 68, 0.6)';
      } else if (station.status === 'warning') {
        fillColor = 'rgba(245, 158, 11, 0.6)';
      } else {
        fillColor = 'rgba(16, 185, 129, 0.6)';
      }
      
      return {
        type: 'Feature',
        properties: {
          stationId: station.id,
          stationName: station.name,
          status: station.status,
          value: station.value,
          fillColor: fillColor
        },
        geometry: {
          type: 'Polygon',
          coordinates: [circlePoints]
        }
      };
    }).filter(Boolean);
    
    return {
      type: 'FeatureCollection',
      features: features
    };
  };

  const handleShowDetail = (station) => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleCloseTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleMapFocus = (focusData) => {
    if (!map.current) return;
    const { lat, lng, zoom, stationId, stationName } = focusData;
    
    map.current.flyTo({
      center: [lng, lat],
      zoom: zoom || 14,
      pitch: 45,
      bearing: -17.6,
      speed: 1.2,
      curve: 1.4,
      easing: (t) => t,
      essential: true
    });
    
    setTimeout(() => {
      if (tickerData) {
        const station = tickerData.find(s => s.id === stationId);
        if (station) {
          const coordinates = getStationCoordinates(station.name);
          if (coordinates) {
            setTooltip({
              visible: true,
              station: station,
              coordinates: coordinates
            });
          }
        }
      }
    }, 800);
  };

  const handleAutoSwitch = (station, index) => {
    if (!map.current || !station) return;
    const coordinates = getStationCoordinates(station.name);
    if (!coordinates) return;
    
    map.current.flyTo({
      center: coordinates,
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
      speed: 1.2,
      curve: 1.4,
      easing: (t) => t,
      essential: true
    });
    
    setTimeout(() => {
      setTooltip({
        visible: true,
        station: station,
        coordinates: coordinates
      });
    }, 800);
  };

  // Update markers and flood data when tickerData changes
  useEffect(() => {
    if (!map.current || !tickerData) return;
    
    // Hapus marker yang ada
    markersRef.current.forEach(marker => {
      if (marker) marker.remove();
    });
    markersRef.current = [];
    
    // Generate data genangan air
    const newFloodData = generateFloodData(tickerData);
    
    // Update source data genangan air jika peta sudah dimuat
    if (map.current.getSource('flood-data') && newFloodData) {
      map.current.getSource('flood-data').setData(newFloodData);
    }
    
    tickerData.forEach((station) => {
      const coordinates = getStationCoordinates(station.name);
      if (coordinates) {
        try {
          const markerEl = document.createElement('div');
          markerEl.className = 'custom-marker';
          markerEl.style.width = '27px';
          markerEl.style.height = '27px';
          markerEl.style.borderRadius = '50%';
          markerEl.style.backgroundColor = getStatusColor(station.status);
          markerEl.style.border = '3px solid white';
          markerEl.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
          markerEl.style.cursor = 'pointer';
          markerEl.style.zIndex = '10';
          markerEl.style.display = 'flex';
          markerEl.style.alignItems = 'center';
          markerEl.style.justifyContent = 'center';
          
          // Kembali ke bentuk semula dengan ikon status
          const iconSvg = getStatusIcon(station.status);
          markerEl.innerHTML = iconSvg;
          
          const marker = new mapboxgl.Marker(markerEl).setLngLat(coordinates).addTo(map.current);
          markersRef.current.push(marker);
          
          markerEl.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Marker clicked:', station.name);
            
            map.current.flyTo({
              center: coordinates,
              zoom: 12,
              pitch: 45,
              bearing: -17.6,
              speed: 1.2,
              curve: 1.4,
              easing: (t) => t,
              essential: true
            });
            
            setTooltip({
              visible: true,
              station: station,
              coordinates: coordinates
            });
            
            const event = new CustomEvent('userInteraction', {
              detail: { source: 'mapMarker', stationId: station.id }
            });
            document.dispatchEvent(event);
          });
        } catch (error) {
          console.error('Error creating marker for station:', station.name, error);
        }
      }
    });
  }, [tickerData]);

  // Event listener untuk klik di luar tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltip.visible &&
          !event.target.closest('.custom-marker') &&
          !event.target.closest('.mapboxgl-popup-content') &&
          !event.target.closest('.map-tooltip')) {
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [tooltip.visible]);

  // Expose functions ke window object
  useEffect(() => {
    window.mapboxAutoFocus = handleMapFocus;
    window.mapboxAutoSwitch = handleAutoSwitch;
    
    return () => {
      if (window.mapboxAutoFocus) {
        delete window.mapboxAutoFocus;
      }
      if (window.mapboxAutoSwitch) {
        delete window.mapboxAutoSwitch;
      }
    };
  }, [tickerData]);

  // Cleanup markers saat komponen unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => {
        if (marker) marker.remove();
      });
      markersRef.current = [];
    };
  }, []);

  return {
    tooltip,
    handleShowDetail,
    handleCloseTooltip,
    handleMapFocus,
    handleAutoSwitch
  };
};