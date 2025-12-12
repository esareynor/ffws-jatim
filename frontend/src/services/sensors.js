import { fetchWithAuth } from "./apiClient";

/**
 * Fetches devices data from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of device objects.
 */
export const fetchSensors = async () => {
    const data = await fetchWithAuth("/sensors/");
    return data.data;
};
