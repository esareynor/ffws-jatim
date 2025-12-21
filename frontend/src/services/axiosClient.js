import axios from 'axios';
import { tokenManager } from './tokenManager.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.DEV;

/**
 * Axios instance dengan interceptors untuk authentication
 * Menggantikan fetchWithAuth dari apiClient.js
 */
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 seconds timeout (reduced from 30s)
});

// Flag untuk track apakah sudah initialized
let isInitialized = false;

/**
 * Request Interceptor
 * - Menunggu token manager initialization (hanya sekali)
 * - Auto refresh token jika diperlukan
 * - Menambahkan Authorization header
 */
axiosClient.interceptors.request.use(
    async (config) => {
        // Wait for token manager initialization ONLY on first request
        if (!isInitialized) {
            await tokenManager.waitForInitialization();
            isInitialized = true;
        }

        // Check if token needs refresh before making the request
        if (tokenManager.needsRefresh() && !tokenManager.isRefreshing) {
            try {
                await tokenManager.refreshToken();
            } catch (error) {
                if (isDev) console.warn('Token refresh failed:', error.message);
            }
        }

        // Add authorization header
        const authHeader = tokenManager.getAuthHeader();
        if (authHeader) {
            config.headers.Authorization = authHeader;
        }

        // Debug logging (only in development)
        if (isDev) {
            console.log(`📡 ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor
 * - Handle 401 Unauthorized dengan auto retry
 * - Handle error dengan format yang konsisten
 */
axiosClient.interceptors.response.use(
    (response) => {
        if (isDev) {
            console.log(`✅ ${response.status} ${response.config.url}`);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - token might be expired
        if (
            error.response?.status === 401 && 
            tokenManager.getToken() && 
            !tokenManager.isRefreshing &&
            !originalRequest._retry
        ) {
            if (isDev) console.log("🔄 Token expired, attempting refresh...");
            originalRequest._retry = true;

            try {
                await tokenManager.refreshToken();

                // Retry the request with new token
                originalRequest.headers.Authorization = tokenManager.getAuthHeader();
                
                return axiosClient(originalRequest);
            } catch (refreshError) {
                if (isDev) console.error("❌ Token refresh failed:", refreshError);
                return Promise.reject(new Error('Authentication failed. Please check your token.'));
            }
        }

        // Log error details (only in development)
        if (isDev) {
            console.error(`❌ ${error.response?.status || 'ERR'} ${originalRequest?.url}:`, error.response?.data?.message || error.message);
        }

        // Create a consistent error message
        const errorMessage = error.response?.data?.message || 
                           error.response?.statusText || 
                           error.message ||
                           'Network error occurred';
        
        return Promise.reject(new Error(`${error.response?.status || 'unknown'} - ${errorMessage}`));
    }
);

export default axiosClient;
