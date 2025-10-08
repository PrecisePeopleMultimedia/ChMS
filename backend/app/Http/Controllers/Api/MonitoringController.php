<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SecurityMonitoringService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MonitoringController extends Controller
{
    protected SecurityMonitoringService $securityService;

    public function __construct(SecurityMonitoringService $securityService)
    {
        $this->securityService = $securityService;
    }

    /**
     * Get comprehensive monitoring metrics
     */
    public function metrics(Request $request)
    {
        $ip = $request->ip();
        
        // Security metrics
        $securityMetrics = $this->securityService->getSecurityMetrics();
        
        // System metrics
        $systemMetrics = [
            'memory_usage' => memory_get_usage(true),
            'memory_peak' => memory_get_peak_usage(true),
            'memory_limit' => ini_get('memory_limit'),
            'uptime' => $this->getUptime(),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
        ];

        // Database metrics
        $dbMetrics = $this->getDatabaseMetrics();
        
        // Cache metrics
        $cacheMetrics = $this->getCacheMetrics();

        // API metrics
        $apiMetrics = $this->getAPIMetrics($ip);

        return response()->json([
            'timestamp' => now()->toIso8601String(),
            'security' => $securityMetrics,
            'system' => $systemMetrics,
            'database' => $dbMetrics,
            'cache' => $cacheMetrics,
            'api' => $apiMetrics,
        ]);
    }

    /**
     * Get security alerts
     */
    public function securityAlerts(Request $request)
    {
        $alerts = [];
        $ip = $request->ip();

        // Check for recent security events
        $failedLogins = Cache::get("login_attempts:$ip", 0);
        if ($failedLogins > 3) {
            $alerts[] = [
                'type' => 'failed_logins',
                'severity' => 'medium',
                'message' => "Multiple failed login attempts: $failedLogins",
                'count' => $failedLogins,
            ];
        }

        $suspiciousActivity = Cache::get("suspicious_activity:$ip", 0);
        if ($suspiciousActivity > 5) {
            $alerts[] = [
                'type' => 'suspicious_activity',
                'severity' => 'high',
                'message' => "High suspicious activity detected: $suspiciousActivity",
                'count' => $suspiciousActivity,
            ];
        }

        $apiErrors = Cache::get("api_errors:$ip", 0);
        if ($apiErrors > 10) {
            $alerts[] = [
                'type' => 'api_errors',
                'severity' => 'medium',
                'message' => "High API error rate: $apiErrors",
                'count' => $apiErrors,
            ];
        }

        return response()->json([
            'alerts' => $alerts,
            'total' => count($alerts),
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Get system health status
     */
    public function healthStatus()
    {
        $checks = [];
        
        // Database check
        try {
            DB::connection()->getPdo();
            $checks['database'] = ['status' => 'healthy', 'response_time' => 0];
        } catch (\Exception $e) {
            $checks['database'] = ['status' => 'unhealthy', 'error' => $e->getMessage()];
        }

        // Cache check
        try {
            Cache::put('health_check', 'ok', 60);
            $cacheWorking = Cache::get('health_check') === 'ok';
            $checks['cache'] = ['status' => $cacheWorking ? 'healthy' : 'unhealthy'];
        } catch (\Exception $e) {
            $checks['cache'] = ['status' => 'unhealthy', 'error' => $e->getMessage()];
        }

        // Storage check
        $storageWritable = is_writable(storage_path());
        $checks['storage'] = ['status' => $storageWritable ? 'healthy' : 'unhealthy'];

        // Overall status
        $overallStatus = 'healthy';
        foreach ($checks as $check) {
            if ($check['status'] !== 'healthy') {
                $overallStatus = 'degraded';
                break;
            }
        }

        return response()->json([
            'status' => $overallStatus,
            'checks' => $checks,
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Get database metrics
     */
    private function getDatabaseMetrics(): array
    {
        try {
            $connection = DB::connection();
            $pdo = $connection->getPdo();
            
            // Get connection info
            $connectionInfo = [
                'driver' => $connection->getDriverName(),
                'database' => $connection->getDatabaseName(),
                'host' => $connection->getConfig('host'),
                'port' => $connection->getConfig('port'),
            ];

            // Get table counts (if possible)
            $tableCounts = [];
            try {
                $tables = ['members', 'organizations', 'member_badges', 'member_notes'];
                foreach ($tables as $table) {
                    $tableCounts[$table] = DB::table($table)->count();
                }
            } catch (\Exception $e) {
                // Tables might not exist yet
                $tableCounts = ['error' => 'Tables not accessible'];
            }

            return [
                'status' => 'connected',
                'connection' => $connectionInfo,
                'table_counts' => $tableCounts,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'disconnected',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get cache metrics
     */
    private function getCacheMetrics(): array
    {
        try {
            $store = Cache::getStore();
            $driverName = get_class($store);
            
            // Test cache operations
            $testKey = 'monitoring_test_' . time();
            Cache::put($testKey, 'test_value', 60);
            $retrieved = Cache::get($testKey);
            Cache::forget($testKey);
            
            return [
                'status' => $retrieved === 'test_value' ? 'operational' : 'failed',
                'driver' => $driverName,
                'test_passed' => $retrieved === 'test_value',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'failed',
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get API metrics
     */
    private function getAPIMetrics(string $ip): array
    {
        return [
            'requests_today' => Cache::get("api_requests_today:$ip", 0),
            'errors_today' => Cache::get("api_errors_today:$ip", 0),
            'avg_response_time' => Cache::get("avg_response_time:$ip", 0),
            'last_request' => Cache::get("last_request:$ip"),
        ];
    }

    /**
     * Get system uptime
     */
    private function getUptime(): string
    {
        try {
            if (function_exists('sys_getloadavg')) {
                $load = sys_getloadavg();
                return "Load: " . implode(', ', $load);
            }
            return 'N/A';
        } catch (\Exception $e) {
            return 'N/A';
        }
    }
}