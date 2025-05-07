
import React, { useRef, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination
} from '@/components/ui/carousel';
import { 
  macroDistributionData, 
  carbsData, 
  fatsData,
  nutriScoreExamples
} from './nutrition-sample-data';
import { MacroCarouselItem } from './MacroCarouselItem';
import { MacroLegend } from './MacroLegend';
import { ChartPie, Activity, Award } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function NutritionCarousel() {
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Add touch classes to carousel container
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.classList.add('momentum-scroll', 'hw-accelerated');
    }
  }, []);
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="text-center mb-2 sm:mb-4">
        <div className="inline-flex items-center justify-center gap-2 mb-1">
          <ChartPie className="h-5 w-5 text-recipe-purple" />
          <Activity className="h-5 w-5 text-recipe-blue" />
          <Award className="h-5 w-5 text-amber-500" />
        </div>
        <h2 className="font-bold text-2xl md:text-3xl mb-1">Personalized Nutrition Analysis</h2>
        <p className="text-base text-muted-foreground max-w-3xl mx-auto">
          Every recipe comes with detailed nutritional information and NutriScore ratings 
          tailored to your dietary goals, helping you make informed choices for your health journey.
        </p>
      </div>
      
      <div className={cn(
        "relative bg-white dark:bg-slate-900 rounded-xl shadow-md border",
        "border-purple-100 dark:border-purple-900 overflow-hidden",
        isMobile ? "aspect-[3/4] max-h-[500px]" : "aspect-[16/9] max-h-[550px]"
      )}>
        <Carousel
          ref={carouselRef}
          opts={{
            align: "center",
          }}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {macroDistributionData.map((item, index) => (
              <CarouselItem key={index} className="h-full">
                <MacroCarouselItem 
                  item={item} 
                  carbsData={carbsData} 
                  fatsData={fatsData} 
                />
              </CarouselItem>
            ))}
            
            {nutriScoreExamples.map((item, index) => (
              <CarouselItem key={`nutriscore-${index}`} className="h-full">
                <MacroCarouselItem 
                  item={item}
                  nutriScoreExample={true}
                  carbsData={carbsData}
                  fatsData={fatsData}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="absolute bottom-1 left-0 right-0 flex items-center justify-between px-3">
            <CarouselPagination />
            <MacroLegend />
          </div>
        </Carousel>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 pointer-events-none">
          <div className="h-full w-16 bg-gray-300 rounded-full mx-auto"></div>
        </div>
        <div className="text-xs text-center text-muted-foreground py-0.5 pointer-events-none">
          Swipe to see more
        </div>
      </div>
    </div>
  );
}
