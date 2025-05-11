
import React, { useState, useCallback, useEffect } from 'react';
import { useRecipeModifications } from '@/hooks/recipe-modifications';
import { QuickRecipe } from '@/types/quick-recipe';
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { getStoredModificationRequest, saveModificationRequest } from '@/hooks/recipe-modifications/storage-utils';
import { ModificationRequest } from './modifier/ModificationRequest';
import { ModificationHistory } from './modifier/ModificationHistory';
import { ModifiedRecipeDisplay } from './modifier/ModifiedRecipeDisplay';
import { StatusDisplay } from './modifier/StatusDisplay';
import { AuthOverlay } from './modifier/AuthOverlay';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';

interface QuickRecipeModifierProps {
  recipe: QuickRecipe;
  onModifiedRecipe?: (modifiedRecipe: QuickRecipe) => void;
}

export const QuickRecipeModifier: React.FC<QuickRecipeModifierProps> = ({ recipe, onModifiedRecipe }) => {
  const [request, setRequest] = useState('');
  const [immediate, setImmediate] = useState(false);
  const [edgeFunctionError, setEdgeFunctionError] = useState<Error | null>(null);
  const { session } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  const { setError } = useQuickRecipeStore();
  
  // Check for saved request in localStorage
  useEffect(() => {
    const savedRequest = getStoredModificationRequest();
    if (savedRequest) {
      setRequest(savedRequest.request);
      setImmediate(savedRequest.immediate);
    }
  }, []);

  // Handle auth flow
  const handleLogin = () => {
    saveModificationRequest(request, immediate);
    openAuthDrawer();
  };

  // If user is not authenticated, show auth overlay
  if (!session) {
    return <AuthOverlay onLogin={handleLogin} />;
  }

  const {
    status,
    error,
    modifications,
    modifiedRecipe,
    modificationRequest,
    modificationHistory,
    isModified,
    requestModifications,
    applyModifications,
    rejectModifications,
    cancelRequest,
    resetToOriginal
  } = useRecipeModifications(recipe);

  // REMOVED: Edge function error detection logic

  // Handle for auth-related errors by reopening the auth drawer
  useEffect(() => {
    if (status === 'not-authenticated') {
      // Save the current state
      saveModificationRequest(request, immediate);
      // Open the auth drawer
      openAuthDrawer();
    }
  }, [status, openAuthDrawer, request, immediate]);

  // Add a callback to notify parent component when modifications are applied
  const handleApplyModifications = useCallback(() => {
    applyModifications();
    if (onModifiedRecipe && modifiedRecipe) {
      onModifiedRecipe(modifiedRecipe);
      toast("Modifications Applied", {
        description: "Your recipe modifications have been applied successfully."
      });
    }
  }, [applyModifications, modifiedRecipe, onModifiedRecipe]);

  // Handle submitting modifications
  const handleRequestModifications = useCallback(() => {
    if (!session) {
      saveModificationRequest(request, immediate);
      openAuthDrawer();
      return;
    }
    
    try {
      requestModifications(request, immediate);
    } catch (err: any) {
      console.error("Error requesting modifications:", err);
      // Simplified error handling - just log the error
      toast.error("Unable to process recipe modifications", {
        description: "Please try again later."
      });
    }
  }, [request, immediate, requestModifications, session, openAuthDrawer]);

  // SIMPLIFIED: Error display - only show regular error state, not special edge function error
  if (error) {
    return (
      <div className="space-y-6">
        <ErrorDisplay
          error={error}
          title="Recipe Modification Error"
          variant="destructive"
          onRetry={() => {
            cancelRequest();
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Request Input and Controls */}
      <div className="space-y-4">
        <ModificationRequest 
          request={request}
          setRequest={setRequest}
          immediate={immediate}
          setImmediate={setImmediate}
          status={status}
          onRequestModifications={handleRequestModifications}
          onCancelRequest={cancelRequest}
        />

        {/* Status and Error Display */}
        <StatusDisplay status={status} error={error} />

        {/* Modification History */}
        <ModificationHistory historyItems={modificationHistory} />
      </div>

      {/* Recipe Display and Modification Controls */}
      <div className="space-y-4">
        <ModifiedRecipeDisplay
          modifiedRecipe={modifiedRecipe}
          modifications={modifications}
          status={status}
          onApplyModifications={handleApplyModifications}
          onRejectModifications={rejectModifications}
          onResetToOriginal={resetToOriginal}
        />
      </div>
    </div>
  );
};
