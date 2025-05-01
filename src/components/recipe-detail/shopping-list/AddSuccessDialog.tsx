
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';

interface AddSuccessDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  recipeTitle: string;
}

export function AddSuccessDialog({ open, setOpen, recipeTitle }: AddSuccessDialogProps) {
  const navigate = useNavigate();

  const handleViewList = () => {
    setOpen(false);
    
    // Navigate to the shopping lists page without a specific ID
    navigate('/shopping-lists');
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            Added to Shopping List
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ingredients from "{recipeTitle}" have been successfully added to your shopping list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay on Recipe</AlertDialogCancel>
          <AlertDialogAction onClick={handleViewList} className="gap-2 flex items-center">
            View Shopping Lists
            <ArrowRight className="h-4 w-4" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
