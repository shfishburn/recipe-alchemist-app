
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { MacroBreakdown } from '@/components/recipe-detail/nutrition/MacroBreakdown';
import { MicronutrientsDisplay } from '@/components/recipe-detail/nutrition/MicronutrientsDisplay';
import { NutriScoreDisplay } from '@/components/recipe-detail/nutrition/nutri-score/NutriScoreDisplay';
import { EnhancedNutrition } from '@/components/recipe-detail/nutrition/useNutritionData';
import { formatNutrientWithUnit } from '@/components/ui/unit-display';
import { NUTRITION_COLORS, DAILY_REFERENCE_VALUES } from '@/constants/nutrition';
import { UnitSystem } from '@/stores/unitSystem';
import type { Recipe, NutriScore } from '@/types/recipe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RecipeBlockProps {
  recipeNutrition: EnhancedNutrition;
  unitSystem: UnitSystem;
  nutriScore?: NutriScore;
  recipeId?: string;
  ingredients?: any[];
}

// Define the shape of the data_quality.recommended_macros property
interface RecommendedMacros {
  protein?: number;
  carbs?: number;
  fat?: number;
}

// Extend the data_quality type to include recommended_macros
interface NutritionDataQuality {
  overall_confidence: "high" | "medium" | "low";
  overall_confidence_score: number;
  recommended_macros?: RecommendedMacros;
}

// Define verification status type
type VerificationStatus = 'none' | 'pending' | 'verified' | 'failed';

export function RecipeBlock({ recipeNutrition, unitSystem, nutriScore, recipeId, ingredients }: RecipeBlockProps) {
  const isMobile = useIsMobile();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('none');
  const [verifiedNutrition, setVerifiedNutrition] = useState<EnhancedNutrition | null>(null);
  
  // Check if nutrition has already been verified
  useEffect(() => {
    if (recipeNutrition?.verification?.verified_at) {
      setVerificationStatus('verified');
      setVerifiedNutrition(recipeNutrition);
    } else {
      setVerificationStatus('none');
      setVerifiedNutrition(null);
    }
  }, [recipeNutrition]);
  
  // Display placeholder if no nutrition data
  if (!recipeNutrition) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Facts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No nutrition information available for this recipe.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Use verified nutrition data if available, otherwise use original
  const nutritionToDisplay = verifiedNutrition || recipeNutrition;
  
  // Extract values and ensure they're numbers and within reasonable limits
  const calories = Math.min(Math.round(nutritionToDisplay.calories || 0), 5000); // Cap at 5000 calories
  const protein = Math.min(Math.round(nutritionToDisplay.protein || 0), 300);    // Cap at 300g protein
  const carbs = Math.min(Math.round(nutritionToDisplay.carbs || 0), 500);        // Cap at 500g carbs
  const fat = Math.min(Math.round(nutritionToDisplay.fat || 0), 300);            // Cap at 300g fat
  const fiber = Math.min(Math.round(nutritionToDisplay.fiber || 0), 100);        // Cap at 100g fiber
  const saturatedFat = Math.min(Math.round(nutritionToDisplay.saturated_fat || 0), 100); // Cap at 100g sat fat
  
  // Calculate daily value percentages based on standard reference values
  // Make sure we cap the values at reasonable percentages
  const proteinDailyValue = Math.min(Math.round((protein / DAILY_REFERENCE_VALUES.protein) * 100), 200);
  const carbsDailyValue = Math.min(Math.round((carbs / DAILY_REFERENCE_VALUES.carbs) * 100), 200);
  const fatDailyValue = Math.min(Math.round((fat / DAILY_REFERENCE_VALUES.fat) * 100), 200);
  const fiberDailyValue = fiber ? Math.min(Math.round((fiber / DAILY_REFERENCE_VALUES.fiber) * 100), 200) : 0;
  const saturatedFatDailyValue = saturatedFat ? Math.min(Math.round((saturatedFat / DAILY_REFERENCE_VALUES.saturated_fat || 20) * 100), 200) : 0;
  
  // Default macros distribution
  let proteinPercentage = 30;
  let carbsPercentage = 40;
  let fatPercentage = 30;
  
  // Safely access recommended_macros with proper type checking
  const dataQuality = nutritionToDisplay.data_quality as NutritionDataQuality | undefined;
  
  if (dataQuality?.recommended_macros) {
    proteinPercentage = dataQuality.recommended_macros.protein || proteinPercentage;
    carbsPercentage = dataQuality.recommended_macros.carbs || carbsPercentage;
    fatPercentage = dataQuality.recommended_macros.fat || fatPercentage;
  }
  
  // Format protein, carbs and fat based on unit system
  const formattedProtein = formatNutrientWithUnit(protein, 'g', unitSystem);
  const formattedCarbs = formatNutrientWithUnit(carbs, 'g', unitSystem);
  const formattedFat = formatNutrientWithUnit(fat, 'g', unitSystem);
  const formattedSaturatedFat = formatNutrientWithUnit(saturatedFat, 'g', unitSystem);
  
  // Function to trigger nutrition verification against USDA API
  const verifyNutritionData = async () => {
    // Check if ingredients are available
    if (!ingredients || ingredients.length === 0 || !recipeId) {
      toast.error("Cannot verify nutrition: Missing ingredients or recipe ID");
      return;
    }
    
    setVerificationStatus('pending');
    toast.info("Verifying nutrition data with USDA FoodData Central...");
    
    try {
      // Prepare ingredients for verification
      const verificationIngredients = ingredients.map(ing => ({
        name: ing.item,
        quantity: ing.qty || 1,
        unit: ing.unit || 'g'
      }));
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('verify-nutrition-data', {
        body: {
          ingredients: verificationIngredients,
          existingNutrition: recipeNutrition,
          recipeId: recipeId
        }
      });
      
      if (error) {
        console.error("Verification error:", error);
        toast.error("Failed to verify nutrition data");
        setVerificationStatus('failed');
        return;
      }
      
      // Handle the verification result
      if (data.verified) {
        setVerifiedNutrition(data.updatedNutrition);
        setVerificationStatus('verified');
        toast.success(`Nutrition data verified! Updated ${data.verificationDetails.verified_nutrients.length} nutrients`);
      } else {
        setVerificationStatus('failed');
        toast.info("No significant updates found in nutrition data");
      }
      
    } catch (err) {
      console.error("Error during nutrition verification:", err);
      setVerificationStatus('failed');
      toast.error("An error occurred during verification");
    }
  };
  
  // Helper to render verification status indicator
  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">Nutrition data verified with USDA FoodData Central on {
                  new Date(nutritionToDisplay.verification?.verified_at || '').toLocaleDateString()
                }</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        
      case 'pending':
        return (
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Verifying...</span>
          </div>
        );
        
      case 'failed':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>Verification failed</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Couldn't verify nutrition data with external sources</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Card>
      <CardHeader className={isMobile ? "px-3 py-3" : "px-6 py-4"}>
        <div className="flex items-center justify-between">
          <CardTitle>Nutrition Facts</CardTitle>
          <div className="flex items-center gap-2">
            {renderVerificationStatus()}
            {verificationStatus !== 'pending' && recipeId && ingredients && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={verifyNutritionData} 
                className="h-7 px-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                <span className="text-xs">Verify</span>
              </Button>
            )}
            <Badge variant="secondary">
              {unitSystem === 'imperial' ? 'US' : 'Metric'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className={isMobile ? "px-3" : "px-6"}>
          {/* NutriScore section */}
          {nutriScore && (
            <>
              <NutriScoreDisplay nutriScore={nutriScore} className="mb-4" />
              <Separator className="mb-4" />
            </>
          )}
          
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">
              <span className="text-lg">{calories}</span> calories
            </p>
            {nutritionToDisplay.verification?.verified_nutrients?.includes('calories') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-blue-500" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">Calories value verified with USDA data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs uppercase text-muted-foreground">Protein</p>
              <p className="text-sm font-medium flex items-center justify-center">
                {formattedProtein}
                {nutritionToDisplay.verification?.verified_nutrients?.includes('protein') && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-blue-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Protein value verified with USDA data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase text-muted-foreground">Carbs</p>
              <p className="text-sm font-medium flex items-center justify-center">
                {formattedCarbs}
                {nutritionToDisplay.verification?.verified_nutrients?.includes('carbs') && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-blue-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Carbs value verified with USDA data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs uppercase text-muted-foreground">Fat</p>
              <p className="text-sm font-medium flex items-center justify-center">
                {formattedFat}
                {nutritionToDisplay.verification?.verified_nutrients?.includes('fat') && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-blue-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Fat value verified with USDA data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </p>
            </div>
          </div>
          
          <Separator className="mb-4" />
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium" id="protein-label">Protein</p>
              <p className="text-xs text-muted-foreground">{proteinDailyValue}% DV</p>
            </div>
            <Progress 
              value={proteinDailyValue} 
              className="h-2" 
              aria-labelledby="protein-label"
              indicatorColor={NUTRITION_COLORS.proteinBg}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium" id="carbs-label">Carbs</p>
              <p className="text-xs text-muted-foreground">{carbsDailyValue}% DV</p>
            </div>
            <Progress 
              value={carbsDailyValue} 
              className="h-2" 
              aria-labelledby="carbs-label"
              indicatorColor={NUTRITION_COLORS.carbsBg}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium" id="fat-label">Fat</p>
              <p className="text-xs text-muted-foreground">{fatDailyValue}% DV</p>
            </div>
            <Progress 
              value={fatDailyValue} 
              className="h-2" 
              aria-labelledby="fat-label"
              indicatorColor={NUTRITION_COLORS.fatBg}
            />
          </div>
          
          {saturatedFat > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-medium" id="saturated-fat-label">Saturated Fat</p>
                  {nutritionToDisplay.verification?.verified_nutrients?.includes('saturated_fat') && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-blue-500" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Verified with USDA FoodData Central</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{saturatedFatDailyValue}% DV</p>
              </div>
              <Progress 
                value={saturatedFatDailyValue} 
                className="h-2" 
                aria-labelledby="saturated-fat-label"
                indicatorColor={NUTRITION_COLORS.satFatBg || "#FF6B6B"}
              />
            </div>
          )}
          
          {fiber && fiberDailyValue ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium" id="fiber-label">Fiber</p>
                <p className="text-xs text-muted-foreground">{fiberDailyValue}% DV</p>
              </div>
              <Progress 
                value={fiberDailyValue} 
                className="h-2" 
                aria-labelledby="fiber-label"
                indicatorColor={NUTRITION_COLORS.fiberBg}
              />
            </div>
          ) : null}
          
          <Separator className="my-4" />
          
          <MacroBreakdown 
            protein={protein}
            carbs={carbs}
            fat={fat}
          />
          
          <Separator className="my-4" />
        </div>
        
        <MicronutrientsDisplay 
          nutrition={nutritionToDisplay} 
          unitSystem={unitSystem} 
        />
      </CardContent>
    </Card>
  );
}
