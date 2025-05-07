
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartPie, Activity } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  macroDistributionData, 
  carbsData, 
  fatsData 
} from './nutrition/nutrition-sample-data';
import { MacroCarouselItem } from './nutrition/MacroCarouselItem';
import { CarouselPagination } from './nutrition/CarouselPagination';
import { MacroLegend } from './nutrition/MacroLegend';

export function NutritionPreview() {
  const isMobile = useIsMobile();
  const [activeSlide, setActiveSlide] = useState(0);
  const [api, setApi] = useState<any>(null);
  
  // Auto-scroll carousel with pause on hover
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      const nextSlide = (activeSlide + 1) % macroDistributionData.length;
      setActiveSlide(nextSlide);
      api?.scrollTo(nextSlide);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [api, activeSlide, isPaused]);
  
  // Handle API events
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setActiveSlide(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);
  
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
          
          <div 
            className="w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
              setApi={setApi}
            >
              <CarouselContent>
                {macroDistributionData.map((item, index) => (
                  <CarouselItem key={index} className="md:basis-full flex justify-center">
                    <MacroCarouselItem 
                      item={item} 
                      carbsData={carbsData} 
                      fatsData={fatsData} 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          
          <div className="flex justify-center w-full mt-2">
            <CarouselPagination 
              totalItems={macroDistributionData.length}
              activeSlide={activeSlide}
              onSelectSlide={(index) => {
                setActiveSlide(index);
                api?.scrollTo(index);
                setIsPaused(true); // Pause auto-scroll when user navigates
                setTimeout(() => setIsPaused(false), 5000); // Resume after 5 seconds
              }}
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
