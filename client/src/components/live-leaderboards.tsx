import { useState, useEffect } from 'react'
import { Trophy, Flame, Star, Crown, Target, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

interface LeaderboardPlayer {
  rank: number
  address: string
  displayName: string
  score: number
  streak: number
  level: number
  earnings: number
  gamesPlayed: number
  winRate: number
  badge?: string
  isOnline: boolean
}

const mockLeaderboardData: LeaderboardPlayer[] = [
  {
    rank: 1,
    address: '0x742d35Cc7B4C4532E7B4C4532E7B4C4532E7B',
    displayName: 'CyberNinja',
    score: 156420,
    streak: 23,
    level: 47,
    earnings: 89750,
    gamesPlayed: 342,
    winRate: 94.2,
    badge: '👑',
    isOnline: true
  },
  {
    rank: 2,
    address: '0x853e46Dd8C5B5643F8C5B5643F8C5B5643F8C5',
    displayName: 'HackMaster',
    score: 142380,
    streak: 18,
    level: 42,
    earnings: 76230,
    gamesPlayed: 289,
    winRate: 91.7,
    badge: '🥈',
    isOnline: true
  },
  {
    rank: 3,
    address: '0x964f57Ee9D6C6754G9D6C6754G9D6C6754G9D6',
    displayName: 'PentestPro',
    score: 128960,
    streak: 15,
    level: 38,
    earnings: 64150,
    gamesPlayed: 267,
    winRate: 88.4,
    badge: '🥉',
    isOnline: false
  },
  {
    rank: 4,
    address: '0xa75g68Ff0E7D7865H0E7D7865H0E7D7865H0E7',
    displayName: 'EliteHacker',
    score: 115420,
    streak: 12,
    level: 35,
    earnings: 58920,
    gamesPlayed: 234,
    winRate: 85.9,
    badge: '⚡',
    isOnline: true
  },
  {
    rank: 5,
    address: '0xb86h79Gg1F8E8976I1F8E8976I1F8E8976I1F8',
    displayName: 'CodeBreaker',
    score: 98750,
    streak: 9,
    level: 31,
    earnings: 47680,
    gamesPlayed: 198,
    winRate: 82.3,
    badge: '🔥',
    isOnline: false
  }
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="h-6 w-6 text-yellow-400" />
    case 2: return <Trophy className="h-6 w-6 text-gray-400" />
    case 3: return <Trophy className="h-6 w-6 text-amber-600" />
    default: return <Target className="h-5 w-5 text-purple-400" />
  }
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1: return 'from-yellow-400/20 to-amber-500/20 border-yellow-400/50'
    case 2: return 'from-gray-300/20 to-slate-400/20 border-gray-400/50'
    case 3: return 'from-amber-500/20 to-orange-500/20 border-amber-500/50'
    default: return 'from-purple-500/20 to-blue-500/20 border-purple-400/50'
  }
}

export function LiveLeaderboards() {
  const [activeTab, setActiveTab] = useState('overall')
  const [liveData, setLiveData] = useState(mockLeaderboardData)
  const [isLive, setIsLive] = useState(true)

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setLiveData(prev => prev.map(player => ({
        ...player,
        score: player.score + Math.floor(Math.random() * 50),
        earnings: player.earnings + Math.floor(Math.random() * 100),
        isOnline: Math.random() > 0.3
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Trophy className="h-8 w-8 text-yellow-400" />
            {isLive && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Live Leaderboards
            </h2>
            <p className="text-sm text-muted-foreground">
              {isLive ? 'Live Updates' : 'Paused'} • {liveData.length} Elite Players
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={isLive ? "default" : "secondary"} className="animate-pulse">
            <Zap className="h-3 w-3 mr-1" />
            {isLive ? 'LIVE' : 'OFFLINE'}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 backdrop-blur-sm">
          <TabsTrigger value="overall" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Overall</span>
          </TabsTrigger>
          <TabsTrigger value="streak" className="flex items-center space-x-2">
            <Flame className="h-4 w-4" />
            <span>Streak</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Earnings</span>
          </TabsTrigger>
          <TabsTrigger value="winrate" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Win Rate</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <div className="grid gap-4">
            {liveData
              .sort((a, b) => b.score - a.score)
              .map((player, index) => {
                const actualRank = index + 1
                return (
                  <Card 
                    key={player.address} 
                    className={`relative overflow-hidden bg-gradient-to-r ${getRankColor(actualRank)} backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group`}
                    data-testid={`leaderboard-player-${actualRank}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          {getRankIcon(actualRank)}
                          <div className="text-2xl font-bold text-white">
                            #{actualRank}
                          </div>
                        </div>

                        <Avatar className="h-12 w-12 border-2 border-purple-400">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {player.displayName.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">
                              {player.displayName}
                            </h3>
                            {player.badge && <span className="text-xl">{player.badge}</span>}
                            {player.isOnline && (
                              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-400/50">
                                Online
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 font-mono">
                            {player.address.slice(0, 8)}...{player.address.slice(-6)}
                          </p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-2xl font-bold text-yellow-400">
                            {player.score.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">
                            Level {player.level}
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="flex items-center text-orange-400">
                            <Flame className="h-4 w-4 mr-1" />
                            <span className="font-bold">{player.streak}</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {player.winRate}% win rate
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="text-green-400 font-bold">
                            {player.earnings.toLocaleString()} SUDO
                          </div>
                          <div className="text-sm text-gray-400">
                            {player.gamesPlayed} games
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="streak" className="space-y-4">
          <div className="grid gap-4">
            {liveData
              .sort((a, b) => b.streak - a.streak)
              .slice(0, 10)
              .map((player, index) => (
                <Card key={player.address} className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-xl font-bold text-orange-400">#{index + 1}</div>
                        <div>
                          <div className="font-bold text-white">{player.displayName}</div>
                          <div className="text-sm text-gray-400">{player.address.slice(0, 12)}...</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-orange-400">
                          <Flame className="h-6 w-6 mr-2" />
                          <span className="text-2xl font-bold">{player.streak}</span>
                        </div>
                        <Progress 
                          value={(player.streak / 30) * 100} 
                          className="w-32 h-2" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <div className="grid gap-4">
            {liveData
              .sort((a, b) => b.earnings - a.earnings)
              .slice(0, 10)
              .map((player, index) => (
                <Card key={player.address} className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-xl font-bold text-green-400">#{index + 1}</div>
                        <div>
                          <div className="font-bold text-white">{player.displayName}</div>
                          <div className="text-sm text-gray-400">Level {player.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {player.earnings.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">SUDO tokens</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="winrate" className="space-y-4">
          <div className="grid gap-4">
            {liveData
              .sort((a, b) => b.winRate - a.winRate)
              .slice(0, 10)
              .map((player, index) => (
                <Card key={player.address} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-xl font-bold text-purple-400">#{index + 1}</div>
                        <div>
                          <div className="font-bold text-white">{player.displayName}</div>
                          <div className="text-sm text-gray-400">{player.gamesPlayed} games played</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-400">
                            {player.winRate}%
                          </div>
                          <div className="text-sm text-gray-400">win rate</div>
                        </div>
                        <Progress 
                          value={player.winRate} 
                          className="w-32 h-2" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}