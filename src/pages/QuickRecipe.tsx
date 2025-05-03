
import React from 'react';
import { PageSeo } from '@/components/seo/PageSeo';
import { Button } from '@/components/ui/button';

export default function QuickRecipe() {
  return (
    <>
      <PageSeo 
        title="Quick Recipe Generator | Recipe Alchemy"
        description="Generate quick recipes based on ingredients you have on hand."
      />
      <main>
        <div className="container-page py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Quick Recipe Generator</h1>
            <p className="text-lg mb-8 text-muted-foreground">
              Tell us what ingredients you have, and we'll generate a delicious recipe for you in seconds.
            </p>
            
            <div className="p-6 border rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Enter Your Ingredients</h2>
              <p className="text-muted-foreground mb-6">
                List the ingredients you have available, and our AI will create a personalized recipe.
              </p>
              <div className="space-y-4">
                <textarea 
                  className="w-full h-32 p-3 border rounded-md" 
                  placeholder="e.g., chicken breast, spinach, garlic, olive oil..."
                />
                <div className="flex justify-end">
                  <Button>Generate Recipe</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
