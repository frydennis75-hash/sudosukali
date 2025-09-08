import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from "@/hooks/use-wallet";
import { Trophy, Medal, Award, TrendingUp, Target, Zap, AlertCircle } from "lucide-react";
import { User } from "@shared/schema";

interface LeaderboardUser extends User {
  rank: number;
}

export default function Leaderboard() {
  const { account } = useWallet();
  
  const { data: leaderboard, isLoading, error } = useQuery<LeaderboardUser[]>({
    queryKey: ["/api/leaderboard"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/users", account],
    enabled: !!account,
  });

  if (error) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load leaderboard data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-primary" />;
      case 2:
        return <Medal className="h-6 w-6 text-secondary" />;
      case 3:
        return <Award className="h-6 w-6 text-accent" />;
      default:
        return <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center font-mono font-bold text-xs">{rank}</div>;
    }
  };

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-primary text-primary-foreground";
      case 2:
        return "bg-secondary text-secondary-foreground";
      case 3:
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <Navigation />
      
      {/* Header */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-mono font-bold mb-6 neon-text" data-testid="leaderboard-title">
            &gt; ELITE_HACKERS
          </h1>
          <p className="text-xl text-muted-foreground font-mono mb-8" data-testid="leaderboard-description">
            Top performers earning the most POL tokens
          </p>
          
          <div className="bg-card terminal-border rounded-lg p-4 max-w-md mx-auto">
            <div className="text-primary font-mono text-sm mb-2">
              <span className="text-secondary">user@cyberhack:~$</span> top --sort=rewards
            </div>
            <div className="text-muted-foreground font-mono text-sm">
              Fetching elite hacker rankings...
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Global Rankings */}
            <div className="lg:col-span-2">
              <Card className="terminal-border">
                <CardHeader>
                  <CardTitle className="font-mono text-primary flex items-center" data-testid="global-rankings-title">
                    <Trophy className="h-5 w-5 mr-2" />
                    GLOBAL_RANKINGS
                  </CardTitle>
                  <CardDescription className="font-mono">
                    Top hackers by total POL tokens earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-3 bg-muted/30 rounded">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <div className="flex-1 space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                          <div className="text-right space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : leaderboard && leaderboard.length > 0 ? (
                    <div className="space-y-4" data-testid="leaderboard-list">
                      {leaderboard.map((player) => (
                        <div 
                          key={player.id}
                          className={`flex items-center justify-between p-4 bg-muted/30 rounded border border-border hover:border-primary/50 transition-colors ${
                            player.walletAddress === account ? 'border-primary bg-primary/10' : ''
                          }`}
                          data-testid={`leaderboard-row-${player.rank}`}
                        >
                          <div className="flex items-center space-x-4">
                            <Badge className={`${getRankBadgeClass(player.rank)} font-mono text-sm min-w-[2rem] h-8 flex items-center justify-center`}>
                              {player.rank}
                            </Badge>
                            <div className="flex items-center space-x-2">
                              {getRankIcon(player.rank)}
                              <div>
                                <div className="font-mono font-semibold" data-testid={`player-username-${player.rank}`}>
                                  {player.username}
                                </div>
                                <div className="text-sm text-muted-foreground font-mono" data-testid={`player-address-${player.rank}`}>
                                  {player.walletAddress.slice(0, 6)}...{player.walletAddress.slice(-4)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-mono font-bold ${
                              player.rank === 1 ? 'text-primary' :
                              player.rank === 2 ? 'text-secondary' :
                              player.rank === 3 ? 'text-accent' : 'text-foreground'
                            }`} data-testid={`player-tokens-${player.rank}`}>
                              {parseFloat(player.totalEarned || "0").toLocaleString(undefined, { maximumFractionDigits: 2 })} POL
                            </div>
                            <div className="text-sm text-muted-foreground font-mono" data-testid={`player-level-${player.rank}`}>
                              Level {player.level || 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-mono text-muted-foreground">No players found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Player Stats Sidebar */}
            <div className="space-y-6">
              {/* Your Stats */}
              <Card className="terminal-border">
                <CardHeader>
                  <CardTitle className="font-mono text-secondary flex items-center" data-testid="your-stats-title">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    YOUR_STATS
                  </CardTitle>
                  <CardDescription className="font-mono">
                    Your current performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userStats ? (
                    <>
                      <div className="bg-muted/30 rounded p-4 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-muted-foreground text-sm">CURRENT_RANK:</span>
                          <span className="font-mono font-bold text-2xl text-primary" data-testid="user-rank">
                            #{leaderboard?.find(p => p.walletAddress === account)?.rank || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-muted-foreground text-sm">TOTAL_EARNED:</span>
                          <span className="font-mono font-bold text-primary" data-testid="user-total-earned">
                            {parseFloat((userStats as any)?.totalEarned || '0').toLocaleString(undefined, { maximumFractionDigits: 2 })} POL
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
                          <span className="font-mono text-sm">GAMES_COMPLETED:</span>
                          <span className="font-mono font-semibold" data-testid="user-games-completed">
                            {(userStats as any)?.gamesCompleted || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
                          <span className="font-mono text-sm">SUCCESS_RATE:</span>
                          <span className="font-mono font-semibold text-primary" data-testid="user-success-rate">
                            {parseFloat((userStats as any)?.successRate || '0').toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
                          <span className="font-mono text-sm">CURRENT_LEVEL:</span>
                          <span className="font-mono font-semibold text-secondary" data-testid="user-level">
                            {(userStats as any)?.level || 1}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
                          <span className="font-mono text-sm">MAX_STREAK:</span>
                          <span className="font-mono font-semibold text-accent" data-testid="user-max-streak">
                            {(userStats as any)?.maxStreak || 0} DAYS
                          </span>
                        </div>
                      </div>
                    </>
                  ) : account ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="font-mono text-muted-foreground text-sm mb-4">
                        Connect your wallet to view your stats
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievement Badges */}
              <Card className="terminal-border">
                <CardHeader>
                  <CardTitle className="font-mono text-accent flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    ACHIEVEMENTS
                  </CardTitle>
                  <CardDescription className="font-mono">
                    Unlock badges by completing challenges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/20 border border-primary rounded p-3 text-center" data-testid="achievement-password-master">
                      <div className="w-8 h-8 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-primary font-mono text-xs">🔑</span>
                      </div>
                      <div className="text-xs font-mono">PASSWORD_MASTER</div>
                    </div>
                    <div className="bg-secondary/20 border border-secondary rounded p-3 text-center" data-testid="achievement-network-scanner">
                      <div className="w-8 h-8 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-secondary font-mono text-xs">📡</span>
                      </div>
                      <div className="text-xs font-mono">NET_SCANNER</div>
                    </div>
                    <div className="bg-muted/20 border border-border rounded p-3 text-center opacity-50" data-testid="achievement-sql-expert">
                      <div className="w-8 h-8 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-muted-foreground font-mono text-xs">💾</span>
                      </div>
                      <div className="text-xs font-mono">SQL_EXPERT</div>
                    </div>
                    <div className="bg-muted/20 border border-border rounded p-3 text-center opacity-50" data-testid="achievement-zero-day">
                      <div className="w-8 h-8 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-muted-foreground font-mono text-xs">🐛</span>
                      </div>
                      <div className="text-xs font-mono">ZERO_DAY</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-mono font-bold mb-4 neon-text">
              &gt; CLIMB_THE_RANKS
            </h2>
            <p className="text-muted-foreground font-mono text-lg mb-6">
              Complete more hacking challenges to earn POL tokens and rise through the leaderboard rankings.
            </p>
            <Button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-mono font-bold text-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300" data-testid="button-start-hacking">
              START_HACKING
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
