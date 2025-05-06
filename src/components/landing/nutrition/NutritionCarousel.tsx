
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination
} from '@/components/ui/carousel';
import { 
  macroDistributionData, 
  carbsData, 
  fatsData 
} from './nutrition-sample-data';
import { MacroCarouselItem } from './MacroCarouselItem';
import { MacroLegend } from './MacroLegend';
import { ChartPie, Activity } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function NutritionCarousel() {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center gap-2 mb-1">
          <ChartPie className="h-5 w-5 text-recipe-purple" />
          <Activity className="h-5 w-5 text-recipe-blue" />
        </div>
        <h2 className="font-bold text-2xl md:text-3xl mb-1">Personalized Nutrition Analysis</h2>
        <p className="text-base text-muted-foreground max-w-3xl mx-auto">
          Every recipe comes with detailed nutritional information tailored to your dietary goals,
          helping you make informed choices for your health journey.
        </p>
      </div>
      
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-md border border-purple-100 dark:border-purple-900 overflow-hidden">
        <Carousel
          opts={{
            align: "center",
          }}
          className="w-full"
        >
          <CarouselContent className="px-2 py-2">
            {macroDistributionData.map((item, index) => (
              <CarouselItem key={index} className="w-full">
                <MacroCarouselItem 
                  item={item} 
                  carbsData={carbsData} 
                  fatsData={fatsData} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex items-center justify-between px-3 py-2">
            <CarouselPagination />
            <MacroLegend />
          </div>
        </Carousel>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div className="h-full w-16 bg-gray-300 rounded-full mx-auto"></div>
        </div>
        <div className="text-xs text-center text-muted-foreground pb-1 pt-0.5">
          Swipe to see more
        </div>
      </div>
    </div>
  );
}
