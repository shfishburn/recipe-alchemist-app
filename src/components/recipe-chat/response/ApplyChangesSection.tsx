
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';
import { ChangesConfirmationDialog } from '../changes/ChangesConfirmationDialog';
import { ChangesSummary } from '../changes/ChangesSummary';
import type { ChangesResponse } from '@/types/chat';

interface ApplyChangesSectionProps {
  changes: ChangesResponse | null;
  onApplyChanges: () => Promise<boolean>;
  isApplying: boolean;
  applied: boolean;
}

export function ApplyChangesSection({
  changes,
  onApplyChanges,
  isApplying,
  applied
}: ApplyChangesSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [applyTimeout, setApplyTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // If there are no changes or they've already been applied, don't show
  if (!changes || applied) {
    return null;
  }
  
  // Set up timeout monitoring for the apply operation
  useEffect(() => {
    if (isApplying && !applyTimeout) {
      console.log("Starting apply timeout monitoring");
      
      // Set a timeout to detect stuck operations
      const timeout = setTimeout(() => {
        console.warn("Apply changes operation is taking too long");
        // We don't automatically cancel since the operation might still succeed
      }, 15000); // 15 second timeout
      
      setApplyTimeout(timeout);
    } else if (!isApplying && applyTimeout) {
      console.log("Clearing apply timeout monitoring");
      clearTimeout(applyTimeout);
      setApplyTimeout(null);
    }
    
    return () => {
      if (applyTimeout) {
        clearTimeout(applyTimeout);
      }
    };
  }, [isApplying]);
  
  // Check if changes are substantial enough to show confirmation
  const hasSubstantialChanges = () => {
    return (
      !!changes.title ||
      !!changes.description ||
      !!changes.tagline ||
      (changes.ingredients?.mode !== 'none' && 
       Array.isArray(changes.ingredients?.items) && 
       changes.ingredients?.items.length > 0) ||
      (Array.isArray(changes.instructions) && changes.instructions.length > 0)
    );
  };
  
  // Handler for apply button
  const handleApplyClick = () => {
    if (hasSubstantialChanges()) {
      // For substantial changes, show confirmation dialog
      setIsOpen(true);
    } else {
      // For minor changes, apply directly
      handleConfirmApply();
    }
  };
  
  // Handler for confirmed apply
  const handleConfirmApply = async () => {
    setIsOpen(false);
    await onApplyChanges();
  };

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Recipe Updates Suggested</h3>
      
      {/* Show changes summary */}
      {changes && <ChangesSummary changes={changes} />}
      
      {/* Apply button */}
      <div className="flex justify-end mt-2">
        <Button
          variant="default"
          onClick={handleApplyClick}
          disabled={isApplying}
          className="gap-2"
        >
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Apply Changes
            </>
          )}
        </Button>
      </div>
      
      {/* Confirmation dialog */}
      <ChangesConfirmationDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleConfirmApply}
        changes={changes}
      />
    </div>
  );
}
