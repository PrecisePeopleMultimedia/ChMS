<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LoggingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        // Log request details
        Log::info('HTTP Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toIso8601String(),
        ]);

        $response = $next($request);

        // Calculate response time
        $responseTime = round((microtime(true) - $startTime) * 1000, 2);

        // Log response details
        Log::info('HTTP Response', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'status_code' => $response->getStatusCode(),
            'response_time_ms' => $responseTime,
            'memory_usage_mb' => round(memory_get_usage(true) / 1024 / 1024, 2),
            'user_id' => auth()->id(),
            'timestamp' => now()->toIso8601String(),
        ]);

        // Log slow requests (> 1 second)
        if ($responseTime > 1000) {
            Log::warning('Slow Request Detected', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'response_time_ms' => $responseTime,
                'user_id' => auth()->id(),
            ]);
        }

        // Log error responses
        if ($response->getStatusCode() >= 400) {
            Log::error('HTTP Error Response', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'status_code' => $response->getStatusCode(),
                'response_time_ms' => $responseTime,
                'user_id' => auth()->id(),
                'request_data' => $this->sanitizeRequestData($request),
            ]);
        }

        return $response;
    }

    /**
     * Sanitize sensitive request data for logging
     */
    private function sanitizeRequestData(Request $request): array
    {
        $data = $request->all();
        
        // Remove sensitive fields
        $sensitiveFields = ['password', 'password_confirmation', 'token', 'secret', 'key'];
        
        foreach ($sensitiveFields as $field) {
            if (isset($data[$field])) {
                $data[$field] = '[REDACTED]';
            }
        }
        
        return $data;
    }
}
