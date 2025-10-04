"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScoreContextType {
  currentScore: number;
  totalQuestions: number;
  levelSelected: number;
  setCurrentScore: (score: number) => void;
  setTotalQuestions: (total: number) => void;
  incrementScore: () => void;
  resetScore: () => void;
  setLevelSelected: (level: number) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

interface ScoreProviderProps {
  children: ReactNode;
}

export function ScoreProvider({ children }: ScoreProviderProps) {
  const [currentScore, setCurrentScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [levelSelected, setLevelSelected] = useState(1);

  const incrementScore = () => {
    setCurrentScore(prev => prev + 1);
  };

  const resetScore = () => {
    setCurrentScore(0);
  };

  const value = {
    currentScore,
    totalQuestions,
    setCurrentScore,
    setTotalQuestions,
    incrementScore,
    resetScore,
    levelSelected,
    setLevelSelected,
  };

  return (
    <ScoreContext.Provider value={value}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
}