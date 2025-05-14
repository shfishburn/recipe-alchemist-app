
import React from 'react';
import { Card } from '@/components/ui/card';
import { CardWrapper } from '@/components/ui/card-wrapper';
import { Button } from '@/components/ui/button';
import { ChartPie, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NutritionPreview() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container-page">
        <div className="text-center mb-10">
          <h2 className="material-h2 mb-3">Nutrition Insights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get detailed nutrition information for every recipe, helping you make informed dietary decisions.
          </p>
        </div>
        
        <div className="flex justify-center">
          <CardWrapper 
            size="4xl"
            className="overflow-hidden shadow-elevation-2 border border-border"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6 flex flex-col justify-center">
                <div className="space-y-3">
                  <div className="p-2 rounded-full bg-primary/10 w-fit">
                    <ChartPie className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-2xl font-medium">Personalized Nutrition</h3>
                  <p className="text-muted-foreground">
                    Discover how each recipe aligns with your nutritional needs and dietary goals.
                    Our AI analyzes every ingredient to provide accurate macro and micronutrient data.
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {[
                    "Macronutrient distribution visualization",
                    "Micronutrient content analysis",
                    "Dietary goal alignment",
                    "Personalized nutritional insights"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                        ✓
                      </span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button asChild className="w-fit" variant="default">
                  <Link to="/how-it-works">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center p-4">
                <img
                  src="/src/components/landing/nutrition/nutrition-distribution.png"
                  alt="Nutrition Distribution Chart"
                  className="max-w-full h-auto rounded-lg shadow-elevation-1"
                />
              </div>
            </div>
          </CardWrapper>
        </div>
      </div>
    </section>
  );
}

export default NutritionPreview;
