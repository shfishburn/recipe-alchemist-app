
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import type { ChangesResponse } from '@/types/chat';
import { ChangesSummary } from '../changes/ChangesSummary';
import { ChangesConfirmationDialog } from '../changes/ChangesConfirmationDialog';

interface ApplyChangesSectionProps {
  changesSuggested: ChangesResponse | null;
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
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [applyTimeout, setApplyTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Safety mechanism: automatically clear "applying" state after 15 seconds
  // to prevent UI from being stuck in applying state indefinitely
  useEffect(() => {
    if (isApplying) {
      const timeout = setTimeout(() => {
        console.warn("Apply changes operation timed out - forcing UI refresh");
        // This will force the UI to reset if the apply operation takes too long
        const applyButton = document.getElementById('apply-changes-button');
        if (applyButton) {
          applyButton.classList.remove('animate-pulse');
          applyButton.querySelector('.animate-spin')?.classList.remove('animate-spin');
        }
      }, 15000);
      
      setApplyTimeout(timeout);
    } else if (applyTimeout) {
      clearTimeout(applyTimeout);
      setApplyTimeout(null);
    }
    
    return () => {
      if (applyTimeout) clearTimeout(applyTimeout);
    };
  }, [isApplying]);

  if (!changesSuggested) return null;

  // Check if there are substantive changes to apply
  const hasTitle = !!changesSuggested.title;
  const hasInstructions = Array.isArray(changesSuggested.instructions) && 
                        changesSuggested.instructions.length > 0;
  const hasIngredients = changesSuggested.ingredients?.mode !== 'none' && 
                       Array.isArray(changesSuggested.ingredients?.items) && 
                       changesSuggested.ingredients?.items.length > 0;
  const hasScienceNotes = Array.isArray(changesSuggested.science_notes) && 
                        changesSuggested.science_notes.length > 0;
                        
  const hasChanges = hasTitle || hasInstructions || hasIngredients || hasScienceNotes;

  const handleApplyChanges = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setApplyError(null); // Reset any previous errors
    
    try {
      // Enhanced validation before opening confirmation dialog
      if (!changesSuggested) {
        setApplyError("No changes to apply. The AI didn't suggest any modifications.");
        return;
      }
      
      if (!hasChanges) {
        setApplyError("No substantive changes to apply. The AI didn't suggest any specific modifications.");
        return;
      }
      
      // Open the confirmation dialog
      setConfirmationOpen(true);
      
    } catch (error) {
      console.error("Error preparing to apply changes:", error);
      setApplyError(error instanceof Error ? error.message : "Failed to apply changes. Please try again.");
    }
  };
  
  const handleConfirmApply = () => {
    try {
      onApplyChanges();
      setConfirmationOpen(false);
    } catch (error) {
      console.error("Error during apply changes:", error);
      setApplyError(error instanceof Error ? error.message : "An unexpected error occurred while applying changes.");
      setConfirmationOpen(false);
    }
  };

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
        <ChangesSummary changes={changesSuggested} isMobile={isMobile} />
      )}
      
      <Button
        id="apply-changes-button"
        onClick={handleApplyChanges}
        disabled={isApplying || applied || !hasChanges}
        className={`${
          applied ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'
        } text-white text-xs sm:text-sm h-7 sm:h-9 mt-2`}
        style={{ zIndex: 10 }}
        size={isMobile ? "sm" : "default"}
      >
        {isApplying ? (
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
      
      <ChangesConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        onConfirm={handleConfirmApply}
        changes={changesSuggested}
        isApplying={isApplying}
      />
    </div>
  );
}
