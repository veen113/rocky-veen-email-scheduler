const express = require('express');
const axios = require('axios');
const router = express.Router();

// Email finder using Hunter.io
router.post('/find', async (req, res) => {
    try {
        const { companyName, domain, firstName, lastName } = req.body;
        
        if (!companyName && !domain) {
            return res.status(400).json({ error: 'Company name or domain is required' });
        }
        
        let emailData = null;
        
        // Try different approaches to find email
        if (domain && firstName && lastName) {
            // Direct email finder with Hunter.io
            emailData = await findEmailWithHunter(domain, firstName, lastName);
        } else if (companyName) {
            // First try to find domain from company name
            const domainResult = await findDomainFromCompany(companyName);
            if (domainResult && domainResult.domain) {
                // Then try to find emails for that domain
                emailData = await findEmailsForDomain(domainResult.domain);
            }
        }
        
        res.json({
            success: true,
            data: emailData || { message: 'No email found' }
        });
        
    } catch (error) {
        console.error('Email finder error:', error);
        res.status(500).json({ 
            error: 'Failed to find email',
            details: error.message 
        });
    }
});

// Find email using Hunter.io API
async function findEmailWithHunter(domain, firstName, lastName) {
    const apiKey = process.env.HUNTER_API_KEY;
    
    if (!apiKey) {
        throw new Error('Hunter.io API key not configured');
    }
    
    try {
        const response = await axios.get('https://api.hunter.io/v2/email-finder', {
            params: {
                domain: domain,
                first_name: firstName,
                last_name: lastName,
                api_key: apiKey
            }
        });
        
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`Hunter.io API error: ${error.response?.data?.errors?.[0]?.details || error.message}`);
    }
}

// Find domain from company name using Hunter.io domain search
async function findDomainFromCompany(companyName) {
    const apiKey = process.env.HUNTER_API_KEY;
    
    if (!apiKey) {
        throw new Error('Hunter.io API key not configured');
    }
    
    try {
        const response = await axios.get('https://api.hunter.io/v2/domain-search', {
            params: {
                company: companyName,
                api_key: apiKey,
                limit: 1
            }
        });
        
        return response.data.data;
    } catch (error) {
        console.error('Domain search error:', error);
        return null;
    }
}

// Find emails for a specific domain
async function findEmailsForDomain(domain) {
    const apiKey = process.env.HUNTER_API_KEY;
    
    if (!apiKey) {
        throw new Error('Hunter.io API key not configured');
    }
    
    try {
        const response = await axios.get('https://api.hunter.io/v2/domain-search', {
            params: {
                domain: domain,
                api_key: apiKey,
                limit: 10
            }
        });
        
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`Hunter.io API error: ${error.response?.data?.errors?.[0]?.details || error.message}`);
    }
}

// Verify email address
router.post('/verify', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        const verificationResult = await verifyEmailWithHunter(email);
        
        res.json({
            success: true,
            data: verificationResult
        });
        
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ 
            error: 'Failed to verify email',
            details: error.message 
        });
    }
});

// Verify email using Hunter.io
async function verifyEmailWithHunter(email) {
    const apiKey = process.env.HUNTER_API_KEY;
    
    if (!apiKey) {
        throw new Error('Hunter.io API key not configured');
    }
    
    try {
        const response = await axios.get('https://api.hunter.io/v2/email-verifier', {
            params: {
                email: email,
                api_key: apiKey
            }
        });
        
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`Hunter.io API error: ${error.response?.data?.errors?.[0]?.details || error.message}`);
    }
}

// Bulk email finder
router.post('/bulk-find', async (req, res) => {
    try {
        const { accounts } = req.body;
        
        if (!accounts || !Array.isArray(accounts)) {
            return res.status(400).json({ error: 'Accounts array is required' });
        }
        
        const results = [];
        
        // Process accounts with rate limiting
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            
            try {
                let emailData = null;
                
                if (account.companyName) {
                    const domainResult = await findDomainFromCompany(account.companyName);
                    if (domainResult && domainResult.domain) {
                        emailData = await findEmailsForDomain(domainResult.domain);
                    }
                }
                
                results.push({
                    username: account.username,
                    companyName: account.companyName,
                    emailData: emailData,
                    processed: true
                });
                
                // Rate limiting - wait between requests
                if (i < accounts.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
            } catch (error) {
                results.push({
                    username: account.username,
                    companyName: account.companyName,
                    error: error.message,
                    processed: false
                });
            }
        }
        
        res.json({
            success: true,
            data: results,
            processed: results.length
        });
        
    } catch (error) {
        console.error('Bulk email finder error:', error);
        res.status(500).json({ 
            error: 'Failed to process bulk email search',
            details: error.message 
        });
    }
});

module.exports = router;
