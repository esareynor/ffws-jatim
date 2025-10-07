# 🔄 Panduan Lengkap Auto-Refresh Token

Dokumentasi lengkap tentang sistem Refresh Token untuk API FFWS Jawa Timur.

---

## 📖 Daftar Isi

1. [Apa itu Refresh Token?](#apa-itu-refresh-token)
2. [Mengapa Perlu Refresh Token?](#mengapa-perlu-refresh-token)
3. [Cara Kerja Sistem](#cara-kerja-sistem)
4. [Konfigurasi Backend](#konfigurasi-backend)
5. [Implementasi Frontend](#implementasi-frontend)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## Apa itu Refresh Token?

**Refresh Token** adalah mekanisme untuk mendapatkan **token baru** tanpa perlu login ulang. 

### Konsep Dasar

```
🔐 Login → 🎫 Dapat Token (expired 1 jam)
⏰ 55 menit kemudian → Token hampir expired
🔄 Auto-Refresh → 🎫 Dapat Token Baru (expired 1 jam lagi)
```

Dengan sistem ini:
- User **TIDAK perlu login ulang** setiap 1 jam
- Token tetap aman karena ada expiration
- User experience lebih baik (seamless)

---

## Mengapa Perlu Refresh Token?

### ❌ Masalah Tanpa Refresh Token

**Skenario 1: Token Unlimited (tidak expired)**
```
Login 1x → Token berlaku selamanya
❌ BAHAYA! Jika token dicuri, bisa dipakai selamanya
```

**Skenario 2: Token Expired tapi tidak ada Refresh**
```
Login → Token expired 1 jam → User logout otomatis
❌ User kesal harus login ulang terus
❌ Bad user experience
```

### ✅ Solusi Dengan Refresh Token

```
Login → Token expired 1 jam → Auto-refresh sebelum expired
✅ Token tetap aman (ada expiration)
✅ User tidak perlu login ulang
✅ Seamless experience!
```

---

## Cara Kerja Sistem

### 🔄 Flow Lengkap

#### 1. **Login Pertama Kali**

```
Frontend                        Backend
   |                               |
   |  POST /api/auth/login         |
   |------------------------------>|
   |  { email, password }          |
   |                               |
   |  Response:                    |
   |<------------------------------|
   |  {                            |
   |    token: "1|abc123...",      |
   |    expires_in: 3600,          |  ← Durasi token (1 jam = 3600 detik)
   |    expires_at: "2024-01-01    |  ← Timestamp kapan expired
   |                T01:00:00Z"    |
   |  }                            |
   |                               |
```

**Yang dilakukan Frontend:**
```javascript
// Simpan token dan expiry time
localStorage.setItem('token', response.data.token);
localStorage.setItem('token_expires_at', response.data.expires_at);
```

#### 2. **Auto-Refresh (Sebelum Token Expired)**

```
Timeline:
00:00 - Login, dapat token (expired jam 01:00)
00:55 - Frontend deteksi: "Token akan expired dalam 5 menit!"
00:55 - Auto-refresh dipanggil

Frontend                        Backend
   |                               |
   |  POST /api/auth/refresh       |
   |------------------------------>|
   |  Authorization: Bearer {old}  |
   |                               |
   |  Backend:                     |
   |  1. Validasi token lama       |
   |  2. Hapus token lama          |
   |  3. Generate token baru       |
   |                               |
   |  Response:                    |
   |<------------------------------|
   |  {                            |
   |    token: "2|xyz789...",      |  ← Token baru
   |    expires_in: 3600,          |  ← Expired 1 jam lagi
   |    expires_at: "2024-01-01    |
   |                T02:00:00Z"    |
   |  }                            |
   |                               |
```

**Yang dilakukan Frontend:**
```javascript
// Update token dan expiry time
localStorage.setItem('token', response.data.token);
localStorage.setItem('token_expires_at', response.data.expires_at);
```

#### 3. **Request API Biasa**

```
Frontend                        Backend
   |                               |
   |  GET /api/sensors             |
   |------------------------------>|
   |  Authorization: Bearer {new}  |
   |                               |
   |  Response: ✅ 200 OK          |
   |<------------------------------|
   |  { data: [...] }              |
   |                               |
```

#### 4. **Jika Token Sudah Expired (401)**

```
Frontend                        Backend
   |                               |
   |  GET /api/sensors             |
   |------------------------------>|
   |  Authorization: Bearer {old}  |
   |                               |
   |  Response: ❌ 401 Unauthorized|
   |<------------------------------|
   |                               |
   |  Auto-Retry:                  |
   |  1. Panggil refresh token     |
   |  2. Dapat token baru          |
   |  3. Retry request dengan      |
   |     token baru                |
   |                               |
   |  GET /api/sensors (retry)     |
   |------------------------------>|
   |  Authorization: Bearer {new}  |
   |                               |
   |  Response: ✅ 200 OK          |
   |<------------------------------|
   |                               |
```

---

## Konfigurasi Backend

### 1. Set Token Expiration

Edit file `.env` di root project backend:

```env
# Token expired dalam 60 menit (1 jam)
SANCTUM_EXPIRATION=60
```

**Opsi Durasi:**

| Nilai | Durasi | Kapan Digunakan |
|-------|--------|-----------------|
| `1` | 1 menit | Testing token expiration |
| `60` | 1 jam | **Production** (recommended) |
| `120` | 2 jam | Development |
| `1440` | 24 jam | Testing/Staging |
| `null` | Unlimited | **TIDAK disarankan** |

### 2. Clear Cache

Setelah edit `.env`, wajib clear cache:

```bash
php artisan config:clear
php artisan cache:clear
```

### 3. Test Token Expiration

```bash
# Set token expired 1 menit untuk testing
SANCTUM_EXPIRATION=1

# Clear cache
php artisan config:clear

# Login dan tunggu 1 menit, token akan expired
```

---

## Implementasi Frontend

Berikut implementasi lengkap untuk berbagai framework/library.

### 🟢 Vanilla JavaScript (Fetch API)

#### Setup File `auth.js`

```javascript
// auth.js
const API_URL = 'http://localhost:8000/api';

// ========== LOGIN ==========
export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Simpan token dan expiry time
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('token_expires_at', data.data.expires_at);
        return data.data.user;
    }
    
    throw new Error(data.message);
}

// ========== REFRESH TOKEN ==========
export async function refreshToken() {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Update token dan expiry time
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('token_expires_at', data.data.expires_at);
        console.log('✅ Token refreshed successfully');
        return data.data;
    }
    
    throw new Error(data.message);
}

// ========== AUTO-REFRESH SETUP ==========
export function setupAutoRefresh() {
    console.log('🔄 Auto-refresh token dimulai');
    
    // Cek setiap 1 menit
    setInterval(async () => {
        const expiresAt = localStorage.getItem('token_expires_at');
        
        if (!expiresAt) return; // Skip jika tidak ada token
        
        const expiryTime = new Date(expiresAt).getTime();
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        
        // Refresh jika kurang dari 5 menit sebelum expired
        const fiveMinutes = 5 * 60 * 1000;
        
        if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
            const minutesLeft = Math.floor(timeUntilExpiry / 60000);
            console.log(`⏰ Token akan expired dalam ${minutesLeft} menit, refreshing...`);
            
            try {
                await refreshToken();
            } catch (error) {
                console.error('❌ Refresh token gagal:', error);
                // Redirect ke login jika gagal
                window.location.href = '/login';
            }
        }
    }, 60000); // 60000ms = 1 menit
}

// ========== LOGOUT ==========
export async function logout() {
    const token = localStorage.getItem('token');
    
    if (token) {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires_at');
}

// ========== FETCH DENGAN AUTO-AUTH ==========
export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    
    // Jika 401, coba refresh dan retry
    if (response.status === 401) {
        console.log('🔄 Dapat 401, mencoba refresh token...');
        
        try {
            await refreshToken();
            
            // Retry dengan token baru
            const newToken = localStorage.getItem('token');
            return fetch(url, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${newToken}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
        } catch (error) {
            console.error('❌ Refresh gagal, redirect ke login');
            window.location.href = '/login';
            throw error;
        }
    }
    
    return response;
}
```

#### Cara Pakai

```javascript
// Di main.js atau app.js (saat aplikasi dimulai)
import { setupAutoRefresh } from './auth.js';

// Start auto-refresh
setupAutoRefresh();
```

```javascript
// Di halaman login
import { login } from './auth.js';

async function handleLogin() {
    try {
        const user = await login(email, password);
        console.log('Login berhasil:', user.name);
        window.location.href = '/dashboard';
    } catch (error) {
        alert('Login gagal: ' + error.message);
    }
}
```

```javascript
// Request API
import { fetchWithAuth } from './auth.js';

async function getSensors() {
    const response = await fetchWithAuth('http://localhost:8000/api/sensors');
    const data = await response.json();
    return data.data;
}
```

---

### 🔵 Axios (Recommended)

#### Setup File `api.js`

```javascript
// api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// ========== CREATE AXIOS INSTANCE ==========
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ========== REQUEST INTERCEPTOR ==========
// Auto-attach token ke setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ========== RESPONSE INTERCEPTOR ==========
// Auto-refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Jika 401 dan belum pernah retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            console.log('🔄 Dapat 401, mencoba refresh token...');
            
            try {
                // Refresh token
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (response.data.success) {
                    // Simpan token baru
                    localStorage.setItem('token', response.data.data.token);
                    localStorage.setItem('token_expires_at', response.data.data.expires_at);
                    
                    console.log('✅ Token refreshed, retry request...');
                    
                    // Retry request dengan token baru
                    originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('❌ Refresh gagal, redirect ke login');
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// ========== AUTH FUNCTIONS ==========

export async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('token_expires_at', response.data.data.expires_at);
        return response.data.data.user;
    }
    
    throw new Error(response.data.message);
}

export async function logout() {
    try {
        await api.post('/auth/logout');
    } finally {
        localStorage.clear();
    }
}

export function setupAutoRefresh() {
    console.log('🔄 Auto-refresh token dimulai');
    
    setInterval(async () => {
        const expiresAt = localStorage.getItem('token_expires_at');
        if (!expiresAt) return;
        
        const timeUntilExpiry = new Date(expiresAt).getTime() - Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
            try {
                const response = await api.post('/auth/refresh');
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('token_expires_at', response.data.data.expires_at);
                console.log('✅ Auto-refresh berhasil');
            } catch (error) {
                console.error('❌ Auto-refresh gagal');
            }
        }
    }, 60000);
}
```

#### Cara Pakai

```javascript
// Di main.js
import { setupAutoRefresh } from './api.js';
setupAutoRefresh();
```

```javascript
// Request API sangat simple!
import { api } from './api.js';

// Get sensors
const response = await api.get('/sensors');
console.log(response.data);

// Get sensor by ID
const sensor = await api.get('/sensors/1');

// Auto-retry on 401 sudah built-in!
```

---

### ⚛️ React Implementation

```jsx
// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, login as apiLogin, logout as apiLogout, setupAutoRefresh } from './api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Setup auto-refresh saat app dimulai
    useEffect(() => {
        setupAutoRefresh();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const user = await apiLogin(email, password);
            setUser(user);
            return user;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
```

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
```

```jsx
// LoginPage.jsx
import { useAuth } from './AuthContext';

function LoginPage() {
    const { login, loading } = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            alert('Login gagal');
        }
    };
    
    return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### 🟢 Vue.js Implementation

```javascript
// composables/useAuth.js
import { ref, onMounted } from 'vue';
import { api, login as apiLogin, logout as apiLogout, setupAutoRefresh } from '../api.js';

export function useAuth() {
    const user = ref(null);
    const loading = ref(false);

    onMounted(() => {
        setupAutoRefresh();
    });

    const login = async (email, password) => {
        loading.value = true;
        try {
            user.value = await apiLogin(email, password);
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        await apiLogout();
        user.value = null;
    };

    return { user, loading, login, logout };
}
```

```vue
<!-- LoginPage.vue -->
<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const { login, loading } = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
    try {
        await login(email.value, password.value);
        router.push('/dashboard');
    } catch (error) {
        alert('Login gagal');
    }
};
</script>

<template>
    <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" required />
        <input v-model="password" type="password" required />
        <button :disabled="loading">Login</button>
    </form>
</template>
```

---

## Troubleshooting

### 1. Token Tidak Expired

**Problem**: Token masih valid meski sudah set `SANCTUM_EXPIRATION`

**Solusi**:
```bash
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

Restart Laravel server:
```bash
# Stop server (Ctrl+C)
php artisan serve
```

**Verifikasi**:
```bash
php artisan tinker
>>> config('sanctum.expiration')
# Harus return: 60
```

---

### 2. Auto-Refresh Tidak Bekerja

**Problem**: Token tetap expired meski sudah setup auto-refresh

**Cek 1**: Apakah `setupAutoRefresh()` dipanggil?
```javascript
// Di main.js / app.js
import { setupAutoRefresh } from './auth.js';
setupAutoRefresh(); // ← WAJIB dipanggil saat app start!
```

**Cek 2**: Apakah `expires_at` tersimpan?
```javascript
// Cek di browser console
console.log(localStorage.getItem('token_expires_at'));
// Harus ada value: "2024-01-01T01:00:00+00:00"
```

**Cek 3**: Apakah interval berjalan?
```javascript
// Tambahkan log untuk debugging
setInterval(async () => {
    console.log('🔍 Checking token status...');
    // ... rest of code
}, 60000);
```

**Cek 4**: Apakah ada error di console?
- Buka Developer Tools → Console
- Cari error message

---

### 3. Error 401 Terus Menerus

**Problem**: Dapat 401 Unauthorized terus menerus

**Penyebab & Solusi**:

**A. Token Tidak Valid**
```javascript
// Cek format token
const token = localStorage.getItem('token');
console.log('Token:', token);
// Harus format: "1|abc123xyz..."
```

**B. Header Authorization Salah**
```javascript
// Format yang BENAR:
Authorization: Bearer 1|abc123xyz...

// Format yang SALAH:
Authorization: 1|abc123xyz...  // ❌ Missing "Bearer"
Authorization: Bearer: 1|abc123xyz...  // ❌ Extra colon
```

**C. Token Sudah Expired**
```javascript
// Cek expiry time
const expiresAt = localStorage.getItem('token_expires_at');
console.log('Expires at:', expiresAt);
console.log('Is expired?', new Date(expiresAt) < new Date());
```

---

### 4. Infinite Loop Refresh

**Problem**: Refresh token terus menerus, tidak berhenti

**Penyebab**: Request refresh token juga kena interceptor

**Solusi**: Tambahkan flag `_retry`
```javascript
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // PENTING: Cek flag _retry untuk prevent infinite loop
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // ← Set flag
            // ... refresh logic
        }
        
        return Promise.reject(error);
    }
);
```

---

### 5. Token Refresh Tapi Masih 401

**Problem**: Setelah refresh token, request masih 401

**Solusi**: Pastikan token baru digunakan untuk retry
```javascript
// SALAH ❌
await refreshToken();
return api(originalRequest); // ← Masih pakai token lama!

// BENAR ✅
await refreshToken();
const newToken = localStorage.getItem('token');
originalRequest.headers.Authorization = `Bearer ${newToken}`; // ← Update header
return api(originalRequest);
```

---

## FAQ

### Q: Berapa lama token sebaiknya?
**A**: Untuk production, **60 menit (1 jam)** adalah durasi yang baik. Balance antara keamanan dan user experience. Gunakan auto-refresh untuk seamless experience.

---

### Q: Apakah harus refresh token manual?
**A**: Tidak perlu! Implementasikan `setupAutoRefresh()` di frontend, token akan otomatis di-refresh 5 menit sebelum expired.

---

### Q: Bagaimana jika user idle/tidak aktif?
**A**: Token tetap akan di-refresh otomatis selama halaman terbuka. Jika ingin auto-logout saat idle, Anda bisa tambahkan activity tracking:

```javascript
let lastActivity = Date.now();

// Track user activity
['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, () => {
        lastActivity = Date.now();
    });
});

// Cek idle di auto-refresh
setInterval(async () => {
    const idleTime = Date.now() - lastActivity;
    const fifteenMinutes = 15 * 60 * 1000;
    
    if (idleTime > fifteenMinutes) {
        console.log('User idle, tidak refresh token');
        return; // Skip refresh
    }
    
    // ... auto-refresh logic
}, 60000);
```

---

### Q: Apakah token lama masih bisa dipakai setelah refresh?
**A**: TIDAK. Token lama otomatis di-revoke (dihapus) saat refresh. Hanya token baru yang valid.

---

### Q: Berapa kali bisa refresh token?
**A**: Unlimited, selama:
- User masih authenticated
- Token yang dipakai untuk refresh masih valid
- User account masih active

---

### Q: Apakah bisa multiple device login?
**A**: Ya! Setiap device memiliki token terpisah:
- Login di HP → Token A
- Login di Laptop → Token B
- Keduanya valid secara bersamaan
- Logout di HP tidak logout di Laptop

---

### Q: Bagaimana cara logout semua device?
**A**: Saat ini belum ada endpoint untuk itu. Solusi:
1. **Logout manual** di setiap device
2. **Change password** → semua token otomatis invalid (optional, perlu implementasi)

---

### Q: Apakah aman simpan token di localStorage?
**A**: Untuk API token, localStorage sudah cukup aman untuk:
- Web application
- Development & Production

Untuk keamanan maksimal:
- Gunakan HTTPS di production
- Set token expiration (jangan unlimited)
- Implement auto-refresh

---

### Q: Error "SANCTUM_EXPIRATION not found"?
**A**: 
1. Pastikan ada di file `.env`:
   ```env
   SANCTUM_EXPIRATION=60
   ```
2. Clear cache:
   ```bash
   php artisan config:clear
   ```
3. Restart server

---

### Q: Bisa pakai Refresh Token tanpa Auto-Refresh?
**A**: Bisa! User bisa manual klik tombol "Refresh" atau call endpoint refresh saat perlu. Tapi auto-refresh lebih baik untuk UX.

---

## 🎯 Checklist Implementasi

### Backend ✅

- [x] Set `SANCTUM_EXPIRATION=60` di `.env`
- [x] Clear config cache
- [x] Test login dan cek response ada `expires_in` & `expires_at`
- [x] Test endpoint `/api/auth/refresh`

### Frontend ✅

- [ ] Install axios (jika pakai axios)
- [ ] Buat file `auth.js` atau `api.js`
- [ ] Implementasi fungsi `login()`
- [ ] Implementasi fungsi `refreshToken()`
- [ ] Implementasi fungsi `setupAutoRefresh()`
- [ ] Setup interceptor untuk auto-retry 401 (jika pakai axios)
- [ ] Call `setupAutoRefresh()` saat app start
- [ ] Simpan `token` dan `token_expires_at` di localStorage
- [ ] Test auto-refresh dengan token expired cepat

### Testing ✅

- [ ] Set `SANCTUM_EXPIRATION=1` untuk test
- [ ] Login dan tunggu 1 menit
- [ ] Cek token expired (401)
- [ ] Cek auto-refresh bekerja (cek console log)
- [ ] Cek token baru tersimpan
- [ ] Set `SANCTUM_EXPIRATION=60` untuk production

---

## 📞 Support

Jika ada kendala:
1. ✅ Baca troubleshooting section
2. ✅ Cek FAQ
3. ✅ Cek console log untuk error
4. ✅ Verify config dengan `php artisan tinker`

---

**Last Updated**: October 7, 2025  
**Version**: 1.1.0  
**Status**: ✅ Production Ready

