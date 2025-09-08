import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Games from "@/pages/games";
import Leaderboard from "@/pages/leaderboard";
import Rewards from "@/pages/rewards";
import Tournaments from "@/pages/tournaments";
import NFTRewardsPage from "@/pages/nft-rewards";
import Admin from "@/pages/admin";
import GameSession from "@/pages/game-session";
import NotFound from "@/pages/not-found";
import { CompetitionHub } from "@/pages/competition-hub";
import ViralHub from "@/pages/viral-hub";
import { PromotionalBanner } from "@/components/promotional-banner";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/games" component={Games} />
      <Route path="/competition" component={CompetitionHub} />
      <Route path="/viral" component={ViralHub} />
      <Route path="/tournaments" component={Tournaments} />
      <Route path="/nft-rewards" component={NFTRewardsPage} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/admin" component={Admin} />
      <Route path="/game/:gameId" component={GameSession} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground dark">
          <div className="matrix-bg fixed inset-0 z-0" />
          <div className="scanlines relative z-10">
            <PromotionalBanner />
            <Toaster />
            <Router />
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
