import { fetchWithAuth } from "./apiClient";

// Cache untuk devices data
let devicesCache = null;
let devicesCacheTime = null;
let pendingRequest = null; // NEW: Cache untuk pending request
const CACHE_DURATION = 30000; // 30 detik

/**
 * Fetches devices data from the API with caching.
 * Cache will be used if data is less than 30 seconds old.
 * Multiple simultaneous calls will share the same request.
 * @param {boolean} forceRefresh - Force refresh data from API, bypass cache
 * @returns {Promise<Array>} A promise that resolves to an array of device objects.
 */
export const fetchDevices = async (forceRefresh = false) => {
    const now = Date.now();
    
    // Return cache if valid and not forced refresh
    if (!forceRefresh && devicesCache && devicesCacheTime && (now - devicesCacheTime < CACHE_DURATION)) {
        console.log('Using cached devices data');
        return devicesCache;
    }
    
    // If there's already a pending request, return that promise
    if (pendingRequest) {
        console.log('⏳ Waiting for existing API call to complete...');
        return pendingRequest;
    }
    
    console.log('Fetching fresh devices data from API');
    
    // Create and store the pending request
    pendingRequest = fetchWithAuth("/devices")
        .then(data => {
            // Update cache
            devicesCache = data.data;
            devicesCacheTime = Date.now();
            pendingRequest = null; // Clear pending request
            return data.data;
        })
        .catch(error => {
            pendingRequest = null; // Clear pending request on error
            throw error;
        });
    
    return pendingRequest;
};

/**
 * Clear devices cache - useful when data is updated
 */
export const clearDevicesCache = () => {
    devicesCache = null;
    devicesCacheTime = null;
    console.log('Devices cache cleared');
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
