
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ChangesSummary } from './ChangesSummary';
import type { ChangesResponse } from '@/types/chat';

export interface ChangesConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  changes: ChangesResponse;
  isApplying?: boolean;
}

export function ChangesConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  changes,
  isApplying = false
}: ChangesConfirmationDialogProps) {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply changes to recipe?</DialogTitle>
          <DialogDescription>
            The following changes will be applied:
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ChangesSummary changes={changes} />
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isApplying}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isApplying}
          >
            {isApplying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
