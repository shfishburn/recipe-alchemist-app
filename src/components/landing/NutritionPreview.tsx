
import React, { Suspense, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartPie, Activity, BarChartHorizontal, Utensils } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the chart components
const MacroChart = React.lazy(() => 
  import('@/components/profile/nutrition/MacroChart').then(module => ({
    default: module.MacroChart
  }))
);

const MacroPieCharts = React.lazy(() => 
  import('@/components/profile/macro-details/MacroPieCharts').then(module => ({
    default: module.MacroPieCharts
  }))
);

// Sample data for different macro distributions
const sampleData = [
  {
    title: "Balanced Macros",
    description: "Balanced macros for general health and wellbeing",
    data: [
      { name: 'Protein', value: 30, color: '#9b87f5' },
      { name: 'Carbs', value: 45, color: '#0EA5E9' },
      { name: 'Fat', value: 25, color: '#22c55e' }
    ]
  },
  {
    title: "High Protein",
    description: "High protein for muscle building and strength training",
    data: [
      { name: 'Protein', value: 40, color: '#9b87f5' },
      { name: 'Carbs', value: 35, color: '#0EA5E9' },
      { name: 'Fat', value: 25, color: '#22c55e' }
    ]
  },
  {
    title: "Endurance Focus",
    description: "Higher carbs for endurance activities and performance",
    data: [
      { name: 'Protein', value: 25, color: '#9b87f5' },
      { name: 'Carbs', value: 50, color: '#0EA5E9' },
      { name: 'Fat', value: 25, color: '#22c55e' }
    ]
  },
  {
    title: "Specialized Diet",
    description: "Personalized nutrition based on your health needs",
    data: [
      { name: 'Protein', value: 35, color: '#9b87f5' },
      { name: 'Carbs', value: 40, color: '#0EA5E9' },
      { name: 'Fat', value: 25, color: '#22c55e' }
    ],
    special: true
  }
];

// Sample data for carb distribution
const carbsData = [
  { name: 'Complex Carbs', value: 65, color: '#4f46e5' },
  { name: 'Simple Carbs', value: 35, color: '#818cf8' }
];

// Sample data for fat distribution
const fatsData = [
  { name: 'Unsaturated Fat', value: 70, color: '#86efac' },
  { name: 'Saturated Fat', value: 30, color: '#22c55e' }
];

export function NutritionPreview() {
  const isMobile = useIsMobile();
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % sampleData.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full">
      <div className="text-center mb-6 md:mb-8">
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
      
      <Card className="mx-4 md:mx-auto max-w-5xl border-purple-100 dark:border-purple-900 shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="mb-6 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-sm">
            <strong className="text-purple-700 dark:text-purple-300">Personal Nutrition Features:</strong> Track macros, set dietary goals, and receive AI-generated meals that match your nutritional needs.
          </div>
          
          <Carousel
            opts={{
              align: "center",
              loop: true,
              startIndex: activeSlide,
            }}
            className="w-full"
            onSelect={(api) => api && setActiveSlide(api.selectedScrollSnap())}
          >
            <CarouselContent>
              {sampleData.map((item, index) => (
                <CarouselItem key={index} className="md:basis-full">
                  <div className="space-y-4">
                    <h3 className="text-center text-xl font-semibold text-recipe-purple">{item.title}</h3>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                      <div className="w-full max-w-xs">
                        <Suspense fallback={
                          <div className="h-52 flex items-center justify-center">
                            <Skeleton className="h-40 w-40 rounded-full" />
                          </div>
                        }>
                          <MacroChart chartData={item.data} />
                        </Suspense>
                      </div>
                      
                      {item.special ? (
                        <div className="w-full max-w-xs">
                          <Suspense fallback={
                            <div className="h-52 flex items-center justify-center">
                              <Skeleton className="h-40 w-40" />
                            </div>
                          }>
                            <MacroPieCharts carbsData={carbsData} fatsData={fatsData} />
                          </Suspense>
                        </div>
                      ) : (
                        <div className="w-full max-w-xs space-y-3">
                          <p className="text-center text-sm md:text-base">
                            {item.description}
                          </p>
                          
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <ul className="space-y-2">
                              {item.data.map((macro, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: macro.color }}></span>
                                  <span className="text-sm">{macro.name}: <strong>{macro.value}%</strong></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="relative static transform-none mx-2" />
              <div className="flex gap-1.5 items-center">
                {sampleData.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === index ? "w-6 bg-recipe-purple" : "w-2 bg-gray-300 dark:bg-gray-600"
                    }`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <CarouselNext className="relative static transform-none mx-2" />
            </div>
          </Carousel>
          
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground mb-2 sm:mb-0">
                *Recommendations based on your personal health profile
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-recipe-purple mr-1.5"></div>
                  <span className="text-xs">Protein</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
                  <span className="text-xs">Carbs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                  <span className="text-xs">Fat</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
