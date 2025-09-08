import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GameState {
  sessionId?: string;
  score: number;
  timeRemaining: number;
  completed: boolean;
  currentChallenge?: any;
}

export function useGameState(gameId: string, userId?: string) {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeRemaining: 0,
    completed: false,
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createSessionMutation = useMutation({
    mutationFn: async (data: { userId: string; gameId: string }) => {
      const response = await apiRequest("POST", "/api/game-sessions", data);
      return response.json();
    },
    onSuccess: (session) => {
      setGameState(prev => ({ ...prev, sessionId: session.id }));
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async (data: { sessionId: string; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/game-sessions/${data.sessionId}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
    },
  });

  const startGame = useCallback(async (user: any, game: any) => {
    if (!userId) return;
    
    try {
      await createSessionMutation.mutateAsync({
        userId,
        gameId,
      });

      // Initialize game state based on game type
      const gameConfig = game.config;
      setGameState(prev => ({
        ...prev,
        timeRemaining: gameConfig.timeLimit || 300,
        completed: false,
        score: 0,
      }));

      toast({
        title: "Game Started",
        description: `${game.name} session initialized`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Start Game",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [userId, gameId, createSessionMutation, toast]);

  const updateScore = useCallback((newScore: number) => {
    setGameState(prev => ({ ...prev, score: newScore }));
  }, []);

  const updateTime = useCallback((timeLeft: number) => {
    setGameState(prev => ({ ...prev, timeRemaining: timeLeft }));
    
    if (timeLeft <= 0 && !gameState.completed) {
      completeGame();
    }
  }, [gameState.completed]);

  const completeGame = useCallback(async (finalScore?: number) => {
    if (!gameState.sessionId) return;

    const score = finalScore || gameState.score;
    const reward = calculateReward(score, gameId);

    try {
      await updateSessionMutation.mutateAsync({
        sessionId: gameState.sessionId,
        updates: {
          completed: true,
          score,
          reward: reward.toString(),
          timeSpent: gameState.timeRemaining > 0 ? 
            (300 - gameState.timeRemaining) : 300, // Assuming 5 min default
        },
      });

      setGameState(prev => ({ ...prev, completed: true, score }));

      toast({
        title: "Game Complete!",
        description: `You earned ${reward} POL tokens!`,
      });
    } catch (error: any) {
      toast({
        title: "Error Completing Game",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [gameState.sessionId, gameState.score, gameState.timeRemaining, updateSessionMutation, gameId, toast]);

  const calculateReward = (score: number, gameId: string): number => {
    // Basic reward calculation - can be made more sophisticated
    const baseRewards: Record<string, { min: number; max: number }> = {
      "password-crack": { min: 50, max: 200 },
      "network-scan": { min: 25, max: 150 },
      "sql-inject": { min: 100, max: 500 },
      "social-eng": { min: 75, max: 300 },
      "crypto-break": { min: 200, max: 1000 },
      "zero-day": { min: 500, max: 5000 },
    };

    const gameRewards = baseRewards[gameId] || { min: 10, max: 100 };
    const rewardRatio = Math.min(score / 10000, 1); // Normalize score to 0-1
    
    return Math.floor(
      gameRewards.min + (gameRewards.max - gameRewards.min) * rewardRatio
    );
  };

  return {
    gameState,
    startGame,
    updateScore,
    updateTime,
    completeGame,
    isCreatingSession: createSessionMutation.isPending,
    isUpdatingSession: updateSessionMutation.isPending,
  };
}
