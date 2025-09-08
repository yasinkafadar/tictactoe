import AdBanner from '../AdBanner'

interface HeaderAdProps {
  className?: string
}

export default function HeaderAd({ className = '' }: HeaderAdProps) {
  return (
    <div className={`header-ad ${className}`}>
      <AdBanner
        slot="1122334455" // Replace with your actual ad slot ID
        format="horizontal"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '728px',
          height: '90px',
          margin: '0 auto'
        }}
        className="header-ad__banner"
      />
    </div>
  )
}
