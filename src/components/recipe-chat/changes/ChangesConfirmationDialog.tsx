
import React from 'react';
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
  if (!changes) return null;
  
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    onConfirm();
  };
  
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => {
      if (isApplying && !isOpen) return; // Prevent closing while applying
      onOpenChange(isOpen);
    }}>
      <AlertDialogContent className="max-w-lg" style={{ zIndex: 55 }}>
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
          <AlertDialogCancel disabled={isApplying}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isApplying}
            className="bg-primary text-white"
          >
            {isApplying ? (
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
