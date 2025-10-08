<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class SecurityMonitoringService
{
    /**
     * Track suspicious activity
     */
    public function trackSuspiciousActivity(string $type, array $data): void
    {
        $ip = request()->ip();
        $userAgent = request()->userAgent();

        Log::warning('Suspicious activity detected', [
            'type' => $type,
            'ip' => $ip,
            'user_agent' => $userAgent,
            'data' => $data,
            'timestamp' => now(),
        ]);

        // Track by IP
        $ipActivity = Cache::increment("suspicious_activity:$ip", 1);
        if (!Cache::has("suspicious_activity:$ip:ttl")) {
            Cache::put("suspicious_activity:$ip:ttl", true, 3600); // 1 hour
        }

        if ($ipActivity > 10) {
            $this->alertHighRiskActivity($ip, $type, $ipActivity);
        }
    }

    /**
     * Track API abuse
     */
    public function trackAPIAbuse(string $endpoint, int $statusCode, float $responseTime): void
    {
        $ip = request()->ip();
        
        // Track slow requests
        if ($responseTime > 5.0) {
            Log::warning('Slow API request detected', [
                'endpoint' => $endpoint,
                'response_time' => $responseTime,
                'ip' => $ip,
                'status_code' => $statusCode,
            ]);
        }

        // Track error rates
        if ($statusCode >= 400) {
            $errorRate = Cache::increment("api_errors:$ip", 1);
            if (!Cache::has("api_errors:$ip:ttl")) {
                Cache::put("api_errors:$ip:ttl", true, 300); // 5 minutes
            }

            if ($errorRate > 20) {
                $this->trackSuspiciousActivity('high_error_rate', [
                    'endpoint' => $endpoint,
                    'error_count' => $errorRate,
                    'ip' => $ip,
                ]);
            }
        }
    }

    /**
     * Track unusual access patterns
     */
    public function trackUnusualAccess(string $endpoint, array $userContext = []): void
    {
        $ip = request()->ip();
        $userAgent = request()->userAgent();

        // Track access patterns
        $accessKey = "access_pattern:$ip:$endpoint";
        $accessCount = Cache::increment($accessKey, 1);
        if (!Cache::has("$accessKey:ttl")) {
            Cache::put("$accessKey:ttl", true, 3600); // 1 hour
        }

        // Alert on unusual patterns
        if ($accessCount > 100) {
            $this->trackSuspiciousActivity('unusual_access_pattern', [
                'endpoint' => $endpoint,
                'access_count' => $accessCount,
                'ip' => $ip,
                'user_agent' => $userAgent,
                'user_context' => $userContext,
            ]);
        }
    }

    /**
     * Check for potential attacks
     */
    public function checkForAttacks(): array
    {
        $ip = request()->ip();
        $attacks = [];

        // Check for SQL injection attempts
        $query = request()->getQueryString();
        if ($query && $this->detectSQLInjection($query)) {
            $attacks[] = 'sql_injection';
            $this->trackSuspiciousActivity('sql_injection_attempt', [
                'query' => $query,
                'ip' => $ip,
            ]);
        }

        // Check for XSS attempts
        $input = request()->all();
        if ($this->detectXSS($input)) {
            $attacks[] = 'xss_attempt';
            $this->trackSuspiciousActivity('xss_attempt', [
                'input' => $input,
                'ip' => $ip,
            ]);
        }

        // Check for directory traversal
        if ($this->detectDirectoryTraversal($input)) {
            $attacks[] = 'directory_traversal';
            $this->trackSuspiciousActivity('directory_traversal_attempt', [
                'input' => $input,
                'ip' => $ip,
            ]);
        }

        return $attacks;
    }

    /**
     * Alert high-risk activity
     */
    private function alertHighRiskActivity(string $ip, string $type, int $count): void
    {
        Log::alert('High-risk security activity detected', [
            'ip' => $ip,
            'type' => $type,
            'count' => $count,
            'timestamp' => now(),
        ]);

        // Send to Sentry in production
        if (app()->environment('production')) {
            \Sentry\captureMessage("High-risk security activity: $type", [
                'level' => 'error',
                'tags' => [
                    'security' => 'high_risk',
                    'type' => $type,
                    'ip' => $ip,
                    'count' => $count,
                ],
            ]);
        }

        // Block IP temporarily
        RateLimiter::hit("security_block:$ip", 7200); // 2 hours
    }

    /**
     * Detect SQL injection attempts
     */
    private function detectSQLInjection(string $query): bool
    {
        $patterns = [
            '/union\s+select/i',
            '/drop\s+table/i',
            '/delete\s+from/i',
            '/insert\s+into/i',
            '/update\s+set/i',
            '/or\s+1\s*=\s*1/i',
            '/and\s+1\s*=\s*1/i',
            '/\'/i',
            '/"/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $query)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Detect XSS attempts
     */
    private function detectXSS(array $input): bool
    {
        $patterns = [
            '/<script/i',
            '/javascript:/i',
            '/on\w+\s*=/i',
            '/<iframe/i',
            '/<object/i',
            '/<embed/i',
        ];

        foreach ($input as $value) {
            if (is_string($value)) {
                foreach ($patterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Detect directory traversal attempts
     */
    private function detectDirectoryTraversal(array $input): bool
    {
        $patterns = [
            '/\.\.\//',
            '/\.\.\\\\/',
            '/%2e%2e%2f/',
            '/%2e%2e%5c/',
        ];

        foreach ($input as $value) {
            if (is_string($value)) {
                foreach ($patterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Get security metrics
     */
    public function getSecurityMetrics(): array
    {
        $ip = request()->ip();
        
        return [
            'failed_logins' => Cache::get("login_attempts:$ip", 0),
            'suspicious_activity' => Cache::get("suspicious_activity:$ip", 0),
            'api_errors' => Cache::get("api_errors:$ip", 0),
            'is_rate_limited' => RateLimiter::tooManyAttempts("login:$ip", 5),
            'is_security_blocked' => RateLimiter::tooManyAttempts("security_block:$ip", 1),
        ];
    }
}
