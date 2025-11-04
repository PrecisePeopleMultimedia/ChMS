<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:12',
                'confirmed',
                'regex:/[A-Z]/',      // At least one uppercase letter
                'regex:/[a-z]/',      // At least one lowercase letter
                'regex:/[0-9]/',      // At least one number
                'regex:/[!@#$%^&*(),.?":{}|<>]/', // At least one special character
            ],
            'phone' => 'nullable|string|max:20',
            'organization_name' => 'nullable|string|max:255',
            'role' => 'nullable|in:admin,staff,member'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => $request->role ?? 'member',
            'email_verified_at' => null, // User must verify email
            // TODO: Handle organization creation/assignment
        ]);

        // Generate verification token
        $token = Str::random(64);

        // Store verification token in database
        DB::table('email_verifications')->insert([
            'email' => $user->email,
            'token' => Hash::make($token),
            'created_at' => now(),
            'expires_at' => now()->addHours(24)
        ]);

        // Send verification email
        try {
            $verificationUrl = config('app.frontend_url') . '/verify-email?token=' . $token . '&email=' . urlencode($user->email);

            Mail::send('emails.verify-email', [
                'user' => $user,
                'verificationUrl' => $verificationUrl
            ], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                        ->subject('Verify Your Email - ChurchAfrica');
            });
        } catch (\Exception $e) {
            // Log error but don't fail registration
            \Log::error('Failed to send verification email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Registration successful! Please check your email to verify your account.',
            'user' => $user,
            'email_verification_required' => true
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'remember' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();

        // Check if email is verified
        if (!$user->email_verified_at) {
            return response()->json([
                'message' => 'Please verify your email address before logging in. Check your inbox for the verification link.',
                'email_verification_required' => true,
                'email' => $user->email
            ], 403);
        }

        $tokenName = $request->remember ? 'remember_token' : 'auth_token';
        $expiresAt = $request->remember ? now()->addDays(30) : now()->addDay();

        $token = $user->createToken($tokenName, ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'expires_at' => $expiresAt->toISOString()
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get user profile
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    /**
     * Refresh token (create new token and revoke old one)
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        $currentToken = $request->user()->currentAccessToken();

        // Create new token
        $newToken = $user->createToken('auth_token', ['*'], now()->addDay())->plainTextToken;

        // Revoke current token
        $currentToken->delete();

        return response()->json([
            'message' => 'Token refreshed successfully',
            'token' => $newToken,
            'expires_at' => now()->addDay()->toISOString()
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $user->update($request->only(['first_name', 'last_name', 'phone', 'email']));

        // Update name if first_name or last_name changed
        if ($request->has('first_name') || $request->has('last_name')) {
            $user->name = ($request->first_name ?? $user->first_name) . ' ' . ($request->last_name ?? $user->last_name);
            $user->save();
        }

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh()
        ]);
    }

    /**
     * Change password
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => [
                'required',
                'string',
                'min:12',
                'confirmed',
                'regex:/[A-Z]/',      // At least one uppercase letter
                'regex:/[a-z]/',      // At least one lowercase letter
                'regex:/[0-9]/',      // At least one number
                'regex:/[!@#$%^&*(),.?":{}|<>]/', // At least one special character
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'Password changed successfully'
        ]);
    }

    /**
     * Forgot password - Send reset email
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();
        
        // Generate reset token
        $token = Str::random(64);
        
        // Store reset token in database
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        // Send reset email
        try {
            Mail::send('emails.password-reset', [
                'user' => $user,
                'token' => $token,
                'resetUrl' => config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($request->email)
            ], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                        ->subject('Reset Your Password - ChurchAfrica');
            });

            return response()->json([
                'message' => 'Password reset email sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send password reset email. Please try again later.'
            ], 500);
        }
    }

    /**
     * Reset password with token
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if reset token exists and is valid
        $resetToken = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetToken) {
            return response()->json([
                'message' => 'Invalid or expired reset token'
            ], 400);
        }

        // Check if token is valid (within 1 hour)
        if (now()->diffInMinutes($resetToken->created_at) > 60) {
            // Delete expired token
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            
            return response()->json([
                'message' => 'Reset token has expired. Please request a new one.'
            ], 400);
        }

        // Verify token
        if (!Hash::check($request->token, $resetToken->token)) {
            return response()->json([
                'message' => 'Invalid reset token'
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Delete used reset token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Revoke all existing tokens for security
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Password reset successfully. Please login with your new password.'
        ]);
    }

    /**
     * Redirect to Google OAuth
     */
    public function googleLogin(Request $request): JsonResponse
    {
        try {
            $redirectUrl = Socialite::driver('google')
                ->stateless()
                ->redirect()
                ->getTargetUrl();
            
            return response()->json([
                'redirect_url' => $redirectUrl
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google OAuth configuration error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle Google OAuth callback
     */
    public function googleCallback(Request $request): JsonResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Check if user exists
            $user = User::where('email', $googleUser->getEmail())->first();
            
            if (!$user) {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(Str::random(16)), // Random password for OAuth users
                    'first_name' => $googleUser->user['given_name'] ?? '',
                    'last_name' => $googleUser->user['family_name'] ?? '',
                    'email_verified_at' => now(), // Google emails are verified
                    'role' => 'member',
                ]);
            }
            
            // Create token
            $token = $user->createToken('google-oauth-token')->plainTextToken;
            
            return response()->json([
                'message' => 'Google login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ],
                'token' => $token
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google OAuth authentication failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify email address
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find verification record
        $verification = DB::table('email_verifications')
            ->where('email', $request->email)
            ->first();

        if (!$verification) {
            return response()->json([
                'message' => 'Invalid verification link'
            ], 400);
        }

        // Check if token is expired
        if (now()->greaterThan($verification->expires_at)) {
            return response()->json([
                'message' => 'Verification link has expired. Please request a new one.',
                'expired' => true
            ], 400);
        }

        // Verify token
        if (!Hash::check($request->token, $verification->token)) {
            return response()->json([
                'message' => 'Invalid verification link'
            ], 400);
        }

        // Update user's email_verified_at
        $user = User::where('email', $request->email)->first();
        $user->email_verified_at = now();
        $user->save();

        // Delete verification record
        DB::table('email_verifications')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Email verified successfully! You can now log in.',
            'verified' => true
        ]);
    }

    /**
     * Resend verification email
     */
    public function resendVerification(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Check if already verified
        if ($user->email_verified_at) {
            return response()->json([
                'message' => 'Email is already verified'
            ], 400);
        }

        // Delete old verification tokens
        DB::table('email_verifications')
            ->where('email', $user->email)
            ->delete();

        // Generate new verification token
        $token = Str::random(64);

        // Store verification token in database
        DB::table('email_verifications')->insert([
            'email' => $user->email,
            'token' => Hash::make($token),
            'created_at' => now(),
            'expires_at' => now()->addHours(24)
        ]);

        // Send verification email
        try {
            $verificationUrl = config('app.frontend_url') . '/verify-email?token=' . $token . '&email=' . urlencode($user->email);

            Mail::send('emails.verify-email', [
                'user' => $user,
                'verificationUrl' => $verificationUrl
            ], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                        ->subject('Verify Your Email - ChurchAfrica');
            });

            return response()->json([
                'message' => 'Verification email sent successfully. Please check your inbox.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send verification email. Please try again later.'
            ], 500);
        }
    }
}
