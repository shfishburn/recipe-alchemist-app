
import { useLocation } from 'react-router-dom';
import { QuickRecipeFormData } from '@/types/quick-recipe';

export function useSessionStorage() {
  const location = useLocation();
  
  // Save generation data to session storage (for resuming after login)
  const saveGenerationData = (formData: QuickRecipeFormData) => {
    sessionStorage.setItem('recipeGenerationSource', JSON.stringify({
      path: location.pathname,
      formData: formData
    }));
  };
  
  // Get generation data from session storage
  const getGenerationData = () => {
    const storedData = sessionStorage.getItem('recipeGenerationSource');
    if (!storedData) return null;
    
    try {
      return JSON.parse(storedData);
    } catch (err) {
      console.error("Error parsing stored recipe data:", err);
      return null;
    }
  };
  
  // Clear generation data from session storage
  const clearGenerationData = () => {
    sessionStorage.removeItem('recipeGenerationSource');
  };
  
  return {
    location,
    saveGenerationData,
    getGenerationData,
    clearGenerationData
  };
}
