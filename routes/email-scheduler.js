const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    }
});

// Email transporter configuration
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'mail.privateemail.com',
        port: process.env.SMTP_PORT || 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER || 'collab@rockyveen.com',
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Store scheduled emails (in production, use a database)
const scheduledEmails = new Map();

// Email template
const createEmailTemplate = (companyName, recipientEmail) => {
    return {
        from: 'collab@rockyveen.com',
        to: recipientEmail,
        subject: `Partnership Opportunity with @rockyveen – Proven Results Across Leading Brands & Categories`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; line-height: 1.6; color: #333;">
                <p>My name is Rocky Veen, and I'm the creator behind @rockyveen—a digital creator and visual innovator with over 101,000 engaged followers. I specialize in authentic, high‑quality content that builds real connections and drives results for brands.</p>
                
                <h3 style="color: #333; margin-top: 25px;">Brand Partnerships & Categories</h3>
                
                <h4 style="color: #555; margin-top: 20px;">Tech & Gadgets</h4>
                <p style="margin: 10px 0;">VANTRUE (automotive dash cams) • VITA (audio/earbuds) • Marcala (smart home safety) • iClever (kids' headphones) • Slimwalt (fan‑out minimalist wallet) • Nixplay (smart digital photo frame) • SHERRIVA (8K HDMI splitter) • PolarPro (CineBlack filter) • Ascrono (MacBook docking station) • iTourTranslator (real‑time translation earbuds)</p>
                
                <h4 style="color: #555; margin-top: 20px;">Food & Beverage</h4>
                <p style="margin: 10px 0;">Casa Maestri (premium tequila) • Fruit Riot (candy/snacks) • Burgerman.in (QSR/restaurant) • Mezbaan Kitchen (Hyderabad cuisine) • Cafe Niloufer (iconic café) • Desi Chowrastha (Atlanta's South Asian hub) • Pureboost (clean energy mix) • Java Factory Coffee (flavored pod sampler & variety packs) • H‑E‑B (Texas grocery chain) • Buc‑ee's (Texas iconic travel stop & snacks) • OVIA (mushroom coffee) • Gratsi (boxed wines)</p>
                
                <h4 style="color: #555; margin-top: 20px;">Lifestyle & Home</h4>
                <p style="margin: 10px 0;">Clifton Essentials (modern home decor) • PINCHme (product sampling/reviews) • Encool (vacuum‑insulated hydration bottles) • UVI (self‑heating, UV‑sanitizing smart lunchbox) • Fritaire (self‑cleaning air fryer) • LED mirror (frameless/adjustable lighting) • WiseSky W CAT (pet‑focused air purifier) • Tiken (airtight coffee canister) • 27 oz glass pantry jars (bamboo lids) • Magnetic phone holder (vacuum‑lock)</p>
                
                <h4 style="color: #555; margin-top: 20px;">Family & Kids</h4>
                <p style="margin: 10px 0;">Lesong Sensory Toy (educational learning toys) • Meteer (AI interactive robot toy)</p>
                
                <h4 style="color: #555; margin-top: 20px;">Wellness & Beauty</h4>
                <p style="margin: 10px 0;">Next Step Psychiatry (mental wellness) • Svvimer (rice water shampoo) • Orthopedic diabetic walking shoes (men's)</p>
                
                <h4 style="color: #555; margin-top: 20px;">Fashion & Social Impact / Outdoors</h4>
                <p style="margin: 10px 0;">Sashka Co. Bracelets (artisan accessories, giveaway partner) • MAELREG (golf apparel) • C7 Skates (retro inline skates)</p>
                
                <h4 style="color: #555; margin-top: 20px;">Tools & DIY</h4>
                <p style="margin: 10px 0;">Evridwear (touchscreen and cut‑resistant gloves) • YOSUKATA (13.5" carbon steel wok)</p>
                
                <h3 style="color: #333; margin-top: 30px;">Why Partner With Me?</h3>
                
                <p><strong>Diverse, Trusted Portfolio:</strong> I engage varied audiences across tech, food, lifestyle, wellness, family, beauty, and entertainment—tailoring content to each brand's unique voice.</p>
                
                <p><strong>Authentic Influence:</strong> My content sparks genuine conversation, connection, and action.</p>
                
                <p><strong>Professional Collaboration:</strong> Clear communication, reliable deliverables, and results‑driven strategy.</p>
                
                <p><strong>Proven Track Record:</strong> Campaigns that drive traffic, sales, and social buzz for both local and global brands.</p>
                
                <p>I offer a range of creative collaboration formats, including posts, reels, stories, giveaways, UGC, and full campaign bundles. I'm happy to share my media kit, analytics, or case studies to help you evaluate fit and ROI.</p>
                
                <p><strong>Let's Connect:</strong> If you're looking for a creator with a proven ability to generate buzz and deliver measurable results, I'd love to discuss how we can collaborate to elevate your brand.</p>
                
                <p>Looking forward to working together!</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="margin: 0;"><strong>Best regards,</strong></p>
                    <p style="margin: 5px 0;"><strong>Rocky Veen</strong></p>
                    <p style="margin: 5px 0;">Instagram: <a href="https://instagram.com/rockyveen" style="color: #0066cc;">@rockyveen</a></p>
                    <p style="margin: 5px 0;">Links: <a href="https://beacons.ai/rockyveen" style="color: #0066cc;">beacons.ai/rockyveen</a></p>
                    <p style="margin: 5px 0;">Collab: <a href="mailto:collab@rockyveen.com" style="color: #0066cc;">collab@rockyveen.com</a></p>
                </div>
            </div>
        `
    };
};

// Send single email
router.post('/send-single', async (req, res) => {
    try {
        const { email, companyName, scheduleTime } = req.body;

        if (!email || !companyName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and company name are required' 
            });
        }

        const transporter = createTransporter();
        const emailOptions = createEmailTemplate(companyName, email);

        if (scheduleTime) {
            // Schedule email for later
            const scheduleDate = new Date(scheduleTime);
            const now = new Date();

            if (scheduleDate <= now) {
                return res.status(400).json({
                    success: false,
                    message: 'Schedule time must be in the future'
                });
            }

            const scheduleId = `single_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Schedule the email
            const cronExpression = `${scheduleDate.getMinutes()} ${scheduleDate.getHours()} ${scheduleDate.getDate()} ${scheduleDate.getMonth() + 1} *`;
            
            const task = cron.schedule(cronExpression, async () => {
                try {
                    await transporter.sendMail(emailOptions);
                    console.log(`Scheduled email sent to ${email} for ${companyName}`);
                    scheduledEmails.delete(scheduleId);
                    task.destroy();
                } catch (error) {
                    console.error(`Failed to send scheduled email to ${email}:`, error);
                }
            }, {
                scheduled: false
            });

            task.start();
            scheduledEmails.set(scheduleId, {
                email,
                companyName,
                scheduleTime: scheduleDate,
                type: 'single',
                status: 'scheduled'
            });

            res.json({
                success: true,
                message: `Email scheduled for ${scheduleDate.toLocaleString()}`,
                scheduleId
            });
        } else {
            // Send immediately
            await transporter.sendMail(emailOptions);
            res.json({
                success: true,
                message: `Email sent successfully to ${email}`
            });
        }
    } catch (error) {
        console.error('Error sending single email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// Send bulk emails from CSV
router.post('/send-bulk', upload.single('csvFile'), async (req, res) => {
    try {
        const { scheduleTime, emailInterval, batchSize } = req.body;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'CSV file is required'
            });
        }

        const results = [];
        const emails = [];

        // Parse CSV file
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                // Support different column name variations
                const email = data.email || data.Email || data.EMAIL;
                const companyName = data.companyName || data['company name'] || data.Company || data.COMPANY || data['Company Name'];
                
                if (email && companyName) {
                    emails.push({ email: email.trim(), companyName: companyName.trim() });
                }
            })
            .on('end', async () => {
                try {
                    // Clean up uploaded file
                    fs.unlinkSync(req.file.path);

                    if (emails.length === 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'No valid email entries found in CSV. Please ensure your CSV has "email" and "companyName" columns.'
                        });
                    }

                    const transporter = createTransporter();

                    if (scheduleTime) {
                        // Schedule bulk emails
                        const scheduleDate = new Date(scheduleTime);
                        const now = new Date();

                        if (scheduleDate <= now) {
                            return res.status(400).json({
                                success: false,
                                message: 'Schedule time must be in the future'
                            });
                        }

                        const scheduleId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                        
                        const cronExpression = `${scheduleDate.getMinutes()} ${scheduleDate.getHours()} ${scheduleDate.getDate()} ${scheduleDate.getMonth() + 1} *`;
                        
                        const task = cron.schedule(cronExpression, async () => {
                            const results = [];
                            const intervalMs = parseInt(emailInterval) * 1000 || 5000; // Default 5 seconds
                            const batchSizeNum = parseInt(batchSize) || 10; // Default 10 emails per batch
                            const batchDelayMs = intervalMs * 5; // 5x interval between batches
                            
                            console.log(`Starting scheduled bulk email campaign: ${emails.length} emails`);
                            console.log(`Interval: ${intervalMs/1000}s, Batch size: ${batchSizeNum}, Batch delay: ${batchDelayMs/1000}s`);
                            
                            for (let i = 0; i < emails.length; i++) {
                                const { email, companyName } = emails[i];
                                const emailNumber = i + 1;
                                
                                try {
                                    console.log(`Sending scheduled email ${emailNumber}/${emails.length} to ${email}`);
                                    const emailOptions = createEmailTemplate(companyName, email);
                                    await transporter.sendMail(emailOptions);
                                    results.push({ 
                                        email, 
                                        companyName, 
                                        status: 'sent',
                                        sentAt: new Date().toISOString(),
                                        emailNumber
                                    });
                                    
                                    // Add interval between individual emails
                                    if (i < emails.length - 1) {
                                        console.log(`Waiting ${intervalMs/1000}s before next scheduled email...`);
                                        await new Promise(resolve => setTimeout(resolve, intervalMs));
                                    }
                                    
                                    // Add longer delay between batches
                                    if (emailNumber % batchSizeNum === 0 && i < emails.length - 1) {
                                        console.log(`Scheduled batch of ${batchSizeNum} completed. Waiting ${batchDelayMs/1000}s before next batch...`);
                                        await new Promise(resolve => setTimeout(resolve, batchDelayMs));
                                    }
                                    
                                } catch (error) {
                                    console.error(`Failed to send scheduled email ${emailNumber} to ${email}:`, error);
                                    results.push({ 
                                        email, 
                                        companyName, 
                                        status: 'failed', 
                                        error: error.message,
                                        emailNumber,
                                        failedAt: new Date().toISOString()
                                    });
                                    
                                    // Still wait the interval even on failure
                                    if (i < emails.length - 1) {
                                        await new Promise(resolve => setTimeout(resolve, intervalMs));
                                    }
                                }
                            }
                            console.log(`Scheduled bulk email campaign completed. Sent: ${results.filter(r => r.status === 'sent').length}, Failed: ${results.filter(r => r.status === 'failed').length}`);
                            scheduledEmails.delete(scheduleId);
                            task.destroy();
                        }, {
                            scheduled: false
                        });

                        task.start();
                        scheduledEmails.set(scheduleId, {
                            emails: emails.length,
                            scheduleTime: scheduleDate,
                            type: 'bulk',
                            status: 'scheduled'
                        });

                        res.json({
                            success: true,
                            message: `${emails.length} emails scheduled for ${scheduleDate.toLocaleString()}`,
                            scheduleId,
                            emailCount: emails.length
                        });
                    } else {
                        // Send immediately with intelligent intervals
                        const intervalMs = parseInt(emailInterval) * 1000 || 5000; // Default 5 seconds
                        const batchSizeNum = parseInt(batchSize) || 10; // Default 10 emails per batch
                        const batchDelayMs = intervalMs * 5; // 5x interval between batches
                        
                        console.log(`Starting bulk email campaign: ${emails.length} emails`);
                        console.log(`Interval: ${intervalMs/1000}s, Batch size: ${batchSizeNum}, Batch delay: ${batchDelayMs/1000}s`);
                        
                        for (let i = 0; i < emails.length; i++) {
                            const { email, companyName } = emails[i];
                            const emailNumber = i + 1;
                            
                            try {
                                console.log(`Sending email ${emailNumber}/${emails.length} to ${email}`);
                                const emailOptions = createEmailTemplate(companyName, email);
                                await transporter.sendMail(emailOptions);
                                results.push({ 
                                    email, 
                                    companyName, 
                                    status: 'sent',
                                    sentAt: new Date().toISOString(),
                                    emailNumber
                                });
                                
                                // Add interval between individual emails
                                if (i < emails.length - 1) { // Don't delay after last email
                                    console.log(`Waiting ${intervalMs/1000}s before next email...`);
                                    await new Promise(resolve => setTimeout(resolve, intervalMs));
                                }
                                
                                // Add longer delay between batches
                                if (emailNumber % batchSizeNum === 0 && i < emails.length - 1) {
                                    console.log(`Batch of ${batchSizeNum} completed. Waiting ${batchDelayMs/1000}s before next batch...`);
                                    await new Promise(resolve => setTimeout(resolve, batchDelayMs));
                                }
                                
                            } catch (error) {
                                console.error(`Failed to send email ${emailNumber} to ${email}:`, error);
                                results.push({ 
                                    email, 
                                    companyName, 
                                    status: 'failed', 
                                    error: error.message,
                                    emailNumber,
                                    failedAt: new Date().toISOString()
                                });
                                
                                // Still wait the interval even on failure to maintain rate limiting
                                if (i < emails.length - 1) {
                                    await new Promise(resolve => setTimeout(resolve, intervalMs));
                                }
                            }
                        }

                        const successCount = results.filter(r => r.status === 'sent').length;
                        const failCount = results.filter(r => r.status === 'failed').length;

                        res.json({
                            success: true,
                            message: `Bulk email completed. Sent: ${successCount}, Failed: ${failCount}`,
                            results
                        });
                    }
                } catch (error) {
                    console.error('Error processing bulk emails:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Failed to process bulk emails',
                        error: error.message
                    });
                }
            })
            .on('error', (error) => {
                console.error('Error parsing CSV:', error);
                // Clean up uploaded file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                res.status(500).json({
                    success: false,
                    message: 'Failed to parse CSV file',
                    error: error.message
                });
            });
    } catch (error) {
        console.error('Error in bulk email endpoint:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process bulk email request',
            error: error.message
        });
    }
});

// Get scheduled emails status
router.get('/scheduled', (req, res) => {
    const scheduled = Array.from(scheduledEmails.entries()).map(([id, data]) => ({
        id,
        ...data
    }));

    res.json({
        success: true,
        scheduled
    });
});

// Cancel scheduled email
router.delete('/scheduled/:id', (req, res) => {
    const { id } = req.params;
    
    if (scheduledEmails.has(id)) {
        scheduledEmails.delete(id);
        res.json({
            success: true,
            message: 'Scheduled email cancelled'
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Scheduled email not found'
        });
    }
});

// Test email configuration
router.post('/test', async (req, res) => {
    try {
        const transporter = createTransporter();
        
        // Verify transporter configuration
        await transporter.verify();
        
        res.json({
            success: true,
            message: 'Email configuration is valid'
        });
    } catch (error) {
        console.error('Email configuration test failed:', error);
        res.status(500).json({
            success: false,
            message: 'Email configuration test failed',
            error: error.message
        });
    }
});

module.exports = router;
