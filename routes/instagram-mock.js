const express = require('express');
const router = express.Router();

// Mock Instagram business account data for testing
const mockAccounts = [
    {
        username: 'fitnessstudio_nyc',
        description: 'Premium fitness studio in Manhattan 💪 Personal training & group classes 📍 NYC',
        discoveredAt: new Date().toISOString(),
        businessCategory: 'Fitness Studio',
        companyName: 'Elite Fitness Studio NYC',
        isBusinessAccount: true,
        followers: '12.5K',
        following: '890',
        posts: '245'
    },
    {
        username: 'healthyeats_cafe',
        description: 'Organic cafe & juice bar 🥗 Fresh ingredients daily 📍 Brooklyn, NY',
        discoveredAt: new Date().toISOString(),
        businessCategory: 'Restaurant',
        companyName: 'Healthy Eats Cafe',
        isBusinessAccount: true,
        followers: '8.2K',
        following: '456',
        posts: '189'
    },
    {
        username: 'beautysalon_miami',
        description: 'Full service beauty salon ✨ Hair, nails, skincare 📍 Miami Beach',
        discoveredAt: new Date().toISOString(),
        businessCategory: 'Beauty Salon',
        companyName: 'Glamour Beauty Salon',
        isBusinessAccount: true,
        followers: '15.8K',
        following: '1.2K',
        posts: '567'
    },
    {
        username: 'techstartup_sf',
        description: 'AI-powered productivity tools 🚀 Helping teams work smarter 📍 San Francisco',
        discoveredAt: new Date().toISOString(),
        businessCategory: 'Technology Company',
        companyName: 'InnovateTech Solutions',
        isBusinessAccount: true,
        followers: '5.4K',
        following: '234',
        posts: '98'
    },
    {
        username: 'fashionboutique_la',
        description: 'Sustainable fashion boutique 👗 Eco-friendly clothing 📍 Los Angeles',
        discoveredAt: new Date().toISOString(),
        businessCategory: 'Clothing Store',
        companyName: 'Green Fashion Boutique',
        isBusinessAccount: true,
        followers: '22.1K',
        following: '678',
        posts: '432'
    }
];

// Mock search endpoint
router.post('/search-mock', async (req, res) => {
    try {
        const { niche, location, limit = 20 } = req.body;
        
        console.log(`Mock search for niche: ${niche}, location: ${location}`);
        
        // Filter mock accounts based on niche
        let filteredAccounts = mockAccounts;
        
        if (niche) {
            const nicheLower = niche.toLowerCase();
            filteredAccounts = mockAccounts.filter(account => 
                account.description.toLowerCase().includes(nicheLower) ||
                account.businessCategory.toLowerCase().includes(nicheLower) ||
                account.companyName.toLowerCase().includes(nicheLower)
            );
        }
        
        // Apply location filter if provided
        if (location) {
            const locationLower = location.toLowerCase();
            filteredAccounts = filteredAccounts.filter(account =>
                account.description.toLowerCase().includes(locationLower)
            );
        }
        
        // Limit results
        const results = filteredAccounts.slice(0, limit);
        
        // Add some randomness to make it feel more realistic
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        res.json({
            success: true,
            data: results,
            count: results.length,
            message: 'Mock data - replace with real Instagram scraping'
        });
        
    } catch (error) {
        console.error('Mock search error:', error);
        res.status(500).json({ 
            error: 'Mock search failed',
            details: error.message 
        });
    }
});

// Mock account details endpoint
router.get('/account-mock/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        const account = mockAccounts.find(acc => acc.username === username);
        
        if (!account) {
            return res.status(404).json({
                success: false,
                error: 'Account not found'
            });
        }
        
        // Add some delay to simulate real API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        res.json({
            success: true,
            data: {
                bio: account.description,
                followers: account.followers,
                following: account.following,
                posts: account.posts,
                isBusinessAccount: account.isBusinessAccount,
                businessCategory: account.businessCategory,
                companyName: account.companyName,
                extractedAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Mock account details error:', error);
        res.status(500).json({ 
            error: 'Failed to get mock account details',
            details: error.message 
        });
    }
});

module.exports = router;
