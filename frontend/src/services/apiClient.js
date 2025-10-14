import { tokenManager } from './tokenManager.js';

const API_BASE_URL = "https://ffws-backend.rachmanesa.com/api";

/**
 * A custom fetch wrapper that adds the authentication token to the request headers
 * and handles automatic token refresh.
 * @param {string} endpoint - The API endpoint to call.
 * @param {object} options - Optional fetch options (e.g., method, body).
 * @returns {Promise<any>} A promise that resolves to the JSON response.
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
    // Wait for token manager initialization to complete
    await tokenManager.waitForInitialization();
    
    // Check if token needs refresh before making the request
    if (tokenManager.needsRefresh() && !tokenManager.isRefreshing) {
        try {
            await tokenManager.refreshToken();
        } catch (error) {
            console.warn('Token refresh failed, proceeding with current token:', error.message);
        }
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: tokenManager.getAuthHeader(),
        ...options.headers,
    };

    const fullUrl = `${API_BASE_URL}${endpoint}`;

    console.log("=== API CALL ===");
    console.log("URL:", fullUrl);
    console.log("Headers:", { ...headers, Authorization: headers.Authorization ? 'Bearer [TOKEN]' : 'No token' });
    console.log("Token Status:", {
        hasToken: !!tokenManager.getToken(),
        credentialsValidated: tokenManager.credentialsValidated,
        isLoggingIn: tokenManager.isLoggingIn
    });
    console.log("Options:", options);

    try {
        const response = await fetch(fullUrl, { ...options, headers });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        // Handle 401 Unauthorized - token might be expired
        if (response.status === 401 && tokenManager.getToken() && !tokenManager.isRefreshing) {
            console.log("🔄 Token expired, attempting refresh...");
            
            try {
                await tokenManager.refreshToken();
                
                // Retry the request with new token
                const newHeaders = {
                    ...headers,
                    Authorization: tokenManager.getAuthHeader(),
                };
                
                console.log("Retrying request with new token...");
                const retryResponse = await fetch(fullUrl, { ...options, headers: newHeaders });
                
                if (!retryResponse.ok) {
                    const errorText = await retryResponse.text();
                    console.error("API Error after retry:", retryResponse.status, errorText);
                    throw new Error(`Network response was not ok: ${retryResponse.status} - ${errorText}`);
                }
                
                const data = await retryResponse.json();
                console.log("API Response data (after retry):", data);
                console.log("=== END API CALL ===");
                return data;
                
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                // Jangan clear token, biarkan aplikasi tetap berjalan
                throw new Error('Authentication failed. Please check your token.');
            }
        }

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
