# Quick Start Guide

Get your NHS Career Boost Mail Server running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
nano .env
```

**Required values to update in `.env`:**

1. **Gmail App Password:**
   - Go to https://myaccount.google.com/security
   - Enable 2FA if not already enabled
   - Go to "App passwords"
   - Generate password for "Mail"
   - Paste into `SMTP_PASSWORD`

2. **Stripe Keys:**
   - Log into https://dashboard.stripe.com
   - Get your secret key: `sk_live_...` or `sk_test_...`
   - Paste into `STRIPE_SECRET_KEY`

3. **Stripe Webhook Secret:**
   - Go to https://dashboard.stripe.com/webhooks
   - Create endpoint: `https://yourdomain.com/api/payment/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy signing secret: `whsec_...`
   - Paste into `STRIPE_WEBHOOK_SECRET`

## Step 3: Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

You should see:
```
==================================================
🚀 NHS Career Boost Mail Server
==================================================
📡 Server running on port 3000
🌍 Environment: production
📧 SMTP Host: smtp.gmail.com
📬 Admin Email: daniel@nhscareerboost.co.uk
🔒 CORS Origins: https://nhscareerboost.co.uk, http://127.0.0.1:5500
==================================================
✅ Server ready to accept requests
==================================================
```

## Step 4: Test the Server

**Option A: Use the test script**
```bash
./test-contact.sh
```

**Option B: Manual curl test**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: http://127.0.0.1:5500" \
  -d '{
    "name": "Test User",
    "email": "your-email@example.com",
    "service": "CV Review",
    "message": "Test message"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you shortly."
}
```

**Check your email!** You should receive:
1. Email to the test user (your-email@example.com)
2. Two emails to admin (daniel@nhscareerboost.co.uk)

## Step 5: Connect Your Frontend

Update your frontend form to POST to:
```
https://yourdomain.com/api/contact
```

**Example JavaScript:**
```javascript
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    service: form.service.value,
    message: form.message.value
  };
  
  try {
    const response = await fetch('https://yourdomain.com/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Thank you! We will contact you soon.');
      form.reset();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
});
```

## Troubleshooting

### "Missing required environment variables"
- Check your `.env` file exists
- Ensure all variables from `.env.example` are filled in
- No spaces around the `=` sign

### "SMTP connection failed"
- Verify Gmail app password is correct (16 characters, no spaces)
- Check SMTP_HOST is `smtp.gmail.com`
- Check SMTP_PORT is `587`

### "CORS policy error"
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Include the protocol: `https://example.com`
- No trailing slash

### "Webhook signature verification failed"
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Ensure webhook endpoint URL is correct
- Check webhook is sending to the right environment (test/live)

## Next Steps

1. **Deploy to production** - See README.md for deployment guides
2. **Update Stripe webhook URL** - Point to your production domain
3. **Test payment flow** - Make a test payment to verify webhooks
4. **Monitor logs** - Watch for any errors or issues

## Support

For help, contact: daniel@nhscareerboost.co.uk

---

**You're all set! 🎉**
