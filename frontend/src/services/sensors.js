import { fetchWithAuth } from './apiClient.js';

/**
 * Fetches all sensors from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of sensor objects.
 */
export const fetchSensors = async () => {
    const data = await fetchWithAuth('/sensors');
    return data.data;
};

/**
 * Fetches a single sensor by ID.
 * @param {number|string} id - Sensor ID
 * @returns {Promise<Object>} A promise that resolves to a sensor object.
 */
export const fetchSensor = async (id) => {
    const data = await fetchWithAuth(`/sensors/${id}`);
    return data.data;
};

/**
 * Fetches sensors by device ID.
 * @param {number|string} deviceId - Device ID
 * @returns {Promise<Array>} A promise that resolves to an array of sensor objects.
 */
export const fetchSensorsByDevice = async (deviceId) => {
    const data = await fetchWithAuth(`/sensors/device/${deviceId}`);
    return data.data;
};

/**
 * Fetches sensors by parameter type.
 * @param {string} parameter - Parameter type (e.g., 'water_level', 'rainfall')
 * @returns {Promise<Array>} A promise that resolves to an array of sensor objects.
 */
export const fetchSensorsByParameter = async (parameter) => {
    const data = await fetchWithAuth(`/sensors/parameter/${parameter}`);
    return data.data;
};

/**
 * Fetches sensors by status.
 * @param {string} status - Sensor status (e.g., 'active', 'inactive')
 * @returns {Promise<Array>} A promise that resolves to an array of sensor objects.
 */
export const fetchSensorsByStatus = async (status) => {
    const data = await fetchWithAuth(`/sensors/status/${status}`);
    return data.data;
};