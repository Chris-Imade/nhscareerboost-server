# Appointment Scheduling Backend Update

## Overview
The backend API has been successfully updated to support appointment date and time selection for consultation bookings.

## Changes Made

### 1. Updated Contact Route (`routes/contact.js`)

#### New Validation Rules
Added validation for two new required fields:
- **`appointmentDate`**: 
  - Required field
  - Format: `YYYY-MM-DD`
  - Must not be in the past
  - Regex validation: `/^\d{4}-\d{2}-\d{2}$/`

- **`appointmentTime`**: 
  - Required field
  - Format: `HH:MM` (24-hour)
  - Regex validation: `/^([01]\d|2[0-3]):([0-5]\d)$/`

#### Request Handler Updates
- Extracts `appointmentDate` and `appointmentTime` from request body
- Passes these fields to email templates
- Maintains backward compatibility with existing error handling

### 2. Updated Email Templates (`emails/contactTemplate.js`)

#### Client Confirmation Email
**Changes:**
- Added formatted appointment date display (e.g., "Wednesday, 20 November 2025")
- Shows preferred appointment time with UK timezone indicator
- Added "What's Next?" section explaining 24-hour advance meeting details
- Updated subject line and messaging to reflect booking confirmation

**New Fields Displayed:**
- Preferred Date: [Formatted date]
- Preferred Time: [HH:MM] (UK Time)

#### Admin Notification Email
**Changes:**
- Updated subject line to "New Consultation Booking" with date
- Added prominent appointment highlight box with yellow background
- Displays appointment date and time in both highlighted section and detail rows
- Updated plain text version for email clients without HTML support

**Visual Enhancements:**
- 📅 Emoji indicators for appointment information
- Yellow highlight box (`.appointment-highlight`) for scheduled appointments
- Larger font size (18px) for appointment details in admin email

### 3. Validation Features

#### Date Validation
```javascript
// Ensures date is not in the past
const date = new Date(value);
const today = new Date();
today.setHours(0, 0, 0, 0);
if (date < today) {
  throw new Error('Appointment date cannot be in the past');
}
```

#### Time Validation
- Accepts 24-hour format only (00:00 to 23:59)
- Validates proper hour and minute ranges

## API Request Format

### Endpoint
```
POST https://nhscareerboost-server.onrender.com/api/contact
```

### Request Body
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "07123456789",
  "service": "CV Review & Optimisation",
  "appointmentDate": "2025-11-20",
  "appointmentTime": "14:30",
  "message": "Payment ID: pi_123abc\nNHS Band: Band 5\nRole: Senior Nurse"
}
```

### Success Response
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you shortly."
}
```

### Error Response (Validation Failure)
```json
{
  "success": false,
  "errors": [
    {
      "field": "appointmentDate",
      "message": "Appointment date is required"
    },
    {
      "field": "appointmentTime",
      "message": "Appointment time must be in HH:MM format (24-hour)"
    }
  ]
}
```

## Testing

### Test Script
A comprehensive test script has been created: `test-contact-with-appointment.sh`

**Test Cases:**
1. ✅ Valid booking with all fields
2. ❌ Missing appointment date
3. ❌ Invalid date format (DD/MM/YYYY)
4. ❌ Invalid time format (12-hour format)
5. ❌ Past date
6. ✅ Valid booking with minimal fields

### Running Tests

#### Local Testing
```bash
# Start the server
npm start

# In another terminal, run tests
./test-contact-with-appointment.sh
```

#### Production Testing
```bash
# Edit the script to use production URL
# Change: BASE_URL="https://nhscareerboost-server.onrender.com"
./test-contact-with-appointment.sh
```

## Email Examples

### Client Receives:
**Subject:** Thank You for Contacting NHS Career Boost

**Content:**
- Confirmation of booking request
- Service selected
- Preferred appointment date (formatted)
- Preferred appointment time (UK Time)
- Contact information
- "What's Next?" section with 24-hour advance notice info

### Admin Receives:
**Subject:** New Consultation Booking - [Service] - [Date]

**Content:**
- Highlighted appointment box with date and time
- Full customer details
- Service information
- Additional notes/message
- Action required reminder

## Deployment Notes

### Environment Variables
No new environment variables required. Uses existing:
- `ZEPTOMAIL_URL`
- `ZEPTOMAIL_TOKEN`
- `ZEPTOMAIL_FROM_ADDRESS`
- `ZEPTOMAIL_FROM_NAME`
- `ADMIN_EMAIL`

### Dependencies
No new dependencies added. Uses existing:
- `express-validator` (for validation)
- `axios` (for ZeptoMail API)

### Backward Compatibility
- All changes are additive
- New fields are required, so frontend must be updated simultaneously
- Existing error handling and rate limiting unchanged

## Frontend Integration

The frontend should send requests in this format:
```javascript
const bookingData = {
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  service: formData.service,
  appointmentDate: formData.appointmentDate, // YYYY-MM-DD
  appointmentTime: formData.appointmentTime, // HH:MM
  message: formData.message
};

const response = await fetch('https://nhscareerboost-server.onrender.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bookingData)
});
```

## Next Steps (Recommended)

1. **Deploy to Production**
   - Push changes to GitHub
   - Render will auto-deploy

2. **Test with Real Data**
   - Use test email addresses
   - Verify email delivery and formatting

3. **Monitor Logs**
   - Check for any validation errors
   - Monitor email delivery success rates

4. **Future Enhancements** (Optional)
   - Add database storage for appointment tracking
   - Implement calendar sync (Google Calendar, iCal)
   - Add automated reminder system
   - Create admin dashboard for appointment management
   - Add availability checking to prevent double-booking

## Files Modified

1. `/routes/contact.js` - Added validation and field extraction
2. `/emails/contactTemplate.js` - Updated both email templates
3. `/test-contact-with-appointment.sh` - New test script (created)
4. `/APPOINTMENT_UPDATE.md` - This documentation (created)

## Support

For issues or questions:
- Check server logs for detailed error messages
- Verify date/time formats match specifications
- Ensure CORS settings allow frontend origin
- Contact: daniel@nhscareerboost.co.uk
