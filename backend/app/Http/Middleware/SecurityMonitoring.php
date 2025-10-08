<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\SecurityMonitoringService;
use Symfony\Component\HttpFoundation\Response;

class SecurityMonitoring
{
    protected SecurityMonitoringService $securityService;

    public function __construct(SecurityMonitoringService $securityService)
    {
        $this->securityService = $securityService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        // Check for potential attacks
        $attacks = $this->securityService->checkForAttacks();
        
        if (!empty($attacks)) {
            return response()->json([
                'error' => 'Security violation detected',
                'type' => 'security_block',
                'attacks' => $attacks,
            ], 403);
        }

        // Process the request
        $response = $next($request);

        // Track API performance and abuse
        $endTime = microtime(true);
        $responseTime = ($endTime - $startTime) * 1000; // Convert to milliseconds

        $this->securityService->trackAPIAbuse(
            $request->path(),
            $response->getStatusCode(),
            $responseTime
        );

        // Track unusual access patterns
        $this->securityService->trackUnusualAccess(
            $request->path(),
            [
                'user_id' => auth()->id(),
                'method' => $request->method(),
                'user_agent' => $request->userAgent(),
            ]
        );

        return $response;
    }
}
