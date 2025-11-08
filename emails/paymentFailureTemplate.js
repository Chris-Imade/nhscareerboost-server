/**
 * Payment Failure Email Template
 */

// Email sent to admin when payment fails
const adminPaymentFailureTemplate = (paymentData) => {
  const { customerEmail, amount, currency, paymentIntentId, errorMessage, customerName } = paymentData;
  const formattedAmount = amount ? (amount / 100).toFixed(2) : 'N/A';
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
  
  return {
    subject: `⚠️ Payment Failed - Action Required`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; }
          .content { background-color: #fff; padding: 30px; border: 1px solid #ddd; }
          .warning-icon { font-size: 48px; text-align: center; margin: 20px 0; color: #d32f2f; }
          .info-row { padding: 10px; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #d32f2f; display: inline-block; width: 150px; }
          .error-box { background-color: #ffebee; padding: 15px; margin: 20px 0; border-left: 4px solid #d32f2f; border-radius: 5px; }
          .action-box { background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Payment Failed</h1>
          </div>
          <div class="content">
            <div class="warning-icon">❌</div>
            <h2>Payment Failure Alert</h2>
            <p>A payment attempt has failed and requires your attention.</p>
            
            <div class="info-row">
              <span class="label">Timestamp:</span>
              <span class="value">${timestamp}</span>
            </div>
            <div class="info-row">
              <span class="label">Customer Name:</span>
              <span class="value">${customerName || 'Not provided'}</span>
            </div>
            <div class="info-row">
              <span class="label">Customer Email:</span>
              <span class="value"><a href="mailto:${customerEmail}">${customerEmail || 'Not provided'}</a></span>
            </div>
            <div class="info-row">
              <span class="label">Amount:</span>
              <span class="value">${currency ? currency.toUpperCase() : 'N/A'} ${formattedAmount}</span>
            </div>
            <div class="info-row">
              <span class="label">Payment Intent ID:</span>
              <span class="value">${paymentIntentId || 'N/A'}</span>
            </div>
            
            <div class="error-box">
              <strong>Error Message:</strong>
              <p>${errorMessage || 'No error message provided'}</p>
            </div>
            
            <div class="action-box">
              <strong>⚡ Action Required:</strong>
              <ul>
                <li>Review the payment details in your Stripe dashboard</li>
                <li>Contact the customer if necessary to resolve the issue</li>
                <li>Check if this is a recurring issue that needs addressing</li>
              </ul>
            </div>
            
            <p style="margin-top: 20px;">
              <strong>Stripe Dashboard:</strong> <a href="https://dashboard.stripe.com/payments/${paymentIntentId}">View Payment</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
PAYMENT FAILED - ACTION REQUIRED
=================================

A payment attempt has failed and requires your attention.

Timestamp: ${timestamp}
Customer Name: ${customerName || 'Not provided'}
Customer Email: ${customerEmail || 'Not provided'}
Amount: ${currency ? currency.toUpperCase() : 'N/A'} ${formattedAmount}
Payment Intent ID: ${paymentIntentId || 'N/A'}

Error Message:
${errorMessage || 'No error message provided'}

ACTION REQUIRED:
- Review the payment details in your Stripe dashboard
- Contact the customer if necessary to resolve the issue
- Check if this is a recurring issue that needs addressing

Stripe Dashboard: https://dashboard.stripe.com/payments/${paymentIntentId}
    `
  };
};

module.exports = {
  adminPaymentFailureTemplate
};
