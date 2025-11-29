import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Usefulio - Find What\'s Actually Useful',
  description: 'Discover genuinely useful products with expert reviews and comparisons. Make smarter buying decisions with Usefulio - your trusted guide to products that actually work.',
  keywords: 'useful products, product reviews, product comparisons, best products, buying guide, trusted reviews, product recommendations',
  authors: [{ name: 'Usefulio' }],
  creator: 'Usefulio',
  publisher: 'Usefulio',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://usefulio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Usefulio - Find What\'s Actually Useful',
    description: 'Discover genuinely useful products with expert reviews and comparisons. Make smarter buying decisions.',
    url: '/',
    siteName: 'Usefulio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Usefulio - Your Guide to Useful Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Usefulio - Find What\'s Actually Useful',
    description: 'Discover genuinely useful products with expert reviews and comparisons.',
    creator: '@usefulio',
    images: ['/twitter-image.jpg'],
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
        {/* Google Analytics - UPDATE GA_MEASUREMENT_ID */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        
        {/* Google AdSense - UPDATE PUBLISHER_ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* JSON-LD Schema for SEO */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Usefulio',
              description: 'Discover genuinely useful products with expert reviews and comparisons.',
              url: process.env.NEXT_PUBLIC_BASE_URL || 'https://usefulio.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://usefulio.com'}/blog?search={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}