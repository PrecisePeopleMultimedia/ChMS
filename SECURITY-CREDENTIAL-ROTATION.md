# Security Credential Rotation Guide

## 🚨 IMMEDIATE ACTION REQUIRED

The production readiness assessment identified exposed credentials in the codebase. While these credentials were never committed to Git, they exist in local .env files and must be rotated for security.

## Current Status

✅ **Good News**: .env files were never committed to Git repository
✅ **Good News**: .gitignore properly excludes .env files
✅ **Action Needed**: Rotate all exposed credentials as a security best practice

## Credentials to Rotate

### 1. Supabase Credentials
**Current (EXPOSED):**
- URL: `https://qqaddmalbzzxxtryekaq.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Action Required:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to Settings > API
3. Reset the anon key
4. Update both frontend/.env and backend/.env with new values

### 2. Google OAuth Credentials
**Current (EXPOSED):**
- Client ID: `152986125739-rb2apvoumolapm5fnaksh7tv5jabgsl4.apps.googleusercontent.com`
- Client Secret: `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`

**Action Required:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Delete the current OAuth 2.0 client
4. Create a new OAuth 2.0 client ID
5. Update both frontend/.env and backend/.env with new values

### 3. Laravel Application Key
**Current:**
- APP_KEY: `base64:8iTc9o2CgXoDXYXwfvItu3qJjFQ4eIlFitxJGelRi9Y=`

**Action Required:**
1. Navigate to backend directory
2. Run: `php artisan key:generate`
3. This will automatically update the APP_KEY in backend/.env

## Step-by-Step Rotation Process

### Step 1: Backup Current Configuration
```bash
# Create backup of current working configuration
cp frontend/.env frontend/.env.backup
cp backend/.env backend/.env.backup
```

### Step 2: Rotate Laravel Key
```bash
cd backend
php artisan key:generate
```

### Step 3: Rotate Supabase Credentials
1. Login to Supabase Dashboard
2. Go to Project Settings > API
3. Click "Reset" next to the anon key
4. Copy the new anon key
5. Update `VITE_SUPABASE_ANON_KEY` in frontend/.env

### Step 4: Rotate Google OAuth Credentials
1. Login to Google Cloud Console
2. Go to APIs & Services > Credentials
3. Delete the existing OAuth 2.0 client
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Configure:
   - Application type: Web application
   - Name: ChurchAfrica
   - Authorized redirect URIs: `http://backend.test/api/auth/google/callback`
6. Copy the new Client ID and Client Secret
7. Update both frontend/.env and backend/.env:
   - `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### Step 5: Test Configuration
```bash
# Test frontend
cd frontend
npm run dev

# Test backend (in separate terminal)
cd backend
php artisan serve

# Verify OAuth flow works with new credentials
```

### Step 6: Update Production Environment
When deploying to production:
1. Set environment variables in your deployment platform (Vercel, Netlify, etc.)
2. Never commit the actual .env files
3. Use the .env.example files as templates

## Security Best Practices Going Forward

### 1. Environment Variable Management
- ✅ Use .env.example files for templates
- ✅ Keep .env files in .gitignore
- ✅ Use different credentials for development/staging/production
- ✅ Rotate credentials regularly (quarterly)

### 2. Development Workflow
```bash
# When setting up new development environment:
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# Then fill in actual values
```

### 3. Production Deployment
- Use platform environment variables (Vercel, Netlify, etc.)
- Enable secret scanning in CI/CD
- Use different database and OAuth apps for production

### 4. Monitoring
- Set up alerts for failed authentication attempts
- Monitor for unusual API usage patterns
- Regular security audits

## Verification Checklist

After rotation, verify:
- [ ] Laravel application starts without errors
- [ ] Frontend connects to backend API
- [ ] Google OAuth login works
- [ ] Supabase connection is functional
- [ ] No credentials in Git history: `git log --all --full-history -- "*.env"`
- [ ] .env files properly ignored: `git status` should not show .env files

## Emergency Contacts

If you suspect credential compromise:
1. Immediately rotate all credentials
2. Check access logs in Supabase and Google Cloud Console
3. Review recent API usage for anomalies
4. Consider enabling additional security measures (2FA, IP restrictions)

## Next Steps

After completing credential rotation:
1. ✅ Mark security task as complete
2. ✅ Proceed with other production readiness tasks
3. ✅ Set up monitoring and alerting
4. ✅ Schedule regular security reviews

---

**Remember**: Security is an ongoing process, not a one-time task. Regular credential rotation and security audits are essential for maintaining a secure application.
