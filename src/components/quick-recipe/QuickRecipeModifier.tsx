
import React, { useState, useCallback, useEffect } from 'react';
import { useRecipeModifications } from '@/hooks/recipe-modifications';
import { QuickRecipe } from '@/types/quick-recipe';
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';
import { useAuthDrawer } from '@/hooks/use-auth-drawer';
import { ModificationRequest } from './modifier/ModificationRequest';
import { ModificationHistory } from './modifier/ModificationHistory';
import { ModifiedRecipeDisplay } from './modifier/ModifiedRecipeDisplay';
import { StatusDisplay } from './modifier/StatusDisplay';
import { AuthOverlay } from './modifier/AuthOverlay';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { authStateManager } from '@/lib/auth/auth-state-manager';
import { VersionSelector } from './modifier/VersionSelector';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QuickRecipeModifierProps {
  recipe: QuickRecipe;
  onModifiedRecipe?: (modifiedRecipe: QuickRecipe) => void;
}

export const QuickRecipeModifier: React.FC<QuickRecipeModifierProps> = ({ recipe, onModifiedRecipe }) => {
  const [request, setRequest] = useState('');
  const [immediate, setImmediate] = useState(false);
  const { session } = useAuth();
  const { open: openAuthDrawer } = useAuthDrawer();
  const { setError } = useQuickRecipeStore();
  
  // Initialize these values to avoid conditional hook calls
  const {
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
  } = useRecipeModifications(recipe);
  
  // Handle auth flow
  const handleLogin = useCallback(() => {
    // Store the modification request for later execution
    authStateManager.queueAction({
      type: 'modify-recipe',
      data: { request, immediate, recipe },
      sourceUrl: window.location.pathname
    });
    
    // Open auth drawer
    openAuthDrawer();
  }, [request, immediate, recipe, openAuthDrawer]);

  // Handle for auth-related errors by reopening the auth drawer
  useEffect(() => {
    if (status === 'not-authenticated') {
      // Save the current state
      authStateManager.queueAction({
        type: 'modify-recipe',
        data: { request, immediate, recipe },
        sourceUrl: window.location.pathname
      });
      
      // Open the auth drawer
      openAuthDrawer();
    }
  }, [status, openAuthDrawer, request, immediate, recipe]);

  // Add a callback to notify parent component when modifications are applied
  const handleApplyModifications = useCallback(() => {
    console.log("handleApplyModifications called");
    console.log("Modified recipe before apply:", modifiedRecipe);
    
    applyModifications();
    
    if (onModifiedRecipe && modifiedRecipe) {
      console.log("Calling onModifiedRecipe with:", modifiedRecipe);
      onModifiedRecipe(modifiedRecipe);
      toast("Modifications Applied", {
        description: "Your recipe modifications have been applied successfully."
      });
    } else {
      console.log("Unable to apply modifications:", { 
        onModifiedRecipe: !!onModifiedRecipe,
        modifiedRecipe: !!modifiedRecipe 
      });
    }
  }, [applyModifications, modifiedRecipe, onModifiedRecipe]);

  // Handle submitting modifications
  const handleRequestModifications = useCallback(() => {
    if (!session) {
      // Store the request for after authentication
      authStateManager.queueAction({
        type: 'modify-recipe',
        data: { request, immediate, recipe },
        sourceUrl: window.location.pathname
      });
      
      openAuthDrawer();
      return;
    }
    
    try {
      console.log("Requesting modifications with:", { request, immediate });
      requestModifications(request, immediate);
    } catch (err: unknown) {
      // Improved error handling with type checking
      if (err instanceof Error) {
        const { message, stack } = err;
        console.error("Error requesting modifications:", message);
        console.debug("Error stack trace:", stack);
        setError(message);
      } else {
        console.error("Unknown error requesting modifications");
        setError("An unknown error occurred while processing your request");
      }
      
      toast.error("Unable to process recipe modifications", {
        description: "Please try again later."
      });
    }
  }, [request, immediate, requestModifications, session, openAuthDrawer, recipe, setError]);

  // If user is not authenticated, show auth overlay
  if (!session) {
    return <AuthOverlay onLogin={handleLogin} />;
  }

  // Display error if there is one
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

  const hasMultipleVersions = versionHistory && versionHistory.length > 1;
  
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

        {/* Version Selector with improved visibility */}
        {versionHistory && versionHistory.length > 0 && (
          <VersionSelector
            versions={versionHistory}
            selectedVersionId={selectedVersionId}
            onSelectVersion={selectVersion}
            currentRecipeId={recipe.id}
          />
        )}
        
        {/* Viewing historical version alert - FIX THE VARIANT HERE */}
        {hasMultipleVersions && selectedVersionId && 
         selectedVersionId !== versionHistory[0].version_id && (
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-700">
              You are viewing a historical version of this recipe. Any modifications will create a new version based on this one.
            </AlertDescription>
          </Alert>
        )}

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
          isHistoricalVersion={hasMultipleVersions && selectedVersionId !== versionHistory[0].version_id}
        />
      </div>
    </div>
  );
};
