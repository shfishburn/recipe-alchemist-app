
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

/**
 * @deprecated This page is deprecated and redirects to QuickRecipe.
 * All recipe creation functionality has been consolidated into the QuickRecipe feature.
 */
const Build = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Show a toast notification about the redirect
    toast({
      title: "Recipe Builder Updated",
      description: "You've been redirected to our new and improved recipe creator.",
    });
    
    // Redirect to QuickRecipe page
    navigate('/quick-recipe', { replace: true });
  }, [navigate, toast]);

  // This component will never render anything as it immediately redirects
  return null;
};

export default Build;
