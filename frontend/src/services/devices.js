import { fetchWithAuth } from "./apiClient";

/**
 * Fetches devices data from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of device objects.
 */
export const fetchDevices = async () => {
    const data = await fetchWithAuth("/devices");
    return data.data;
};

/**
 * Fetches a single device by ID.
 * @param {number|string} id - Device ID
 * @returns {Promise<Object>} A promise that resolves to a device object.
 */
export const fetchDevice = async (id) => {
    const data = await fetchWithAuth(`/devices/${id}`);
    return data.data;
};
