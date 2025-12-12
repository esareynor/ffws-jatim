// src/components/devices/mapUtils.js
// Utilities extracted from MapboxMap for readability and reuse
export const REGION_ID_TO_DEVICE_ID = {
  'ws-baru-bajul-mati': 9,
  'ws-bengawan-solo': 8,
  'ws-bondoyudo-bedadung': 5,
  'ws-brantas': 10,
  'ws-pekalen-sampean': 7,
  'ws-welang-rejoso': 6,
  'ws-madura-bawean': 11,
};

export const DEVICE_ID_TO_COLOR = {
  9: '#8A2BE2',
  8: '#FF7F50',
  5: '#00CED1',
  10: '#FF4500',
  7: '#FF69B4',
  6: '#FF00FF',
  11: '#FFD700',
};

export const getBBox = (geometry) => {
  const bounds = [[Infinity, Infinity], [-Infinity, -Infinity]];
  const traverse = (arr) => {
    if (arr.length === 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number') {
      bounds[0][0] = Math.min(bounds[0][0], arr[0]);
      bounds[0][1] = Math.min(bounds[0][1], arr[1]);
      bounds[1][0] = Math.max(bounds[1][0], arr[0]);
      bounds[1][1] = Math.max(bounds[1][1], arr[1]);
    } else arr.forEach(traverse);
  };
  traverse(geometry.coordinates);
  return bounds;
};

const pointInRing = (x, y, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

export const pointInPolygon = (point, polygon) => {
  const x = point[0], y = point[1];
  if (!Array.isArray(polygon) || polygon.length === 0) return false;
  if (pointInRing(x, y, polygon[0]) === false) return false;
  for (let i = 1; i < polygon.length; i++) {
    if (pointInRing(x, y, polygon[i])) return false;
  }
  return true;
};

export const pointInGeoJSON = (geojson, point) => {
  if (!geojson || !geojson.type) return false;
  const coords = point; // [lng, lat]
  if (geojson.type === 'FeatureCollection') {
    return geojson.features.some(f => pointInGeoJSON(f, coords));
  }
  if (geojson.type === 'Feature') {
    return pointInGeoJSON(geojson.geometry, coords);
  }
  if (geojson.type === 'Polygon') {
    return pointInPolygon(coords, geojson.coordinates);
  }
  if (geojson.type === 'MultiPolygon') {
    return geojson.coordinates.some(poly => pointInPolygon(coords, poly));
  }
  return false;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'safe': return '#10B981';
    case 'warning': return '#F59E0B';
    case 'alert': return '#EF4444';
    default: return '#6B7280';
  }
};

export const getMarkerStyle = (stationName) => {
  if (!stationName) return { color: getStatusColor('default'), icon: '', type: 'default' };
  if (stationName.includes('UPT')) {
    return { color: '#1F2937', icon: `<svg .../>`, type: 'upt' };
  }
  if (stationName.includes('WS') || stationName.startsWith('BS')) {
    return { color: '#10B981', icon: `<svg .../>`, type: 'ws' };
  }
  if (stationName.startsWith('AWLR')) {
    return { color: '#F59E0B', icon: `<svg .../>`, type: 'awlr' };
  }
  return { color: getStatusColor('default'), icon: `<svg .../>`, type: 'default' };
};

export const getButtonStyleOverride = ({ isHujanJamJamActive, isPosDugaJamJamActive, isHujanBrantasActive, isDugaAirBrantasActive, isDugaAirBengawanSoloActive, isBengawanSoloPJT1Active }) => {
  if (isPosDugaJamJamActive) return { color: '#0369A1', shape: 'rounded-square', icon: `<svg .../>` };
  if (isHujanJamJamActive) return { color: '#1E90FF', shape: 'pin', icon: `<svg .../>` };
  if (isHujanBrantasActive) return { color: '#DC2626', shape: 'circle', icon: `<svg .../>` };
  if (isDugaAirBrantasActive) return { color: '#F59E0B', shape: 'diamond', icon: `<svg .../>` };
  if (isDugaAirBengawanSoloActive) return { color: '#10B981', shape: 'triangle', icon: `<svg .../>` };
  if (isBengawanSoloPJT1Active) return { color: '#7C3AED', shape: 'circle-with-square', icon: `<svg .../>` };
  return null;
};

export const getUptIdFromStationName = (stationName) => {
  if (!stationName) return null;
  const uptMapping = {
    "UPT PSDA Welang Pekalen Pasuruan": "upt-welang-pekalen",
    "UPT PSDA Madura Pamekasan": "upt-madura",
    "UPT PSDA Bengawan Solo Bojonegoro": "upt-bengawan-solo",
    "UPT PSDA Brantas Kediri": "upt-brantas",
    "UPT PSDA Sampean Setail Bondowoso": "upt-sampean",
    "Dinas PUSDA Jatim": "dinas-pusda",
    "ARR Wagir": "pos-hujan-ws-brantas-pjt1",
    "ARR Tangkil": "pos-hujan-ws-brantas-pjt1",
    "ARR Poncokusumo": "pos-hujan-ws-brantas-pjt1",
    "ARR Dampit": "pos-hujan-ws-brantas-pjt1",
    "ARR Sengguruh": "pos-hujan-ws-brantas-pjt1",
    "ARR Sutami": "pos-hujan-ws-brantas-pjt1",
    // ... truncated for brevity - the full mapping is in MapboxMap.jsx's earlier list
  };
  for (const [name, id] of Object.entries(uptMapping)) {
    if (stationName.includes(name)) return id;
  }
  return null;
};

export const extractKeywords = (list) => list.map(name => {
  const parts = name.split(' ');
  return parts[parts.length - 1];
});
