import AdBanner from '../AdBanner'

interface GameOverAdProps {
  className?: string
}

export default function GameOverAd({ className = '' }: GameOverAdProps) {
  return (
    <div className={`game-over-ad ${className}`}>
      <AdBanner
        slot="1234567890" // Replace with your actual ad slot ID
        format="rectangle"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '300px',
          margin: '0 auto'
        }}
        className="game-over-ad__banner"
      />
    </div>
  )
}
