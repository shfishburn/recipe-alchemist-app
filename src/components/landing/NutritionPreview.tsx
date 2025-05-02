
import React, { Suspense } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const nutritionDescriptions = [
  "Balanced macros for general health",
  "High protein for muscle building",
  "Higher carbs for endurance"
];

const macroDetailsContent = [
  {
    title: "Macro Distribution",
    description: "Track your macronutrient intake with precision to meet your dietary goals.",
    icon: <ChartPie className="h-5 w-5 text-recipe-purple" />
  },
  {
    title: "Nutrient Breakdown",
    description: "Analyze the quality of your carbs and fats with detailed breakdowns.",
    icon: <BarChartHorizontal className="h-5 w-5 text-blue-500" />
  },
  {
    title: "Meal Planning",
    description: "Get AI-powered meal recommendations based on your nutritional needs.",
    icon: <Utensils className="h-5 w-5 text-green-500" />
  }
];

export function NutritionPreview() {
  const isMobile = useIsMobile();
  
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
          
          <Tabs defaultValue="macros" className="w-full">
            <TabsList className="w-full justify-start mb-4 bg-slate-100 dark:bg-slate-800 p-1">
              <TabsTrigger value="macros" className="text-xs sm:text-sm">Macro Distribution</TabsTrigger>
              <TabsTrigger value="details" className="text-xs sm:text-sm">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="trends" className="text-xs sm:text-sm">Diet Trends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="macros">
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
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-4">
                  <CarouselPrevious className="relative static transform-none mx-2" />
                  <CarouselNext className="relative static transform-none mx-2" />
                </div>
              </Carousel>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="md:grid md:grid-cols-2 gap-6">
                <div className="mb-6 md:mb-0">
                  <Suspense fallback={<div className="h-64 w-full flex items-center justify-center"><Skeleton className="h-48 w-full" /></div>}>
                    <MacroPieCharts carbsData={carbsData} fatsData={fatsData} />
                  </Suspense>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Nutrient Quality Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understanding the quality of your macros is just as important as tracking quantities. Our AI analyzes the nutritional profile of each ingredient.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Carbohydrate Quality</h4>
                    <p className="text-xs text-muted-foreground">Complex carbs provide sustained energy while simple carbs give quick energy boosts.</p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Fat Quality</h4>
                    <p className="text-xs text-muted-foreground">Unsaturated fats support heart health while saturated fats should be consumed in moderation.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {macroDetailsContent.map((item, i) => (
                    <Card key={i} className="border border-slate-200">
                      <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mt-4">
                          {item.icon}
                        </div>
                        <h3 className="font-medium text-base">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="font-medium text-base mb-3">AI-Powered Nutrition Intelligence</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-recipe-purple/10 p-1.5 rounded-full">
                        <ChartPie className="h-4 w-4 text-recipe-purple" />
                      </div>
                      <div>
                        <p className="text-sm"><span className="font-medium">Real-time adjustments</span> to your nutritional plan based on your progress</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-1.5 rounded-full">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm"><span className="font-medium">Performance tracking</span> to see how your nutrition affects your energy levels</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-1.5 rounded-full">
                        <Utensils className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm"><span className="font-medium">Meal suggestions</span> that adapt to your changing nutritional needs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
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
