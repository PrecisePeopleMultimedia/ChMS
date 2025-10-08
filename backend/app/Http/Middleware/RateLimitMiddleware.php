<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RateLimitMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = $this->getRateLimitKey($request);
        $maxAttempts = $this->getMaxAttempts($request);
        $decayMinutes = $this->getDecayMinutes($request);
        
        $attempts = Cache::get($key, 0);
        
        if ($attempts >= $maxAttempts) {
            Log::warning('Rate limit exceeded', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
                'attempts' => $attempts,
                'max_attempts' => $maxAttempts,
            ]);
            
            return response()->json([
                'message' => 'Too many requests. Please try again later.',
                'retry_after' => $decayMinutes * 60
            ], 429);
        }
        
        // Increment attempts
        Cache::put($key, $attempts + 1, $decayMinutes * 60);
        
        $response = $next($request);
        
        // Add rate limit headers
        $response->headers->set('X-RateLimit-Limit', $maxAttempts);
        $response->headers->set('X-RateLimit-Remaining', max(0, $maxAttempts - $attempts - 1));
        $response->headers->set('X-RateLimit-Reset', now()->addMinutes($decayMinutes)->timestamp);
        
        return $response;
    }
    
    /**
     * Get the rate limit key for the request
     */
    private function getRateLimitKey(Request $request): string
    {
        $identifier = $request->ip();
        
        // Use user ID if authenticated
        if (auth()->check()) {
            $identifier = 'user:' . auth()->id();
        }
        
        return 'rate_limit:' . $identifier;
    }
    
    /**
     * Get the maximum number of attempts
     */
    private function getMaxAttempts(Request $request): int
    {
        // Different limits for different endpoints
        if ($request->is('api/auth/*')) {
            return 5; // 5 attempts per minute for auth endpoints
        }
        
        if ($request->is('api/*')) {
            return 60; // 60 requests per minute for API endpoints
        }
        
        return 100; // 100 requests per minute for other endpoints
    }
    
    /**
     * Get the decay time in minutes
     */
    private function getDecayMinutes(Request $request): int
    {
        if ($request->is('api/auth/*')) {
            return 1; // 1 minute for auth endpoints
        }
        
        return 1; // 1 minute for all endpoints
    }
}
