# PropellerAds Integration Guide

This guide will help you set up PropellerAds for your tic-tac-toe game.

## 🚀 **Step 1: Sign Up for PropellerAds**

1. Go to [PropellerAds.com](https://propellerads.com)
2. Click "Sign Up" and create your account
3. Verify your email address
4. Complete your profile information

## 🔧 **Step 2: Get Your Site ID**

1. In your PropellerAds dashboard, go to "Sites"
2. Click "Add New Site"
3. Enter your domain (e.g., `https://your-app.vercel.app`)
4. Copy your **Site ID** (looks like: `123456`)

## 📝 **Step 3: Update Your Configuration**

Replace `YOUR_PROPADS_SITE_ID` in these files with your actual Site ID:

### **File 1: `public/sw.js`**
```javascript
const PROPADS_SITE_ID = 'YOUR_ACTUAL_SITE_ID';
```

### **File 2: `index.html`**
```html
<meta name="propads-site-id" content="YOUR_ACTUAL_SITE_ID" />
```

## 🎯 **Step 4: Create Ad Zones**

In your PropellerAds dashboard:

1. Go to "Ad Zones"
2. Create 3 ad zones:

#### **Zone 1: Header Banner**
- **Name**: "Tic-Tac-Toe Header"
- **Size**: 728x90 (Leaderboard)
- **Type**: Display

#### **Zone 2: Sidebar**
- **Name**: "Tic-Tac-Toe Sidebar"
- **Size**: 160x600 (Wide Skyscraper)
- **Type**: Display

#### **Zone 3: Game Over**
- **Name**: "Tic-Tac-Toe Game Over"
- **Size**: 300x250 (Medium Rectangle)
- **Type**: Display

## 🔄 **Step 5: Update Ad Components**

Replace the AdSense components with PropellerAds:

### **Update `src/ui/AdBanner.tsx`**
```typescript
// Replace AdSense code with PropellerAds
const PROPADS_SITE_ID = 'YOUR_ACTUAL_SITE_ID';
const PROPADS_ZONE_ID = 'YOUR_ZONE_ID';
```

## 🧪 **Step 6: Test Your Integration**

1. **Deploy your changes** to Vercel
2. **Visit your live site**
3. **Check browser console** for service worker registration
4. **Verify ads appear** in the correct locations

## 📊 **Step 7: Monitor Performance**

- Check your PropellerAds dashboard for:
  - **Impressions**: How many times ads are shown
  - **Clicks**: How many times ads are clicked
  - **Revenue**: Your earnings

## 🚨 **Troubleshooting**

### **Service Worker Not Loading**
- Check that `sw.js` is accessible at `https://yourdomain.com/sw.js`
- Verify the file is in the `public` directory

### **Ads Not Showing**
- Verify your Site ID is correct
- Check that your site is approved in PropellerAds
- Ensure ad zones are active

### **Low Revenue**
- Try different ad sizes
- Test different ad placements
- Optimize your game for better engagement

## 💰 **Expected Revenue**

- **Small games**: $5-25/month
- **Popular games**: $50-200/month
- **Viral games**: $200-1000+/month

## 🎯 **Pro Tips**

1. **A/B test** different ad placements
2. **Monitor performance** regularly
3. **Optimize for mobile** users
4. **Keep ads relevant** to your game
5. **Don't overdo it** - too many ads hurt user experience

## 📞 **Support**

- PropellerAds Support: Available in dashboard
- Documentation: [PropellerAds Docs](https://propellerads.com/docs)
- Community: PropellerAds forums

## 🔄 **Next Steps**

1. **Set up PropellerAds account**
2. **Get your Site ID**
3. **Update the configuration files**
4. **Deploy and test**
5. **Monitor and optimize**

Your tic-tac-toe game is now ready for PropellerAds monetization!
