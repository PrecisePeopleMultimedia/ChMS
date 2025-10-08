<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Exception;

class MonitoringService
{
    /**
     * Check system health
     */
    public function checkHealth(): array
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'storage' => $this->checkStorage(),
            'memory' => $this->checkMemory(),
        ];

        $overallStatus = collect($checks)->every(fn($check) => $check['status'] === 'healthy') 
            ? 'healthy' 
            : 'degraded';

        return [
            'status' => $overallStatus,
            'timestamp' => now()->toIso8601String(),
            'version' => config('app.version', '1.0.0'),
            'environment' => app()->environment(),
            'checks' => $checks,
            'uptime' => [
                'started_at' => config('app.started_at', now()->toIso8601String()),
                'memory_usage' => memory_get_usage(true),
                'memory_peak' => memory_get_peak_usage(true),
            ]
        ];
    }

    /**
     * Check database connectivity
     */
    private function checkDatabase(): array
    {
        try {
            $startTime = microtime(true);
            DB::connection()->getPdo();
            $responseTime = round((microtime(true) - $startTime) * 1000, 2);

            return [
                'status' => 'healthy',
                'response_time_ms' => $responseTime,
                'connection' => 'connected',
            ];
        } catch (Exception $e) {
            Log::error('Database health check failed', [
                'error' => $e->getMessage(),
                'timestamp' => now()->toIso8601String(),
            ]);

            return [
                'status' => 'unhealthy',
                'error' => $e->getMessage(),
                'connection' => 'disconnected',
            ];
        }
    }

    /**
     * Check cache functionality
     */
    private function checkCache(): array
    {
        try {
            $testKey = 'health_check_' . uniqid();
            $testValue = 'ok';
            
            Cache::put($testKey, $testValue, 60);
            $retrieved = Cache::get($testKey);
            Cache::forget($testKey);

            if ($retrieved !== $testValue) {
                throw new Exception('Cache read/write test failed');
            }

            return [
                'status' => 'healthy',
                'driver' => config('cache.default'),
                'connection' => 'operational',
            ];
        } catch (Exception $e) {
            Log::error('Cache health check failed', [
                'error' => $e->getMessage(),
                'driver' => config('cache.default'),
                'timestamp' => now()->toIso8601String(),
            ]);

            return [
                'status' => 'unhealthy',
                'error' => $e->getMessage(),
                'driver' => config('cache.default'),
                'connection' => 'failed',
            ];
        }
    }

    /**
     * Check storage accessibility
     */
    private function checkStorage(): array
    {
        try {
            $testFile = 'health_check_' . uniqid() . '.txt';
            $testContent = 'health check test';
            
            Storage::put($testFile, $testContent);
            $retrieved = Storage::get($testFile);
            Storage::delete($testFile);

            if ($retrieved !== $testContent) {
                throw new Exception('Storage read/write test failed');
            }

            return [
                'status' => 'healthy',
                'driver' => config('filesystems.default'),
                'writable' => true,
            ];
        } catch (Exception $e) {
            Log::error('Storage health check failed', [
                'error' => $e->getMessage(),
                'driver' => config('filesystems.default'),
                'timestamp' => now()->toIso8601String(),
            ]);

            return [
                'status' => 'unhealthy',
                'error' => $e->getMessage(),
                'driver' => config('filesystems.default'),
                'writable' => false,
            ];
        }
    }

    /**
     * Check memory usage
     */
    private function checkMemory(): array
    {
        $memoryUsage = memory_get_usage(true);
        $memoryPeak = memory_get_peak_usage(true);
        $memoryLimit = $this->getMemoryLimit();
        $usagePercentage = ($memoryUsage / $memoryLimit) * 100;

        $status = $usagePercentage > config('monitoring.health_checks.memory_threshold', 90) 
            ? 'unhealthy' 
            : 'healthy';

        if ($status === 'unhealthy') {
            Log::warning('High memory usage detected', [
                'usage_mb' => round($memoryUsage / 1024 / 1024, 2),
                'peak_mb' => round($memoryPeak / 1024 / 1024, 2),
                'limit_mb' => round($memoryLimit / 1024 / 1024, 2),
                'usage_percentage' => round($usagePercentage, 2),
                'timestamp' => now()->toIso8601String(),
            ]);
        }

        return [
            'status' => $status,
            'usage_mb' => round($memoryUsage / 1024 / 1024, 2),
            'peak_mb' => round($memoryPeak / 1024 / 1024, 2),
            'limit_mb' => round($memoryLimit / 1024 / 1024, 2),
            'usage_percentage' => round($usagePercentage, 2),
        ];
    }

    /**
     * Get memory limit in bytes
     */
    private function getMemoryLimit(): int
    {
        $limit = ini_get('memory_limit');
        
        if ($limit === '-1') {
            return PHP_INT_MAX;
        }

        $unit = strtolower(substr($limit, -1));
        $value = (int) $limit;

        switch ($unit) {
            case 'g':
                return $value * 1024 * 1024 * 1024;
            case 'm':
                return $value * 1024 * 1024;
            case 'k':
                return $value * 1024;
            default:
                return $value;
        }
    }

    /**
     * Log performance metrics
     */
    public function logPerformanceMetrics(string $endpoint, float $responseTime, int $statusCode, string $method = 'GET'): void
    {
        $isSlow = $responseTime > config('monitoring.performance.slow_request_threshold', 1000);
        $isError = $statusCode >= 400;

        if ($isSlow) {
            Log::warning('Slow request detected', [
                'endpoint' => $endpoint,
                'method' => $method,
                'response_time_ms' => $responseTime,
                'status_code' => $statusCode,
                'timestamp' => now()->toIso8601String(),
            ]);
        }

        if ($isError) {
            Log::error('HTTP error response', [
                'endpoint' => $endpoint,
                'method' => $method,
                'response_time_ms' => $responseTime,
                'status_code' => $statusCode,
                'timestamp' => now()->toIso8601String(),
            ]);
        }

        // Log all requests for performance analysis
        Log::info('Request performance', [
            'endpoint' => $endpoint,
            'method' => $method,
            'response_time_ms' => $responseTime,
            'status_code' => $statusCode,
            'slow' => $isSlow,
            'error' => $isError,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Check for suspicious activity
     */
    public function checkSuspiciousActivity(string $ip, string $userAgent, string $endpoint): void
    {
        if (!config('monitoring.security.enabled', true)) {
            return;
        }

        // Check for suspicious user agents
        $suspiciousPatterns = [
            'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python-requests'
        ];

        $userAgentLower = strtolower($userAgent);
        foreach ($suspiciousPatterns as $pattern) {
            if (strpos($userAgentLower, $pattern) !== false) {
                Log::warning('Suspicious user agent detected', [
                    'ip' => $ip,
                    'user_agent' => $userAgent,
                    'endpoint' => $endpoint,
                    'pattern' => $pattern,
                    'timestamp' => now()->toIso8601String(),
                ]);
                break;
            }
        }

        // Check for rapid requests from same IP
        $key = "rapid_requests:$ip";
        $requests = Cache::increment($key, 1);
        Cache::expire($key, 60); // 1 minute window

        if ($requests > 100) { // More than 100 requests per minute
            Log::alert('Rapid requests detected from IP', [
                'ip' => $ip,
                'requests_per_minute' => $requests,
                'endpoint' => $endpoint,
                'timestamp' => now()->toIso8601String(),
            ]);
        }
    }
}
