# Payment Integration Guide

## Overview

This guide shows you how to integrate Stripe payments with your HTML/CSS frontend and the NHS Career Boost server.

## Backend Setup ✅

Your backend is now configured with:
- ✅ Stripe Secret Key
- ✅ Stripe Webhook Secret
- ✅ Payment Intent Creation Endpoint
- ✅ Webhook Handler for payment events
- ✅ Email notifications on payment success/failure

## Frontend Integration

### Step 1: Add Stripe.js to Your HTML

Add the Stripe.js library to your HTML file (before the closing `</body>` tag):

```html
<script src="https://js.stripe.com/v3/"></script>
```

### Step 2: Get Your Stripe Publishable Key

You need to add your Stripe **Publishable Key** (starts with `pk_live_` or `pk_test_`) to your frontend.

⚠️ **IMPORTANT**: Never use your secret key (`sk_live_...`) in the frontend!

### Step 3: Create Your Payment Form

Here's a complete example of a payment page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NHS Career Boost - Payment</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .payment-container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 40px;
        }

        h1 {
            color: #1a202c;
            margin-bottom: 10px;
            font-size: 28px;
        }

        .subtitle {
            color: #718096;
            margin-bottom: 30px;
            font-size: 16px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #2d3748;
            font-weight: 600;
            font-size: 14px;
        }

        input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        input:focus {
            outline: none;
            border-color: #667eea;
        }

        #card-element {
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            background: white;
        }

        #card-element.StripeElement--focus {
            border-color: #667eea;
        }

        #card-errors {
            color: #e53e3e;
            margin-top: 8px;
            font-size: 14px;
            min-height: 20px;
        }

        .amount-display {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }

        .amount-label {
            color: #718096;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .amount-value {
            color: #1a202c;
            font-size: 36px;
            font-weight: bold;
        }

        button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .success-message {
            display: none;
            text-align: center;
            padding: 40px;
        }

        .success-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .success-message h2 {
            color: #38a169;
            margin-bottom: 10px;
        }

        .success-message p {
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="payment-container">
        <div id="payment-form-container">
            <h1>Complete Your Payment</h1>
            <p class="subtitle">NHS Career Boost Service</p>

            <div class="amount-display">
                <div class="amount-label">Amount to Pay</div>
                <div class="amount-value">£<span id="display-amount">99.00</span></div>
            </div>

            <form id="payment-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required placeholder="John Smith">
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="john@example.com">
                </div>

                <div class="form-group">
                    <label for="card-element">Card Details</label>
                    <div id="card-element"></div>
                    <div id="card-errors"></div>
                </div>

                <button type="submit" id="submit-button">
                    <span id="button-text">Pay Now</span>
                    <div class="spinner" id="spinner"></div>
                </button>
            </form>
        </div>

        <div class="success-message" id="success-message">
            <div class="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <p>Thank you for your payment. A confirmation email has been sent to your email address.</p>
        </div>
    </div>

    <!-- Stripe.js -->
    <script src="https://js.stripe.com/v3/"></script>
    
    <script>
        // ============================================
        // CONFIGURATION
        // ============================================
        
        // Replace with your Stripe Publishable Key
        const STRIPE_PUBLISHABLE_KEY = 'pk_live_YOUR_PUBLISHABLE_KEY_HERE';
        
        // Your backend API URL
        const API_URL = 'https://your-server-domain.com'; // or 'http://localhost:3000' for local testing
        
        // Payment amount in pence (£99.00 = 9900 pence)
        const PAYMENT_AMOUNT = 9900; // Change this to your desired amount
        
        // ============================================
        // STRIPE INITIALIZATION
        // ============================================
        
        const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        const elements = stripe.elements();
        
        // Create card element with styling
        const cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#1a202c',
                    '::placeholder': {
                        color: '#a0aec0',
                    },
                },
                invalid: {
                    color: '#e53e3e',
                },
            },
        });
        
        cardElement.mount('#card-element');
        
        // Handle real-time validation errors
        cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        // ============================================
        // FORM SUBMISSION
        // ============================================
        
        const form = document.getElementById('payment-form');
        const submitButton = document.getElementById('submit-button');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');
        
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Disable form submission
            setLoading(true);
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            try {
                // Step 1: Create Payment Intent on your server
                const response = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: PAYMENT_AMOUNT,
                        currency: 'gbp',
                        customerEmail: email,
                        customerName: name,
                        metadata: {
                            service: 'NHS Career Boost',
                            // Add any additional metadata you need
                        },
                    }),
                });
                
                const data = await response.json();
                
                if (!data.success) {
                    throw new Error(data.message || 'Failed to create payment intent');
                }
                
                // Step 2: Confirm payment with Stripe
                const { error, paymentIntent } = await stripe.confirmCardPayment(
                    data.clientSecret,
                    {
                        payment_method: {
                            card: cardElement,
                            billing_details: {
                                name: name,
                                email: email,
                            },
                        },
                    }
                );
                
                if (error) {
                    // Show error to customer
                    showError(error.message);
                    setLoading(false);
                } else if (paymentIntent.status === 'succeeded') {
                    // Payment successful!
                    showSuccess();
                }
                
            } catch (error) {
                showError(error.message);
                setLoading(false);
            }
        });
        
        // ============================================
        // HELPER FUNCTIONS
        // ============================================
        
        function setLoading(isLoading) {
            submitButton.disabled = isLoading;
            if (isLoading) {
                buttonText.style.display = 'none';
                spinner.style.display = 'block';
            } else {
                buttonText.style.display = 'block';
                spinner.style.display = 'none';
            }
        }
        
        function showError(message) {
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = message;
        }
        
        function showSuccess() {
            document.getElementById('payment-form-container').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';
        }
    </script>
</body>
</html>
```

## Configuration Steps

### 1. Update Frontend Configuration

In the HTML file above, replace these values:

```javascript
// Replace with your actual Stripe Publishable Key
const STRIPE_PUBLISHABLE_KEY = 'pk_live_YOUR_PUBLISHABLE_KEY_HERE';

// Replace with your server URL
const API_URL = 'https://your-server-domain.com';

// Set your payment amount in pence (£99.00 = 9900)
const PAYMENT_AMOUNT = 9900;
```

### 2. Deploy Your Server

Make sure your server is running and accessible at the URL you specified in `API_URL`.

For production:
```bash
# Your server should be deployed and running
# The webhook endpoint should be: https://your-server-domain.com/api/payment/webhook
```

For local testing:
```bash
# Start your server
npm start

# Use ngrok or similar to expose your local server for webhook testing
ngrok http 3000
```

### 3. Configure Stripe Webhook

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-server-domain.com/api/payment/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret (starts with `whsec_...`)
6. Update your `.env` file with this secret (already done ✅)

## Payment Flow

1. **Customer fills form** → Name, Email, Card Details
2. **Frontend calls backend** → `POST /api/payment/create-payment-intent`
3. **Backend creates PaymentIntent** → Returns `clientSecret`
4. **Frontend confirms payment** → Using Stripe.js with card details
5. **Stripe processes payment** → Sends webhook to your server
6. **Backend receives webhook** → Verifies signature with `STRIPE_WEBHOOK_SECRET`
7. **Backend sends emails** → Success/failure notifications via ZeptoMail

## Testing

### Test Card Numbers

Use these test cards in development mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Test the Flow

1. Open your HTML payment page
2. Fill in the form with test data
3. Use a test card number
4. Submit the payment
5. Check your server logs for webhook events
6. Check your email for payment confirmation

## Security Checklist

- ✅ Webhook secret configured
- ✅ HTTPS enabled for production
- ✅ CORS configured with allowed origins
- ✅ Rate limiting enabled
- ✅ Never expose secret key in frontend
- ✅ Email notifications enabled
- ✅ Webhook signature verification

## Troubleshooting

### Webhook not receiving events

1. Check webhook URL is correct in Stripe Dashboard
2. Ensure server is publicly accessible (use ngrok for local testing)
3. Check webhook secret matches in `.env`
4. Look for signature verification errors in server logs

### Payment not processing

1. Check Stripe publishable key is correct
2. Verify API_URL points to your server
3. Check browser console for errors
4. Verify CORS is configured correctly

### Email not sending

1. Check ZeptoMail credentials in `.env`
2. Verify customer email is captured correctly
3. Check server logs for email sending errors

## Support

For issues, check:
- Server logs: `npm start` output
- Browser console: F12 → Console tab
- Stripe Dashboard: Logs section
- Network tab: Check API requests/responses
