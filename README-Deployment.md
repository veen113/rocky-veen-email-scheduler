# 🚀 Railway Deployment Guide

## Environment Variables Required

Add these environment variables in Railway dashboard:

```env
EMAIL_USER=collab@rockyveen.com
EMAIL_PASSWORD=Ishaan198@
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
NODE_ENV=production
```

## Deployment Steps

1. Push code to GitHub repository
2. Connect Railway to your GitHub repo
3. Add environment variables
4. Deploy automatically

## Post-Deployment

- Your app will be available at: `https://your-app-name.railway.app`
- Email scheduler will be at: `https://your-app-name.railway.app/email-scheduler`

## Features Working on Railway

✅ Email sending (single & bulk)
✅ Email scheduling with cron jobs
✅ CSV file uploads
✅ Rate limiting and intervals
✅ 24/7 uptime
