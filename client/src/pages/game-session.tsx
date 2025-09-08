import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import TerminalDisplay, { useTerminal } from "@/components/terminal-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from "@/hooks/use-wallet";
import { useGameState } from "@/hooks/use-game-state";
import { useToast } from "@/hooks/use-toast";
import { 
  Timer, 
  Target, 
  Zap, 
  Trophy,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Send
} from "lucide-react";

export default function GameSession() {
  const { gameId } = useParams();
  const [, setLocation] = useLocation();
  const { account, isConnected } = useWallet();
  const { toast } = useToast();
  
  const [command, setCommand] = useState("");
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const terminal = useTerminal();
  
  const { data: game, isLoading: gameLoading, error } = useQuery({
    queryKey: ["/api/games", gameId],
    enabled: !!gameId,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/users", account],
    enabled: !!account,
  });

  const { 
    gameState, 
    startGame, 
    updateScore, 
    updateTime, 
    completeGame,
    isCreatingSession 
  } = useGameState(gameId!, user?.id);

  // Timer effect
  useEffect(() => {
    if (isGameRunning && gameState.timeRemaining > 0) {
      const timer = setInterval(() => {
        updateTime(gameState.timeRemaining - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (gameState.timeRemaining <= 0 && gameStarted && !gameState.completed) {
      setIsGameRunning(false);
      completeGame();
    }
  }, [isGameRunning, gameState.timeRemaining, gameStarted, gameState.completed, updateTime, completeGame]);

  // Initialize terminal
  useEffect(() => {
    if (game && !gameStarted) {
      terminal.addOutput(`Welcome to ${game.name}`);
      terminal.addOutput(`Difficulty: ${game.difficulty.toUpperCase()}`);
      terminal.addOutput(`Reward: ${game.minReward}-${game.maxReward} POL`);
      terminal.addOutput("Type 'help' for available commands");
      terminal.addOutput("Use 'start' to begin the challenge");
    }
  }, [game, gameStarted]);

  const handleStartGame = async () => {
    if (!user || !game || !isConnected) {
      toast({
        title: "Cannot Start Game",
        description: "Please connect your wallet and try again",
        variant: "destructive",
      });
      return;
    }

    try {
      await startGame(user, game);
      setGameStarted(true);
      setIsGameRunning(true);
      terminal.addCommand("start");
      terminal.addSuccess("Game session initialized!");
      terminal.addOutput("Challenge started. Good luck, hacker!");
      
      // Add game-specific initialization
      initializeGameType(game.type);
    } catch (error: any) {
      toast({
        title: "Failed to Start Game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const initializeGameType = (gameType: string) => {
    switch (gameType) {
      case "password-crack":
        terminal.addOutput("Target system: login.vulnerable-corp.com");
        terminal.addOutput("Available wordlists: rockyou.txt, common.txt");
        terminal.addOutput("Use commands: crack, wordlist, bruteforce");
        break;
      case "network-scan":
        terminal.addOutput("Target network: 192.168.1.0/24");
        terminal.addOutput("Scanning for open ports and services...");
        terminal.addOutput("Use commands: scan, nmap, enum");
        break;
      case "sql-inject":
        terminal.addOutput("Target URL: https://vulnerable-app.com/login");
        terminal.addOutput("Parameter: username, password");
        terminal.addOutput("Use commands: inject, union, blind");
        break;
      case "social-eng":
        terminal.addOutput("Target: Acme Corp employees");
        terminal.addOutput("Objective: Gather sensitive information");
        terminal.addOutput("Use commands: phish, pretext, research");
        break;
      case "crypto-break":
        terminal.addOutput("Encrypted message found:");
        terminal.addOutput("dGhpcyBpcyBhIHRlc3QgbWVzc2FnZQ==");
        terminal.addOutput("Use commands: decrypt, analyze, factor");
        break;
      case "zero-day":
        terminal.addOutput("Binary analysis required: /usr/bin/target");
        terminal.addOutput("Find and exploit unknown vulnerabilities");
        terminal.addOutput("Use commands: analyze, fuzz, exploit");
        break;
      default:
        terminal.addOutput("Generic hacking challenge loaded");
        terminal.addOutput("Use commands: scan, exploit, escalate");
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    terminal.addCommand(command);
    processCommand(command.trim().toLowerCase());
    setCommand("");
  };

  const processCommand = (cmd: string) => {
    const parts = cmd.split(' ');
    const mainCmd = parts[0];

    if (!gameStarted) {
      switch (mainCmd) {
        case "help":
          terminal.addOutput("Available commands:");
          terminal.addOutput("start - Begin the challenge");
          terminal.addOutput("info - Show game information");
          terminal.addOutput("quit - Exit the game");
          break;
        case "start":
          handleStartGame();
          break;
        case "info":
          if (game) {
            terminal.addOutput(`Game: ${game.name}`);
            terminal.addOutput(`Type: ${game.type}`);
            terminal.addOutput(`Difficulty: ${game.difficulty}`);
            terminal.addOutput(`Players: ${game.totalPlayers}`);
          }
          break;
        case "quit":
          setLocation("/games");
          break;
        default:
          terminal.addError(`Unknown command: ${cmd}`);
          terminal.addOutput("Type 'help' for available commands");
      }
      return;
    }

    if (!isGameRunning && !gameState.completed) {
      terminal.addError("Game is paused. Use 'resume' to continue.");
      return;
    }

    // Game-specific commands
    switch (game?.type) {
      case "password-crack":
        processPasswordCrackCommand(mainCmd, parts);
        break;
      case "network-scan":
        processNetworkScanCommand(mainCmd, parts);
        break;
      case "sql-inject":
        processSqlInjectCommand(mainCmd, parts);
        break;
      case "social-eng":
        processSocialEngCommand(mainCmd, parts);
        break;
      case "crypto-break":
        processCryptoBreakCommand(mainCmd, parts);
        break;
      case "zero-day":
        processZeroDayCommand(mainCmd, parts);
        break;
      default:
        processGenericCommand(mainCmd, parts);
    }
  };

  const processPasswordCrackCommand = (cmd: string, parts: string[]) => {
    switch (cmd) {
      case "crack":
        terminal.addOutput("Starting password cracking...");
        setTimeout(() => {
          const success = Math.random() > 0.4;
          if (success) {
            terminal.addSuccess("Password found: admin123");
            updateScore(gameState.score + 1000);
            if (gameState.score + 1000 >= 5000) {
              completeGame(gameState.score + 1000);
            }
          } else {
            terminal.addError("Password not found in wordlist");
          }
        }, 2000);
        break;
      case "wordlist":
        terminal.addOutput("Loading wordlist: rockyou.txt");
        terminal.addOutput("Dictionary loaded: 14,344,391 entries");
        break;
      case "bruteforce":
        terminal.addOutput("Initiating brute force attack...");
        terminal.addOutput("Estimated time: 2h 34m");
        break;
      default:
        terminal.addError(`Unknown password cracking command: ${cmd}`);
    }
  };

  const processNetworkScanCommand = (cmd: string, parts: string[]) => {
    switch (cmd) {
      case "scan":
      case "nmap":
        terminal.addOutput("Scanning network...");
        setTimeout(() => {
          terminal.addOutput("Host: 192.168.1.1 - Router (ports: 80, 443)");
          terminal.addOutput("Host: 192.168.1.10 - Web Server (ports: 22, 80, 3306)");
          terminal.addOutput("Host: 192.168.1.15 - Database (ports: 22, 3306)");
          updateScore(gameState.score + 800);
        }, 1500);
        break;
      case "enum":
        terminal.addOutput("Enumerating services...");
        terminal.addOutput("MySQL 5.7.32 detected on port 3306");
        terminal.addOutput("OpenSSH 7.4 detected on port 22");
        break;
      default:
        terminal.addError(`Unknown network command: ${cmd}`);
    }
  };

  const processSqlInjectCommand = (cmd: string, parts: string[]) => {
    switch (cmd) {
      case "inject":
        terminal.addOutput("Testing SQL injection...");
        terminal.addOutput("Payload: ' OR '1'='1");
        setTimeout(() => {
          terminal.addSuccess("SQL injection successful!");
          terminal.addOutput("Database: user_management");
          updateScore(gameState.score + 1200);
        }, 1000);
        break;
      case "union":
        terminal.addOutput("Attempting UNION-based injection...");
        terminal.addOutput("Extracting database schema...");
        break;
      case "blind":
        terminal.addOutput("Performing blind SQL injection...");
        terminal.addOutput("Testing response times...");
        break;
      default:
        terminal.addError(`Unknown SQL injection command: ${cmd}`);
    }
  };

  const processSocialEngCommand = (cmd: string, parts: string[]) => {
    switch (cmd) {
      case "phish":
        terminal.addOutput("Creating phishing email...");
        terminal.addOutput("Target: john.doe@acmecorp.com");
        terminal.addSuccess("Email sent successfully!");
        updateScore(gameState.score + 600);
        break;
      case "pretext":
        terminal.addOutput("Establishing pretext...");
        terminal.addOutput("Role: IT Support");
        terminal.addOutput("Urgency: Password reset required");
        break;
      case "research":
        terminal.addOutput("Gathering OSINT data...");
        terminal.addOutput("LinkedIn profiles found: 47");
        terminal.addOutput("Social media accounts: 23");
        break;
      default:
        terminal.addError(`Unknown social engineering command: ${cmd}`);
    }
  };

  const processCryptoBreakCommand = (cmd: string, parts: string[]) => {
    switch (cmd) {
      case "decrypt":
        terminal.addOutput("Attempting decryption...");
        setTimeout(() => {
          terminal.addSuccess("Message decrypted: 'this is a test message'");
          updateScore(gameState.score + 1500);
        }, 2000);
        break;
      case "analyze":
        terminal.addOutput("Analyzing encryption method...");
        terminal.addOutput("Detected: Base64 encoding");
        terminal.addOutput("Cipher: Possible Caesar cipher");
        break;
      case "factor":
        terminal.addOutput("Attempting to factor large number...");
        terminal.addOutput("This may take some time...");
        break;
      default:
        terminal.addError(`Unknown cryptography command: ${cmd}`);
    }
  };

  const processZeroDayCommand = (cmd: string, parts: string[]) => {
    switch (cmd) {
      case "analyze":
        terminal.addOutput("Analyzing binary...");
        terminal.addOutput("Architecture: x86_64");
        terminal.addOutput("Security: NX enabled, ASLR enabled");
        break;
      case "fuzz":
        terminal.addOutput("Starting fuzzer...");
        terminal.addOutput("Testing input validation...");
        setTimeout(() => {
          terminal.addSuccess("Buffer overflow detected!");
          updateScore(gameState.score + 2000);
        }, 3000);
        break;
      case "exploit":
        terminal.addOutput("Crafting exploit...");
        terminal.addOutput("Building ROP chain...");
        break;
      default:
        terminal.addError(`Unknown binary analysis command: ${cmd}`);
    }
  };

  const processGenericCommand = (cmd: string, parts: string[]) => {
    switch (cmd) {
      case "help":
        terminal.addOutput("Available commands: scan, exploit, escalate, info");
        break;
      case "scan":
        terminal.addOutput("Scanning target...");
        setTimeout(() => {
          terminal.addOutput("Vulnerabilities found: 3");
          updateScore(gameState.score + 500);
        }, 1000);
        break;
      case "exploit":
        terminal.addOutput("Exploiting vulnerability...");
        setTimeout(() => {
          const success = Math.random() > 0.3;
          if (success) {
            terminal.addSuccess("Exploit successful!");
            updateScore(gameState.score + 1000);
          } else {
            terminal.addError("Exploit failed");
          }
        }, 1500);
        break;
      case "escalate":
        terminal.addOutput("Attempting privilege escalation...");
        break;
      default:
        terminal.addError(`Unknown command: ${cmd}`);
        terminal.addOutput("Type 'help' for available commands");
    }
  };

  const handlePauseResume = () => {
    setIsGameRunning(!isGameRunning);
    if (!isGameRunning) {
      terminal.addOutput("Game resumed");
    } else {
      terminal.addOutput("Game paused");
    }
  };

  const handleRestart = () => {
    terminal.clearTerminal();
    setGameStarted(false);
    setIsGameRunning(false);
    updateTime(game?.config?.timeLimit || 300);
    updateScore(0);
    terminal.addOutput(`Welcome to ${game?.name}`);
    terminal.addOutput("Type 'start' to begin the challenge");
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Game not found or failed to load. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  if (!isConnected) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to access the game session.
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  if (gameLoading || !game) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-pulse">Loading game session...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      
      {/* Game Header */}
      <section className="py-8 bg-muted/20 border-b border-border">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-mono font-bold neon-text" data-testid="game-session-title">
                {game.name}
              </h1>
              <p className="text-muted-foreground font-mono" data-testid="game-session-type">
                {game.type.replace('-', ' ').toUpperCase()} // {game.difficulty.toUpperCase()}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-primary/20 text-primary font-mono" data-testid="game-reward-range">
                {game.minReward}-{game.maxReward} POL
              </Badge>
              {gameStarted && (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePauseResume}
                    className="font-mono"
                    data-testid="button-pause-resume"
                  >
                    {isGameRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRestart}
                    className="font-mono"
                    data-testid="button-restart"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Game Interface */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Terminal */}
            <div className="lg:col-span-3">
              <TerminalDisplay 
                lines={terminal.lines} 
                className="h-[500px] overflow-y-auto"
              />
              
              {/* Command Input */}
              <Card className="terminal-border mt-4">
                <CardContent className="p-4">
                  <form onSubmit={handleCommand} className="flex space-x-2">
                    <div className="flex-1 flex items-center space-x-2 bg-input rounded px-3 py-2">
                      <span className="text-secondary font-mono text-sm">user@target:~$</span>
                      <Input
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Enter command..."
                        className="flex-1 bg-transparent border-none p-0 font-mono text-sm focus-visible:ring-0"
                        disabled={!gameStarted || (!isGameRunning && !gameState.completed)}
                        data-testid="input-command"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!gameStarted || (!isGameRunning && !gameState.completed)}
                      data-testid="button-send-command"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Game Stats Sidebar */}
            <div className="space-y-6">
              {/* Game Status */}
              <Card className="terminal-border">
                <CardHeader>
                  <CardTitle className="font-mono text-sm flex items-center" data-testid="game-status-title">
                    <Target className="h-4 w-4 mr-2" />
                    GAME_STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gameStarted && (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-mono">
                          <span>TIME:</span>
                          <span className={`${gameState.timeRemaining < 60 ? 'text-destructive' : 'text-primary'}`} data-testid="game-time-remaining">
                            {formatTime(gameState.timeRemaining)}
                          </span>
                        </div>
                        <Progress 
                          value={(gameState.timeRemaining / (game.config?.timeLimit || 300)) * 100} 
                          className="h-2"
                          data-testid="game-time-progress"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-mono">
                          <span>SCORE:</span>
                          <span className="text-secondary" data-testid="game-current-score">
                            {gameState.score.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={(gameState.score / 10000) * 100} 
                          className="h-2"
                          data-testid="game-score-progress"
                        />
                      </div>

                      <div className="flex justify-between text-sm font-mono">
                        <span>STATUS:</span>
                        <Badge className={`font-mono text-xs ${
                          gameState.completed ? 'bg-primary/20 text-primary' :
                          isGameRunning ? 'bg-secondary/20 text-secondary' : 
                          'bg-muted text-muted-foreground'
                        }`} data-testid="game-status-badge">
                          {gameState.completed ? 'COMPLETED' : 
                           isGameRunning ? 'RUNNING' : 'PAUSED'}
                        </Badge>
                      </div>
                    </>
                  )}

                  {!gameStarted && (
                    <Button
                      onClick={handleStartGame}
                      disabled={isCreatingSession}
                      className="w-full bg-primary text-primary-foreground font-mono font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
                      data-testid="button-start-game"
                    >
                      {isCreatingSession ? "INITIALIZING..." : "START_CHALLENGE"}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Game Objectives */}
              <Card className="terminal-border">
                <CardHeader>
                  <CardTitle className="font-mono text-sm flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    OBJECTIVES
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm font-mono">
                    {getGameObjectives(game.type).map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary">•</span>
                        <span className="text-muted-foreground">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Rewards */}
              {gameState.completed && (
                <Card className="terminal-border border-primary">
                  <CardHeader>
                    <CardTitle className="font-mono text-sm flex items-center text-primary">
                      <Trophy className="h-4 w-4 mr-2" />
                      MISSION_COMPLETE
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-mono font-bold text-primary" data-testid="game-final-score">
                        {gameState.score.toLocaleString()}
                      </div>
                      <div className="text-sm font-mono text-muted-foreground">FINAL SCORE</div>
                      <div className="text-lg font-mono font-bold text-secondary" data-testid="game-reward-earned">
                        {/* Reward would be calculated based on score */}
                        +{Math.floor(gameState.score / 100)} POL
                      </div>
                      <div className="text-sm font-mono text-muted-foreground">REWARD EARNED</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function getGameObjectives(gameType: string): string[] {
  const objectives: Record<string, string[]> = {
    "password-crack": [
      "Crack the target system password",
      "Use wordlist attacks efficiently", 
      "Document successful techniques"
    ],
    "network-scan": [
      "Map the network topology",
      "Identify open services",
      "Enumerate system information"
    ],
    "sql-inject": [
      "Find SQL injection vulnerabilities",
      "Extract sensitive data",
      "Demonstrate impact potential"
    ],
    "social-eng": [
      "Gather target information",
      "Execute social engineering attack",
      "Obtain sensitive credentials"
    ],
    "crypto-break": [
      "Analyze encryption method",
      "Decrypt the target message",
      "Document cryptographic weakness"
    ],
    "zero-day": [
      "Analyze target binary",
      "Discover unknown vulnerabilities",
      "Develop working exploit"
    ]
  };

  return objectives[gameType] || [
    "Complete the challenge",
    "Maximize your score",
    "Learn new techniques"
  ];
}
