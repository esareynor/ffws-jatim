const API_BASE_URL = "https://ffws-backend.rachmanesa.com/api";
const AUTH_TOKEN = "10|WwjflubP2UfeV8DKGlfkdGSOx4Gh6fbCV9tW7Vxda1aaf18a";

/**
 * A custom fetch wrapper that adds the authentication token to the request headers.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - Optional fetch options (e.g., method, body).
 * @returns {Promise<any>} A promise that resolves to the JSON response.
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
        ...options.headers,
    };

    const fullUrl = `${API_BASE_URL}${endpoint}`;

    console.log("=== API CALL ===");
    console.log("URL:", fullUrl);
    console.log("Headers:", headers);
    console.log("Options:", options);

    try {
        const response = await fetch(fullUrl, { ...options, headers });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", response.status, errorText);
            throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("API Response data:", data);
        console.log("=== END API CALL ===");
        return data;
    } catch (error) {
        console.error("API Call failed:", error);
        console.log("=== END API CALL (ERROR) ===");
        throw error;
    }
};
