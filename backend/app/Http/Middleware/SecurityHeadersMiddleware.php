<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeadersMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
        
        // Content Security Policy - Removed 'unsafe-eval' as no eval() is used in the codebase
        $csp = "default-src 'self'; " .
               "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " .
               "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " .
               "font-src 'self' https://fonts.gstatic.com; " .
               "img-src 'self' data: https:; " .
               "connect-src 'self' https://api.churchafrica.com; " .
               "frame-ancestors 'none';";
        
        $response->headers->set('Content-Security-Policy', $csp);
        
        // Cache-Control headers for static assets
        $path = $request->path();
        if ($this->isStaticAsset($path)) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
        } elseif ($this->isApiRoute($path)) {
            // API responses should not be cached
            $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        } else {
            // HTML pages - short cache with revalidation
            $response->headers->set('Cache-Control', 'no-cache, must-revalidate, max-age=0');
        }
        
        // Attribution Reporting - This requires the origin to be registered as trustworthy
        // at the browser/OS level (HTTPS + proper domain configuration)
        // The warning will resolve when the site is properly configured with HTTPS
        
        // HSTS for production
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        return $response;
    }
    
    /**
     * Check if the request path is a static asset
     */
    private function isStaticAsset(string $path): bool
    {
        $staticExtensions = ['css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'eot', 'webp'];
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        return in_array(strtolower($extension), $staticExtensions);
    }
    
    /**
     * Check if the request path is an API route
     */
    private function isApiRoute(string $path): bool
    {
        return str_starts_with($path, 'api/');
    }
}
