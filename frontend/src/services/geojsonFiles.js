import axiosClient from './axiosClient.js';

/**
 * Fetches list of GeoJSON files from the API.
 * Note: This endpoint returns a simple array, not wrapped in standard response format.
 * @returns {Promise<Array>} A promise that resolves to an array of GeoJSON file metadata.
 */
export const fetchGeoJsonFiles = async () => {
    const response = await axiosClient.get('/geojson-files');
    return response.data;
};

/**
 * Fetches the content of a GeoJSON file by ID.
 * Note: This endpoint returns raw GeoJSON, not wrapped in standard response format.
 * @param {number|string} id - GeoJSON file ID
 * @returns {Promise<Object>} A promise that resolves to GeoJSON content.
 */
export const fetchGeoJsonContent = async (id) => {
    const response = await axiosClient.get(`/geojson-files/${id}/content`);
    return response.data;
};

