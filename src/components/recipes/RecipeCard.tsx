
import React from 'react';
import { Link } from 'react-router-dom';
import type { Recipe } from '@/types/recipe';
import { Card, CardContent } from "@/components/ui/card";
import { ImageLoader } from '@/components/ui/image-loader';
import { PlaceholderImage } from '@/components/recipe-detail/recipe-image/PlaceholderImage';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  // Generate URL using the slug if available, otherwise fallback to id
  const recipeUrl = recipe.slug 
    ? `/recipes/${recipe.slug}` 
    : `/recipes/${recipe.id}`;
  
  return (
    <Link 
      to={recipeUrl}
      className="group flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:border-primary/40 transition-all duration-300 hover:shadow-md dark:border-gray-800"
    >
      <div className="relative aspect-video overflow-hidden">
        {recipe.image_url ? (
          <ImageLoader
            src={recipe.image_url}
            alt={recipe.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <PlaceholderImage 
            hasError={false} 
            variant="card" 
            title={recipe.title}
          />
        )}
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
