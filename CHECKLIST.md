# Pre-Launch Checklist

Complete this checklist before deploying to production.

---

## ✅ Development Setup

### Initial Setup
- [ ] Node.js installed (v18 or higher)
- [ ] Project cloned/downloaded
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`

### Environment Configuration
- [ ] `SMTP_HOST` configured (smtp.gmail.com)
- [ ] `SMTP_PORT` configured (587)
- [ ] `SMTP_USER` configured (your Gmail address)
- [ ] `SMTP_PASSWORD` configured (Gmail app password)
- [ ] `SMTP_FROM` configured (your Gmail address)
- [ ] `STRIPE_SECRET_KEY` configured (test key for dev)
- [ ] `STRIPE_WEBHOOK_SECRET` configured
- [ ] `ADMIN_EMAIL` configured
- [ ] `ALLOWED_ORIGINS` includes your frontend URL
- [ ] `NODE_ENV` set to development

### Gmail Setup
- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App password generated (16 characters)
- [ ] App password tested and working
- [ ] No spaces in app password

### Stripe Setup (Development)
- [ ] Stripe account created
- [ ] Test API keys obtained (`sk_test_...`)
- [ ] Webhook endpoint created in test mode
- [ ] Webhook secret copied (`whsec_...`)
- [ ] Events selected: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## 🧪 Testing

### Local Testing
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health endpoint responds (`curl http://localhost:3000/health`)
- [ ] Test script runs successfully (`./test-contact.sh`)
- [ ] Contact form test passes
- [ ] Validation tests pass (invalid email, missing fields)
- [ ] CORS test passes (unauthorized origin blocked)

### Email Testing
- [ ] Client confirmation email received
- [ ] Admin notification email received
- [ ] Admin copy email received
- [ ] All emails display correctly (HTML)
- [ ] Plain text versions work
- [ ] No broken links in emails
- [ ] Branding looks professional

### Stripe Testing (Optional for Dev)
- [ ] Stripe CLI installed
- [ ] Webhook forwarding working (`stripe listen`)
- [ ] Test payment success event works
- [ ] Test payment failure event works
- [ ] Payment emails received correctly

---

## 🚀 Pre-Deployment

### Code Review
- [ ] No console.log statements with sensitive data
- [ ] No hardcoded credentials
- [ ] Error handling comprehensive
- [ ] All routes tested
- [ ] Security middleware active

### Documentation Review
- [ ] README.md reviewed
- [ ] QUICKSTART.md reviewed
- [ ] DEPLOYMENT.md reviewed
- [ ] All documentation accurate

### Git & Version Control
- [ ] `.env` in `.gitignore` (already done)
- [ ] `node_modules` in `.gitignore` (already done)
- [ ] Code committed to repository
- [ ] Repository pushed to GitHub/GitLab

---

## 🌐 Production Deployment

### Platform Selection
- [ ] Deployment platform chosen (Railway/Render/etc.)
- [ ] Account created on platform
- [ ] Billing configured (if needed)

### Production Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT` configured (or auto-set by platform)
- [ ] `SMTP_*` variables configured
- [ ] `STRIPE_SECRET_KEY` set to LIVE key (`sk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` updated for production
- [ ] `ADMIN_EMAIL` confirmed
- [ ] `ALLOWED_ORIGINS` updated to production frontend URL
- [ ] All variables double-checked

### Stripe Production Setup
- [ ] Stripe account activated for live mode
- [ ] Live API keys obtained
- [ ] Production webhook endpoint created
- [ ] Webhook URL points to production domain
- [ ] Webhook secret updated in environment variables
- [ ] Events configured: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Webhook tested with Stripe CLI

### Domain & SSL
- [ ] Custom domain configured (optional)
- [ ] DNS records updated (if custom domain)
- [ ] SSL certificate active (auto on most platforms)
- [ ] HTTPS enforced

---

## 🔍 Post-Deployment Verification

### Deployment Checks
- [ ] Deployment successful
- [ ] No build errors
- [ ] Server started successfully
- [ ] Logs show no errors

### Endpoint Testing
- [ ] Health endpoint accessible (`https://yourdomain.com/health`)
- [ ] Returns correct status
- [ ] Response time acceptable (<1s)

### Contact Form Testing
- [ ] Submit test contact form from production frontend
- [ ] Form submission succeeds
- [ ] Client email received
- [ ] Admin notification received
- [ ] Admin copy received
- [ ] All emails formatted correctly
- [ ] Response time acceptable (<5s)

### Payment Testing
- [ ] Make test payment (small amount)
- [ ] Payment processes successfully
- [ ] Customer receipt email received
- [ ] Admin payment notification received
- [ ] Admin copy received
- [ ] Webhook shows as delivered in Stripe dashboard

### CORS Testing
- [ ] Frontend can communicate with backend
- [ ] Unauthorized origins blocked
- [ ] No CORS errors in browser console

---

## 📊 Monitoring Setup

### Health Monitoring
- [ ] Uptime monitoring configured (UptimeRobot/Pingdom)
- [ ] Health check endpoint monitored
- [ ] Alert contacts configured
- [ ] Check interval set (5 minutes recommended)

### Log Monitoring
- [ ] Platform logs accessible
- [ ] Log retention configured
- [ ] Error alerts configured (if available)
- [ ] Know how to access logs quickly

### Email Monitoring
- [ ] Admin email inbox checked
- [ ] Email filters/labels set up (optional)
- [ ] Spam folder checked for test emails
- [ ] Email delivery confirmed

---

## 🔒 Security Verification

### Security Checklist
- [ ] No `.env` file in repository
- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Webhook signature verification active
- [ ] Helmet security headers active

### Credentials Security
- [ ] Gmail app password secure
- [ ] Stripe keys not exposed
- [ ] Environment variables not logged
- [ ] No credentials in error messages

---

## 📱 Frontend Integration

### Frontend Updates
- [ ] API endpoint URL updated to production
- [ ] Contact form points to correct endpoint
- [ ] Error handling implemented
- [ ] Success messages configured
- [ ] Loading states implemented
- [ ] Form validation matches backend

### User Experience
- [ ] Form submission smooth
- [ ] Error messages clear
- [ ] Success messages encouraging
- [ ] No console errors
- [ ] Mobile responsive

---

## 📚 Documentation

### Team Documentation
- [ ] Deployment credentials documented (securely)
- [ ] Admin access documented
- [ ] Emergency contacts listed
- [ ] Rollback procedure documented

### User Documentation
- [ ] Contact form instructions clear
- [ ] Payment process documented
- [ ] Support email visible

---

## 🎯 Final Checks

### Pre-Launch
- [ ] All above items completed
- [ ] Stakeholders notified
- [ ] Support team briefed
- [ ] Backup plan ready

### Launch Day
- [ ] Monitor logs closely
- [ ] Test contact form hourly
- [ ] Check email delivery
- [ ] Watch for errors
- [ ] Be ready to rollback if needed

### Post-Launch (First Week)
- [ ] Daily log checks
- [ ] Email delivery monitoring
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Issue tracking

---

## 🔄 Ongoing Maintenance

### Weekly
- [ ] Check error logs
- [ ] Verify email delivery
- [ ] Test contact form
- [ ] Review Stripe dashboard

### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Security audit (`npm audit`)
- [ ] Review rate limits
- [ ] Check disk space (if applicable)
- [ ] Review performance metrics

### Quarterly
- [ ] Rotate Gmail app password
- [ ] Review Stripe webhook logs
- [ ] Update documentation
- [ ] Review and update dependencies
- [ ] Security review

### Annually
- [ ] Full security audit
- [ ] Review and update all credentials
- [ ] Platform review (consider alternatives)
- [ ] Performance optimization
- [ ] Documentation overhaul

---

## 🆘 Emergency Contacts

| Role | Contact | Notes |
|------|---------|-------|
| **Admin** | daniel@nhscareerboost.co.uk | Primary contact |
| **Platform Support** | [Platform docs] | Check platform documentation |
| **Stripe Support** | https://support.stripe.com | For payment issues |
| **Gmail Support** | https://support.google.com | For email issues |

---

## 📝 Notes Section

Use this space for deployment-specific notes:

```
Deployment Date: _______________
Platform: _______________
Domain: _______________
Deployed By: _______________

Notes:
_________________________________
_________________________________
_________________________________
_________________________________
```

---

## ✅ Sign-Off

- [ ] **Development Complete** - Signed: __________ Date: __________
- [ ] **Testing Complete** - Signed: __________ Date: __________
- [ ] **Deployment Complete** - Signed: __________ Date: __________
- [ ] **Verification Complete** - Signed: __________ Date: __________
- [ ] **Production Ready** - Signed: __________ Date: __________

---

**Once all items are checked, you're ready for production! 🚀**
