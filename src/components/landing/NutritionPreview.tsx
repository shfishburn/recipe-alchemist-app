
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartPie, Activity, Info } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useOptimizedCarousel } from '@/hooks/use-optimized-carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  macroDistributionData, 
  carbsData, 
  fatsData 
} from './nutrition/nutrition-sample-data';
import { MacroCarouselItem } from './nutrition/MacroCarouselItem';
import { CarouselPagination } from '@/components/ui/carousel-pagination';
import { MacroLegend } from './nutrition/MacroLegend';
import { NutriScoreBadge } from '@/components/recipe-detail/nutrition/nutri-score/NutriScoreBadge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type NutriScore } from '@/types/recipe';

export function NutritionPreview() {
  const isMobile = useIsMobile();
  const { 
    api, 
    setApi, 
    activeIndex,
    touchHandlers,
    getCarouselOptions,
    scrollTo,
    setupAutoScroll
  } = useOptimizedCarousel();
  
  // Setup auto-scroll
  useEffect(() => {
    return setupAutoScroll(5000, true, macroDistributionData.length);
  }, [api, activeIndex, setupAutoScroll]);

  // Sample NutriScore for demonstration
  const sampleNutriScore: NutriScore = { grade: "A", score: -5 };
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="text-center mb-6 md:mb-8 w-full">
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
      
      <Card className="mx-auto border-purple-100 dark:border-purple-900 shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 text-sm flex-1">
              <strong className="text-purple-700 dark:text-purple-300">Personal Nutrition Features:</strong>{' '}
              Track macros, set dietary goals, and receive AI-generated meals that match your nutritional needs.
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-sm flex-1 flex items-center justify-between">
              <div>
                <strong className="text-blue-700 dark:text-blue-300">NutriScore Rating:</strong>{' '}
                Easily understand the nutritional quality of each recipe at a glance.
              </div>
              <div className="flex items-center gap-2">
                <NutriScoreBadge nutriScore={sampleNutriScore} size="md" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs max-w-xs">
                        NutriScore is a nutrition label that converts the nutritional value of products 
                        into a simple overall score, with grades ranging from A (best) to E (worst).
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          
          <div 
            className="w-full touch-action-pan-y"
            {...touchHandlers}
          >
            <Carousel
              opts={getCarouselOptions({ align: "center", loop: true })}
              className="w-full"
              setApi={setApi}
            >
              <CarouselContent>
                {macroDistributionData.map((item, index) => (
                  <CarouselItem key={index} className="md:basis-full">
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
          
          <div className="flex justify-center w-full mt-6">
            <CarouselPagination 
              totalItems={macroDistributionData.length}
              activeIndex={activeIndex}
              onSelect={scrollTo}
              size={isMobile ? "sm" : "md"}
              className="mb-2"
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
