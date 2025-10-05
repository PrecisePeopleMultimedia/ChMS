# Password Reset Testing Guide

## 🧪 **Testing the Password Reset Functionality**

This guide will help you test the complete password reset flow that we've implemented.

## 📋 **What We've Implemented**

### **Backend Features:**
- ✅ `POST /api/auth/forgot-password` - Send reset email
- ✅ `POST /api/auth/reset-password` - Reset password with token
- ✅ Email template with beautiful design
- ✅ Token expiration (1 hour validity)
- ✅ Security measures (token hashing, cleanup)

### **Frontend Features:**
- ✅ Forgot Password Form (`/forgot-password`)
- ✅ Reset Password Form (`/reset-password`)
- ✅ Password strength validation
- ✅ Error handling and user feedback
- ✅ Responsive design

## 🚀 **Testing Steps**

### **Step 1: Start Your Servers**

1. **Backend Server** (using Laravel Herd):
   ```bash
   # Herd should automatically serve at http://backend.test
   # If not, run: php artisan serve
   ```

2. **Frontend Server**:
   ```bash
   cd frontend
   npm run dev
   # Should be available at http://localhost:1811
   ```

### **Step 2: Configure Email (Development)**

Add to your `backend/.env` file:
```env
# Frontend URL for email links
FRONTEND_URL=http://localhost:1811

# Email Configuration (Development)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@churchafrica.com"
MAIL_FROM_NAME="ChurchAfrica"
```

### **Step 3: Test the Complete Flow**

#### **3.1 Test Forgot Password**

1. **Navigate to**: http://localhost:1811/login
2. **Click**: "Forgot your password?" link
3. **Enter**: A valid email address (must exist in your database)
4. **Click**: "Send Reset Instructions"
5. **Expected**: Success message and redirect to login

#### **3.2 Check Email Logs**

If using `log` driver, check the email content:
```bash
# Check Laravel logs
tail -f backend/storage/logs/laravel.log
```

Look for the email content with the reset link.

#### **3.3 Test Reset Password**

1. **Copy the reset link** from the email logs
2. **Navigate to**: The reset link (should go to `/reset-password?token=...&email=...`)
3. **Enter**: New password (must meet requirements)
4. **Confirm**: Password confirmation
5. **Click**: "Reset Password"
6. **Expected**: Success message and redirect to login

#### **3.4 Test Login with New Password**

1. **Navigate to**: http://localhost:1811/login
2. **Enter**: Email and new password
3. **Click**: "Sign In"
4. **Expected**: Successful login to dashboard

## 🔍 **Testing Scenarios**

### **Scenario 1: Valid Reset Flow**
- ✅ User requests password reset
- ✅ Email is sent with reset link
- ✅ User clicks link and resets password
- ✅ User can login with new password

### **Scenario 2: Invalid Email**
- ❌ User enters non-existent email
- ✅ Should show error: "Email not found"

### **Scenario 3: Expired Token**
- ❌ User tries to use expired token (>1 hour)
- ✅ Should show error: "Reset token has expired"

### **Scenario 4: Invalid Token**
- ❌ User tries to use invalid/malformed token
- ✅ Should show error: "Invalid reset token"

### **Scenario 5: Weak Password**
- ❌ User enters weak password
- ✅ Should show validation errors for password requirements

### **Scenario 6: Password Mismatch**
- ❌ User enters different passwords
- ✅ Should show error: "Passwords do not match"

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Email not sending"**
**Solution**: Check email configuration in `.env`
```env
MAIL_MAILER=log  # For development
```

### **Issue 2: "Invalid reset token"**
**Solution**: Check if token is being passed correctly in URL

### **Issue 3: "Token expired"**
**Solution**: Request a new password reset

### **Issue 4: "Database connection error"**
**Solution**: Ensure database is running and migrations are applied

## 📊 **API Testing with cURL**

### **Test Forgot Password API**
```bash
curl -X POST http://backend.test/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### **Test Reset Password API**
```bash
curl -X POST http://backend.test/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "token": "your-reset-token",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
  }'
```

## 🎯 **Success Criteria**

The password reset functionality is working correctly when:

1. ✅ **Forgot Password Form** loads and validates email
2. ✅ **Email is sent** with proper reset link
3. ✅ **Reset Password Form** loads with token validation
4. ✅ **Password validation** works (strength requirements)
5. ✅ **Password reset** updates user password
6. ✅ **User can login** with new password
7. ✅ **Old tokens are invalidated** for security
8. ✅ **Error handling** works for all edge cases

## 🔒 **Security Features Implemented**

- ✅ **Token Hashing**: Reset tokens are hashed in database
- ✅ **Token Expiration**: Tokens expire after 1 hour
- ✅ **One-time Use**: Tokens are deleted after use
- ✅ **Session Invalidation**: All user sessions are revoked after reset
- ✅ **Email Validation**: Only valid, existing emails can request reset
- ✅ **Password Strength**: Enforced password requirements

## 📱 **Mobile Testing**

Test the password reset flow on mobile devices:

1. **Responsive Design**: Forms should work on mobile
2. **Touch Interactions**: Buttons should be touch-friendly
3. **Keyboard Types**: Email input should trigger email keyboard
4. **Error Messages**: Should be readable on small screens

## 🚀 **Next Steps**

After successful testing:

1. **Configure Production Email** (AWS SES, Mailgun, etc.)
2. **Set up Email Templates** for different languages
3. **Add Rate Limiting** to prevent abuse
4. **Implement Email Verification** for new accounts
5. **Add Password History** to prevent reuse

## 📚 **Additional Resources**

- [Laravel Mail Documentation](https://laravel.com/docs/mail)
- [Password Reset Security Best Practices](https://owasp.org/www-community/controls/Password_Reset)
- [Email Template Design Guidelines](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)

---

**Happy Testing! 🧪✨**
