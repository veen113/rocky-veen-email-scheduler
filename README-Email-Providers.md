# 📧 Email Provider Configuration Guide

Your Rocky Veen Email Scheduler now supports **both Resend API and SMTP/IMAP**! Choose the method that works best for your deployment.

## 🔄 **Switching Between Providers**

Set the `EMAIL_PROVIDER` environment variable:
- `EMAIL_PROVIDER=resend` (default) - Uses Resend API
- `EMAIL_PROVIDER=smtp` - Uses traditional SMTP

## 🚀 **Option 1: Resend API (Recommended for Railway)**

### **Pros:**
- ✅ Works on Railway free tier
- ✅ Better deliverability
- ✅ 3,000 emails/month free
- ✅ Real-time tracking
- ✅ No port blocking issues

### **Environment Variables:**
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key_here
NODE_ENV=production
```

### **Setup Steps:**
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Verify your domain (optional but recommended)
4. Add `RESEND_API_KEY` to Railway

## 📧 **Option 2: SMTP/IMAP (Traditional Email)**

### **Pros:**
- ✅ Works with any email provider
- ✅ Use your existing email account
- ✅ Full control over email settings
- ✅ Works with PrivateEmail, Gmail, etc.

### **Environment Variables:**
```env
EMAIL_PROVIDER=smtp
EMAIL_USER=collab@rockyveen.com
EMAIL_PASSWORD=your_password
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
NODE_ENV=production
```

### **Common SMTP Settings:**

#### **PrivateEmail.com:**
```env
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
```

#### **Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_PASSWORD=your_app_password
```

#### **Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

## ⚠️ **Important Notes**

### **For Railway Deployment:**
- **Free/Hobby tiers**: SMTP is blocked, use Resend
- **Pro/Enterprise tiers**: Both SMTP and Resend work

### **For Local Development:**
- Both providers work perfectly
- Test with `npm start` locally

## 🧪 **Testing Your Configuration**

1. **Visit your app**: `/email-scheduler`
2. **Click "Test Email Config"**
3. **Should show**: 
   - ✅ "Email configuration is valid (using Resend API)"
   - ✅ "Email configuration is valid (using SMTP: host:port)"

## 🔄 **Switching Providers**

To switch from Resend to SMTP:
1. **Add SMTP environment variables**
2. **Set `EMAIL_PROVIDER=smtp`**
3. **Remove or keep `RESEND_API_KEY`** (won't be used)
4. **Redeploy your app**

To switch from SMTP to Resend:
1. **Add `RESEND_API_KEY`**
2. **Set `EMAIL_PROVIDER=resend`** (or remove it, as resend is default)
3. **SMTP variables can stay** (won't be used)
4. **Redeploy your app**

## 🎯 **Recommendation**

- **Railway Free/Hobby**: Use Resend API
- **Railway Pro/Enterprise**: Either provider works
- **Local Development**: Either provider works
- **Other Hosting**: SMTP usually works fine

Your email scheduler automatically adapts to whichever provider you configure! 🚀
