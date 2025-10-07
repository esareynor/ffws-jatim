import { useEffect } from 'react';

export const useMapInteraction = (map) => {
  useEffect(() => {
    if (!map.current) return;
    
    const handleMapInteraction = (source) => {
      console.log('Map interaction:', source);
      const event = new CustomEvent('userInteraction', {
        detail: { source }
      });
      document.dispatchEvent(event);
    };
    
    // Tambahkan event listener untuk berbagai interaksi peta
    map.current.on('dragstart', () => handleMapInteraction('mapDrag'));
    map.current.on('zoomstart', () => handleMapInteraction('mapZoom'));
    map.current.on('rotatestart', () => handleMapInteraction('mapRotate'));
    map.current.on('pitchstart', () => handleMapInteraction('mapPitch'));
    
    // Tambahkan event listener untuk zoom change
    map.current.on('zoomend', () => {
      const zoomLevel = map.current.getZoom();
      console.log('Zoom level changed to:', zoomLevel);
      
      if (map.current.getLayer('flood-layer')) {
        map.current.setLayoutProperty(
          'flood-layer',
          'visibility',
          zoomLevel >= 10 ? 'visible' : 'none'
        );
      }
    });
    
    return () => {
      // Hapus event listener
      if (map.current) {
        map.current.off('dragstart', () => {});
        map.current.off('zoomstart', () => {});
        map.current.off('rotatestart', () => {});
        map.current.off('pitchstart', () => {});
        map.current.off('zoomend', () => {});
      }
    };
  }, [map]);
};