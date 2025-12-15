import { fetchWithAuth } from './apiClient.js';

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
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/data-actuals${queryString ? `?${queryString}` : ''}`;
    return await fetchWithAuth(endpoint);
};

/**
 * Fetch latest data actuals for all sensors
 */
export const fetchLatestDataActuals = async () => {
    return await fetchWithAuth('/data-actuals/latest');
};

/**
 * Fetch data actuals by sensor code
 * @param {string} sensorCode - Sensor code
 * @param {object} params - Query parameters
 */
export const fetchDataActualsBySensor = async (sensorCode, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/data-actuals/by-sensor/${sensorCode}${queryString ? `?${queryString}` : ''}`;
    return await fetchWithAuth(endpoint);
};

/**
 * Fetch statistics for a sensor
 * @param {string} sensorCode - Sensor code
 * @param {object} params - Query parameters
 */
export const fetchSensorStatistics = async (sensorCode, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/data-actuals/statistics/${sensorCode}${queryString ? `?${queryString}` : ''}`;
    return await fetchWithAuth(endpoint);
};

/**
 * Get a single data actual by ID
 * @param {number} id - Data actual ID
 */
export const fetchDataActual = async (id) => {
    return await fetchWithAuth(`/data-actuals/${id}`);
};

/**
 * Store a new data actual
 * @param {object} data - Data actual data
 */
export const storeDataActual = async (data) => {
    return await fetchWithAuth('/data-actuals', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

/**
 * Bulk store data actuals
 * @param {array} data - Array of data actual objects
 */
export const bulkStoreDataActuals = async (data) => {
    return await fetchWithAuth('/data-actuals/bulk', {
        method: 'POST',
        body: JSON.stringify({ data }),
    });
};

