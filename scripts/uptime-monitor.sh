#!/bin/bash

# ChMS Uptime Monitoring Script
# This script can be run as a cron job to monitor application health

set -e

# Configuration
API_URL="${API_URL:-http://localhost:8000/api/health}"
ALERT_EMAIL="${ALERT_EMAIL:-admin@churchafrica.com}"
LOG_FILE="${LOG_FILE:-/var/log/chms-uptime.log}"
MAX_RETRIES="${MAX_RETRIES:-3}"
RETRY_DELAY="${RETRY_DELAY:-60}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Send alert function
send_alert() {
    local message="$1"
    local status="$2"
    
    log "ALERT: $message"
    
    # Send email alert (requires mail command)
    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "ChMS Health Alert - $status" "$ALERT_EMAIL"
    fi
    
    # Send webhook alert (if configured)
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"ChMS Health Alert: $message\"}" \
            --silent --show-error
    fi
}

# Check health endpoint
check_health() {
    local url="$1"
    local attempt="$2"
    
    log "Health check attempt $attempt for $url"
    
    # Make HTTP request with timeout
    response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json \
        --max-time 30 \
        --connect-timeout 10 \
        "$url" 2>/dev/null || echo "000")
    
    local http_code="${response: -3}"
    local body=$(cat /tmp/health_response.json 2>/dev/null || echo "")
    
    if [ "$http_code" = "200" ]; then
        # Parse JSON response
        if command -v jq >/dev/null 2>&1; then
            local status=$(echo "$body" | jq -r '.status // "unknown"')
            local timestamp=$(echo "$body" | jq -r '.timestamp // "unknown"')
            
            if [ "$status" = "healthy" ]; then
                log "✅ Health check passed - Status: $status"
                return 0
            else
                log "⚠️  Health check degraded - Status: $status"
                return 1
            fi
        else
            log "✅ Health check passed - HTTP $http_code"
            return 0
        fi
    else
        log "❌ Health check failed - HTTP $http_code"
        return 1
    fi
}

# Main monitoring function
monitor() {
    local url="$1"
    local retries=0
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if check_health "$url" $((retries + 1)); then
            log "✅ Service is healthy"
            return 0
        else
            retries=$((retries + 1))
            if [ $retries -lt $MAX_RETRIES ]; then
                log "⏳ Retrying in $RETRY_DELAY seconds... ($retries/$MAX_RETRIES)"
                sleep $RETRY_DELAY
            fi
        fi
    done
    
    # All retries failed
    send_alert "ChMS health check failed after $MAX_RETRIES attempts. URL: $url" "CRITICAL"
    return 1
}

# Check additional endpoints
check_additional_endpoints() {
    local base_url="${API_URL%/api/health}"
    
    # Check monitoring endpoints
    local endpoints=(
        "/api/monitoring/health"
        "/api/monitoring/metrics"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local full_url="$base_url$endpoint"
        log "Checking endpoint: $full_url"
        
        if curl -s --max-time 10 --connect-timeout 5 "$full_url" >/dev/null 2>&1; then
            log "✅ Endpoint $endpoint is responding"
        else
            log "⚠️  Endpoint $endpoint is not responding"
        fi
    done
}

# Performance check
check_performance() {
    local url="$1"
    local start_time=$(date +%s%3N)
    
    if check_health "$url" 1 >/dev/null 2>&1; then
        local end_time=$(date +%s%3N)
        local response_time=$((end_time - start_time))
        
        log "Response time: ${response_time}ms"
        
        # Alert on slow response
        if [ $response_time -gt 5000 ]; then
            send_alert "ChMS response time is slow: ${response_time}ms" "WARNING"
        fi
    fi
}

# Disk space check
check_disk_space() {
    local threshold=90
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -gt "$threshold" ]; then
        send_alert "Disk usage is high: ${usage}% (threshold: ${threshold}%)" "WARNING"
    else
        log "Disk usage: ${usage}%"
    fi
}

# Memory check
check_memory() {
    local threshold=90
    local usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    
    if [ "$usage" -gt "$threshold" ]; then
        send_alert "Memory usage is high: ${usage}% (threshold: ${threshold}%)" "WARNING"
    else
        log "Memory usage: ${usage}%"
    fi
}

# Main execution
main() {
    log "🚀 Starting ChMS uptime monitoring"
    log "API URL: $API_URL"
    log "Alert email: $ALERT_EMAIL"
    log "Max retries: $MAX_RETRIES"
    
    # Check if API URL is accessible
    if ! curl -s --max-time 5 --connect-timeout 3 "$API_URL" >/dev/null 2>&1; then
        send_alert "ChMS API is not accessible at $API_URL" "CRITICAL"
        exit 1
    fi
    
    # Run health checks
    if monitor "$API_URL"; then
        log "✅ All health checks passed"
        
        # Additional checks
        check_additional_endpoints
        check_performance "$API_URL"
        check_disk_space
        check_memory
        
        log "🎉 Monitoring completed successfully"
    else
        log "❌ Health checks failed"
        exit 1
    fi
}

# Handle command line arguments
case "${1:-}" in
    "check")
        main
        ;;
    "test")
        echo "Testing health endpoint: $API_URL"
        check_health "$API_URL" 1
        ;;
    "alerts")
        echo "Testing alert system"
        send_alert "Test alert from ChMS monitoring" "TEST"
        ;;
    *)
        echo "Usage: $0 {check|test|alerts}"
        echo ""
        echo "Commands:"
        echo "  check  - Run full health monitoring"
        echo "  test   - Test health endpoint"
        echo "  alerts - Test alert system"
        echo ""
        echo "Environment variables:"
        echo "  API_URL        - API health endpoint URL"
        echo "  ALERT_EMAIL    - Email for alerts"
        echo "  LOG_FILE       - Log file path"
        echo "  MAX_RETRIES    - Maximum retry attempts"
        echo "  RETRY_DELAY    - Delay between retries (seconds)"
        echo "  WEBHOOK_URL    - Webhook URL for alerts"
        exit 1
        ;;
esac
