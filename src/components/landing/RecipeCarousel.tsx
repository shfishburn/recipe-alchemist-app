
import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RecipeCard from '@/components/recipes/RecipeCard';
import { Recipe } from '@/types/recipe';
import { transformRecipeData } from '@/utils/recipe-transformers';

export const RecipeCarousel = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  
  // Fetch recipes when component is mounted
  useEffect(() => {
    setShouldFetch(true);
  }, []);
  
  const { data: recipes } = useQuery({
    queryKey: ['featured-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .is('deleted_at', null)
        .limit(6);
        
      if (error) throw error;
      
      // Transform database recipes to Recipe type
      const typedData: Recipe[] = Array.isArray(data) ? 
        data.map((item: any) => transformRecipeData(item)) : [];
      
      return typedData;
    },
    enabled: shouldFetch,
  });
  
  // Function to safely get a slice of recipes
  const getRecipeSlice = () => {
    if (!recipes || !Array.isArray(recipes)) return [];
    return recipes.slice(0, 3); // Just show first 3 recipes
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {getRecipeSlice().map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

// Add a utility function to transform recipe data for this component
export function transformRecipeData(data: any): Recipe {
  // Create a minimal recipe object with just the fields we need for the carousel
  return {
    id: data.id || '',
    title: data.title || 'Unnamed Recipe',
    tagline: data.tagline || '',
    ingredients: [],
    instructions: [],
    image_url: data.image_url,
    cuisine: data.cuisine,
    science_notes: [],
    prep_time_min: data.prep_time_min,
    cook_time_min: data.cook_time_min,
    nutri_score: data.nutri_score
  };
}
