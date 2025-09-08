import { useState, useEffect } from 'react'
import { TrendingUp, Users, DollarSign, Trophy, Star, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Activity {
  id: string
  type: 'join' | 'earn' | 'achievement' | 'tournament'
  user: string
  amount?: number
  achievement?: string
  timestamp: Date
}

const generateRandomActivity = (): Activity => {
  const types = ['join', 'earn', 'achievement', 'tournament']
  const users = ['CyberNinja', 'HackMaster', 'EliteHacker', 'CodeBreaker', 'SecurityPro', 'PentestKing', 'ByteBuster', 'CryptoHacker']
  const achievements = ['Speed Demon', 'Perfect Score', 'Streak Master', 'Elite Champion', 'Tournament Winner']
  
  const type = types[Math.floor(Math.random() * types.length)] as any
  const user = users[Math.floor(Math.random() * users.length)]
  
  const activity: Activity = {
    id: Math.random().toString(36).substr(2, 9),
    type,
    user,
    timestamp: new Date()
  }
  
  switch (type) {
    case 'earn':
      activity.amount = Math.floor(Math.random() * 5000) + 100
      break
    case 'achievement':
      activity.achievement = achievements[Math.floor(Math.random() * achievements.length)]
      break
    case 'tournament':
      activity.amount = Math.floor(Math.random() * 10000) + 1000
      break
  }
  
  return activity
}

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'join': return <Users className="h-4 w-4 text-green-400" />
    case 'earn': return <DollarSign className="h-4 w-4 text-yellow-400" />
    case 'achievement': return <Trophy className="h-4 w-4 text-purple-400" />
    case 'tournament': return <Star className="h-4 w-4 text-orange-400" />
    default: return <Zap className="h-4 w-4 text-blue-400" />
  }
}

const getActivityMessage = (activity: Activity) => {
  switch (activity.type) {
    case 'join':
      return `${activity.user} just joined the platform!`
    case 'earn':
      return `${activity.user} earned ${activity.amount} SUDO tokens!`
    case 'achievement':
      return `${activity.user} unlocked "${activity.achievement}" achievement!`
    case 'tournament':
      return `${activity.user} won ${activity.amount} SUDO in tournament!`
    default:
      return `${activity.user} is active on the platform!`
  }
}

export function SocialProof() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [stats, setStats] = useState({
    activeUsers: 1247,
    totalEarned: 2450000,
    gamesPlayed: 15673,
    avgReward: 285
  })

  // Generate initial activities
  useEffect(() => {
    const initialActivities = Array.from({ length: 10 }, generateRandomActivity)
    setActivities(initialActivities)
  }, [])

  // Add new activity every 3-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateRandomActivity()
      setActivities(prev => [newActivity, ...prev.slice(0, 9)])
      
      // Update stats slightly
      setStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        totalEarned: prev.totalEarned + Math.floor(Math.random() * 1000) + 100,
        gamesPlayed: prev.gamesPlayed + Math.floor(Math.random() * 5) + 1,
        avgReward: prev.avgReward + Math.floor(Math.random() * 10) - 5
      }))
    }, Math.random() * 5000 + 3000) // 3-8 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white animate-pulse">{stats.activeUsers.toLocaleString()}</div>
            <div className="text-xs text-gray-300">Active Hackers</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white animate-pulse">{stats.totalEarned.toLocaleString()}</div>
            <div className="text-xs text-gray-300">SUDO Distributed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white animate-pulse">{stats.gamesPlayed.toLocaleString()}</div>
            <div className="text-xs text-gray-300">Games Completed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white animate-pulse">{stats.avgReward}</div>
            <div className="text-xs text-gray-300">Avg Reward (SUDO)</div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-lg font-bold text-white">Live Activity</h3>
            <Badge className="bg-green-500/20 text-green-400 border-green-400/50">
              LIVE
            </Badge>
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors animate-fadeIn"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <div className="text-sm text-white">
                    {getActivityMessage(activity)}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Now */}
      <Card className="bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-bold text-white">Trending Now</h3>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/50 animate-pulse">
              HOT
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl mb-2">🔥</div>
              <div className="font-bold text-orange-400">Password Cracking</div>
              <div className="text-sm text-gray-300">Most played today</div>
            </div>
            
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-bold text-yellow-400">Speed Challenges</div>
              <div className="text-sm text-gray-300">Highest rewards</div>
            </div>
            
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl mb-2">👑</div>
              <div className="font-bold text-purple-400">Elite Tournaments</div>
              <div className="text-sm text-gray-300">Big prize pools</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Proof Messages */}
      <div className="text-center space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-500/50">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">💰</div>
              <div className="font-bold text-white mb-2">"Made $847 in my first week!"</div>
              <div className="text-sm text-gray-400">- CyberNinja, Elite Hacker</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/50">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">🚀</div>
              <div className="font-bold text-white mb-2">"Finally, a game that rewards skill!"</div>
              <div className="text-sm text-gray-400">- HackMaster, Tournament Champion</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/50 rounded-lg p-6">
          <div className="text-lg font-bold text-white mb-2">
            🔥 Join {stats.activeUsers.toLocaleString()}+ Elite Hackers Earning Real Crypto!
          </div>
          <div className="text-gray-300">
            Stop playing games that waste your time. Start earning SUDO tokens for your cybersecurity skills!
          </div>
        </div>
      </div>
    </div>
  )
}