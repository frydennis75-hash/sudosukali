import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Game } from "@shared/schema";
import {
  Key,
  Wifi,
  Database,
  UserX,
  Lock,
  Bug,
  Shield,
  Target,
} from "lucide-react";

const gameIcons: Record<string, any> = {
  "password-crack": Key,
  "network-scan": Wifi,
  "sql-inject": Database,
  "social-eng": UserX,
  "crypto-break": Lock,
  "zero-day": Bug,
  "penetration-test": Shield,
  "vulnerability-scan": Target,
};

const difficultyColors: Record<string, string> = {
  easy: "bg-primary/20 text-primary",
  medium: "bg-secondary/20 text-secondary",
  hard: "bg-destructive/20 text-destructive",
  expert: "bg-accent/20 text-accent",
  elite: "bg-gradient-to-r from-accent/20 to-primary/20 text-accent",
};

const difficultyLabels: Record<string, string> = {
  easy: "EASY",
  medium: "MEDIUM", 
  hard: "HARD",
  expert: "EXPERT",
  elite: "ELITE",
};

interface GameCardProps {
  game: Game;
  userProgress?: number;
  onStartGame?: () => void;
}

export default function GameCard({ game, userProgress = 0, onStartGame }: GameCardProps) {
  const IconComponent = gameIcons[game.type] || Shield;
  const difficultyClass = difficultyColors[game.difficulty] || "bg-muted/20 text-muted-foreground";
  const difficultyLabel = difficultyLabels[game.difficulty] || game.difficulty.toUpperCase();

  return (
    <Card className="terminal-border hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded border border-primary flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-mono font-bold text-lg" data-testid={`game-title-${game.type}`}>
              {game.name}
            </h3>
          </div>
          <Badge className={`${difficultyClass} font-mono text-xs`} data-testid={`game-difficulty-${game.type}`}>
            {difficultyLabel}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 font-mono leading-relaxed">
          {getGameDescription(game.type)}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm font-mono">
            <span>REWARD:</span>
            <span className="text-primary" data-testid={`game-reward-${game.type}`}>
              {game.minReward}-{game.maxReward} POL
            </span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span>PLAYERS:</span>
            <span className="text-secondary" data-testid={`game-players-${game.type}`}>
              {(game.totalPlayers || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span>DIFFICULTY:</span>
            <span className={getTextColorForDifficulty(game.difficulty)}>
              {difficultyLabel}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm font-mono mb-1">
            <span>PROGRESS:</span>
            <span className="text-primary">{userProgress}%</span>
          </div>
          <Progress 
            value={userProgress} 
            className="h-2" 
            data-testid={`game-progress-${game.type}`}
          />
        </div>

        <div className="flex space-x-2">
          <Link href={`/game/${game.id}`} className="flex-1">
            <Button 
              className="w-full bg-primary text-primary-foreground font-mono font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
              data-testid={`button-start-${game.type}`}
            >
              INITIATE HACK
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function getGameDescription(gameType: string): string {
  const descriptions: Record<string, string> = {
    "password-crack": "Break encrypted passwords using various attack vectors. Master dictionary attacks, brute force, and rainbow tables.",
    "network-scan": "Discover network vulnerabilities and map system architectures. Learn port scanning and service enumeration.",
    "sql-inject": "Exploit database vulnerabilities through SQL injection techniques. Master union-based and blind SQL attacks.",
    "social-eng": "Master the art of human manipulation. Learn phishing, pretexting, and psychological exploitation techniques.",
    "crypto-break": "Break encryption algorithms and cryptographic protocols. Challenge RSA, AES, and blockchain security.",
    "zero-day": "Hunt for unknown vulnerabilities in real-world applications. Discover zero-day exploits and earn bounties.",
  };
  
  return descriptions[gameType] || "Advanced cybersecurity simulation challenge.";
}

function getTextColorForDifficulty(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: "text-primary",
    medium: "text-secondary",
    hard: "text-destructive",
    expert: "text-accent",
    elite: "text-accent",
  };
  
  return colors[difficulty] || "text-muted-foreground";
}
