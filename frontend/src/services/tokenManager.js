/**
 * Token Manager untuk FFWS Jawa Timur
 * Menggunakan Laravel Sanctum dengan auto-refresh token dan auto-login
 */

const API_BASE_URL = "https://ffws-backend.rachmanesa.com/api";

class TokenManager {
    constructor() {
        this.token = null;
        this.tokenExpiresAt = null;
        this.isRefreshing = false;
        this.failedQueue = [];
        this.isLoggingIn = false;
        this.credentialsValidated = false;
        this.initializationPromise = null;
        
        // HAPUS SEMUA CACHE - WAJIB VALIDASI SERVER
        this.clearAllCache();
        
        // Setup auto refresh
        this.setupAutoRefresh();
        
        // Setup auto login jika diperlukan
        this.initializationPromise = this.setupAutoLogin();
    }

    /**
     * HAPUS SEMUA CACHE - WAJIB VALIDASI SERVER
     */
    clearAllCache() {
        console.log('🗑️ CLEARING ALL CACHE - Server validation required');
        
        // Clear semua token dan cache
        this.token = null;
        this.tokenExpiresAt = null;
        this.credentialsValidated = false;
        
        // Hapus dari localStorage
        localStorage.removeItem('ffws_token');
        localStorage.removeItem('ffws_token_expires_at');
        
        // Hapus semua item localStorage yang terkait
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('ffws_')) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('✅ All cache cleared - fresh start required');
    }

    /**
     * Simpan token ke localStorage
     */
    saveTokenToStorage(token, expiresAt) {
        this.token = token;
        this.tokenExpiresAt = expiresAt;
        
        localStorage.setItem('ffws_token', token);
        localStorage.setItem('ffws_token_expires_at', expiresAt);
        
        console.log('💾 Token saved to storage');
    }

    /**
     * Clear token dari localStorage
     */
    clearToken() {
        this.token = null;
        this.tokenExpiresAt = null;
        
        localStorage.removeItem('ffws_token');
        localStorage.removeItem('ffws_token_expires_at');
        
        console.log('🗑️ Token cleared from storage');
    }

    /**
     * Cek apakah token akan expired dalam 5 menit
     */
    needsRefresh() {
        if (!this.tokenExpiresAt) return false;
        
        const expiryTime = new Date(this.tokenExpiresAt).getTime();
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        const fiveMinutes = 5 * 60 * 1000; // 5 menit dalam milliseconds
        
        return timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0;
    }

    /**
     * Cek apakah token sudah expired
     */
    isTokenExpired() {
        if (!this.tokenExpiresAt) return true;
        
        const expiryTime = new Date(this.tokenExpiresAt).getTime();
        const currentTime = Date.now();
        
        return currentTime >= expiryTime;
    }

    /**
     * Get current token
     */
    getToken() {
        return this.token;
    }

    /**
     * Wait for initialization to complete
     */
    async waitForInitialization() {
        if (this.initializationPromise) {
            await this.initializationPromise;
        }
    }

    /**
     * Get authorization header - HANYA JIKA CREDENTIALS VALID
     */
    getAuthHeader() {
        // HANYA return token jika credentials sudah divalidasi dengan server
        if (this.credentialsValidated && this.token) {
            return `Bearer ${this.token}`;
        }
        console.log('🚫 No valid token - credentials not validated');
        return '';
    }

    /**
     * Set token manual
     */
    setToken(token, expiresAt = null) {
        if (!expiresAt) {
            // Default 1 jam dari sekarang
            expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        }
        
        this.saveTokenToStorage(token, expiresAt);
        console.log('🔧 Token set manually');
    }

    /**
     * Refresh token
     */
    async refreshToken() {
        if (this.isRefreshing) {
            // Jika sedang refresh, tunggu sampai selesai
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            });
        }

        if (!this.token) {
            throw new Error('No token available for refresh');
        }

        this.isRefreshing = true;
        console.log('🔄 Refreshing token...');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                // Update token dan expiry time
                this.saveTokenToStorage(data.data.token, data.data.expires_at);
                console.log('✅ Token refreshed successfully');
                
                // Process failed queue
                this.processQueue(null, data.data.token);
                
                return data.data.token;
            } else {
                throw new Error(data.message || 'Token refresh failed');
            }
        } catch (error) {
            console.error('❌ Token refresh failed:', error);
            this.processQueue(error, null);
            // Jangan clear token, biarkan tetap menggunakan token lama
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }

    /**
     * Process failed requests queue
     */
    processQueue(error, token = null) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });
        
        this.failedQueue = [];
    }

    /**
     * Setup auto refresh
     */
    setupAutoRefresh() {
        console.log('🔄 Auto-refresh token setup started');
        
        // Cek setiap 1 menit
        setInterval(async () => {
            if (this.needsRefresh() && !this.isRefreshing) {
                const minutesLeft = Math.floor((new Date(this.tokenExpiresAt).getTime() - Date.now()) / 60000);
                console.log(`⏰ Token akan expired dalam ${minutesLeft} menit, refreshing...`);
                
                try {
                    await this.refreshToken();
                } catch (error) {
                    console.error('❌ Auto-refresh failed:', error);
                    // Coba auto-login jika refresh gagal
                    await this.attemptAutoLogin();
                }
            }
        }, 60000); // 60000ms = 1 menit
    }

    /**
     * Setup auto login - WAJIB VALIDASI SERVER
     */
    async setupAutoLogin() {
        const autoLoginEnabled = import.meta.env.VITE_AUTO_LOGIN_ENABLED === 'true';
        
        if (!autoLoginEnabled) {
            console.log('🔐 Auto-login disabled');
            return;
        }

        // HANYA gunakan credentials dari environment variables
        const email = import.meta.env.VITE_AUTO_LOGIN_EMAIL;
        const password = import.meta.env.VITE_AUTO_LOGIN_PASSWORD;

        // Cek apakah credentials tersedia
        if (!email || !password) {
            console.log('❌ Auto-login credentials not provided in environment variables');
            console.log('❌ Please set VITE_AUTO_LOGIN_EMAIL and VITE_AUTO_LOGIN_PASSWORD in .env.local');
            return;
        }

        console.log('🔐 Auto-login setup started - SERVER VALIDATION REQUIRED');
        console.log('🔐 Using credentials from environment:', { email, password: '***' });
        
        // SELALU coba auto-login untuk validasi credentials dengan server
        console.log('🔐 Validating credentials with server...');
        return await this.attemptAutoLogin(email, password);
    }

    /**
     * Attempt auto login - VALIDASI SERVER WAJIB
     */
    async attemptAutoLogin(email = null, password = null) {
        if (this.isLoggingIn) {
            console.log('🔐 Already attempting login, skipping...');
            return;
        }

        this.isLoggingIn = true;

        try {
            // HANYA gunakan credentials dari parameter atau environment variables
            const loginEmail = email || import.meta.env.VITE_AUTO_LOGIN_EMAIL;
            const loginPassword = password || import.meta.env.VITE_AUTO_LOGIN_PASSWORD;

            // Validasi credentials
            if (!loginEmail || !loginPassword) {
                throw new Error('Auto-login credentials not provided');
            }

            console.log('🔐 Attempting auto-login with:', { email: loginEmail, password: '***' });
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: loginEmail, 
                    password: loginPassword 
                })
            });

            const data = await response.json();

            if (data.success) {
                // Simpan token dan expiry time
                this.saveTokenToStorage(data.data.token, data.data.expires_at);
                this.credentialsValidated = true;
                console.log('✅ Auto-login successful - CREDENTIALS VALIDATED');
                return data.data.user;
            } else {
                // CLEAR TOKEN JIKA LOGIN GAGAL
                this.clearToken();
                this.credentialsValidated = false;
                throw new Error(data.message || 'Auto-login failed - INVALID CREDENTIALS');
            }
        } catch (error) {
            console.error('❌ Auto-login failed:', error);
            
            // CLEAR TOKEN JIKA LOGIN GAGAL
            this.clearToken();
            this.credentialsValidated = false;
            
            // Retry dengan delay jika gagal
            const retryAttempts = parseInt(import.meta.env.VITE_AUTO_LOGIN_RETRY_ATTEMPTS) || 3;
            const retryDelay = parseInt(import.meta.env.VITE_AUTO_LOGIN_RETRY_DELAY) || 5000;
            
            if (retryAttempts > 0) {
                console.log(`🔄 Retrying auto-login in ${retryDelay}ms...`);
                setTimeout(() => {
                    this.attemptAutoLogin(email, password);
                }, retryDelay);
            }
            
            throw error;
        } finally {
            this.isLoggingIn = false;
        }
    }

    /**
     * Manual login function
     */
    async login(email, password) {
        try {
            console.log('🔐 Manual login attempt...');
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                // Simpan token dan expiry time
                this.saveTokenToStorage(data.data.token, data.data.expires_at);
                console.log('✅ Manual login successful');
                return data.data.user;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('❌ Manual login failed:', error);
            throw error;
        }
    }

    /**
     * Get token status info
     */
    getTokenStatus() {
        const email = import.meta.env.VITE_AUTO_LOGIN_EMAIL;
        const password = import.meta.env.VITE_AUTO_LOGIN_PASSWORD;
        const hasEnvCredentials = !!(email && password);
        
        return {
            hasToken: !!this.token,
            needsRefresh: this.needsRefresh(),
            isExpired: this.isTokenExpired(),
            token: this.token,
            expiresAt: this.tokenExpiresAt,
            timeUntilExpiry: this.tokenExpiresAt ? 
                new Date(this.tokenExpiresAt).getTime() - Date.now() : null,
            isLoggingIn: this.isLoggingIn,
            isRefreshing: this.isRefreshing,
            autoLoginEnabled: import.meta.env.VITE_AUTO_LOGIN_ENABLED === 'true',
            hasAutoLoginCredentials: hasEnvCredentials,
            hasEnvironmentVariables: hasEnvCredentials,
            credentialsValidated: this.credentialsValidated,
            autoLoginEmail: email,
            autoLoginPassword: password
        };
    }
}

// Create singleton instance
export const tokenManager = new TokenManager();
