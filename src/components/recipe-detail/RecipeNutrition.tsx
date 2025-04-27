import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NutritionChart } from './nutrition/NutritionChart';
import type { Recipe } from '@/hooks/use-recipe-detail';
import type { NutritionPreferencesType } from '@/pages/Profile';

interface RecipeNutritionProps {
  recipe: Recipe;
}

export function RecipeNutrition({ recipe }: RecipeNutritionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [compareToPreferences, setCompareToPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState<NutritionPreferencesType | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && compareToPreferences) {
      const fetchUserPreferences = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('nutrition_preferences')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data?.nutrition_preferences && 
              typeof data.nutrition_preferences === 'object' && 
              'dailyCalories' in data.nutrition_preferences &&
              'macroSplit' in data.nutrition_preferences) {
            setUserPreferences(data.nutrition_preferences as NutritionPreferencesType);
          }
        } catch (error) {
          console.error('Error fetching nutrition preferences:', error);
        }
      };
      
      fetchUserPreferences();
    }
  }, [user, compareToPreferences]);
  
  if (!recipe.nutrition) return null;
  
  const nutrition = recipe.nutrition;
  const servingSize = recipe.servings || 1;
  
  const caloriesPerServing = nutrition.kcal ? Math.round(nutrition.kcal / servingSize) : undefined;
  const proteinPerServing = nutrition.protein_g ? Math.round(nutrition.protein_g / servingSize) : undefined;
  const carbsPerServing = nutrition.carbs_g ? Math.round(nutrition.carbs_g / servingSize) : undefined;
  const fatPerServing = nutrition.fat_g ? Math.round(nutrition.fat_g / servingSize) : undefined;
  
  const dailyValuePercentages = userPreferences && compareToPreferences ? {
    calories: caloriesPerServing ? Math.round((caloriesPerServing / userPreferences.dailyCalories) * 100) : 0,
    protein: proteinPerServing ? Math.round((proteinPerServing / ((userPreferences.dailyCalories * userPreferences.macroSplit.protein / 100) / 4)) * 100) : 0,
    carbs: carbsPerServing ? Math.round((carbsPerServing / ((userPreferences.dailyCalories * userPreferences.macroSplit.carbs / 100) / 4)) * 100) : 0,
    fat: fatPerServing ? Math.round((fatPerServing / ((userPreferences.dailyCalories * userPreferences.macroSplit.fat / 100) / 9)) * 100) : 0
  } : null;
  
  let macroDetails = null;
  if (userPreferences?.macroDetails && compareToPreferences) {
    macroDetails = {
      complexCarbs: carbsPerServing ? Math.round(carbsPerServing * (userPreferences.macroDetails.complexCarbs || 60) / 100) : 0,
      simpleCarbs: carbsPerServing ? Math.round(carbsPerServing * (userPreferences.macroDetails.simpleCarbs || 40) / 100) : 0,
      saturatedFat: fatPerServing ? Math.round(fatPerServing * (userPreferences.macroDetails.saturatedFat || 30) / 100) : 0,
      unsaturatedFat: fatPerServing ? Math.round(fatPerServing * (userPreferences.macroDetails.unsaturatedFat || 70) / 100) : 0,
    };
  }

  const getProgressColor = (percentage: number) => {
    if (percentage <= 33) return "bg-green-500"; 
    if (percentage <= 66) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Info className="h-5 w-5 mr-2 text-recipe-blue" />
              Nutrition
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle nutrition</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Per serving</p>
            
            {user && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="compare-mode"
                  checked={compareToPreferences}
                  onCheckedChange={setCompareToPreferences}
                />
                <Label htmlFor="compare-mode" className="text-sm">Compare to my goals</Label>
              </div>
            )}
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {userPreferences && compareToPreferences ? (
              <Tabs defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  {macroDetails && <TabsTrigger value="details">Details</TabsTrigger>}
                </TabsList>
                <TabsContent value="basic">
                  <ul className="space-y-3">
                    {caloriesPerServing !== undefined && (
                      <li className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span>Calories</span>
                          <div className="text-right">
                            <span className="font-medium">{caloriesPerServing} kcal</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({dailyValuePercentages?.calories}% of daily target)
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={dailyValuePercentages?.calories} 
                          className="h-2" 
                          indicatorClassName={getProgressColor(dailyValuePercentages?.calories || 0)} 
                        />
                      </li>
                    )}
                    {proteinPerServing !== undefined && (
                      <li className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span>Protein</span>
                          <div className="text-right">
                            <span className="font-medium">{proteinPerServing}g</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({dailyValuePercentages?.protein}% of daily target)
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={dailyValuePercentages?.protein} 
                          className="h-2" 
                          indicatorClassName={getProgressColor(dailyValuePercentages?.protein || 0)} 
                        />
                      </li>
                    )}
                    {carbsPerServing !== undefined && (
                      <li className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span>Carbs</span>
                          <div className="text-right">
                            <span className="font-medium">{carbsPerServing}g</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({dailyValuePercentages?.carbs}% of daily target)
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={dailyValuePercentages?.carbs} 
                          className="h-2" 
                          indicatorClassName={getProgressColor(dailyValuePercentages?.carbs || 0)} 
                        />
                      </li>
                    )}
                    {fatPerServing !== undefined && (
                      <li className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span>Fat</span>
                          <div className="text-right">
                            <span className="font-medium">{fatPerServing}g</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({dailyValuePercentages?.fat}% of daily target)
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={dailyValuePercentages?.fat} 
                          className="h-2" 
                          indicatorClassName={getProgressColor(dailyValuePercentages?.fat || 0)} 
                        />
                      </li>
                    )}
                    {nutrition.fiber_g !== undefined && (
                      <li className="flex justify-between items-center py-1 border-b border-muted">
                        <span>Fiber</span>
                        <span className="font-medium">{Math.round(nutrition.fiber_g / servingSize)}g</span>
                      </li>
                    )}
                    {nutrition.sugar_g !== undefined && (
                      <li className="flex justify-between items-center py-1 border-b border-muted">
                        <span>Sugar</span>
                        <span className="font-medium">{Math.round(nutrition.sugar_g / servingSize)}g</span>
                      </li>
                    )}
                    {nutrition.sodium_mg !== undefined && (
                      <li className="flex justify-between items-center py-1">
                        <span>Sodium</span>
                        <span className="font-medium">{Math.round(nutrition.sodium_mg / servingSize)}mg</span>
                      </li>
                    )}
                  </ul>
                </TabsContent>
                <TabsContent value="chart">
                  <NutritionChart 
                    recipeNutrition={{
                      calories: caloriesPerServing || 0,
                      protein: proteinPerServing || 0,
                      carbs: carbsPerServing || 0,
                      fat: fatPerServing || 0
                    }} 
                    userPreferences={userPreferences}
                  />
                </TabsContent>
                
                {macroDetails && (
                  <TabsContent value="details">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Carbohydrate Breakdown</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-xs text-muted-foreground">Complex Carbs</p>
                            <p className="font-medium">{macroDetails.complexCarbs}g</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.round((macroDetails.complexCarbs / carbsPerServing!) * 100)}% of total carbs
                            </p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-xs text-muted-foreground">Simple Carbs</p>
                            <p className="font-medium">{macroDetails.simpleCarbs}g</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.round((macroDetails.simpleCarbs / carbsPerServing!) * 100)}% of total carbs
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Fat Breakdown</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 p-3 rounded-md">
                            <p className="text-xs text-muted-foreground">Saturated Fat</p>
                            <p className="font-medium">{macroDetails.saturatedFat}g</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.round((macroDetails.saturatedFat / fatPerServing!) * 100)}% of total fat
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-md">
                            <p className="text-xs text-muted-foreground">Unsaturated Fat</p>
                            <p className="font-medium">{macroDetails.unsaturatedFat}g</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {Math.round((macroDetails.unsaturatedFat / fatPerServing!) * 100)}% of total fat
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {userPreferences.bmr && userPreferences.tdee && (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium mb-1">This meal represents:</p>
                          <p className="text-sm">
                            • {Math.round((caloriesPerServing! / userPreferences.bmr) * 100)}% of your Basal Metabolic Rate ({userPreferences.bmr} kcal)
                          </p>
                          <p className="text-sm">
                            • {Math.round((caloriesPerServing! / userPreferences.tdee) * 100)}% of your Total Daily Energy Expenditure ({userPreferences.tdee} kcal)
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            ) : (
              <ul className="space-y-2">
                {caloriesPerServing !== undefined && (
                  <li className="flex justify-between items-center py-1 border-b border-muted">
                    <span>Calories</span>
                    <span className="font-medium text-recipe-blue">{caloriesPerServing} kcal</span>
                  </li>
                )}
                {proteinPerServing !== undefined && (
                  <li className="flex justify-between items-center py-1 border-b border-muted">
                    <span>Protein</span>
                    <span className="font-medium">{proteinPerServing}g</span>
                  </li>
                )}
                {carbsPerServing !== undefined && (
                  <li className="flex justify-between items-center py-1 border-b border-muted">
                    <span>Carbs</span>
                    <span className="font-medium">{carbsPerServing}g</span>
                  </li>
                )}
                {fatPerServing !== undefined && (
                  <li className="flex justify-between items-center py-1 border-b border-muted">
                    <span>Fat</span>
                    <span className="font-medium">{fatPerServing}g</span>
                  </li>
                )}
                {nutrition.fiber_g !== undefined && (
                  <li className="flex justify-between items-center py-1 border-b border-muted">
                    <span>Fiber</span>
                    <span className="font-medium">{Math.round(nutrition.fiber_g / servingSize)}g</span>
                  </li>
                )}
                {nutrition.sugar_g !== undefined && (
                  <li className="flex justify-between items-center py-1 border-b border-muted">
                    <span>Sugar</span>
                    <span className="font-medium">{Math.round(nutrition.sugar_g / servingSize)}g</span>
                  </li>
                )}
                {nutrition.sodium_mg !== undefined && (
                  <li className="flex justify-between items-center py-1">
                    <span>Sodium</span>
                    <span className="font-medium">{Math.round(nutrition.sodium_mg / servingSize)}mg</span>
                  </li>
                )}
              </ul>
            )}
            
            {!user && compareToPreferences === false && (
              <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                <p className="text-muted-foreground">
                  <a href="/profile" className="text-recipe-blue hover:underline">
                    Set up your nutrition preferences
                  </a>{' '}
                  to see how this recipe compares to your daily goals.
                </p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
