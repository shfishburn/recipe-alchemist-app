
import React from 'react';
import QuickRecipeTagForm from './QuickRecipeTagForm';
import { useQuickRecipeForm } from '@/hooks/use-quick-recipe-form';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useQuickRecipeStore } from '@/store/use-quick-recipe-store';
import { Cake, ChefHat, Egg } from 'lucide-react';

export function QuickRecipeFormContainer() {
  const { handleSubmit } = useQuickRecipeForm();
  const { isLoading } = useQuickRecipeStore();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "relative overflow-hidden",
      isMobile ? "px-1" : "px-2"
    )}>
      {/* Enhanced decorative elements with more interesting visual design */}
      <div className="absolute -top-8 -left-8 w-20 h-20 md:w-32 md:h-32 bg-recipe-green/20 rounded-full blur-md z-0 animate-pulse"></div>
      <div className="absolute -bottom-10 -right-10 w-24 h-24 md:w-40 md:h-40 bg-recipe-orange/20 rounded-full blur-md z-0 animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 -right-20 w-16 h-16 md:w-24 md:h-24 bg-recipe-blue/15 rounded-full blur-md z-0 animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      
      <Card className="relative z-10 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg p-4 md:p-6 rounded-xl">
        <div className="text-center mb-5 md:mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="flex flex-row -space-x-2">
              <div className="bg-recipe-green/20 p-2 rounded-full">
                <ChefHat size={24} className="text-recipe-green" />
              </div>
              <div className="bg-recipe-blue/20 p-2 rounded-full">
                <Egg size={24} className="text-recipe-blue" />
              </div>
              <div className="bg-recipe-orange/20 p-2 rounded-full">
                <Cake size={24} className="text-recipe-orange" />
              </div>
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-recipe-blue to-recipe-green bg-clip-text text-transparent">
            Create Your Perfect Recipe
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Tell us what ingredients you have and we'll do the rest!
          </p>
        </div>
      
        <QuickRecipeTagForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  );
}
