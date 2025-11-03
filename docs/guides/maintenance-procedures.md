# ChMS Maintenance Procedures

Comprehensive maintenance procedures for ChMS production environments including backups, updates, monitoring, and disaster recovery.

## Table of Contents

1. [Maintenance Overview](#maintenance-overview)
2. [Automated Backups](#automated-backups)
3. [System Updates](#system-updates)
4. [Database Maintenance](#database-maintenance)
5. [Performance Monitoring](#performance-monitoring)
6. [Security Maintenance](#security-maintenance)
7. [Disaster Recovery](#disaster-recovery)
8. [Maintenance Schedule](#maintenance-schedule)
9. [Maintenance Logs](#maintenance-logs)

---

## Maintenance Overview

### Maintenance Responsibilities

Production maintenance includes:

- **Daily**: Monitor system health, review error logs, check backups
- **Weekly**: Database optimisation, log rotation, security updates
- **Monthly**: Full backups, performance review, capacity planning
- **Quarterly**: Major updates, disaster recovery testing, security audit

### Maintenance Principles

1. **Minimal Downtime**: Schedule maintenance during low-traffic periods
2. **Testing First**: Test all changes in staging before production
3. **Backup Before Changes**: Always backup before maintenance
4. **Documentation**: Document all maintenance activities
5. **Rollback Plan**: Have rollback procedures ready

---

## Automated Backups

### Backup Configuration

#### Database Backups

**Using PostgreSQL Native Backups**

```bash
# Create backup script: /usr/local/bin/backup-chms-db.sh
#!/bin/bash
BACKUP_DIR="/var/backups/chms"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="chms_production"
DB_USER="chms_user"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -U $DB_USER -h localhost -F c -b -v -f "$BACKUP_DIR/db_${DATE}.dump" $DB_NAME

# Compress backup
gzip "$BACKUP_DIR/db_${DATE}.dump"

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_*.dump.gz" -mtime +30 -delete

# Log backup completion
echo "$(date): Database backup completed: db_${DATE}.dump.gz" >> /var/log/chms-backup.log
```

**Schedule with Cron**

```bash
# Edit crontab
sudo crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-chms-db.sh
```

#### File Backups

**Backup Script for Application Files**

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/chms"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/chms-production"

mkdir -p $BACKUP_DIR

# Backup uploaded files
tar -czf "$BACKUP_DIR/files_${DATE}.tar.gz" \
    -C $APP_DIR/backend storage/app/public \
    --exclude="*.tmp" --exclude="*.cache"

# Remove backups older than 14 days
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +14 -delete

echo "$(date): Files backup completed: files_${DATE}.tar.gz" >> /var/log/chms-backup.log
```

#### Cloud Backup Integration

**AWS S3 Backup**

```bash
#!/bin/bash
# Install AWS CLI: sudo apt install awscli
# Configure: aws configure

BACKUP_DIR="/var/backups/chms"
S3_BUCKET="chms-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Upload database backup
aws s3 cp "$BACKUP_DIR/db_${DATE}.dump.gz" \
    "s3://${S3_BUCKET}/database/db_${DATE}.dump.gz"

# Upload files backup
aws s3 cp "$BACKUP_DIR/files_${DATE}.tar.gz" \
    "s3://${S3_BUCKET}/files/files_${DATE}.tar.gz"

# Remove local backups after successful upload (optional)
# rm "$BACKUP_DIR/db_${DATE}.dump.gz"
# rm "$BACKUP_DIR/files_${DATE}.tar.gz"
```

### Backup Verification

#### Daily Verification Script

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/chms"
DATE=$(date +%Y%m%d)

# Check if today's backup exists
if [ -f "$BACKUP_DIR/db_${DATE}*.dump.gz" ]; then
    echo "✓ Database backup found for $DATE"
    # Test backup integrity
    gunzip -t "$BACKUP_DIR/db_${DATE}"*.dump.gz
    if [ $? -eq 0 ]; then
        echo "✓ Backup integrity verified"
    else
        echo "✗ Backup integrity check failed"
        # Send alert
        mail -s "ChMS Backup Verification Failed" admin@example.com
    fi
else
    echo "✗ No backup found for $DATE"
    # Send alert
    mail -s "ChMS Backup Missing" admin@example.com
fi
```

#### Monthly Backup Restoration Test

1. **Select backup** from previous month
2. **Restore to test environment**
3. **Verify data integrity**:
   ```bash
   # Restore database
   pg_restore -U chms_user -d chms_test -c "$BACKUP_DIR/db_YYYYMMDD.dump.gz"
   
   # Verify record counts
   psql -U chms_user -d chms_test -c "SELECT COUNT(*) FROM members;"
   ```
4. **Test application** functionality
5. **Document results** in maintenance log

---

## System Updates

### Update Procedures

#### Pre-Update Checklist

- [ ] Review update release notes
- [ ] Test update in staging environment
- [ ] Backup database and files
- [ ] Notify users of maintenance window
- [ ] Prepare rollback plan
- [ ] Check dependencies (PHP, Node.js versions)

#### Application Updates

**Laravel Backend Update**

```bash
# 1. Put application in maintenance mode
cd /var/www/chms-production/backend
php artisan down --message="System maintenance in progress"

# 2. Backup current version
cp -r . ../backup-$(date +%Y%m%d)

# 3. Update code
git fetch origin
git checkout main
git pull origin main

# 4. Update dependencies
composer install --optimize-autoloader --no-dev

# 5. Run migrations
php artisan migrate --force

# 6. Clear and rebuild caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 7. Test application
php artisan up
# Verify key endpoints work

# 8. Monitor for errors
tail -f storage/logs/laravel.log
```

**Vue Frontend Update**

```bash
# 1. Navigate to frontend
cd /var/www/chms-production/frontend

# 2. Backup current build
cp -r dist ../frontend-backup-$(date +%Y%m%d)

# 3. Update code
git fetch origin
git checkout main
git pull origin main

# 4. Update dependencies
npm ci

# 5. Build for production
npm run build -- --mode production

# 6. Test build
# Check dist/ directory exists and contains files

# 7. Restart web server (if needed)
sudo systemctl reload nginx
```

#### Dependency Updates

**PHP/Composer Updates**

```bash
# Check for outdated packages
cd backend
composer outdated

# Update specific package
composer update vendor/package

# Update all packages (careful!)
composer update

# Test after updates
php artisan test
```

**Node.js/npm Updates**

```bash
# Check for outdated packages
cd frontend
npm outdated

# Update specific package
npm update package-name

# Update all packages (careful!)
npm update

# Test after updates
npm run test
```

### Rollback Procedures

#### Application Rollback

```bash
# 1. Put in maintenance mode
php artisan down --message="Rolling back update"

# 2. Restore previous version
cd /var/www/chms-production
rm -rf backend frontend
mv backup-YYYYMMDD backend
mv frontend-backup-YYYYMMDD frontend

# 3. Restore database (if schema changed)
pg_restore -U chms_user -d chms_production -c "$BACKUP_DIR/db_YYYYMMDD.dump.gz"

# 4. Clear caches
cd backend
php artisan config:clear
php artisan cache:clear

# 5. Restore service
php artisan up
```

---

## Database Maintenance

### Regular Database Tasks

#### Daily Tasks

**Check Database Size**

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('chms_production'));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Monitor Active Connections**

```sql
SELECT count(*) FROM pg_stat_activity WHERE datname = 'chms_production';
```

#### Weekly Tasks

**VACUUM and ANALYZE**

```bash
# Auto-vacuum is enabled, but manual vacuum for large tables
psql -U chms_user -d chms_production -c "VACUUM ANALYZE;"

# Vacuum specific large table
psql -U chms_user -d chms_production -c "VACUUM ANALYZE attendance;"
```

**Update Query Statistics**

```sql
ANALYZE;
```

#### Monthly Tasks

**Rebuild Indexes**

```sql
-- Reindex database
REINDEX DATABASE chms_production;

-- Or reindex specific table
REINDEX TABLE members;
REINDEX TABLE attendance;
```

**Check for Bloat**

```sql
-- Check table bloat
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_dead_tup,
    n_live_tup
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

### Database Optimisation

#### Query Performance

**Identify Slow Queries**

```sql
-- Enable pg_stat_statements (if not already)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**Index Analysis**

```sql
-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
-- Low idx_scan may indicate unused indexes
```

#### Archiving Old Data

**Archive Old Attendance Records**

```sql
-- Create archive table
CREATE TABLE attendance_archive (LIKE attendance INCLUDING ALL);

-- Move old records (> 2 years)
INSERT INTO attendance_archive
SELECT * FROM attendance
WHERE checked_in_at < NOW() - INTERVAL '2 years';

-- Delete archived records (after verification)
DELETE FROM attendance
WHERE checked_in_at < NOW() - INTERVAL '2 years';
```

---

## Performance Monitoring

### Monitoring Tools

#### Application Monitoring

**Laravel Telescope** (if enabled)

```bash
# Access at: https://your-domain.com/telescope
# Monitor:
# - Requests
# - Queries
# - Jobs
# - Events
```

**Application Logs**

```bash
# Monitor error logs
tail -f /var/www/chms-production/backend/storage/logs/laravel.log

# Check for errors
grep -i error /var/www/chms-production/backend/storage/logs/laravel.log
```

#### Server Monitoring

**System Resources**

```bash
# CPU and memory usage
top
htop

# Disk usage
df -h
du -sh /var/www/chms-production/*

# Network activity
iftop
```

**Database Monitoring**

```sql
-- Active queries
SELECT pid, usename, state, query_start, query
FROM pg_stat_activity
WHERE state = 'active'
AND datname = 'chms_production';

-- Database locks
SELECT * FROM pg_locks WHERE NOT granted;
```

### Performance Alerts

#### Set Up Monitoring Alerts

```bash
# Example: Alert on high CPU
#!/bin/bash
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
    mail -s "High CPU Alert" admin@example.com <<EOF
    CPU usage is at ${CPU_USAGE}%
EOF
fi
```

---

## Security Maintenance

### Security Updates

#### Operating System Updates

```bash
# Update package lists
sudo apt update

# Security updates only
sudo apt upgrade -y --security

# Or full system update
sudo apt upgrade -y
```

#### PHP Updates

```bash
# Check PHP version
php -v

# Update PHP (follow Laravel requirements)
# Check Laravel version compatibility first
```

#### PostgreSQL Updates

```bash
# Check PostgreSQL version
psql --version

# Update PostgreSQL (test in staging first!)
sudo apt update
sudo apt upgrade postgresql-16
```

### Security Scanning

#### Dependency Scanning

```bash
# PHP dependencies
cd backend
composer audit

# Node.js dependencies
cd frontend
npm audit

# Fix vulnerabilities
npm audit fix
```

#### Application Security

```bash
# Run security checks
cd backend
php artisan security:check

# Review security logs
tail -f storage/logs/security.log
```

### SSL Certificate Maintenance

#### Let's Encrypt Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew

# Auto-renewal (should be automatic via cron)
# Check: sudo crontab -l | grep certbot
```

---

## Disaster Recovery

### Recovery Scenarios

#### Complete System Failure

**Recovery Steps**

1. **Provision New Server**
   - Install operating system
   - Install required software (PHP, PostgreSQL, Nginx)
   - Configure firewall and security

2. **Restore Database**
   ```bash
   # Download latest backup from cloud storage
   aws s3 cp s3://chms-backups/database/db_YYYYMMDD.dump.gz ./
   
   # Restore database
   gunzip db_YYYYMMDD.dump.gz
   pg_restore -U chms_user -d chms_production -c db_YYYYMMDD.dump
   ```

3. **Restore Application**
   ```bash
   # Clone repository
   git clone https://github.com/PrecisePeopleMultimedia/ChMS.git
   cd ChMS
   
   # Restore files
   aws s3 cp s3://chms-backups/files/files_YYYYMMDD.tar.gz ./
   tar -xzf files_YYYYMMDD.tar.gz
   
   # Configure environment
   cp .env.example .env
   # Edit .env with production settings
   
   # Install dependencies
   composer install --optimize-autoloader --no-dev
   npm ci && npm run build
   
   # Configure application
   php artisan key:generate
   php artisan config:cache
   ```

4. **Restore SSL Certificate**
   ```bash
   certbot --nginx -d your-domain.com
   ```

5. **Verify System**
   - Test login
   - Test database connectivity
   - Test file uploads
   - Review application logs

#### Database Corruption

**Recovery Steps**

1. **Stop Application**
   ```bash
   php artisan down
   ```

2. **Restore from Backup**
   ```bash
   # Use most recent backup
   pg_restore -U chms_user -d chms_production -c "$BACKUP_DIR/db_YYYYMMDD.dump.gz"
   ```

3. **Verify Data Integrity**
   ```sql
   -- Check record counts
   SELECT COUNT(*) FROM members;
   SELECT COUNT(*) FROM attendance;
   ```

4. **Restart Application**
   ```bash
   php artisan up
   ```

#### Partial Data Loss

**Recovery Steps**

1. **Identify Lost Data**
   - Check application logs
   - Review user reports
   - Query database for missing records

2. **Restore Specific Tables**
   ```sql
   -- Extract specific table from backup
   pg_restore -U chms_user -d chms_production \
       -t members "$BACKUP_DIR/db_YYYYMMDD.dump.gz"
   ```

3. **Merge Data** (if needed)
   - Export current data
   - Compare with backup
   - Merge missing records

---

## Maintenance Schedule

### Recommended Schedule

#### Daily (Automated)
- Database backups (2 AM)
- Log rotation
- Health checks
- Backup verification

#### Weekly (Scheduled)
- Database VACUUM and ANALYZE
- Security updates check
- Performance review
- Log cleanup

#### Monthly (Manual)
- Full system backup verification
- Disaster recovery test
- Performance optimisation
- Capacity planning review
- Security audit

#### Quarterly
- Major system updates
- Security patches
- Infrastructure review
- Documentation update

### Maintenance Log Template

```
Date: YYYY-MM-DD
Time: HH:MM
Performed By: [Name]
Maintenance Type: [Update/Backup/Optimisation/etc.]

Activities:
- [Activity 1]
- [Activity 2]

Issues Encountered:
- [Issue description]

Resolution:
- [How issue was resolved]

Verification:
- [How system was verified after maintenance]

Next Steps:
- [Follow-up tasks]
```

---

## Maintenance Logs

### Log Maintenance

**Log Rotation**

```bash
# Configure logrotate: /etc/logrotate.d/chms
/var/www/chms-production/backend/storage/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        php artisan log:clear
    endscript
}
```

**Log Cleanup**

```bash
# Remove old logs (> 30 days)
find /var/www/chms-production/backend/storage/logs \
    -name "*.log" -mtime +30 -delete
```

---

## Quick Reference

### Maintenance Commands

```bash
# Database backup
pg_dump -U chms_user -h localhost -F c -f backup.dump chms_production

# Database restore
pg_restore -U chms_user -d chms_production -c backup.dump

# Put in maintenance mode
php artisan down --message="Scheduled maintenance"

# Clear caches
php artisan config:clear && php artisan cache:clear

# Check system health
curl https://your-domain.com/api/health

# View logs
tail -f storage/logs/laravel.log
```

### Emergency Contacts

- **System Administrator**: [Contact]
- **Database Administrator**: [Contact]
- **Hosting Provider**: [Contact]
- **Backup Storage**: [Credentials/Location]

---

**Last Updated**: {{ date }}  
**Version**: 1.0.0  
**Related Documentation**: 
- [Installation Guide](./installation-guide.md)
- [Admin Guide](./admin-guide.md)
- [Troubleshooting Guide](../operations/troubleshooting.md)

