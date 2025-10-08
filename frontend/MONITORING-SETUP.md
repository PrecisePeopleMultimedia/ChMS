# Monitoring & Observability Setup

## Frontend Monitoring (Sentry)

### Environment Variables Required

Create a `.env.production` file with the following variables:

```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# API Configuration
VITE_API_URL=https://api.churchafrica.com/api
VITE_BACKEND_URL=https://api.churchafrica.com

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# PWA Configuration
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE=true
```

### Sentry Setup Steps

1. **Create Sentry Project:**
   - Go to [sentry.io](https://sentry.io)
   - Create a new project for "Vue.js"
   - Copy the DSN

2. **Configure Environment:**
   - Add `VITE_SENTRY_DSN` to your production environment
   - Set `SENTRY_AUTH_TOKEN` for source map uploads

3. **Features Enabled:**
   - ✅ Error tracking with stack traces
   - ✅ Performance monitoring (APM)
   - ✅ User session replay (10% of sessions, 100% on errors)
   - ✅ API call performance tracking
   - ✅ Component render performance
   - ✅ User interaction tracking
   - ✅ Offline/online status tracking

### Performance Monitoring

The system automatically tracks:
- API call duration and status
- Component render times
- User interactions
- Navigation performance
- PWA service worker events
- Connectivity changes

### Error Tracking

All errors are automatically captured with:
- Full stack traces
- User context (when logged in)
- Browser information
- Network conditions
- Component state

## Backend Monitoring (Next Phase)

### Required Environment Variables

```bash
# Sentry Laravel
SENTRY_LARAVEL_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_TRACES_SAMPLE_RATE=1.0

# Database
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_PORT=5432
DB_DATABASE=churchafrica
DB_USERNAME=your-username
DB_PASSWORD=your-password

# Cache
CACHE_DRIVER=redis
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
```

## Health Check Endpoint

The system includes an enhanced health check endpoint at `/api/health` that returns:

```json
{
  "status": "healthy|degraded|unhealthy",
  "timestamp": "2025-01-08T10:00:00Z",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": "connected|disconnected",
    "cache": "operational|failed",
    "storage": "writable|readonly"
  }
}
```

## Uptime Monitoring Setup

### Recommended Services

1. **UptimeRobot** (Free tier available)
   - Monitor: `https://api.churchafrica.com/health`
   - Check interval: 5 minutes
   - Alert on: 2 consecutive failures

2. **Pingdom** (Paid service)
   - More advanced monitoring
   - Global monitoring locations
   - Detailed performance metrics

3. **StatusCake** (Free tier available)
   - Simple uptime monitoring
   - Email alerts
   - Basic performance monitoring

### Alert Configuration

- **Email alerts** for downtime
- **SMS alerts** for critical issues
- **Slack/Discord** integration for team notifications
- **Escalation policies** for different severity levels

## Security Monitoring

### Failed Login Tracking

The system tracks:
- Failed login attempts by IP
- Brute force attack detection
- Suspicious activity patterns
- Geographic anomalies

### Rate Limiting

- **Auth endpoints**: 5 requests per minute
- **API endpoints**: 60 requests per minute
- **IP-based blocking** for excessive attempts

## Performance Budgets

### Frontend Targets

- **Bundle size**: < 500KB gzipped (current: 77KB ✅)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s

### Backend Targets

- **API response time**: < 500ms (95th percentile)
- **Database query time**: < 100ms (95th percentile)
- **Cache hit rate**: > 90%

## Monitoring Dashboard

### Key Metrics to Track

1. **Availability**: 99.9% uptime target
2. **Performance**: Response times, bundle sizes
3. **Errors**: Error rates, error types
4. **Usage**: Active users, feature adoption
5. **Security**: Failed logins, suspicious activity

### Alert Thresholds

- **Critical**: Service down, security breach
- **High**: Performance degradation, high error rate
- **Medium**: Slow responses, increased load
- **Low**: Minor issues, maintenance windows

## Implementation Status

- ✅ **Frontend Sentry**: Configured and ready
- ✅ **Performance Monitoring**: Implemented
- ✅ **API Monitoring**: Automatic tracking
- ✅ **Health Check**: Enhanced endpoint
- ⏳ **Backend Sentry**: Pending implementation
- ⏳ **Uptime Monitoring**: Pending setup
- ⏳ **Security Monitoring**: Pending implementation
