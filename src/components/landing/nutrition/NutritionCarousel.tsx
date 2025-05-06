
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
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
  const [api, setApi] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    if (!api || isPaused) return;
    
    const interval = setInterval(() => {
      api.slideNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api, isPaused]);

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
      
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-xl shadow-md border border-purple-100 dark:border-purple-900 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Carousel
          opts={{
            loop: true,
            slidesPerView: 1,
            spaceBetween: 0,
          }}
          setApi={setApi}
          className="w-full"
        >
          {macroDistributionData.map((item, index) => (
            <CarouselItem key={index} className="p-4 md:p-6">
              <MacroCarouselItem 
                item={item} 
                carbsData={carbsData} 
                fatsData={fatsData} 
              />
            </CarouselItem>
          ))}
          
          <CarouselPrevious className="left-2 md:left-4" />
          <CarouselNext className="right-2 md:right-4" />
          
          <div className="p-4 pb-6">
            <CarouselPagination showNumbers variant="dots" />
            <MacroLegend />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
