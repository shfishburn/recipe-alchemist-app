
import React from 'react';
import { useLocation } from "react-router-dom";
import { useQuickRecipeStore } from "@/store/use-quick-recipe-store";
import { Footer } from "@/components/ui/footer";

export const FooterWrapper = () => {
  const { isLoading } = useQuickRecipeStore();
  const location = useLocation();
  
  // Don't render footer on the quick recipe page when loading
  if (location.pathname === '/quick-recipe' && isLoading) {
    return null;
  }
  
  return <Footer />;
};
