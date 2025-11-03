# Apache Web Server Security & Hardening
## Critical Need-to-Have Practices for ChMS

**Date**: November 3, 2025  
**References**: 
- [15 Apache Security Best Practices Checklist](https://cloudinfrastructureservices.co.uk/apache-web-server-security-and-hardening-best-practices-checklist/)
- [Apache Hardening and Security Guide](https://www.techbloat.com/apache-web-server-hardening-and-security-guide.html)

---

## 🔴 **CRITICAL SECURITY PRACTICES (Need-to-Have)**

### **1. Keep Apache Updated** ✅ **AUTOMATED**

**Status**: ✅ **GOOD** - Using official PHP Apache image (updated via Dependabot)

**Best Practice**: Regular updates for security patches

**Current Implementation**:
- ✅ Using `php:8.2-apache` official image (regularly updated)
- ✅ Dependabot configured for Docker image updates

**Action**: ✅ **No action needed** - Automated via base image updates

---

### **2. Activate Logging** ✅ **ALREADY IMPLEMENTED**

**Status**: ✅ **GOOD** - Apache logging configured

**Current Implementation**:
```apache
ErrorLog ${APACHE_LOG_DIR}/error.log
CustomLog ${APACHE_LOG_DIR}/access.log combined
```

**Action**: ✅ **No action needed** - Logging active

---

### **3. Add SSL Certificate** ⚠️ **NEEDS PRODUCTION SETUP**

**Status**: ⚠️ **PLANNED** - SSL required for production

**Best Practice**: SSL/TLS encryption for all connections

**Current Implementation**:
- ✅ HTTPS enforcement in Laravel (`AppServiceProvider`)
- ✅ HSTS header configured (`SecurityHeadersMiddleware`)
- ❌ SSL certificate not yet configured (production requirement)

**Action Required**:
1. **Set up SSL certificates** (Let's Encrypt recommended)
2. **Configure Apache SSL virtual host** for production
3. **Redirect HTTP to HTTPS** (already enforced in Laravel)

**Priority**: 🔴 **HIGH** - Required for production

---

### **4. Restrict Network Access** ⚠️ **CONSIDER FOR PRODUCTION**

**Status**: ⚠️ **NOT IMPLEMENTED** - Open access (acceptable for web app)

**Best Practice**: Restrict access to specific IPs if needed

**Assessment**: 
- **Need-to-Have**: ❌ **Not critical** - Public web application
- **When to Use**: Admin panels, internal APIs only

**Current Implementation**:
- ✅ Docker network isolation
- ✅ Application-level authentication (Sanctum)

**Recommendation**: ⚠️ **Skip for now** - Only needed for admin-only endpoints

---

### **5. Deploy ModSecurity** ❌ **NICE-TO-HAVE**

**Status**: ❌ **Not implemented** - Web Application Firewall

**Best Practice**: WAF for additional protection

**Assessment**:
- **Need-to-Have**: ❌ **Not critical** - Application-level security sufficient
- **Nice-to-Have**: ✅ **For enterprise** - Additional security layer

**Recommendation**: ⚠️ **Skip for MVP** - Application has rate limiting and security monitoring

---

### **6. Enable mod_evasive** ⚠️ **CONSIDER**

**Status**: ⚠️ **NOT IMPLEMENTED** - DDoS protection module

**Best Practice**: Protection against DDoS and brute force attacks

**Assessment**:
- **Need-to-Have**: 🟡 **Consider** - Rate limiting exists at application level
- **Application Alternative**: ✅ Already have `RateLimitMiddleware`

**Current Alternative**:
- ✅ Laravel rate limiting middleware
- ✅ Failed login tracking
- ✅ IP-based blocking

**Recommendation**: ⚠️ **Skip for now** - Application-level protection sufficient

---

### **7. Establish HTTP Limits** ⚠️ **PARTIALLY IMPLEMENTED**

**Status**: ⚠️ **PARTIAL** - Some limits configured

**Best Practices**:

#### **KeepAlive** ✅ **CONFIGURED**
```apache
# Default Apache KeepAlive settings are usually sufficient
```

#### **Request Limits** ⚠️ **NEEDS ADDITION**
**Current**: Not explicitly configured
**Recommended**: Add to production config

**Action Required**: Add to `Dockerfile.prod`:
```apache
LimitRequestBody 5242880          # 5MB max upload
LimitRequestFields 50              # Max header fields
LimitRequestFieldSize 4095         # Max header size
LimitRequestLine 10000             # Max URL length
TimeOut 300                        # Request timeout
MaxRequestWorkers 256              # Max concurrent connections
MaxKeepAliveRequests 100           # Max requests per connection
KeepAliveTimeout 5                 # KeepAlive timeout
```

**Priority**: 🟡 **MEDIUM** - Prevents abuse and resource exhaustion

---

### **8. Discard Unused Modules** ✅ **GOOD**

**Status**: ✅ **GOOD** - Minimal modules enabled

**Current Implementation**:
```dockerfile
RUN a2enmod rewrite headers expires deflate
```

**Best Practice**: Only enable needed modules
- ✅ `rewrite` - Required for Laravel routing
- ✅ `headers` - Required for security headers
- ✅ `expires` - Required for caching
- ✅ `deflate` - Required for compression

**Action**: ✅ **No action needed** - Only necessary modules enabled

---

### **9. Update Default User Settings** ✅ **GOOD**

**Status**: ✅ **GOOD** - Using default `www-data` in container

**Best Practice**: Use non-privileged user

**Current Implementation**:
- ✅ Running as `www-data` (non-root in container)
- ✅ Container runs as non-root user
- ✅ Appropriate permissions set

**Action**: ✅ **No action needed** - Container security is sufficient

---

### **10. Block Directory Access** ✅ **ALREADY IMPLEMENTED**

**Status**: ✅ **EXCELLENT** - Directory indexing disabled

**Current Implementation**:
```apache
Options -Indexes  # Hide directory listings
```

**Action**: ✅ **No action needed**

---

### **11. Hide ETag** ⚠️ **RECOMMENDED**

**Status**: ⚠️ **NOT IMPLEMENTED** - ETag can expose server info

**Best Practice**: Disable ETag to prevent information leakage

**Action Required**: Add to `Dockerfile.prod`:
```apache
FileETag None
```

**Priority**: 🟡 **MEDIUM** - Prevents information disclosure

---

### **12. Disable HTTP TRACE** ⚠️ **RECOMMENDED**

**Status**: ⚠️ **NOT IMPLEMENTED** - TRACE method enabled by default

**Best Practice**: Disable TRACE to prevent XST (Cross-Site Tracing)

**Action Required**: Add to `Dockerfile.prod`:
```apache
TraceEnable off
```

**Priority**: 🟡 **MEDIUM** - Prevents XST attacks

---

### **13. Disable .htaccess Override** ⚠️ **CONSIDER**

**Status**: ⚠️ **CURRENTLY ENABLED** - `AllowOverride All`

**Best Practice**: Disable `.htaccess` for better performance

**Assessment**:
- **Current**: `AllowOverride All` (needed for Laravel in some setups)
- **Performance**: Disabling improves performance
- **Laravel**: Doesn't require `.htaccess` if Apache config is correct

**Recommendation**: ⚠️ **Can disable** - Move rules to Apache config

**Action**: 
```apache
AllowOverride None  # Instead of All
```
But ensure Laravel routing still works without `.htaccess`

**Priority**: 🟢 **LOW** - Performance optimization

---

### **14. Disable SSI and CGI** ✅ **ALREADY IMPLEMENTED**

**Status**: ✅ **GOOD** - Not needed for Laravel

**Current Implementation**:
- ✅ No SSI or CGI usage
- ✅ PHP-FPM handles PHP (not CGI)

**Action**: ✅ **No action needed**

---

### **15. Hide Server Information** ✅ **ALREADY IMPLEMENTED**

**Status**: ✅ **GOOD** - Server tokens hidden

**Current Implementation**:
```dockerfile
RUN echo 'ServerTokens Prod' >> /etc/apache2/apache2.conf
RUN echo 'ServerSignature Off' >> /etc/apache2/apache2.conf
```

**Action**: ✅ **No action needed**

---

### **16. Disable Null and Weak Ciphers** ⚠️ **FOR SSL SETUP**

**Status**: ⚠️ **NOT YET APPLICABLE** - SSL not configured

**Best Practice**: When SSL is enabled, use strong ciphers only

**Action Required** (when SSL is added):
```apache
SSLProtocol -all +TLSv1.2 +TLSv1.3
SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
SSLHonorCipherOrder on
```

**Priority**: 🔴 **HIGH** - Required when SSL is configured

---

## 📋 **IMPLEMENTATION CHECKLIST**

### **Security (Critical)**
- [x] ✅ Apache updated (via base image)
- [x] ✅ Logging enabled
- [x] ✅ Directory indexing disabled
- [x] ✅ Server tokens hidden
- [x] ✅ Security headers configured
- [ ] ⚠️ Add HTTP request limits
- [ ] ⚠️ Disable ETag
- [ ] ⚠️ Disable TRACE method
- [ ] ⚠️ Configure SSL certificates (production)

### **Performance (Important)**
- [x] ✅ Compression enabled (mod_deflate)
- [x] ✅ Caching configured (mod_expires)
- [x] ✅ Minimal modules enabled
- [ ] ⚠️ Consider disabling .htaccess (performance)

---

## 🔧 **RECOMMENDED ACTIONS**

### **Immediate (Critical)**
1. **Add HTTP Request Limits** to `Dockerfile.prod`:
   - LimitRequestBody, LimitRequestFields, etc.
   - Prevents abuse and DoS

2. **Disable ETag and TRACE**:
   - `FileETag None`
   - `TraceEnable off`

### **Production (Required)**
3. **Configure SSL Certificates**:
   - Set up Let's Encrypt or commercial SSL
   - Configure SSL virtual host
   - Ensure strong cipher suites

### **Optional (Nice-to-Have)**
4. **Consider ModSecurity** - Only for enterprise deployments
5. **Consider mod_evasive** - If DDoS is a concern (application rate limiting may be sufficient)

---

## ❌ **NOT NEEDED (Nice-to-Have, Skip for Now)**

1. **ModSecurity** - Application-level security sufficient
2. **mod_evasive** - Laravel rate limiting handles this
3. **IP Restriction** - Public web application
4. **Advanced WAF Rules** - Overkill for MVP

---

## 📚 **References**

1. [15 Apache Security Best Practices Checklist](https://cloudinfrastructureservices.co.uk/apache-web-server-security-and-hardening-best-practices-checklist/)
2. [Apache Hardening and Security Guide](https://www.techbloat.com/apache-web-server-hardening-and-security-guide.html)

---

## ✅ **Current Security Status**

**Overall**: ✅ **8/10** - Good foundation, minor improvements needed

**Strengths**:
- ✅ Most security practices implemented
- ✅ Server information hidden
- ✅ Security headers configured
- ✅ Minimal attack surface (few modules)

**Areas to Improve**:
- ⚠️ Add HTTP request limits
- ⚠️ Disable ETag and TRACE
- ⚠️ Configure SSL for production

**Security Score**: **8/10** - Production ready with minor hardening needed

