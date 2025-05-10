
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartPie, Activity } from 'lucide-react';
import { macroDistributionData } from './nutrition/nutrition-sample-data';
import { Carousel, type CarouselItem } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { NutriScoreDetail } from '../recipe-detail/nutrition/NutriScoreDetail';
import { MacroBreakdown } from '../recipe-detail/nutrition/MacroBreakdown';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { NutriScore } from '@/types/recipe';
import { SimplifiedDistributionPreview } from './nutrition/SimplifiedDistributionPreview';
import { SimplifiedMacroChart } from './nutrition/SimplifiedMacroChart';
import { SimplifiedMacroLegend } from './nutrition/SimplifiedMacroLegend';

interface NutritionPreviewProps {
  isLoading?: boolean;
}

// Sample Nutri-Score data for the preview
const sampleNutriScore: NutriScore = {
  grade: 'D' as const,
  score: 18,
  negative_points: {
    total: 21,
    energy: 10,
    saturated_fat: 0,
    sugars: 1,
    sodium: 10
  },
  positive_points: {
    total: 3,
    fiber: 3,
    protein: 7,
    fruit_veg_nuts: 0
  },
  calculated_at: new Date().toISOString()
};

export function NutritionPreview({ isLoading = false }: NutritionPreviewProps) {
  const isMobile = useIsMobile();
  
  // Simplify the data structure for our charts
  const mainChartData = useMemo(() => {
    return macroDistributionData[0].data.map(item => ({
      name: item.name,
      value: item.value,
      color: item.color
    }));
  }, []);
  
  // Render function for Nutri-Score carousel item
  const renderNutriScoreSlide = () => {
    return (
      <div className="w-full px-2 sm:px-4 py-3 flex flex-col items-center">
        <h3 className="text-center text-lg sm:text-xl font-semibold text-recipe-purple mb-2 sm:mb-3">
          Nutrition Quality Score
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {/* Nutri-Score Detail */}
          <div className="flex flex-col space-y-4">
            <NutriScoreDetail nutriScore={sampleNutriScore} />
          </div>
          
          {/* Explanation Panel */}
          <div className="flex flex-col space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg h-full flex flex-col justify-center">
              <h4 className="font-medium mb-2">What is Nutri-Score?</h4>
              <p className="text-sm text-muted-foreground">
                Nutri-Score rates foods from A (most nutritious) to E (least nutritious) based on a balance
                of negative elements (calories, sugars, saturated fats, sodium) and positive nutrients (protein, fiber, fruits and vegetables).
              </p>
              <div className="mt-4 pt-4 border-t border-purple-100 dark:border-purple-700/50">
                <p className="text-xs text-muted-foreground italic">
                  Our AI analyzes each recipe's ingredients to calculate its nutritional profile and Nutri-Score
                  to help you make health-conscious choices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render function for Macro Breakdown carousel item - simplified
  const renderMacroBreakdownSlide = () => {
    return (
      <div className="w-full px-2 sm:px-4 py-3 flex flex-col items-center">
        <h3 className="text-center text-lg sm:text-xl font-semibold text-recipe-purple mb-2 sm:mb-3">
          Macro Breakdown Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {/* Simplified Macro Chart */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-[240px] mx-auto">
              <SimplifiedMacroChart data={mainChartData} height={isMobile ? 180 : 200} />
              <SimplifiedMacroLegend data={mainChartData} />
              <p className="text-xs text-center text-gray-500 mt-2 italic">
                *Protein and carbs: 4 cal/g, fat: 9 cal/g
              </p>
            </div>
          </div>
          
          {/* Macro Values Panel */}
          <div className="flex flex-col space-y-4">
            <div className="rounded-lg border text-card-foreground shadow-sm bg-muted/40 h-full">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium"><span className="text-lg">1400</span> calories</p>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    Metric
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs uppercase text-muted-foreground">Protein</p>
                    <p className="text-sm font-medium">90g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase text-muted-foreground">Carbs</p>
                    <p className="text-sm font-medium">30g</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase text-muted-foreground">Fat</p>
                    <p className="text-sm font-medium">100g</p>
                  </div>
                </div>
                
                <Separator className="mb-4" />
                
                <MacroBreakdown 
                  protein={90} 
                  carbs={30} 
                  fat={100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render function for Distribution Preview carousel item - completely simplified
  const renderDistributionSlide = () => {
    return (
      <div className="w-full px-2 sm:px-4 py-3 flex flex-col items-center">
        <h3 className="text-center text-lg sm:text-xl font-semibold text-recipe-purple mb-2 sm:mb-3">
          Nutrition Distribution
        </h3>
        
        <SimplifiedDistributionPreview macroData={mainChartData} />
      </div>
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

  // Create carousel items for the three slides
  const carouselItems: CarouselItem[] = useMemo(() => [
    { id: 1, content: "nutri-score" },
    { id: 2, content: "macro-breakdown" },
    { id: 3, content: "distribution" }
  ], []);

  // Function to render the appropriate content based on the item type
  const renderCarouselItem = (item: CarouselItem) => {
    switch(item.content) {
      case "nutri-score":
        return renderNutriScoreSlide();
      case "macro-breakdown":
        return renderMacroBreakdownSlide();
      case "distribution":
        return renderDistributionSlide();
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10">
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
      
      <Card className="mx-auto max-w-5xl w-full md:w-11/12 border-purple-100 dark:border-purple-900 shadow-md overflow-visible">
        <CardContent className="p-4 md:p-6">
          <div className="mb-6 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-sm">
            <strong className="text-purple-700 dark:text-purple-300">Personal Nutrition Features:</strong>{' '}
            Track macros, set dietary goals, and receive AI-generated meals that match your nutritional needs.
          </div>
          
          {isLoading ? (
            renderLoadingState()
          ) : (
            <ScrollArea className="w-full touch-scroll overflow-visible" aria-label="Nutrition analysis preview">
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
        </CardContent>
      </Card>
    </div>
  );
}
