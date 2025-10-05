// Test Instagram business account discovery
const axios = require('axios');

async function testInstagramSearch() {
    console.log('🧪 Testing Instagram Business Account Discovery...\n');
    
    try {
        console.log('Testing Instagram search with "fitness" niche...');
        
        const response = await axios.post('http://localhost:3000/api/instagram/search', {
            niche: 'fitness',
            location: '',
            limit: 5
        });
        
        console.log('✅ Instagram search endpoint is working!');
        console.log(`Found ${response.data.count} accounts`);
        
        if (response.data.data && response.data.data.length > 0) {
            console.log('\n📋 Sample results:');
            response.data.data.slice(0, 3).forEach((account, index) => {
                console.log(`${index + 1}. @${account.username}`);
                console.log(`   Description: ${account.description || 'No description'}`);
                console.log(`   Discovered: ${account.discoveredAt}`);
                console.log('');
            });
        }
        
        console.log('🎉 Instagram business account discovery is working!');
        console.log('\n📝 Next steps:');
        console.log('1. Open http://localhost:3000 in your browser');
        console.log('2. Try searching for different business niches');
        console.log('3. View account details and visit Instagram profiles');
        console.log('4. Export results to CSV when ready');
        
    } catch (error) {
        if (error.response) {
            console.error('❌ API Error:', error.response.data);
        } else {
            console.error('❌ Test failed:', error.message);
        }
        
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure the server is running (npm start)');
        console.log('2. Check if Puppeteer can launch Chrome');
        console.log('3. Verify Instagram is accessible');
        console.log('4. Try with a different niche keyword');
    }
}

// Run the test
testInstagramSearch();
