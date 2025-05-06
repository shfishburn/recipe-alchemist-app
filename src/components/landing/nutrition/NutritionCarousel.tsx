
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

export function NutritionCarousel() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <ChartPie className="h-5 w-5 text-recipe-purple" />
          <Activity className="h-5 w-5 text-recipe-blue" />
        </div>
        <h2 className="font-bold text-2xl md:text-3xl mb-3">Personalized Nutrition Analysis</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Every recipe comes with detailed nutritional information tailored to your dietary goals,
          helping you make informed choices for your health journey.
        </p>
      </div>
      
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-md border border-purple-100 dark:border-purple-900 overflow-hidden">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="px-4 py-4">
            {macroDistributionData.map((item, index) => (
              <CarouselItem key={index} className="p-2 md:p-3 min-w-[100%] md:min-w-[50%] lg:min-w-[33%]">
                <MacroCarouselItem 
                  item={item} 
                  carbsData={carbsData} 
                  fatsData={fatsData} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex items-center justify-between p-4">
            <CarouselPagination />
            <MacroLegend />
          </div>
        </Carousel>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div className="h-full w-16 bg-gray-300 rounded-full mx-auto"></div>
        </div>
        <div className="text-xs text-center text-muted-foreground pb-3 pt-1">
          Swipe to see more
        </div>
      </div>
    </div>
  );
}
