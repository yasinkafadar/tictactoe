import AdBanner from '../AdBanner'

interface SidebarAdProps {
  className?: string
}

export default function SidebarAd({ className = '' }: SidebarAdProps) {
  return (
    <div className={`sidebar-ad ${className}`}>
      <AdBanner
        slot="0987654321" // Replace with your actual ad slot ID
        format="vertical"
        style={{
          display: 'block',
          width: '160px',
          height: '600px',
          margin: '0 auto'
        }}
        className="sidebar-ad__banner"
      />
    </div>
  )
}
