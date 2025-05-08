
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartPie, Activity } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Improved auto-scroll with user interaction detection
  const [isPaused, setIsPaused] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  
  // Handle auto-scrolling with improved interaction detection
  useEffect(() => {
    if (isPaused || userInteracted) return;
    
    const interval = setInterval(() => {
      const nextSlide = (activeSlide + 1) % macroDistributionData.length;
      setActiveSlide(nextSlide);
      
      // Scroll to the next slide
      if (scrollRef.current) {
        const slideWidth = scrollRef.current.clientWidth;
        scrollRef.current.scrollTo({
          left: slideWidth * nextSlide,
          behavior: 'smooth'
        });
      }
    }, 5000); // Slower scroll interval (5 seconds)
    
    return () => clearInterval(interval);
  }, [activeSlide, isPaused, userInteracted]);
  
  // Handle scroll events to update active slide
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    const handleScroll = () => {
      if (!scrollContainer) return;
      
      const scrollPosition = scrollContainer.scrollLeft;
      const slideWidth = scrollContainer.clientWidth;
      const newIndex = Math.round(scrollPosition / slideWidth);
      
      if (newIndex !== activeSlide && newIndex >= 0 && newIndex < macroDistributionData.length) {
        setActiveSlide(newIndex);
      }
    };
    
    // Detect user interaction to stop auto-scrolling
    const stopAutoScroll = () => {
      setUserInteracted(true);
    };
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    scrollContainer.addEventListener('touchstart', stopAutoScroll, { passive: true });
    scrollContainer.addEventListener('mousedown', stopAutoScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      scrollContainer.removeEventListener('touchstart', stopAutoScroll);
      scrollContainer.removeEventListener('mousedown', stopAutoScroll);
    };
  }, [activeSlide]);
  
  // Scroll to selected slide when pagination is clicked
  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
    setUserInteracted(true); // User has interacted
    
    if (scrollRef.current) {
      // Add user-scrolling class to temporarily disable smooth scrolling if needed
      scrollRef.current.classList.add('user-scrolling');
      
      const slideWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
      
      // Remove class after animation completes
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.classList.remove('user-scrolling');
        }
      }, 500);
    }
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
          
          <div 
            className="w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            role="region" 
            aria-label="Nutrition information carousel"
          >
            {/* Updated carousel with fixed classes */}
            <div className="carousel-container">
              <div 
                ref={scrollRef} 
                className="carousel-scroll-area"
              >
                {macroDistributionData.map((item, index) => (
                  <div 
                    key={index} 
                    className="carousel-item carousel-item-nutrition" 
                    aria-hidden={activeSlide !== index}
                  >
                    <MacroCarouselItem 
                      item={item} 
                      carbsData={carbsData} 
                      fatsData={fatsData} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center w-full mt-2">
            <CarouselPagination 
              totalItems={macroDistributionData.length}
              activeSlide={activeSlide}
              onSelectSlide={handleSelectSlide}
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
