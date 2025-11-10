require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const contactRoute = require('./routes/contact');
const paymentRoute = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet for security headers
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['https://nhscareerboost.co.uk', 'http://127.0.0.1:5500'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️ Blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'stripe-signature'],
}));

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for webhook (more lenient)
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Allow up to 100 webhook requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

// For webhook route, we need raw body
app.use('/api/payment/webhook', webhookLimiter, paymentRoute);

// For all other routes, parse JSON
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'NHS Career Boost Mail Server',
  });
});

// Contact form route with rate limiting
app.use('/api/contact', contactLimiter, contactRoute);

// Payment route (excluding webhook which is already mounted)
app.use('/api/payment', paymentRoute);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'NHS Career Boost Mail Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      contact: 'POST /api/contact',
      createPayment: 'POST /api/payment/create-payment-intent',
      webhook: 'POST /api/payment/webhook',
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: Origin not allowed',
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
});

// ============================================
// SERVER STARTUP
// ============================================

// Validate required environment variables
const requiredEnvVars = [
  'ZEPTOMAIL_URL',
  'ZEPTOMAIL_TOKEN',
  'ZEPTOMAIL_FROM_ADDRESS',
  'ZEPTOMAIL_FROM_NAME',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'ADMIN_EMAIL',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file against .env.example');
  process.exit(1);
}

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 NHS Career Boost Mail Server');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 Mail Service: ZeptoMail`);
  console.log(`📬 Admin Email: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔒 CORS Origins: ${allowedOrigins.join(', ')}`);
  console.log('='.repeat(50));
  console.log('✅ Server ready to accept requests');
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});
