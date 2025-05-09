
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartPie, Activity } from 'lucide-react';
import { 
  macroDistributionData, 
  carbsData, 
  fatsData 
} from './nutrition/nutrition-sample-data';
import { MacroCarouselItem } from './nutrition/MacroCarouselItem';
import { MacroLegend } from './nutrition/MacroLegend';
import { Carousel, type CarouselItem } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

interface NutritionPreviewProps {
  isLoading?: boolean;
}

export function NutritionPreview({ isLoading = false }: NutritionPreviewProps) {
  const isMobile = useIsMobile();
  
  // Memoize carousel items to prevent unnecessary re-renders
  const carouselItems: CarouselItem[] = useMemo(() => 
    macroDistributionData.map((item, index) => ({
      id: index,
      content: item,
    })), []);

  // Render function for carousel items
  const renderCarouselItem = (item: CarouselItem) => {
    const macroItem = item.content as typeof macroDistributionData[0];
    return (
      <MacroCarouselItem 
        item={macroItem} 
        carbsData={carbsData} 
        fatsData={fatsData}
      />
    );
  };

  // Empty state content when no data is available
  const renderEmptyState = () => (
    <div className="carousel-empty-state" role="status">
      <p className="text-muted-foreground">No nutrition data available yet.</p>
      <p className="text-sm mt-2">Complete your profile to see personalized nutrition insights.</p>
    </div>
  );

  // Loading state with skeletons
  const renderLoadingState = () => (
    <div className="w-full py-8">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full">
        <Skeleton className="h-[180px] md:h-[220px] w-full rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-6 md:mb-8 w-full">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <ChartPie className="h-5 w-5 text-recipe-purple" />
          <Activity className="h-5 w-5 text-recipe-blue" />
        </div>
        <h2 className="font-bold text-2xl md:text-3xl mb-3">Personalized Nutrition Analysis</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
          Every recipe comes with detailed nutritional information tailored to your dietary goals,
          helping you make informed choices for your health journey.
        </p>
      </div>
      
      <Card className="mx-auto max-w-5xl w-full md:w-11/12 border-purple-100 dark:border-purple-900 shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="mb-6 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-sm">
            <strong className="text-purple-700 dark:text-purple-300">Personal Nutrition Features:</strong>{' '}
            Track macros, set dietary goals, and receive AI-generated meals that match your nutritional needs.
          </div>
          
          {isLoading ? (
            renderLoadingState()
          ) : carouselItems.length === 0 ? (
            renderEmptyState()
          ) : (
            <ScrollArea className="w-full touch-scroll overflow-visible" aria-label="Nutrition charts carousel">
              <Carousel 
                items={carouselItems}
                renderItem={renderCarouselItem}
                autoScroll={!isMobile}
                autoScrollInterval={8000}
                showArrows={true}
                showDots={true}
                itemWidthMobile="100%"
                itemWidthDesktop="100%"
                className="w-full overflow-visible"
                aria-live="polite"
              />
            </ScrollArea>
          )}
          
          <div className="flex justify-center w-full mt-4">
            <MacroLegend />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
