import axiosClient from "./axiosClient";

/**
 * Fetches test data from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON data.
 */
export const fetchTestData = async () => {
    const response = await axiosClient.get("/test");
    return response.data;
};
