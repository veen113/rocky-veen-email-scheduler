# 🚀 Resend Email API Setup Guide

## Why Switch to Resend?

Railway blocks SMTP on free tiers, so we've switched to **Resend** - a modern email API that works over HTTPS.

## ✅ Benefits of Resend

- ✅ **Works on Railway free tier** (HTTPS API, not SMTP)
- ✅ **3,000 emails/month free**
- ✅ **Better deliverability** than SMTP
- ✅ **Real-time tracking** and analytics
- ✅ **No port blocking issues**

## 🔧 Setup Instructions

### Step 1: Sign Up for Resend

1. **Go to [resend.com](https://resend.com)**
2. **Sign up** with your email
3. **Verify your email** address

### Step 2: Get Your API Key

1. **Go to Resend dashboard**
2. **Click "API Keys"** in sidebar
3. **Click "Create API Key"**
4. **Name it**: "Rocky Veen Email Scheduler"
5. **Copy the API key** (starts with `re_`)

### Step 3: Add Domain (Optional but Recommended)

1. **Go to "Domains"** in Resend dashboard
2. **Click "Add Domain"**
3. **Enter**: `rockyveen.com`
4. **Follow DNS setup instructions**
5. **Or use Resend's test domain** for now

### Step 4: Update Railway Environment Variables

**Remove old SMTP variables and add:**

```env
RESEND_API_KEY=re_your_api_key_here
NODE_ENV=production
```

**Remove these old variables:**
- EMAIL_USER
- EMAIL_PASSWORD  
- SMTP_HOST
- SMTP_PORT

## 🧪 Test Your Setup

1. **Visit your app**: https://fortunate-laughter-production.up.railway.app/email-scheduler
2. **Click "Test Email Config"**
3. **Should show**: "Email configuration is valid (using Resend API)"
4. **Send a test email** to verify it works

## 📧 Email Sending Features

All your existing features still work:
- ✅ Single email sending
- ✅ Bulk CSV campaigns  
- ✅ Email scheduling
- ✅ Smart rate limiting
- ✅ Professional templates

## 🎯 Ready to Go!

Your Rocky Veen Email Scheduler now uses modern email API technology and works perfectly on Railway's free tier!
