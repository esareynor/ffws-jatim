// src/services/MapGeo.js

import { fetchWithAuth } from "./apiClient";

export const fetchDeviceGeoJSON = async (id) => {
  try {
    console.log(`🔍 Fetching GeoJSON for device ID: ${id}`);

    const response = await fetchWithAuth(`/api/geojson-files/${id}/content`);

    // ✅ Pastikan response OK
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    // ✅ Ambil sebagai text dulu
    const text = await response.text();

    // ✅ Jika kosong, lempar error
    if (!text.trim()) {
      throw new Error(`Empty response body for device ID ${id}. No content returned.`);
    }

    // ✅ Cek apakah teks adalah JSON valid
    const trimmedText = text.trim();

    // ✅ Cek apakah dimulai dengan '{' atau '[' — tanda JSON valid
    if (!trimmedText.startsWith('{') && !trimmedText.startsWith('[')) {
      console.error(`❌ Response is not valid JSON for device ID ${id}. Raw response:`, text);
      throw new Error(
        `Invalid JSON format for device ID ${id}. Expected JSON but got: ${text.substring(0, 200)}...`
      );
    }

    let geojson;
    try {
      geojson = JSON.parse(trimmedText);
    } catch (parseError) {
      console.error(`❌ Failed to parse JSON for device ID ${id}:`, parseError);
      console.error(`Raw response text:`, text); // 👈 Tampilkan isi raw untuk debugging
      throw new Error(`Invalid JSON format for device ID ${id}. Raw response: ${text.substring(0, 200)}...`);
    }

    // ✅ Validasi struktur GeoJSON minimal
    if (!geojson.type || !geojson.features) {
      throw new Error(`Invalid GeoJSON structure for device ID ${id}. Missing 'type' or 'features'.`);
    }

    console.log(`✅ Successfully loaded GeoJSON for device ID ${id}`, geojson);

    return geojson;

  } catch (error) {
    console.error(`❌ FAILED to load GeoJSON for device ID ${id}:`, error.message);

    // ✅ Fallback ke file lokal jika API gagal
    console.warn(`⚠️ Using local fallback for device ID ${id}`);

    let localPath;
    switch (id) {
      case 9:
        localPath = '/src/data/WSBaruBajulMati.geojson';
        break;
      case 8:
        localPath = '/src/data/WSBengawanSolo.geojson';
        break;
      case 5:
        localPath = '/src/data/WSBondoyudoBedadung.geojson';
        break;
      case 10:
        localPath = '/src/data/WSBrantas.geojson';
        break;
      case 7:
        localPath = '/src/data/WSPekalenSampean.geojson';
        break;
      case 6:
        localPath = '/src/data/WSWelangRejoso.geojson';
        break;
      case 11:
        localPath = '/src/data/WSMaduraBawean.geojson';
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