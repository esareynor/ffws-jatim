<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|string|in:admin,user',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user',
            'status' => 'active',
        ]);

        // 🧹 Hapus semua token lama user ini (jika ada) sebelum buat token baru
        $this->cleanupAllTokensForUser($user->id);

        $tokenResult = $user->createToken('auth_token');
        $token = $tokenResult->plainTextToken;
        
        // Calculate expiration time
        $expiresIn = config('sanctum.expiration');
        $expiresAt = $expiresIn ? now()->addMinutes($expiresIn)->toIso8601String() : null;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => $expiresIn ? $expiresIn * 60 : null, // dalam detik
                'expires_at' => $expiresAt
            ]
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = User::where('email', $request->email)->first();
        
        // Check if user is active
        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Account is not active'
            ], 403);
        }

        // 🧹 Hapus semua token lama user ini sebelum buat token baru
        $this->cleanupAllTokensForUser($user->id);

        $tokenResult = $user->createToken('auth_token');
        $token = $tokenResult->plainTextToken;
        
        // Calculate expiration time
        $expiresIn = config('sanctum.expiration');
        $expiresAt = $expiresIn ? now()->addMinutes($expiresIn)->toIso8601String() : null;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => $expiresIn ? $expiresIn * 60 : null, // dalam detik
                'expires_at' => $expiresAt
            ]
        ]);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $request->user()
            ]
        ]);
    }

    /**
     * Refresh token
     * 
     * Endpoint ini digunakan untuk mendapatkan token baru tanpa perlu login ulang.
     * Token lama akan dihapus dan diganti dengan token baru.
     * Juga membersihkan token expired dari database untuk menjaga performa.
     */
    public function refresh(Request $request)
    {
        $user = $request->user();
        
        // Revoke current token
        $request->user()->currentAccessToken()->delete();
        
        // 🧹 Cleanup token expired untuk user ini (opsional - untuk performa)
        $this->cleanupExpiredTokensForUser($user->id);
        
        // Create new token
        $tokenResult = $user->createToken('auth_token');
        $token = $tokenResult->plainTextToken;
        
        // Calculate expiration time
        $expiresIn = config('sanctum.expiration');
        $expiresAt = $expiresIn ? now()->addMinutes($expiresIn)->toIso8601String() : null;

        return response()->json([
            'success' => true,
            'message' => 'Token refreshed successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => $expiresIn ? $expiresIn * 60 : null, // dalam detik
                'expires_at' => $expiresAt
            ]
        ]);
    }

    /**
     * Cleanup expired tokens for specific user
     * 
     * @param int $userId
     * @return int Number of deleted tokens
     */
    private function cleanupExpiredTokensForUser($userId)
    {
        $deletedCount = PersonalAccessToken::where('tokenable_id', $userId)
            ->where('tokenable_type', 'App\\Models\\User')
            ->where(function ($query) {
                $query->where('expires_at', '<', now())
                      ->orWhere(function ($subQuery) {
                          // Token yang dibuat lebih dari 24 jam yang lalu dan tidak ada expires_at
                          $subQuery->whereNull('expires_at')
                                   ->where('created_at', '<', now()->subDay());
                      });
            })
            ->delete();

        return $deletedCount;
    }

    /**
     * Cleanup ALL tokens for specific user (untuk login/register baru)
     * 
     * @param int $userId
     * @return int Number of deleted tokens
     */
    private function cleanupAllTokensForUser($userId)
    {
        $deletedCount = PersonalAccessToken::where('tokenable_id', $userId)
            ->where('tokenable_type', 'App\\Models\\User')
            ->delete();

        return $deletedCount;
    }
}
