import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  Target,
  Star,
  Flame,
  Lightning,
  Trophy,
  Timer,
  Sparkles
} from "lucide-react";

interface RewardMultiplier {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  duration: string;
  requirement: string;
  isActive: boolean;
  isAvailable: boolean;
  icon: string;
  color: string;
}

interface StreakBonus {
  day: number;
  multiplier: number;
  isUnlocked: boolean;
  reward: string;
}

export default function EnhancedRewards() {
  const { account, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState("multipliers");

  // Mock user stats
  const userStats = {
    currentStreak: 7,
    longestStreak: 23,
    totalEarnings: "15,847.32",
    weeklyEarnings: "2,156.80",
    level: 12,
    xp: 2840,
    nextLevelXp: 3200
  };

  // Enhanced reward multipliers
  const multipliers: RewardMultiplier[] = [
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Complete challenges in under 2 minutes",
      multiplier: 1.5,
      duration: "24 hours",
      requirement: "Complete 3 challenges under 2 min",
      isActive: true,
      isAvailable: true,
      icon: "⚡",
      color: "text-yellow-400"
    },
    {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Achieve 100% completion rate",
      multiplier: 2.0,
      duration: "12 hours",
      requirement: "Complete 5 challenges with 100% score",
      isActive: false,
      isAvailable: true,
      icon: "🎯",
      color: "text-green-400"
    },
    {
      id: "night_owl",
      name: "Night Owl",
      description: "Play between 10 PM - 6 AM",
      multiplier: 1.3,
      duration: "Until sunrise",
      requirement: "Active during night hours",
      isActive: true,
      isAvailable: true,
      icon: "🦉",
      color: "text-purple-400"
    },
    {
      id: "marathon_hacker",
      name: "Marathon Hacker", 
      description: "Play for 4+ hours continuously",
      multiplier: 1.8,
      duration: "6 hours",
      requirement: "4 hours continuous gameplay",
      isActive: false,
      isAvailable: false,
      icon: "🏃",
      color: "text-orange-400"
    },
    {
      id: "elite_specialist",
      name: "Elite Specialist",
      description: "Focus on a single game type",
      multiplier: 2.5,
      duration: "7 days",
      requirement: "Complete 10 elite challenges of same type",
      isActive: false,
      isAvailable: true,
      icon: "🔥",
      color: "text-red-400"
    }
  ];

  // Streak bonuses
  const streakBonuses: StreakBonus[] = [
    { day: 3, multiplier: 1.1, isUnlocked: true, reward: "10% bonus for 24h" },
    { day: 7, multiplier: 1.2, isUnlocked: true, reward: "20% bonus + 50 SUDO" },
    { day: 14, multiplier: 1.3, isUnlocked: false, reward: "30% bonus + 100 SUDO" },
    { day: 21, multiplier: 1.4, isUnlocked: false, reward: "40% bonus + NFT" },
    { day: 30, multiplier: 1.5, isUnlocked: false, reward: "50% bonus + Elite NFT" },
    { day: 60, multiplier: 2.0, isUnlocked: false, reward: "100% bonus + Legendary NFT" },
    { day: 100, multiplier: 3.0, isUnlocked: false, reward: "300% bonus + Mythic NFT" }
  ];

  const getMultiplierStatus = (multiplier: RewardMultiplier) => {
    if (multiplier.isActive) return "bg-green-500/20 text-green-300 border-green-500/30 neon-glow";
    if (multiplier.isAvailable) return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Lightning className="h-8 w-8 text-primary neon-glow" />
          <h1 className="text-3xl font-bold text-primary neon-glow">Enhanced Rewards</h1>
          <Lightning className="h-8 w-8 text-primary neon-glow" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Boost your earnings with dynamic multipliers, streak bonuses, and exclusive perks. 
          The more you play, the more you earn!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center terminal-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{userStats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
            <div className="text-xs text-green-400 mt-1">+{(userStats.currentStreak >= 7 ? 20 : userStats.currentStreak >= 3 ? 10 : 0)}% bonus</div>
          </CardContent>
        </Card>
        <Card className="text-center terminal-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">{userStats.longestStreak}</div>
            <div className="text-sm text-muted-foreground">Best Streak</div>
            <div className="text-xs text-yellow-400 mt-1">Personal Record</div>
          </CardContent>
        </Card>
        <Card className="text-center terminal-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">2.3x</div>
            <div className="text-sm text-muted-foreground">Active Multiplier</div>
            <div className="text-xs text-green-400 mt-1">Speed Demon + Night Owl</div>
          </CardContent>
        </Card>
        <Card className="text-center terminal-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{userStats.weeklyEarnings}</div>
            <div className="text-sm text-muted-foreground">This Week</div>
            <div className="text-xs text-green-400 mt-1">↗ +34% vs last week</div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="multipliers" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Multipliers
          </TabsTrigger>
          <TabsTrigger value="streaks" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Streak Bonuses
          </TabsTrigger>
          <TabsTrigger value="levels" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Level Perks
          </TabsTrigger>
        </TabsList>

        {/* Multipliers Tab */}
        <TabsContent value="multipliers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {multipliers.map((multiplier) => (
              <Card 
                key={multiplier.id} 
                className={`terminal-border hover:border-primary/50 transition-all duration-300 ${
                  multiplier.isActive ? 'bg-primary/5 neon-glow' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{multiplier.icon}</div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {multiplier.name}
                          <Badge className={`${multiplier.color} font-mono`}>
                            {multiplier.multiplier}x
                          </Badge>
                        </CardTitle>
                        <CardDescription>{multiplier.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getMultiplierStatus(multiplier)}>
                      {multiplier.isActive ? "ACTIVE" : multiplier.isAvailable ? "AVAILABLE" : "LOCKED"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span>Duration: {multiplier.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>Requirement</span>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/20 rounded border border-muted/30">
                    <p className="text-sm text-muted-foreground">{multiplier.requirement}</p>
                  </div>

                  <div className="pt-2">
                    {multiplier.isActive ? (
                      <Button variant="outline" className="w-full" disabled>
                        <Zap className="h-4 w-4 mr-2" />
                        Currently Active
                      </Button>
                    ) : multiplier.isAvailable ? (
                      <Button className="w-full neon-glow">
                        <Target className="h-4 w-4 mr-2" />
                        Activate Multiplier
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Requirements Not Met
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Streak Bonuses Tab */}
        <TabsContent value="streaks" className="space-y-6">
          <Card className="terminal-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-400" />
                Daily Streak Progress
              </CardTitle>
              <CardDescription>
                Keep your streak alive to unlock massive bonus multipliers and exclusive rewards!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {streakBonuses.map((bonus) => (
                  <div 
                    key={bonus.day} 
                    className={`flex items-center justify-between p-4 rounded border transition-all duration-300 ${
                      bonus.isUnlocked 
                        ? 'bg-green-500/10 border-green-500/30 neon-glow' 
                        : userStats.currentStreak >= bonus.day
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-muted/10 border-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl ${bonus.isUnlocked ? '' : 'grayscale'}`}>
                        {bonus.day <= 7 ? '🔥' : bonus.day <= 21 ? '💎' : bonus.day <= 60 ? '👑' : '🌟'}
                      </div>
                      <div>
                        <div className="font-semibold">Day {bonus.day} Streak</div>
                        <div className="text-sm text-muted-foreground">{bonus.reward}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`font-mono ${bonus.isUnlocked ? 'text-green-400' : 'text-yellow-400'}`}>
                        {bonus.multiplier}x
                      </Badge>
                      {bonus.isUnlocked && (
                        <Badge className="bg-green-500/20 text-green-300">✓ Unlocked</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Level Perks Tab */}
        <TabsContent value="levels" className="space-y-6">
          <Card className="terminal-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                Level {userStats.level} - Elite Hacker
              </CardTitle>
              <CardDescription>
                Level up to unlock permanent passive bonuses and exclusive features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* XP Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Experience Points</span>
                  <span>{userStats.xp}/{userStats.nextLevelXp} XP</span>
                </div>
                <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {userStats.nextLevelXp - userStats.xp} XP to next level
                </p>
              </div>

              {/* Current Level Perks */}
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Current Level Perks:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/30">
                    <div className="text-green-400">✓</div>
                    <span className="text-sm">+20% base reward multiplier</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/30">
                    <div className="text-green-400">✓</div>
                    <span className="text-sm">Access to elite tournaments</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/30">
                    <div className="text-green-400">✓</div>
                    <span className="text-sm">Exclusive level 12 badge NFT</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded border border-green-500/30">
                    <div className="text-green-400">✓</div>
                    <span className="text-sm">Premium support access</span>
                  </div>
                </div>
              </div>

              {/* Next Level Preview */}
              <div className="space-y-3">
                <h4 className="font-semibold text-yellow-400">Level 13 Unlocks:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                    <div className="text-yellow-400">→</div>
                    <span className="text-sm">+25% base reward multiplier</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                    <div className="text-yellow-400">→</div>
                    <span className="text-sm">Custom terminal themes</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                    <div className="text-yellow-400">→</div>
                    <span className="text-sm">Advanced analytics dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                    <div className="text-yellow-400">→</div>
                    <span className="text-sm">Priority queue in tournaments</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Special Event Banner */}
      <Card className="bg-gradient-to-r from-orange-900/20 via-red-500/10 to-pink-900/20 border-red-500/30 neon-glow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="p-4 bg-red-500/20 rounded-full neon-glow">
                <Sparkles className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-400 mb-2">🔥 MEGA MULTIPLIER WEEKEND 🔥</h3>
              <p className="text-muted-foreground mb-3">
                All multipliers boosted by 50%! Stack bonuses for insane rewards. 
                Limited time event - ends in 23 hours!
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  23:47:12 remaining
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +50% all multipliers
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  Double XP weekend
                </span>
              </div>
            </div>
            <Button className="neon-glow cyber-glitch" size="lg">
              Claim Bonus
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}