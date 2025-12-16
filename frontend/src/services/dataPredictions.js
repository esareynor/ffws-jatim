import { fetchWithAuth } from './apiClient.js';

/**
 * Fetch data predictions (predicted sensor readings)
 * @param {object} params - Query parameters
 * @param {string} params.sensor_code - Filter by sensor code
 * @param {number} params.model_id - Filter by model ID
 * @param {string} params.start_date - Start date (YYYY-MM-DD)
 * @param {string} params.end_date - End date (YYYY-MM-DD)
 * @param {string} params.threshold_status - Filter by threshold status
 * @param {number} params.per_page - Items per page
 * @param {string} params.sort_by - Sort field
 * @param {string} params.sort_order - Sort order (asc/desc)
 */
export const fetchDataPredictions = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/data-predictions${queryString ? `?${queryString}` : ''}`;
    return await fetchWithAuth(endpoint);
};

/**
 * Fetch latest data predictions
 * @param {string} sensorCode - Optional sensor code filter
 */
export const fetchLatestDataPredictions = async (sensorCode = null) => {
    const endpoint = sensorCode 
        ? `/data-predictions/latest/${sensorCode}` 
        : '/data-predictions/latest';
    return await fetchWithAuth(endpoint);
};

/**
 * Fetch data predictions by sensor code
 * @param {string} sensorCode - Sensor code
 * @param {object} params - Query parameters
 */
export const fetchDataPredictionsBySensor = async (sensorCode, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/data-predictions/by-sensor/${sensorCode}${queryString ? `?${queryString}` : ''}`;
    return await fetchWithAuth(endpoint);
};

/**
 * Get a single data prediction by ID
 * @param {number} id - Data prediction ID
 */
export const fetchDataPrediction = async (id) => {
    return await fetchWithAuth(`/data-predictions/${id}`);
};

/**
 * Store a new data prediction
 * @param {object} data - Data prediction data
 */
export const storeDataPrediction = async (data) => {
    return await fetchWithAuth('/data-predictions', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

