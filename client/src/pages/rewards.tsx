import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import StakingInterface from "@/components/staking-interface";
import EnhancedRewards from "@/components/enhanced-rewards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Coins, TrendingUp, Clock, Flame, Gift, AlertCircle, Wallet, DollarSign } from "lucide-react";

export default function Rewards() {
  const { account, isConnected } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userStats } = useQuery({
    queryKey: ["/api/users", account],
    enabled: !!account,
  });

  const { data: stakingPositions } = useQuery({
    queryKey: ["/api/users", account, "staking"],
    enabled: !!account,
  });

  const { data: systemConfig } = useQuery({
    queryKey: ["/api/system/config"],
  });

  const stakingMutation = useMutation({
    mutationFn: async (data: { userId: string; amount: string; lockPeriod: number; apy: string }) => {
      const response = await apiRequest("POST", "/api/staking", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", account, "staking"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", account] });
      toast({
        title: "Staking Successful",
        description: "Your tokens have been staked successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Staking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const unstakingMutation = useMutation({
    mutationFn: async (data: { stakingId: string }) => {
      const response = await apiRequest("PATCH", `/api/staking/${data.stakingId}`, {
        isActive: false,
        unstakeDate: new Date(),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", account, "staking"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", account] });
      toast({
        title: "Unstaking Initiated",
        description: "Your tokens will be available after the lock period",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Unstaking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStake = async (amount: string) => {
    if (!account || !userStats) return;

    await stakingMutation.mutateAsync({
      userId: (userStats as any)?.id,
      amount,
      lockPeriod: 7, // 7 days minimum lock period
      apy: (systemConfig as any)?.stakingApy || "15.7",
    });
  };

  const handleUnstake = async (amount: string) => {
    if (!(stakingPositions as any)?.length) return;

    const activePosition = (stakingPositions as any)?.find((p: any) => p.isActive);
    if (activePosition) {
      await unstakingMutation.mutateAsync({
        stakingId: activePosition.id,
      });
    }
  };

  const handleClaimRewards = async () => {
    toast({
      title: "Rewards Claimed",
      description: "Your staking rewards have been claimed",
    });
  };

  // Calculate totals from staking positions
  const totalStaked = (stakingPositions as any)?.reduce((sum: number, pos: any) => 
    pos.isActive ? sum + parseFloat(pos.amount) : sum, 0) || 0;
  
  const totalPendingRewards = (stakingPositions as any)?.reduce((sum: number, pos: any) => 
    sum + parseFloat(pos.pendingRewards || "0"), 0) || 0;

  if (!isConnected) {
    return (
      <>
        <Navigation />
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center max-w-md mx-auto">
              <Card className="terminal-border">
                <CardContent className="p-8">
                  <Wallet className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="font-mono font-bold text-xl mb-4">Connect Wallet Required</h2>
                  <p className="text-muted-foreground font-mono text-sm mb-6">
                    Connect your wallet to view and manage your rewards
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navigation />
      
      {/* Header */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-mono font-bold mb-6 neon-text" data-testid="rewards-title">
            &gt; TOKEN_REWARDS
          </h1>
          <p className="text-xl text-muted-foreground font-mono mb-8" data-testid="rewards-description">
            Stake POL tokens and earn passive rewards while you hack
          </p>
          
          <div className="bg-card terminal-border rounded-lg p-4 max-w-md mx-auto">
            <div className="text-primary font-mono text-sm mb-2">
              <span className="text-secondary">user@cyberhack:~$</span> show staking_rewards
            </div>
            <div className="text-muted-foreground font-mono text-sm">
              Loading reward statistics...
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="terminal-border text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-mono font-bold text-primary mb-2" data-testid="stat-total-earned">
                  {parseFloat((userStats as any)?.totalEarned || "0").toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm font-mono text-muted-foreground">TOTAL_EARNED</div>
              </CardContent>
            </Card>
            
            <Card className="terminal-border text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-mono font-bold text-secondary mb-2" data-testid="stat-staked-amount">
                  {totalStaked.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm font-mono text-muted-foreground">POL_STAKED</div>
              </CardContent>
            </Card>

            <Card className="terminal-border text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-mono font-bold text-accent mb-2" data-testid="stat-pending-rewards">
                  {totalPendingRewards.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </div>
                <div className="text-sm font-mono text-muted-foreground">PENDING_REWARDS</div>
              </CardContent>
            </Card>

            <Card className="terminal-border text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-mono font-bold text-primary mb-2" data-testid="stat-current-apy">
                  {(systemConfig as any)?.stakingApy || "15.7"}%
                </div>
                <div className="text-sm font-mono text-muted-foreground">CURRENT_APY</div>
              </CardContent>
            </Card>
          </div>

          {/* Staking Interface */}
          <StakingInterface
            userBalance={(userStats as any)?.totalEarned || "0"}
            stakedAmount={totalStaked.toString()}
            pendingRewards={totalPendingRewards.toString()}
            apy={(systemConfig as any)?.stakingApy || "15.7"}
            onStake={handleStake}
            onUnstake={handleUnstake}
            onClaimRewards={handleClaimRewards}
            isLoading={stakingMutation.isPending || unstakingMutation.isPending}
          />

          {/* Reward Multipliers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card className="terminal-border">
              <CardHeader>
                <CardTitle className="font-mono text-accent flex items-center" data-testid="multipliers-title">
                  <Flame className="h-5 w-5 mr-2" />
                  REWARD_MULTIPLIERS
                </CardTitle>
                <CardDescription className="font-mono">
                  Boost your earnings with these active multipliers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
                    <span className="font-mono text-sm">DAILY_STREAK:</span>
                    <Badge className="bg-primary/20 text-primary font-mono">
                      1.2x
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
                    <span className="font-mono text-sm">LEVEL_BONUS:</span>
                    <Badge className="bg-secondary/20 text-secondary font-mono">
                      1.{Math.floor(((userStats as any)?.level || 1) / 10)}x
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
                    <span className="font-mono text-sm">STAKING_TIER:</span>
                    <Badge className="bg-accent/20 text-accent font-mono">
                      {totalStaked > 1000 ? "1.3x" : totalStaked > 500 ? "1.2x" : "1.1x"}
                    </Badge>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded">
                      <span className="font-mono font-semibold">TOTAL_MULTIPLIER:</span>
                      <Badge className="bg-primary text-primary-foreground font-mono font-bold text-lg">
                        {(1.2 * (1 + ((userStats as any)?.level || 1) / 100) * (totalStaked > 1000 ? 1.3 : totalStaked > 500 ? 1.2 : 1.1)).toFixed(2)}x
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staking Positions */}
            <Card className="terminal-border">
              <CardHeader>
                <CardTitle className="font-mono text-secondary flex items-center" data-testid="positions-title">
                  <DollarSign className="h-5 w-5 mr-2" />
                  YOUR_POSITIONS
                </CardTitle>
                <CardDescription className="font-mono">
                  Active staking positions and lock periods
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(stakingPositions as any) && (stakingPositions as any).length > 0 ? (
                  <div className="space-y-4" data-testid="staking-positions-list">
                    {(stakingPositions as any).map((position: any) => (
                      <div 
                        key={position.id}
                        className={`p-4 rounded border ${
                          position.isActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-mono font-semibold">
                            {parseFloat(position.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })} POL
                          </div>
                          <Badge className={position.isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}>
                            {position.isActive ? "ACTIVE" : "UNSTAKED"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                          <div>
                            <span className="text-muted-foreground">APY: </span>
                            <span className="text-secondary">{position.apy}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Lock: </span>
                            <span className="text-accent">{position.lockPeriod} days</span>
                          </div>
                        </div>
                        {position.isActive && (
                          <div className="mt-2 text-sm font-mono">
                            <span className="text-muted-foreground">Pending: </span>
                            <span className="text-primary">{parseFloat(position.pendingRewards || "0").toFixed(6)} POL</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-mono text-muted-foreground text-sm">
                      No staking positions yet. Start staking to earn rewards!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-mono font-bold mb-4 neon-text">
              &gt; MAXIMIZE_REWARDS
            </h2>
            <p className="text-muted-foreground font-mono text-lg mb-6">
              Stake your POL tokens for passive income while completing hacking challenges for active rewards.
            </p>
            <div className="bg-card terminal-border rounded-lg p-6">
              <div className="text-primary font-mono text-sm mb-2">
                <span className="text-secondary">user@cyberhack:~$</span> ./compound_rewards --reinvest=true
              </div>
              <div className="text-muted-foreground font-mono text-sm">
                Automatically reinvesting rewards for maximum yield...
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
