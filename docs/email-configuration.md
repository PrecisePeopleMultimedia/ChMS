# Email Configuration Guide

## 📧 **Email Setup for Password Reset**

This guide shows you how to configure email for the password reset functionality.

## 🔧 **Development Configuration**

### **Option 1: Log Driver (Recommended for Development)**

Add these settings to your `backend/.env` file:

```env
# Email Configuration for Development
MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@churchafrica.com"
MAIL_FROM_NAME="ChurchAfrica"
```

This will log emails to `storage/logs/laravel.log` instead of sending them.

### **Option 2: Mailpit (Local SMTP Server)**

1. **Install Mailpit** (if using Laravel Herd, it's included):
   ```bash
   # Using Homebrew (macOS)
   brew install mailpit
   
   # Using npm
   npm install -g mailpit
   ```

2. **Start Mailpit**:
   ```bash
   mailpit
   ```

3. **Configure Laravel** in `backend/.env`:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=127.0.0.1
   MAIL_PORT=1025
   MAIL_USERNAME=null
   MAIL_PASSWORD=null
   MAIL_ENCRYPTION=null
   MAIL_FROM_ADDRESS="hello@churchafrica.com"
   MAIL_FROM_NAME="ChurchAfrica"
   ```

4. **Access Mailpit Interface**: http://localhost:8025

### **Option 3: Gmail SMTP (For Testing)**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="ChurchAfrica"
```

**Note**: Use App Passwords for Gmail (not your regular password).

## 🚀 **Production Configuration**

### **Option 1: AWS SES**

```env
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="ChurchAfrica"
```

### **Option 2: Mailgun**

```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_SECRET=your-mailgun-secret
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="ChurchAfrica"
```

### **Option 3: SendGrid**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="ChurchAfrica"
```

## 🧪 **Testing Email Functionality**

### **1. Test Password Reset Flow**

1. **Start your backend server**:
   ```bash
   cd backend
   php artisan serve
   ```

2. **Start your frontend server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the flow**:
   - Go to http://localhost:1811/login
   - Click "Forgot your password?"
   - Enter a valid email address
   - Check your email logs or Mailpit interface

### **2. Check Email Logs**

If using the `log` driver, check:
```bash
tail -f backend/storage/logs/laravel.log
```

### **3. Check Mailpit Interface**

If using Mailpit, visit: http://localhost:8025

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. "Connection could not be established"**
- Check your SMTP settings
- Verify firewall settings
- Ensure the mail server is running

#### **2. "Authentication failed"**
- Verify username/password
- For Gmail, use App Passwords
- Check if 2FA is enabled

#### **3. "Email not sending"**
- Check Laravel logs: `tail -f storage/logs/laravel.log`
- Verify MAIL_FROM_ADDRESS is set
- Check queue configuration

### **Debug Email Issues**

Add this to your `backend/routes/web.php` for testing:

```php
Route::get('/test-email', function () {
    try {
        Mail::raw('Test email from ChurchAfrica', function ($message) {
            $message->to('test@example.com')
                    ->subject('Test Email');
        });
        
        return 'Email sent successfully!';
    } catch (\Exception $e) {
        return 'Email failed: ' . $e->getMessage();
    }
});
```

## 📋 **Environment Variables Summary**

Add these to your `backend/.env` file:

```env
# Frontend URL for email links
FRONTEND_URL=http://localhost:1811

# Email Configuration
MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@churchafrica.com"
MAIL_FROM_NAME="ChurchAfrica"

# For SMTP (if not using log driver)
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
```

## 🎯 **Next Steps**

1. **Choose your email configuration** (log driver for development)
2. **Update your `.env` file** with the appropriate settings
3. **Test the password reset flow**
4. **Configure production email** when deploying

## 📚 **Additional Resources**

- [Laravel Mail Documentation](https://laravel.com/docs/mail)
- [Mailpit Documentation](https://github.com/axllent/mailpit)
- [AWS SES Setup](https://docs.aws.amazon.com/ses/)
- [Mailgun Documentation](https://documentation.mailgun.com/)

---

**Happy emailing! 📧✨**
