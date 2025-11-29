# Usefulio - Setup Guide

## 🎯 Brand Identity
- **Domain:** usefulio.com
- **Tagline:** "Find What's Actually Useful"
- **Mission:** Your trusted guide for useful product decisions

## 📊 Google Analytics Setup

### Step 1: Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for `usefulio.com`
3. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Update Code
Open `/app/app/layout.js` and replace:
```javascript
// Line 48 & 57 - Replace G-XXXXXXXXXX with your actual Measurement ID
<Script
  strategy="afterInteractive"
  src={`https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID_HERE`}
/>

gtag('config', 'YOUR_GA_ID_HERE', {
  page_path: window.location.pathname,
});
```

---

## 💰 Google AdSense Setup

### Step 1: Apply for Google AdSense
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Apply with your domain `usefulio.com`
3. Wait for approval (usually 1-2 weeks)
4. Get your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### Step 2: Update Code Files

#### A. Update Layout.js
File: `/app/app/layout.js` (Line 63)
```javascript
// Replace ca-pub-XXXXXXXXXXXXXXXX with your actual Publisher ID
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR_PUBLISHER_ID"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

#### B. Update AdSense Component
File: `/app/components/AdSense.js` (Line 23)
```javascript
// Replace ca-pub-XXXXXXXXXXXXXXXX with your actual Publisher ID
data-ad-client="YOUR_PUBLISHER_ID"
```

#### C. Update Ad Slots
After approval, create ad units in AdSense dashboard and replace slot IDs:

**Contact Page** (`/app/app/contact/page.js` - Line 159):
```javascript
<AdSense 
  adSlot="YOUR_AD_SLOT_ID_1"  // Replace 1234567890
  ...
/>
```

**Resources Page** (`/app/app/resources/page.js` - Line 176):
```javascript
<AdSense 
  adSlot="YOUR_AD_SLOT_ID_2"  // Replace 0987654321
  ...
/>
```

**Blog/Products Page** (`/app/app/blog/page.js` - Line 590):
```javascript
<AdSense 
  adSlot="YOUR_AD_SLOT_ID_3"  // Replace 1122334455
  ...
/>
```

---

## 🔍 SEO Optimization

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Add property: `usefulio.com`
3. Get verification code
4. Update `/app/app/layout.js` (Line 43):
```javascript
verification: {
  google: 'YOUR_VERIFICATION_CODE',
},
```

### Open Graph Images
Create and add these images to `/app/public/`:
- `og-image.jpg` (1200x630px) - For Open Graph
- `twitter-image.jpg` (1200x630px) - For Twitter Cards

---

## 🎨 AdSense Placement Strategy

### Current Placements (3 Ads Total):

1. **Contact Page** - Below contact form
   - Format: Responsive rectangle
   - Best for: User engagement after form submission
   
2. **Resources Page** - Bottom of page
   - Format: Horizontal leaderboard
   - Best for: After content consumption
   
3. **Blog/Products Page** - After product listings
   - Format: Horizontal leaderboard
   - Best for: High-traffic page monetization

### Performance Tips:
- Wait 24-48 hours after AdSense approval for ads to show
- Monitor AdSense dashboard for performance metrics
- Test different ad formats (responsive works best)
- Ensure ads don't disrupt user experience

---

## 🚀 Deployment Checklist

- [ ] Update Google Analytics ID in `layout.js`
- [ ] Update Google AdSense Publisher ID in `layout.js` and `AdSense.js`
- [ ] Update Ad Slot IDs in all 3 pages
- [ ] Add Google Search Console verification code
- [ ] Upload OG images to `/public/`
- [ ] Test all pages for ad display
- [ ] Submit sitemap to Google Search Console
- [ ] Set up domain redirects (www to non-www or vice versa)

---

## 📧 Contact Information
Update email addresses in `/app/app/contact/page.js`:
- Line 171-172: Currently set to `support@usefulio.com` and `hello@usefulio.com`

---

## 🔗 Important URLs
- Live Site: https://usefulio.com
- Analytics: https://analytics.google.com
- AdSense: https://www.google.com/adsense
- Search Console: https://search.google.com/search-console

---

**Note:** All placeholder IDs are marked with `XXXXXXXXXX` or similar patterns. Search for these in your codebase and replace with actual IDs after getting approved by Google services.
