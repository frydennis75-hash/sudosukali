import { useState, useEffect } from 'react'
import { Share, Trophy, Gift, Users, Copy, Twitter, MessageCircle, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useWallet } from '@/hooks/use-wallet'

interface ReferralStats {
  referrals: number
  totalEarned: number
  pending: number
  rank: number
}

const mockReferralStats: ReferralStats = {
  referrals: 0,
  totalEarned: 0,
  pending: 0,
  rank: 0
}

const shareMessages = {
  twitter: "🔥 Just discovered @CyberHackGame - the first crypto game where hacking skills = real money! Earning SUDO tokens by solving cybersecurity challenges. Elite hackers only! 💰",
  discord: "🚨 Found the ultimate hacker game! CyberHack lets you earn crypto by solving real security challenges. Way better than mindless clicking games. Who's ready to turn skills into money? 💰",
  telegram: "⚡ CyberHack just launched on Polygon! Finally, a crypto game that requires actual skill. Earn SUDO tokens by hacking challenges, compete in tournaments, unlock NFT achievements. This is the future! 🚀",
  general: "🎯 Check out CyberHack - earn real crypto by solving cybersecurity challenges! Live on Polygon mainnet with tournaments, NFTs, and massive rewards. Skills > Luck! 💰"
}

export function ViralMarketing() {
  const { account } = useWallet()
  const { toast } = useToast()
  const [referralStats, setReferralStats] = useState(mockReferralStats)
  const [shareCount, setShareCount] = useState(0)
  const [copied, setCopied] = useState('')

  const referralCode = account ? account.slice(-8).toUpperCase() : 'CONNECT'
  const referralLink = `https://cyberhack.game?ref=${referralCode}`

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive"
      })
    }
  }

  const shareOnPlatform = (platform: string, message: string, url: string) => {
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`
        break
      case 'discord':
        copyToClipboard(`${message}\n\n${url}`, 'discord')
        return
      default:
        copyToClipboard(`${message}\n\n${url}`, 'general')
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
    setShareCount(prev => prev + 1)
    
    // Simulate earning bonus tokens for sharing
    toast({
      title: "🎉 Bonus Earned!",
      description: "+50 SUDO tokens for sharing!",
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
          🚀 Spread the Hack, Earn the Stack!
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Invite friends and earn SUDO tokens for every new hacker you bring! 
          The more you share, the more you earn. Let's build the ultimate hacker community together!
        </p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{referralStats.referrals}</div>
            <div className="text-sm text-gray-300">Friends Invited</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/50">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{referralStats.totalEarned}</div>
            <div className="text-sm text-gray-300">SUDO Earned</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50">
          <CardContent className="p-4 text-center">
            <Gift className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{referralStats.pending}</div>
            <div className="text-sm text-gray-300">Pending Rewards</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/50">
          <CardContent className="p-4 text-center">
            <Share className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{shareCount}</div>
            <div className="text-sm text-gray-300">Times Shared</div>
          </CardContent>
        </Card>
      </div>

      {/* Your Referral Link */}
      <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-yellow-400" />
            <span>Your Referral Link</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input 
              value={referralLink}
              readOnly
              className="bg-gray-800 border-gray-600 text-gray-200 font-mono"
            />
            <Button 
              onClick={() => copyToClipboard(referralLink, 'link')}
              variant="outline"
              className={copied === 'link' ? 'bg-green-600' : ''}
            >
              <Copy className="h-4 w-4" />
              {copied === 'link' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <div className="text-sm text-gray-400">
            <strong>Referral Code:</strong> <span className="font-mono text-yellow-400">{referralCode}</span>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tiers */}
      <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span>Referral Rewards</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-bold text-green-400">1 Friend</div>
              <div className="text-sm text-gray-300">500 SUDO</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl mb-2">🔥</div>
              <div className="font-bold text-orange-400">5 Friends</div>
              <div className="text-sm text-gray-300">3,000 SUDO + NFT</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-bold text-purple-400">10 Friends</div>
              <div className="text-sm text-gray-300">8,000 SUDO + Rare NFT</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl mb-2">👑</div>
              <div className="font-bold text-yellow-400">25 Friends</div>
              <div className="text-sm text-gray-300">25,000 SUDO + Legendary NFT</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Sharing */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Share className="h-5 w-5 text-blue-400" />
            <span>Share & Earn Instantly</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Get <strong className="text-green-400">50 SUDO tokens</strong> for every share! 
            Help us build the ultimate hacker community.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              onClick={() => shareOnPlatform('twitter', shareMessages.twitter, referralLink)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="share-twitter"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            
            <Button 
              onClick={() => shareOnPlatform('discord', shareMessages.discord, referralLink)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              data-testid="share-discord"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Discord
            </Button>
            
            <Button 
              onClick={() => shareOnPlatform('telegram', shareMessages.telegram, referralLink)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              data-testid="share-telegram"
            >
              <Send className="h-4 w-4 mr-2" />
              Telegram
            </Button>
            
            <Button 
              onClick={() => shareOnPlatform('general', shareMessages.general, referralLink)}
              className="bg-gray-600 hover:bg-gray-700 text-white"
              data-testid="share-general"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Viral Challenges */}
      <Card className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-500/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-red-400" />
            <span>🔥 Viral Challenges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <div className="font-bold text-white">Bring 3 Friends Challenge</div>
                <div className="text-sm text-gray-400">Expires in 6 days</div>
              </div>
              <Badge className="bg-green-500 text-white">
                +2,000 SUDO
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <div className="font-bold text-white">Share 10 Times Challenge</div>
                <div className="text-sm text-gray-400">Progress: {shareCount}/10</div>
              </div>
              <Badge className="bg-purple-500 text-white">
                +1,500 SUDO
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <div className="font-bold text-white">Weekend Warrior Bonus</div>
                <div className="text-sm text-gray-400">2x referral rewards this weekend!</div>
              </div>
              <Badge className="bg-yellow-500 text-black">
                2X MULTIPLIER
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50">
        <CardHeader>
          <CardTitle>🏆 Top Referrers This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">1</div>
                <div>
                  <div className="font-bold text-white">CyberNinja</div>
                  <div className="text-sm text-gray-400">47 referrals</div>
                </div>
              </div>
              <div className="text-green-400 font-bold">+23,500 SUDO</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold">2</div>
                <div>
                  <div className="font-bold text-white">HackMaster</div>
                  <div className="text-sm text-gray-400">31 referrals</div>
                </div>
              </div>
              <div className="text-green-400 font-bold">+15,500 SUDO</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-black font-bold">3</div>
                <div>
                  <div className="font-bold text-white">EliteHacker</div>
                  <div className="text-sm text-gray-400">28 referrals</div>
                </div>
              </div>
              <div className="text-green-400 font-bold">+14,000 SUDO</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}