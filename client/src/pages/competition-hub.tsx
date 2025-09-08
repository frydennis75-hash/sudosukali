import { useState } from 'react'
import { Trophy, Flame, Star, Crown, Target, Users, Clock, Gift } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LiveLeaderboards } from '@/components/live-leaderboards'
import { WeeklyChallenges } from '@/components/weekly-challenges'
import { AchievementSystem } from '@/components/achievement-system'
import TournamentSystem from '@/components/tournament-system'

export function CompetitionHub() {
  const [activeTab, setActiveTab] = useState('leaderboards')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-black">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Crown className="h-12 w-12 text-yellow-400 animate-bounce" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Competition Hub
            </h1>
            <Crown className="h-12 w-12 text-yellow-400 animate-bounce delay-100" />
          </div>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Welcome to the ultimate cybersecurity battleground! Compete with elite hackers, 
            climb the leaderboards, unlock legendary achievements, and dominate weekly challenges.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 text-sm">
              <Flame className="h-4 w-4 mr-2" />
              🔥 HOT: 500+ Active Players
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm">
              <Gift className="h-4 w-4 mr-2" />
              💰 1M+ SUDO Rewards Available
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm">
              <Star className="h-4 w-4 mr-2" />
              ⚡ Live Updates
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">342</div>
              <div className="text-sm text-gray-300">Active Competitors</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">1.2M</div>
              <div className="text-sm text-gray-300">SUDO Distributed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">23</div>
              <div className="text-sm text-gray-300">Longest Streak</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">4d 12h</div>
              <div className="text-sm text-gray-300">Tournament Ends</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Competition Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/70 backdrop-blur-sm mb-8 h-14">
            <TabsTrigger value="leaderboards" className="flex items-center space-x-2 text-base">
              <Trophy className="h-5 w-5" />
              <span>Leaderboards</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center space-x-2 text-base">
              <Target className="h-5 w-5" />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2 text-base">
              <Star className="h-5 w-5" />
              <span>Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="flex items-center space-x-2 text-base">
              <Users className="h-5 w-5" />
              <span>Tournaments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboards" className="space-y-6">
            <LiveLeaderboards />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <WeeklyChallenges />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementSystem />
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <TournamentSystem />
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/50 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Dominate?
              </h3>
              <p className="text-gray-300 mb-6">
                Join the elite ranks of cybersecurity masters. Every challenge conquered, 
                every streak maintained, and every tournament won brings you closer to legend status.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
                  data-testid="start-competing-button"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Start Competing
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8"
                >
                  View Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}