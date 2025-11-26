# 🚀 Supabase Database Setup Instructions

## **IMPORTANT: You must set up your Supabase database before the website will work properly!**

The affiliate website requires a Supabase database with specific tables. Follow these steps to set up your database in just 5 minutes:

---

## 📋 Step-by-Step Setup Guide

### **Step 1: Access Supabase SQL Editor**

1. Open your browser and go to: **https://supabase.com/dashboard**
2. Sign in to your Supabase account
3. Select your project: **newixliyhbcskdcrxxsx**
4. In the left sidebar, click on **"SQL Editor"** (it has a database icon)
5. Click the **"New Query"** button (top right)

### **Step 2: Run the Database Setup Script**

1. Open the file `supabase-setup.sql` in this project
2. **Select ALL the content** (Ctrl+A or Cmd+A)
3. **Copy it** (Ctrl+C or Cmd+C)
4. **Paste it** into the Supabase SQL Editor
5. Click the **"RUN"** button (or press F5)

⏱️ **This will take about 10-30 seconds to complete**

### **Step 3: Verify the Setup**

After running the script, verify that tables were created:

1. In the left sidebar, click **"Table Editor"**
2. You should see these 6 tables:
   - ✅ **categories** (6 rows)
   - ✅ **products** (12 rows)
   - ✅ **blog_posts** (3 rows)
   - ✅ **reviews** (0 rows initially)
   - ✅ **free_resources** (5 rows)
   - ✅ **user_profiles** (0 rows initially)

3. Click on each table to see the sample data

### **Step 4: Test the Website**

1. Visit your website: **https://reviewhub-21.preview.emergentagent.com**
2. You should see:
   - ✅ Products displayed on the homepage
   - ✅ Categories working
   - ✅ Search functionality
   - ✅ All pages loading correctly

---

## 🎯 What the Setup Script Does

The `supabase-setup.sql` script automatically:

1. **Creates Tables:**
   - Categories for organizing products
   - Products with pricing and affiliate links
   - Blog posts for reviews and articles
   - Reviews system for user feedback
   - Free resources for members
   - User profiles for saved items

2. **Inserts Sample Data:**
   - 6 categories (AI/SaaS, Hosting, VPN, etc.)
   - 12 sample products with real-world examples
   - 3 blog posts
   - 5 free resources for members

3. **Sets Up Security:**
   - Row Level Security (RLS) policies
   - Public read access for products and blog
   - Protected user profiles
   - Member-only resources

4. **Optimizes Performance:**
   - Database indexes for faster queries
   - Proper relationships between tables

---

## 🔧 Database Schema Overview

### **categories**
- Product categories with icons and slugs
- Used for filtering and organization

### **products**
- Main product catalog
- Includes pricing, affiliate URLs, images
- Tracks views and sales clicks
- Supports ratings and badges

### **blog_posts**
- Blog articles and reviews
- Can feature specific products
- Includes featured images and excerpts

### **reviews**
- User-submitted product reviews
- Supports text and video reviews
- Linked to products and users

### **free_resources**
- Downloadable PDFs, videos, e-books
- Can be members-only
- Includes discount codes and bonuses

### **user_profiles**
- User preferences and settings
- Saved products list
- Linked to Supabase Auth users

---

## 🎨 Customizing Your Data

### **Adding Your Own Products:**

1. Go to Supabase Dashboard → Table Editor → products
2. Click **"Insert row"**
3. Fill in:
   - **name**: Product name
   - **description**: Product description
   - **price**: Current price (number)
   - **original_price**: Original price for discount display
   - **category**: Choose from: ai-saas, hosting, vpn-security, automation, courses, cloud
   - **affiliate_url**: Your affiliate link
   - **image_url**: Product image URL (from Unsplash or your own)
   - **badge**: Optional (e.g., "HOT DEAL", "NEW", "BEST SELLER")
4. Click **"Save"**

### **Adding Categories:**

1. Go to Supabase Dashboard → Table Editor → categories
2. Click **"Insert row"**
3. Fill in:
   - **name**: Category name
   - **slug**: URL-friendly version (e.g., "ai-tools")
   - **icon**: Emoji or icon code
4. Click **"Save"**

### **Adding Blog Posts:**

1. Go to Supabase Dashboard → Table Editor → blog_posts
2. Click **"Insert row"**
3. Fill in:
   - **title**: Blog post title
   - **slug**: URL-friendly version (e.g., "best-vpn-2025")
   - **content**: Article content
   - **excerpt**: Short summary
   - **featured_image**: Image URL
   - **product_id**: Optional - link to a product
4. Click **"Save"**

---

## 🐛 Troubleshooting

### **Problem: "relation does not exist" error**
**Solution:** You haven't run the setup script yet. Go back to Step 2.

### **Problem: No products showing on website**
**Solution:** 
1. Check if tables exist in Supabase Table Editor
2. Verify sample data was inserted
3. Check browser console for errors (F12)

### **Problem: "RLS policy" error**
**Solution:** The setup script includes RLS policies. Re-run the entire script.

### **Problem: Authentication not working**
**Solution:** 
1. Check Supabase Dashboard → Authentication → Settings
2. Ensure Email auth is enabled
3. Verify redirect URLs are configured

### **Problem: Can't insert data manually**
**Solution:** Some tables have RLS policies. Use the admin dashboard in the app instead.

---

## 📊 Using the Admin Dashboard

After setup, you can manage content through the web interface:

1. **Sign up/Login** to your website
2. Go to **Admin Dashboard** (click "Dashboard" → "Admin Panel")
3. From there you can:
   - ✅ Add new products
   - ✅ Edit existing products
   - ✅ Delete products
   - ✅ View analytics
   - ✅ Manage blog posts (coming soon)
   - ✅ Manage users (coming soon)

---

## 🔐 Security Notes

- **Public Access:** Products, categories, blog posts are publicly readable
- **Protected Content:** User profiles and saved items are private
- **Member Resources:** Free resources require authentication
- **RLS Enabled:** All tables have Row Level Security enabled
- **Safe by Default:** Users can only modify their own data

---

## 🎯 Next Steps

1. ✅ **Complete Supabase setup** (you're doing this now!)
2. ✅ **Test the website** - browse products, search, filter
3. ✅ **Create an account** - sign up to test member features
4. ✅ **Add your products** - replace sample data with real affiliate products
5. ✅ **Customize content** - add your own blog posts and resources
6. ✅ **Configure affiliate links** - update with your actual affiliate URLs
7. ✅ **Launch and promote** - start driving traffic to your site

---

## 📞 Need Help?

If you encounter any issues:

1. **Check browser console** (F12 → Console tab) for error messages
2. **Check Supabase logs** (Dashboard → Logs)
3. **Verify environment variables** in `.env` file
4. **Review the README.md** for more detailed information

---

## 🎉 You're All Set!

Once you've completed these steps, your affiliate website will be fully functional with:

- ✅ Product catalog with search and filters
- ✅ User authentication
- ✅ Blog and reviews system
- ✅ Member resources
- ✅ Admin dashboard
- ✅ Analytics tracking
- ✅ Affiliate link tracking

**Happy affiliating! 🚀**
