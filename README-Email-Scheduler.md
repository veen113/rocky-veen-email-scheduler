# 📧 Email Scheduler - Rocky Veen Collaboration Tool

A powerful web application for scheduling and sending collaboration emails from `collab@rockyveen.com` to potential business partners. Supports both single email sending and bulk email campaigns via CSV upload.

## 🌟 Features

### ✉️ Single Email Sending
- Send individual collaboration emails
- Schedule emails for future delivery
- Real-time email configuration testing
- Professional email templates

### 📊 Bulk Email Campaigns
- Upload CSV files with email lists
- Support for company names and email addresses
- Batch processing with rate limiting
- Schedule entire campaigns for future delivery

### ⏰ Email Scheduling
- Schedule single emails or bulk campaigns
- View all scheduled emails
- Cancel scheduled emails before they're sent
- Automatic cleanup of completed schedules

### 🎨 Modern UI
- Responsive design for all devices
- Tabbed interface for easy navigation
- Drag-and-drop CSV file upload
- Real-time status updates and notifications

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- Gmail account with App Password (for collab@rockyveen.com)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your email credentials:
   ```env
   EMAIL_USER=collab@rockyveen.com
   EMAIL_PASSWORD=your_app_specific_password_here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Main app: http://localhost:3000
   - Email Scheduler: http://localhost:3000/email-scheduler

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in your `.env` file

### Other Email Providers
The application uses Nodemailer and supports various email providers. Update the transporter configuration in `routes/email-scheduler.js`:

```javascript
const transporter = nodemailer.createTransporter({
    host: 'your-smtp-host.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

## 📄 CSV Format

For bulk email campaigns, your CSV file should have the following structure:

```csv
email,companyName
contact@company1.com,Company One
hello@company2.com,Company Two
info@company3.com,Company Three
```

### Supported Column Names
The application accepts various column name formats:
- **Email**: `email`, `Email`, `EMAIL`
- **Company**: `companyName`, `company name`, `Company`, `COMPANY`, `Company Name`

## 🎯 API Endpoints

### Single Email
```http
POST /api/email/send-single
Content-Type: application/json

{
    "email": "contact@company.com",
    "companyName": "Company Name",
    "scheduleTime": "2024-01-15T10:00:00" // Optional
}
```

### Bulk Email
```http
POST /api/email/send-bulk
Content-Type: multipart/form-data

csvFile: [CSV file]
scheduleTime: "2024-01-15T10:00:00" // Optional
```

### Scheduled Emails
```http
GET /api/email/scheduled        # List all scheduled emails
DELETE /api/email/scheduled/:id # Cancel scheduled email
```

### Test Configuration
```http
POST /api/email/test           # Test email configuration
```

## 📝 Email Template

The application sends professional collaboration emails with the following structure:

- **Subject**: "Collaboration Opportunity with [Company Name]"
- **Content**: Professional introduction and collaboration proposal
- **Sender**: collab@rockyveen.com
- **Format**: HTML with responsive design

### Customizing the Template

Edit the `createEmailTemplate` function in `routes/email-scheduler.js` to customize:
- Email subject line
- Email content and styling
- Company branding
- Call-to-action messages

## 🔧 Configuration Options

### Environment Variables
```env
# Email Configuration
EMAIL_USER=collab@rockyveen.com
EMAIL_PASSWORD=your_app_specific_password

# Server Configuration
PORT=3000
NODE_ENV=development

# Rate Limiting
REQUESTS_PER_MINUTE=60
```

### Rate Limiting
The application includes built-in rate limiting to prevent spam:
- 1-second delay between bulk emails
- Configurable requests per minute
- Automatic retry logic for failed sends

## 🛡️ Security Features

- **Environment Variables**: Sensitive data stored in `.env` file
- **Input Validation**: Email and company name validation
- **File Type Validation**: Only CSV files accepted
- **Rate Limiting**: Prevents email spam and API abuse
- **Error Handling**: Comprehensive error logging and user feedback

## 📊 Monitoring & Logging

The application provides comprehensive logging:
- Email send success/failure status
- Scheduled email execution
- Error tracking and debugging
- Performance metrics

## 🚀 Production Deployment

### Recommended Setup
1. Use a process manager like PM2
2. Set up reverse proxy with Nginx
3. Enable HTTPS with SSL certificates
4. Configure proper logging and monitoring
5. Set up database for persistent scheduling (optional)

### Environment Configuration
```env
NODE_ENV=production
PORT=3000
EMAIL_USER=collab@rockyveen.com
EMAIL_PASSWORD=your_production_app_password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section below
- Review the API documentation
- Contact the development team

## 🔧 Troubleshooting

### Common Issues

**Email not sending:**
- Check your email credentials in `.env`
- Verify App Password is correct
- Test email configuration using the "Test Email Config" button

**CSV upload fails:**
- Ensure CSV has correct column names (`email`, `companyName`)
- Check file size (max 10MB)
- Verify CSV format and encoding

**Scheduled emails not working:**
- Check server time zone settings
- Verify cron job permissions
- Review server logs for errors

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

This will provide detailed console output for troubleshooting.
