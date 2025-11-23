-- ================================================
-- SUPABASE DATABASE SETUP FOR AFFILIATE WEBSITE
-- ================================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query
-- Copy and paste this entire file, then click RUN

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TABLE: categories
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- TABLE: products
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10, 2),
  category TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  image_url TEXT,
  rating DECIMAL(2, 1) DEFAULT 4.5,
  views INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  badge TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- TABLE: blog_posts
-- ================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- TABLE: reviews
-- ================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  video_url TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- TABLE: free_resources
-- ================================================
CREATE TABLE IF NOT EXISTS free_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'pdf', 'video', 'ebook', 'discount'
  description TEXT,
  download_url TEXT,
  members_only BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- TABLE: user_profiles
-- ================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  saved_products UUID[],
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ================================================
-- RLS POLICIES: categories (public read)
-- ================================================
CREATE POLICY \"Categories are viewable by everyone\"
  ON categories FOR SELECT
  USING (true);

-- ================================================
-- RLS POLICIES: products (public read)
-- ================================================
CREATE POLICY \"Products are viewable by everyone\"
  ON products FOR SELECT
  USING (true);

CREATE POLICY \"Products can be updated by anyone\" 
  ON products FOR UPDATE
  USING (true);

-- ================================================
-- RLS POLICIES: blog_posts (public read)
-- ================================================
CREATE POLICY \"Blog posts are viewable by everyone\"
  ON blog_posts FOR SELECT
  USING (true);

-- ================================================
-- RLS POLICIES: reviews (public read, auth write)
-- ================================================
CREATE POLICY \"Reviews are viewable by everyone\"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY \"Authenticated users can create reviews\"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY \"Users can update their own reviews\"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY \"Users can delete their own reviews\"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- RLS POLICIES: free_resources (public read)
-- ================================================
CREATE POLICY \"Free resources are viewable by everyone\"
  ON free_resources FOR SELECT
  USING (true);

-- ================================================
-- RLS POLICIES: user_profiles (private)
-- ================================================
CREATE POLICY \"Users can view their own profile\"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY \"Users can update their own profile\"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY \"Users can insert their own profile\"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- INSERT SAMPLE DATA
-- ================================================

-- Sample Categories
INSERT INTO categories (name, slug, icon) VALUES
  ('AI & SaaS Tools', 'ai-saas', '🤖'),
  ('Hosting Services', 'hosting', '🌐'),
  ('VPN & Security', 'vpn-security', '🔒'),
  ('Automation Software', 'automation', '⚡'),
  ('Online Courses', 'courses', '📚'),
  ('Cloud Services', 'cloud', '☁️')
ON CONFLICT (slug) DO NOTHING;

-- Sample Products
INSERT INTO products (name, description, price, original_price, category, affiliate_url, image_url, rating, views, sales_count, badge, tags) VALUES
  ('ChatGPT Pro Plus', 'Advanced AI assistant for content creation, coding, and problem-solving with GPT-5 technology.', 29.99, 49.99, 'ai-saas', 'https://openai.com', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500', 4.8, 1250, 342, 'HOT DEAL', ARRAY['AI', 'Productivity', 'Content']),
  ('Hostinger Premium', 'Lightning-fast web hosting with 99.9% uptime guarantee. Perfect for WordPress and business sites.', 2.99, 9.99, 'hosting', 'https://hostinger.com', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500', 4.7, 980, 567, '70% OFF', ARRAY['Hosting', 'WordPress', 'Website']),
  ('NordVPN Ultimate', 'Secure your online privacy with military-grade encryption. Access content from anywhere.', 3.49, 11.99, 'vpn-security', 'https://nordvpn.com', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500', 4.9, 2100, 892, 'BEST SELLER', ARRAY['VPN', 'Security', 'Privacy']),
  ('n8n Automation Pro', 'Self-hosted automation platform. Connect 300+ apps and automate your workflow.', 19.99, 39.99, 'automation', 'https://n8n.io', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', 4.6, 756, 234, 'NEW', ARRAY['Automation', 'Workflow', 'Integration']),
  ('AI Masterclass 2025', 'Complete AI course covering ChatGPT, Midjourney, and automation. 50+ hours of content.', 79.99, 199.99, 'courses', 'https://example.com/ai-course', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500', 4.9, 1890, 445, 'FEATURED', ARRAY['Course', 'AI', 'Learning']),
  ('AWS Cloud Essentials', 'Get started with Amazon Web Services. Includes EC2, S3, and Lambda credits.', 0, 50, 'cloud', 'https://aws.amazon.com', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500', 4.5, 1450, 678, 'FREE', ARRAY['Cloud', 'AWS', 'Infrastructure']),
  ('Jasper AI Writing', 'AI-powered content writer. Create blog posts, ads, and social media content in seconds.', 49.99, 99.99, 'ai-saas', 'https://jasper.ai', 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=500', 4.7, 1120, 389, NULL, ARRAY['AI', 'Content', 'Writing']),
  ('ExpressVPN Premium', 'Ultra-fast VPN with servers in 94 countries. Stream and browse securely.', 8.32, 12.95, 'vpn-security', 'https://expressvpn.com', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500', 4.8, 1670, 723, NULL, ARRAY['VPN', 'Streaming', 'Security']),
  ('Make.com Pro', 'Visual automation platform. Build complex workflows without code. 1000+ integrations.', 29, 49, 'automation', 'https://make.com', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', 4.6, 890, 267, NULL, ARRAY['Automation', 'No-Code', 'Integration']),
  ('DigitalOcean VPS', 'Developer-friendly cloud hosting. Deploy in 55 seconds. $200 free credits.', 5, 10, 'cloud', 'https://digitalocean.com', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500', 4.7, 1340, 512, '$200 CREDIT', ARRAY['VPS', 'Cloud', 'Hosting']),
  ('Udemy Business', 'Access 21,000+ courses on tech, business, and design. Learn at your own pace.', 19.99, 360, 'courses', 'https://udemy.com', 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500', 4.5, 2340, 891, '95% OFF', ARRAY['Courses', 'Learning', 'Skills']),
  ('Wise Business', 'International payment platform. Send money globally with low fees.', 0, 0, 'ai-saas', 'https://wise.com', 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=500', 4.8, 1560, 634, 'FREE', ARRAY['Payment', 'Business', 'International'])
ON CONFLICT DO NOTHING;

-- Sample Blog Posts (we'll use product IDs after they're created)
-- You may need to manually update product_id values after running this
INSERT INTO blog_posts (title, slug, content, excerpt, featured_image) VALUES
  ('10 Best AI Tools for Productivity in 2025', 'best-ai-tools-2025', 'Discover the top AI tools that are revolutionizing productivity. From content creation to code generation, these tools will transform how you work...', 'Complete guide to the most powerful AI productivity tools', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'),
  ('Web Hosting Comparison: Which is Best for Your Business?', 'web-hosting-comparison', 'In-depth comparison of top hosting providers including Hostinger, Bluehost, and SiteGround. Learn which one offers the best value...', 'Find the perfect hosting solution for your needs', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'),
  ('Why You Need a VPN in 2025: Complete Guide', 'vpn-guide-2025', 'Everything you need to know about VPN security, from protecting your privacy to accessing geo-restricted content safely...', 'Protect your privacy and security online', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800')
ON CONFLICT (slug) DO NOTHING;

-- Sample Free Resources
INSERT INTO free_resources (title, type, description, download_url, members_only) VALUES
  ('Ultimate AI Prompt Guide (PDF)', 'pdf', '100+ proven prompts for ChatGPT and AI tools', '#', true),
  ('Web Hosting Checklist', 'pdf', 'Complete checklist for choosing the right host', '#', true),
  ('VPN Setup Video Tutorial', 'video', 'Step-by-step guide to securing your connection', '#', true),
  ('Automation Workflow Templates', 'pdf', '20 ready-to-use automation templates', '#', true),
  ('AI Tools Comparison Sheet', 'pdf', 'Side-by-side comparison of top AI tools', '#', true)
ON CONFLICT DO NOTHING;

-- ================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_views ON products(views DESC);
CREATE INDEX IF NOT EXISTS idx_products_sales ON products(sales_count DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- ================================================
-- SETUP COMPLETE!
-- ================================================
-- Your affiliate website database is now ready to use!
-- Tables created: categories, products, blog_posts, reviews, free_resources, user_profiles
-- Sample data has been inserted
-- RLS policies are configured for security
