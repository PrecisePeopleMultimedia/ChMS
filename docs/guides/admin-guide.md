# ChMS Administrator Guide

Complete administrative guide for ChMS system administrators covering system configuration, user management, security, and operational procedures.

## Table of Contents

1. [Administrator Overview](#administrator-overview)
2. [User & Role Management](#user--role-management)
3. [Organization Configuration](#organization-configuration)
4. [System Settings](#system-settings)
5. [Security Configuration](#security-configuration)
6. [Data Management](#data-management)
7. [Backup & Recovery](#backup--recovery)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting for Admins](#troubleshooting-for-admins)
10. [Advanced Configuration](#advanced-configuration)

---

## Administrator Overview

### Administrator Responsibilities

As a ChMS administrator, you're responsible for:

- **User Management**: Creating accounts, managing roles, resetting passwords
- **System Configuration**: Configuring settings, custom fields, workflows
- **Data Integrity**: Ensuring data accuracy, managing duplicates, cleanup
- **Security**: Managing security settings, access controls, audit logs
- **Performance**: Monitoring system performance, optimising settings
- **Backups**: Ensuring backups run, testing recovery procedures
- **Support**: Assisting users, troubleshooting issues

### Administrator Access Levels

#### Super Admin
- Full system access
- All organization management
- System-wide configuration
- User creation and deletion

#### Organization Admin
- Full access to assigned organization
- Member and data management
- Organization settings
- User management within organization

#### Staff Admin
- Limited administrative access
- Member management
- Attendance recording
- Report generation

### Initial Setup Checklist

- [ ] Create admin user account
- [ ] Configure organization profile
- [ ] Set up email/SMTP settings
- [ ] Configure service types
- [ ] Set up custom attributes
- [ ] Configure member badges
- [ ] Set up user roles and permissions
- [ ] Test backup procedures
- [ ] Configure monitoring
- [ ] Review security settings

---

## User & Role Management

### Creating Users

#### Standard User Creation

1. Go to **Administration → Users → Add User**
2. Enter user details:
   - **Name**: Full name
   - **Email**: Valid email address (must be unique)
   - **Password**: Strong password (or auto-generate)
   - **Role**: Select role (Admin, Staff, Member)
   - **Organization**: Assign to organization
3. Configure permissions (if custom roles)
4. Set account options:
   - **Require password change**: Force password change on first login
   - **Email verification**: Send verification email
   - **Active status**: Enable/disable account
5. Click **"Create User"**

#### Bulk User Import

1. Go to **Administration → Users → Import Users**
2. Download template (CSV/Excel)
3. Fill in user data:
   - Name, email, role, organization
4. Upload file
5. Review import preview
6. Map fields if needed
7. Confirm import

### Managing User Roles

#### Available Roles

- **Super Admin**: Full system access
- **Organization Admin**: Full organization access
- **Staff**: Member management, attendance, reports
- **Member**: View own data, limited access
- **Guest**: Read-only access

#### Creating Custom Roles

1. Go to **Administration → Roles → Create Role**
2. Define role:
   - **Name**: Role name
   - **Description**: Purpose of role
3. Set permissions:
   - Member management (view, create, edit, delete)
   - Attendance (view, record, edit)
   - Reports (view, export, create)
   - System settings (view, edit)
4. Save role
5. Assign to users as needed

#### Editing User Accounts

1. Go to **Administration → Users**
2. Find user
3. Click **"Edit"**
4. Update:
   - Personal information
   - Email address
   - Role/permissions
   - Account status
5. Save changes

### Password Management

#### Resetting User Passwords

1. Go to **Administration → Users**
2. Find user
3. Click **"Actions" → "Reset Password"**
4. Choose method:
   - **Email reset link**: Send to user's email
   - **Temporary password**: Generate temporary password
   - **Set new password**: Admin sets directly
5. Confirm action

#### Password Policies

Configure in **Administration → Security → Password Policies**:

- **Minimum length**: 8+ characters (recommended: 12)
- **Complexity requirements**: 
  - Require uppercase
  - Require lowercase
  - Require numbers
  - Require special characters
- **Password expiration**: Days until password expires
- **Password history**: Prevent reuse of last N passwords

### User Account Management

#### Deactivating Users

1. Go to **Administration → Users**
2. Find user
3. Click **"Actions" → "Deactivate"**
4. Confirm deactivation
5. User can no longer log in
6. User data remains in system

#### Reactivating Users

1. Go to **Administration → Users → Inactive**
2. Find user
3. Click **"Actions" → "Reactivate"**
4. User can log in again

#### Deleting Users (Use with Caution)

1. Go to **Administration → Users**
2. Find user
3. Click **"Actions" → "Delete"**
4. **Warning**: This permanently removes user account
5. **Note**: User's data may need to be reassigned
6. Confirm deletion

#### Audit Logs

View user activity:
1. Go to **Administration → Audit Logs**
2. Filter by:
   - User
   - Action type (login, data change, etc.)
   - Date range
3. Review logs for:
   - Login attempts
   - Data modifications
   - Permission changes
   - System access

---

## Organization Configuration

### Organization Profile

#### Basic Information

1. Go to **Administration → Organization → Profile**
2. Update:
   - **Organization Name**: Official name
   - **Display Name**: Public display name
   - **Slug**: URL-friendly identifier
   - **Description**: About the organization
   - **Logo**: Upload organization logo
3. Save changes

#### Contact Information

1. Go to **Administration → Organization → Contact**
2. Update:
   - **Primary Address**: Street address
   - **City, State, Postal Code**: Location details
   - **Country**: Select country
   - **Phone**: Primary phone number
   - **Email**: Contact email
   - **Website**: Organization website
   - **Social Media**: Links to social profiles
3. Save changes

#### Settings

1. Go to **Administration → Organization → Settings**
2. Configure:
   - **Time Zone**: Organization time zone
   - **Date Format**: Preferred date format
   - **Currency**: For financial features (if enabled)
   - **Language**: Default language
   - **Public Access**: Enable/disable public features
3. Save changes

### Custom Member Attributes

#### Creating Custom Attributes

1. Go to **Administration → Custom Attributes → Add Attribute**
2. Define attribute:
   - **Name**: Attribute name (e.g., "Baptism Date")
   - **Slug**: System identifier
   - **Type**: 
     - Text
     - Number
     - Date
     - Boolean (Yes/No)
     - Select (dropdown)
     - Multi-select
     - URL
     - Email
   - **Description**: Help text for users
   - **Required**: Make field required
   - **Visible**: Show in member profiles
3. Configure options:
   - **Default value**: Pre-fill value
   - **Options**: For select/multi-select types
   - **Validation**: Rules (e.g., date range, number limits)
4. Save attribute

#### Managing Attributes

- **Edit Attribute**: Modify attribute configuration
- **Delete Attribute**: Remove attribute (data preserved)
- **Reorder Attributes**: Change display order
- **Export Attributes**: Export configuration

### Member Badges

#### Creating Badges

1. Go to **Administration → Badges → Add Badge**
2. Define badge:
   - **Name**: Badge name (e.g., "Baptised")
   - **Icon**: Select icon
   - **Color**: Badge colour
   - **Category**: Badge category
   - **Description**: What badge represents
3. Configure:
   - **Auto-assign rules**: Conditions for auto-assignment
   - **Manual assignment**: Allow manual assignment
4. Save badge

#### Managing Badges

- **Assign to Members**: Bulk assign to members
- **Remove from Members**: Bulk remove
- **Badge Reports**: View members by badge
- **Badge Analytics**: Usage statistics

### Service Types Configuration

1. Go to **Administration → Services → Service Types**
2. Add service types:
   - **Sunday Morning**
   - **Sunday Evening**
   - **Midweek**
   - **Special Event**
   - Custom types
3. Configure each type:
   - Default time
   - Default location
   - Default capacity
   - Check-in settings
4. Save configuration

---

## System Settings

### Email Configuration

#### SMTP Settings

1. Go to **Administration → Settings → Email**
2. Configure SMTP:
   - **Mail Driver**: SMTP (recommended)
   - **Host**: SMTP server (e.g., smtp.gmail.com)
   - **Port**: 587 (TLS) or 465 (SSL)
   - **Encryption**: TLS or SSL
   - **Username**: SMTP username
   - **Password**: SMTP password
   - **From Address**: Default sender email
   - **From Name**: Default sender name
3. Test email configuration
4. Save settings

#### Email Templates

1. Go to **Administration → Settings → Email Templates**
2. Manage templates:
   - **Welcome Email**: New user registration
   - **Password Reset**: Password reset instructions
   - **Attendance Reminder**: Service reminders
   - **Event Notification**: Event updates
3. Customise templates:
   - Edit HTML content
   - Use variables ({{name}}, {{date}}, etc.)
   - Preview template
4. Save templates

### Notification Settings

1. Go to **Administration → Settings → Notifications**
2. Configure notification types:
   - **New Member Registration**: Alert admins
   - **Attendance Milestones**: Notify of attendance goals
   - **System Alerts**: Critical system notifications
   - **User Activity**: Login/action notifications
3. Set delivery methods:
   - Email
   - In-app notifications
   - SMS (if configured)
4. Configure frequency:
   - Real-time
   - Daily digest
   - Weekly summary
5. Save settings

### System Preferences

#### General Settings

1. Go to **Administration → Settings → General**
2. Configure:
   - **System Name**: Application name
   - **Default Language**: System language
   - **Date Format**: Date display format
   - **Time Format**: Time display format
   - **Timezone**: Default timezone
   - **Currency**: For financial features
3. Save settings

#### Feature Flags

1. Go to **Administration → Settings → Features**
2. Enable/disable features:
   - **QR Code Check-in**: Enable QR attendance
   - **Family Relationships**: Enable relationship tracking
   - **Custom Attributes**: Enable custom fields
   - **Member Badges**: Enable badge system
   - **Advanced Reports**: Enable advanced reporting
4. Save changes

---

## Security Configuration

### Authentication Settings

1. Go to **Administration → Security → Authentication**
2. Configure:
   - **Session Timeout**: Minutes before logout
   - **Remember Me**: Enable "Remember Me" option
   - **Two-Factor Authentication**: Enable 2FA
   - **Password Policies**: See Password Management section
   - **Login Attempts**: Max failed attempts before lockout
   - **Lockout Duration**: Minutes account locked after failed attempts

### API Security

1. Go to **Administration → Security → API**
2. Configure:
   - **API Rate Limiting**: Requests per minute
   - **API Key Management**: Generate/manage API keys
   - **Allowed Origins**: CORS configuration
   - **Token Expiration**: API token lifetime

### Access Control

#### IP Whitelisting

1. Go to **Administration → Security → Access Control**
2. Add allowed IP addresses/ranges
3. Configure:
   - **Admin IP Restrictions**: Limit admin access to specific IPs
   - **API IP Restrictions**: Limit API access
4. Save configuration

#### Audit Logging

1. Go to **Administration → Security → Audit Logs**
2. Configure logging:
   - **Log Level**: Information, Warning, Error
   - **Log Retention**: Days to keep logs
   - **Log Events**: Which events to log:
     - User logins
     - Data modifications
     - Permission changes
     - System access
     - Failed login attempts
3. Enable audit logging
4. Save settings

### Data Privacy

#### GDPR Compliance

1. Go to **Administration → Security → Privacy**
2. Configure:
   - **Data Retention**: How long to keep inactive data
   - **Data Export**: Allow users to export their data
   - **Data Deletion**: Allow users to delete their data
   - **Privacy Policy**: Link to privacy policy
   - **Consent Management**: Track user consent
3. Review and save settings

#### Data Encryption

1. Go to **Administration → Security → Encryption**
2. Configure:
   - **Encryption at Rest**: Encrypt database data
   - **Encryption in Transit**: Ensure SSL/TLS
   - **Sensitive Data**: Fields to encrypt
3. Enable encryption features

---

## Data Management

### Member Data Management

#### Bulk Operations

1. Go to **Administration → Data → Bulk Operations**
2. Select operation:
   - **Bulk Update**: Update multiple members at once
   - **Bulk Delete**: Remove multiple members
   - **Bulk Export**: Export member data
   - **Bulk Import**: Import member data
3. Select members (use filters)
4. Configure operation
5. Preview changes
6. Execute operation

#### Data Cleanup

1. Go to **Administration → Data → Cleanup**
2. Cleanup options:
   - **Duplicate Members**: Find and merge duplicates
   - **Inactive Members**: Archive or delete inactive
   - **Orphaned Records**: Clean up orphaned data
   - **Old Logs**: Remove old log files
3. Run cleanup tools
4. Review cleanup results
5. Confirm cleanup

### Database Maintenance

#### Database Optimisation

1. Go to **Administration → Maintenance → Database**
2. Run optimisation:
   - **Index Maintenance**: Rebuild indexes
   - **Table Optimisation**: Optimise tables
   - **Vacuum Database**: Clean up database (PostgreSQL)
   - **Statistics Update**: Update query statistics
3. Schedule automatic optimisation

#### Database Size Management

1. Go to **Administration → Maintenance → Database Size**
2. View database statistics:
   - Total size
   - Table sizes
   - Index sizes
   - Growth trends
3. Identify large tables
4. Implement archiving if needed

### Data Import/Export

#### Exporting Data

1. Go to **Administration → Data → Export**
2. Select data type:
   - Members
   - Families
   - Attendance
   - Reports
   - All data
3. Configure export:
   - Format (CSV, Excel, JSON)
   - Fields to include
   - Date range
   - Filters
4. Generate export
5. Download file

#### Importing Data

1. Go to **Administration → Data → Import**
2. Select data type
3. Download template
4. Prepare data file
5. Upload file
6. Map fields
7. Preview import
8. Confirm import
9. Review import results

---

## Backup & Recovery

### Automated Backups

#### Configuring Backups

1. Go to **Administration → Maintenance → Backups**
2. Configure backup settings:
   - **Frequency**: Daily, Weekly, Monthly
   - **Time**: When to run backups
   - **Retention**: Days to keep backups
   - **Storage**: Local or cloud storage
3. Enable automated backups
4. Save settings

#### Manual Backup

1. Go to **Administration → Maintenance → Backups**
2. Click **"Create Backup"**
3. Select backup type:
   - **Full Backup**: Database + files
   - **Database Only**: Just database
   - **Files Only**: Uploaded files
4. Create backup
5. Download backup file

### Recovery Procedures

#### Restoring from Backup

1. Go to **Administration → Maintenance → Restore**
2. Select backup file
3. Choose restore options:
   - **Full Restore**: Replace everything
   - **Database Only**: Restore database
   - **Files Only**: Restore files
4. **Warning**: This will overwrite current data
5. Confirm restore
6. Monitor restore progress
7. Verify data after restore

#### Disaster Recovery Plan

See [Maintenance Procedures](./maintenance-procedures.md#disaster-recovery) for complete disaster recovery procedures.

---

## Monitoring & Maintenance

### System Health Monitoring

1. Go to **Administration → Monitoring → System Health**
2. View metrics:
   - **Server Status**: CPU, memory, disk usage
   - **Database Status**: Connection, query performance
   - **Application Status**: Response times, error rates
   - **Storage Status**: Disk space, file counts
3. Set up alerts for critical metrics

### Performance Monitoring

1. Go to **Administration → Monitoring → Performance**
2. Monitor:
   - **Response Times**: API and page load times
   - **Query Performance**: Slow database queries
   - **Cache Hit Rates**: Cache effectiveness
   - **Queue Performance**: Background job processing
3. Identify bottlenecks
4. Optimise as needed

### Error Monitoring

1. Go to **Administration → Monitoring → Errors**
2. Review error logs:
   - **Application Errors**: PHP/Laravel errors
   - **Database Errors**: SQL errors
   - **API Errors**: API request failures
   - **User Errors**: User-reported issues
3. Investigate and resolve errors

### Scheduled Maintenance

#### Maintenance Windows

1. Go to **Administration → Maintenance → Schedule**
2. Schedule maintenance:
   - **Weekly**: Database optimisation
   - **Monthly**: Full backup and review
   - **Quarterly**: System updates
3. Notify users of scheduled maintenance

---

## Troubleshooting for Admins

### Common Admin Issues

#### User Can't Log In

1. Check user account status (active/inactive)
2. Verify email address is correct
3. Check password reset history
4. Review failed login attempts
5. Unlock account if locked
6. Reset password if needed

#### Data Import Errors

1. Review error log
2. Check file format (CSV/Excel)
3. Verify field mappings
4. Check data validation rules
5. Fix data issues
6. Re-run import

#### Performance Issues

1. Check system monitoring
2. Review slow query logs
3. Check server resources (CPU, memory, disk)
4. Review cache configuration
5. Optimise database indexes
6. Scale resources if needed

#### Email Not Sending

1. Test SMTP configuration
2. Check email logs
3. Verify SMTP credentials
4. Check spam filters
5. Review email server logs
6. Test with different email address

### Getting Support

1. **Documentation**: Review admin documentation
2. **Error Logs**: Check application logs
3. **System Logs**: Review server logs
4. **Community**: Access community forums
5. **Support Portal**: Submit support ticket
6. **Emergency**: Contact technical support

---

## Advanced Configuration

### Custom Workflows

#### Creating Workflows

1. Go to **Administration → Advanced → Workflows**
2. Create workflow:
   - **Name**: Workflow name
   - **Trigger**: Event that starts workflow (e.g., new member)
   - **Actions**: Steps to execute
3. Configure actions:
   - Send email
   - Create task
   - Update member
   - Trigger notification
4. Test workflow
5. Activate workflow

### API Configuration

#### API Keys

1. Go to **Administration → Advanced → API**
2. Create API key:
   - **Name**: Key identifier
   - **Permissions**: Select allowed operations
   - **Expiration**: Key expiration date
3. Generate key
4. **Important**: Copy and store key securely
5. Manage existing keys:
   - View usage
   - Revoke keys
   - Regenerate keys

### Integration Settings

#### Third-Party Integrations

1. Go to **Administration → Advanced → Integrations**
2. Configure integrations:
   - **Payment Gateways**: For financial features
   - **Email Services**: Email provider settings
   - **SMS Services**: SMS provider settings
   - **Calendar Services**: Calendar sync
3. Test integrations
4. Save configuration

---

## Quick Reference

### Important URLs

- **Admin Dashboard**: `/admin`
- **User Management**: `/admin/users`
- **System Settings**: `/admin/settings`
- **Backups**: `/admin/maintenance/backups`
- **Monitoring**: `/admin/monitoring`
- **Audit Logs**: `/admin/security/audit-logs`

### Common Tasks

- **Add User**: Administration → Users → Add User
- **Reset Password**: Administration → Users → Select User → Reset Password
- **Create Backup**: Administration → Maintenance → Backups → Create Backup
- **View Logs**: Administration → Monitoring → Error Logs
- **Configure Email**: Administration → Settings → Email

---

**Last Updated**: {{ date }}  
**Version**: 1.0.0  
**For Technical Support**: See [Installation Guide](./installation-guide.md) or [Troubleshooting Guide](../operations/troubleshooting.md)

