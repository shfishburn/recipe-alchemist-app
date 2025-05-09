// path: src/components/landing/UserDashboard.tsx
// file: UserDashboard.tsx
// updated: 2025-05-09 14:30 PM

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { QuickRecipeGenerator } from '@/components/quick-recipe/QuickRecipeGenerator';
import { RecipeCarousel } from '@/components/landing/RecipeCarousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CookingPot, Clock, History, PlusCircle, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecipes } from '@/hooks/use-recipes';
import { PageContainer } from '@/components/ui/containers';

export function UserDashboard() {
  const { profile } = useAuth();
  const { data: recipes, isLoading } = useRecipes();
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);

  useEffect(() => {
    if (recipes && recipes.length > 0) {
      setRecentRecipes(recipes.slice(0, 3));
    }
  }, [recipes]);

  return (
    <PageContainer className="py-6 md:py-12">
      <div className="space-y-10">

        {/* Personalized Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Welcome{profile?.username ? `, ${profile.username}` : ''}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            What would you like to make in your kitchen today?
          </p>
        </div>

        {/* Quick Actions Section */}
        <section>
          <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
            <QuickRecipeGenerator />
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-recipe-blue" />
              Recent Activity
            </h2>
            <Button variant="outline" asChild>
              <Link to="/recipes">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-40 w-full rounded-t-lg" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : recentRecipes.length > 0 ? (
              recentRecipes.map((recipe) => (
                <Link key={recipe.id} to={`/recipes/${recipe.slug || recipe.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {recipe.image_url ? (
                        <img
                          src={recipe.image_url}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                          <CookingPot className="h-10 w-10 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium line-clamp-1">{recipe.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-2 gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{recipe.prep_time_min + recipe.cook_time_min} min</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 py-10 text-center">
                <p className="text-muted-foreground">No recent recipes found.</p>
                <Button asChild variant="default" className="mt-4">
                  <Link to="/quick-recipe">
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Create Your First Recipe
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Trending Recipes Carousel */}
        <section className="flex justify-center">
          <div className="w-full max-w-6xl mx-auto">
            <RecipeCarousel />
          </div>
        </section>

      </div>
    </PageContainer>
  );
}
