# FFWS Jawa Timur - Backend API

Backend API untuk sistem Flood Early Warning System (FFWS) Jawa Timur menggunakan Laravel dan Laravel Sanctum untuk authentication.

## 🚀 Features

- ✅ RESTful API dengan Laravel
- ✅ Token-based Authentication dengan Laravel Sanctum
- ✅ **Token Expiration & Auto-Refresh** (NEW!)
- ✅ User Management
- ✅ Device Management
- ✅ Sensor Management
- ✅ River Basin Management
- ✅ Comprehensive API Documentation

## 📋 Requirements

- PHP 8.1 or higher
- Composer
- MySQL/PostgreSQL/SQLite
- Laravel 11.x

## 🛠️ Installation

1. Clone repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
composer install
```

3. Copy environment file
```bash
cp .env.example .env
```

4. Generate application key
```bash
php artisan key:generate
```

5. Configure database di `.env`
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database.sqlite
```

6. **Configure Token Expiration (NEW!)**
```env
# Token expired dalam 60 menit (1 jam) - Recommended
SANCTUM_EXPIRATION=60

# Untuk token unlimited (tidak expired), gunakan:
# SANCTUM_EXPIRATION=null
```

7. Run migrations dan seeders
```bash
php artisan migrate --seed
```

8. Start development server
```bash
php artisan serve
```

API akan berjalan di `http://localhost:8000`

## 🔐 Authentication & Token Management

### Token Expiration

Token API memiliki waktu expiration yang dapat dikonfigurasi:
- **Default**: 60 menit (1 jam)
- **Konfigurasi**: Set `SANCTUM_EXPIRATION` di file `.env`

### Auto Refresh Token

Sistem mendukung **auto-refresh token** untuk seamless user experience:
- Token dapat di-refresh tanpa perlu login ulang
- Token lama otomatis di-revoke saat refresh
- Response authentication mengembalikan `expires_in` dan `expires_at`

### Quick Start

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "1|abc123...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "expires_at": "2024-01-01T01:00:00+00:00"
  }
}
```

#### Refresh Token
```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Lihat dokumentasi lengkap di [PANDUAN_REFRESH_TOKEN.md](PANDUAN_REFRESH_TOKEN.md)

## 📚 Documentation

- **[API Documentation](API_DOCUMENTATION.md)** - Dokumentasi lengkap semua endpoints
- **[Panduan Refresh Token](PANDUAN_REFRESH_TOKEN.md)** - 🔄 **Panduan lengkap Auto-Refresh Token** (WAJIB BACA!)

### Key Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/register` | POST | Register user baru | ❌ |
| `/api/auth/login` | POST | Login user | ❌ |
| `/api/auth/me` | GET | Get user info | ✅ |
| `/api/auth/refresh` | POST | Refresh token | ✅ |
| `/api/auth/logout` | POST | Logout user | ✅ |
| `/api/users` | GET | Get all users | ✅ |
| `/api/devices` | GET | Get all devices | ✅ |
| `/api/sensors` | GET | Get all sensors | ✅ |

## 💻 Frontend Integration

### JavaScript (Fetch API)

```javascript
// Login
const login = async (email, password) => {
    const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('token_expires_at', data.data.expires_at);
        return data.data.user;
    }
    throw new Error(data.message);
};

// Auto Refresh Token
const setupAutoRefresh = () => {
    setInterval(async () => {
        const expiresAt = localStorage.getItem('token_expires_at');
        if (!expiresAt) return;
        
        const timeUntilExpiry = new Date(expiresAt).getTime() - Date.now();
        
        // Refresh 5 menit sebelum expired
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
            await refreshToken();
        }
    }, 60000); // Cek setiap 1 menit
};

setupAutoRefresh();
```

### Axios with Interceptor

```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json' }
});

// Auto attach token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto refresh on 401
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;
            const { data } = await api.post('/auth/refresh');
            localStorage.setItem('token', data.data.token);
            return api(error.config);
        }
        return Promise.reject(error);
    }
);
```

Lihat contoh lengkap di [PANDUAN_REFRESH_TOKEN.md](PANDUAN_REFRESH_TOKEN.md)

## 🧪 Testing

### Default Users (seeded)

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password | admin |
| user@example.com | password | user |

### Test Token Expiration

1. Set token expired cepat untuk testing:
```env
SANCTUM_EXPIRATION=1  # 1 menit
```

2. Clear config cache:
```bash
php artisan config:clear
```

3. Login dan tunggu token expired

4. Test refresh token

## 🔧 Useful Commands

```bash
# Clear all cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Run migrations fresh
php artisan migrate:fresh --seed

# Check current config
php artisan tinker
>>> config('sanctum.expiration')

# View routes
php artisan route:list
```

## 🐛 Troubleshooting

### Token Tidak Expired
```bash
php artisan config:clear
php artisan cache:clear
```

### 401 Unauthorized
- Cek apakah token valid
- Cek format header: `Authorization: Bearer {token}`
- Cek apakah token sudah expired

### Auto Refresh Tidak Bekerja
- Pastikan `expires_at` disimpan di localStorage
- Cek console log untuk error
- Verifikasi interval timer berjalan

Lihat troubleshooting lengkap di [PANDUAN_REFRESH_TOKEN.md](PANDUAN_REFRESH_TOKEN.md)

## 📁 Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php  ← ✅ Authentication logic + Token expiry
│   │   │       ├── UserController.php
│   │   │       └── Admin/
│   │   └── Middleware/
│   └── Models/
├── config/
│   └── sanctum.php  ← ✅ Token expiration configuration
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php  ← API routes
├── API_DOCUMENTATION.md  ← Full API reference
├── PANDUAN_REFRESH_TOKEN.md  ← 🔄 Panduan Auto-Refresh Token (WAJIB BACA!)
└── README.md  ← You are here
```

## 🔐 Security

- ✅ Token expiration: 60 menit (default)
- ✅ Auto token revocation saat refresh/logout
- ✅ Input validation pada semua endpoints
- ✅ Rate limiting untuk auth endpoints
- ✅ CORS configuration
- ⚠️ Gunakan HTTPS di production
- ⚠️ Set `SANCTUM_EXPIRATION` di production

## 📝 License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👥 Contributors

FFWS Jawa Timur Team

## 📞 Support

Untuk pertanyaan atau bantuan, silakan:
- 🔄 **WAJIB BACA**: [Panduan Refresh Token](PANDUAN_REFRESH_TOKEN.md)
- 📖 Baca [API Documentation](API_DOCUMENTATION.md)
- ❓ Check FAQ dan troubleshooting di panduan
- 📞 Contact development team

---

**Last Updated**: October 2025  
**Version**: 1.0.0 with Auto-Refresh Token Support
