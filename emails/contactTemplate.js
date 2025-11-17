/**
 * Contact Form Email Templates
 */

// Email sent to the client confirming their inquiry
const clientConfirmationTemplate = (data) => {
  const { name, email, phone, service, message, appointmentDate, appointmentTime } = data;
  
  // Format appointment date for display
  const formattedDate = appointmentDate ? new Date(appointmentDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
  
  return {
    subject: 'Thank You for Contacting NHS Career Boost',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #005EB8; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #005EB8; }
          .label { font-weight: bold; color: #005EB8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>NHS Career Boost</h1>
          </div>
          <div class="content">
            <h2>Thank You, ${name}!</h2>
            <p>We've received your consultation booking request and will confirm your appointment shortly.</p>
            
            <div class="info-box">
              <p><span class="label">Service:</span> ${service}</p>
              ${appointmentDate ? `<p><span class="label">Preferred Date:</span> ${formattedDate}</p>` : ''}
              ${appointmentTime ? `<p><span class="label">Preferred Time:</span> ${appointmentTime} (UK Time)</p>` : ''}
              ${phone ? `<p><span class="label">Contact Phone:</span> ${phone}</p>` : ''}
              ${message ? `<p><span class="label">Additional Notes:</span><br/>${message}</p>` : ''}
            </div>
            
            <div style="background-color: #e8f4f8; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0;"><strong>📅 What's Next?</strong></p>
              <p style="margin: 10px 0 0 0;">We'll send you the meeting details and calendar invite 24 hours before your scheduled appointment.</p>
            </div>
            
            <p>Our team typically responds within 24 hours during business days.</p>
            <p>If you have any urgent questions, please don't hesitate to contact us directly at <a href="mailto:daniel@nhscareerboost.co.uk">daniel@nhscareerboost.co.uk</a>.</p>
            
            <p>Best regards,<br/>
            <strong>NHS Career Boost Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} NHS Career Boost. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dear ${name},

Thank you for booking a consultation with NHS Career Boost!

We've received your booking request with the following details:
- Service: ${service}
${appointmentDate ? `- Preferred Date: ${formattedDate}` : ''}
${appointmentTime ? `- Preferred Time: ${appointmentTime} (UK Time)` : ''}
${phone ? `- Contact Phone: ${phone}` : ''}
${message ? `- Additional Notes: ${message}` : ''}

We'll send you the meeting details and calendar invite 24 hours before your scheduled appointment.

If you have any urgent questions, please contact us at daniel@nhscareerboost.co.uk

Best regards,
NHS Career Boost Team

---
© ${new Date().getFullYear()} NHS Career Boost. All rights reserved.
This email was sent to ${email}
    `
  };
};

// Email sent to admin with full form details
const adminNotificationTemplate = (data) => {
  const { name, email, phone, service, message, appointmentDate, appointmentTime } = data;
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
  
  // Format appointment date for display
  const formattedDate = appointmentDate ? new Date(appointmentDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;
  
  return {
    subject: `New Consultation Booking - ${service}${appointmentDate ? ` - ${appointmentDate}` : ''}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; }
          .content { background-color: #fff; padding: 30px; border: 1px solid #ddd; }
          .info-row { padding: 10px; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #d32f2f; display: inline-block; width: 150px; }
          .value { display: inline-block; }
          .message-box { background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .appointment-highlight { background-color: #fff3cd; padding: 20px; margin: 20px 0; border-left: 5px solid #ffc107; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Consultation Booking</h1>
          </div>
          <div class="content">
            ${appointmentDate && appointmentTime ? `
            <div class="appointment-highlight">
              <h3 style="margin-top: 0; color: #856404;">📅 Scheduled Appointment</h3>
              <p style="font-size: 18px; margin: 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
              <p style="font-size: 18px; margin: 10px 0;"><strong>Time:</strong> ${appointmentTime} (UK Time)</p>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="label">Submitted:</span>
              <span class="value">${timestamp}</span>
            </div>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">${name}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${email}">${email}</a></span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span class="value">${phone || 'Not provided'}</span>
            </div>
            <div class="info-row">
              <span class="label">Service:</span>
              <span class="value"><strong>${service}</strong></span>
            </div>
            ${appointmentDate ? `
            <div class="info-row">
              <span class="label">Appointment Date:</span>
              <span class="value"><strong>${formattedDate}</strong></span>
            </div>
            ` : ''}
            ${appointmentTime ? `
            <div class="info-row">
              <span class="label">Appointment Time:</span>
              <span class="value"><strong>${appointmentTime} (UK Time)</strong></span>
            </div>
            ` : ''}
            
            ${message ? `
            <div class="message-box">
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            ` : '<p><em>No message provided</em></p>'}
            
            <p style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
              <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
NEW CONSULTATION BOOKING
========================

Submitted: ${timestamp}
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service: ${service}
${appointmentDate ? `Appointment Date: ${formattedDate}` : ''}
${appointmentTime ? `Appointment Time: ${appointmentTime} (UK Time)` : ''}

${message ? `Message:\n${message}` : 'No message provided'}

---
Action Required: Please respond to this inquiry within 24 hours.
    `
  };
};

module.exports = {
  clientConfirmationTemplate,
  adminNotificationTemplate
};
