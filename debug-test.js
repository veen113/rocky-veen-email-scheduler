// Debug test for Instagram scraping
const puppeteer = require('puppeteer');

async function debugInstagramScraping() {
    console.log('🔍 Debug: Testing Instagram scraping directly...\n');
    
    let browser;
    try {
        console.log('1. Launching browser...');
        browser = await puppeteer.launch({ 
            headless: false, // Show browser for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1280, height: 720 }
        });
        
        const page = await browser.newPage();
        
        console.log('2. Setting user agent...');
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log('3. Navigating to Instagram hashtag page...');
        const testUrl = 'https://www.instagram.com/explore/tags/fitness/';
        
        try {
            await page.goto(testUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            
            console.log('✅ Successfully loaded Instagram page');
            
            // Wait a bit for content to load
            await page.waitForTimeout(3000);
            
            console.log('4. Checking page content...');
            
            // Check if we can find any posts
            const posts = await page.$$('article a[href*="/p/"]');
            console.log(`Found ${posts.length} post links`);
            
            // Check for login requirement
            const loginButton = await page.$('a[href="/accounts/login/"]');
            if (loginButton) {
                console.log('⚠️  Instagram is asking for login');
            }
            
            // Check for rate limiting
            const errorText = await page.$eval('body', el => el.textContent).catch(() => '');
            if (errorText.includes('rate limit') || errorText.includes('try again')) {
                console.log('⚠️  Rate limited by Instagram');
            }
            
            // Try to extract some basic info
            const title = await page.title();
            console.log(`Page title: ${title}`);
            
            // Take a screenshot for debugging
            await page.screenshot({ path: 'debug-instagram.png', fullPage: false });
            console.log('📸 Screenshot saved as debug-instagram.png');
            
            if (posts.length > 0) {
                console.log('✅ Found posts - scraping should work');
                
                // Try to extract some account info
                const accountInfo = await page.evaluate(() => {
                    const posts = document.querySelectorAll('article a[href*="/p/"]');
                    const accounts = [];
                    
                    for (let i = 0; i < Math.min(3, posts.length); i++) {
                        const post = posts[i];
                        const href = post.getAttribute('href');
                        const img = post.querySelector('img');
                        const alt = img ? img.getAttribute('alt') : '';
                        
                        accounts.push({
                            postUrl: href,
                            description: alt
                        });
                    }
                    
                    return accounts;
                });
                
                console.log('Sample extracted data:');
                accountInfo.forEach((account, i) => {
                    console.log(`${i + 1}. Post: ${account.postUrl}`);
                    console.log(`   Alt text: ${account.description}`);
                });
            } else {
                console.log('❌ No posts found - may need different approach');
            }
            
        } catch (navError) {
            console.error('❌ Navigation failed:', navError.message);
        }
        
    } catch (error) {
        console.error('❌ Browser launch failed:', error.message);
    } finally {
        if (browser) {
            console.log('5. Closing browser...');
            await browser.close();
        }
    }
    
    console.log('\n🎯 Debug complete!');
    console.log('Check debug-instagram.png to see what the page looked like');
}

// Run debug test
debugInstagramScraping();
