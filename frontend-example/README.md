# Frontend Payment Integration - Quick Start

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your Stripe Publishable Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_live_` or `pk_test_`)
3. ⚠️ **NEVER** use your Secret key in the frontend!

### Step 2: Update payment.html

Open `payment.html` and update these lines (around line 240):

```javascript
// Replace this:
const STRIPE_PUBLISHABLE_KEY = 'pk_live_YOUR_PUBLISHABLE_KEY_HERE';

// With your actual key:
const STRIPE_PUBLISHABLE_KEY = 'pk_live_abc123...';

// Replace this:
const API_URL = 'https://your-server-domain.com';

// With your server URL:
const API_URL = 'https://nhscareerboost-server.com'; // Production
// OR
const API_URL = 'http://localhost:3000'; // Local testing
```

### Step 3: Test It!

Open `payment.html` in your browser and test with these cards:

**Test Cards (for development mode):**
- ✅ Success: `4242 4242 4242 4242`
- ❌ Decline: `4000 0000 0000 0002`
- 🔐 3D Secure: `4000 0027 6000 3184`

Use any future expiry date, any 3-digit CVC, any postal code.

## 📋 Integration Checklist

- [ ] Stripe Publishable Key added to `payment.html`
- [ ] API_URL updated to point to your server
- [ ] Server is running and accessible
- [ ] Webhook configured in Stripe Dashboard
- [ ] CORS configured to allow your frontend domain
- [ ] Test payment completed successfully
- [ ] Email notifications received

## 🔧 Server Configuration

Your server is already configured with:
- ✅ Stripe Secret Key
- ✅ Webhook Secret
- ✅ Payment endpoint: `/api/payment/create-payment-intent`
- ✅ Webhook endpoint: `/api/payment/webhook`
- ✅ Email notifications via ZeptoMail

## 🌐 CORS Setup

Your server allows requests from:
```
https://nhscareerboost.co.uk
http://127.0.0.1:5500
http://localhost:5500
```

To add more origins, update `.env`:
```
ALLOWED_ORIGINS=https://nhscareerboost.co.uk,https://www.nhscareerboost.co.uk,http://localhost:5500
```

## 🔗 Webhook Setup

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: `https://your-server-domain.com/api/payment/webhook`
4. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the signing secret (already in your `.env` ✅)

## 📧 Email Flow

When payment succeeds:
1. Customer receives confirmation email
2. Admin receives notification email
3. Admin receives copy of customer email

When payment fails:
- Admin receives failure notification

## 🧪 Testing Locally

### 1. Start your server:
```bash
cd /Users/henryjohntech/Documents/Builds/backendProjects/nhs-server
npm start
```

### 2. Expose webhook endpoint (for Stripe to reach your local server):
```bash
# Install ngrok if you haven't
brew install ngrok

# Expose your local server
ngrok http 3000
```

### 3. Update Stripe webhook URL:
- Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
- Update webhook in Stripe Dashboard to: `https://abc123.ngrok.io/api/payment/webhook`

### 4. Open payment.html:
```bash
# Open in browser
open payment.html
```

## 🎨 Customization

### Change Payment Amount

In `payment.html`, update:
```javascript
const PAYMENT_AMOUNT = 9900; // £99.00 in pence
```

### Change Colors

Update the CSS in `payment.html`:
```css
background: linear-gradient(135deg, #005EB8 0%, #003087 100%);
```

### Add More Fields

Add to the form:
```html
<div class="form-group">
    <label for="phone">Phone Number</label>
    <input type="tel" id="phone" name="phone">
</div>
```

And include in the payment intent:
```javascript
metadata: {
    service: 'NHS Career Boost',
    phone: document.getElementById('phone').value,
}
```

## 🐛 Troubleshooting

### "Failed to create payment intent"
- Check server is running
- Verify API_URL is correct
- Check browser console for errors
- Verify CORS allows your domain

### "Webhook signature verification failed"
- Check webhook secret in `.env` matches Stripe Dashboard
- Ensure webhook URL is correct
- Check server logs for details

### "Payment not processing"
- Verify Stripe Publishable Key is correct
- Check card details are valid
- Look for errors in browser console
- Check Stripe Dashboard logs

### "No email received"
- Check ZeptoMail credentials in `.env`
- Verify email address is correct
- Check server logs for email errors
- Look in spam folder

## 📱 Production Deployment

### Before going live:

1. **Switch to live keys:**
   - Update `.env` with `sk_live_...` (already done ✅)
   - Update `payment.html` with `pk_live_...`

2. **Enable HTTPS:**
   - Your server must use HTTPS in production
   - Update webhook URL to use HTTPS

3. **Update CORS:**
   - Add production domain to `ALLOWED_ORIGINS`

4. **Test thoroughly:**
   - Test with real card (small amount)
   - Verify emails are sent
   - Check webhook events in Stripe Dashboard

5. **Monitor:**
   - Watch server logs
   - Check Stripe Dashboard for payments
   - Monitor email delivery

## 📞 Support

If you need help:
1. Check server logs: `npm start` output
2. Check browser console: F12 → Console
3. Check Stripe Dashboard: Logs section
4. Check Network tab: F12 → Network

## 🎯 Next Steps

- [ ] Customize the payment page design
- [ ] Add your logo
- [ ] Set up production webhook
- [ ] Test with real payment
- [ ] Deploy to production
- [ ] Monitor first transactions
