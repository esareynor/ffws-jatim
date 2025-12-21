import axiosClient from './axiosClient.js';

/**
 * Fetches all sensors from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of sensor objects.
 */
export const fetchSensors = async () => {
    const response = await axiosClient.get('/sensors');
    return response.data.data;
};

/**
 * Fetches a single sensor by ID.
 * @param {number|string} id - Sensor ID
 * @returns {Promise<Object>} A promise that resolves to a sensor object.
 */
export const fetchSensor = async (id) => {
    const response = await axiosClient.get(`/sensors/${id}`);
    return response.data.data;
};

/**
 * Fetches sensors by device ID.
 * @param {number|string} deviceId - Device ID
 * @returns {Promise<Array>} A promise that resolves to an array of sensor objects.
 */
export const fetchSensorsByDevice = async (deviceId) => {
    const response = await axiosClient.get(`/sensors/device/${deviceId}`);
    return response.data.data;
};

/**
 * Fetches sensors by parameter type.
 * @param {string} parameter - Parameter type (e.g., 'water_level', 'rainfall')
 * @returns {Promise<Array>} A promise that resolves to an array of sensor objects.
 */
export const fetchSensorsByParameter = async (parameter) => {
    const response = await axiosClient.get(`/sensors/parameter/${parameter}`);
    return response.data.data;
};

/**
 * Fetches sensors by status.
 * @param {string} status - Sensor status (e.g., 'active', 'inactive')
 * @returns {Promise<Array>} A promise that resolves to an array of sensor objects.
 */
export const fetchSensorsByStatus = async (status) => {
    const response = await axiosClient.get(`/sensors/status/${status}`);
    return response.data.data;
};