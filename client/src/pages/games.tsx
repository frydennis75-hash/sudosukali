import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import GameCard from "@/components/game-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Game } from "@shared/schema";
import { AlertCircle } from "lucide-react";

export default function Games() {
  const { data: games, isLoading, error } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  if (error) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load games. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      
      {/* Header */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl lg:text-5xl font-mono font-bold mb-6 neon-text" data-testid="games-title">
            &gt; SIMULATION_MODULES
          </h1>
          <p className="text-xl text-muted-foreground font-mono mb-8" data-testid="games-description">
            Choose your hacking discipline and start earning POL tokens
          </p>
          
          <div className="bg-card terminal-border rounded-lg p-4 max-w-md mx-auto">
            <div className="text-primary font-mono text-sm mb-2">
              <span className="text-secondary">user@cyberhack:~$</span> list available_modules
            </div>
            <div className="text-muted-foreground font-mono text-sm">
              Loading simulation modules...
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="terminal-border rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-2 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : games && games.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="games-grid">
              {games.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  userProgress={Math.floor(Math.random() * 80)} // Random progress for demo
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto bg-card terminal-border rounded-lg p-8">
                <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-mono font-bold text-xl mb-2">NO_MODULES_FOUND</h3>
                <p className="text-muted-foreground font-mono text-sm">
                  No simulation modules are currently available. Check back later.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-mono font-bold mb-4 neon-text">
              &gt; READY_TO_HACK?
            </h2>
            <p className="text-muted-foreground font-mono text-lg mb-6">
              Test your skills against realistic cybersecurity challenges and earn POL tokens for successful exploits.
            </p>
            <div className="bg-card terminal-border rounded-lg p-6">
              <div className="text-primary font-mono text-sm mb-2">
                <span className="text-secondary">user@cyberhack:~$</span> ./start_hacking --mode=elite
              </div>
              <div className="text-muted-foreground font-mono text-sm">
                Initializing advanced penetration testing environment...
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
