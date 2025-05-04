
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Utensils, BarChart, Beaker, MessageCircle } from 'lucide-react';
import type { Recipe } from '@/types/recipe';
import { useRecipeScience } from '@/hooks/use-recipe-science';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Tab components
import { RecipeTabContent } from './tabs/RecipeTabContent';
import { NutritionTabContent } from './tabs/NutritionTabContent';
import { ScienceTabContent } from './tabs/ScienceTabContent';
import { ModifyTabContent } from './tabs/ModifyTabContent';

interface TabsViewProps {
  recipe: Recipe;
  onRecipeUpdate: (recipe: Recipe) => void;
  refetch: () => void;
}

export function TabsView({ recipe, onRecipeUpdate, refetch }: TabsViewProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useLocalStorage<string>('recipe-active-tab', 'recipe');
  const { hasAnalysisData } = useRecipeScience(recipe);
  const [chatOpen, setChatOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Check if there's a tab hash in the URL
  React.useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash && ['recipe', 'nutrition', 'science', 'modify'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash, setActiveTab]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`#${value}`, { replace: true });
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <div className="touch-friendly-tabs">
        <TabsList className="w-full grid grid-cols-4 mb-6 touch-scroll">
          <TabsTrigger value="recipe" className="flex items-center">
            <Utensils className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Recipe</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Nutrition</span>
          </TabsTrigger>
          <TabsTrigger value="science" className="flex items-center relative">
            <Beaker className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Science</span>
            {hasAnalysisData && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="modify" className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Modify</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="recipe" className="mt-0">
        <RecipeTabContent recipe={recipe} />
      </TabsContent>

      <TabsContent value="nutrition" className="mt-0">
        <NutritionTabContent recipe={recipe} onRecipeUpdate={onRecipeUpdate} />
      </TabsContent>

      <TabsContent value="science" className="mt-0">
        <ScienceTabContent recipe={recipe} onRecipeUpdate={onRecipeUpdate} />
      </TabsContent>

      <TabsContent value="modify" className="mt-0">
        <ModifyTabContent 
          recipe={recipe} 
          chatOpen={chatOpen}
          setChatOpen={setChatOpen}
          refetch={refetch}
        />
      </TabsContent>
    </Tabs>
  );
}
