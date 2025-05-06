
import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
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
  const [currentSlide, setCurrentSlide] = useState(0);

  // Update current slide when API changes
  useEffect(() => {
    if (!api) return;
    
    const handleChange = () => {
      setCurrentSlide(api.realIndex);
    };
    
    api.on('slideChange', handleChange);
    return () => {
      api.off('slideChange', handleChange);
    };
  }, [api]);

  // Auto-scroll effect
  useEffect(() => {
    if (!api || isPaused) return;
    
    const interval = setInterval(() => {
      api.slideNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api, isPaused]);

  // Debug API initialization - with safety checks
  useEffect(() => {
    if (api && api.slides) {
      console.log('Nutrition Carousel API initialized with', api.slides.length, 'slides');
    }
  }, [api]);

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
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
      >
        <Carousel
          opts={{
            loop: true,
            slidesPerView: 1.2,
            spaceBetween: 20,
            breakpoints: {
              640: { slidesPerView: 2.2, spaceBetween: 24 },
              768: { slidesPerView: 2.5, spaceBetween: 28 },
              1024: { slidesPerView: 3.2, spaceBetween: 32 },
            },
            centeredSlides: false,
            grabCursor: true,
            touchEventsTarget: 'container',
            touchStartPreventDefault: false,
            touchMoveStopPropagation: false,
            touchReleaseOnEdges: false,
            cssMode: false, // Disable CSS mode for better touch support
            resistance: false,
            longSwipesRatio: 0.2,
            threshold: 10, // Lower threshold to detect swipes more easily
          }}
          setApi={setApi}
          className="w-full hw-accelerated"
        >
          <CarouselContent className="px-2">
            {macroDistributionData.map((item, index) => (
              <CarouselItem key={index} className="p-2 md:p-3 min-w-[80%] sm:min-w-[45%] md:min-w-[33%]">
                <MacroCarouselItem 
                  item={item} 
                  carbsData={carbsData} 
                  fatsData={fatsData} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Make arrows clearly visible and always present */}
          <CarouselPrevious className="left-2 md:left-4 bg-white dark:bg-slate-800 shadow-md opacity-90 hover:opacity-100" />
          <CarouselNext className="right-2 md:right-4 bg-white dark:bg-slate-800 shadow-md opacity-90 hover:opacity-100" />
          
          <div className="p-4 pb-6">
            <CarouselPagination variant="fraction" />
            <MacroLegend />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
