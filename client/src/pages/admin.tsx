import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Settings, 
  Activity, 
  Users, 
  DollarSign, 
  Gamepad2, 
  TrendingUp,
  AlertTriangle,
  Edit,
  Plus,
  Pause,
  Shield,
  AlertCircle
} from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [rewardMultiplier, setRewardMultiplier] = useState([1.0]);
  const [stakingApy, setStakingApy] = useState([15.7]);
  const [minPayout, setMinPayout] = useState("10");
  const [difficultyScaling, setDifficultyScaling] = useState("adaptive");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: games } = useQuery({
    queryKey: ["/api/games"],
  });

  const { data: systemConfig } = useQuery({
    queryKey: ["/api/system/config"],
  });

  // Update state when systemConfig changes
  useEffect(() => {
    if (systemConfig) {
      setRewardMultiplier([parseFloat(systemConfig.rewardMultiplier)]);
      setStakingApy([parseFloat(systemConfig.stakingApy)]);
      setMinPayout(systemConfig.minPayout);
      setDifficultyScaling(systemConfig.difficultyScaling);
    }
  }, [systemConfig]);

  const updateConfigMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await apiRequest("PATCH", "/api/system/config", config);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/system/config"] });
      toast({
        title: "Configuration Updated",
        description: "System configuration has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateConfig = async () => {
    await updateConfigMutation.mutateAsync({
      rewardMultiplier: rewardMultiplier[0].toString(),
      stakingApy: stakingApy[0].toString(),
      minPayout,
      difficultyScaling,
    });
  };

  const handleEmergencyAction = (action: string) => {
    toast({
      title: "Emergency Action",
      description: `${action} has been initiated`,
      variant: "destructive",
    });
  };

  return (
    <>
      <Navigation />
      
      {/* Header */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-mono font-bold mb-6 neon-text" data-testid="admin-title">
            &gt; ADMIN_CONSOLE
          </h1>
          <p className="text-xl text-muted-foreground font-mono mb-8" data-testid="admin-description">
            Manage games, monitor performance, and control platform parameters
          </p>
          
          <div className="bg-card terminal-border rounded-lg p-4 max-w-md mx-auto">
            <div className="text-primary font-mono text-sm mb-2">
              <span className="text-secondary">root@cyberhack:~#</span> systemctl status cyberhack
            </div>
            <div className="text-muted-foreground font-mono text-sm">
              ● cyberhack.service - CyberHack Gaming Platform
            </div>
            <div className="text-primary font-mono text-sm">
              Active: <span className="text-secondary">active (running)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Dashboard */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="terminal-border text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-mono font-bold text-primary mb-2" data-testid="metric-active-users">
                  {(stats as any)?.activeUsers?.toLocaleString() || "0"}
                </div>
                <div className="text-sm font-mono text-muted-foreground flex items-center justify-center">
                  <Users className="h-4 w-4 mr-1" />
                  ACTIVE_USERS
                </div>
              </CardContent>
            </Card>
            
            <Card className="terminal-border text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-mono font-bold text-secondary mb-2" data-testid="metric-daily-revenue">
                  {(stats as any)?.dailyRevenue || "0"} POL
                </div>
                <div className="text-sm font-mono text-muted-foreground flex items-center justify-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  DAILY_REVENUE
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-border text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-mono font-bold text-accent mb-2" data-testid="metric-games-played">
                  {(stats as any)?.gamesPlayed?.toLocaleString() || "0"}
                </div>
                <div className="text-sm font-mono text-muted-foreground flex items-center justify-center">
                  <Gamepad2 className="h-4 w-4 mr-1" />
                  GAMES_PLAYED
                </div>
              </CardContent>
            </Card>

            <Card className="terminal-border text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-mono font-bold text-primary mb-2" data-testid="metric-total-staked">
                  {(stats as any)?.totalStaked ? parseFloat((stats as any).totalStaked).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "K" : "0"}
                </div>
                <div className="text-sm font-mono text-muted-foreground flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  TOTAL_STAKED
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Game Management */}
            <Card className="terminal-border">
              <CardHeader>
                <CardTitle className="font-mono text-primary flex items-center" data-testid="game-management-title">
                  <Settings className="h-5 w-5 mr-2" />
                  GAME_MANAGEMENT
                </CardTitle>
                <CardDescription className="font-mono">
                  Manage active games and their configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(games as any)?.map((game: any) => (
                    <div 
                      key={game.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded border border-border"
                      data-testid={`game-${game.type}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded border border-primary flex items-center justify-center">
                          <Gamepad2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-mono font-semibold" data-testid={`game-name-${game.type}`}>
                            {game.name}
                          </div>
                          <div className="text-sm text-muted-foreground font-mono" data-testid={`game-players-${game.type}`}>
                            {game.totalPlayers?.toLocaleString()} players
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={`font-mono text-xs ${
                            game.isActive ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                          }`}
                          data-testid={`game-status-${game.type}`}
                        >
                          {game.isActive ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-secondary hover:text-secondary/80"
                          data-testid={`button-edit-${game.type}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full mt-4 bg-primary text-primary-foreground font-mono font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                  data-testid="button-add-game"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  ADD_NEW_GAME
                </Button>
              </CardContent>
            </Card>

            {/* System Controls */}
            <Card className="terminal-border">
              <CardHeader>
                <CardTitle className="font-mono text-secondary flex items-center" data-testid="system-controls-title">
                  <Activity className="h-5 w-5 mr-2" />
                  SYSTEM_CONTROLS
                </CardTitle>
                <CardDescription className="font-mono">
                  Configure platform parameters and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Token Distribution */}
                <div>
                  <h4 className="font-mono font-semibold mb-3 text-accent">TOKEN_DISTRIBUTION</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-sm">REWARD_MULTIPLIER:</span>
                        <span className="font-mono text-sm text-primary" data-testid="reward-multiplier-value">
                          {rewardMultiplier[0]}x
                        </span>
                      </div>
                      <Slider
                        value={rewardMultiplier}
                        onValueChange={setRewardMultiplier}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                        data-testid="slider-reward-multiplier"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-sm">STAKING_APY:</span>
                        <span className="font-mono text-sm text-secondary" data-testid="staking-apy-value">
                          {stakingApy[0]}%
                        </span>
                      </div>
                      <Slider
                        value={stakingApy}
                        onValueChange={setStakingApy}
                        max={30}
                        min={5}
                        step={0.1}
                        className="w-full"
                        data-testid="slider-staking-apy"
                      />
                    </div>
                  </div>
                </div>

                {/* Game Parameters */}
                <div>
                  <h4 className="font-mono font-semibold mb-3 text-accent">GAME_PARAMETERS</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm">DIFFICULTY_SCALING:</span>
                      <Select value={difficultyScaling} onValueChange={setDifficultyScaling}>
                        <SelectTrigger className="w-32 bg-input border border-border font-mono text-sm" data-testid="select-difficulty-scaling">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adaptive">ADAPTIVE</SelectItem>
                          <SelectItem value="linear">LINEAR</SelectItem>
                          <SelectItem value="exponential">EXPONENTIAL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm">MIN_PAYOUT:</span>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={minPayout}
                          onChange={(e) => setMinPayout(e.target.value)}
                          className="w-20 bg-input border border-border font-mono text-sm"
                          data-testid="input-min-payout"
                        />
                        <span className="font-mono text-sm">POL</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleUpdateConfig}
                  disabled={updateConfigMutation.isPending}
                  className="w-full bg-secondary text-secondary-foreground font-mono font-semibold hover:shadow-lg hover:shadow-secondary/50 transition-all duration-300"
                  data-testid="button-update-config"
                >
                  {updateConfigMutation.isPending ? "UPDATING..." : "UPDATE_CONFIG"}
                </Button>

                {/* Emergency Controls */}
                <div>
                  <h4 className="font-mono font-semibold mb-3 text-destructive flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    EMERGENCY_CONTROLS
                  </h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleEmergencyAction("PAUSE_ALL_GAMES")}
                      variant="destructive"
                      className="w-full font-mono font-semibold hover:shadow-lg hover:shadow-destructive/50 transition-all duration-300"
                      data-testid="button-pause-games"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      PAUSE_ALL_GAMES
                    </Button>
                    <Button
                      onClick={() => handleEmergencyAction("EMERGENCY_WITHDRAW")}
                      variant="outline"
                      className="w-full border-destructive text-destructive font-mono font-semibold hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                      data-testid="button-emergency-withdraw"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      EMERGENCY_WITHDRAW
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-mono font-bold mb-8 text-center neon-text">
              &gt; SYSTEM_STATUS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="terminal-border">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-mono font-bold text-lg mb-2">PLATFORM_STATUS</h3>
                  <Badge className="bg-primary/20 text-primary font-mono">OPERATIONAL</Badge>
                </CardContent>
              </Card>

              <Card className="terminal-border">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-mono font-bold text-lg mb-2">SECURITY_STATUS</h3>
                  <Badge className="bg-secondary/20 text-secondary font-mono">SECURE</Badge>
                </CardContent>
              </Card>

              <Card className="terminal-border">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent">
                    <TrendingUp className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-mono font-bold text-lg mb-2">PERFORMANCE</h3>
                  <Badge className="bg-accent/20 text-accent font-mono">OPTIMAL</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
