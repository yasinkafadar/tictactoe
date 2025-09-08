import { useState } from 'react'

interface PremiumFeaturesProps {
  onUpgrade: () => void
}

export default function PremiumFeatures({ onUpgrade }: PremiumFeaturesProps) {
  const [showFeatures, setShowFeatures] = useState(false)

  const features = [
    {
      icon: '🎨',
      title: 'Custom Themes',
      description: 'Unlock beautiful color schemes and board designs'
    },
    {
      icon: '📊',
      title: 'Game Statistics',
      description: 'Track your win rate, best scores, and playing time'
    },
    {
      icon: '🔇',
      title: 'Ad-Free Experience',
      description: 'Remove all ads for uninterrupted gameplay'
    },
    {
      icon: '🎵',
      title: 'Sound Effects',
      description: 'Enjoy satisfying audio feedback and background music'
    },
    {
      icon: '🏆',
      title: 'Achievements',
      description: 'Unlock badges and compete with friends'
    }
  ]

  if (!showFeatures) {
    return (
      <div className="premium-cta">
        <button 
          className="premium-cta__button"
          onClick={() => setShowFeatures(true)}
        >
          <span className="premium-cta__icon">⭐</span>
          Unlock Premium Features
        </button>
      </div>
    )
  }

  return (
    <div className="premium-features">
      <div className="premium-features__header">
        <h3>Premium Features</h3>
        <button 
          className="premium-features__close"
          onClick={() => setShowFeatures(false)}
        >
          ×
        </button>
      </div>
      
      <div className="premium-features__list">
        {features.map((feature, index) => (
          <div key={index} className="premium-feature">
            <span className="premium-feature__icon">{feature.icon}</span>
            <div className="premium-feature__content">
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="premium-features__pricing">
        <div className="pricing-card">
          <h4>One-Time Purchase</h4>
          <div className="pricing-card__price">$2.99</div>
          <button 
            className="pricing-card__button"
            onClick={onUpgrade}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}
