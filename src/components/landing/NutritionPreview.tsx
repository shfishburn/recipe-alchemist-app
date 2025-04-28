
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MacroChart } from '@/components/profile/nutrition/MacroChart';

const sampleData = [
  { name: 'Protein', value: 30, color: '#4f46e5' },
  { name: 'Carbs', value: 45, color: '#818cf8' },
  { name: 'Fat', value: 25, color: '#22c55e' }
];

export function NutritionPreview() {
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="font-bold text-2xl md:text-3xl mb-3 md:mb-4">Track Your Nutrition</h2>
            <p className="text-base md:text-lg text-muted-foreground px-4 md:px-0">
              Understand the nutritional value of every recipe with detailed macro breakdowns 
              and personalized insights.
            </p>
          </div>
          
          <Card className="mx-4 md:mx-0">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4 md:space-y-6">
                <MacroChart chartData={sampleData} />
                <div className="space-y-3 text-sm md:text-base text-muted-foreground">
                  <p>
                    Every recipe comes with a detailed nutritional analysis. Our charts 
                    break down the macronutrient ratios, helping you make informed decisions 
                    about your meals.
                  </p>
                  <p>
                    Track protein, carbs, and fats to ensure your recipes align with your 
                    nutritional goals. Personalized insights help you understand how each 
                    recipe fits into your daily targets.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
