# Monitoring and Observability

## Overview
This document outlines the monitoring and observability setup for ChurchAfrica, ensuring system health, performance, and reliability.

## Monitoring Stack

### Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Laravel Telescope**: Local development debugging
- **Laravel Horizon**: Queue monitoring and management
- **Custom Metrics**: Application-specific metrics

### Infrastructure Monitoring
- **Server Monitoring**: CPU, memory, disk, network
- **Database Monitoring**: PostgreSQL performance and health
- **Cache Monitoring**: Redis performance and usage
- **CDN Monitoring**: Static asset delivery performance

### User Experience Monitoring
- **Real User Monitoring (RUM)**: Frontend performance
- **Synthetic Monitoring**: Automated testing
- **Error Tracking**: Client-side error tracking
- **Performance Metrics**: Core Web Vitals

## Sentry Configuration

### Installation
```bash
composer require sentry/sentry-laravel
```

### Configuration
```php
// config/sentry.php
return [
    'dsn' => env('SENTRY_DSN'),
    'environment' => env('APP_ENV'),
    'release' => env('SENTRY_RELEASE'),
    'sample_rate' => env('SENTRY_SAMPLE_RATE', 1.0),
    'traces_sample_rate' => env('SENTRY_TRACES_SAMPLE_RATE', 1.0),
    'profiles_sample_rate' => env('SENTRY_PROFILES_SAMPLE_RATE', 1.0),
    'send_default_pii' => false,
    'attach_stacktrace' => true,
    'before_send' => function (\Sentry\Event $event, ?\Sentry\EventHint $hint): ?\Sentry\Event {
        // Filter sensitive data
        return $event;
    },
];
```

### Laravel Integration
```php
// app/Exceptions/Handler.php
use Sentry\Laravel\Integration;

public function register()
{
    $this->reportable(function (Throwable $e) {
        if (app()->bound('sentry')) {
            app('sentry')->captureException($e);
        }
    });
}
```

### Custom Metrics
```php
// app/Services/MonitoringService.php
use Sentry\Laravel\Integration;

class MonitoringService
{
    public function trackUserAction(string $action, array $context = [])
    {
        Sentry\addBreadcrumb([
            'message' => $action,
            'category' => 'user_action',
            'data' => $context,
        ]);
    }
    
    public function trackPerformance(string $operation, float $duration)
    {
        Sentry\addBreadcrumb([
            'message' => $operation,
            'category' => 'performance',
            'data' => ['duration' => $duration],
        ]);
    }
}
```

## Laravel Telescope

### Installation
```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

### Configuration
```php
// config/telescope.php
return [
    'enabled' => env('TELESCOPE_ENABLED', true),
    'domain' => env('TELESCOPE_DOMAIN'),
    'path' => env('TELESCOPE_PATH', 'telescope'),
    'driver' => env('TELESCOPE_DRIVER', 'database'),
    'storage' => [
        'database' => [
            'connection' => env('DB_CONNECTION', 'mysql'),
            'chunk' => 1000,
        ],
    ],
    'watchers' => [
        Watchers\CacheWatcher::class => env('TELESCOPE_CACHE_WATCHER', true),
        Watchers\CommandWatcher::class => env('TELESCOPE_COMMAND_WATCHER', true),
        Watchers\ExceptionWatcher::class => env('TELESCOPE_EXCEPTION_WATCHER', true),
        Watchers\JobWatcher::class => env('TELESCOPE_JOB_WATCHER', true),
        Watchers\LogWatcher::class => env('TELESCOPE_LOG_WATCHER', true),
        Watchers\MailWatcher::class => env('TELESCOPE_MAIL_WATCHER', true),
        Watchers\ModelWatcher::class => env('TELESCOPE_MODEL_WATCHER', true),
        Watchers\NotificationWatcher::class => env('TELESCOPE_NOTIFICATION_WATCHER', true),
        Watchers\QueryWatcher::class => env('TELESCOPE_QUERY_WATCHER', true),
        Watchers\RedisWatcher::class => env('TELESCOPE_REDIS_WATCHER', true),
        Watchers\RequestWatcher::class => env('TELESCOPE_REQUEST_WATCHER', true),
        Watchers\GateWatcher::class => env('TELESCOPE_GATE_WATCHER', true),
        Watchers\ScheduleWatcher::class => env('TELESCOPE_SCHEDULE_WATCHER', true),
        Watchers\ViewWatcher::class => env('TELESCOPE_VIEW_WATCHER', true),
    ],
];
```

## Laravel Horizon

### Installation
```bash
composer require laravel/horizon
php artisan horizon:install
```

### Configuration
```php
// config/horizon.php
return [
    'environment' => env('APP_ENV', 'local'),
    'use' => 'default',
    'processes' => 3,
    'tries' => 3,
    'timeout' => 60,
    'memory' => 128,
    'max_time' => 0,
    'max_memory' => 64,
    'balance' => 'auto',
    'balance_max_shift' => 1,
    'balance_cooldown' => 3,
    'auto_scaling_strategy' => 'time',
    'max_processes' => 1,
    'min_processes' => 1,
    'tick' => 1,
    'trim' => [
        'recent' => 60,
        'completed' => 60,
        'recent_failed' => 10080,
    ],
    'metrics' => 5,
    'snapshot' => [
        'interval' => 60,
    ],
];
```

## Custom Metrics

### Application Metrics
```php
// app/Services/MetricsService.php
class MetricsService
{
    public function trackAttendanceRecorded()
    {
        // Track attendance recording
        $this->incrementCounter('attendance.recorded');
    }
    
    public function trackMemberRegistered()
    {
        // Track member registration
        $this->incrementCounter('members.registered');
    }
    
    public function trackApiRequest(string $endpoint, float $duration)
    {
        // Track API performance
        $this->recordHistogram('api.request.duration', $duration, [
            'endpoint' => $endpoint,
        ]);
    }
    
    public function trackDatabaseQuery(string $query, float $duration)
    {
        // Track database performance
        $this->recordHistogram('database.query.duration', $duration, [
            'query' => $query,
        ]);
    }
    
    private function incrementCounter(string $name, array $tags = [])
    {
        // Implementation for counter metrics
    }
    
    private function recordHistogram(string $name, float $value, array $tags = [])
    {
        // Implementation for histogram metrics
    }
}
```

### Health Checks
```php
// app/Http/Controllers/HealthController.php
class HealthController extends Controller
{
    public function health()
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'queue' => $this->checkQueue(),
            'storage' => $this->checkStorage(),
        ];
        
        $healthy = collect($checks)->every(fn($check) => $check['status'] === 'ok');
        
        return response()->json([
            'status' => $healthy ? 'healthy' : 'unhealthy',
            'checks' => $checks,
            'timestamp' => now()->toISOString(),
        ], $healthy ? 200 : 503);
    }
    
    private function checkDatabase()
    {
        try {
            DB::connection()->getPdo();
            return ['status' => 'ok', 'message' => 'Database connection successful'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    
    private function checkCache()
    {
        try {
            Cache::put('health_check', 'ok', 10);
            $value = Cache::get('health_check');
            return ['status' => 'ok', 'message' => 'Cache working'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    
    private function checkQueue()
    {
        try {
            // Check if queue is processing
            return ['status' => 'ok', 'message' => 'Queue is processing'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    
    private function checkStorage()
    {
        try {
            Storage::disk('local')->put('health_check.txt', 'ok');
            $content = Storage::disk('local')->get('health_check.txt');
            Storage::disk('local')->delete('health_check.txt');
            return ['status' => 'ok', 'message' => 'Storage working'];
        } catch (Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}
```

## Frontend Monitoring

### Sentry Frontend
```javascript
// frontend/src/main.ts
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
  ],
})
```

### Performance Monitoring
```javascript
// frontend/src/utils/performance.ts
export class PerformanceMonitor {
  static trackPageLoad(pageName: string) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const loadTime = navigation.loadEventEnd - navigation.loadEventStart
    
    // Send to monitoring service
    this.sendMetric('page.load.time', loadTime, { page: pageName })
  }
  
  static trackApiCall(endpoint: string, duration: number) {
    this.sendMetric('api.call.duration', duration, { endpoint })
  }
  
  static trackUserAction(action: string, context: Record<string, any>) {
    this.sendMetric('user.action', 1, { action, ...context })
  }
  
  private static sendMetric(name: string, value: number, tags: Record<string, any>) {
    // Implementation for sending metrics
  }
}
```

## Alerting

### Alert Rules
```yaml
# monitoring/alerts.yml
groups:
  - name: churchafrica
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          
      - alert: DatabaseConnectionFailure
        expr: up{job="database"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database connection failed"
```

### Notification Channels
```yaml
# monitoring/notifications.yml
notifications:
  - name: slack
    type: slack
    webhook_url: "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
    channel: "#alerts"
    
  - name: email
    type: email
    to: ["admin@churchafrica.com"]
    from: "alerts@churchafrica.com"
    
  - name: pagerduty
    type: pagerduty
    service_key: "YOUR_PAGERDUTY_SERVICE_KEY"
```

## Dashboard Configuration

### Grafana Dashboard
```json
{
  "dashboard": {
    "title": "ChurchAfrica Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      }
    ]
  }
}
```

## Logging Configuration

### Structured Logging
```php
// app/Services/LoggingService.php
class LoggingService
{
    public function logUserAction(string $action, User $user, array $context = [])
    {
        Log::info('User action', [
            'action' => $action,
            'user_id' => $user->id,
            'user_email' => $user->email,
            'timestamp' => now()->toISOString(),
            'context' => $context,
        ]);
    }
    
    public function logApiRequest(Request $request, Response $response, float $duration)
    {
        Log::info('API request', [
            'method' => $request->method(),
            'url' => $request->url(),
            'status' => $response->status(),
            'duration' => $duration,
            'user_id' => auth()->id(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
    
    public function logSecurityEvent(string $event, array $context = [])
    {
        Log::warning('Security event', [
            'event' => $event,
            'timestamp' => now()->toISOString(),
            'context' => $context,
        ]);
    }
}
```

## Performance Monitoring

### Database Performance
```php
// app/Providers/AppServiceProvider.php
public function boot()
{
    if (config('app.debug')) {
        DB::listen(function ($query) {
            if ($query->time > 1000) { // Log slow queries
                Log::warning('Slow query detected', [
                    'sql' => $query->sql,
                    'bindings' => $query->bindings,
                    'time' => $query->time,
                ]);
            }
        });
    }
}
```

### Memory Usage
```php
// app/Http/Middleware/MemoryUsageMiddleware.php
class MemoryUsageMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $startMemory = memory_get_usage();
        $startPeakMemory = memory_get_peak_usage();
        
        $response = $next($request);
        
        $endMemory = memory_get_usage();
        $endPeakMemory = memory_get_peak_usage();
        
        $memoryUsed = $endMemory - $startMemory;
        $peakMemoryUsed = $endPeakMemory - $startPeakMemory;
        
        if ($memoryUsed > 50 * 1024 * 1024) { // 50MB
            Log::warning('High memory usage detected', [
                'memory_used' => $memoryUsed,
                'peak_memory_used' => $peakMemoryUsed,
                'url' => $request->url(),
            ]);
        }
        
        return $response;
    }
}
```

## Best Practices

### Monitoring
- **Set up alerts**: Configure alerts for critical metrics
- **Monitor trends**: Track performance trends over time
- **Regular reviews**: Review monitoring data regularly
- **Documentation**: Keep monitoring documentation updated

### Performance
- **Baseline metrics**: Establish performance baselines
- **Regular testing**: Perform regular performance tests
- **Optimization**: Continuously optimize based on metrics
- **Capacity planning**: Plan for future capacity needs

### Security
- **Security monitoring**: Monitor for security events
- **Access logging**: Log all access attempts
- **Audit trails**: Maintain comprehensive audit trails
- **Incident response**: Have incident response procedures

This monitoring and observability setup ensures comprehensive visibility into system health, performance, and security.
