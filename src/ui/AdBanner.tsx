import { useEffect, useRef } from 'react'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
  responsive?: boolean
}

export default function AdBanner({ 
  slot, 
  format = 'auto', 
  style = { display: 'block' }, 
  className = '',
  responsive = true 
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    // Only load ads in production or when explicitly enabled
    if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_ADS === 'true') {
      try {
        // @ts-ignore - Google AdSense script
        if (window.adsbygoogle) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        }
      } catch (error) {
        console.warn('AdSense not available:', error)
      }
    }
  }, [])

  // Don't render ads in development unless explicitly enabled
  if (!import.meta.env.PROD && import.meta.env.VITE_ENABLE_ADS !== 'true') {
    return (
      <div 
        className={`ad-placeholder ${className}`}
        style={{
          ...style,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6c757d',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}
      >
        Ad Space ({format})
      </div>
    )
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX"}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  )
}
