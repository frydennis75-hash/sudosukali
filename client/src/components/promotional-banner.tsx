import { useState, useEffect } from 'react'
import { X, Gift, Share, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link } from 'wouter'

const promotionalMessages = [
  {
    id: 'mainnet-launch',
    title: '🚀 LIVE ON POLYGON MAINNET!',
    description: 'Earn real SUDO tokens! Contract verified on PolygonScan',
    cta: 'Start Earning',
    link: '/games',
    urgent: true
  },
  {
    id: 'referral-bonus',
    title: '💰 Invite Friends, Earn Big!',
    description: 'Get 500 SUDO for each friend + they get 1000 SUDO bonus!',
    cta: 'Invite Now',
    link: '/viral',
    urgent: false
  },
  {
    id: 'weekend-boost',
    title: '🔥 Weekend 2X Rewards!',
    description: 'Double SUDO rewards on all challenges this weekend!',
    cta: 'Play Now',
    link: '/games',
    urgent: true
  },
  {
    id: 'tournament-live',
    title: '⚡ Elite Tournament Live!',
    description: '50K SUDO prize pool! Top 10 winners share the rewards',
    cta: 'Join Tournament',
    link: '/competition',
    urgent: true
  }
]

export function PromotionalBanner() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [dismissed, setDismissed] = useState<string[]>([])

  // Rotate messages every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % promotionalMessages.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Load dismissed messages from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dismissed-promos')
    if (stored) {
      setDismissed(JSON.parse(stored))
    }
  }, [])

  const currentPromo = promotionalMessages[currentMessage]
  
  // Don't show if dismissed
  if (dismissed.includes(currentPromo.id) || !isVisible) {
    return null
  }

  const dismiss = () => {
    const newDismissed = [...dismissed, currentPromo.id]
    setDismissed(newDismissed)
    localStorage.setItem('dismissed-promos', JSON.stringify(newDismissed))
    
    // If all messages dismissed, hide banner
    if (newDismissed.length >= promotionalMessages.length) {
      setIsVisible(false)
    }
  }

  return (
    <div className={`relative bg-gradient-to-r ${
      currentPromo.urgent 
        ? 'from-red-600 to-orange-600' 
        : 'from-purple-600 to-blue-600'
    } text-white py-3 px-4 animate-slideDown`}>
      
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-50" />
      
      <div className="container mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          {currentPromo.urgent && (
            <Badge className="bg-yellow-400 text-black font-bold animate-pulse">
              URGENT
            </Badge>
          )}
          
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">{currentPromo.title}</span>
            <span className="hidden sm:inline text-sm opacity-90">
              {currentPromo.description}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href={currentPromo.link}>
            <Button 
              size="sm" 
              className="bg-white text-black hover:bg-gray-100 font-bold"
              data-testid={`promo-cta-${currentPromo.id}`}
            >
              {currentPromo.cta}
            </Button>
          </Link>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={dismiss}
            className="text-white hover:bg-white/20 p-1"
            data-testid={`dismiss-promo-${currentPromo.id}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-8000 ease-linear"
          style={{ 
            width: `${((Date.now() % 8000) / 8000) * 100}%`,
            animation: 'progress 8s linear infinite'
          }}
        />
      </div>
    </div>
  )
}

// Add this to your CSS/Tailwind config
const styles = `
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}

.animate-slideDown {
  animation: slideDown 0.5s ease-out;
}
`