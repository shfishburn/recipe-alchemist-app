
import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import type { ChangesResponse } from '@/types/chat';
import { ChangesSummary } from './ChangesSummary';

interface ChangesConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  changes: ChangesResponse | null;
  isApplying: boolean;
}

export function ChangesConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  changes,
  isApplying,
}: ChangesConfirmationDialogProps) {
  // Use local state to debounce the isApplying state
  const [isLocalApplying, setIsLocalApplying] = useState(isApplying);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  
  // Use effect to debounce the applying state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLocalApplying(isApplying);
    }, 100); // Small debounce to prevent flashing
    
    return () => clearTimeout(timer);
  }, [isApplying]);
  
  // Set a timeout to detect if the dialog is stuck
  useEffect(() => {
    let stuckTimer: number | undefined;
    
    if (isLocalApplying) {
      stuckTimer = setTimeout(() => {
        setIsStuck(true);
      }, 8000) as unknown as number; // If applying takes more than 8 seconds, consider it stuck
    } else {
      setIsStuck(false);
    }
    
    return () => {
      if (stuckTimer) clearTimeout(stuckTimer);
    };
  }, [isLocalApplying]);
  
  // Clear any error when the dialog opens/closes
  useEffect(() => {
    if (!open) {
      setApplyError(null);
      setIsStuck(false);
    }
  }, [open]);
  
  if (!changes) return null;
  
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Set local applying immediately for better UX
    setIsLocalApplying(true);
    setApplyError(null);
    setIsStuck(false);
    
    // Add error handling around the confirm action
    try {
      onConfirm();
    } catch (error) {
      console.error("Error in confirmation dialog when applying changes:", error);
      setApplyError(error instanceof Error ? error.message : "Failed to apply changes");
      setIsLocalApplying(false);
    }
  };
  
  const handleForceClose = () => {
    setIsLocalApplying(false);
    setIsStuck(false);
    onOpenChange(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      // Allow force closing if stuck
      if (isLocalApplying && !isOpen && !isStuck) return; 
      onOpenChange(isOpen);
    }}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Recipe Changes</AlertDialogTitle>
          <AlertDialogDescription>
            Review the following changes that will be applied to your recipe.
            These changes cannot be automatically undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-2">
          <ChangesSummary changes={changes} />
        </div>
        
        {applyError && (
          <div className="mb-4 px-4 py-3 border border-red-200 bg-red-50 text-red-700 rounded-md text-sm">
            {applyError}
          </div>
        )}
        
        {isStuck && (
          <div className="mb-4 px-4 py-3 border border-amber-200 bg-amber-50 text-amber-700 rounded-md text-sm">
            It's taking longer than expected. You can force close this dialog and try again later.
          </div>
        )}
        
        <AlertDialogFooter>
          {isStuck ? (
            <AlertDialogCancel onClick={handleForceClose}>Force Close</AlertDialogCancel>
          ) : (
            <AlertDialogCancel disabled={isLocalApplying && !isStuck}>Cancel</AlertDialogCancel>
          )}
          
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isLocalApplying}
            className={`bg-primary text-white transition-opacity duration-300 ${isLocalApplying ? "opacity-70" : "opacity-100"}`}
          >
            {isLocalApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : 'Apply Changes'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
