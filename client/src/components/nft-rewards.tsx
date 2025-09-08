import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/hooks/use-wallet";
import { 
  Star, 
  Trophy, 
  Shield, 
  Zap, 
  Crown, 
  Award,
  Sparkles,
  Target,
  Medal,
  Gem
} from "lucide-react";

interface NFTReward {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  category: "achievement" | "rank" | "special" | "tournament";
  requirement: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  tokenId?: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}

export default function NFTRewards() {
  const { account, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState("achievements");

  // Mock NFT rewards data
  const nftRewards: NFTReward[] = [
    {
      id: "1",
      name: "Elite Hacker Badge",
      description: "Awarded to hackers who complete 100 expert-level challenges",
      image: "🏆",
      rarity: "legendary",
      category: "achievement", 
      requirement: "Complete 100 expert challenges",
      progress: 87,
      maxProgress: 100,
      isUnlocked: false,
      attributes: [
        { trait_type: "Skill Level", value: "Expert" },
        { trait_type: "Challenge Type", value: "All Categories" },
        { trait_type: "Completion Rate", value: "87%" }
      ]
    },
    {
      id: "2",
      name: "Password Cracker Master",
      description: "Master of password cracking techniques",
      image: "🔓",
      rarity: "epic",
      category: "achievement",
      requirement: "Crack 50 elite-level passwords", 
      progress: 50,
      maxProgress: 50,
      isUnlocked: true,
      tokenId: "0x1337",
      attributes: [
        { trait_type: "Specialty", value: "Password Cracking" },
        { trait_type: "Elite Cracks", value: 50 },
        { trait_type: "Success Rate", value: "98.2%" }
      ]
    },
    {
      id: "3",
      name: "Network Ninja",
      description: "Stealthy network infiltration specialist",
      image: "🥷",
      rarity: "rare",
      category: "achievement",
      requirement: "Complete network scans on 25 different systems",
      progress: 23,
      maxProgress: 25,
      isUnlocked: false,
      attributes: [
        { trait_type: "Specialty", value: "Network Scanning" },
        { trait_type: "Systems Scanned", value: 23 },
        { trait_type: "Stealth Rating", value: "95%" }
      ]
    },
    {
      id: "4",
      name: "Tournament Champion",
      description: "Winner of the Elite Hacker Championship",
      image: "👑",
      rarity: "mythic",
      category: "tournament",
      requirement: "Win the Elite Hacker Championship",
      progress: 0,
      maxProgress: 1,
      isUnlocked: false,
      attributes: [
        { trait_type: "Tournament", value: "Elite Championship" },
        { trait_type: "Prize Pool", value: "10,000 SUDO" },
        { trait_type: "Participants", value: 100 }
      ]
    },
    {
      id: "5",
      name: "Speed Demon",
      description: "Lightning-fast challenge completion",
      image: "⚡",
      rarity: "epic",
      category: "special",
      requirement: "Complete any challenge in under 60 seconds",
      progress: 1,
      maxProgress: 1,
      isUnlocked: true,
      tokenId: "0x1338",
      attributes: [
        { trait_type: "Best Time", value: "47 seconds" },
        { trait_type: "Challenge Type", value: "SQL Injection" },
        { trait_type: "Speed Rank", value: "Top 1%" }
      ]
    },
    {
      id: "6",
      name: "Staking Whale",
      description: "High-value staking participant",
      image: "🐋",
      rarity: "legendary",
      category: "rank",
      requirement: "Stake 10,000+ SUDO tokens",
      progress: 7500,
      maxProgress: 10000,
      isUnlocked: false,
      attributes: [
        { trait_type: "Staked Amount", value: "7,500 SUDO" },
        { trait_type: "Staking Duration", value: "180 days" },
        { trait_type: "APY Earned", value: "15.7%" }
      ]
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400 border-gray-400/30";
      case "rare": return "text-blue-400 border-blue-400/30";
      case "epic": return "text-purple-400 border-purple-400/30 neon-glow";
      case "legendary": return "text-yellow-400 border-yellow-400/30 neon-glow";
      case "mythic": return "text-pink-400 border-pink-400/30 neon-glow cyber-glitch";
      default: return "text-muted-foreground border-muted/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "achievement": return <Trophy className="h-4 w-4" />;
      case "rank": return <Crown className="h-4 w-4" />;
      case "special": return <Sparkles className="h-4 w-4" />;
      case "tournament": return <Medal className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const filteredRewards = nftRewards.filter(reward => {
    switch (activeTab) {
      case "achievements": return reward.category === "achievement";
      case "tournaments": return reward.category === "tournament";
      case "ranks": return reward.category === "rank";
      case "special": return reward.category === "special";
      case "collected": return reward.isUnlocked;
      default: return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Gem className="h-8 w-8 text-primary neon-glow" />
          <h1 className="text-3xl font-bold text-primary neon-glow">NFT Rewards</h1>
          <Gem className="h-8 w-8 text-primary neon-glow" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock unique NFT rewards by completing challenges, winning tournaments, and achieving milestones.
          Each NFT is a permanent proof of your hacking skills and achievements!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{nftRewards.filter(r => r.isUnlocked).length}</div>
            <div className="text-sm text-muted-foreground">Collected</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">{nftRewards.length}</div>
            <div className="text-sm text-muted-foreground">Total Available</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">{nftRewards.filter(r => r.rarity === "legendary" && r.isUnlocked).length}</div>
            <div className="text-sm text-muted-foreground">Legendary</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-pink-400">{nftRewards.filter(r => r.rarity === "mythic" && r.isUnlocked).length}</div>
            <div className="text-sm text-muted-foreground">Mythic</div>
          </CardContent>
        </Card>
      </div>

      {/* NFT Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="flex items-center gap-2">
            <Medal className="h-4 w-4" />
            Tournaments
          </TabsTrigger>
          <TabsTrigger value="ranks" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Ranks
          </TabsTrigger>
          <TabsTrigger value="special" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Special
          </TabsTrigger>
          <TabsTrigger value="collected" className="flex items-center gap-2">
            <Gem className="h-4 w-4" />
            Collected
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <Card 
                key={reward.id} 
                className={`terminal-border hover:border-primary/50 transition-all duration-300 ${
                  reward.isUnlocked ? 'bg-primary/5' : ''
                } ${getRarityColor(reward.rarity).includes('neon-glow') ? 'neon-glow' : ''}`}
              >
                <CardHeader className="text-center">
                  <div className="text-6xl mb-2">{reward.image}</div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {reward.name}
                    {reward.isUnlocked && <Badge className="text-green-400">✓ Owned</Badge>}
                  </CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Rarity and Category */}
                  <div className="flex justify-between items-center">
                    <Badge className={getRarityColor(reward.rarity)}>
                      {reward.rarity.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {getCategoryIcon(reward.category)}
                      <span className="text-sm capitalize">{reward.category}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {!reward.isUnlocked && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{reward.progress}/{reward.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(reward.progress / reward.maxProgress) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {reward.requirement}
                      </p>
                    </div>
                  )}

                  {/* Attributes */}
                  {reward.isUnlocked && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Attributes:</h4>
                      {reward.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{attr.trait_type}:</span>
                          <span className="font-mono">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Token ID */}
                  {reward.tokenId && (
                    <div className="pt-2 border-t border-muted/20">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Token ID:</span>
                        <span className="font-mono text-primary">{reward.tokenId}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    {reward.isUnlocked ? (
                      <Button variant="outline" className="w-full" disabled>
                        <Gem className="h-4 w-4 mr-2" />
                        Collected
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        <Target className="h-4 w-4 mr-2" />
                        {Math.round((reward.progress / reward.maxProgress) * 100)}% Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRewards.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Gem className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No NFTs found</h3>
                <p className="text-muted-foreground">
                  {activeTab === "collected" && "Start completing challenges to earn your first NFT rewards!"}
                  {activeTab !== "collected" && `No ${activeTab} NFTs available in this category`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Featured NFT Spotlight */}
      <Card className="bg-gradient-to-r from-purple-900/20 via-primary/10 to-pink-900/20 border-primary/30 neon-glow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="text-6xl">👑</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-primary mb-2">🌟 MYTHIC NFT SPOTLIGHT 🌟</h3>
              <p className="text-muted-foreground mb-3">
                Tournament Champion NFT - Only awarded to winners of major tournaments. 
                This ultra-rare NFT grants exclusive access to private tournaments and special perks!
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-pink-400">MYTHIC RARITY</span>
                <span>•</span>
                <span>Tournament Exclusive</span>
                <span>•</span>
                <span>Special Perks Included</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}