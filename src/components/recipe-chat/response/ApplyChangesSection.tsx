
import React, { useState } from 'react';
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

  const handleApplyChanges = () => {
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
    onApplyChanges();
    setConfirmationOpen(false);
  };

  return (
    <div className="mt-2 sm:mt-4">
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
        onClick={handleApplyChanges}
        disabled={isApplying || applied || !hasChanges}
        className={`${
          applied ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'
        } text-white text-xs sm:text-sm h-7 sm:h-9 mt-2`}
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
