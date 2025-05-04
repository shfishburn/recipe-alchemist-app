
import { useState, useMemo, useCallback } from 'react';
import { Recipe } from '@/types/recipe';
import { useCache } from '@/hooks/use-cache';

interface RecipeDetailState {
  activeTab: string;
  sectionsOpen: Record<string, boolean>;
  isAnalysisVisible: boolean;
  isCookModeOpen: boolean;
}

interface RecipeStateActions {
  setActiveTab: (tab: string) => void;
  toggleSection: (sectionId: string) => void;
  openSection: (sectionId: string) => void;
  closeSection: (sectionId: string) => void;
  toggleAnalysis: () => void;
  showAnalysis: () => void;
  hideAnalysis: () => void;
  toggleCookMode: () => void;
  openCookMode: () => void;
  closeCookMode: () => void;
}

/**
 * Hook for managing recipe detail UI state with performance optimizations
 */
export function useRecipeState(recipe: Recipe): {
  state: RecipeDetailState;
  actions: RecipeStateActions;
} {
  // Use cache to remember UI state across recipe views
  const cache = useCache<RecipeDetailState>({
    ttl: 600000, // 10 minutes
    maxSize: 50  // Store state for up to 50 recipes
  });
  
  // Get cached state or initialize with defaults
  const initialState = useMemo(() => {
    const cachedState = cache.get(recipe.id);
    return cachedState || {
      activeTab: 'recipe',
      sectionsOpen: {
        ingredients: true,
        instructions: true,
        nutrition: false,
        notes: false
      },
      isAnalysisVisible: false,
      isCookModeOpen: false
    };
  }, [recipe.id, cache]);
  
  // State for UI elements
  const [activeTab, setActiveTab] = useState<string>(initialState.activeTab);
  const [sectionsOpen, setSectionsOpen] = useState<Record<string, boolean>>(initialState.sectionsOpen);
  const [isAnalysisVisible, setIsAnalysisVisible] = useState<boolean>(initialState.isAnalysisVisible);
  const [isCookModeOpen, setIsCookModeOpen] = useState<boolean>(initialState.isCookModeOpen);
  
  // Section toggle handlers
  const toggleSection = useCallback((sectionId: string) => {
    setSectionsOpen(prev => {
      const newState = { 
        ...prev, 
        [sectionId]: !prev[sectionId] 
      };
      
      // Cache the updated state
      cache.set(recipe.id, {
        activeTab,
        sectionsOpen: newState,
        isAnalysisVisible,
        isCookModeOpen
      });
      
      return newState;
    });
  }, [recipe.id, activeTab, isAnalysisVisible, isCookModeOpen, cache]);
  
  const openSection = useCallback((sectionId: string) => {
    setSectionsOpen(prev => {
      if (prev[sectionId]) return prev; // No change needed
      
      const newState = { ...prev, [sectionId]: true };
      cache.set(recipe.id, {
        activeTab,
        sectionsOpen: newState,
        isAnalysisVisible,
        isCookModeOpen
      });
      
      return newState;
    });
  }, [recipe.id, activeTab, isAnalysisVisible, isCookModeOpen, cache]);
  
  const closeSection = useCallback((sectionId: string) => {
    setSectionsOpen(prev => {
      if (!prev[sectionId]) return prev; // No change needed
      
      const newState = { ...prev, [sectionId]: false };
      cache.set(recipe.id, {
        activeTab,
        sectionsOpen: newState,
        isAnalysisVisible,
        isCookModeOpen
      });
      
      return newState;
    });
  }, [recipe.id, activeTab, isAnalysisVisible, isCookModeOpen, cache]);
  
  // Analysis visibility handlers
  const toggleAnalysis = useCallback(() => {
    setIsAnalysisVisible(prev => {
      const newState = !prev;
      cache.set(recipe.id, {
        activeTab,
        sectionsOpen,
        isAnalysisVisible: newState,
        isCookModeOpen
      });
      
      return newState;
    });
  }, [recipe.id, activeTab, sectionsOpen, isCookModeOpen, cache]);
  
  const showAnalysis = useCallback(() => {
    if (!isAnalysisVisible) {
      setIsAnalysisVisible(true);
      cache.set(recipe.id, {
        activeTab,
        sectionsOpen,
        isAnalysisVisible: true,
        isCookModeOpen
      });
    }
  }, [recipe.id, activeTab, sectionsOpen, isAnalysisVisible, isCookModeOpen, cache]);
  
  const hideAnalysis = useCallback(() => {
    if (isAnalysisVisible) {
      setIsAnalysisVisible(false);
      cache.set(recipe.id, {
        activeTab,
        sectionsOpen,
        isAnalysisVisible: false,
        isCookModeOpen
      });
    }
  }, [recipe.id, activeTab, sectionsOpen, isAnalysisVisible, isCookModeOpen, cache]);
  
  // Cook mode handlers
  const toggleCookMode = useCallback(() => {
    setIsCookModeOpen(prev => {
      const newState = !prev;
      cache.set(recipe.id, {
        activeTab,
        sectionsOpen,
        isAnalysisVisible,
        isCookModeOpen: newState
      });
      
      return newState;
    });
  }, [recipe.id, activeTab, sectionsOpen, isAnalysisVisible, cache]);
  
  const openCookMode = useCallback(() => {
    if (!isCookModeOpen) {
      setIsCookModeOpen(true);
      cache.set(recipe.id, {
        activeTab,
        sectionsOpen,
        isAnalysisVisible,
        isCookModeOpen: true
      });
    }
  }, [recipe.id, activeTab, sectionsOpen, isAnalysisVisible, isCookModeOpen, cache]);
  
  const closeCookMode = useCallback(() => {
    if (isCookModeOpen) {
      setIsCookModeOpen(false);
      cache.set(recipe.id, {
        activeTab,
        sectionsOpen,
        isAnalysisVisible,
        isCookModeOpen: false
      });
    }
  }, [recipe.id, activeTab, sectionsOpen, isAnalysisVisible, isCookModeOpen, cache]);
  
  // Active tab handler with caching
  const handleSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab);
    cache.set(recipe.id, {
      activeTab: tab,
      sectionsOpen,
      isAnalysisVisible,
      isCookModeOpen
    });
  }, [recipe.id, sectionsOpen, isAnalysisVisible, isCookModeOpen, cache]);
  
  // Combined state and actions
  const state = useMemo(() => ({
    activeTab,
    sectionsOpen,
    isAnalysisVisible,
    isCookModeOpen
  }), [activeTab, sectionsOpen, isAnalysisVisible, isCookModeOpen]);
  
  const actions = useMemo(() => ({
    setActiveTab: handleSetActiveTab,
    toggleSection,
    openSection,
    closeSection,
    toggleAnalysis,
    showAnalysis,
    hideAnalysis,
    toggleCookMode,
    openCookMode,
    closeCookMode
  }), [
    handleSetActiveTab, 
    toggleSection, 
    openSection, 
    closeSection, 
    toggleAnalysis,
    showAnalysis,
    hideAnalysis,
    toggleCookMode,
    openCookMode,
    closeCookMode
  ]);
  
  return { state, actions };
}
