
import React, { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
    { name: 'Protein', value: 30, color: '#4f46e5' },
    { name: 'Carbs', value: 45, color: '#818cf8' },
    { name: 'Fat', value: 25, color: '#22c55e' }
  ],
  [
    { name: 'Protein', value: 40, color: '#4f46e5' },
    { name: 'Carbs', value: 35, color: '#818cf8' },
    { name: 'Fat', value: 25, color: '#22c55e' }
  ],
  [
    { name: 'Protein', value: 25, color: '#4f46e5' },
    { name: 'Carbs', value: 50, color: '#818cf8' },
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
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="font-bold text-2xl md:text-3xl mb-3 md:mb-4">Track Your Nutrition</h2>
            <p className="text-base md:text-lg text-muted-foreground px-4 md:px-0">
              Understand the nutritional value of every recipe with detailed macro breakdowns 
              and personalized insights.
            </p>
          </div>
          
          <Card className="mx-4 md:mx-0">
            <CardContent className="p-4 md:p-6">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-3xl mx-auto"
              >
                <CarouselContent>
                  {sampleData.map((data, index) => (
                    <CarouselItem key={index} className="md:basis-full">
                      <div className="space-y-4">
                        <div className="max-w-md mx-auto">
                          <Suspense fallback={
                            <div className="h-52 flex items-center justify-center">
                              <Skeleton className="h-40 w-40 rounded-full" />
                            </div>
                          }>
                            <MacroChart chartData={data} />
                          </Suspense>
                        </div>
                        <p className="text-center text-sm md:text-base text-muted-foreground">
                          {nutritionDescriptions[index]}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
