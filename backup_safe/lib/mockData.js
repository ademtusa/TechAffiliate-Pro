// Mock data for the affiliate website - works without Supabase setup

export const mockCategories = [
  { id: '1', name: 'AI & SaaS Tools', slug: 'ai-saas', icon: '🤖', created_at: new Date().toISOString() },
  { id: '2', name: 'Hosting Services', slug: 'hosting', icon: '🌐', created_at: new Date().toISOString() },
  { id: '3', name: 'VPN & Security', slug: 'vpn-security', icon: '🔒', created_at: new Date().toISOString() },
  { id: '4', name: 'Automation Software', slug: 'automation', icon: '⚡', created_at: new Date().toISOString() },
  { id: '5', name: 'Online Courses', slug: 'courses', icon: '📚', created_at: new Date().toISOString() },
  { id: '6', name: 'Cloud Services', slug: 'cloud', icon: '☁️', created_at: new Date().toISOString() },
]

export const mockProducts = [
  {
    id: '1',
    name: 'ChatGPT Pro Plus',
    description: 'Advanced AI assistant for content creation, coding, and problem-solving with GPT-5 technology. Perfect for professionals and businesses.',
    price: 29.99,
    original_price: 49.99,
    category: 'ai-saas',
    affiliate_url: 'https://openai.com',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500',
    rating: 4.8,
    views: 1250,
    sales_count: 342,
    badge: 'HOT DEAL',
    tags: ['AI', 'Productivity', 'Content Creation', 'Coding Assistant'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Hostinger Premium',
    description: 'Lightning-fast web hosting with 99.9% uptime guarantee. Perfect for WordPress and business sites with unlimited bandwidth.',
    price: 2.99,
    original_price: 9.99,
    category: 'hosting',
    affiliate_url: 'https://hostinger.com',
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500',
    rating: 4.7,
    views: 980,
    sales_count: 567,
    badge: '70% OFF',
    tags: ['Hosting', 'WordPress', 'Website', 'Fast Performance'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'NordVPN Ultimate',
    description: 'Secure your online privacy with military-grade encryption. Access content from anywhere with 5000+ servers worldwide.',
    price: 3.49,
    original_price: 11.99,
    category: 'vpn-security',
    affiliate_url: 'https://nordvpn.com',
    image_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500',
    rating: 4.9,
    views: 2100,
    sales_count: 892,
    badge: 'BEST SELLER',
    tags: ['VPN', 'Security', 'Privacy', 'Streaming'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'n8n Automation Pro',
    description: 'Self-hosted automation platform. Connect 300+ apps and automate your workflow with powerful no-code tools.',
    price: 19.99,
    original_price: 39.99,
    category: 'automation',
    affiliate_url: 'https://n8n.io',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
    rating: 4.6,
    views: 756,
    sales_count: 234,
    badge: 'NEW',
    tags: ['Automation', 'Workflow', 'Integration', 'No-Code'],
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'AI Masterclass 2025',
    description: 'Complete AI course covering ChatGPT, Midjourney, and automation. 50+ hours of content with lifetime access.',
    price: 79.99,
    original_price: 199.99,
    category: 'courses',
    affiliate_url: 'https://example.com/ai-course',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500',
    rating: 4.9,
    views: 1890,
    sales_count: 445,
    badge: 'FEATURED',
    tags: ['Course', 'AI', 'Learning', 'Certification'],
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'AWS Cloud Essentials',
    description: 'Get started with Amazon Web Services. Includes EC2, S3, and Lambda credits. Perfect for startups.',
    price: 0,
    original_price: 50,
    category: 'cloud',
    affiliate_url: 'https://aws.amazon.com',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
    rating: 4.5,
    views: 1450,
    sales_count: 678,
    badge: 'FREE',
    tags: ['Cloud', 'AWS', 'Infrastructure', 'Scalable'],
    created_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Jasper AI Writing',
    description: 'AI-powered content writer. Create blog posts, ads, and social media content in seconds with advanced templates.',
    price: 49.99,
    original_price: 99.99,
    category: 'ai-saas',
    affiliate_url: 'https://jasper.ai',
    image_url: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=500',
    rating: 4.7,
    views: 1120,
    sales_count: 389,
    badge: null,
    tags: ['AI', 'Content', 'Writing', 'Marketing'],
    created_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'ExpressVPN Premium',
    description: 'Ultra-fast VPN with servers in 94 countries. Stream and browse securely with unlimited bandwidth.',
    price: 8.32,
    original_price: 12.95,
    category: 'vpn-security',
    affiliate_url: 'https://expressvpn.com',
    image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500',
    rating: 4.8,
    views: 1670,
    sales_count: 723,
    badge: null,
    tags: ['VPN', 'Streaming', 'Security', 'Fast'],
    created_at: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Make.com Pro',
    description: 'Visual automation platform. Build complex workflows without code. 1000+ integrations with popular apps.',
    price: 29,
    original_price: 49,
    category: 'automation',
    affiliate_url: 'https://make.com',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
    rating: 4.6,
    views: 890,
    sales_count: 267,
    badge: null,
    tags: ['Automation', 'No-Code', 'Integration', 'Visual'],
    created_at: new Date().toISOString()
  },
  {
    id: '10',
    name: 'DigitalOcean VPS',
    description: 'Developer-friendly cloud hosting. Deploy in 55 seconds. $200 free credits for new users.',
    price: 5,
    original_price: 10,
    category: 'cloud',
    affiliate_url: 'https://digitalocean.com',
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500',
    rating: 4.7,
    views: 1340,
    sales_count: 512,
    badge: '$200 CREDIT',
    tags: ['VPS', 'Cloud', 'Hosting', 'Developer-Friendly'],
    created_at: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Udemy Business',
    description: 'Access 21,000+ courses on tech, business, and design. Learn at your own pace with expert instructors.',
    price: 19.99,
    original_price: 360,
    category: 'courses',
    affiliate_url: 'https://udemy.com',
    image_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500',
    rating: 4.5,
    views: 2340,
    sales_count: 891,
    badge: '95% OFF',
    tags: ['Courses', 'Learning', 'Skills', 'Professional Development'],
    created_at: new Date().toISOString()
  },
  {
    id: '12',
    name: 'Wise Business',
    description: 'International payment platform. Send money globally with low fees. Multi-currency account included.',
    price: 0,
    original_price: 0,
    category: 'ai-saas',
    affiliate_url: 'https://wise.com',
    image_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=500',
    rating: 4.8,
    views: 1560,
    sales_count: 634,
    badge: 'FREE',
    tags: ['Payment', 'Business', 'International', 'Finance'],
    created_at: new Date().toISOString()
  },
  {
    id: '13',
    name: 'Cloudflare Pro',
    description: 'Website performance and security. Global CDN, DDoS protection, and SSL certificates included.',
    price: 20,
    original_price: 40,
    category: 'cloud',
    affiliate_url: 'https://cloudflare.com',
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500',
    rating: 4.6,
    views: 890,
    sales_count: 423,
    badge: null,
    tags: ['CDN', 'Security', 'Performance', 'SSL'],
    created_at: new Date().toISOString()
  },
  {
    id: '14',
    name: 'Canva Pro',
    description: 'Professional graphic design made easy. 100+ million stock photos, videos, and graphics.',
    price: 12.99,
    original_price: 29.99,
    category: 'ai-saas',
    affiliate_url: 'https://canva.com',
    image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=500',
    rating: 4.9,
    views: 2450,
    sales_count: 1123,
    badge: 'POPULAR',
    tags: ['Design', 'Graphics', 'Templates', 'Creative'],
    created_at: new Date().toISOString()
  },
  {
    id: '15',
    name: 'Zapier Professional',
    description: 'Connect your apps and automate workflows. 5000+ app integrations with unlimited tasks.',
    price: 49,
    original_price: 99,
    category: 'automation',
    affiliate_url: 'https://zapier.com',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
    rating: 4.7,
    views: 1230,
    sales_count: 567,
    badge: null,
    tags: ['Automation', 'Integration', 'Productivity', 'Workflow'],
    created_at: new Date().toISOString()
  },
]

export const mockBlogPosts = [
  {
    id: '1',
    title: '10 Best AI Tools for Productivity in 2025',
    slug: 'best-ai-tools-2025',
    content: `Artificial Intelligence has revolutionized the way we work, and 2025 brings even more powerful tools to boost your productivity. In this comprehensive guide, we'll explore the top 10 AI tools that are transforming how professionals work.

**1. ChatGPT Pro Plus - The Ultimate AI Assistant**

ChatGPT Pro Plus leads the pack with its advanced GPT-5 technology. Whether you're writing code, creating content, or solving complex problems, this tool does it all. The new features include:
- Advanced reasoning capabilities
- Multimodal support (text, images, voice)
- Longer context windows
- Real-time web browsing

**2. Jasper AI - Content Creation Powerhouse**

For marketers and content creators, Jasper AI is a game-changer. It generates high-quality blog posts, social media content, and ad copy in seconds. The platform includes:
- 50+ content templates
- Brand voice training
- SEO optimization
- Multi-language support

**3. GitHub Copilot - Coding Assistant**

Developers can't get enough of GitHub Copilot. It suggests entire functions, writes tests, and helps debug code. Features include:
- Context-aware code suggestions
- Multiple language support
- Learning from your coding style
- Integration with popular IDEs

**Why You Need AI Tools in 2025**

The productivity gains are undeniable. Teams using AI tools report:
- 40% faster content creation
- 60% reduction in repetitive tasks
- 30% improvement in code quality
- 50% time savings on research

**Getting Started**

Start with one tool in your workflow and gradually expand. Most platforms offer free trials, so you can test before committing. The investment in AI tools pays for itself quickly through time savings and improved quality.

**Conclusion**

AI tools are no longer optional—they're essential for staying competitive. Choose the right tools for your needs and watch your productivity soar.`,
    excerpt: 'Complete guide to the most powerful AI productivity tools of 2025',
    featured_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    product_id: '1',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    title: 'Web Hosting Comparison: Which is Best for Your Business?',
    slug: 'web-hosting-comparison',
    content: `Choosing the right web hosting provider can make or break your online presence. With so many options available, how do you pick the best one for your business?

**Key Factors to Consider**

**1. Performance & Speed**
Your website speed directly impacts user experience and SEO rankings. Look for hosts offering:
- SSD storage
- CDN integration
- Server response time under 200ms
- 99.9%+ uptime guarantee

**2. Pricing & Value**
Don't just look at the monthly price. Consider:
- Renewal rates (often higher than intro prices)
- What's included (SSL, domain, email)
- Resource limits (bandwidth, storage)
- Money-back guarantee

**Our Top Picks**

**Hostinger Premium - Best Value**
At just $2.99/month, Hostinger offers incredible value:
- 100GB SSD storage
- Free SSL certificate
- Weekly backups
- 99.9% uptime guarantee
- 24/7 support

**Bluehost - Best for WordPress**
Starting at $3.95/month:
- Official WordPress recommendation
- One-click WordPress install
- Free domain for 1 year
- Excellent WordPress optimization

**SiteGround - Best Performance**
From $3.99/month:
- SuperCacher technology
- Free CDN
- Staging environment
- Premium migrations

**Making Your Decision**

For small businesses and startups, we recommend Hostinger for its unbeatable value. WordPress users should consider Bluehost or SiteGround. If performance is critical, SiteGround is worth the extra cost.

**Pro Tips**
- Start with annual billing for better rates
- Use our affiliate links for exclusive discounts
- Don't overpay for features you won't use
- Test the support before committing

**Conclusion**

The right hosting provider depends on your specific needs, but you can't go wrong with any of our top picks. They all offer solid performance, good support, and competitive pricing.`,
    excerpt: 'Find the perfect hosting solution for your needs with our in-depth comparison',
    featured_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    product_id: '2',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'Why You Need a VPN in 2025: Complete Guide',
    slug: 'vpn-guide-2025',
    content: `Online privacy is more important than ever. With increasing surveillance, data breaches, and cyber threats, a VPN is no longer optional—it's essential protection.

**What is a VPN?**

A Virtual Private Network (VPN) encrypts your internet connection and routes it through a secure server, hiding your online activity from:
- Internet Service Providers (ISPs)
- Government surveillance
- Hackers on public WiFi
- Websites tracking your behavior

**Top Reasons You Need a VPN**

**1. Protect Your Privacy**
Without a VPN, your ISP sees everything you do online and may sell this data to advertisers. A VPN prevents this tracking.

**2. Secure Public WiFi**
Public WiFi is notoriously insecure. Hackers can easily intercept your data. A VPN encrypts all traffic, making it unreadable.

**3. Access Geo-Restricted Content**
Streaming services show different content based on location. With a VPN, you can access content from anywhere.

**4. Avoid Bandwidth Throttling**
ISPs often slow down streaming and gaming. A VPN prevents them from seeing what you're doing, eliminating throttling.

**5. Safe Online Banking**
Protect your financial data when banking online, especially on public networks.

**Best VPNs of 2025**

**NordVPN - Best Overall**
$3.49/month with our link:
- 5000+ servers in 60 countries
- Military-grade encryption
- No-logs policy
- 6 simultaneous devices
- 30-day money-back guarantee

**ExpressVPN - Fastest Speeds**
$8.32/month:
- Blazing fast connections
- 94 countries
- MediaStreamer for smart TVs
- 24/7 customer support
- 30-day guarantee

**Features to Look For**

When choosing a VPN, prioritize:
- Strong encryption (AES-256)
- No-logs policy
- Kill switch
- Multiple server locations
- Fast connection speeds
- Easy-to-use apps

**Common VPN Myths**

**Myth 1: "VPNs are only for tech experts"**
Modern VPNs are incredibly user-friendly with one-click connection.

**Myth 2: "VPNs slow down your internet"**
Quality VPNs have minimal impact on speed, and some can even improve it by bypassing throttling.

**Myth 3: "Free VPNs are good enough"**
Free VPNs often sell your data or inject ads. They defeat the purpose of using a VPN.

**Getting Started**

1. Choose a reputable VPN provider
2. Download and install the app
3. Connect to a server
4. Browse securely

**Conclusion**

In 2025, a VPN is essential security software like antivirus. With threats increasing and privacy decreasing, protecting yourself online is crucial. Our recommended VPNs offer the perfect balance of security, speed, and value.`,
    excerpt: 'Protect your privacy and security online with our comprehensive VPN guide',
    featured_image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800',
    product_id: '3',
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
  },
]

export const mockReviews = [
  {
    id: '1',
    product_id: '1',
    user_id: 'mock-user-1',
    rating: 5,
    review_text: 'ChatGPT Pro Plus has completely transformed my workflow. The GPT-5 technology is incredibly powerful and helps me create content 10x faster!',
    user_name: 'Sarah Johnson',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    product_id: '1',
    user_id: 'mock-user-2',
    rating: 4,
    review_text: 'Great tool for coding and problem-solving. Only downside is the price, but worth it for professionals.',
    user_name: 'Mike Chen',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    product_id: '3',
    user_id: 'mock-user-3',
    rating: 5,
    review_text: 'NordVPN is the best VPN I have used. Fast speeds, reliable connection, and great customer support!',
    user_name: 'Emily Davis',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
]

export const mockResources = [
  {
    id: '1',
    title: 'Ultimate AI Prompt Guide (PDF)',
    type: 'pdf',
    description: '100+ proven prompts for ChatGPT and AI tools to boost your productivity',
    download_url: '#download-ai-prompts',
    members_only: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Web Hosting Checklist',
    type: 'pdf',
    description: 'Complete checklist for choosing the right hosting provider for your business',
    download_url: '#download-hosting-checklist',
    members_only: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'VPN Setup Video Tutorial',
    type: 'video',
    description: 'Step-by-step guide to securing your internet connection with a VPN',
    download_url: '#watch-vpn-tutorial',
    members_only: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Automation Workflow Templates',
    type: 'pdf',
    description: '20 ready-to-use automation templates for common business tasks',
    download_url: '#download-automation-templates',
    members_only: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'AI Tools Comparison Sheet',
    type: 'pdf',
    description: 'Side-by-side comparison of top AI tools with pricing and features',
    download_url: '#download-ai-comparison',
    members_only: true,
    created_at: new Date().toISOString()
  },
]
