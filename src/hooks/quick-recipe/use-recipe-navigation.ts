
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { toast } from '@/hooks/use-toast';

export function useRecipeNavigation() {
  const navigate = useNavigate();
  const { reset } = useQuickRecipeStore();
  
  const handleCancel = useCallback(() => {
    console.log("Handling cancel in useRecipeNavigation");
    
    // Reset the store state
    reset();
    
    // Navigate back to home
    navigate('/');
    
    // Show toast informing the user
    toast({
      title: "Recipe generation cancelled",
      description: "You can try again with new ingredients anytime.",
    });
  }, [reset, navigate]);

  return {
    navigate,
    handleCancel
  };
}
