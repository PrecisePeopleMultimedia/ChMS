<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Failed;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class LogFailedLogin
{
    /**
     * Handle the event.
     */
    public function handle(Failed $event): void
    {
        $credentials = $event->credentials;
        $ip = request()->ip();
        $userAgent = request()->userAgent();

        // Log failed login attempt
        Log::warning('Failed login attempt', [
            'email' => $credentials['email'] ?? 'unknown',
            'ip' => $ip,
            'user_agent' => $userAgent,
            'timestamp' => now(),
            'country' => $this->getCountryFromIP($ip),
        ]);

        // Track failed attempts per IP
        $attempts = Cache::increment("login_attempts:$ip", 1);
        Cache::expire("login_attempts:$ip", 300); // 5 minutes

        // Check for brute force attack
        if ($attempts > 5) {
            Log::alert('Possible brute force attack detected', [
                'ip' => $ip,
                'attempts' => $attempts,
                'email' => $credentials['email'] ?? 'unknown',
                'user_agent' => $userAgent,
            ]);

            // Rate limit the IP
            RateLimiter::hit("login:$ip", 3600); // 1 hour block

            // Send alert to Sentry
            if (app()->environment('production')) {
                \Sentry\captureMessage("Brute force attack detected from IP: $ip", [
                    'level' => 'error',
                    'tags' => [
                        'security' => 'brute_force',
                        'ip' => $ip,
                        'attempts' => $attempts,
                    ],
                ]);
            }
        }

        // Track failed attempts per email
        $emailAttempts = Cache::increment("login_attempts_email:{$credentials['email']}", 1);
        Cache::expire("login_attempts_email:{$credentials['email']}", 900); // 15 minutes

        if ($emailAttempts > 3) {
            Log::warning('Multiple failed login attempts for email', [
                'email' => $credentials['email'],
                'attempts' => $emailAttempts,
                'ip' => $ip,
            ]);
        }
    }

    /**
     * Get country from IP address (simplified)
     */
    private function getCountryFromIP(string $ip): ?string
    {
        try {
            // This is a simplified implementation
            // In production, use a proper GeoIP service
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                // For now, return null - implement proper GeoIP lookup
                return null;
            }
        } catch (\Exception $e) {
            Log::debug('Failed to get country from IP', ['ip' => $ip, 'error' => $e->getMessage()]);
        }

        return null;
    }
}
