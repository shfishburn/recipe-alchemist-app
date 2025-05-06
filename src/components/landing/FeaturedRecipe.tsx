
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRecipeDetail } from "@/hooks/use-recipe-detail";
import { Skeleton } from "@/components/ui/skeleton";

// Featured recipe ID for the Japanese Curry - update to your actual recipe ID
const FEATURED_RECIPE_ID = "d2f44866-5ee9-4dc4-8537-21f01ed42ac2";

export function FeaturedRecipe() {
  const { data: recipe, isLoading } = useRecipeDetail(FEATURED_RECIPE_ID);

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-recipe-blue" />
                  Featured Recipe
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!recipe) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-page">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-recipe-blue" />
                Featured Recipe
              </CardTitle>
              <Button variant="outline" onClick={() => window.location.href = `/recipes/${FEATURED_RECIPE_ID}`}>
                View Full Recipe
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">{recipe.title}</h3>
                <p className="text-muted-foreground">{recipe.tagline || recipe.description}</p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[100px]">Unit</TableHead>
                    <TableHead>Ingredient</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{ingredient.qty}</TableCell>
                      <TableCell>{ingredient.unit}</TableCell>
                      <TableCell>{typeof ingredient.item === 'string' ? ingredient.item : JSON.stringify(ingredient.item)}</TableCell>
                    </TableRow>
                  ))}
                  {recipe.ingredients.length > 5 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        +{recipe.ingredients.length - 5} more ingredients
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div>
                <h4 className="font-semibold mb-4">Instructions</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {recipe.instructions.slice(0, 3).map((step, index) => (
                    <li key={index} className="text-muted-foreground ml-4">
                      <span className="text-foreground">{step}</span>
                    </li>
                  ))}
                  {recipe.instructions.length > 3 && (
                    <li className="text-center text-muted-foreground mt-2">
                      +{recipe.instructions.length - 3} more steps available in the full recipe
                    </li>
                  )}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
