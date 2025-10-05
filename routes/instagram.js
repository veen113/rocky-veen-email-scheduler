const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();

// Instagram business account discovery
router.post('/search', async (req, res) => {
    try {
        const { niche, location, limit = 20 } = req.body;
        
        if (!niche) {
            return res.status(400).json({ error: 'Niche is required' });
        }

        const accounts = await searchInstagramBusinessAccounts(niche, location, limit);
        
        res.json({
            success: true,
            data: accounts,
            count: accounts.length
        });
    } catch (error) {
        console.error('Instagram search error:', error);
        res.status(500).json({ 
            error: 'Failed to search Instagram accounts',
            details: error.message 
        });
    }
});

// Function to search Instagram business accounts
async function searchInstagramBusinessAccounts(niche, location, limit) {
    let browser;
    
    try {
        browser = await puppeteer.launch({ 
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor'
            ]
        });
        
        const page = await browser.newPage();
        
        // Set realistic viewport and user agent
        await page.setViewport({ width: 1366, height: 768 });
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Set additional headers
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });
        
        const accounts = [];
        const searchQueries = generateSearchQueries(niche, location);
        
        console.log(`Starting search for queries: ${searchQueries.slice(0, 2).join(', ')}`);
        
        for (const query of searchQueries.slice(0, 2)) { // Limit to 2 queries to avoid rate limiting
            try {
                console.log(`Searching for: ${query}`);
                
                const url = `https://www.instagram.com/explore/tags/${encodeURIComponent(query)}/`;
                console.log(`Navigating to: ${url}`);
                
                await page.goto(url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000
                });
                
                // Wait for content to load
                await page.waitForTimeout(3000);
                
                // Check if we hit a login wall or other blocking
                const pageContent = await page.content();
                if (pageContent.includes('Log in to Instagram') || pageContent.includes('Sign up')) {
                    console.log('Hit login wall, trying alternative approach...');
                    
                    // Try to find any visible content anyway
                    const visibleAccounts = await page.evaluate(() => {
                        const accountData = [];
                        
                        // Look for any links that might be usernames
                        const links = document.querySelectorAll('a[href^="/"]');
                        const usernames = new Set();
                        
                        links.forEach(link => {
                            const href = link.getAttribute('href');
                            if (href && href.match(/^\/[a-zA-Z0-9._]+\/?$/) && !href.includes('/p/') && !href.includes('/explore/')) {
                                const username = href.replace(/\//g, '');
                                if (username.length > 2 && username.length < 30) {
                                    usernames.add(username);
                                }
                            }
                        });
                        
                        // Convert to account objects
                        Array.from(usernames).slice(0, 5).forEach(username => {
                            accountData.push({
                                username: username,
                                description: `Business account found via ${window.location.pathname}`,
                                discoveredAt: new Date().toISOString(),
                                source: 'hashtag_page'
                            });
                        });
                        
                        return accountData;
                    });
                    
                    if (visibleAccounts.length > 0) {
                        console.log(`Found ${visibleAccounts.length} accounts via alternative method`);
                        accounts.push(...visibleAccounts);
                    }
                    
                } else {
                    // Normal extraction method
                    console.log('Page loaded successfully, extracting accounts...');
                    
                    const pageAccounts = await page.evaluate(() => {
                        const accountData = [];
                        
                        // Method 1: Look for post links and extract usernames
                        const posts = document.querySelectorAll('a[href*="/p/"]');
                        console.log(`Found ${posts.length} posts`);
                        
                        posts.forEach((post, index) => {
                            if (index >= 8) return; // Limit per query
                            
                            try {
                                const href = post.getAttribute('href');
                                if (href) {
                                    const img = post.querySelector('img');
                                    const alt = img ? img.getAttribute('alt') : '';
                                    
                                    // Extract username from alt text or nearby elements
                                    let username = null;
                                    
                                    // Try to get username from alt text
                                    if (alt && alt.includes('Photo by')) {
                                        const match = alt.match(/Photo by (.+?) on/);
                                        if (match) username = match[1];
                                    }
                                    
                                    // Try to find username link nearby
                                    if (!username) {
                                        const container = post.closest('article') || post.closest('div');
                                        if (container) {
                                            const userLink = container.querySelector('a[href^="/"][href*="/"]');
                                            if (userLink) {
                                                const linkHref = userLink.getAttribute('href');
                                                if (linkHref && !linkHref.includes('/p/') && !linkHref.includes('/explore/')) {
                                                    username = linkHref.replace(/\//g, '');
                                                }
                                            }
                                        }
                                    }
                                    
                                    if (username && username.length > 2 && username.length < 30) {
                                        accountData.push({
                                            username: username,
                                            postUrl: `https://www.instagram.com${href}`,
                                            description: alt || 'Instagram business account',
                                            discoveredAt: new Date().toISOString(),
                                            source: 'post_extraction'
                                        });
                                    }
                                }
                            } catch (e) {
                                console.log('Error processing post:', e);
                            }
                        });
                        
                        // Method 2: Look for any profile links
                        const profileLinks = document.querySelectorAll('a[href^="/"]');
                        profileLinks.forEach(link => {
                            const href = link.getAttribute('href');
                            if (href && href.match(/^\/[a-zA-Z0-9._]+\/?$/) && !href.includes('/p/')) {
                                const username = href.replace(/\//g, '');
                                if (username.length > 2 && username.length < 30) {
                                    // Check if we already have this username
                                    const exists = accountData.some(acc => acc.username === username);
                                    if (!exists && accountData.length < 10) {
                                        accountData.push({
                                            username: username,
                                            description: 'Profile link found on hashtag page',
                                            discoveredAt: new Date().toISOString(),
                                            source: 'profile_link'
                                        });
                                    }
                                }
                            }
                        });
                        
                        return accountData;
                    });
                    
                    console.log(`Extracted ${pageAccounts.length} accounts from page`);
                    accounts.push(...pageAccounts);
                }
                
                // Add delay between requests
                await page.waitForTimeout(4000 + Math.random() * 2000);
                
            } catch (queryError) {
                console.error(`Error processing query ${query}:`, queryError.message);
                continue;
            }
        }
        
        // Remove duplicates and filter for business-like accounts
        const uniqueAccounts = filterBusinessAccounts(removeDuplicates(accounts, 'username'));
        
        return uniqueAccounts.slice(0, limit);
        
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Generate search queries based on niche and location
function generateSearchQueries(niche, location) {
    const baseQueries = [
        niche,
        `${niche}business`,
        `${niche}shop`,
        `${niche}store`,
        `${niche}brand`,
        `${niche}company`
    ];
    
    if (location) {
        baseQueries.push(
            `${niche}${location}`,
            `${location}${niche}`
        );
    }
    
    return baseQueries;
}

// Filter accounts that are likely to be businesses
function filterBusinessAccounts(accounts) {
    return accounts.filter(account => {
        const username = account.username.toLowerCase();
        const description = (account.description || '').toLowerCase();
        
        // Business indicators
        const businessKeywords = [
            'shop', 'store', 'business', 'company', 'brand', 'official',
            'boutique', 'studio', 'agency', 'service', 'llc', 'inc',
            'co', 'corp', 'ltd', 'group', 'team'
        ];
        
        return businessKeywords.some(keyword => 
            username.includes(keyword) || description.includes(keyword)
        );
    });
}

// Remove duplicate accounts
function removeDuplicates(accounts, key) {
    const seen = new Set();
    return accounts.filter(account => {
        const value = account[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

// Get account details
router.get('/account/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const accountDetails = await getAccountDetails(username);
        
        res.json({
            success: true,
            data: accountDetails
        });
    } catch (error) {
        console.error('Account details error:', error);
        res.status(500).json({ 
            error: 'Failed to get account details',
            details: error.message 
        });
    }
});

// Function to get detailed account information
async function getAccountDetails(username) {
    let browser;
    
    try {
        browser = await puppeteer.launch({ 
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        await page.goto(`https://www.instagram.com/${username}/`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        await page.waitForTimeout(2000);
        
        const accountDetails = await page.evaluate(() => {
            // Extract account information
            const bioElement = document.querySelector('div[data-testid="user-bio"]');
            const bio = bioElement ? bioElement.textContent : '';
            
            const followersElement = document.querySelector('a[href*="/followers/"] span');
            const followers = followersElement ? followersElement.textContent : '0';
            
            const followingElement = document.querySelector('a[href*="/following/"] span');
            const following = followingElement ? followingElement.textContent : '0';
            
            const postsElement = document.querySelector('div[data-testid="user-posts"] span');
            const posts = postsElement ? postsElement.textContent : '0';
            
            // Look for business indicators
            const isBusinessAccount = document.querySelector('[data-testid="business-category"]') !== null;
            const businessCategory = document.querySelector('[data-testid="business-category"]')?.textContent || '';
            
            // Extract potential company name from bio
            const companyName = extractCompanyName(bio);
            
            return {
                bio,
                followers,
                following,
                posts,
                isBusinessAccount,
                businessCategory,
                companyName,
                extractedAt: new Date().toISOString()
            };
        });
        
        return accountDetails;
        
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Extract potential company name from bio
function extractCompanyName(bio) {
    // Simple extraction - look for patterns that might indicate company names
    const lines = bio.split('\n');
    
    for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip if it's a URL, email, or hashtag
        if (trimmed.includes('http') || trimmed.includes('@') || trimmed.startsWith('#')) {
            continue;
        }
        
        // Look for business-like terms
        if (trimmed.match(/\b(LLC|Inc|Corp|Ltd|Co\.|Company|Business|Store|Shop|Brand)\b/i)) {
            return trimmed;
        }
        
        // If it's the first substantial line, it might be the company name
        if (trimmed.length > 3 && trimmed.length < 50) {
            return trimmed;
        }
    }
    
    return null;
}

module.exports = router;
