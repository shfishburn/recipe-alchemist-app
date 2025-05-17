
import { useState, useCallback } from 'react';
import type { QuickRecipe } from '@/types/quick-recipe';
import { ModificationStatus, RecipeModifications, RecipeModificationHistoryItem, VersionInfo } from './types';
import { toast } from 'sonner';

// Re-export types
export * from './types';

export function useRecipeModifications(initialRecipe: QuickRecipe) {
  const [status, setStatus] = useState<ModificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [modifications, setModifications] = useState<RecipeModifications | null>(null);
  const [modifiedRecipe, setModifiedRecipe] = useState<QuickRecipe>(initialRecipe);
  const [modificationHistory, setModificationHistory] = useState<RecipeModificationHistoryItem[]>([]);
  const [versionHistory, setVersionHistory] = useState<VersionInfo[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [isModified, setIsModified] = useState(false);
  
  // Mock data for the modification request
  const modificationRequest = {
    id: "mock-request-id",
    request: "",
    createdAt: new Date().toISOString()
  };
  
  const selectVersion = useCallback((versionId: string) => {
    setSelectedVersionId(versionId);
    // In a real implementation, this would fetch the version
    console.log(`Selected version: ${versionId}`);
  }, []);
  
  const requestModifications = useCallback((request: string, immediate: boolean) => {
    setStatus('loading');
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Mock a successful modification
        const mockModifications: RecipeModifications = {
          changes: [
            {
              property: 'ingredients',
              original: initialRecipe.ingredients,
              modified: [...initialRecipe.ingredients]
            }
          ],
          summary: `Applied modifications based on: ${request}`,
          recipe: {
            ...initialRecipe,
            description: `${initialRecipe.description} (Modified per request: ${request})`
          },
          nutritionImpact: {
            calories: -50,
            protein: 2,
            carbs: -5,
            fat: -3
          }
        };
        
        setModifications(mockModifications);
        setModifiedRecipe(mockModifications.recipe!);
        setIsModified(true);
        setStatus('success');
        
        // If immediate is true, automatically apply
        if (immediate) {
          applyModifications();
        }
      } catch (err) {
        setStatus('error');
        setError('Failed to get recipe modifications');
        console.error('Error requesting modifications:', err);
      }
    }, 1500);
  }, [initialRecipe]);
  
  const applyModifications = useCallback(() => {
    if (!modifications) {
      setError('No modifications to apply');
      return;
    }
    
    setStatus('applying');
    
    // Simulate API call to save modifications
    setTimeout(() => {
      try {
        // Mock successful save
        const newHistoryItem: RecipeModificationHistoryItem = {
          id: `history-${Date.now()}`,
          request: 'Make recipe healthier',
          created_at: new Date().toISOString(),
          status: 'applied'
        };
        
        setModificationHistory(prev => [newHistoryItem, ...prev]);
        
        // Mock version update
        const newVersion: VersionInfo = {
          version_id: `version-${Date.now()}`,
          version_number: (versionHistory.length > 0 ? versionHistory[0].version_number : 0) + 1,
          modification_reason: 'Make recipe healthier',
          modified_at: new Date().toISOString(),
          modified_by: 'user',
          previous_version_id: versionHistory.length > 0 ? versionHistory[0].version_id : null
        };
        
        setVersionHistory(prev => [newVersion, ...prev]);
        setStatus('applied');
        setIsModified(false);
        toast.success('Recipe modifications applied successfully');
      } catch (err) {
        setStatus('error');
        setError('Failed to apply modifications');
        console.error('Error applying modifications:', err);
      }
    }, 1000);
  }, [modifications, versionHistory]);
  
  const rejectModifications = useCallback(() => {
    setStatus('rejected');
    setModifiedRecipe(initialRecipe);
    setModifications(null);
    setIsModified(false);
    
    const newHistoryItem: RecipeModificationHistoryItem = {
      id: `history-${Date.now()}`,
      request: 'Make recipe healthier',
      created_at: new Date().toISOString(),
      status: 'rejected'
    };
    
    setModificationHistory(prev => [newHistoryItem, ...prev]);
    toast.info('Recipe modifications rejected');
  }, [initialRecipe]);
  
  const cancelRequest = useCallback(() => {
    setStatus('idle');
    setModifications(null);
    setModifiedRecipe(initialRecipe);
    setIsModified(false);
    setError(null);
  }, [initialRecipe]);
  
  const resetToOriginal = useCallback(() => {
    setStatus('idle');
    setModifiedRecipe(initialRecipe);
    setModifications(null);
    setIsModified(false);
    setError(null);
    toast.info('Recipe reset to original');
  }, [initialRecipe]);

  return {
    status,
    error,
    modifications,
    modifiedRecipe,
    modificationRequest,
    modificationHistory,
    versionHistory,
    selectedVersionId,
    selectVersion,
    isModified,
    requestModifications,
    applyModifications,
    rejectModifications,
    cancelRequest,
    resetToOriginal
  };
}
