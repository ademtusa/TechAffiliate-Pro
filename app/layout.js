import { Toaster } from 'sonner'
import { Providers } from './providers'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://adminportal-26.preview.emergentagent.com'),
  title: {
    default: 'Usefulio - Find What\'s Actually Useful',
    template: '%s | Usefulio'
  },
  description: 'Discover trusted, useful products and resources. Expert reviews, comparisons, and recommendations for AI tools, hosting, VPNs, and more. Find what\'s actually useful.',
  keywords: [
    'useful products',
    'product reviews',
    'AI tools',
    'SaaS tools',
    'web hosting',
    'VPN services',
    'product comparison',
    'tech recommendations',
    'usefulio',
    'best tools',
    'software reviews'
  ],
  authors: [{ name: 'Usefulio Team' }],
  creator: 'Usefulio',
  publisher: 'Usefulio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adminportal-26.preview.emergentagent.com',
    siteName: 'Usefulio',
    title: 'Usefulio - Find What\'s Actually Useful',
    description: 'Discover trusted, useful products and resources. Expert reviews and comparisons.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Usefulio - Find What\'s Actually Useful',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Usefulio - Find What\'s Actually Useful',
    description: 'Discover trusted, useful products and resources.',
    images: ['/og-image.jpg'],
    creator: '@usefulio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics - Replace GA_TRACKING_ID with your actual tracking ID */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_TRACKING_ID');
            `,
          }}
        />
        
        {/* Google AdSense - Replace ADSENSE_CLIENT_ID with your actual client ID */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ADSENSE_CLIENT_ID"
          crossOrigin="anonymous"
        />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Usefulio',
              alternateName: 'Find What\'s Actually Useful',
              url: 'https://adminportal-26.preview.emergentagent.com',
              description: 'Discover trusted, useful products and resources',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://adminportal-26.preview.emergentagent.com/products?search={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <Toaster position="top-right" richColors />
          {children}
        </Providers>
      </body>
    </html>
  )
}
