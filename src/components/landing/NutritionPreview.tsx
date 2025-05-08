
import React from 'react';
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

export function NutritionPreview() {
  // Map nutrition data to carousel items format
  const carouselItems: CarouselItem[] = macroDistributionData.map((item, index) => ({
    id: index,
    content: item,
  }));

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
          
          <div className="w-full">
            {/* Using our updated Carousel component */}
            <Carousel 
              items={carouselItems}
              renderItem={renderCarouselItem}
              autoScroll={true}
              autoScrollInterval={5000}
              showArrows={true}
              showDots={true}
              itemWidthMobile="90%"
              itemWidthDesktop="90%"
              className="w-full"
            />
          </div>
          
          <div className="flex justify-center w-full mt-4">
            <MacroLegend />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
