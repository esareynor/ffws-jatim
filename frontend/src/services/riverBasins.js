import { fetchWithAuth } from './apiClient.js';

/**
 * Fetches a river basin by ID.
 * @param {number|string} id - River Basin ID
 * @returns {Promise<Object>} A promise that resolves to a river basin object.
 */
export const fetchRiverBasin = async (id) => {
    const data = await fetchWithAuth(`/river-basins/${id}`);
    return data.data;
};

