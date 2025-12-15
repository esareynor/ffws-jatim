import { fetchWithAuth } from './apiClient.js';
import { tokenManager } from './tokenManager.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ffws-backend.rachmanesa.com/api";

/**
 * Fetches list of GeoJSON files from the API.
 * Note: This endpoint returns a simple array, not wrapped in standard response format.
 * @returns {Promise<Array>} A promise that resolves to an array of GeoJSON file metadata.
 */
export const fetchGeoJsonFiles = async () => {
    // Wait for token manager initialization
    await tokenManager.waitForInitialization();
    
    // This endpoint returns a direct array, not wrapped in {success, data}
    const response = await fetch(
        `${API_BASE_URL}/geojson-files`,
        {
            headers: {
                'Authorization': tokenManager.getAuthHeader(),
                'Content-Type': 'application/json',
            },
        }
    );
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch GeoJSON files: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
};

/**
 * Fetches the content of a GeoJSON file by ID.
 * Note: This endpoint returns raw GeoJSON, not wrapped in standard response format.
 * @param {number|string} id - GeoJSON file ID
 * @returns {Promise<Object>} A promise that resolves to GeoJSON content.
 */
export const fetchGeoJsonContent = async (id) => {
    // Wait for token manager initialization
    await tokenManager.waitForInitialization();
    
    const response = await fetch(
        `${API_BASE_URL}/geojson-files/${id}/content`,
        {
            headers: {
                'Authorization': tokenManager.getAuthHeader(),
                'Content-Type': 'application/json',
            },
        }
    );
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch GeoJSON content: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
};

