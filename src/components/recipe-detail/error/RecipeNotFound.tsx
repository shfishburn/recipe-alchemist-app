
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Navbar from '@/components/ui/navbar';

export function RecipeNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-semibold mb-4">Recipe Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the recipe you're looking for. It may have been deleted or moved.
          </p>
          <Button asChild>
            <Link to="/recipes"><Home className="mr-2 h-4 w-4" /> Back to Recipes</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
