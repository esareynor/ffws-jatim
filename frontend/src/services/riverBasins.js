import axiosClient from './axiosClient.js';

/**
 * Fetches a river basin by ID.
 * @param {number|string} id - River Basin ID
 * @returns {Promise<Object>} A promise that resolves to a river basin object.
 */
export const fetchRiverBasin = async (id) => {
    const response = await axiosClient.get(`/river-basins/${id}`);
    return response.data.data;
};

