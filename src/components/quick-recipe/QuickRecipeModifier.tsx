
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

  // Add error handling for edge function failures
  useEffect(() => {
    if (error && (
      error.message?.includes('Failed to send a request to the Edge Function') || 
      error.message?.includes('Edge Function') ||
      error.message?.includes('FunctionsFetchError')
    )) {
      console.error("Edge Function Error detected:", error);
      setEdgeFunctionError(new Error("The recipe modification service is currently unavailable. Our team has been notified."));
    }
  }, [error]);

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
      setEdgeFunctionError(err);
      // Show friendly error toast
      toast.error("Unable to connect to recipe service", {
        description: "Our AI modification service is temporarily unavailable. Please try again later."
      });
    }
  }, [request, immediate, requestModifications, session, openAuthDrawer]);

  // If there's an edge function error, show a dedicated error state
  if (edgeFunctionError) {
    return (
      <div className="space-y-6">
        <ErrorDisplay
          error={edgeFunctionError}
          title="Recipe Modification Unavailable"
          variant="destructive"
          onRetry={() => {
            setEdgeFunctionError(null);
            // Try to clear the error state
            cancelRequest();
          }}
        />
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-sm">
          <p className="font-medium mb-2">You can still use the recipe as is:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Check out the recipe in the "Recipe" tab</li>
            <li>Try generating a new recipe if needed</li>
            <li>Our team has been notified of this issue</li>
          </ul>
        </div>
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
