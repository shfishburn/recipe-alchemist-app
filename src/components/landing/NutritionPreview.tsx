
import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartPie } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

// Lazy load the MacroChart component
const MacroChart = React.lazy(() => 
  import('@/components/profile/nutrition/MacroChart').then(module => ({
    default: module.MacroChart
  }))
);

// Sample data for different macro distributions
const sampleData = [
  [
    { name: 'Protein', value: 30, color: '#9b87f5' },
    { name: 'Carbs', value: 45, color: '#0EA5E9' },
    { name: 'Fat', value: 25, color: '#22c55e' }
  ],
  [
    { name: 'Protein', value: 40, color: '#9b87f5' },
    { name: 'Carbs', value: 35, color: '#0EA5E9' },
    { name: 'Fat', value: 25, color: '#22c55e' }
  ],
  [
    { name: 'Protein', value: 25, color: '#9b87f5' },
    { name: 'Carbs', value: 50, color: '#0EA5E9' },
    { name: 'Fat', value: 25, color: '#22c55e' }
  ]
];

const nutritionDescriptions = [
  "Balanced macros for general health",
  "High protein for muscle building",
  "Higher carbs for endurance"
];

export function NutritionPreview() {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <ChartPie className="h-5 w-5 text-recipe-purple" />
        </div>
        <h2 className="font-bold text-2xl md:text-3xl mb-3">Personalized Nutrition Analysis</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
          Every recipe comes with detailed nutritional information tailored to your dietary goals,
          helping you make informed choices for your health journey.
        </p>
      </div>
      
      <Card className="mx-4 md:mx-auto max-w-4xl border-purple-100 dark:border-purple-900 shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="mb-6 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-sm">
            <strong className="text-purple-700 dark:text-purple-300">Personal Nutrition Features:</strong> Track macros, set dietary goals, and receive AI-generated meals that match your nutritional needs.
          </div>
          
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {sampleData.map((data, index) => (
                <CarouselItem key={index} className="md:basis-full">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        <Suspense fallback={
                          <div className="h-52 flex items-center justify-center">
                            <Skeleton className="h-40 w-40 rounded-full" />
                          </div>
                        }>
                          <MacroChart chartData={data} />
                        </Suspense>
                      </div>
                    </div>
                    <p className="text-center text-sm md:text-base font-medium">
                      {nutritionDescriptions[index]}
                    </p>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-1.5"></div>
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="relative static transform-none mx-2" />
              <CarouselNext className="relative static transform-none mx-2" />
            </div>
          </Carousel>
        </CardContent>
      </Card>
    </div>
  );
}
