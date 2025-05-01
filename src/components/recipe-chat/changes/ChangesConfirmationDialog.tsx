
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
  
  // Use effect to debounce the applying state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLocalApplying(isApplying);
    }, 100); // Small debounce to prevent flashing
    
    return () => clearTimeout(timer);
  }, [isApplying]);
  
  if (!changes) return null;
  
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Set local applying immediately for better UX
    setIsLocalApplying(true);
    onConfirm();
  };
  
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      if (isLocalApplying && !isOpen) return; // Prevent closing while applying
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
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLocalApplying}>Cancel</AlertDialogCancel>
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
