/**
 * Payment Success Email Templates
 */

// Email sent to client confirming successful payment
const clientPaymentSuccessTemplate = (paymentData) => {
  const { customerEmail, amount, currency, paymentIntentId, customerName } = paymentData;
  const formattedAmount = (amount / 100).toFixed(2);
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
  
  return {
    subject: 'Payment Confirmation - NHS Career Boost',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
          .payment-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #4CAF50; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Successful!</h1>
          </div>
          <div class="content">
            <div class="success-icon">✅</div>
            <h2>Thank You${customerName ? `, ${customerName}` : ''}!</h2>
            <p>Your payment has been successfully processed.</p>
            
            <div class="payment-details">
              <h3>Payment Details</h3>
              <div class="detail-row">
                <span class="label">Amount Paid:</span> ${currency.toUpperCase()} ${formattedAmount}
              </div>
              <div class="detail-row">
                <span class="label">Transaction Date:</span> ${timestamp}
              </div>
              <div class="detail-row">
                <span class="label">Transaction ID:</span> ${paymentIntentId}
              </div>
              <div class="detail-row">
                <span class="label">Receipt Email:</span> ${customerEmail}
              </div>
            </div>
            
            <p>You will receive your service details shortly. If you have any questions, please contact us at <a href="mailto:daniel@nhscareerboost.co.uk">daniel@nhscareerboost.co.uk</a>.</p>
            
            <p>Best regards,<br/>
            <strong>NHS Career Boost Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} NHS Career Boost. All rights reserved.</p>
            <p>This is an automated receipt for your payment.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
PAYMENT SUCCESSFUL
==================

Thank you${customerName ? `, ${customerName}` : ''}!

Your payment has been successfully processed.

Payment Details:
- Amount Paid: ${currency.toUpperCase()} ${formattedAmount}
- Transaction Date: ${timestamp}
- Transaction ID: ${paymentIntentId}
- Receipt Email: ${customerEmail}

You will receive your service details shortly.

If you have any questions, please contact us at daniel@nhscareerboost.co.uk

Best regards,
NHS Career Boost Team

---
© ${new Date().getFullYear()} NHS Career Boost. All rights reserved.
This is an automated receipt for your payment.
    `
  };
};

// Email sent to admin notifying of successful payment
const adminPaymentSuccessTemplate = (paymentData) => {
  const { customerEmail, amount, currency, paymentIntentId, customerName, metadata } = paymentData;
  const formattedAmount = (amount / 100).toFixed(2);
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
  
  return {
    subject: `💰 Payment Received - ${currency.toUpperCase()} ${formattedAmount}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { background-color: #fff; padding: 30px; border: 1px solid #ddd; }
          .info-row { padding: 10px; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #4CAF50; display: inline-block; width: 150px; }
          .amount { font-size: 24px; color: #4CAF50; font-weight: bold; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Payment Received</h1>
          </div>
          <div class="content">
            <div class="amount">${currency.toUpperCase()} ${formattedAmount}</div>
            
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
              <span class="value"><a href="mailto:${customerEmail}">${customerEmail}</a></span>
            </div>
            <div class="info-row">
              <span class="label">Payment Intent ID:</span>
              <span class="value">${paymentIntentId}</span>
            </div>
            
            ${metadata && Object.keys(metadata).length > 0 ? `
            <div style="margin-top: 20px;">
              <strong>Additional Metadata:</strong>
              ${Object.entries(metadata).map(([key, value]) => `
                <div class="info-row">
                  <span class="label">${key}:</span>
                  <span class="value">${value}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}
            
            <p style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
              <strong>Action Required:</strong> Please fulfill the service for this customer.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
PAYMENT RECEIVED
================

Amount: ${currency.toUpperCase()} ${formattedAmount}

Timestamp: ${timestamp}
Customer Name: ${customerName || 'Not provided'}
Customer Email: ${customerEmail}
Payment Intent ID: ${paymentIntentId}

${metadata && Object.keys(metadata).length > 0 ? `
Additional Metadata:
${Object.entries(metadata).map(([key, value]) => `${key}: ${value}`).join('\n')}
` : ''}

---
Action Required: Please fulfill the service for this customer.
    `
  };
};

module.exports = {
  clientPaymentSuccessTemplate,
  adminPaymentSuccessTemplate
};
