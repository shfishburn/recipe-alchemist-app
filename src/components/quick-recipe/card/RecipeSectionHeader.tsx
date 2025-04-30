
import React from 'react';

interface RecipeSectionHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function RecipeSectionHeader({ title, children }: RecipeSectionHeaderProps) {
  return (
    <h3 className="flex items-center gap-2 font-medium text-lg mb-2">
      <span className="bg-recipe-green h-5 w-5 rounded-full flex items-center justify-center text-white text-xs">•</span>
      {title}
      {children}
    </h3>
  );
}
