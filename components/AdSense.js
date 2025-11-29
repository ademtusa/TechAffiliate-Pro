'use client'

import { useEffect } from 'react'

export default function AdSense({ 
  adSlot = 'XXXXXXXXXX', 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block', textAlign: 'center', minHeight: '100px' },
  className = ''
}) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}
