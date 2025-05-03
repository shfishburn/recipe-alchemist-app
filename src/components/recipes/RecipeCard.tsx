import React from 'react';
import { Link } from 'react-router-dom';
import { generateSlug } from '@/utils/slug-utils';
import type { Recipe } from '@/types/recipe';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageLoader } from '@/components/ui/image-loader';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  // Generate slug URL
  const recipeSlug = generateSlug(recipe.title);
  const recipeUrl = `/recipes/${recipeSlug}-${recipe.id}`;
  
  return (
    <Link 
      to={recipeUrl}
      className="group flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:border-primary/40 transition-all duration-300 hover:shadow-md dark:border-gray-800"
    >
      <div className="relative aspect-video overflow-hidden">
        <ImageLoader
          src={recipe.image_url || '/placeholder.svg'}
          alt={recipe.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
          {recipe.tagline || recipe.description}
        </p>
      </div>
    </Link>
  );
}
