/**
 * Test script to verify payment endpoint works
 * Run with: node test-payment.js
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testPaymentEndpoint() {
  console.log('🧪 Testing Payment Endpoint...\n');
  console.log('='.repeat(50));

  try {
    // Test data
    const testData = {
      amount: 9900, // £99.00
      currency: 'gbp',
      customerEmail: 'test@example.com',
      customerName: 'Test Customer',
      metadata: {
        service: 'NHS Career Boost',
        test: true,
      },
    };

    console.log('📤 Sending request to:', `${API_URL}/api/payment/create-payment-intent`);
    console.log('📋 Request data:', JSON.stringify(testData, null, 2));
    console.log('='.repeat(50));

    const response = await axios.post(
      `${API_URL}/api/payment/create-payment-intent`,
      testData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('\n✅ SUCCESS!\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('='.repeat(50));
    console.log('\n✨ Payment endpoint is working correctly!');
    console.log('📝 Client secret received:', response.data.clientSecret ? 'Yes ✅' : 'No ❌');
    console.log('🆔 Payment Intent ID:', response.data.paymentIntentId);
    console.log('\n💡 Next steps:');
    console.log('   1. Update frontend-example/payment.html with your Stripe Publishable Key');
    console.log('   2. Open payment.html in a browser');
    console.log('   3. Test with card: 4242 4242 4242 4242');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ ERROR!\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Is the server running? Try: npm start');
    } else {
      console.error('Error:', error.message);
    }
    
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Make sure server is running: npm start');
    console.log('   2. Check .env file has STRIPE_SECRET_KEY');
    console.log('   3. Verify server URL:', API_URL);
    console.log('='.repeat(50));
    
    process.exit(1);
  }
}

// Run the test
testPaymentEndpoint();
