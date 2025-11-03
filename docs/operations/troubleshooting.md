# ChMS Troubleshooting Guide

Complete troubleshooting guide for ChMS covering common issues, error messages, and solutions for users, administrators, and developers.

## Table of Contents

1. [Authentication Issues](#-authentication-issues)
2. [Network & Connectivity Issues](#-network--connectivity-issues)
3. [Database Issues](#-database-issues)
4. [Frontend Issues](#-frontend-issues)
5. [Backend/API Issues](#-backendapi-issues)
6. [Performance Issues](#-performance-issues)
7. [Data Issues](#-data-issues)
8. [Installation Issues](#-installation-issues)
9. [Production Issues](#-production-issues)
10. [Debugging Tools](#-debugging-tools)

---

## Common Issues and Solutions

### 🚨 Authentication Issues

#### Issue 1: CSRF Token Mismatch (HTTP 419)

**Symptoms:**
- Login form shows "CSRF token mismatch" error
- Browser console shows 419 status code
- API requests fail with "The page has expired"

**Root Cause:**
Laravel's CSRF protection was enabled for API routes, but frontend was using token-based authentication.

**Solution:**
CSRF protection has been disabled for API routes in `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'api/*'  // All API routes excluded from CSRF
    ]);
})
```

**Prevention:**
- Keep API routes separate from web routes
- Use token-based auth for APIs, session-based for web forms

#### Issue 2: 401 Unauthorized on API Calls

**Symptoms:**
- API calls return 401 status
- User gets logged out unexpectedly
- "Unauthenticated" error messages

**Possible Causes & Solutions:**

1. **Token Expired:**
   ```javascript
   // Check token in browser localStorage
   console.log(localStorage.getItem('auth_token'));
   ```
   Solution: Re-login to get fresh token

2. **Token Not Sent:**
   Check axios configuration in `stores/auth.ts`:
   ```javascript
   headers: {
     Authorization: `Bearer ${token}`
   }
   ```

3. **Backend Token Validation:**
   ```bash
   # Check if Sanctum is properly configured
   php artisan route:list | grep sanctum
   ```

### 🌐 Network & Connectivity Issues

#### Issue 3: Frontend Can't Connect to Backend

**Symptoms:**
- "Test API Connection" button fails
- Network errors in browser console
- CORS errors

**Diagnostic Steps:**

1. **Check Backend Status:**
   ```bash
   # Verify Laravel Herd is running
   herd status
   
   # Test backend directly
   curl http://backend.test/api/health
   ```

2. **Check Frontend Configuration:**
   ```bash
   # Verify API URL in frontend/.env
   cat frontend/.env | grep VITE_API_URL
   ```

3. **Check CORS Configuration:**
   Verify `config/cors.php` includes frontend domain:
   ```php
   'allowed_origins' => ['http://localhost:1814'],
   ```

**Solutions:**

1. **Restart Laravel Herd:**
   ```bash
   herd restart
   ```

2. **Re-link Backend:**
   ```bash
   cd backend
   herd link backend
   ```

3. **Clear Laravel Cache:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

#### Issue 4: Port Conflicts

**Symptoms:**
- Frontend starts on unexpected port (1814 instead of 1811)
- API calls fail due to wrong port configuration

**Solution:**
Update frontend/.env with actual port:
```env
VITE_APP_URL=http://localhost:1814  # Use actual port
```

### 💾 Database Issues

#### Issue 5: Database Connection Errors

**Symptoms:**
- "Database file not found" errors
- Migration failures
- User authentication fails

**Solutions:**

1. **Create SQLite Database:**
   ```bash
   cd backend
   touch database/database.sqlite
   php artisan migrate
   ```

2. **Check Database Configuration:**
   ```bash
   # Verify .env database settings
   cat backend/.env | grep DB_
   ```

3. **Reset Database:**
   ```bash
   php artisan migrate:fresh --seed
   ```

#### Issue 6: Missing Test Users

**Symptoms:**
- Login fails with valid-looking credentials
- "Invalid credentials" error

**Solution:**
Run the test users seeder:
```bash
php artisan db:seed --class=TestUsersSeeder
```

**Verify Users Exist:**
```bash
php artisan tinker --execute="echo 'Users: ' . App\Models\User::count();"
```

### 🎨 Frontend Issues

#### Issue 7: Form Styling Inconsistencies

**Symptoms:**
- Login and registration forms look different
- Forms not properly centered
- Inconsistent button sizes

**Solution:**
All forms now use the `BaseFormCard` component for consistency. If issues persist:

1. **Clear Browser Cache:** Hard refresh (Ctrl+F5)
2. **Restart Frontend:** Stop and restart `npm run dev`
3. **Check Component Import:**
   ```vue
   import BaseFormCard from '@/components/common/BaseFormCard.vue'
   ```

#### Issue 8: Vue/Quasar Component Errors

**Symptoms:**
- Components not rendering
- Console errors about missing components
- Styling not applied

**Solutions:**

1. **Restart Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Clear Node Modules:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Quasar Configuration:**
   ```bash
   # Verify quasar.config.js is properly configured
   cat quasar.config.js | grep -A 10 "framework:"
   ```

### 🔧 Development Environment Issues

#### Issue 9: Laravel Herd Not Working

**Symptoms:**
- `backend.test` domain not resolving
- "Site can't be reached" errors

**Solutions:**

1. **Install/Reinstall Herd:**
   Download from https://herd.laravel.com

2. **Check Herd Status:**
   ```bash
   herd status
   herd list
   ```

3. **Re-link Project:**
   ```bash
   cd backend
   herd link backend
   ```

#### Issue 10: Environment Variables Not Loading

**Symptoms:**
- API URL showing as undefined
- Configuration not taking effect

**Solutions:**

1. **Restart Development Servers:**
   - Frontend: Stop and restart `npm run dev`
   - Backend: `php artisan config:clear`

2. **Check .env File Format:**
   - No spaces around `=`
   - No quotes unless necessary
   - Proper line endings

3. **Verify Environment Loading:**
   ```javascript
   // In browser console
   console.log(import.meta.env.VITE_API_URL);
   ```

## Debugging Tools

### Frontend Debugging

1. **Vue DevTools:** Available at http://localhost:1814/__devtools__/
2. **Browser Console:** Check for JavaScript errors
3. **Network Tab:** Monitor API calls and responses
4. **Application Tab:** Check localStorage for tokens

### Backend Debugging

1. **Laravel Logs:**
   ```bash
   tail -f backend/storage/logs/laravel.log
   ```

2. **Tinker Console:**
   ```bash
   php artisan tinker
   ```

3. **Route Testing:**
   ```bash
   php artisan route:list
   ```

### Database Debugging

1. **SQLite Browser:** Use DB Browser for SQLite
2. **Query Logging:** Enable in `config/database.php`
3. **Migration Status:**
   ```bash
   php artisan migrate:status
   ```

## Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Review browser console for errors
3. Check Laravel logs
4. Verify environment configuration
5. Test with curl/Postman

### Information to Include

- Error messages (exact text)
- Browser console output
- Laravel log entries
- Environment details (OS, browser, versions)
- Steps to reproduce the issue

### Useful Commands for Diagnostics

```bash
# System Information
php --version
node --version
npm --version

# Laravel Information
php artisan --version
php artisan route:list
php artisan config:show

# Database Information
php artisan migrate:status
php artisan tinker --execute="echo 'Users: ' . App\Models\User::count();"

# Frontend Information
npm list vue
npm list quasar
```

---

## 📊 Performance Issues

### Issue 11: Slow Page Load Times

**Symptoms:**
- Pages take 5+ seconds to load
- Users report slow performance
- Database queries timing out

**Diagnostic Steps:**

1. **Check Database Performance:**
   ```sql
   -- View slow queries
   SELECT query, mean_time, calls
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;
   ```

2. **Check Server Resources:**
   ```bash
   # CPU and memory usage
   top
   htop
   
   # Disk I/O
   iotop
   ```

3. **Check Application Logs:**
   ```bash
   tail -f storage/logs/laravel.log | grep -i slow
   ```

**Solutions:**

1. **Enable Caching:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Optimise Database:**
   ```bash
   # Run database optimisation
   php artisan db:optimize
   
   # Check for missing indexes
   php artisan db:check-indexes
   ```

3. **Review Slow Queries:**
   - Add missing indexes
   - Optimise N+1 queries
   - Use eager loading

### Issue 12: High Memory Usage

**Symptoms:**
- PHP memory limit errors
- Server running out of memory
- Application crashes

**Solutions:**

1. **Increase PHP Memory Limit:**
   ```ini
   # php.ini
   memory_limit = 256M
   ```

2. **Optimise Queue Workers:**
   ```bash
   # Limit queue worker memory
   php artisan queue:work --max-time=3600
   ```

3. **Check for Memory Leaks:**
   - Review application code
   - Check for unclosed resources
   - Review third-party packages

---

## 💾 Data Issues

### Issue 13: Missing or Corrupted Data

**Symptoms:**
- Records not appearing
- Data inconsistencies
- Reports showing incorrect numbers

**Diagnostic Steps:**

1. **Check Database Integrity:**
   ```sql
   -- Check table record counts
   SELECT COUNT(*) FROM members;
   SELECT COUNT(*) FROM attendance;
   
   -- Verify relationships
   SELECT COUNT(*) FROM family_relationships;
   ```

2. **Check Application Logs:**
   ```bash
   grep -i "error\|exception" storage/logs/laravel.log
   ```

**Solutions:**

1. **Restore from Backup:**
   ```bash
   # Restore specific table
   pg_restore -U chms_user -d chms_production \
       -t members backup.dump
   ```

2. **Data Repair:**
   ```bash
   # Run data integrity checks
   php artisan db:check-integrity
   
   # Repair relationships
   php artisan relationships:repair
   ```

### Issue 14: Duplicate Members

**Symptoms:**
- Same member appearing multiple times
- Confusion in member lists
- Attendance recorded multiple times

**Solutions:**

1. **Find Duplicates:**
   ```sql
   -- Find duplicate emails
   SELECT email, COUNT(*) 
   FROM members 
   GROUP BY email 
   HAVING COUNT(*) > 1;
   ```

2. **Merge Duplicates:**
   ```bash
   # Use merge tool
   php artisan members:merge-duplicates
   ```

---

## 🔧 Installation Issues

### Issue 15: Migration Failures

**Symptoms:**
- `php artisan migrate` fails
- Database errors during installation
- Schema not matching expectations

**Solutions:**

1. **Check Database Connection:**
   ```bash
   # Test connection
   php artisan tinker
   DB::connection()->getPdo();
   ```

2. **Reset Migrations:**
   ```bash
   # Fresh migration (WARNING: Deletes all data)
   php artisan migrate:fresh
   
   # Or rollback and re-run
   php artisan migrate:rollback
   php artisan migrate
   ```

3. **Check Migration Status:**
   ```bash
   php artisan migrate:status
   ```

### Issue 16: Permission Errors

**Symptoms:**
- "Permission denied" errors
- Cannot write to storage directory
- Upload failures

**Solutions:**

```bash
# Fix storage permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Fix upload directory
sudo chmod -R 775 storage/app/public
```

---

## 🏭 Production Issues

### Issue 17: 500 Internal Server Error

**Symptoms:**
- Users seeing 500 errors
- Application not responding
- Error pages displayed

**Diagnostic Steps:**

1. **Check Application Logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Check Web Server Logs:**
   ```bash
   # Nginx
   tail -f /var/log/nginx/error.log
   
   # Apache
   tail -f /var/log/apache2/error.log
   ```

**Solutions:**

1. **Clear Application Cache:**
   ```bash
   php artisan cache:clear
   php artisan config:clear
   php artisan view:clear
   ```

2. **Check Environment:**
   ```bash
   # Verify .env is correct
   cat .env | grep APP_DEBUG
   # Should be: APP_DEBUG=false in production
   ```

3. **Restart Services:**
   ```bash
   sudo systemctl restart php8.3-fpm
   sudo systemctl restart nginx
   ```

### Issue 18: SSL Certificate Issues

**Symptoms:**
- Browser security warnings
- Certificate expired errors
- HTTPS not working

**Solutions:**

1. **Renew Let's Encrypt Certificate:**
   ```bash
   sudo certbot renew
   sudo systemctl reload nginx
   ```

2. **Check Certificate Status:**
   ```bash
   openssl s_client -connect your-domain.com:443 -servername your-domain.com
   ```

---

## 🔍 Debugging Tools

### Browser Developer Tools

**Chrome/Edge DevTools:**
1. Press `F12` to open
2. **Console Tab**: View JavaScript errors
3. **Network Tab**: Monitor API calls
4. **Application Tab**: Check localStorage, cookies

**Firefox DevTools:**
1. Press `F12` to open
2. Similar functionality to Chrome

### Laravel Debugging

**Laravel Telescope** (if enabled):
- Access at `/telescope`
- View requests, queries, jobs, events
- Debug performance issues

**Laravel Logs:**
```bash
# View logs
tail -f storage/logs/laravel.log

# Filter for errors
tail -f storage/logs/laravel.log | grep ERROR

# Search logs
grep "keyword" storage/logs/laravel.log
```

**Artisan Tinker:**
```bash
php artisan tinker

# Test database connection
DB::connection()->getPdo();

# Check user count
User::count();

# Test query
Member::where('is_active', true)->count();
```

### Database Debugging

**PostgreSQL Logs:**
```bash
# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log

# Check active connections
psql -U chms_user -d chms_production -c "SELECT * FROM pg_stat_activity;"
```

**Query Analysis:**
```sql
-- Enable query logging
SET log_statement = 'all';

-- View slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

---

## 📞 Getting Help

### Before Requesting Help

1. ✅ Check this troubleshooting guide
2. ✅ Review application logs
3. ✅ Check browser console for errors
4. ✅ Verify environment configuration
5. ✅ Test with curl/Postman (for API issues)

### Information to Provide

When requesting help, include:

- **Error Messages**: Exact error text
- **Steps to Reproduce**: What actions led to the issue
- **Environment Details**:
  - Operating System
  - PHP Version: `php -v`
  - Node Version: `node -v`
  - Database Version: `psql --version`
- **Logs**: Relevant log entries
- **Screenshots**: Visual errors if applicable

### Support Channels

1. **Documentation**: Check [Installation Guide](../guides/installation-guide.md)
2. **Admin Guide**: See [Admin Guide](../guides/admin-guide.md)
3. **GitHub Issues**: Report bugs via GitHub
4. **Community Forums**: Ask questions in community
5. **Email Support**: Contact technical support

---

**Last Updated**: {{ date }}  
**Version**: 1.0.0  
**Related Documentation**:
- [Installation Guide](../guides/installation-guide.md)
- [Admin Guide](../guides/admin-guide.md)
- [Maintenance Procedures](../guides/maintenance-procedures.md)

This troubleshooting guide should be updated as new issues are discovered and resolved.
