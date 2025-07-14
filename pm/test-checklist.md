# Test Checklist - ChMS MVP

## Scope
This checklist covers only the MVP features:
- Organization management
- Member management
- Attendance (QR code, search/autocomplete, offline queue)
- Minimal reporting

## Checklist

### Organization Management
- [ ] Can create a new organization
- [ ] Can update organization settings (minimal)
- [ ] Can view organization details

### Member Management
- [ ] Can add a new member
- [ ] Can update member profile
- [ ] Can link family units (minimal)
- [ ] Can search for a member (autocomplete)
- [ ] Can view member details

### Attendance
- [ ] Can check in member via QR code
- [ ] Can check in member via search/autocomplete
- [ ] Confirmation prompt appears before sign-in
- [ ] Animated feedback (checkbox) on successful sign-in
- [ ] Attendance works offline and syncs when online
- [ ] Attendance data is stored and retrievable

### Reporting
- [ ] Can view minimal attendance summary/report

## Excluded (Future)
- AI/agent onboarding
- WhatsApp/USSD fallback
- Payments
- Advanced analytics
- Communication features
- Multi-language support
- Media integration

## Notes
- All tests should be written using TDD/BDD approach
- All features tracked in GitHub Projects
