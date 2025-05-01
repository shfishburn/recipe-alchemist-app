
import React from 'react';
import { QuickRecipeTagForm } from './QuickRecipeTagForm';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function QuickRecipeFormContainer() {
  const { handleSubmit, isLoading } = useQuickRecipeForm();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "relative overflow-hidden",
      isMobile ? "px-1" : "px-2"
    )}>
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-recipe-green/10 rounded-full blur-md z-0"></div>
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-recipe-orange/10 rounded-full blur-md z-0"></div>
      
      <Card className="relative z-10 bg-white/80 backdrop-blur-sm border-0 shadow-md p-4 md:p-6 rounded-xl">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gradient bg-gradient-to-r from-recipe-blue to-recipe-green">
            Create Your Perfect Recipe
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Tell us what you have and we'll do the rest!
          </p>
        </div>
      
        <QuickRecipeTagForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  );
}
