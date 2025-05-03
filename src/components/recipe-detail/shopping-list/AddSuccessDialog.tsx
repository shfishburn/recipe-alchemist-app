
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AddSuccessDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipeTitle: string;
}

export function AddSuccessDialog({ open, setOpen, recipeTitle }: AddSuccessDialogProps) {
  const navigate = useNavigate();
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">Added to Shopping List</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 text-center">
          <p className="text-muted-foreground">
            The ingredients for <span className="font-medium text-foreground">{recipeTitle}</span> have been added to your shopping list successfully.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Continue Browsing
          </Button>
          <Button 
            className="flex-1 gap-2"
            onClick={() => {
              setOpen(false);
              navigate('/shopping-lists');
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            View Shopping Lists
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
