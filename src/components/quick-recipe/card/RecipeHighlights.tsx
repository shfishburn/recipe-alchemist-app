
import React from 'react';
import { LightbulbIcon } from 'lucide-react';

interface RecipeHighlightsProps {
  highlights?: string[]; // Added highlights prop
  cuisine?: string[] | string;
  dietary?: string[] | string;
  flavors?: string[];
  nutritionHighlight?: string;
  cookingTip?: string;
}

export function RecipeHighlights({ 
  highlights, 
  cuisine, 
  dietary, 
  flavors,
  nutritionHighlight, 
  cookingTip 
}: RecipeHighlightsProps) {
  // Display any highlights if available
  const hasHighlights = highlights && highlights.length > 0;
  
  // Add tags from cuisine, dietary, and flavors
  const tags = [
    ...(Array.isArray(cuisine) ? cuisine : cuisine ? [cuisine] : []),
    ...(Array.isArray(dietary) ? dietary : dietary ? [dietary] : []),
    ...(flavors || [])
  ].filter(Boolean);
  
  return (
    <div className="space-y-4 my-6">
      {/* Recipe Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-slate-100 rounded-md text-xs text-slate-700">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Highlights */}
      {hasHighlights && (
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-sm font-medium mb-1">Recipe Highlights</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Nutrition Highlight and Cooking Tip */}
      <div className="flex flex-col sm:flex-row gap-3">
        {nutritionHighlight && (
          <div className="bg-slate-50 p-3 rounded-lg flex-1">
            <p className="text-sm font-medium">Nutrition Highlight</p>
            <p className="text-sm text-muted-foreground">{nutritionHighlight}</p>
          </div>
        )}
        {cookingTip && (
          <div className="bg-recipe-orange/10 p-3 rounded-lg flex-1">
            <p className="text-sm font-medium flex items-center gap-1">
              <LightbulbIcon className="h-4 w-4 text-recipe-orange" />
              Cooking Tip
            </p>
            <p className="text-sm text-muted-foreground">{cookingTip}</p>
          </div>
        )}
      </div>
    </div>
  );
}
