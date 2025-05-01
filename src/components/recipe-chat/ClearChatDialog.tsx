
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ButtonWrapper } from '@/components/ui/button-wrapper';

interface ClearChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ClearChatDialog({ open, onOpenChange, onConfirm }: ClearChatDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear Chat History</DialogTitle>
          <DialogDescription>
            This will delete all messages in your conversation. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <ButtonWrapper>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </ButtonWrapper>
          <ButtonWrapper>
            <Button variant="destructive" onClick={handleConfirm}>
              Clear Chat
            </Button>
          </ButtonWrapper>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
