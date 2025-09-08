import { useState, useEffect } from 'react'
import { Clock, Users, Trophy, Zap, Target, Flame, Star, Gift } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'streak' | 'score' | 'speed' | 'endurance' | 'team'
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  reward: number
  bonusReward?: number
  timeLeft: number
  participants: number
  maxParticipants?: number
  progress: number
  target: number
  completed: boolean
  featured: boolean
  requirements?: string[]
}

const mockChallenges: Challenge[] = [
  {
    id: 'weekly-elite-streak',
    title: '🔥 Elite Streak Master',
    description: 'Maintain a 15-game winning streak in Elite difficulty challenges',
    type: 'streak',
    difficulty: 'extreme',
    reward: 10000,
    bonusReward: 5000,
    timeLeft: 345600, // 4 days
    participants: 23,
    maxParticipants: 100,
    progress: 8,
    target: 15,
    completed: false,
    featured: true,
    requirements: ['Elite level unlocked', 'Min. level 30']
  },
  {
    id: 'speed-demon-weekend',
    title: '⚡ Speed Demon Weekend',
    description: 'Complete 20 challenges in under 30 seconds each',
    type: 'speed',
    difficulty: 'hard',
    reward: 7500,
    bonusReward: 2500,
    timeLeft: 172800, // 2 days
    participants: 156,
    progress: 12,
    target: 20,
    completed: false,
    featured: true,
    requirements: ['Speed Demon badge']
  },
  {
    id: 'team-tournament',
    title: '👥 Team Tournament Royale',
    description: 'Join a team and compete in the ultimate hacking showdown',
    type: 'team',
    difficulty: 'extreme',
    reward: 25000,
    bonusReward: 15000,
    timeLeft: 518400, // 6 days
    participants: 342,
    maxParticipants: 500,
    progress: 0,
    target: 1,
    completed: false,
    featured: true,
    requirements: ['Team membership required']
  },
  {
    id: 'high-score-hunt',
    title: '🎯 High Score Hunter',
    description: 'Achieve a combined score of 50,000+ across all game types',
    type: 'score',
    difficulty: 'medium',
    reward: 5000,
    timeLeft: 259200, // 3 days
    participants: 89,
    progress: 34500,
    target: 50000,
    completed: false,
    featured: false
  },
  {
    id: 'endurance-marathon',
    title: '🏃 Endurance Marathon',
    description: 'Play for 6 consecutive hours with 90%+ accuracy',
    type: 'endurance',
    difficulty: 'extreme',
    reward: 15000,
    bonusReward: 10000,
    timeLeft: 432000, // 5 days
    participants: 12,
    maxParticipants: 50,
    progress: 3.2,
    target: 6,
    completed: false,
    featured: false,
    requirements: ['Premium account', 'Min. level 25']
  }
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-green-500/20 text-green-400 border-green-400/50'
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50'
    case 'hard': return 'bg-orange-500/20 text-orange-400 border-orange-400/50'
    case 'extreme': return 'bg-red-500/20 text-red-400 border-red-400/50'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-400/50'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'streak': return <Flame className="h-4 w-4" />
    case 'score': return <Target className="h-4 w-4" />
    case 'speed': return <Zap className="h-4 w-4" />
    case 'endurance': return <Clock className="h-4 w-4" />
    case 'team': return <Users className="h-4 w-4" />
    default: return <Star className="h-4 w-4" />
  }
}

const formatTimeLeft = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function WeeklyChallenges() {
  const [challenges, setChallenges] = useState(mockChallenges)
  const [activeTab, setActiveTab] = useState('featured')

  // Simulate live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setChallenges(prev => prev.map(challenge => ({
        ...challenge,
        timeLeft: Math.max(0, challenge.timeLeft - 1)
      })))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const featuredChallenges = challenges.filter(c => c.featured)
  const activeChallenges = challenges.filter(c => !c.completed && c.timeLeft > 0)
  const completedChallenges = challenges.filter(c => c.completed)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="h-8 w-8 text-yellow-400" />
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Weekly Challenges
            </h2>
            <p className="text-sm text-muted-foreground">
              Limited time events • Big rewards • Glory awaits
            </p>
          </div>
        </div>
        
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
          <Gift className="h-3 w-3 mr-1" />
          Special Rewards
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 backdrop-blur-sm">
          <TabsTrigger value="featured" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Featured</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Active ({activeChallenges.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Completed</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid gap-6">
            {featuredChallenges.map((challenge) => (
              <Card 
                key={challenge.id} 
                className="relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                data-testid={`featured-challenge-${challenge.id}`}
              >
                <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-500 text-black px-3 py-1 text-xs font-bold">
                  FEATURED
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(challenge.type)}
                      <div>
                        <CardTitle className="text-xl text-white">
                          {challenge.title}
                        </CardTitle>
                        <p className="text-gray-400 mt-1">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {challenge.reward.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">Base Reward</div>
                      </div>
                      
                      {challenge.bonusReward && (
                        <div className="text-center">
                          <div className="text-xl font-bold text-yellow-400">
                            +{challenge.bonusReward.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">Bonus</div>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">
                          {challenge.participants}
                        </div>
                        <div className="text-xs text-gray-400">Players</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-400">
                        {formatTimeLeft(challenge.timeLeft)}
                      </div>
                      <div className="text-xs text-gray-400">Time Left</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        {challenge.progress} / {challenge.target}
                      </span>
                    </div>
                    <Progress 
                      value={(challenge.progress / challenge.target) * 100} 
                      className="h-2"
                    />
                  </div>

                  {challenge.requirements && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-300">Requirements:</div>
                      <div className="flex flex-wrap gap-2">
                        {challenge.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
                      data-testid={`join-challenge-${challenge.id}`}
                    >
                      Join Challenge
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {activeChallenges.map((challenge) => (
              <Card 
                key={challenge.id} 
                className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getTypeIcon(challenge.type)}
                      <div>
                        <h3 className="font-bold text-white">{challenge.title}</h3>
                        <p className="text-sm text-gray-400">{challenge.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-green-400">
                          {challenge.reward.toLocaleString()} SUDO
                        </div>
                        <div className="text-sm text-orange-400">
                          {formatTimeLeft(challenge.timeLeft)} left
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="text-center py-8 text-gray-400">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No completed challenges yet.</p>
            <p className="text-sm">Complete challenges to see your achievements here!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}