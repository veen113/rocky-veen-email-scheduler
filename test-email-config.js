const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfig() {
    console.log('🔧 Testing Email Configuration...\n');
    
    // Check environment variables
    console.log('Environment Variables:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET (hidden)' : 'NOT SET');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
    console.log('');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('❌ Missing email credentials in .env file');
        console.log('Please add these to your .env file:');
        console.log('EMAIL_USER=collab@rockyveen.com');
        console.log('EMAIL_PASSWORD=Ishaan198@');
        console.log('SMTP_HOST=mail.privateemail.com');
        console.log('SMTP_PORT=465');
        return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'mail.privateemail.com',
        port: process.env.SMTP_PORT || 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        debug: true, // Enable debug output
        logger: true // Log to console
    });

    try {
        console.log('🔄 Testing SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!');
        
        console.log('\n🔄 Sending test email...');
        const testEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself for testing
            subject: 'Test Email - Rocky Veen Email Scheduler',
            html: `
                <h2>Test Email Successful! 🎉</h2>
                <p>This is a test email from your Rocky Veen Email Scheduler.</p>
                <p>If you received this, your email configuration is working correctly!</p>
                <p>Time: ${new Date().toLocaleString()}</p>
            `
        };

        const result = await transporter.sendMail(testEmail);
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', result.messageId);
        console.log('Response:', result.response);
        
    } catch (error) {
        console.log('❌ Email configuration failed:');
        console.log('Error:', error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n💡 Authentication failed. Please check:');
            console.log('1. Email address is correct: collab@rockyveen.com');
            console.log('2. Password is correct: Ishaan198@');
            console.log('3. SMTP settings match your email provider');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n💡 Connection failed. Please check:');
            console.log('1. SMTP host: mail.privateemail.com');
            console.log('2. SMTP port: 465');
            console.log('3. Internet connection');
        } else {
            console.log('\n💡 Full error details:');
            console.log(error);
        }
    }
}

testEmailConfig().catch(console.error);
