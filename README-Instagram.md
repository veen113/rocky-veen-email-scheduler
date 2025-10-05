# Instagram Business Account Finder

A web application that discovers Instagram business accounts by niche and location for collaboration opportunities.

## 🎯 Current Features

- **Instagram Business Search**: Find accounts by business niche and location
- **Account Details**: View follower count, bio, business category, and more
- **Business Filtering**: Automatically identifies business accounts vs personal ones
- **Export to CSV**: Download account data for further analysis
- **Modern UI**: Clean, responsive interface with real-time search

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

4. **Search for business accounts**
   - Enter a niche (e.g., "fitness", "beauty", "food", "tech")
   - Optionally add a location
   - Click "Search Accounts"

## 🔍 How It Works

The app uses web scraping with Puppeteer to:
1. Search Instagram hashtags related to your niche
2. Extract account information from posts
3. Filter for business-like accounts
4. Provide detailed account information

## 📊 What You Get

For each business account found:
- Username and profile link
- Bio/description
- Follower/following counts
- Business category (if available)
- Company name extraction
- Discovery timestamp

## 🛠 Technical Details

- **Backend**: Node.js + Express + Puppeteer
- **Frontend**: Vanilla JavaScript + CSS3
- **No Database**: Stateless application
- **No API Keys Required**: Pure web scraping approach

## ⚠️ Important Notes

### Rate Limiting
- Instagram may temporarily block requests if too many are made
- The app includes delays between requests to minimize this
- Start with small result sets (10-20 accounts)

### Search Tips
- Use specific niche keywords for better results
- Try variations: "fitness", "gym", "workout", "health"
- Location filtering can help narrow results
- Business accounts are more likely to be found in commercial niches

### Limitations
- Results depend on Instagram's current structure
- Some searches may return fewer results
- Account details require additional requests (rate limited)
- No real-time updates (accounts are discovered at search time)

## 🎨 Usage Examples

**Fitness Niche**
```
Niche: fitness
Location: Los Angeles
Results: Gyms, personal trainers, fitness brands
```

**Food Business**
```
Niche: restaurant
Location: New York
Results: Restaurants, food trucks, catering services
```

**Beauty Industry**
```
Niche: beauty
Location: (leave empty for global)
Results: Salons, makeup artists, beauty brands
```

## 📈 Next Steps (Future Features)

- Email finding integration
- Advanced filtering options
- Bulk account analysis
- Engagement metrics
- Contact information extraction
- CRM integration

## 🔧 Troubleshooting

**No results found:**
- Try different niche keywords
- Remove location filter for broader search
- Check if Instagram is accessible
- Restart the server

**Puppeteer errors:**
- Ensure Chrome/Chromium is installed
- Check system permissions
- Try running with `--no-sandbox` flag

**Server issues:**
- Verify port 3000 is available
- Check Node.js version (requires v14+)
- Restart with `npm start`

## 📝 Testing

Run the test script to verify functionality:
```bash
node test-instagram.js
```

This will test the Instagram search endpoint and show sample results.

---

**Ready to find Instagram business accounts for your collaboration needs!** 🚀

Open `http://localhost:3000` and start discovering potential business partners in your niche.
