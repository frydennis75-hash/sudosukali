import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Clock, Users, Zap, Star, Target, Crown } from "lucide-react";

interface Tournament {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  entryFee: string;
  prizePool: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "upcoming" | "active" | "completed";
  gameType: string;
  difficulty: "easy" | "medium" | "hard" | "expert" | "elite";
}

interface TournamentParticipant {
  id: string;
  walletAddress: string;
  username: string;
  score: number;
  completionTime: number;
  position: number;
  prize: string;
}

export default function TournamentSystem() {
  const { account, isConnected } = useWallet();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("live");

  // Mock tournament data - replace with real API calls
  const tournaments: Tournament[] = [
    {
      id: "1",
      name: "Elite Hacker Championship",
      description: "Ultimate cybersecurity challenge for the best hackers",
      startTime: new Date(Date.now() + 3600000), // 1 hour from now
      endTime: new Date(Date.now() + 86400000), // 24 hours from now
      entryFee: "50",
      prizePool: "10000",
      maxParticipants: 100,
      currentParticipants: 76,
      status: "upcoming",
      gameType: "all",
      difficulty: "elite"
    },
    {
      id: "2", 
      name: "Password Cracking Speed Run",
      description: "Who can crack passwords the fastest?",
      startTime: new Date(Date.now() - 1800000), // Started 30 min ago
      endTime: new Date(Date.now() + 5400000), // 90 min total
      entryFee: "25",
      prizePool: "2500",
      maxParticipants: 50,
      currentParticipants: 43,
      status: "active",
      gameType: "password-crack",
      difficulty: "hard"
    },
    {
      id: "3",
      name: "Network Infiltration Masters",
      description: "Advanced network scanning and penetration",
      startTime: new Date(Date.now() - 7200000), // 2 hours ago
      endTime: new Date(Date.now() - 3600000), // Ended 1 hour ago
      entryFee: "30",
      prizePool: "5000",
      maxParticipants: 75,
      currentParticipants: 75,
      status: "completed",
      gameType: "network-scan",
      difficulty: "expert"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "active": return "bg-green-500/20 text-green-300 border-green-500/30 neon-glow";
      case "completed": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-orange-400";
      case "expert": return "text-red-400";
      case "elite": return "text-purple-400 neon-glow";
      default: return "text-muted-foreground";
    }
  };

  const joinTournament = useMutation({
    mutationFn: async (tournamentId: string) => {
      // Mock API call
      return { success: true, tournamentId };
    },
    onSuccess: () => {
      toast({
        title: "Tournament Joined!",
        description: "You're now registered for the tournament. Good luck!",
        className: "neon-glow"
      });
    }
  });

  const filteredTournaments = tournaments.filter(tournament => {
    switch (activeTab) {
      case "live": return tournament.status === "active";
      case "upcoming": return tournament.status === "upcoming";
      case "completed": return tournament.status === "completed";
      default: return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="h-8 w-8 text-primary neon-glow" />
          <h1 className="text-3xl font-bold text-primary neon-glow">Tournament Arena</h1>
          <Trophy className="h-8 w-8 text-primary neon-glow" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Compete against elite hackers worldwide in high-stakes cybersecurity tournaments. 
          Win massive SUDO token prizes and claim your spot on the leaderboard!
        </p>
      </div>

      {/* Tournament Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Live Tournaments
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {filteredTournaments.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
                <p className="text-muted-foreground">
                  {activeTab === "live" && "No tournaments are currently active"}
                  {activeTab === "upcoming" && "No tournaments are scheduled"}
                  {activeTab === "completed" && "No completed tournaments to show"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTournaments.map((tournament) => (
                <Card key={tournament.id} className="terminal-border hover:border-primary/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 mb-2">
                          {tournament.name}
                          <Badge className={getDifficultyColor(tournament.difficulty)}>
                            {tournament.difficulty.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{tournament.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(tournament.status)}>
                        {tournament.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Tournament Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span>Prize Pool: <span className="text-primary font-mono">{tournament.prizePool} SUDO</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>Entry: <span className="text-secondary font-mono">{tournament.entryFee} SUDO</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>
                          {tournament.status === "upcoming" && "Starts in 1h"}
                          {tournament.status === "active" && "1h 30m left"}
                          {tournament.status === "completed" && "Ended 1h ago"}
                        </span>
                      </div>
                    </div>

                    {/* Participation Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Participants</span>
                        <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                      </div>
                      <Progress 
                        value={(tournament.currentParticipants / tournament.maxParticipants) * 100} 
                        className="h-2"
                      />
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {tournament.status === "upcoming" && (
                        <Button 
                          className="w-full neon-glow" 
                          onClick={() => joinTournament.mutate(tournament.id)}
                          disabled={!isConnected || joinTournament.isPending}
                        >
                          {joinTournament.isPending ? "Joining..." : `Join Tournament (${tournament.entryFee} SUDO)`}
                        </Button>
                      )}
                      {tournament.status === "active" && (
                        <Button className="w-full bg-green-600 hover:bg-green-700 neon-glow">
                          Enter Battle Arena
                        </Button>
                      )}
                      {tournament.status === "completed" && (
                        <Button variant="outline" className="w-full">
                          View Results
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Featured Tournament Banner */}
      {activeTab === "upcoming" && (
        <Card className="bg-gradient-to-r from-purple-900/20 via-primary/10 to-cyan-900/20 border-primary/30 neon-glow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="p-4 bg-primary/20 rounded-full neon-glow">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-2">🔥 MEGA TOURNAMENT ALERT 🔥</h3>
                <p className="text-muted-foreground mb-3">
                  The biggest tournament of the year is coming! Elite Hacker Championship with 10,000 SUDO prize pool.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Starts in 1 hour
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    76/100 spots filled
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    10,000 SUDO prize
                  </span>
                </div>
              </div>
              <Button className="neon-glow" size="lg">
                Register Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}