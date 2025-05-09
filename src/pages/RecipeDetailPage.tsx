
import React from 'react';
import { useParams } from 'react-router-dom';

export function RecipeDetailPage() {
  const { idOrSlug } = useParams();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Recipe Detail</h1>
      <p>Recipe ID: {idOrSlug}</p>
    </div>
  );
}
