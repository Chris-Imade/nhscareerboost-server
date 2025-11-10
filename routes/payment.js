const express = require('express');
const axios = require('axios');
const Stripe = require('stripe');
const { clientPaymentSuccessTemplate, adminPaymentSuccessTemplate } = require('../emails/paymentSuccessTemplate');
const { adminPaymentFailureTemplate } = require('../emails/paymentFailureTemplate');

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Send email via ZeptoMail API
const sendZeptoMail = async (emailData) => {
  try {
    const response = await axios.post(
      process.env.ZEPTOMAIL_URL,
      emailData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.ZEPTOMAIL_TOKEN,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('ZeptoMail API Error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * POST /api/payment/create-payment-intent
 * Create a payment intent for the frontend
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'gbp', customerEmail, customerName, metadata = {} } = req.body;

    // Validate required fields
    if (!amount || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Amount and customer email are required',
      });
    }

    // Validate amount (must be positive integer in smallest currency unit)
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's an integer
      currency: currency.toLowerCase(),
      receipt_email: customerEmail,
      metadata: {
        customerName: customerName || '',
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(`💳 Payment intent created: ${paymentIntent.id} for ${customerEmail}`);

    // Return client secret to frontend
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/payment/webhook
 * Handle Stripe webhook events
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error handling webhook event:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent) {
  console.log('💰 Payment succeeded:', paymentIntent.id);

  // Extract payment data
  const paymentData = {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    customerEmail: paymentIntent.receipt_email || paymentIntent.charges?.data[0]?.billing_details?.email,
    customerName: paymentIntent.charges?.data[0]?.billing_details?.name,
    metadata: paymentIntent.metadata,
  };

  // Validate we have a customer email
  if (!paymentData.customerEmail) {
    console.warn('⚠️ No customer email found for payment:', paymentIntent.id);
    // Still send admin notification
    const adminEmail = adminPaymentSuccessTemplate(paymentData);
    await sendZeptoMail({
      from: {
        address: process.env.ZEPTOMAIL_FROM_ADDRESS,
        name: 'NHS Career Boost Payments',
      },
      to: [
        {
          email_address: {
            address: process.env.ADMIN_EMAIL,
            name: 'Admin',
          },
        },
      ],
      subject: adminEmail.subject,
      htmlbody: adminEmail.html,
    });
    return;
  }

  try {
    // 1. Send success email to client
    const clientEmail = clientPaymentSuccessTemplate(paymentData);
    await sendZeptoMail({
      from: {
        address: process.env.ZEPTOMAIL_FROM_ADDRESS,
        name: process.env.ZEPTOMAIL_FROM_NAME,
      },
      to: [
        {
          email_address: {
            address: paymentData.customerEmail,
            name: paymentData.customerName || 'Customer',
          },
        },
      ],
      subject: clientEmail.subject,
      htmlbody: clientEmail.html,
    });

    // 2. Send notification to admin
    const adminEmail = adminPaymentSuccessTemplate(paymentData);
    await sendZeptoMail({
      from: {
        address: process.env.ZEPTOMAIL_FROM_ADDRESS,
        name: 'NHS Career Boost Payments',
      },
      to: [
        {
          email_address: {
            address: process.env.ADMIN_EMAIL,
            name: 'Admin',
          },
        },
      ],
      subject: adminEmail.subject,
      htmlbody: adminEmail.html,
    });

    // 3. Send copy of client email to admin
    await sendZeptoMail({
      from: {
        address: process.env.ZEPTOMAIL_FROM_ADDRESS,
        name: process.env.ZEPTOMAIL_FROM_NAME,
      },
      to: [
        {
          email_address: {
            address: process.env.ADMIN_EMAIL,
            name: 'Admin',
          },
        },
      ],
      subject: `[Copy] ${clientEmail.subject} - ${paymentData.customerEmail}`,
      htmlbody: clientEmail.html,
    });

    console.log(`✅ Payment success emails sent for ${paymentIntent.id}`);
  } catch (error) {
    console.error('❌ Error sending payment success emails:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent) {
  console.log('❌ Payment failed:', paymentIntent.id);

  // Extract payment data
  const paymentData = {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    customerEmail: paymentIntent.receipt_email || paymentIntent.charges?.data[0]?.billing_details?.email,
    customerName: paymentIntent.charges?.data[0]?.billing_details?.name,
    errorMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
  };

  try {
    // Send failure notification to admin only
    const adminEmail = adminPaymentFailureTemplate(paymentData);
    await sendZeptoMail({
      from: {
        address: process.env.ZEPTOMAIL_FROM_ADDRESS,
        name: 'NHS Career Boost Payments',
      },
      to: [
        {
          email_address: {
            address: process.env.ADMIN_EMAIL,
            name: 'Admin',
          },
        },
      ],
      subject: adminEmail.subject,
      htmlbody: adminEmail.html,
    });

    console.log(`✅ Payment failure notification sent for ${paymentIntent.id}`);
  } catch (error) {
    console.error('❌ Error sending payment failure email:', error);
    throw error;
  }
}

module.exports = router;
