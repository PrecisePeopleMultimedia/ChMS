#!/bin/bash

# ChMS Production Backup Script
# Automated daily PostgreSQL backups with 30-day retention

set -e

# Configuration
BACKUP_DIR="/var/backups/chms"
DB_NAME="chms_production"
DB_USER="chms_user"
DB_HOST="postgres-primary"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="chms_backup_${DATE}.sql"
LOG_FILE="/var/log/chms-backup.log"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to send notification (implement as needed)
send_notification() {
    local status=$1
    local message=$2
    # TODO: Implement notification system (email, Slack, etc.)
    log_message "NOTIFICATION: $status - $message"
}

log_message "Starting backup process..."

# Create database backup
log_message "Creating database backup: $BACKUP_FILE"
if docker exec chms-postgres-primary pg_dump -U "$DB_USER" -h localhost "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILE"; then
    log_message "Database backup completed successfully"
    
    # Compress backup
    log_message "Compressing backup file..."
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    # Verify backup integrity
    log_message "Verifying backup integrity..."
    if gunzip -t "$BACKUP_DIR/$BACKUP_FILE"; then
        log_message "Backup integrity verified"
        
        # Calculate backup size
        BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
        log_message "Backup size: $BACKUP_SIZE"
        
        send_notification "SUCCESS" "Backup completed successfully. Size: $BACKUP_SIZE"
    else
        log_message "ERROR: Backup integrity check failed"
        send_notification "ERROR" "Backup integrity check failed"
        exit 1
    fi
else
    log_message "ERROR: Database backup failed"
    send_notification "ERROR" "Database backup failed"
    exit 1
fi

# Clean up old backups (retain only last 30 days)
log_message "Cleaning up old backups (retention: $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "chms_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
REMAINING_BACKUPS=$(find "$BACKUP_DIR" -name "chms_backup_*.sql.gz" -type f | wc -l)
log_message "Cleanup completed. Remaining backups: $REMAINING_BACKUPS"

# Backup application files (optional)
log_message "Creating application files backup..."
APP_BACKUP_FILE="chms_app_backup_${DATE}.tar.gz"
if tar -czf "$BACKUP_DIR/$APP_BACKUP_FILE" \
    --exclude='node_modules' \
    --exclude='vendor' \
    --exclude='storage/logs' \
    --exclude='storage/framework/cache' \
    --exclude='storage/framework/sessions' \
    --exclude='storage/framework/views' \
    /var/www/html; then
    log_message "Application files backup completed"
else
    log_message "WARNING: Application files backup failed"
fi

# Test restore procedure (monthly)
DAY_OF_MONTH=$(date +%d)
if [ "$DAY_OF_MONTH" = "01" ]; then
    log_message "Running monthly restore test..."
    
    # Create test database
    TEST_DB="chms_restore_test_$(date +%Y%m%d)"
    
    if docker exec chms-postgres-primary createdb -U "$DB_USER" "$TEST_DB"; then
        log_message "Test database created: $TEST_DB"
        
        # Restore backup to test database
        if gunzip -c "$BACKUP_DIR/$BACKUP_FILE" | docker exec -i chms-postgres-primary psql -U "$DB_USER" -d "$TEST_DB"; then
            log_message "Restore test completed successfully"
            
            # Verify data integrity
            TABLE_COUNT=$(docker exec chms-postgres-primary psql -U "$DB_USER" -d "$TEST_DB" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
            log_message "Restored database contains $TABLE_COUNT tables"
            
            send_notification "SUCCESS" "Monthly restore test passed. Tables: $TABLE_COUNT"
        else
            log_message "ERROR: Restore test failed"
            send_notification "ERROR" "Monthly restore test failed"
        fi
        
        # Clean up test database
        docker exec chms-postgres-primary dropdb -U "$DB_USER" "$TEST_DB"
        log_message "Test database cleaned up"
    else
        log_message "ERROR: Failed to create test database"
        send_notification "ERROR" "Failed to create test database for restore test"
    fi
fi

log_message "Backup process completed"

# Display backup summary
echo "=== BACKUP SUMMARY ==="
echo "Date: $(date)"
echo "Backup file: $BACKUP_FILE"
echo "Backup size: $BACKUP_SIZE"
echo "Retention: $RETENTION_DAYS days"
echo "Remaining backups: $REMAINING_BACKUPS"
echo "Log file: $LOG_FILE"
echo "======================="
