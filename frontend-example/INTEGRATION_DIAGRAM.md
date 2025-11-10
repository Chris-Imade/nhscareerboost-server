# Payment Integration Flow Diagram

## 🔄 Complete Payment Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER JOURNEY                                 │
└─────────────────────────────────────────────────────────────────────────┘

1. Customer Opens Payment Page
   │
   │  payment.html (Your Frontend)
   │  ├── Name: John Smith
   │  ├── Email: john@example.com
   │  └── Card: 4242 4242 4242 4242
   │
   ▼

2. Customer Clicks "Pay Now"
   │
   │  JavaScript validates form
   │  Shows loading spinner
   │
   ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND COMMUNICATION                               │
└─────────────────────────────────────────────────────────────────────────┘

3. Frontend → Your Server
   │
   │  POST https://your-server.com/api/payment/create-payment-intent
   │  
   │  Request Body:
   │  {
   │    "amount": 9900,
   │    "currency": "gbp",
   │    "customerEmail": "john@example.com",
   │    "customerName": "John Smith"
   │  }
   │
   ▼

4. Your Server → Stripe API
   │
   │  routes/payment.js
   │  stripe.paymentIntents.create({
   │    amount: 9900,
   │    currency: 'gbp',
   │    receipt_email: 'john@example.com',
   │    ...
   │  })
   │
   ▼

5. Stripe → Your Server
   │
   │  Response:
   │  {
   │    "id": "pi_abc123...",
   │    "client_secret": "pi_abc123_secret_xyz..."
   │  }
   │
   ▼

6. Your Server → Frontend
   │
   │  Response:
   │  {
   │    "success": true,
   │    "clientSecret": "pi_abc123_secret_xyz...",
   │    "paymentIntentId": "pi_abc123..."
   │  }
   │
   ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                      PAYMENT CONFIRMATION                                │
└─────────────────────────────────────────────────────────────────────────┘

7. Frontend → Stripe (Direct)
   │
   │  stripe.confirmCardPayment(clientSecret, {
   │    payment_method: {
   │      card: cardElement,
   │      billing_details: { ... }
   │    }
   │  })
   │
   │  🔒 Card details NEVER touch your server
   │  🔒 Stripe handles all card processing
   │
   ▼

8. Stripe Processes Payment
   │
   │  ⏳ Validating card...
   │  ⏳ Checking funds...
   │  ⏳ Processing payment...
   │
   ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                         WEBHOOK NOTIFICATION                             │
└─────────────────────────────────────────────────────────────────────────┘

9. Stripe → Your Server (Webhook)
   │
   │  POST https://your-server.com/api/payment/webhook
   │  
   │  Headers:
   │  stripe-signature: t=123,v1=abc...
   │  
   │  Body:
   │  {
   │    "type": "payment_intent.succeeded",
   │    "data": {
   │      "object": {
   │        "id": "pi_abc123...",
   │        "amount": 9900,
   │        "receipt_email": "john@example.com",
   │        ...
   │      }
   │    }
   │  }
   │
   ▼

10. Your Server Verifies Webhook
    │
    │  routes/payment.js
    │  stripe.webhooks.constructEvent(
    │    req.body,
    │    signature,
    │    STRIPE_WEBHOOK_SECRET ← Verifies it's really from Stripe
    │  )
    │
    ▼

11. Your Server Sends Emails
    │
    │  ┌─────────────────────────────────────┐
    │  │ Email 1: Customer Confirmation      │
    │  │ To: john@example.com                │
    │  │ Subject: Payment Successful         │
    │  │ Body: Thank you for your payment... │
    │  └─────────────────────────────────────┘
    │
    │  ┌─────────────────────────────────────┐
    │  │ Email 2: Admin Notification         │
    │  │ To: daniel@nhscareerboost.co.uk     │
    │  │ Subject: New Payment Received       │
    │  │ Body: Payment of £99.00 from...     │
    │  └─────────────────────────────────────┘
    │
    │  ┌─────────────────────────────────────┐
    │  │ Email 3: Admin Copy                 │
    │  │ To: daniel@nhscareerboost.co.uk     │
    │  │ Subject: [Copy] Payment Successful  │
    │  │ Body: (Same as customer email)      │
    │  └─────────────────────────────────────┘
    │
    ▼

12. Frontend Shows Success
    │
    │  ✅ Payment Successful!
    │  📧 Confirmation email sent
    │
    └─► Customer sees success message


┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                                  │
└─────────────────────────────────────────────────────────────────────────┘

🔒 Layer 1: HTTPS Encryption
   └─► All communication encrypted in transit

🔒 Layer 2: CORS Protection
   └─► Only allowed domains can call your API

🔒 Layer 3: Webhook Signature Verification
   └─► Ensures webhooks are really from Stripe

🔒 Layer 4: Rate Limiting
   └─► Prevents abuse and DDoS attacks

🔒 Layer 5: PCI Compliance
   └─► Card data never touches your server


┌─────────────────────────────────────────────────────────────────────────┐
│                         KEY COMPONENTS                                   │
└─────────────────────────────────────────────────────────────────────────┘

Frontend (payment.html):
├── Stripe.js library
├── Card input element
├── Form validation
└── Payment confirmation

Backend (Your Server):
├── POST /api/payment/create-payment-intent
│   └─► Creates PaymentIntent with Stripe
├── POST /api/payment/webhook
│   └─► Receives payment events from Stripe
└── Email service (ZeptoMail)
    └─► Sends confirmation emails

Stripe:
├── Payment processing
├── Card validation
├── Fraud detection
└── Webhook events


┌─────────────────────────────────────────────────────────────────────────┐
│                         CONFIGURATION                                    │
└─────────────────────────────────────────────────────────────────────────┘

Frontend Configuration (payment.html):
┌────────────────────────────────────────────────────┐
│ const STRIPE_PUBLISHABLE_KEY = 'pk_live_...'      │ ← Get from Stripe Dashboard
│ const API_URL = 'https://your-server.com'         │ ← Your server URL
│ const PAYMENT_AMOUNT = 9900                        │ ← Amount in pence
└────────────────────────────────────────────────────┘

Backend Configuration (.env):
┌────────────────────────────────────────────────────┐
│ STRIPE_SECRET_KEY=sk_live_...                     │ ← Already set ✅
│ STRIPE_WEBHOOK_SECRET=whsec_...                   │ ← Already set ✅
│ ZEPTOMAIL_TOKEN=...                               │ ← Already set ✅
│ ADMIN_EMAIL=daniel@nhscareerboost.co.uk           │ ← Already set ✅
└────────────────────────────────────────────────────┘

Stripe Dashboard Configuration:
┌────────────────────────────────────────────────────┐
│ Webhook URL:                                       │
│ https://your-server.com/api/payment/webhook        │ ← Configure this
│                                                    │
│ Events:                                            │
│ ✅ payment_intent.succeeded                        │
│ ✅ payment_intent.payment_failed                   │
└────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         ERROR HANDLING                                   │
└─────────────────────────────────────────────────────────────────────────┘

If Payment Fails:
├── Customer sees error message
├── Can retry immediately
└── Admin receives failure notification

If Webhook Fails:
├── Stripe retries automatically
├── Check server logs for errors
└── Verify webhook signature

If Email Fails:
├── Payment still succeeds
├── Error logged in server
└── Can resend manually if needed


┌─────────────────────────────────────────────────────────────────────────┐
│                         TESTING FLOW                                     │
└─────────────────────────────────────────────────────────────────────────┘

1. Test Backend:
   $ node test-payment.js
   ✅ Verifies endpoint works

2. Test Frontend:
   Open payment.html
   Use card: 4242 4242 4242 4242
   ✅ Verifies complete flow

3. Test Webhook:
   Check server logs for:
   💰 Payment succeeded: pi_xxx
   ✅ Payment success emails sent

4. Test Emails:
   Check inbox for:
   📧 Customer confirmation
   📧 Admin notification
