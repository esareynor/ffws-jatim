// src/services/MapGeo.js

import axiosClient from "./axiosClient";

// Mapping antara Device ID dan nama wilayah sungai
const DEVICE_ID_TO_WS_NAME = {
  1: 'WS BARU-BAJULMATI',
  2: 'WS BENGAWAN SOLO',
  3: 'WS BONDOYUDO-BEDADUNG',
  4: 'WS BRANTAS',
  5: 'WS MADURA BAWEAN',
  6: 'WS PEKALEN-SAMPEAN',
  7: 'WS WELANG-REJOSO',
};

// Cache untuk menyimpan master GeoJSON file
let masterGeojsonCache = null;

/**
 * Load master GeoJSON file yang berisi semua wilayah sungai
 */
const loadMasterGeojson = async () => {
  if (masterGeojsonCache) {
    return masterGeojsonCache;
  }

  try {
    const res = await fetch('/src/data/72_peta_4_peta_Wilayah_Sungai.json');
    if (!res.ok) {
      throw new Error(`Failed to load master GeoJSON: ${res.status}`);
    }
    masterGeojsonCache = await res.json();
    console.log('✅ Master GeoJSON loaded and cached');
    return masterGeojsonCache;
  } catch (error) {
    console.error('❌ Failed to load master GeoJSON:', error);
    throw error;
  }
};

/**
 * Filter GeoJSON berdasarkan nama wilayah sungai
 */
const filterGeojsonByName = (masterGeojson, wsName) => {
  if (!masterGeojson || !masterGeojson.features) {
    return null;
  }

  const filteredFeatures = masterGeojson.features.filter((feature) => {
    const featureName = feature.properties?.WS || '';
    return featureName.toLowerCase().trim() === wsName.toLowerCase().trim();
  });

  if (filteredFeatures.length === 0) {
    return null;
  }

  return {
    type: 'FeatureCollection',
    name: wsName,
    features: filteredFeatures,
  };
};

export const fetchDeviceGeoJSON = async (id) => {
  try {
    console.log(`🔍 Fetching GeoJSON for device ID: ${id}`);

    // Coba fetch dari API dulu
    try {
      const response = await axiosClient.get(`/geojson-files/${id}/content`);
      const geojson = response.data;

      // Validate minimal GeoJSON structure
      if (!geojson || typeof geojson !== 'object') {
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

      console.log(`✅ Successfully loaded GeoJSON from API for device ID ${id}`);
      return geojson;
    } catch (apiError) {
      console.warn(`⚠️ API call failed for device ID ${id}:`, apiError.message);
      console.log(`📂 Trying local fallback for device ID ${id}...`);

      // Jika API gagal, gunakan fallback dari master GeoJSON
      const wsName = DEVICE_ID_TO_WS_NAME[id];
      if (!wsName) {
        throw new Error(`Unknown device ID: ${id}`);
      }

      const masterGeojson = await loadMasterGeojson();
      const filteredGeojson = filterGeojsonByName(masterGeojson, wsName);

      if (!filteredGeojson || filteredGeojson.features.length === 0) {
        throw new Error(
          `No features found for wilayah sungai "${wsName}" (device ID ${id})`
        );
      }

      console.log(
        `✅ Successfully loaded GeoJSON from local fallback for device ID ${id}`,
        filteredGeojson
      );
      return filteredGeojson;
    }
  } catch (error) {
    console.error(
      `❌ FAILED to load GeoJSON for device ID ${id}:`,
      error.message || error
    );
    throw new Error(
      `Failed to load GeoJSON for device ID ${id} — no API or local fallback available.`
    );
  }
};