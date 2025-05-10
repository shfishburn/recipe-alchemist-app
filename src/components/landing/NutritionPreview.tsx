
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

interface NutritionPreviewProps {
  isLoading?: boolean;
}

// Sample Nutri-Score data for the preview
const sampleNutriScore = {
  grade: 'D',
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
  
  // Render function for carousel items
  const renderCarouselItem = () => {
    return (
      <div className="w-full px-2 sm:px-4 py-3 flex flex-col items-center">
        <h3 className="text-center text-lg sm:text-xl font-semibold text-recipe-purple mb-2 sm:mb-3">
          Personalized Nutrition Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {/* Left Column - Nutri-Score */}
          <div className="flex flex-col space-y-4">
            <NutriScoreDetail nutriScore={sampleNutriScore} />
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium mb-2">What is Nutri-Score?</h4>
              <p className="text-sm text-muted-foreground">
                Nutri-Score rates foods from A (most nutritious) to E (least nutritious) based on a balance
                of negative elements (calories, sugars, saturated fats, sodium) and positive nutrients (protein, fiber, fruits and vegetables).
              </p>
            </div>
          </div>
          
          {/* Right Column - Macro Breakdown */}
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
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium" id="protein-label">Protein</p>
                    <p className="text-xs text-muted-foreground">180% DV</p>
                  </div>
                  <Progress 
                    value={100} 
                    className="h-2"
                    indicatorClassName="bg-primary" 
                    indicatorColor="rgba(155, 135, 245, 0.9)"
                    aria-labelledby="protein-label"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium" id="carbs-label">Carbs</p>
                    <p className="text-xs text-muted-foreground">11% DV</p>
                  </div>
                  <Progress 
                    value={11} 
                    className="h-2"
                    indicatorClassName="bg-primary" 
                    indicatorColor="rgba(14, 165, 233, 0.9)"
                    aria-labelledby="carbs-label"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium" id="fat-label">Fat</p>
                    <p className="text-xs text-muted-foreground">128% DV</p>
                  </div>
                  <Progress 
                    value={100} 
                    className="h-2"
                    indicatorClassName="bg-primary" 
                    indicatorColor="rgba(34, 197, 94, 0.9)"
                    aria-labelledby="fat-label"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium" id="fiber-label">Fiber</p>
                    <p className="text-xs text-muted-foreground">11% DV</p>
                  </div>
                  <Progress 
                    value={11} 
                    className="h-2"
                    indicatorClassName="bg-primary" 
                    indicatorColor="rgba(251, 146, 60, 0.9)"
                    aria-labelledby="fiber-label"
                  />
                </div>
                
                <Separator className="my-4" />
                
                <MacroBreakdown 
                  protein={90} 
                  carbs={30} 
                  fat={100}
                />
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium mb-2">Personalized Macro Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your macronutrient breakdown shows the distribution of protein, carbs, and fats in your diet.
                These values are personalized based on your fitness goals, activity level, and dietary preferences.
              </p>
            </div>
          </div>
        </div>
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

  // Create a single carousel item
  const carouselItems: CarouselItem[] = useMemo(() => [
    { id: 1, content: "nutrition-preview" }
  ], []);

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
                showArrows={false}
                showDots={false}
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
