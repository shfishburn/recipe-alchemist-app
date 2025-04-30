
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function FeaturedRecipes() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container-page">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted"></div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">Recipe {i + 1}</h3>
                <p className="text-muted-foreground">Sample recipe description with enhanced nutrition details.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
