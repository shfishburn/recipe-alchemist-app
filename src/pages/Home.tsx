
import React from 'react';
import { PageSeo } from '@/components/seo/PageSeo';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <PageSeo 
        title="Recipe Alchemy - AI-Powered Recipe Creation"
        description="Transform your cooking experience with AI-powered recipe creation and personalization."
      />
      <main>
        <div className="container-page py-12">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Welcome to Recipe Alchemy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Transform your cooking experience with AI-powered recipe creation and personalization.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/quick-recipe">Create Quick Recipe</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/recipes">Browse Recipes</Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Smart Recipe Generation</h2>
              <p className="text-muted-foreground">Create personalized recipes based on your preferences and dietary needs.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Nutritional Insights</h2>
              <p className="text-muted-foreground">Get detailed nutritional information for every recipe.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Shopping Lists</h2>
              <p className="text-muted-foreground">Automatically generate shopping lists from your favorite recipes.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
