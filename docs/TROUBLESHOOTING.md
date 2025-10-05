# ChurchAfrica Troubleshooting Guide

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

This troubleshooting guide should be updated as new issues are discovered and resolved.
