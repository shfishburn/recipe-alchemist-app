
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NutritionContextType {
  useUsdaData: boolean;
  toggleUsdaData: () => void;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider = ({ children }: { children: ReactNode }) => {
  const [useUsdaData, setUseUsdaData] = useState(true);

  const toggleUsdaData = () => {
    setUseUsdaData(prev => !prev);
  };

  return (
    <NutritionContext.Provider value={{ useUsdaData, toggleUsdaData }}>
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
