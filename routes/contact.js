const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const { clientConfirmationTemplate, adminNotificationTemplate } = require('../emails/contactTemplate');

const router = express.Router();

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

// Validation rules
const contactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  body('service')
    .trim()
    .notEmpty()
    .withMessage('Service selection is required'),
  body('message')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Message must not exceed 2000 characters'),
  body('appointmentDate')
    .trim()
    .notEmpty()
    .withMessage('Appointment date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Appointment date must be in YYYY-MM-DD format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Appointment date cannot be in the past');
      }
      return true;
    }),
  body('appointmentTime')
    .trim()
    .notEmpty()
    .withMessage('Appointment time is required')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Appointment time must be in HH:MM format (24-hour)'),
];

/**
 * POST /api/contact
 * Handle contact form submissions
 */
router.post('/', contactValidation, async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { name, email, phone, service, message, appointmentDate, appointmentTime } = req.body;
    
    // Prepare email data
    const formData = { name, email, phone, service, message, appointmentDate, appointmentTime };

    // 1. Send confirmation email to client
    const clientEmail = clientConfirmationTemplate(formData);
    await sendZeptoMail({
      from: {
        address: process.env.ZEPTOMAIL_FROM_ADDRESS,
        name: process.env.ZEPTOMAIL_FROM_NAME,
      },
      to: [
        {
          email_address: {
            address: email,
            name: name,
          },
        },
      ],
      subject: clientEmail.subject,
      htmlbody: clientEmail.html,
    });

    // 2. Send notification to admin with full details
    const adminEmail = adminNotificationTemplate(formData);
    await sendZeptoMail({
      from: {
        address: process.env.ZEPTOMAIL_FROM_ADDRESS,
        name: 'NHS Career Boost Contact Form',
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

    // 3. Send a copy of the client confirmation to admin
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
      subject: `[Copy] ${clientEmail.subject} - ${name}`,
      htmlbody: clientEmail.html,
    });

    console.log(`✅ Contact form processed successfully for ${email}`);

    res.status(200).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you shortly.',
    });

  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    
    // Don't expose internal errors to client
    res.status(500).json({
      success: false,
      message: 'We encountered an error processing your request. Please try again later or contact us directly at daniel@nhscareerboost.co.uk',
    });
  }
});

module.exports = router;
