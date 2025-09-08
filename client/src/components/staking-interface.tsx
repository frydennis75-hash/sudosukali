import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Coins, TrendingUp, Clock, DollarSign } from "lucide-react";

interface StakingInterfaceProps {
  userBalance?: string;
  stakedAmount?: string;
  pendingRewards?: string;
  apy?: string;
  onStake?: (amount: string) => void;
  onUnstake?: (amount: string) => void;
  onClaimRewards?: () => void;
  isLoading?: boolean;
}

export default function StakingInterface({
  userBalance = "0",
  stakedAmount = "0",
  pendingRewards = "0",
  apy = "15.7",
  onStake,
  onUnstake,
  onClaimRewards,
  isLoading = false
}: StakingInterfaceProps) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake");
  const { toast } = useToast();

  const setPercentage = (percentage: number, type: "stake" | "unstake") => {
    const balance = type === "stake" ? userBalance : stakedAmount;
    const amount = (parseFloat(balance) * percentage / 100).toFixed(6);
    
    if (type === "stake") {
      setStakeAmount(amount);
    } else {
      setUnstakeAmount(amount);
    }
  };

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(userBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough POL tokens to stake",
        variant: "destructive",
      });
      return;
    }

    onStake?.(stakeAmount);
  };

  const handleUnstake = () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to unstake",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(unstakeAmount) > parseFloat(stakedAmount)) {
      toast({
        title: "Insufficient Staked Amount",
        description: "You don't have enough staked tokens",
        variant: "destructive",
      });
      return;
    }

    onUnstake?.(unstakeAmount);
  };

  const calculateEstimatedRewards = (amount: string, timeframe: "daily" | "yearly"): string => {
    const principal = parseFloat(amount) || 0;
    const apyRate = parseFloat(apy) / 100;
    
    if (timeframe === "daily") {
      return (principal * apyRate / 365).toFixed(6);
    } else {
      return (principal * apyRate).toFixed(2);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Staking Pool Info */}
      <Card className="terminal-border">
        <CardHeader>
          <CardTitle className="font-mono text-primary flex items-center">
            <Coins className="h-5 w-5 mr-2" />
            STAKING_POOL
          </CardTitle>
          <CardDescription className="font-mono">
            Earn passive rewards by staking POL tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <span className="text-sm font-mono text-muted-foreground">APY RATE:</span>
              </div>
              <Badge className="bg-secondary/20 text-secondary font-mono">
                {apy}%
              </Badge>
            </div>
            <Progress value={parseFloat(apy)} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
              <span className="font-mono text-sm">TOTAL_STAKED:</span>
              <span className="font-mono font-semibold text-primary">2.4M POL</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
              <span className="font-mono text-sm">YOUR_STAKE:</span>
              <span className="font-mono font-semibold text-secondary" data-testid="text-your-stake">
                {stakedAmount} POL
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded">
              <span className="font-mono text-sm">PENDING_REWARDS:</span>
              <span className="font-mono font-semibold text-accent" data-testid="text-pending-rewards">
                {pendingRewards} POL
              </span>
            </div>
          </div>

          <Button
            onClick={onClaimRewards}
            disabled={isLoading || parseFloat(pendingRewards) <= 0}
            className="w-full bg-secondary text-secondary-foreground font-mono font-semibold hover:shadow-lg hover:shadow-secondary/50 transition-all duration-300"
            data-testid="button-claim-rewards"
          >
            CLAIM_REWARDS
          </Button>
        </CardContent>
      </Card>

      {/* Staking Interface */}
      <Card className="lg:col-span-2 terminal-border">
        <CardHeader>
          <CardTitle className="font-mono text-accent flex items-center justify-between">
            <span className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              STAKE_TOKENS
            </span>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === "stake" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("stake")}
                className="font-mono"
                data-testid="button-tab-stake"
              >
                STAKE
              </Button>
              <Button
                variant={activeTab === "unstake" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("unstake")}
                className="font-mono"
                data-testid="button-tab-unstake"
              >
                UNSTAKE
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="font-mono">
            {activeTab === "stake" 
              ? "Stake your POL tokens to earn passive rewards" 
              : "Unstake your tokens (7-day waiting period applies)"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/20 rounded-lg p-6 border border-border">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-mono font-semibold">
                {activeTab === "stake" ? "STAKE_AMOUNT" : "UNSTAKE_AMOUNT"}
              </h4>
              <div className="text-sm font-mono text-muted-foreground">
                BALANCE: <span className="text-primary" data-testid="text-available-balance">
                  {activeTab === "stake" ? userBalance : stakedAmount} POL
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                type="number"
                placeholder="0.00"
                value={activeTab === "stake" ? stakeAmount : unstakeAmount}
                onChange={(e) => activeTab === "stake" ? setStakeAmount(e.target.value) : setUnstakeAmount(e.target.value)}
                className="w-full bg-input border border-border rounded px-4 py-3 font-mono text-lg"
                data-testid={`input-${activeTab}-amount`}
              />

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPercentage(25, activeTab)}
                  className="font-mono"
                  data-testid={`button-${activeTab}-25`}
                >
                  25%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPercentage(50, activeTab)}
                  className="font-mono"
                  data-testid={`button-${activeTab}-50`}
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPercentage(75, activeTab)}
                  className="font-mono"
                  data-testid={`button-${activeTab}-75`}
                >
                  75%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPercentage(100, activeTab)}
                  className="font-mono"
                  data-testid={`button-${activeTab}-max`}
                >
                  MAX
                </Button>
              </div>

              {activeTab === "stake" && stakeAmount && (
                <div className="bg-card rounded p-4 border border-border">
                  <div className="flex justify-between text-sm font-mono mb-2">
                    <span>ESTIMATED_REWARDS/DAY:</span>
                    <span className="text-primary" data-testid="text-estimated-daily">
                      {calculateEstimatedRewards(stakeAmount, "daily")} POL
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-mono mb-2">
                    <span>ESTIMATED_REWARDS/YEAR:</span>
                    <span className="text-secondary" data-testid="text-estimated-yearly">
                      {calculateEstimatedRewards(stakeAmount, "yearly")} POL
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      LOCK_PERIOD:
                    </span>
                    <span className="text-accent">7 DAYS MIN</span>
                  </div>
                </div>
              )}

              <Button
                onClick={activeTab === "stake" ? handleStake : handleUnstake}
                disabled={isLoading || (activeTab === "stake" ? !stakeAmount : !unstakeAmount)}
                className={`w-full font-mono font-semibold transition-all duration-300 ${
                  activeTab === "stake" 
                    ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/50" 
                    : "bg-destructive text-destructive-foreground hover:shadow-lg hover:shadow-destructive/50"
                }`}
                data-testid={`button-${activeTab}-execute`}
              >
                {isLoading ? "PROCESSING..." : 
                  activeTab === "stake" ? "STAKE_TOKENS" : "UNSTAKE_TOKENS"
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
