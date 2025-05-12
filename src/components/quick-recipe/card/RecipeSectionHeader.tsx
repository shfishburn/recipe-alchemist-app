
import React from 'react';
import { UtensilsCrossed, BookOpen } from 'lucide-react';

interface RecipeSectionHeaderProps {
  title: string;
  icon?: string;
  children?: React.ReactNode;
}

export function RecipeSectionHeader({ title, icon, children }: RecipeSectionHeaderProps) {
  return (
    <h3 className="flex items-center gap-2 font-medium text-lg mb-2">
      {icon === 'ingredients' && (
        <UtensilsCrossed className="h-5 w-5 text-recipe-green" />
      )}
      {icon === 'instructions' && (
        <BookOpen className="h-5 w-5 text-recipe-blue" />
      )}
      {!icon && (
        <span className="bg-recipe-green h-5 w-5 rounded-full flex items-center justify-center text-white text-xs">•</span>
      )}
      {title}
      {children}
    </h3>
  );
}
