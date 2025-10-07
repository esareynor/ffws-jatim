# API Documentation - FFWS Jawa Timur

## Authentication dengan Laravel Sanctum

Sistem authentication menggunakan Laravel Sanctum untuk API token-based authentication.

### Token Expiration

Token API memiliki waktu expiration yang dapat dikonfigurasi:
- **Default**: 60 menit (1 jam)
- **Konfigurasi**: Set `SANCTUM_EXPIRATION` di file `.env` (dalam menit)
- **Unlimited Token**: Set `SANCTUM_EXPIRATION=null` untuk token yang tidak expired

Setiap response authentication (login, register, refresh) akan mengembalikan:
- `expires_in`: Durasi token dalam detik
- `expires_at`: Timestamp ISO 8601 kapan token akan expired

### Auto Refresh Token

Gunakan endpoint `/api/auth/refresh` untuk mendapatkan token baru tanpa perlu login ulang. Token lama akan otomatis di-revoke.

## Base URL
```
http://localhost:8000/api
```

## Response Format

Semua response API mengikuti format standar:
```json
{
    "success": true|false,
    "message": "Pesan response",
    "data": {...},
    "errors": null|{...},
    "status_code": 200
}
```

## Endpoints

### 1. Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "user" // optional: "admin" or "user"
}
```

**Response:**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "user",
            "status": "active",
            "created_at": "2024-01-01T00:00:00.000000Z"
        },
        "token": "1|abc123...",
        "token_type": "Bearer",
        "expires_in": 3600,
        "expires_at": "2024-01-01T01:00:00+00:00"
    },
    "errors": null,
    "status_code": 201
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "user",
            "status": "active"
        },
        "token": "2|def456...",
        "token_type": "Bearer",
        "expires_in": 3600,
        "expires_at": "2024-01-01T01:00:00+00:00"
    },
    "errors": null,
    "status_code": 200
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "user",
            "status": "active"
        }
    },
    "errors": null,
    "status_code": 200
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer {token}
```

**Deskripsi:**
Endpoint ini digunakan untuk mendapatkan token baru tanpa perlu login ulang. Token lama akan otomatis di-revoke dan diganti dengan token baru.

**Use Case:**
- Token hampir expired
- Implementasi auto-refresh di frontend
- Perpanjang sesi user tanpa mengganggu aktivitas

**Response:**
```json
{
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "user",
            "status": "active"
        },
        "token": "3|ghi789...",
        "token_type": "Bearer",
        "expires_in": 3600,
        "expires_at": "2024-01-01T02:00:00+00:00"
    },
    "errors": null,
    "status_code": 200
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Logout successful",
    "data": null,
    "errors": null,
    "status_code": 200
}
```

### 2. User Management Endpoints

#### Get All Users
```http
GET /api/users?search=john&role=user&status=active&per_page=15
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "role": "user",
                "status": "active",
                "created_at": "2024-01-01T00:00:00.000000Z"
            }
        ],
        "first_page_url": "http://localhost:8000/api/users?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://localhost:8000/api/users?page=1",
        "links": [...],
        "next_page_url": null,
        "path": "http://localhost:8000/api/users",
        "per_page": 15,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    },
    "errors": null,
    "status_code": 200
}
```

#### Get User by ID
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "user",
            "status": "active",
            "bio": "User bio",
            "created_at": "2024-01-01T00:00:00.000000Z",
            "updated_at": "2024-01-01T00:00:00.000000Z"
        }
    },
    "errors": null,
    "status_code": 200
}
```

#### Update User
```http
PUT /api/users/{id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
    "name": "John Updated",
    "email": "john.updated@example.com",
    "role": "admin",
    "status": "active",
    "bio": "Updated bio"
}
```

**Response:**
```json
{
    "success": true,
    "message": "User updated successfully",
    "data": {
        "user": {
            "id": 1,
            "name": "John Updated",
            "email": "john.updated@example.com",
            "role": "admin",
            "status": "active",
            "bio": "Updated bio",
            "updated_at": "2024-01-01T12:00:00.000000Z"
        }
    },
    "errors": null,
    "status_code": 200
}
```

#### Delete User
```http
DELETE /api/users/{id}
Authorization: Bearer {token}
```

<<<<<<< HEAD
=======
### 3. Device Management Endpoints

#### Get Devices for Map Display
```http
GET /api/devices/map
Authorization: Bearer {token}
```

>>>>>>> 7b2333888e9762563c50562f89445a296288e501
**Response:**
```json
{
    "success": true,
<<<<<<< HEAD
    "message": "User deleted successfully",
    "data": null,
    "errors": null,
    "status_code": 200
}
```

### 3. Device Management Endpoints

#### Get Device by ID
=======
    "message": "Devices data retrieved successfully",
    "data": [
        {
            "id": 1,
            "name": "Stasiun Monitoring Dhompo",
            "code": "DHM001",
            "latitude": -7.1234,
            "longitude": 112.5678,
            "elevation_m": 150.5,
            "status": "warning",
            "river_basin": {
                "id": 1,
                "name": "DAS Brantas",
                "code": "BRT001"
            },
            "sensors": [
                {
                    "sensor_id": 1,
                    "sensor_code": "DHM001_WL",
                    "parameter": "water_level",
                    "unit": "meter",
                    "value": 2.5,
                    "received_at": "2024-01-01T12:00:00.000000Z",
                    "status": "warning",
                    "thresholds": {
                        "safe": 2.0,
                        "warning": 2.5,
                        "danger": 3.0
                    }
                }
            ],
            "sensor_count": 2
        }
    ]
}
```

#### Get Device Detail by ID
>>>>>>> 7b2333888e9762563c50562f89445a296288e501
```http
GET /api/devices/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Device retrieved successfully",
    "data": {
<<<<<<< HEAD
        "name": "Device Sungai Brantas 1",
        "code": "BRT001",
        "latitude": "-7.250000",
        "longitude": "112.750000",
        "elevation_m": "100.50",
        "status": "active",
        "mas_river_basin_id": 1,
        "river_basin_name": "Sungai Brantas"
    },
    "errors": null,
    "status_code": 200
}
```

### 4. Sensor Management Endpoints

#### Get All Sensors
```http
GET /api/sensors
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Data sensor berhasil diambil",
    "data": [
        {
            "device_id": 1,
            "sensor_code": "SEN001",
            "parameter": "water_level",
            "unit": "cm",
            "description": "Water Level Sensor",
            "mas_model_id": 1,
            "threshold_safe": 50.0,
            "threshold_warning": 100.0,
            "threshold_danger": 150.0,
            "status": "active",
            "last_seen": "2024-01-01T12:00:00.000000Z",
            "device": {
                "id": 1,
                "name": "Device Sungai Brantas 1",
                "code": "BRT001"
            },
            "mas_model": {
                "id": 1,
                "name": "Model LSTM v1.0"
            }
        }
    ],
    "errors": null,
    "status_code": 200
}
```

#### Get Sensor by ID
```http
GET /api/sensors/{id}
Authorization: Bearer {token}
```

#### Get Sensors by Device ID
```http
GET /api/sensors/device/{deviceId}
Authorization: Bearer {token}
```

#### Get Sensors by Parameter
```http
GET /api/sensors/parameter/{parameter}
Authorization: Bearer {token}
```

**Parameters yang tersedia:**
- `water_level` - Sensor level air
- `rainfall` - Sensor curah hujan

#### Get Sensors by Status
```http
GET /api/sensors/status/{status}
Authorization: Bearer {token}
```

**Status yang tersedia:**
- `active` - Sensor aktif
- `inactive` - Sensor tidak aktif

### 5. River Basin Endpoints

#### Get River Basin by ID
```http
GET /api/river-basins/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "River Basin retrieved successfully",
    "data": {
        "id": 1,
        "name": "Sungai Brantas",
        "code": "BRT",
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    "errors": null,
    "status_code": 200
}
```

### 6. Data Endpoints

#### Get Data Actuals (Placeholder)
```http
GET /api/data/actuals
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Data actuals endpoint - implementasi selanjutnya",
    "data": null,
    "errors": null,
    "status_code": 200
}
```

### 7. Test Endpoint
=======
        "id": 1,
        "name": "Stasiun Monitoring Dhompo",
        "code": "DHM001",
        "latitude": -7.1234,
        "longitude": 112.5678,
        "elevation_m": 150.5,
        "status": "active",
        "river_basin": {
            "id": 1,
            "name": "DAS Brantas",
            "code": "BRT001"
        },
        "sensors": [...]
    }
}
```

### 4. Test Endpoint
>>>>>>> 7b2333888e9762563c50562f89445a296288e501

#### API Health Check
```http
GET /api/test
```

**Response:**
```json
{
    "success": true,
    "message": "API berjalan dengan baik",
    "data": null,
    "errors": null,
    "status_code": 200
}
```

## Error Responses

### Validation Error (422)
```json
{
    "success": false,
    "message": "Validation error",
    "data": null,
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
    },
    "status_code": 422
}
```

### Unauthorized (401)
```json
{
    "success": false,
    "message": "Invalid credentials",
    "data": null,
    "errors": null,
    "status_code": 401
}
```

### Forbidden (403)
```json
{
    "success": false,
    "message": "Account is not active",
    "data": null,
    "errors": null,
    "status_code": 403
}
```

### Not Found (404)
```json
{
    "success": false,
    "message": "User not found",
    "data": null,
    "errors": null,
    "status_code": 404
}
```

### Server Error (500)
```json
{
    "success": false,
    "message": "Terjadi kesalahan saat mengambil data device",
    "data": null,
    "errors": null,
    "status_code": 500
}
```

## Frontend Integration

### JavaScript Example (Fetch API)

```javascript
// Login
const login = async (email, password) => {
    const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        localStorage.setItem('token', data.data.token);
        return data.data.user;
    }
    
    throw new Error(data.message);
};

// Get authenticated user
const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:8000/api/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    
    const data = await response.json();
    
    if (data.success) {
        return data.data.user;
    }
    
    throw new Error(data.message);
};

// Get all sensors
const getSensors = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:8000/api/sensors', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    
    const data = await response.json();
    
    if (data.success) {
        return data.data;
    }
    
    throw new Error(data.message);
};

// Get device by ID
const getDevice = async (deviceId) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:8000/api/devices/${deviceId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    
    const data = await response.json();
    
    if (data.success) {
        return data.data;
    }
    
    throw new Error(data.message);
};

// Refresh Token
const refreshToken = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:8000/api/auth/refresh', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    
    const data = await response.json();
    
    if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('token_expires_at', data.data.expires_at);
        return data.data;
    }
    
    throw new Error(data.message);
};

// Auto Refresh Token (sebelum expired)
const setupAutoRefresh = () => {
    // Refresh token 5 menit sebelum expired
    const checkInterval = 60000; // Cek setiap 1 menit
    
    setInterval(async () => {
        const expiresAt = localStorage.getItem('token_expires_at');
        
        if (!expiresAt) return;
        
        const expiryTime = new Date(expiresAt).getTime();
        const currentTime = new Date().getTime();
        const timeUntilExpiry = expiryTime - currentTime;
        
        // Refresh jika kurang dari 5 menit sebelum expired
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
            try {
                await refreshToken();
                console.log('Token refreshed successfully');
            } catch (error) {
                console.error('Failed to refresh token:', error);
                // Redirect to login jika gagal
                window.location.href = '/login';
            }
        }
    }, checkInterval);
};

// Call saat aplikasi dimulai
setupAutoRefresh();

// Logout
const logout = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    
    const data = await response.json();
    
    if (data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('token_expires_at');
    } else {
        throw new Error(data.message);
    }
};
```

### Axios Example

```javascript
import axios from 'axios';

// Setup axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Jika 401 dan belum pernah retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Coba refresh token
                const refreshResponse = await api.post('/auth/refresh');
                const newToken = refreshResponse.data.data.token;
                
                localStorage.setItem('token', newToken);
                localStorage.setItem('token_expires_at', refreshResponse.data.data.expires_at);
                
                // Retry request dengan token baru
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Jika refresh gagal, redirect ke login
                localStorage.removeItem('token');
                localStorage.removeItem('token_expires_at');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// Login
const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('token_expires_at', response.data.data.expires_at);
        return response.data.data.user;
    }
    throw new Error(response.data.message);
};

// Get current user
const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    if (response.data.success) {
        return response.data.data.user;
    }
    throw new Error(response.data.message);
};

// Get all sensors
const getSensors = async () => {
    const response = await api.get('/sensors');
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.message);
};

// Get sensors by device
const getSensorsByDevice = async (deviceId) => {
    const response = await api.get(`/sensors/device/${deviceId}`);
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.message);
};

// Get device details
const getDevice = async (deviceId) => {
    const response = await api.get(`/devices/${deviceId}`);
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.message);
};

// Refresh Token
const refreshToken = async () => {
    const response = await api.post('/auth/refresh');
    if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('token_expires_at', response.data.data.expires_at);
        return response.data.data;
    }
    throw new Error(response.data.message);
};

// Auto Refresh Token (sebelum expired)
const setupAutoRefresh = () => {
    // Refresh token 5 menit sebelum expired
    const checkInterval = 60000; // Cek setiap 1 menit
    
    setInterval(async () => {
        const expiresAt = localStorage.getItem('token_expires_at');
        
        if (!expiresAt) return;
        
        const expiryTime = new Date(expiresAt).getTime();
        const currentTime = new Date().getTime();
        const timeUntilExpiry = expiryTime - currentTime;
        
        // Refresh jika kurang dari 5 menit sebelum expired
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
            try {
                await refreshToken();
                console.log('Token auto-refreshed successfully');
            } catch (error) {
                console.error('Failed to auto-refresh token:', error);
            }
        }
    }, checkInterval);
};

// Call saat aplikasi dimulai
setupAutoRefresh();

// Logout
const logout = async () => {
    const response = await api.post('/auth/logout');
    if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('token_expires_at');
    } else {
        throw new Error(response.data.message);
    }
};

export { api, login, getCurrentUser, getSensors, getSensorsByDevice, getDevice, refreshToken, setupAutoRefresh, logout };
```

## Data Models

### User Model
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user|admin",
    "status": "active|inactive",
    "bio": "User biography",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

### Device Model
```json
{
    "id": 1,
    "name": "Device Sungai Brantas 1",
    "code": "BRT001",
    "mas_river_basin_id": 1,
    "latitude": "-7.250000",
    "longitude": "112.750000",
    "elevation_m": 100.50,
    "status": "active|inactive"
}
```

### Sensor Model
```json
{
    "id": 1,
    "device_id": 1,
    "sensor_code": "SEN001",
    "parameter": "water_level|rainfall",
    "unit": "cm|mm",
    "description": "Sensor description",
    "mas_model_id": 1,
    "threshold_safe": 50.0,
    "threshold_warning": 100.0,
    "threshold_danger": 150.0,
    "status": "active|inactive",
    "last_seen": "2024-01-01T12:00:00.000000Z"
}
```

### River Basin Model
```json
{
    "id": 1,
    "name": "Sungai Brantas",
    "code": "BRT",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

## Query Parameters

### Pagination
- `per_page`: Jumlah item per halaman (default: 15)
- `page`: Nomor halaman (default: 1)

### Filtering
- `search`: Pencarian berdasarkan nama atau email (untuk users)
- `role`: Filter berdasarkan role (admin, user)
- `status`: Filter berdasarkan status (active, inactive)
- `parameter`: Filter sensor berdasarkan parameter (water_level, rainfall)
- `device_id`: Filter sensor berdasarkan device ID

## Security Notes

1. **Token Storage**: Simpan token di localStorage atau sessionStorage dengan aman
2. **HTTPS**: Gunakan HTTPS di production
3. **Token Expiration**: Token memiliki expiration 60 menit (default), gunakan auto-refresh untuk perpanjang sesi
4. **Auto Refresh**: Implementasikan auto-refresh token untuk mencegah session timeout saat user aktif
5. **CORS**: Konfigurasi CORS sudah diset untuk development, sesuaikan untuk production
6. **Rate Limiting**: Implementasi rate limiting untuk mencegah abuse
7. **Input Validation**: Semua input sudah divalidasi di backend
8. **Token Revocation**: Token lama otomatis di-revoke saat refresh atau logout

### Best Practices untuk Token Management

1. **Simpan expires_at**: Simpan `expires_at` di localStorage bersama token untuk tracking
2. **Auto Refresh**: Refresh token 5 menit sebelum expired
3. **Interceptor**: Gunakan axios interceptor untuk auto-retry saat 401
4. **Clear on Logout**: Hapus semua token data saat logout
5. **Secure Storage**: Pertimbangkan httpOnly cookies untuk production

## Rate Limiting

API menggunakan Laravel rate limiting:
- Authentication endpoints: 60 requests per minute per IP
- Other endpoints: 1000 requests per minute per authenticated user

## Next Steps

1. ✅ **Completed**: Authentication system dengan Laravel Sanctum
2. ✅ **Completed**: User management endpoints
3. ✅ **Completed**: Device management endpoints
4. ✅ **Completed**: Sensor management endpoints
5. ✅ **Completed**: River basin endpoints
6. 🔄 **In Progress**: Implementasi endpoint untuk data actuals dan predictions
7. ⏳ **Planned**: Tambahkan role-based authorization middleware
8. ⏳ **Planned**: Implementasi rate limiting
9. ⏳ **Planned**: Tambahkan logging untuk audit trail
10. ⏳ **Planned**: Setup environment variables untuk production
11. ⏳ **Planned**: Implementasi real-time notifications dengan WebSocket
12. ⏳ **Planned**: Tambahkan API versioning
