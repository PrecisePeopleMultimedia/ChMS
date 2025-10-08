<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Monitoring Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for monitoring and observability features including
    | error tracking, performance monitoring, and health checks.
    |
    */

    'sentry' => [
        'enabled' => env('SENTRY_ENABLED', true),
        'dsn' => env('SENTRY_LARAVEL_DSN', env('SENTRY_DSN')),
        'release' => env('SENTRY_RELEASE', '1.0.0'),
        'environment' => env('SENTRY_ENVIRONMENT', env('APP_ENV', 'local')),
        'sample_rate' => env('SENTRY_SAMPLE_RATE', 1.0),
        'traces_sample_rate' => env('SENTRY_TRACES_SAMPLE_RATE', 1.0),
        'profiles_sample_rate' => env('SENTRY_PROFILES_SAMPLE_RATE', 0.5),
        'enable_logs' => env('SENTRY_ENABLE_LOGS', true),
        'send_default_pii' => env('SENTRY_SEND_DEFAULT_PII', false),
    ],

    'performance' => [
        'enabled' => env('PERFORMANCE_MONITORING_ENABLED', true),
        'slow_request_threshold' => env('SLOW_REQUEST_THRESHOLD_MS', 1000),
        'memory_threshold' => env('MEMORY_THRESHOLD_MB', 128),
        'track_sql_queries' => env('TRACK_SQL_QUERIES', true),
        'track_cache_operations' => env('TRACK_CACHE_OPERATIONS', true),
        'track_queue_jobs' => env('TRACK_QUEUE_JOBS', true),
    ],

    'rate_limiting' => [
        'enabled' => env('RATE_LIMITING_ENABLED', true),
        'auth_attempts' => env('AUTH_RATE_LIMIT_ATTEMPTS', 5),
        'auth_decay_minutes' => env('AUTH_RATE_LIMIT_DECAY', 1),
        'api_attempts' => env('API_RATE_LIMIT_ATTEMPTS', 60),
        'api_decay_minutes' => env('API_RATE_LIMIT_DECAY', 1),
        'general_attempts' => env('GENERAL_RATE_LIMIT_ATTEMPTS', 100),
        'general_decay_minutes' => env('GENERAL_RATE_LIMIT_DECAY', 1),
    ],

    'security' => [
        'enabled' => env('SECURITY_MONITORING_ENABLED', true),
        'log_failed_logins' => env('LOG_FAILED_LOGINS', true),
        'brute_force_threshold' => env('BRUTE_FORCE_THRESHOLD', 5),
        'brute_force_window' => env('BRUTE_FORCE_WINDOW_MINUTES', 5),
        'log_suspicious_activity' => env('LOG_SUSPICIOUS_ACTIVITY', true),
    ],

    'health_checks' => [
        'enabled' => env('HEALTH_CHECKS_ENABLED', true),
        'database_timeout' => env('HEALTH_CHECK_DB_TIMEOUT', 5),
        'cache_timeout' => env('HEALTH_CHECK_CACHE_TIMEOUT', 5),
        'storage_check' => env('HEALTH_CHECK_STORAGE', true),
        'memory_check' => env('HEALTH_CHECK_MEMORY', true),
        'memory_threshold' => env('HEALTH_CHECK_MEMORY_THRESHOLD', 90), // Percentage
    ],

    'alerts' => [
        'enabled' => env('ALERTS_ENABLED', true),
        'email_notifications' => env('ALERT_EMAIL_NOTIFICATIONS', true),
        'slack_notifications' => env('ALERT_SLACK_NOTIFICATIONS', false),
        'webhook_notifications' => env('ALERT_WEBHOOK_NOTIFICATIONS', false),
        'alert_webhook_url' => env('ALERT_WEBHOOK_URL'),
        'alert_email_recipients' => env('ALERT_EMAIL_RECIPIENTS', ''),
    ],

    'uptime_monitoring' => [
        'enabled' => env('UPTIME_MONITORING_ENABLED', true),
        'check_interval' => env('UPTIME_CHECK_INTERVAL_SECONDS', 300), // 5 minutes
        'timeout' => env('UPTIME_CHECK_TIMEOUT_SECONDS', 30),
        'retry_attempts' => env('UPTIME_RETRY_ATTEMPTS', 3),
        'retry_delay' => env('UPTIME_RETRY_DELAY_SECONDS', 60),
    ],
];
