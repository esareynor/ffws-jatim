// src/services/MapGeo.js

import { fetchWithAuth } from "./apiClient";

export const fetchDeviceGeoJSON = async (id) => {
  try {
    console.log(`🔍 Fetching GeoJSON for device ID: ${id}`);

    // fetchWithAuth already prefixes API_BASE_URL, so do NOT include extra `/api` here
    // It returns parsed JSON (or throws), so use it directly.
    const geojson = await fetchWithAuth(`/geojson-files/${id}/content`);

    // Validate minimal GeoJSON structure
    if (!geojson || (typeof geojson !== 'object')) {
      throw new Error(`Invalid response from API for device ID ${id}`);
    }

    if (!geojson.type || !geojson.features) {
      // Some APIs might return a wrapper; try to find geojson inside
      if (geojson.data && geojson.data.type && geojson.data.features) {
        console.log(`ℹ️ Extracting geojson from wrapper for device ID ${id}`);
        return geojson.data;
      }
      throw new Error(`Invalid GeoJSON structure for device ID ${id}. Missing 'type' or 'features'.`);
    }

    console.log(`✅ Successfully loaded GeoJSON for device ID ${id}`, geojson);
    return geojson;

  } catch (error) {
    console.error(`❌ FAILED to load GeoJSON for device ID ${id}:`, error.message || error);
    console.warn(`⚠️ Using local fallback for device ID ${id}`);

    // Fallback local filenames use .json in the repo `src/data` folder
    let localPath;
    switch (id) {
      case 9:
        localPath = '/src/data/WSBaruBajulMati.json';
        break;
      case 8:
        localPath = '/src/data/WSBengawanSolo.json';
        break;
      case 5:
        localPath = '/src/data/WSBondoyudoBedadung.json';
        break;
      case 10:
        localPath = '/src/data/WSBrantas.json';
        break;
      case 7:
        localPath = '/src/data/WSPekalenSampean.json';
        break;
      case 6:
        localPath = '/src/data/WSWelangRejoso.json';
        break;
      case 11:
        localPath = '/src/data/WSMaduraBawean.json';
        break;
      default:
        throw new Error(`No fallback file for device ID ${id}`);
    }

    try {
      const res = await fetch(localPath);
      if (!res.ok) {
        throw new Error(`Local file not found: ${localPath}`);
      }
      const geojson = await res.json();
      console.log(`✅ Loaded local fallback GeoJSON for device ID ${id}`, geojson);
      return geojson;
    } catch (fallbackError) {
      console.error(`❌ Fallback also failed for device ID ${id}:`, fallbackError);
      throw new Error(`Failed to load GeoJSON for device ID ${id} — no API or local fallback available.`);
    }
  }
};