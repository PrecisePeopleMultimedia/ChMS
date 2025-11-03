#!/bin/bash

# ChMS Production Monitoring and Alerting Script
# Monitors system health and sends alerts for critical issues

set -e

# Configuration
LOG_FILE="/var/log/chms-monitoring.log"
ALERT_EMAIL="admin@churchafrica.com"
SLACK_WEBHOOK_URL=""  # Configure if using Slack
SLOW_QUERY_THRESHOLD=1000  # milliseconds
DISK_USAGE_THRESHOLD=80    # percentage
MEMORY_USAGE_THRESHOLD=85  # percentage
CPU_USAGE_THRESHOLD=90     # percentage

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to send email alert
send_email_alert() {
    local subject=$1
    local message=$2
    
    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
        log_message "Email alert sent: $subject"
    else
        log_message "WARNING: mail command not available, cannot send email alert"
    fi
}

# Function to send Slack alert
send_slack_alert() {
    local message=$1
    
    if [ -n "$SLACK_WEBHOOK_URL" ] && command -v curl >/dev/null 2>&1; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 ChMS Alert: $message\"}" \
            "$SLACK_WEBHOOK_URL" >/dev/null 2>&1
        log_message "Slack alert sent: $message"
    fi
}

# Function to send alert (both email and Slack)
send_alert() {
    local level=$1
    local subject=$2
    local message=$3
    
    log_message "$level: $subject - $message"
    
    if [ "$level" = "CRITICAL" ] || [ "$level" = "ERROR" ]; then
        send_email_alert "[$level] ChMS - $subject" "$message"
        send_slack_alert "$subject - $message"
    fi
}

log_message "Starting monitoring check..."

# Check Docker containers health
log_message "Checking Docker containers..."
UNHEALTHY_CONTAINERS=$(docker ps --filter "health=unhealthy" --format "table {{.Names}}" | tail -n +2)
if [ -n "$UNHEALTHY_CONTAINERS" ]; then
    send_alert "CRITICAL" "Unhealthy Containers" "The following containers are unhealthy: $UNHEALTHY_CONTAINERS"
fi

STOPPED_CONTAINERS=$(docker ps -a --filter "status=exited" --filter "name=chms-" --format "table {{.Names}}" | tail -n +2)
if [ -n "$STOPPED_CONTAINERS" ]; then
    send_alert "ERROR" "Stopped Containers" "The following ChMS containers are stopped: $STOPPED_CONTAINERS"
fi

# Check PostgreSQL slow queries
log_message "Checking for slow queries..."
SLOW_QUERIES=$(docker exec chms-postgres-primary psql -U chms_user -d chms_production -t -c "
    SELECT COUNT(*) 
    FROM pg_stat_statements 
    WHERE mean_exec_time > $SLOW_QUERY_THRESHOLD 
    AND calls > 10;
" 2>/dev/null || echo "0")

if [ "$SLOW_QUERIES" -gt 0 ]; then
    send_alert "WARNING" "Slow Queries Detected" "Found $SLOW_QUERIES slow queries (>${SLOW_QUERY_THRESHOLD}ms average)"
fi

# Check database connections
log_message "Checking database connections..."
DB_CONNECTIONS=$(docker exec chms-postgres-primary psql -U chms_user -d chms_production -t -c "
    SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active';
" 2>/dev/null || echo "0")

MAX_CONNECTIONS=$(docker exec chms-postgres-primary psql -U chms_user -d chms_production -t -c "
    SHOW max_connections;
" 2>/dev/null | tr -d ' ' || echo "100")

CONNECTION_USAGE=$((DB_CONNECTIONS * 100 / MAX_CONNECTIONS))
if [ "$CONNECTION_USAGE" -gt 80 ]; then
    send_alert "WARNING" "High Database Connection Usage" "Database connection usage: ${CONNECTION_USAGE}% (${DB_CONNECTIONS}/${MAX_CONNECTIONS})"
fi

# Check disk usage
log_message "Checking disk usage..."
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt "$DISK_USAGE_THRESHOLD" ]; then
    send_alert "CRITICAL" "High Disk Usage" "Disk usage is at ${DISK_USAGE}% (threshold: ${DISK_USAGE_THRESHOLD}%)"
fi

# Check memory usage
log_message "Checking memory usage..."
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "$MEMORY_USAGE" -gt "$MEMORY_USAGE_THRESHOLD" ]; then
    send_alert "WARNING" "High Memory Usage" "Memory usage is at ${MEMORY_USAGE}% (threshold: ${MEMORY_USAGE_THRESHOLD}%)"
fi

# Check CPU usage (5-minute average)
log_message "Checking CPU usage..."
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')
CPU_USAGE_INT=$(echo "$CPU_USAGE" | cut -d'.' -f1)
if [ "$CPU_USAGE_INT" -gt "$CPU_USAGE_THRESHOLD" ]; then
    send_alert "WARNING" "High CPU Usage" "CPU usage is at ${CPU_USAGE}% (threshold: ${CPU_USAGE_THRESHOLD}%)"
fi

# Check Redis connection
log_message "Checking Redis connection..."
if ! docker exec chms-redis-cluster redis-cli ping >/dev/null 2>&1; then
    send_alert "CRITICAL" "Redis Connection Failed" "Cannot connect to Redis cluster"
fi

# Check application health endpoints
log_message "Checking application health..."
for i in 1 2; do
    if ! curl -f -s "http://chms-backend-$i:8000/health" >/dev/null 2>&1; then
        send_alert "ERROR" "Backend Health Check Failed" "Backend instance $i health check failed"
    fi
done

# Check SSL certificate expiration (if SSL is configured)
log_message "Checking SSL certificate..."
if command -v openssl >/dev/null 2>&1; then
    CERT_EXPIRY=$(echo | openssl s_client -servername chms.jerryagenyi.xyz -connect chms.jerryagenyi.xyz:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    if [ -n "$CERT_EXPIRY" ]; then
        EXPIRY_TIMESTAMP=$(date -d "$CERT_EXPIRY" +%s)
        CURRENT_TIMESTAMP=$(date +%s)
        DAYS_UNTIL_EXPIRY=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))
        
        if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
            send_alert "WARNING" "SSL Certificate Expiring Soon" "SSL certificate expires in $DAYS_UNTIL_EXPIRY days"
        fi
    fi
fi

# Check backup status
log_message "Checking backup status..."
LATEST_BACKUP=$(find /var/backups/chms -name "chms_backup_*.sql.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
if [ -n "$LATEST_BACKUP" ]; then
    BACKUP_AGE=$(find "$LATEST_BACKUP" -mtime +1 2>/dev/null)
    if [ -n "$BACKUP_AGE" ]; then
        send_alert "WARNING" "Backup is Outdated" "Latest backup is older than 24 hours: $LATEST_BACKUP"
    fi
else
    send_alert "ERROR" "No Backups Found" "No backup files found in /var/backups/chms"
fi

log_message "Monitoring check completed"

# Generate summary report
echo "=== MONITORING SUMMARY ==="
echo "Date: $(date)"
echo "Containers: $(docker ps --filter 'name=chms-' --format 'table {{.Names}}\t{{.Status}}' | tail -n +2 | wc -l) running"
echo "DB Connections: ${DB_CONNECTIONS}/${MAX_CONNECTIONS} (${CONNECTION_USAGE}%)"
echo "Disk Usage: ${DISK_USAGE}%"
echo "Memory Usage: ${MEMORY_USAGE}%"
echo "CPU Usage: ${CPU_USAGE}%"
echo "Log file: $LOG_FILE"
echo "=========================="
