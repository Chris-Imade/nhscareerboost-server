# NHS Career Boost Mail Server

A lightweight Node.js + Express backend server that handles contact form submissions and Stripe payment notifications via email. No database required - all records are maintained through email copies to the admin.

## 📋 Features

- **Contact Form Handler** - Processes consultation inquiries and sends confirmations
- **Payment Webhooks** - Handles Stripe payment success/failure events
- **Email Notifications** - Sends professional HTML emails to clients and admin
- **Security** - Rate limiting, CORS protection, input validation, and Helmet security headers
- **No Database** - All records maintained via email copies to admin

## 🏗️ Project Structure

```
/server
 ├── index.js                          # Express server entry point
 ├── /routes
 │    ├── contact.js                   # POST /api/contact handler
 │    └── payment.js                   # POST /api/payment/webhook handler
 ├── /emails
 │    ├── contactTemplate.js           # Contact form email templates
 │    ├── paymentSuccessTemplate.js    # Payment success email templates
 │    └── paymentFailureTemplate.js    # Payment failure email template
 ├── .env.example                      # Environment variables template
 ├── .gitignore                        # Git ignore rules
 ├── package.json                      # Dependencies and scripts
 └── README.md                         # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=daniel@nhscareerboost.co.uk
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=daniel@nhscareerboost.co.uk

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Admin Configuration
ADMIN_EMAIL=daniel@nhscareerboost.co.uk

# CORS Configuration
ALLOWED_ORIGINS=https://nhscareerboost.co.uk,http://127.0.0.1:5500
```

### 3. Gmail App Password Setup

To use Gmail SMTP, you need to generate an App Password:

1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security → 2-Step Verification → App passwords
4. Generate a new app password for "Mail"
5. Use this 16-character password in `SMTP_PASSWORD`

### 4. Stripe Webhook Setup

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Developers → Webhooks
3. Click "Add endpoint"
4. Enter your webhook URL: `https://yourdomain.com/api/payment/webhook`
5. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## 📡 API Endpoints

### Health Check
```http
GET /health
```

Returns server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "NHS Career Boost Mail Server"
}
```

---

### Contact Form Submission
```http
POST /api/contact
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+44 7700 900000",
  "service": "CV Review",
  "message": "I would like help with my NHS CV"
}
```

**Required Fields:**
- `name` (string, 2-100 characters)
- `email` (valid email address)
- `service` (string)

**Optional Fields:**
- `phone` (string, 10-20 characters)
- `message` (string, max 2000 characters)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you shortly."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}
```

**Rate Limit:** 5 requests per 15 minutes per IP

**Email Flow:**
1. Client receives confirmation email
2. Admin receives detailed notification email
3. Admin receives copy of client confirmation

---

### Stripe Webhook
```http
POST /api/payment/webhook
Content-Type: application/json
Stripe-Signature: [signature]
```

This endpoint is called automatically by Stripe. Do not call it manually.

**Handled Events:**
- `payment_intent.succeeded` - Sends success emails to client and admin
- `payment_intent.payment_failed` - Sends failure notification to admin

**Rate Limit:** 100 requests per minute

## 🔒 Security Features

- **Helmet** - Sets secure HTTP headers
- **CORS** - Restricts origins to configured domains only
- **Rate Limiting** - Prevents abuse of contact form and webhook endpoints
- **Input Validation** - Validates and sanitizes all user inputs
- **Webhook Signature Verification** - Validates Stripe webhook authenticity
- **Environment Variables** - Sensitive data never hardcoded

## 📧 Email Templates

### Contact Form Emails

**Client Confirmation:**
- Professional branded HTML email
- Confirms receipt of inquiry
- Includes submitted details
- Provides contact information

**Admin Notification:**
- Detailed form submission data
- Timestamp and customer information
- Action reminder (respond within 24 hours)

### Payment Emails

**Success - Client:**
- Payment confirmation
- Transaction details
- Receipt information

**Success - Admin:**
- Payment received notification
- Customer details
- Action reminder (fulfill service)

**Failure - Admin:**
- Payment failure alert
- Error details
- Link to Stripe dashboard
- Action items

## 🧪 Testing

### Test Contact Form

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "service": "CV Review",
    "message": "This is a test"
  }'
```

### Test Webhook (using Stripe CLI)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/payment/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
```

## 🚢 Deployment

### Environment Variables Checklist

Before deploying, ensure all environment variables are set:

- [ ] `PORT`
- [ ] `NODE_ENV=production`
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASSWORD`
- [ ] `SMTP_FROM`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `ADMIN_EMAIL`
- [ ] `ALLOWED_ORIGINS`

### Deployment Platforms

**Recommended platforms:**
- **Railway** - Easy Node.js deployment
- **Render** - Free tier available
- **DigitalOcean App Platform** - Simple and reliable
- **Heroku** - Classic choice
- **AWS Elastic Beanstalk** - Enterprise option

### Post-Deployment Steps

1. Update Stripe webhook URL to your production domain
2. Update `ALLOWED_ORIGINS` to include your production frontend URL
3. Test contact form from production frontend
4. Test a small Stripe payment to verify webhooks
5. Monitor logs for any errors

## 📊 Monitoring

The server logs all important events:

- ✅ Successful operations
- ⚠️ Warnings (e.g., blocked CORS requests)
- ❌ Errors (with details)
- 📧 Email sending status

**Log Examples:**
```
✅ Contact form processed successfully for john@example.com
💰 Payment succeeded: pi_xxxxx
❌ Error processing contact form: [error details]
⚠️ Blocked request from origin: https://unauthorized-site.com
```

## 🛠️ Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials** - Verify Gmail app password is correct
2. **Enable less secure apps** - Not needed if using app password
3. **Check firewall** - Ensure port 587 is not blocked
4. **Test SMTP connection** - Use a tool like `telnet smtp.gmail.com 587`

### Webhook Not Working

1. **Verify webhook secret** - Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
2. **Check endpoint URL** - Ensure it's publicly accessible
3. **Review Stripe logs** - Check webhook delivery attempts in Stripe dashboard
4. **Test with Stripe CLI** - Use `stripe listen` for local testing

### CORS Errors

1. **Check origin** - Ensure frontend URL is in `ALLOWED_ORIGINS`
2. **Include protocol** - Use `https://` not just domain name
3. **No trailing slash** - Use `https://example.com` not `https://example.com/`

### Rate Limiting Issues

If legitimate users are being rate-limited, adjust limits in `index.js`:

```javascript
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Increase time window
  max: 10, // Increase max requests
  // ...
});
```

## 📝 License

ISC

## 👤 Contact

For issues or questions, contact: daniel@nhscareerboost.co.uk

---

**Built with ❤️ for NHS Career Boost**
