# Security & Privacy Policy - ChMS

## 1. Overview

This document outlines the security measures and data privacy practices implemented in the ChMS application.

## 2. Data Security

- **Data Encryption:**
  - **In Transit:** All communication between the client, application server, and database is encrypted using TLS/SSL.
  - **At Rest:** Sensitive data stored in the PostgreSQL database should be encrypted where appropriate (e.g., using database-level encryption features or application-level encryption for specific fields).
- **Data Minimization:** We only collect and store data essential for the application's functionality.
- **Access Control:** Role-Based Access Control (RBAC) is implemented to ensure users can only access data relevant to their permissions.

## 3. Authentication & Authorization

- **Authentication:** Handled by NextAuth.js, supporting secure credential login and potentially other providers (e.g., Google, if configured).
- **Session Management:** Secure session tokens managed by NextAuth.js with appropriate expiration and security flags (HttpOnly, Secure, SameSite).
- **Password Security:** Passwords are never stored in plaintext. Hashed using a strong, salted algorithm (e.g., bcrypt) via NextAuth.js adapters or custom logic.
- **Authorization (RBAC):** API routes and server actions validate user roles and permissions before performing operations or returning data.
- **Rate Limiting:** Implement rate limiting on sensitive endpoints (e.g., login, password reset) to prevent brute-force attacks.

## 4. Application Security

- **Input Validation:** All user input is validated on the server-side using Zod schemas to prevent invalid data and potential injection attacks.
- **Output Encoding:** Data rendered in the UI is appropriately encoded (React handles much of this automatically) to prevent Cross-Site Scripting (XSS).
- **Cross-Site Request Forgery (CSRF):** NextAuth.js provides built-in CSRF protection for relevant actions.
- **Security Headers:** Implement standard security headers (e.g., `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`) via Next.js configuration or middleware.
- **Dependency Management:** Regularly scan dependencies for known vulnerabilities using tools like `npm audit` or GitHub Dependabot.

## 5. Infrastructure Security

- **Hosting Provider:** Rely on the security features provided by the hosting platform (e.g., Vercel, AWS).
- **Database Security:** Secure database access with strong credentials, network restrictions (firewalls), and regular patching.
- **Secret Management:** Environment variables and secrets are managed securely using hosting provider features or dedicated secret management tools (not committed to the repository).

## 6. Privacy Policy

### 6.1 Data Collection

ChMS collects the following categories of personal data:

**Personal Identifiable Information (PII):**
- Name (first, middle, last)
- Email address
- Phone number
- Date of birth
- Gender
- Marital status
- Physical address (street, city, state, postal code, country)

**Church-Related Information:**
- Member type (member, visitor, regular attendee)
- Membership dates (joined, baptism, membership)
- Attendance records
- Family relationships
- Custom attributes (baptism dates, external IDs, etc.)
- Badges and status indicators
- Notes and interactions

**Emergency Contact Information:**
- Emergency contact name, phone, and relationship

**Technical Data:**
- IP addresses (for security and analytics)
- Browser information
- Device information
- Usage logs and analytics

**Purpose of Data Collection:**
- To manage church membership and attendance
- To facilitate communication with members
- To provide church services and support
- To maintain accurate records for church operations
- To ensure security and prevent fraud
- To comply with legal obligations

### 6.2 Data Usage

Personal data is used exclusively for:
- **Church Management:** Managing member records, attendance tracking, and church operations
- **Communication:** Sending church-related communications (with consent)
- **Service Delivery:** Providing church services and support
- **Legal Compliance:** Meeting legal and regulatory requirements
- **Security:** Protecting the application and user data from security threats

**Data Minimization:** We only collect data that is necessary for the stated purposes.

### 6.3 Data Sharing

**Third-Party Services:**
- **Hosting Providers:** Data is stored on secure cloud infrastructure (PostgreSQL, Redis)
- **Email Services:** Email addresses may be processed by email service providers for church communications
- **Analytics:** Anonymous usage analytics may be collected (no personal identification)

**We Do NOT:**
- Sell personal data to third parties
- Share personal data for marketing purposes
- Disclose personal data except as required by law or with explicit consent

**Data Sharing Conditions:**
- Only shared with explicit user consent
- Shared only with trusted service providers under strict data processing agreements
- Shared when required by law or legal process

### 6.4 User Rights (GDPR & Data Protection)

Users have the following rights regarding their personal data:

**Right to Access:**
- Request a copy of all personal data we hold about you
- Request information about how your data is processed

**Right to Rectification:**
- Correct inaccurate or incomplete personal data
- Update personal information through the application

**Right to Erasure ("Right to be Forgotten"):**
- Request deletion of personal data (subject to legal retention requirements)
- Data will be deleted within 30 days of request (unless legal obligations require retention)

**Right to Restrict Processing:**
- Request limitation of data processing in certain circumstances

**Right to Data Portability:**
- Export personal data in a machine-readable format (JSON/CSV)
- Transfer data to another service provider

**Right to Object:**
- Object to processing of personal data for specific purposes
- Withdraw consent for data processing

**Right to Lodge a Complaint:**
- File a complaint with the relevant data protection authority

**Exercising Your Rights:**
- Contact: [Your Privacy Contact Email]
- Submit requests through the application's privacy settings
- Response time: Within 30 days of request

### 6.5 Data Retention

**Active Members:** Data is retained while the member is active and for 7 years after last activity.

**Inactive Members:** Data may be archived but retained for historical church records (with consent).

**Legal Requirements:** Some data must be retained for legal compliance (e.g., financial records, attendance for tax purposes).

**Deletion:** Personal data is securely deleted when:
- User requests deletion (and no legal retention requirement exists)
- Retention period expires
- Data is no longer necessary for stated purposes

### 6.6 Cookies and Tracking Technologies

**Essential Cookies:**
- Session cookies for authentication and security
- Required for application functionality
- No user consent required

**Analytics Cookies:**
- Anonymous usage analytics
- Used to improve application performance
- User consent obtained where required by law

**Cookie Management:**
- Users can manage cookie preferences through browser settings
- Application respects "Do Not Track" browser signals

### 6.7 Children's Privacy

ChMS may collect data about children (under 18) as part of family records. We:
- Require parental consent for children's data
- Limit data collection to necessary information
- Provide additional protections for children's data
- Allow parents to access, modify, or delete children's data

### 6.8 International Data Transfers

Data may be stored and processed in:
- Primary location: [Your Primary Data Center Location]
- Backup locations: [Backup Data Center Locations]

**Safeguards:**
- Data encryption in transit and at rest
- Standard contractual clauses for international transfers
- Compliance with applicable data protection laws

### 6.9 Contact Information

**Privacy Inquiries:**
- Email: [privacy@yourchurch.com]
- Address: [Your Church Address]
- Phone: [Your Contact Phone]

**Data Protection Officer (if applicable):**
- Email: [dpo@yourchurch.com]

**Response Time:** We respond to privacy inquiries within 30 days.

## 7. Incident Response Plan

### 7.1 Incident Response Team

**Roles and Responsibilities:**
- **Incident Coordinator:** Overall incident management and coordination
- **Technical Lead:** Technical investigation and remediation
- **Security Officer:** Security assessment and containment
- **Communications Lead:** Internal and external communications
- **Legal/Compliance:** Legal obligations and regulatory notifications

**Contact Information:**
- Incident Response Email: [security@yourchurch.com]
- Emergency Phone: [Emergency Contact Number]
- On-Call Rotation: [On-Call Schedule]

### 7.2 Incident Classification

**Severity Levels:**

**Critical (P1):**
- Active data breach or unauthorized access
- System compromise or malware infection
- Complete service outage
- **Response Time:** Immediate (within 1 hour)

**High (P2):**
- Potential data exposure
- Partial service degradation
- Suspicious activity requiring investigation
- **Response Time:** Within 4 hours

**Medium (P3):**
- Security misconfigurations
- Minor vulnerabilities
- Performance issues
- **Response Time:** Within 24 hours

**Low (P4):**
- Informational security events
- Non-critical vulnerabilities
- **Response Time:** Within 72 hours

### 7.3 Incident Response Process

#### Phase 1: Detection and Identification

**Detection Methods:**
- Automated security monitoring and alerts
- User reports of suspicious activity
- Security scanning and vulnerability assessments
- Log analysis and anomaly detection
- Third-party security notifications

**Identification Steps:**
1. Verify the incident is real (not a false positive)
2. Classify incident severity
3. Document initial findings
4. Notify incident response team
5. Begin incident tracking and logging

#### Phase 2: Containment

**Immediate Containment (Short-term):**
- Isolate affected systems or accounts
- Disable compromised user accounts
- Block malicious IP addresses
- Disconnect affected systems from network
- Preserve evidence for investigation

**Long-term Containment:**
- Implement temporary security measures
- Monitor for continued threats
- Maintain system functionality where possible
- Document containment actions

**Containment Actions by Incident Type:**

**Data Breach:**
- Revoke compromised credentials
- Disable affected user accounts
- Isolate affected database tables/systems
- Enable additional logging

**Malware/System Compromise:**
- Isolate affected servers/containers
- Disconnect from network
- Preserve system state for forensics
- Deploy clean system images if needed

**Unauthorized Access:**
- Revoke access tokens
- Disable compromised accounts
- Review and restrict permissions
- Enable multi-factor authentication

#### Phase 3: Eradication

**Removal Steps:**
1. Identify root cause of incident
2. Remove malware, backdoors, or unauthorized access
3. Patch vulnerabilities
4. Update security configurations
5. Remove compromised accounts or data
6. Verify complete removal

**Eradication Actions:**
- Clean infected systems
- Remove unauthorized access
- Patch security vulnerabilities
- Update security policies
- Strengthen access controls

#### Phase 4: Recovery

**Recovery Steps:**
1. Restore systems from clean backups
2. Verify system integrity
3. Re-enable services gradually
4. Monitor for recurrence
5. Validate functionality

**Recovery Checklist:**
- [ ] Systems restored from verified clean backups
- [ ] All vulnerabilities patched
- [ ] Security configurations updated
- [ ] Access controls strengthened
- [ ] Monitoring enhanced
- [ ] Functionality verified
- [ ] Performance validated

#### Phase 5: Post-Incident Activities

**Post-Mortem Analysis:**
1. Document incident timeline
2. Identify root causes
3. Assess impact (data, systems, users)
4. Review response effectiveness
5. Identify improvements
6. Update security policies and procedures

**Lessons Learned:**
- What went well?
- What could be improved?
- What preventive measures are needed?
- What training is required?

**Remediation Actions:**
- Update security controls
- Improve monitoring and detection
- Enhance training and awareness
- Revise policies and procedures
- Implement additional safeguards

### 7.4 Notification Requirements

**Internal Notifications:**
- Incident response team: Immediate
- Management: Within 1 hour (Critical), 4 hours (High)
- All staff: Within 24 hours (if user data affected)

**External Notifications:**

**Regulatory (GDPR, etc.):**
- Data Protection Authority: Within 72 hours of becoming aware
- Affected individuals: Without undue delay if high risk

**Third Parties:**
- Service providers: If their systems affected
- Law enforcement: If criminal activity suspected
- Insurance: If covered by cyber insurance

**Notification Content:**
- Nature of the incident
- Categories and approximate number of affected individuals
- Likely consequences
- Measures taken or proposed to address the breach
- Contact information for inquiries

### 7.5 Incident Documentation

**Required Documentation:**
- Incident report (timeline, impact, response)
- Evidence preservation (logs, screenshots, system state)
- Communication records (internal and external)
- Remediation actions taken
- Post-mortem analysis
- Lessons learned and improvements

**Retention:** Incident documentation retained for 7 years or as required by law.

### 7.6 Testing and Training

**Regular Testing:**
- Tabletop exercises: Quarterly
- Simulated incidents: Annually
- Review and update plan: Annually

**Training:**
- Incident response team training: Annually
- Security awareness training: Quarterly
- Role-specific training: As needed

## 8. Compliance

### 8.1 GDPR Compliance (General Data Protection Regulation)

**Applicability:** ChMS complies with GDPR for processing personal data of EU residents.

**Key Compliance Measures:**

**Lawful Basis for Processing:**
- **Consent:** Explicit consent obtained for data processing
- **Legitimate Interest:** Processing necessary for church operations
- **Legal Obligation:** Compliance with legal requirements
- **Contract:** Processing necessary for service delivery

**Data Subject Rights (Article 15-22):**
- ✅ Right to access personal data
- ✅ Right to rectification
- ✅ Right to erasure
- ✅ Right to restrict processing
- ✅ Right to data portability
- ✅ Right to object
- ✅ Rights related to automated decision-making

**Data Protection by Design and by Default (Article 25):**
- Privacy considerations built into system design
- Minimal data collection (data minimization)
- Default privacy settings
- Encryption and security measures

**Data Protection Impact Assessment (DPIA):**
- Conducted for high-risk processing activities
- Documented and reviewed regularly

**Data Processing Agreements:**
- Contracts with third-party processors include GDPR-compliant terms
- Regular review of processor compliance

**Data Breach Notification:**
- Notify supervisory authority within 72 hours
- Notify data subjects without undue delay if high risk

### 8.2 Other Compliance Frameworks

**UK GDPR:**
- Complies with UK GDPR post-Brexit requirements
- Applies to UK-based data subjects

**Data Protection Act 2018 (UK):**
- Complies with UK data protection legislation
- Respects data subject rights

**PCI DSS (if processing payments):**
- Secure payment processing (if applicable)
- Cardholder data protection
- Regular security assessments

**ISO 27001 (Future Consideration):**
- Information security management system
- Regular audits and certifications

### 8.3 Compliance Monitoring

**Regular Reviews:**
- Privacy policy review: Annually
- Data processing activities audit: Annually
- Third-party processor review: Annually
- Compliance training: Annually

**Compliance Officer:**
- Designated person responsible for data protection compliance
- Contact: [compliance@yourchurch.com]

## 9. Regular Audits

### 9.1 Security Audits

**Frequency:**
- **Automated Scans:** Weekly (dependency vulnerabilities)
- **Manual Code Review:** Before major releases
- **Penetration Testing:** Annually or before major releases
- **Security Configuration Review:** Quarterly

**Audit Scope:**
- Code security review
- Vulnerability scanning
- Configuration review
- Access control review
- Log analysis
- Incident response testing

**Tools Used:**
- `npm audit` / `composer audit` (dependency scanning)
- Strix (AI-powered security testing)
- Manual security reviews
- Automated security scanners

### 9.2 Privacy Audits

**Frequency:**
- Data processing activities review: Annually
- Privacy policy review: Annually
- Data retention review: Quarterly
- Third-party processor review: Annually

**Audit Scope:**
- Data collection practices
- Data usage and sharing
- User rights implementation
- Consent management
- Data retention and deletion
- Third-party data sharing

### 9.3 Compliance Audits

**Frequency:**
- GDPR compliance review: Annually
- Legal requirement review: Annually
- Policy and procedure review: Annually

**Audit Scope:**
- Compliance with applicable laws
- Policy adherence
- Documentation completeness
- Training effectiveness

### 9.4 Audit Documentation

**Required Records:**
- Audit reports and findings
- Remediation actions taken
- Follow-up reviews
- Lessons learned

**Retention:** Audit documentation retained for 7 years.

## 10. Policy Updates

This security and privacy policy is reviewed and updated:
- **Annually:** Full policy review
- **As Needed:** Updates for legal changes, new features, or security improvements
- **Version Control:** All policy versions are maintained and dated

**Last Updated:** [Date]
**Version:** 1.0
**Next Review:** [Date + 1 year]

**Change Log:**
- v1.0 (2025-01-XX): Initial comprehensive policy with privacy, incident response, and compliance sections
