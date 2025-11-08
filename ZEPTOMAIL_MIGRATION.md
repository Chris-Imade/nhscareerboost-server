# ZeptoMail Migration Guide

The mail server has been updated to use **ZeptoMail** instead of Gmail SMTP.

## ✅ What Changed

### Dependencies
- ❌ Removed: `nodemailer`
- ✅ Added: `axios` (v1.6.2) - for ZeptoMail HTTP API calls

### Environment Variables
**Old (Gmail SMTP):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=daniel@nhscareerboost.co.uk
SMTP_PASSWORD=your_app_password
SMTP_FROM=daniel@nhscareerboost.co.uk
```

**New (ZeptoMail):**
```env
ZEPTOMAIL_URL=https://api.zeptomail.com/v1.1/email
ZEPTOMAIL_TOKEN=Zoho-enczapikey wSsVR61//UKhCa90ymeoceo5n1tdVl3xEUh72Vui7XKuF6qU98c5xhefV1eiGfdLFzZpFTQVob0syx4D1zpai9h5zFoJCSiF9mqRe1U4J3x17qnvhDzKWmhamhCAKoMJxQltmmhiF8Ag+g==
ZEPTOMAIL_FROM_ADDRESS=noreply@nhscareerboost.co.uk
ZEPTOMAIL_FROM_NAME=NHS Career Boost
```

### Code Changes
- **`routes/contact.js`** - Updated to use ZeptoMail client
- **`routes/payment.js`** - Updated to use ZeptoMail client
- **`index.js`** - Updated environment variable validation
- **`package.json`** - Replaced nodemailer with zeptomail

## 🚀 Setup Instructions

### 1. Install New Dependencies

```bash
npm install
```

This will install the `zeptomail` package.

### 2. Update Environment Variables

Your `.env` file has already been updated with the ZeptoMail configuration:

```env
ZEPTOMAIL_URL=https://api.zeptomail.com/v1.1/email
ZEPTOMAIL_TOKEN=Zoho-enczapikey wSsVR61//UKhCa90ymeoceo5n1tdVl3xEUh72Vui7XKuF6qU98c5xhefV1eiGfdLFzZpFTQVob0syx4D1zpai9h5zFoJCSiF9mqRe1U4J3x17qnvhDzKWmhamhCAKoMJxQltmmhiF8Ag+g==
ZEPTOMAIL_FROM_ADDRESS=noreply@nhscareerboost.co.uk
ZEPTOMAIL_FROM_NAME=NHS Career Boost
```

### 3. Verify Domain Configuration

Ensure your domain `nhscareerboost.co.uk` is:
- ✅ Verified in ZeptoMail dashboard
- ✅ DNS records (SPF, DKIM) configured
- ✅ Sender address `noreply@nhscareerboost.co.uk` authorized

### 4. Test the Server

```bash
# Start the server
npm run dev

# Run tests
./test-contact.sh
```

## 📧 Email Sending Differences

### Gmail SMTP (Old)
```javascript
await transporter.sendMail({
  from: '"NHS Career Boost" <noreply@nhscareerboost.co.uk>',
  to: 'customer@example.com',
  subject: 'Subject',
  html: '<html>...</html>',
  text: 'Plain text...'
});
```

### ZeptoMail (New)
```javascript
await client.sendMail({
  from: {
    address: 'noreply@nhscareerboost.co.uk',
    name: 'NHS Career Boost'
  },
  to: [
    {
      email_address: {
        address: 'customer@example.com',
        name: 'Customer Name'
      }
    }
  ],
  subject: 'Subject',
  htmlbody: '<html>...</html>',
  textbody: 'Plain text...'
});
```

## ✨ Benefits of ZeptoMail

1. **No Gmail App Password** - No need for 2FA or app passwords
2. **Better Deliverability** - Dedicated transactional email service
3. **Domain-based Sending** - Send from your own domain
4. **API-based** - More reliable than SMTP
5. **Better Tracking** - Built-in email analytics
6. **Higher Limits** - More emails per day

## 🔍 Troubleshooting

### "Missing required environment variables"
**Solution:** Ensure all ZeptoMail variables are in your `.env` file:
- `ZEPTOMAIL_URL`
- `ZEPTOMAIL_TOKEN`
- `ZEPTOMAIL_FROM_ADDRESS`
- `ZEPTOMAIL_FROM_NAME`

### "Sender address not verified"
**Solution:** 
1. Log into ZeptoMail dashboard
2. Verify your domain `nhscareerboost.co.uk`
3. Add DNS records (SPF, DKIM)
4. Authorize sender address `noreply@nhscareerboost.co.uk`

### "Invalid token"
**Solution:** 
1. Check token in `.env` matches ZeptoMail dashboard
2. Ensure token includes `Zoho-enczapikey` prefix
3. No extra spaces or line breaks in token

### Emails not sending
**Solution:**
1. Check ZeptoMail dashboard for error logs
2. Verify domain is active
3. Check sender address is authorized
4. Review server logs for detailed errors

## 📊 Testing

### Test Contact Form
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: http://127.0.0.1:5500" \
  -d '{
    "name": "Test User",
    "email": "daniel@nhscareerboost.co.uk",
    "service": "CV Review",
    "message": "Testing ZeptoMail integration"
  }'
```

**Expected Result:**
- ✅ 200 OK response
- ✅ 3 emails sent via ZeptoMail
- ✅ Emails appear in ZeptoMail dashboard

## 🚢 Deployment

When deploying to production, update environment variables on your platform:

**Railway:**
```bash
railway variables set ZEPTOMAIL_URL=https://api.zeptomail.com/v1.1/email
railway variables set ZEPTOMAIL_TOKEN=your_token_here
railway variables set ZEPTOMAIL_FROM_ADDRESS=noreply@nhscareerboost.co.uk
railway variables set ZEPTOMAIL_FROM_NAME="NHS Career Boost"
```

**Render/Heroku/DigitalOcean:**
Update environment variables in the platform dashboard.

## 📚 Additional Resources

- **ZeptoMail Documentation:** https://www.zoho.com/zeptomail/help/
- **ZeptoMail API Reference:** https://www.zoho.com/zeptomail/help/api/
- **NPM Package:** https://www.npmjs.com/package/zeptomail

## ✅ Migration Checklist

- [x] Dependencies updated (`package.json`)
- [x] Environment variables updated (`.env`, `.env.example`)
- [x] Contact route updated (`routes/contact.js`)
- [x] Payment route updated (`routes/payment.js`)
- [x] Server validation updated (`index.js`)
- [ ] Run `npm install`
- [ ] Test locally
- [ ] Update production environment variables
- [ ] Deploy to production
- [ ] Test production emails

---

**Migration Complete!** 🎉

Your mail server now uses ZeptoMail for all email sending.
