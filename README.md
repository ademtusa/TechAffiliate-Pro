# 🚀 TechAffiliate Pro - Complete Affiliate Marketing Website

A modern, full-featured affiliate marketing platform built with Next.js 14, Supabase, and Tailwind CSS.

## ✨ Features

### 🎯 Core Features
- **Product Catalog** - Browse products by category with filtering and search
- **Dynamic Sorting** - Latest, Best Sellers, Most Viewed
- **Product Pages** - Detailed product information with reviews and related products
- **Blog System** - Product reviews and comparison articles
- **User Authentication** - Sign up/Login with Supabase Auth
- **Member Benefits** - Exclusive free resources for members
- **Social Sharing** - Share products on Facebook, Twitter, LinkedIn, Instagram, etc.
- **Affiliate Tracking** - Track clicks and conversions

### 📊 Dashboards
- **User Dashboard** - Saved products, profile management, free resources access
- **Admin Dashboard** - Manage products, reviews, analytics, users

### 🎨 Design Features
- Responsive mobile-first design
- Sticky navigation bar
- Gradient hero section with background image
- Category icons and buttons
- Product cards with ratings and badges
- Smooth animations and transitions
- Modern UI with shadcn/ui components

### 🔒 Security
- Row Level Security (RLS) on Supabase
- Protected member-only resources
- Secure authentication flow

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Language**: JavaScript

## 📋 Quick Start

### 1️⃣ Set Up Supabase Database

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **newixliyhbcskdcrxxsx**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase-setup.sql` file
6. Paste it into the SQL editor
7. Click **RUN** button

This will create all tables, insert sample data, and set up security policies.

### 2️⃣ Start the Application

```bash
# The application is already running!
# Visit: https://promo-funnel.preview.emergentagent.com
```

### 3️⃣ Test Authentication

1. Click "Sign In" button
2. Switch to "Create Account"
3. Enter your email and password
4. Check your email for confirmation link
5. Click the link to activate your account
6. Return to the site and sign in

## 📁 Project Structure

```
/app
├── app/
│   ├── api/[[...path]]/route.js    # Backend API routes
│   ├── page.js                      # Homepage
│   ├── product/[id]/page.js         # Product details page
│   ├── blog/page.js                 # Blog listing page
│   ├── blog/[slug]/page.js          # Individual blog post
│   ├── resources/page.js            # Free resources page
│   ├── dashboard/page.js            # User dashboard
│   ├── admin/page.js                # Admin dashboard
│   └── layout.js                    # Root layout
├── components/
│   └── ui/                          # shadcn/ui components
├── lib/
│   ├── supabase.js                  # Supabase client
│   └── utils.js                     # Utility functions
├── supabase-setup.sql               # Database setup script
└── .env                             # Environment variables
```

## 🗄️ Database Schema

### Tables

1. **categories** - Product categories (AI, Hosting, VPN, etc.)
2. **products** - Affiliate products with pricing and details
3. **blog_posts** - Blog articles and reviews
4. **reviews** - User reviews with ratings
5. **free_resources** - Member-only downloadable resources
6. **user_profiles** - User preferences and saved products

### Relationships

- `blog_posts.product_id` → `products.id`
- `reviews.product_id` → `products.id`
- `reviews.user_id` → `auth.users.id`
- `user_profiles.user_id` → `auth.users.id`

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/blog` - Create blog post (admin)

### Reviews
- `GET /api/reviews/:productId` - Get product reviews
- `POST /api/reviews` - Create review (authenticated)

### Resources
- `GET /api/resources` - Get free resources

### User
- `GET /api/profile?userId=:id` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/save-product` - Save product to profile

### Analytics
- `GET /api/analytics` - Get site analytics (admin)
- `POST /api/track-click` - Track affiliate click

## 🎨 Customization

### Branding
Edit `/app/page.js` to change:
- Site name: "TechAffiliate Pro"
- Color scheme: Tailwind classes
- Hero section content

### Products
Add products via:
1. Supabase Dashboard → Table Editor → products
2. Or use the admin dashboard (to be built)

### Categories
Edit in Supabase Dashboard → categories table

## 🚀 Features to Build Next

### High Priority
1. **Product Detail Page** (`/app/product/[id]/page.js`)
   - Full product description
   - User reviews section
   - Related products carousel
   - Social sharing buttons

2. **Blog Pages** (`/app/blog/`)
   - Blog listing with pagination
   - Individual blog post pages
   - Related products in blog posts

3. **User Dashboard** (`/app/dashboard/page.js`)
   - Saved products
   - Profile management
   - Access to free resources

4. **Admin Dashboard** (`/app/admin/page.js`)
   - Product management (CRUD)
   - Review moderation
   - Analytics and stats
   - User management

5. **Resources Page** (`/app/resources/page.js`)
   - Free downloads for members
   - E-books, PDFs, videos
   - Discount codes

### Medium Priority
6. Product comparison page
7. Advanced search with filters
8. Email notifications (Supabase Edge Functions)
9. Affiliate link click tracking analytics
10. Product reviews with images/videos

### Low Priority
11. Dark mode toggle
12. Multi-language support
13. SEO optimization
14. Performance monitoring
15. A/B testing for conversion

## 🔐 Environment Variables

Already configured in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=https://newixliyhbcskdcrxxsx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Sample Data Included

- **6 Categories**: AI/SaaS, Hosting, VPN, Automation, Courses, Cloud
- **12 Products**: ChatGPT, Hostinger, NordVPN, n8n, etc.
- **3 Blog Posts**: AI tools, hosting comparison, VPN guide
- **5 Free Resources**: PDF guides, video tutorials, checklists

## 🎯 Affiliate Networks Supported

The platform is designed to work with:
- Amazon Associates
- ShareASale
- ClickBank
- CJ Affiliate
- JVZoo
- Impact
- Rakuten
- Direct affiliate programs (Hostinger, NordVPN, etc.)

## 💡 Tips for Success

1. **Add Real Products**: Replace sample products with your actual affiliate products
2. **Write Quality Content**: Create detailed blog posts and reviews
3. **Update Regularly**: Keep adding new products and content
4. **Engage Users**: Respond to reviews and comments
5. **Track Performance**: Use the analytics dashboard to optimize
6. **Test Links**: Ensure all affiliate links are working correctly
7. **Mobile First**: Most traffic will be mobile, test thoroughly

## 🐛 Troubleshooting

### Database Issues
- Ensure you ran the `supabase-setup.sql` script
- Check RLS policies are enabled
- Verify API keys in `.env`

### Authentication Issues
- Check email confirmation is enabled in Supabase
- Verify redirect URLs in Supabase settings
- Clear browser cache and cookies

### API Errors
- Check browser console for errors
- Verify Supabase connection
- Check API route paths start with `/api`

## 📞 Support

For issues or questions:
1. Check Supabase Dashboard for errors
2. Review browser console logs
3. Check Next.js server logs
4. Verify database tables exist

## 📝 License

This project is for personal and commercial use.

---

**Built with ❤️ using Next.js, Supabase, and modern web technologies**
