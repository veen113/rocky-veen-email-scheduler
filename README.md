# Instagram Business Email Finder

A web application that discovers newly created Instagram business accounts and finds their email addresses for collaboration purposes. Perfect for influencer marketing, business outreach, and partnership opportunities.

## Features

- 🔍 **Smart Instagram Search**: Find business accounts by niche and location
- 📧 **Email Discovery**: Automatically find email addresses using Hunter.io API
- 🎯 **Business Account Detection**: Filter for business accounts with company information
- 📊 **Bulk Processing**: Find emails for multiple accounts at once
- 📈 **Export Functionality**: Export results to CSV for further analysis
- 🎨 **Modern UI**: Beautiful, responsive interface with real-time updates

## Prerequisites

- Node.js (v14 or higher)
- Hunter.io API key (free tier available)
- Chrome/Chromium browser (for Puppeteer)

## Installation

1. **Clone or download the project**
   ```bash
   cd "/Users/fathimachowdhury/Documents/Email Send Tool"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your API keys:
   ```
   HUNTER_API_KEY=your_hunter_io_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Get your Hunter.io API key**
   - Sign up at [Hunter.io](https://hunter.io/)
   - Go to API section in your dashboard
   - Copy your API key and paste it in the `.env` file

## Usage

1. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to `http://localhost:3000`

3. **Search for Instagram business accounts**
   - Enter a business niche (e.g., "fitness", "beauty", "food")
   - Optionally add a location filter
   - Choose the number of results you want
   - Click "Search Accounts"

4. **Find email addresses**
   - Click "Find Email" on individual accounts
   - Or use "Find All Emails" to process all results at once
   - View confidence scores and email verification status

5. **Export results**
   - Click "Export CSV" to download all results
   - Includes usernames, company names, and found emails

## API Endpoints

### Instagram Routes
- `POST /api/instagram/search` - Search for business accounts
- `GET /api/instagram/account/:username` - Get detailed account information

### Email Routes
- `POST /api/email/find` - Find email for a company
- `POST /api/email/verify` - Verify an email address
- `POST /api/email/bulk-find` - Find emails for multiple companies

## Configuration

### Environment Variables
- `HUNTER_API_KEY` - Your Hunter.io API key (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `REQUESTS_PER_MINUTE` - Rate limiting (default: 60)

### Rate Limiting
The app includes built-in rate limiting to respect API quotas:
- Instagram searches are limited to avoid detection
- Email API calls are spaced out to prevent rate limiting
- Hunter.io free tier: 50 requests/month

## Troubleshooting

### Common Issues

1. **"Hunter.io API key not configured"**
   - Make sure you've added your API key to the `.env` file
   - Restart the server after adding the key

2. **Instagram search returns no results**
   - Try different keywords or broader terms
   - Some niches may have fewer business accounts
   - Instagram may temporarily block requests (try again later)

3. **Puppeteer fails to launch**
   - Install Chrome/Chromium browser
   - On Linux: `sudo apt-get install chromium-browser`
   - On macOS: Chrome should be installed automatically

4. **No emails found**
   - Company names may not have associated domains
   - Try searching with different company name variations
   - Some businesses may not have public email addresses

### Performance Tips

- Start with smaller result sets (10-20 accounts)
- Use specific niche keywords for better targeting
- Process emails in batches to avoid rate limits
- Export results regularly to avoid losing data

## API Limits

### Hunter.io Free Tier
- 50 requests per month
- 25 email verifications per month
- Upgrade for higher limits

### Instagram
- No official API for this use case
- Web scraping has inherent limitations
- Respect rate limits to avoid temporary blocks

## Legal Considerations

- This tool is for legitimate business outreach only
- Respect Instagram's Terms of Service
- Follow email marketing regulations (CAN-SPAM, GDPR)
- Always provide opt-out options in your communications
- Use found emails responsibly and ethically

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the console logs for error details
3. Ensure all API keys are properly configured
4. Verify your internet connection and API quotas

## Roadmap

- [ ] Integration with additional email finder services
- [ ] Advanced filtering options
- [ ] Email template generation
- [ ] CRM integration
- [ ] Automated follow-up sequences
- [ ] Analytics and reporting dashboard

---

**Disclaimer**: This tool is for educational and legitimate business purposes only. Always respect platform terms of service and applicable laws when using this software.
