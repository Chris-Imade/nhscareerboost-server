# Deployment Guide

Complete guide for deploying the NHS Career Boost Mail Server to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Gmail app password generated and tested
- [ ] Stripe account set up (live mode)
- [ ] Domain/subdomain ready for deployment
- [ ] SSL certificate configured (handled by most platforms)

## Deployment Options

### Option 1: Railway (Recommended)

**Pros:** Easy setup, automatic SSL, generous free tier

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway:**
   ```bash
   railway login
   ```

3. **Initialize project:**
   ```bash
   railway init
   ```

4. **Add environment variables:**
   ```bash
   railway variables set SMTP_HOST=smtp.gmail.com
   railway variables set SMTP_PORT=587
   railway variables set SMTP_USER=daniel@nhscareerboost.co.uk
   railway variables set SMTP_PASSWORD=your_app_password
   railway variables set SMTP_FROM=daniel@nhscareerboost.co.uk
   railway variables set STRIPE_SECRET_KEY=sk_live_xxxxx
   railway variables set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   railway variables set ADMIN_EMAIL=daniel@nhscareerboost.co.uk
   railway variables set ALLOWED_ORIGINS=https://nhscareerboost.co.uk
   railway variables set NODE_ENV=production
   railway variables set PORT=3000
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Get your URL:**
   ```bash
   railway domain
   ```

---

### Option 2: Render

**Pros:** Free tier, easy setup, automatic deployments from Git

1. **Create account:** https://render.com

2. **New Web Service:**
   - Connect your GitHub/GitLab repository
   - Or use "Deploy from Git URL"

3. **Configure:**
   - **Name:** nhs-career-boost-mail
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free or Starter

4. **Add Environment Variables:**
   Go to Environment tab and add all variables from `.env.example`

5. **Deploy:**
   Click "Create Web Service"

---

### Option 3: DigitalOcean App Platform

**Pros:** Reliable, good performance, $5/month

1. **Create account:** https://www.digitalocean.com

2. **Create App:**
   - Apps → Create App
   - Connect GitHub repository

3. **Configure:**
   - **Name:** nhs-mail-server
   - **Type:** Web Service
   - **Run Command:** `npm start`

4. **Environment Variables:**
   Add all from `.env.example` in Settings → Environment Variables

5. **Deploy:**
   Review and create

---

### Option 4: Heroku

**Pros:** Classic platform, well-documented

1. **Install Heroku CLI:**
   ```bash
   brew tap heroku/brew && brew install heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   heroku create nhs-career-boost-mail
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set SMTP_HOST=smtp.gmail.com
   heroku config:set SMTP_PORT=587
   heroku config:set SMTP_USER=daniel@nhscareerboost.co.uk
   heroku config:set SMTP_PASSWORD=your_app_password
   heroku config:set SMTP_FROM=daniel@nhscareerboost.co.uk
   heroku config:set STRIPE_SECRET_KEY=sk_live_xxxxx
   heroku config:set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   heroku config:set ADMIN_EMAIL=daniel@nhscareerboost.co.uk
   heroku config:set ALLOWED_ORIGINS=https://nhscareerboost.co.uk
   heroku config:set NODE_ENV=production
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

---

## Post-Deployment Steps

### 1. Update Stripe Webhook URL

1. Go to https://dashboard.stripe.com/webhooks
2. Click on your webhook endpoint
3. Update URL to: `https://your-production-domain.com/api/payment/webhook`
4. Save changes
5. Copy the new webhook signing secret
6. Update `STRIPE_WEBHOOK_SECRET` in your deployment platform

### 2. Update CORS Origins

Update `ALLOWED_ORIGINS` environment variable to include your production frontend:
```
https://nhscareerboost.co.uk,https://www.nhscareerboost.co.uk
```

### 3. Test Production Deployment

**Test health endpoint:**
```bash
curl https://your-domain.com/health
```

**Test contact form:**
```bash
curl -X POST https://your-domain.com/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://nhscareerboost.co.uk" \
  -d '{
    "name": "Production Test",
    "email": "daniel@nhscareerboost.co.uk",
    "service": "Test Service",
    "message": "Testing production deployment"
  }'
```

**Test Stripe webhook:**
```bash
# Using Stripe CLI
stripe trigger payment_intent.succeeded --webhook-endpoint https://your-domain.com/api/payment/webhook
```

### 4. Monitor Logs

**Railway:**
```bash
railway logs
```

**Render:**
- Dashboard → Logs tab

**DigitalOcean:**
- App → Runtime Logs

**Heroku:**
```bash
heroku logs --tail
```

### 5. Set Up Custom Domain (Optional)

Most platforms support custom domains:

**Railway:**
```bash
railway domain add api.nhscareerboost.co.uk
```

**Render:**
- Settings → Custom Domain → Add

**DigitalOcean:**
- Settings → Domains → Add Domain

**Heroku:**
```bash
heroku domains:add api.nhscareerboost.co.uk
```

Then add CNAME record in your DNS:
```
CNAME api.nhscareerboost.co.uk → your-platform-domain.com
```

---

## Environment Variables Reference

| Variable | Example | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (usually auto-set by platform) |
| `NODE_ENV` | `production` | Environment mode |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP server port |
| `SMTP_USER` | `daniel@nhscareerboost.co.uk` | SMTP username |
| `SMTP_PASSWORD` | `abcd efgh ijkl mnop` | Gmail app password |
| `SMTP_FROM` | `daniel@nhscareerboost.co.uk` | From email address |
| `STRIPE_SECRET_KEY` | `sk_live_xxxxx` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxxxx` | Stripe webhook signing secret |
| `ADMIN_EMAIL` | `daniel@nhscareerboost.co.uk` | Admin notification email |
| `ALLOWED_ORIGINS` | `https://nhscareerboost.co.uk` | Comma-separated CORS origins |

---

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use strong app passwords** - Generate new Gmail app password
3. **Enable 2FA** - On Gmail account
4. **Rotate secrets regularly** - Update passwords quarterly
5. **Monitor logs** - Check for suspicious activity
6. **Use HTTPS only** - Enforce SSL/TLS
7. **Keep dependencies updated** - Run `npm audit` regularly

---

## Monitoring & Maintenance

### Health Checks

Set up automated health checks:

**UptimeRobot (Free):**
1. Create account at https://uptimerobot.com
2. Add monitor: `https://your-domain.com/health`
3. Set check interval: 5 minutes
4. Add alert contacts

**Pingdom:**
Similar setup for more advanced monitoring

### Log Monitoring

Watch for these patterns:
- ✅ Successful operations
- ❌ Error patterns
- ⚠️ CORS violations
- 💰 Payment events

### Regular Maintenance

**Weekly:**
- Check error logs
- Verify email delivery
- Test contact form

**Monthly:**
- Review Stripe webhook logs
- Check for failed payments
- Update dependencies: `npm update`

**Quarterly:**
- Security audit: `npm audit`
- Rotate credentials
- Review rate limits

---

## Troubleshooting Production Issues

### Emails Not Sending

1. Check SMTP credentials in environment variables
2. Verify Gmail app password hasn't expired
3. Check platform logs for SMTP errors
4. Test SMTP connection from deployment platform

### Webhook Failures

1. Check Stripe dashboard webhook logs
2. Verify webhook secret matches
3. Ensure endpoint is publicly accessible
4. Check for SSL certificate issues

### High Memory Usage

1. Check for memory leaks in logs
2. Restart service
3. Consider upgrading plan

### Rate Limit Issues

Adjust in `index.js` if needed:
```javascript
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Increase if needed
});
```

---

## Rollback Procedure

If deployment fails:

**Railway:**
```bash
railway rollback
```

**Render:**
- Manual Deploys → Redeploy previous version

**Heroku:**
```bash
heroku rollback
```

**DigitalOcean:**
- Deployments → Redeploy previous version

---

## Support

For deployment issues:
- Email: daniel@nhscareerboost.co.uk
- Check platform documentation
- Review server logs

---

**Good luck with your deployment! 🚀**
