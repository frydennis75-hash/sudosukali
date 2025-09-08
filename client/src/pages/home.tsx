import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import WalletConnect from "@/components/wallet-connect";
import { SocialProof } from "@/components/social-proof";
import { useWallet } from "@/hooks/use-wallet";
import { Play, GraduationCap, Terminal, TrendingUp, Share } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { isConnected } = useWallet();
  const [animatedStats, setAnimatedStats] = useState({
    activePlayers: 0,
    totalRewards: 0,
    avgFee: 0.001,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: true,
  });

  // Animate stats on mount
  useEffect(() => {
    const targetStats = {
      activePlayers: 12847,
      totalRewards: 2400000,
      avgFee: 0.001,
    };

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 FPS
    const increment = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        activePlayers: Math.floor(targetStats.activePlayers * progress),
        totalRewards: targetStats.totalRewards * progress,
        avgFee: targetStats.avgFee,
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targetStats);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  // Create matrix rain effect
  useEffect(() => {
    const createMatrixRain = () => {
      const matrixChars = "01010101110011001010";
      const container = document.getElementById("matrix-container");
      if (!container) return;

      for (let i = 0; i < 3; i++) {
        const span = document.createElement("span");
        span.className = "absolute text-primary/20 font-mono animate-matrix-rain pointer-events-none text-sm";
        span.textContent = matrixChars.slice(i * 8, (i + 1) * 8);
        span.style.left = Math.random() * 100 + "%";
        span.style.animationDelay = Math.random() * 2 + "s";
        container.appendChild(span);

        setTimeout(() => {
          span.remove();
        }, 2000);
      }
    };

    const interval = setInterval(createMatrixRain, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div id="matrix-container" className="absolute inset-0" />
        
        <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-mono font-bold mb-6 neon-text animate-glitch" data-testid="hero-title">
              &gt; HACK_THE_BLOCKCHAIN
              <span className="animate-terminal-blink">_</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 font-mono" data-testid="hero-description">
              Polygon-powered hacking simulations. Learn cybersecurity, earn crypto, dominate leaderboards.
            </p>
            
            {/* Terminal Stats Display */}
            <Card className="terminal-border bg-card/95 backdrop-blur-sm rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
              <CardContent className="p-0">
                <div className="text-primary font-mono text-sm mb-2">
                  <span className="text-secondary">user@cyberhack:~$</span> show network_stats
                </div>
                <div className="space-y-1 font-mono text-sm">
                  <div>NETWORK: <span className="text-secondary">Polygon (POL)</span></div>
                  <div>ACTIVE_PLAYERS: <span className="text-primary" data-testid="stat-active-players">{animatedStats.activePlayers.toLocaleString()}</span></div>
                  <div>TOTAL_REWARDS: <span className="text-accent" data-testid="stat-total-rewards">{(animatedStats.totalRewards / 1000000).toFixed(1)}M POL</span></div>
                  <div>AVG_TXN_FEE: <span className="text-primary">${animatedStats.avgFee.toFixed(3)}</span></div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/games">
                <Button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-mono font-bold text-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-105" data-testid="button-start-hacking">
                  <Play className="h-5 w-5 mr-2" />
                  START HACKING
                </Button>
              </Link>
              <Button 
                variant="outline"
                className="border-secondary text-secondary px-8 py-4 rounded-lg font-mono font-bold text-lg hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                data-testid="button-learn-mode"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                LEARN MODE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-mono font-bold mb-4 neon-text">
              &gt; PLATFORM_FEATURES
            </h2>
            <p className="text-muted-foreground font-mono text-lg">
              Advanced cybersecurity simulation with real blockchain rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="terminal-border hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary">
                  <Terminal className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-mono font-bold text-lg mb-3">REALISTIC_SIMULATIONS</h3>
                <p className="text-muted-foreground font-mono text-sm">
                  Authentic hacking scenarios based on real-world vulnerabilities and attack vectors
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-border hover:shadow-xl hover:shadow-secondary/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-mono font-bold text-lg mb-3">EARN_POL_TOKENS</h3>
                <p className="text-muted-foreground font-mono text-sm">
                  Complete challenges and earn real POL tokens on the Polygon blockchain
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-border hover:shadow-xl hover:shadow-accent/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent">
                  <GraduationCap className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-mono font-bold text-lg mb-3">LEARN_SECURITY</h3>
                <p className="text-muted-foreground font-mono text-sm">
                  Master cybersecurity techniques through hands-on practice and expert tutorials
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-mono font-bold mb-4 neon-text">
              &gt; LIVE_ACTIVITY.show()
            </h2>
            <p className="text-xl text-muted-foreground font-mono">
              See what elite hackers are earning right now
            </p>
          </div>
          <SocialProof />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-green-900/20 to-purple-900/20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent mb-6">
            Ready to Turn Skills Into Crypto? 🚀
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of hackers earning real SUDO tokens on Polygon mainnet. 
            No luck required - just pure skill and strategy!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/games">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-mono font-bold text-lg transition-all duration-300" data-testid="button-start-earning">
                <Play className="h-5 w-5 mr-2" />
                START EARNING NOW
              </Button>
            </Link>
            
            <Link href="/viral">
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-lg font-mono font-bold text-lg transition-all duration-300" data-testid="button-invite-friends">
                <Share className="h-5 w-5 mr-2" />
                INVITE & EARN BONUS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wallet Connection Section */}
      {!isConnected && (
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-md mx-auto">
              <WalletConnect />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded terminal-border flex items-center justify-center">
                  <Terminal className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-mono text-xl font-bold neon-text">CyberHack</span>
              </div>
              <p className="text-muted-foreground font-mono text-sm">
                The ultimate hacking simulation platform powered by Polygon blockchain. Learn, compete, and earn.
              </p>
            </div>

            <div>
              <h4 className="font-mono font-semibold mb-4 text-primary">PLATFORM</h4>
              <ul className="space-y-2 font-mono text-sm">
                <li><Link href="/games"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Games</span></Link></li>
                <li><Link href="/leaderboard"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Leaderboard</span></Link></li>
                <li><Link href="/rewards"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Rewards</span></Link></li>
                <li><Link href="/admin"><span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Admin</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono font-semibold mb-4 text-secondary">RESOURCES</h4>
              <ul className="space-y-2 font-mono text-sm">
                <li><span className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer">Documentation</span></li>
                <li><span className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer">Tutorials</span></li>
                <li><span className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer">API Reference</span></li>
                <li><span className="text-muted-foreground hover:text-secondary transition-colors cursor-pointer">Security Guides</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono font-semibold mb-4 text-accent">COMMUNITY</h4>
              <ul className="space-y-2 font-mono text-sm">
                <li><span className="text-muted-foreground hover:text-accent transition-colors cursor-pointer">Discord</span></li>
                <li><span className="text-muted-foreground hover:text-accent transition-colors cursor-pointer">Twitter</span></li>
                <li><span className="text-muted-foreground hover:text-accent transition-colors cursor-pointer">GitHub</span></li>
                <li><span className="text-muted-foreground hover:text-accent transition-colors cursor-pointer">Blog</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground font-mono text-sm">
              © 2025 CyberHack Gaming. Built on Polygon. Powered by POL.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
