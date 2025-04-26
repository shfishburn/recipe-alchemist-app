
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { Loader2, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const RecipeDetail = () => {
  const { id } = useParams();
  const { data: recipe, isLoading, error } = useRecipeDetail(id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          {isLoading ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 my-12">
              <p>Error loading recipe. Please try again later.</p>
              <p className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          ) : recipe ? (
            <div className="max-w-4xl mx-auto">
              {/* Recipe Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                {recipe.tagline && (
                  <p className="text-lg text-muted-foreground italic mb-4">{recipe.tagline}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.cuisine && (
                    <Badge variant="outline" className="bg-recipe-blue/10 text-recipe-blue">
                      {recipe.cuisine}
                    </Badge>
                  )}
                  {recipe.dietary && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-700">
                      {recipe.dietary}
                    </Badge>
                  )}
                  {recipe.flavor_tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {recipe.servings && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  )}
                  {recipe.prep_time_min && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Prep: {recipe.prep_time_min} min</span>
                    </div>
                  )}
                  {recipe.cook_time_min && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Cook: {recipe.cook_time_min} min</span>
                    </div>
                  )}
                  {recipe.prep_time_min && recipe.cook_time_min && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Total: {recipe.prep_time_min + recipe.cook_time_min} min</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Ingredients Column */}
                <div className="md:col-span-1">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                      <ul className="space-y-2">
                        {recipe.ingredients && Array.isArray(recipe.ingredients) ? 
                          recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>
                                {ingredient.qty} {ingredient.unit} {ingredient.item}
                              </span>
                            </li>
                          )) : 
                          <li className="text-muted-foreground">No ingredients listed</li>
                        }
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Nutrition Information */}
                  {recipe.nutrition && (
                    <Card className="mt-4">
                      <CardContent className="pt-6">
                        <h2 className="text-xl font-semibold mb-4">Nutrition (per serving)</h2>
                        <ul className="space-y-2">
                          {recipe.nutrition.kcal !== undefined && (
                            <li className="flex justify-between">
                              <span>Calories:</span>
                              <span className="font-medium">{recipe.nutrition.kcal} kcal</span>
                            </li>
                          )}
                          {recipe.nutrition.protein_g !== undefined && (
                            <li className="flex justify-between">
                              <span>Protein:</span>
                              <span className="font-medium">{recipe.nutrition.protein_g}g</span>
                            </li>
                          )}
                          {recipe.nutrition.carbs_g !== undefined && (
                            <li className="flex justify-between">
                              <span>Carbs:</span>
                              <span className="font-medium">{recipe.nutrition.carbs_g}g</span>
                            </li>
                          )}
                          {recipe.nutrition.fat_g !== undefined && (
                            <li className="flex justify-between">
                              <span>Fat:</span>
                              <span className="font-medium">{recipe.nutrition.fat_g}g</span>
                            </li>
                          )}
                          {recipe.nutrition.fiber_g !== undefined && (
                            <li className="flex justify-between">
                              <span>Fiber:</span>
                              <span className="font-medium">{recipe.nutrition.fiber_g}g</span>
                            </li>
                          )}
                          {recipe.nutrition.sugar_g !== undefined && (
                            <li className="flex justify-between">
                              <span>Sugar:</span>
                              <span className="font-medium">{recipe.nutrition.sugar_g}g</span>
                            </li>
                          )}
                          {recipe.nutrition.sodium_mg !== undefined && (
                            <li className="flex justify-between">
                              <span>Sodium:</span>
                              <span className="font-medium">{recipe.nutrition.sodium_mg}mg</span>
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Instructions Column */}
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                      {recipe.instructions && recipe.instructions.length > 0 ? (
                        <ol className="space-y-4 list-decimal list-inside">
                          {recipe.instructions.map((step, index) => (
                            <li key={index} className="pl-2">
                              <span className="font-medium">Step {index + 1}:</span>
                              <p className="mt-1 ml-6">{step}</p>
                              {index < recipe.instructions.length - 1 && (
                                <Separator className="my-4" />
                              )}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-muted-foreground">No instructions available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default RecipeDetail;
