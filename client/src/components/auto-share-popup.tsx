import { useState, useEffect } from 'react'
import { X, Share, Twitter, MessageCircle, Copy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useWallet } from '@/hooks/use-wallet'

interface SharePopupProps {
  achievement?: {
    title: string
    description: string
    reward: number
  }
  milestone?: {
    type: 'score' | 'streak' | 'level' | 'earnings'
    value: number
    reward: number
  }
  onClose: () => void
}

export function AutoSharePopup({ achievement, milestone, onClose }: SharePopupProps) {
  const { account } = useWallet()
  const { toast } = useToast()
  const [hasShared, setHasShared] = useState(false)

  const generateShareMessage = () => {
    if (achievement) {
      return `🏆 Just unlocked "${achievement.title}" on @CyberHackGame and earned ${achievement.reward} SUDO tokens! This crypto game actually rewards skill! 💰 #CyberHack #CryptoGaming #HackToEarn`
    }
    
    if (milestone) {
      switch (milestone.type) {
        case 'score':
          return `🎯 Just hit ${milestone.value.toLocaleString()} points on @CyberHackGame! Earned ${milestone.reward} SUDO tokens for my hacking skills. This game pays real crypto! 💰 #CyberHack #Web3Gaming`
        case 'streak':
          return `🔥 ${milestone.value}-game winning streak on @CyberHackGame! Just earned ${milestone.reward} SUDO tokens. Skills > Luck every time! 💪 #CyberHack #CryptoGaming #Blockchain`
        case 'level':
          return `⚡ Level ${milestone.value} achieved on @CyberHackGame! Earned ${milestone.reward} SUDO tokens. Finally, a crypto game that rewards actual skills! 🚀 #CyberHack #SkillToEarn`
        case 'earnings':
          return `💰 Just crossed ${milestone.value.toLocaleString()} SUDO tokens earned on @CyberHackGame! This cybersecurity game actually pays! Who's ready to turn skills into crypto? 🔥 #CyberHack #Web3`
        default:
          return `🚀 Making serious progress on @CyberHackGame! Earning real SUDO tokens by solving cybersecurity challenges. Skills-based crypto gaming is the future! 💰 #CyberHack`
      }
    }
    
    return `🎮 Having a blast on @CyberHackGame! Finally, a crypto game where skill matters more than luck. Earning real SUDO tokens! 💰 #CyberHack #Web3Gaming`
  }

  const referralLink = account ? `https://cyberhack.game?ref=${account.slice(-8).toUpperCase()}` : 'https://cyberhack.game'
  const shareMessage = generateShareMessage()

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Share message copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive"
      })
    }
  }

  const shareOnPlatform = (platform: string) => {
    const fullMessage = `${shareMessage}\n\n${referralLink}`
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(referralLink)}`
        break
      case 'discord':
        copyToClipboard(fullMessage)
        break
      default:
        copyToClipboard(fullMessage)
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
    
    setHasShared(true)
    
    // Bonus for sharing
    setTimeout(() => {
      toast({
        title: "🎉 Sharing Bonus!",
        description: "+100 SUDO tokens for spreading the word!",
      })
    }, 1000)
  }

  // Auto-close after 15 seconds if no interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasShared) {
        onClose()
      }
    }, 15000)

    return () => clearTimeout(timer)
  }, [hasShared, onClose])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/50 animate-fadeIn">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white flex items-center">
              🎉 Epic Achievement!
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {achievement && (
            <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-bold text-yellow-400 mb-1">{achievement.title}</div>
              <div className="text-sm text-gray-300 mb-2">{achievement.description}</div>
              <Badge className="bg-green-500 text-white">
                +{achievement.reward} SUDO
              </Badge>
            </div>
          )}

          {milestone && (
            <div className="text-center p-4 bg-green-500/20 rounded-lg">
              <div className="text-2xl mb-2">
                {milestone.type === 'score' && '🎯'}
                {milestone.type === 'streak' && '🔥'}
                {milestone.type === 'level' && '⚡'}
                {milestone.type === 'earnings' && '💰'}
              </div>
              <div className="font-bold text-green-400 mb-1">
                {milestone.type === 'level' ? `Level ${milestone.value}!` : `${milestone.value.toLocaleString()} ${milestone.type}!`}
              </div>
              <Badge className="bg-green-500 text-white">
                +{milestone.reward} SUDO
              </Badge>
            </div>
          )}

          <div className="text-center">
            <h3 className="font-bold text-white mb-2">Share Your Success & Earn More!</h3>
            <p className="text-sm text-gray-300 mb-4">
              Get <strong className="text-green-400">+100 SUDO bonus</strong> for sharing your achievement!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button 
              onClick={() => shareOnPlatform('twitter')}
              className="bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center p-4 h-auto"
              disabled={hasShared}
              data-testid="share-achievement-twitter"
            >
              <Twitter className="h-5 w-5 mb-1" />
              <span className="text-xs">Twitter</span>
            </Button>
            
            <Button 
              onClick={() => shareOnPlatform('discord')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex flex-col items-center p-4 h-auto"
              disabled={hasShared}
              data-testid="share-achievement-discord"
            >
              <MessageCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Discord</span>
            </Button>
            
            <Button 
              onClick={() => shareOnPlatform('copy')}
              className="bg-gray-600 hover:bg-gray-700 text-white flex flex-col items-center p-4 h-auto"
              disabled={hasShared}
              data-testid="share-achievement-copy"
            >
              <Copy className="h-5 w-5 mb-1" />
              <span className="text-xs">Copy</span>
            </Button>
          </div>

          {hasShared && (
            <div className="text-center p-3 bg-green-500/20 rounded-lg">
              <div className="text-green-400 font-bold mb-1">🎉 Thanks for sharing!</div>
              <div className="text-sm text-gray-300">Your bonus will arrive shortly</div>
            </div>
          )}

          <div className="text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              {hasShared ? 'Close' : 'Skip for now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}