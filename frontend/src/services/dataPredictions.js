import axiosClient from './axiosClient.js';

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
    const response = await axiosClient.get('/data-predictions', { params });
    return response.data;
};

/**
 * Fetch latest data predictions
 * @param {string} sensorCode - Optional sensor code filter
 */
export const fetchLatestDataPredictions = async (sensorCode = null) => {
    const endpoint = sensorCode 
        ? `/data-predictions/latest/${sensorCode}` 
        : '/data-predictions/latest';
    const response = await axiosClient.get(endpoint);
    return response.data;
};

/**
 * Fetch data predictions by sensor code
 * @param {string} sensorCode - Sensor code
 * @param {object} params - Query parameters
 */
export const fetchDataPredictionsBySensor = async (sensorCode, params = {}) => {
    const response = await axiosClient.get(`/data-predictions/by-sensor/${sensorCode}`, { params });
    return response.data;
};

/**
 * Get a single data prediction by ID
 * @param {number} id - Data prediction ID
 */
export const fetchDataPrediction = async (id) => {
    const response = await axiosClient.get(`/data-predictions/${id}`);
    return response.data;
};

/**
 * Store a new data prediction
 * @param {object} data - Data prediction data
 */
export const storeDataPrediction = async (data) => {
    const response = await axiosClient.post('/data-predictions', data);
    return response.data;
};

