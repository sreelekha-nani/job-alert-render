import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

export interface AtsResult {
  score: number;
  missingKeywords: string[];
  analyzedResumeText: string;
  lastAnalyzedAt: number; // Timestamp
}

interface ATSContextType {
  atsResult: AtsResult | null;
  isAnalyzing: boolean;
  startAnalysis: () => void;
  finishAnalysis: (score: number, keywords: string[], resumeText: string) => void;
  resetATS: () => void;
  isAutoApplyAllowed: (jobThreshold?: number) => boolean;
}

const ATSContext = createContext<ATSContextType | undefined>(undefined);

export const ATSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [atsResult, setAtsResult] = useState<AtsResult | null>(() => {
    try {
      const storedResult = localStorage.getItem('atsResult');
      return storedResult ? JSON.parse(storedResult) : null;
    } catch (error) {
      return null;
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (atsResult) {
      localStorage.setItem('atsResult', JSON.stringify(atsResult));
    } else {
      localStorage.removeItem('atsResult');
    }
  }, [atsResult]);

  const startAnalysis = useCallback(() => {
    setIsAnalyzing(true);
  }, []);

  const finishAnalysis = useCallback((score: number, missingKeywords: string[], resumeText: string) => {
    const newResult: AtsResult = { score, missingKeywords, analyzedResumeText: resumeText, lastAnalyzedAt: Date.now() };
    setAtsResult(newResult);
    setIsAnalyzing(false);
  }, []);

  const resetATS = useCallback(() => {
    setAtsResult(null);
    setIsAnalyzing(false);
  }, []);

  const isAutoApplyAllowed = useCallback((jobThreshold = 80) => {
    return !!atsResult && atsResult.score >= jobThreshold;
  }, [atsResult]);

  const value = {
    atsResult,
    isAnalyzing,
    startAnalysis,
    finishAnalysis,
    resetATS,
    isAutoApplyAllowed,
  };

  return <ATSContext.Provider value={value}>{children}</ATSContext.Provider>;
};

export const useATS = () => {
  const context = useContext(ATSContext);
  if (context === undefined) {
    throw new Error('useATS must be used within an ATSProvider');
  }
  return context;
};