
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Utensils, BarChart, Beaker, MessageCircle, Settings } from 'lucide-react';
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
import { UtilitiesTabContent } from './tabs/UtilitiesTabContent';

interface TabsViewProps {
  recipe: Recipe;
  onRecipeUpdate: (recipe: Recipe) => void;
  refetch: () => void;
  onTabChange?: (tab: string) => void;
}

export function TabsView({ recipe, onRecipeUpdate, refetch, onTabChange }: TabsViewProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useLocalStorage<string>('recipe-active-tab', 'recipe');
  const { hasAnalysisData } = useRecipeScience(recipe);
  const [chatOpen, setChatOpen] = React.useState(false);
  const isMobile = useIsMobile();

  // Extract hash from URL
  React.useEffect(() => {
    const hash = location.hash.slice(1);
    if (hash && ['recipe', 'nutrition', 'science', 'modify', 'utilities'].includes(hash)) {
      setActiveTab(hash);
      // Notify parent of tab change
      if (onTabChange) {
        onTabChange(hash);
      }
    }
  }, [location.hash, setActiveTab, onTabChange]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`#${value}`, { replace: true });
    
    // Notify parent of tab change
    if (onTabChange) {
      onTabChange(value);
    }
  };

  const tabItems = [
    { value: 'recipe', icon: <Utensils className="h-4 w-4 mr-2" />, label: 'Recipe' },
    { value: 'nutrition', icon: <BarChart className="h-4 w-4 mr-2" />, label: 'Nutrition' },
    { value: 'science', icon: <Beaker className="h-4 w-4 mr-2" />, label: 'Science', highlight: hasAnalysisData },
    { value: 'modify', icon: <MessageCircle className="h-4 w-4 mr-2" />, label: 'Modify' },
    { value: 'utilities', icon: <Settings className="h-4 w-4 mr-2" />, label: 'Utilities' }
  ];

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <div className="touch-friendly-tabs">
        <TabsList className="w-full grid grid-cols-5 mb-6 touch-scroll">
          {tabItems.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center relative">
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.highlight && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              )}
            </TabsTrigger>
          ))}
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
      
      <TabsContent value="utilities" className="mt-0">
        <UtilitiesTabContent recipe={recipe} />
      </TabsContent>
    </Tabs>
  );
}
