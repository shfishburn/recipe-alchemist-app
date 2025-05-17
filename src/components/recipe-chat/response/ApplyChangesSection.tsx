
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import type { ChangesResponse, SuggestedChanges } from '@/types/chat';
import { ChangesSummary } from '../changes/ChangesSummary';

interface ApplyChangesSectionProps {
  changesSuggested: ChangesResponse | SuggestedChanges | null;
  onApplyChanges: () => void;
  isApplying: boolean;
  applied: boolean;
  isMobile?: boolean;
}

export function ApplyChangesSection({ 
  changesSuggested, 
  onApplyChanges, 
  isApplying, 
  applied, 
  isMobile = false 
}: ApplyChangesSectionProps) {
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applyTimeout, setApplyTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [forceReset, setForceReset] = useState(false);

  // Safety mechanism: automatically clear "applying" state after 15 seconds
  useEffect(() => {
    if (isApplying) {
      console.log("Starting apply timeout monitoring");
      const timeout = setTimeout(() => {
        console.warn("Apply changes operation timed out - forcing UI refresh");
        // This will force the UI to reset if the apply operation takes too long
        setForceReset(true);
        
        // Show an error to the user
        setApplyError("Operation timed out. Please try again.");
      }, 15000);
      
      setApplyTimeout(timeout);
    } else if (applyTimeout) {
      console.log("Clearing apply timeout monitoring");
      clearTimeout(applyTimeout);
      setApplyTimeout(null);
    }
    
    return () => {
      if (applyTimeout) clearTimeout(applyTimeout);
    };
  }, [isApplying]);
  
  // Reset the forced reset flag when isApplying changes
  useEffect(() => {
    if (!isApplying && forceReset) {
      setForceReset(false);
    }
  }, [isApplying]);

  if (!changesSuggested) return null;

  // Convert any ChangesResponse to SuggestedChanges
  const changes = changesSuggested as SuggestedChanges;

  // Check if there are substantive changes to apply
  const hasTitle = !!changes.title;
  const hasInstructions = Array.isArray(changes.instructions) && 
                        changes.instructions.length > 0;
  const hasIngredients = changes.ingredients?.mode !== 'none' && 
                       Array.isArray(changes.ingredients?.items) && 
                       changes.ingredients?.items.length > 0;
  const hasScienceNotes = Array.isArray(changes.science_notes) && 
                        changes.science_notes.length > 0;
                        
  const hasChanges = hasTitle || hasInstructions || hasIngredients || hasScienceNotes;

  const handleApplyChanges = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setApplyError(null); // Reset any previous errors
    
    try {
      // Enhanced validation before applying changes
      if (!changes) {
        setApplyError("No changes to apply. The AI didn't suggest any modifications.");
        return;
      }
      
      if (!hasChanges) {
        setApplyError("No substantive changes to apply. The AI didn't suggest any specific modifications.");
        return;
      }
      
      // Call the apply changes function
      onApplyChanges();
      
    } catch (error) {
      console.error("Error applying changes:", error);
      setApplyError(error instanceof Error ? error.message : "Failed to apply changes. Please try again.");
    }
  };

  // Determine if we should show the apply button as disabled
  // Force the button to be enabled if we're in a forced reset state
  const isButtonDisabled = (isApplying && !forceReset) || applied || !hasChanges;

  return (
    <div className="mt-2 sm:mt-4 relative" style={{ zIndex: 10 }}>
      {applyError && (
        <Alert variant="destructive" className="mb-2 sm:mb-4 text-xs sm:text-sm">
          <Info className="h-3 w-3 sm:h-4 sm:w-4" />
          <AlertTitle className="text-xs sm:text-sm">Error</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">{applyError}</AlertDescription>
        </Alert>
      )}
      
      {hasChanges && !applied && (
        <ChangesSummary changes={changes} isMobile={isMobile} />
      )}
      
      <Button
        id="apply-changes-button"
        onClick={handleApplyChanges}
        disabled={isButtonDisabled}
        className={`${
          applied ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'
        } text-white text-xs sm:text-sm h-7 sm:h-9 mt-2 ${
          isApplying ? 'opacity-70' : ''
        }`}
        style={{ zIndex: 10 }}
        size={isMobile ? "sm" : "default"}
      >
        {isApplying && !forceReset ? (
          <>
            <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            Applying...
          </>
        ) : applied ? (
          <>
            <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Applied
          </>
        ) : (
          'Apply Changes'
        )}
      </Button>
    </div>
  );
}
