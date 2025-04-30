
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NutritionEnhancement() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-page">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Enhanced Nutrition Analysis</h2>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Our app now features USDA database integration for more accurate nutrition information, 
            taking into account cooking methods and precise unit conversions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import USDA Data
              </CardTitle>
              <CardDescription>
                Import official USDA data to enhance the nutrition analysis system
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="mb-4 text-sm text-muted-foreground">
                Upload raw USDA data files to improve ingredient matching, portion accuracy 
                and cooking yield calculations.
              </p>
              <Button asChild>
                <Link to="/data-import">Go to Data Import</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Enhanced Nutrition
              </CardTitle>
              <CardDescription>
                Experience improved nutrition calculations in all recipes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="mb-4 text-sm text-muted-foreground">
                View more accurate nutrition data for all recipes with confidence indicators, 
                showing how reliable the calculations are based on USDA data.
              </p>
              <Button variant="outline" asChild>
                <Link to="/recipes">Browse Recipes</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
