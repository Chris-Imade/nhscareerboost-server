# Deployment Checklist - Appointment Scheduling Update

## Pre-Deployment Verification

### ✅ Code Changes Complete
- [x] Updated `/routes/contact.js` with date/time validation
- [x] Updated `/emails/contactTemplate.js` with appointment fields
- [x] Created test script `test-contact-with-appointment.sh`
- [x] Created documentation `APPOINTMENT_UPDATE.md`

### 🧪 Local Testing (Before Deploy)

1. **Start the local server:**
   ```bash
   npm start
   ```

2. **Run the test script:**
   ```bash
   ./test-contact-with-appointment.sh
   ```

3. **Verify test results:**
   - Test 1 (valid booking) should succeed ✅
   - Tests 2-5 (invalid data) should fail with proper error messages ❌
   - Test 6 (minimal fields) should succeed ✅

4. **Check email delivery:**
   - Verify client confirmation email includes appointment details
   - Verify admin notification email shows highlighted appointment box
   - Check both HTML and plain text versions

## Deployment Steps

### 1. Commit Changes
```bash
git add .
git commit -m "feat: Add appointment date and time scheduling to contact form

- Add validation for appointmentDate (YYYY-MM-DD) and appointmentTime (HH:MM)
- Update email templates to display appointment details
- Add formatted date display in UK format
- Include appointment highlight box in admin emails
- Add comprehensive test script
- Prevent past date bookings"

git push origin main
```

### 2. Monitor Render Deployment
- Go to: https://dashboard.render.com
- Watch the deployment logs
- Wait for "Build successful" and "Deploy live"
- Typical deployment time: 2-5 minutes

### 3. Post-Deployment Testing

**Test the production endpoint:**
```bash
# Edit test script to use production URL
sed -i '' 's|http://localhost:3000|https://nhscareerboost-server.onrender.com|' test-contact-with-appointment.sh

# Run tests against production
./test-contact-with-appointment.sh
```

**Manual test with curl:**
```bash
curl -X POST https://nhscareerboost-server.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-test-email@example.com",
    "phone": "07123456789",
    "service": "CV Review & Optimisation",
    "appointmentDate": "2025-11-20",
    "appointmentTime": "14:30",
    "message": "Test booking from updated API"
  }'
```

### 4. Frontend Coordination

**Ensure frontend is updated to send:**
- `appointmentDate` in YYYY-MM-DD format
- `appointmentTime` in HH:MM format (24-hour)

**Frontend must handle new error responses:**
```javascript
{
  "success": false,
  "errors": [
    {
      "field": "appointmentDate",
      "message": "Appointment date is required"
    }
  ]
}
```

## Verification Checklist

### Backend Verification
- [ ] Server starts without errors
- [ ] Health check endpoint responds: `GET /health`
- [ ] Contact endpoint accepts new fields
- [ ] Validation rejects invalid dates/times
- [ ] Validation rejects past dates
- [ ] Email delivery works for both client and admin

### Email Verification
- [ ] Client email shows appointment date (formatted)
- [ ] Client email shows appointment time with UK timezone
- [ ] Client email includes "What's Next?" section
- [ ] Admin email has yellow highlight box for appointment
- [ ] Admin email subject includes date
- [ ] Plain text versions render correctly

### Integration Verification
- [ ] Frontend successfully submits bookings
- [ ] Calendar buttons appear after successful booking
- [ ] Google Calendar integration works
- [ ] Apple Calendar (.ics) download works
- [ ] Payment flow remains unaffected

## Rollback Plan

If issues occur:

1. **Quick rollback via Render:**
   - Go to Render Dashboard
   - Select the service
   - Click "Manual Deploy"
   - Choose previous successful deployment

2. **Or revert git commit:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Notify frontend team** to revert their changes if needed

## Monitoring

### Check These After Deployment

1. **Server Logs (Render Dashboard):**
   - Look for any error messages
   - Verify successful email sends: `✅ Contact form processed successfully`
   - Check for validation errors

2. **Email Delivery:**
   - Test with real email addresses
   - Check spam folders
   - Verify formatting on different email clients

3. **Error Rates:**
   - Monitor for increased 400 errors (validation)
   - Monitor for 500 errors (server issues)

## Support Contacts

- **Backend Issues:** Check Render logs and server health
- **Email Issues:** Verify ZeptoMail dashboard and API limits
- **Frontend Issues:** Coordinate with frontend developer
- **Admin Email:** daniel@nhscareerboost.co.uk

## Success Criteria

✅ Deployment is successful when:
1. All tests pass on production
2. Client receives formatted appointment confirmation
3. Admin receives highlighted appointment notification
4. No increase in error rates
5. Frontend integration works smoothly
6. Calendar integrations function properly

---

**Last Updated:** November 13, 2025
**Version:** 1.0.0
**Status:** Ready for Deployment
