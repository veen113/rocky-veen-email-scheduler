// Simple test to verify the setup
const axios = require('axios');

async function testSetup() {
    console.log('🧪 Testing Instagram Business Email Finder Setup...\n');
    
    try {
        // Test server is running
        console.log('1. Testing server connection...');
        const response = await axios.get('http://localhost:3000');
        console.log('✅ Server is running successfully');
        
        // Test API endpoints
        console.log('\n2. Testing API endpoints...');
        
        // Test Instagram search endpoint (should fail without proper data, but endpoint should exist)
        try {
            await axios.post('http://localhost:3000/api/instagram/search', {
                niche: 'test'
            });
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                console.log('✅ Instagram search endpoint exists');
            } else {
                console.log('❌ Instagram search endpoint not found');
            }
        }
        
        // Test email finder endpoint
        try {
            await axios.post('http://localhost:3000/api/email/find', {
                companyName: 'test'
            });
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                console.log('✅ Email finder endpoint exists');
            } else {
                console.log('❌ Email finder endpoint not found');
            }
        }
        
        console.log('\n🎉 Setup test completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Get your Hunter.io API key from https://hunter.io/');
        console.log('2. Add it to the .env file');
        console.log('3. Open http://localhost:3000 in your browser');
        console.log('4. Start searching for Instagram business accounts!');
        
    } catch (error) {
        console.error('❌ Setup test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure the server is running (npm start)');
        console.log('2. Check if port 3000 is available');
        console.log('3. Verify all dependencies are installed (npm install)');
    }
}

// Run the test
testSetup();
