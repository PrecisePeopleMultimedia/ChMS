# Attendance System Setup Guide

## ✅ Completed Steps

### 1. QR Code Library Installation
- ✅ Installed `qrcode` package in frontend
- ✅ Installed `@types/qrcode` for TypeScript support

### 2. Backend Implementation
- ✅ Database migrations created:
  - `2025_11_04_000001_create_services_table.php`
  - `2025_11_04_000002_create_attendance_records_table.php`
  - `2025_11_04_000003_create_member_qr_codes_table.php`
- ✅ Models created: `Service`, `AttendanceRecord`, `MemberQrCode`
- ✅ Controllers created: `AttendanceController`, `ServiceController`
- ✅ API routes configured in `backend/routes/api.php`

### 3. Frontend Implementation
- ✅ Attendance store created: `frontend/src/stores/attendance.ts`
- ✅ Components created:
  - `ServiceSelector.vue` - Service selection
  - `ManualCheckIn.vue` - Manual member check-in
  - `QRScanner.vue` - QR code scanning
  - `FamilyCheckIn.vue` - Family check-in
  - `AttendanceDashboard.vue` - Live dashboard
  - `MemberQrCodeDisplay.vue` - QR code generation
- ✅ Views created:
  - `AttendanceCheckInView.vue` - Main check-in interface
  - `AttendanceReportsView.vue` - Reports and analytics
- ✅ Routes added to `frontend/src/router/index.ts`
- ✅ Offline sync integrated with attendance store

## 🔧 Manual Steps Required

### 1. Run Database Migrations

Once Docker services are running properly, execute:

```bash
docker-compose exec backend php artisan migrate
```

Or if running Laravel directly (not in Docker):

```bash
cd backend
php artisan migrate
```

### 2. Verify Services Are Running

Check Docker services status:

```bash
docker-compose ps
```

If PostgreSQL is failing, check logs:

```bash
docker-compose logs postgres
```

Common issues:
- Volume permissions
- Port conflicts (5433)
- Database initialization errors

### 3. Test the System

#### A. Create Services
1. Navigate to the admin panel
2. Create a new service:
   - Name: "Sunday Morning Service"
   - Service Type: "sunday_morning"
   - Scheduled Date: Today's date
   - Start Time: 09:00
   - End Time: 11:00

#### B. Test Manual Check-In
1. Go to `/attendance/checkin`
2. Select a service
3. Click "Manual" tab
4. Search for a member by name
5. Click check-in button
6. Verify success notification

#### C. Test QR Code Check-In
1. Generate QR code for a member (from member detail page)
2. Go to `/attendance/checkin`
3. Click "QR Code" tab
4. Either:
   - Scan QR code with camera (if implemented)
   - Or paste QR code data manually
5. Verify check-in success

#### D. Test Family Check-In
1. Go to `/attendance/checkin`
2. Click "Family" tab
3. Search for a family
4. Select family members to check in
5. Click "Check In Family"
6. Verify all members checked in

#### E. Test Offline Functionality
1. Disconnect from internet (disable network adapter)
2. Try checking in a member manually
3. Verify it queues for sync
4. Reconnect to internet
5. Verify records sync automatically

#### F. View Attendance Reports
1. Go to `/attendance/reports`
2. Select date range
3. Optionally filter by service
4. Click "Generate Report"
5. Verify statistics display correctly

## 📝 Testing Checklist

- [ ] Database migrations run successfully
- [ ] Services can be created via API
- [ ] Manual check-in works
- [ ] QR code generation works
- [ ] QR code check-in works (manual input)
- [ ] Family check-in works
- [ ] Visitor registration works
- [ ] Offline check-in queues correctly
- [ ] Online sync works after reconnecting
- [ ] Attendance reports display correctly
- [ ] Attendance dashboard shows live data

## 🐛 Troubleshooting

### Migration Errors
If migrations fail, check:
- Database connection settings
- PostgreSQL is running
- Database user has proper permissions

### QR Code Not Generating
- Ensure `qrcode` package is installed: `npm list qrcode`
- Check browser console for errors
- Verify member ID is valid

### Offline Sync Not Working
- Check IndexedDB is available in browser
- Verify offline sync service is initialized
- Check browser console for sync errors

### API Errors
- Verify backend is running on port 8000
- Check CORS settings
- Verify authentication token is valid

## 📚 API Endpoints

### Services
- `GET /api/services` - List services
- `POST /api/services` - Create service
- `GET /api/services/{id}` - Get service details
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service
- `GET /api/services/{id}/attendance-stats` - Get service statistics

### Attendance
- `GET /api/attendance` - List attendance records
- `POST /api/attendance` - Manual check-in
- `POST /api/attendance/qr-checkin` - QR code check-in
- `POST /api/attendance/family-checkin` - Family check-in
- `GET /api/attendance/reports` - Get reports

### QR Codes
- `GET /api/members/{member}/qr-code` - Generate member QR code
- `GET /api/qr-codes/families/{family}/generate` - Generate family QR code

## 🎯 Next Steps

After basic functionality is verified:

1. **Implement Camera QR Scanning**
   - Install `jsQR` or `html5-qrcode` library
   - Enhance `QRScanner.vue` component
   - Test on mobile devices

2. **Add Service Management UI**
   - Create service creation form
   - Add service scheduling interface
   - Implement recurring service templates

3. **Enhance Reports**
   - Add charts and graphs
   - Export to CSV/PDF
   - Add date range filters

4. **Improve Offline Experience**
   - Add offline indicator
   - Show sync status
   - Display queued items count

5. **Add Notifications**
   - Check-in success notifications
   - Sync completion alerts
   - Error notifications

