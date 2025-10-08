# ChMS Monitoring & Observability Setup

This document outlines the comprehensive monitoring and observability infrastructure implemented for the ChurchAfrica Church Management System.

## Overview

The monitoring system provides:
- **Error Tracking**: Sentry integration for frontend and backend
- **Performance Monitoring**: APM with Core Web Vitals tracking
- **Health Checks**: Comprehensive system health monitoring
- **Security Monitoring**: Failed login tracking, rate limiting, suspicious activity detection
- **Centralized Logging**: Structured logging with performance metrics
- **Real-time Dashboard**: Frontend monitoring dashboard

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Vue 3)       │    │   (Laravel 11)  │    │   Services      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Sentry Vue    │    │ • Sentry Laravel│    │ • Sentry.io     │
│ • Performance   │    │ • Health Checks │    │ • UptimeRobot   │
│ • APM Tracking  │    │ • Rate Limiting │    │ • Pingdom       │
│ • Error Tracking│    │ • Security Logs │    │ • New Relic     │
│ • Monitoring UI │    │ • Performance   │    │ • DataDog       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Monitoring

### Sentry Configuration

**File**: `frontend/src/main.ts`
```typescript
import * as Sentry from '@sentry/vue'

if (import.meta.env.PROD) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
  })
}
```

### Performance Monitoring

**File**: `frontend/src/composables/usePerformance.ts`

Tracks:
- Core Web Vitals (LCP, FID, CLS)
- API response times
- Memory usage
- Network conditions
- User interactions

### API Monitoring

**File**: `frontend/src/utils/apiMonitor.ts`

Automatically tracks:
- Request/response times
- Error rates
- Slow API calls (>1000ms)
- HTTP status codes

### Monitoring Dashboard

**File**: `frontend/src/components/monitoring/MonitoringDashboard.vue`

Real-time dashboard showing:
- Connection status
- Performance metrics
- Backend health
- Memory usage

## Backend Monitoring

### Sentry Configuration

**File**: `backend/config/sentry.php`

Comprehensive Sentry configuration with:
- Error tracking
- Performance monitoring
- Breadcrumb collection
- SQL query tracing
- Queue job monitoring

### Health Checks

**Endpoint**: `/api/health`

Returns:
```json
{
  "status": "healthy|degraded",
  "timestamp": "2025-01-08T10:00:00Z",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "connected|disconnected",
      "response_time_ms": 15.2
    },
    "cache": {
      "status": "operational|failed",
      "driver": "redis"
    },
    "storage": {
      "status": "writable|readonly",
      "driver": "local"
    },
    "memory": {
      "status": "healthy|unhealthy",
      "usage_mb": 45.2,
      "peak_mb": 67.8,
      "limit_mb": 128,
      "usage_percentage": 35.3
    }
  },
  "uptime": {
    "started_at": "2025-01-08T09:00:00Z",
    "memory_usage": 47423488,
    "memory_peak": 71172096
  }
}
```

### Monitoring Endpoints

| Endpoint | Description | Response |
|----------|-------------|----------|
| `/api/monitoring/health` | System health status | Health data |
| `/api/monitoring/metrics` | System metrics | Performance data |
| `/api/monitoring/logs` | Application logs | Log entries |
| `/api/monitoring/performance` | Performance statistics | Performance data |
| `/api/monitoring/security` | Security alerts | Security data |

### Security Monitoring

**Features**:
- Failed login tracking
- Brute force detection
- Rate limiting
- Suspicious activity detection
- Security headers

**Rate Limiting**:
- Auth endpoints: 5 attempts/minute
- API endpoints: 60 requests/minute
- General endpoints: 100 requests/minute

### Logging Middleware

**File**: `backend/app/Http/Middleware/LoggingMiddleware.php`

Logs:
- Request details (method, URL, IP, user agent)
- Response details (status, response time, memory usage)
- Slow requests (>1000ms)
- Error responses (4xx, 5xx)

### Security Headers

**File**: `backend/app/Http/Middleware/SecurityHeadersMiddleware.php`

Adds:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security (production)

## Environment Configuration

### Frontend Environment Variables

```bash
# .env.production
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_API_URL=https://api.churchafrica.com
VITE_ENABLE_MONITORING=true
```

### Backend Environment Variables

```bash
# .env.production
SENTRY_LARAVEL_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_RELEASE=1.0.0
SENTRY_ENVIRONMENT=production
SENTRY_SAMPLE_RATE=1.0
SENTRY_TRACES_SAMPLE_RATE=1.0

# Monitoring
PERFORMANCE_MONITORING_ENABLED=true
SECURITY_MONITORING_ENABLED=true
HEALTH_CHECKS_ENABLED=true
RATE_LIMITING_ENABLED=true

# Alerts
ALERTS_ENABLED=true
ALERT_EMAIL_NOTIFICATIONS=true
ALERT_EMAIL_RECIPIENTS=admin@churchafrica.com
```

## External Monitoring Services

### Uptime Monitoring

**Recommended Services**:
- UptimeRobot (free tier: 50 monitors)
- Pingdom (paid)
- StatusCake (free tier: 10 monitors)

**Configuration**:
```
Monitor URL: https://api.churchafrica.com/health
Check Interval: 5 minutes
Timeout: 30 seconds
Alert on: 2 consecutive failures
```

### Error Tracking

**Sentry Setup**:
1. Create Sentry account
2. Create new project for ChMS
3. Get DSN from project settings
4. Configure environment variables
5. Deploy with monitoring enabled

### Performance Monitoring

**Additional APM Options**:
- New Relic (comprehensive APM)
- DataDog (infrastructure + APM)
- AppDynamics (enterprise APM)

## Monitoring Dashboard

### Frontend Dashboard

Access: `/monitoring` (when implemented)

**Features**:
- Real-time system status
- Performance metrics
- Error rates
- Memory usage
- Network conditions

### Backend Metrics

**Available Metrics**:
- Request/response times
- Error rates
- Memory usage
- Database performance
- Cache hit rates
- Queue job performance

## Alerting Configuration

### Sentry Alerts

**Recommended Alert Rules**:
- Error rate > 5% in 5 minutes
- Response time > 2 seconds
- Memory usage > 80%
- Database connection failures

### Custom Alerts

**Email Notifications**:
```php
// Configure in config/monitoring.php
'alerts' => [
    'enabled' => true,
    'email_notifications' => true,
    'alert_email_recipients' => 'admin@churchafrica.com',
],
```

### Slack Integration

**Webhook Configuration**:
```php
'alerts' => [
    'slack_notifications' => true,
    'alert_webhook_url' => 'https://hooks.slack.com/services/...',
],
```

## Performance Optimization

### Frontend Optimizations

1. **Bundle Analysis**:
   ```bash
   npm run build
   npx vite-bundle-analyzer dist
   ```

2. **Core Web Vitals**:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1

3. **Memory Management**:
   - Monitor memory usage
   - Clean up event listeners
   - Optimize image loading

### Backend Optimizations

1. **Database Performance**:
   - Monitor slow queries
   - Optimize indexes
   - Connection pooling

2. **Cache Performance**:
   - Monitor hit rates
   - Optimize cache keys
   - TTL management

3. **Memory Usage**:
   - Monitor memory leaks
   - Optimize data structures
   - Garbage collection tuning

## Troubleshooting

### Common Issues

1. **Sentry Not Reporting**:
   - Check DSN configuration
   - Verify network connectivity
   - Check Sentry project settings

2. **Health Checks Failing**:
   - Check database connectivity
   - Verify cache configuration
   - Check storage permissions

3. **Performance Issues**:
   - Monitor slow queries
   - Check memory usage
   - Analyze request patterns

### Debug Commands

```bash
# Check health status
curl https://api.churchafrica.com/health

# View logs
tail -f storage/logs/laravel.log

# Check Sentry configuration
php artisan tinker
>>> config('sentry.dsn')
```

## Security Considerations

### Data Privacy

- No PII in logs
- Sanitized request data
- Secure error reporting
- GDPR compliance

### Access Control

- Monitoring endpoints protected
- Rate limiting enabled
- IP whitelisting (if needed)
- Authentication required

### Data Retention

- Log retention: 30 days
- Metrics retention: 90 days
- Error data: 1 year
- Performance data: 6 months

## Maintenance

### Regular Tasks

1. **Weekly**:
   - Review error reports
   - Check performance metrics
   - Update monitoring rules

2. **Monthly**:
   - Analyze trends
   - Optimize queries
   - Update dependencies

3. **Quarterly**:
   - Review alert thresholds
   - Update monitoring tools
   - Security audit

### Monitoring Checklist

- [ ] Sentry configured and reporting
- [ ] Health checks responding
- [ ] Performance metrics collected
- [ ] Security monitoring active
- [ ] Alerts configured
- [ ] Dashboard accessible
- [ ] Logs being collected
- [ ] Rate limiting working
- [ ] Security headers present
- [ ] Uptime monitoring active

## Cost Estimation

### Sentry
- Free tier: 5,000 errors/month
- Pro: $26/month for 50,000 errors
- Enterprise: Custom pricing

### Uptime Monitoring
- UptimeRobot: Free (50 monitors)
- Pingdom: $15/month
- StatusCake: Free (10 monitors)

### Additional APM
- New Relic: $25/month
- DataDog: $15/month
- AppDynamics: Custom pricing

**Total Estimated Cost**: $50-100/month for comprehensive monitoring

## Next Steps

1. **Immediate** (Week 1):
   - Configure Sentry DSN
   - Set up uptime monitoring
   - Test health checks

2. **Short-term** (Month 1):
   - Implement alerting
   - Create monitoring dashboard
   - Optimize performance

3. **Long-term** (Quarter 1):
   - Advanced APM
   - Custom metrics
   - Automated responses

This monitoring setup provides comprehensive observability for the ChMS application, ensuring production readiness and operational excellence.
