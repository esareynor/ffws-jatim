import axiosClient from './axiosClient.js';

/**
 * Fetch data actuals (actual sensor readings)
 * @param {object} params - Query parameters
 * @param {string} params.sensor_code - Filter by sensor code
 * @param {string} params.start_date - Start date (YYYY-MM-DD)
 * @param {string} params.end_date - End date (YYYY-MM-DD)
 * @param {string} params.threshold_status - Filter by threshold status
 * @param {number} params.per_page - Items per page
 * @param {string} params.sort_by - Sort field
 * @param {string} params.sort_order - Sort order (asc/desc)
 */
export const fetchDataActuals = async (params = {}) => {
    const response = await axiosClient.get('/data-actuals', { params });
    return response.data;
};

/**
 * Fetch latest data actuals for all sensors
 */
export const fetchLatestDataActuals = async () => {
    const response = await axiosClient.get('/data-actuals/latest');
    return response.data;
};

/**
 * Fetch data actuals by sensor code
 * @param {string} sensorCode - Sensor code
 * @param {object} params - Query parameters
 */
export const fetchDataActualsBySensor = async (sensorCode, params = {}) => {
    const response = await axiosClient.get(`/data-actuals/by-sensor/${sensorCode}`, { params });
    return response.data;
};

/**
 * Fetch statistics for a sensor
 * @param {string} sensorCode - Sensor code
 * @param {object} params - Query parameters
 */
export const fetchSensorStatistics = async (sensorCode, params = {}) => {
    const response = await axiosClient.get(`/data-actuals/statistics/${sensorCode}`, { params });
    return response.data;
};

/**
 * Get a single data actual by ID
 * @param {number} id - Data actual ID
 */
export const fetchDataActual = async (id) => {
    const response = await axiosClient.get(`/data-actuals/${id}`);
    return response.data;
};

/**
 * Store a new data actual
 * @param {object} data - Data actual data
 */
export const storeDataActual = async (data) => {
    const response = await axiosClient.post('/data-actuals', data);
    return response.data;
};

/**
 * Bulk store data actuals
 * @param {array} data - Array of data actual objects
 */
export const bulkStoreDataActuals = async (data) => {
    const response = await axiosClient.post('/data-actuals/bulk', { data });
    return response.data;
};

