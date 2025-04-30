import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useProfileSettings, NutritionPreferencesType } from "@/hooks/use-profile-settings";
import { Loader2 } from "lucide-react";
import { MacroSplitInput } from "./body-composition/MacroSplitInput";
import { WeightGoalInput } from "./body-composition/WeightGoalInput";
import { ActivityComponentsInput } from "./body-composition/ActivityComponentsInput";

export function BodyComposition() {
  const { user, profile } = useAuth();
  const { 
    nutritionPreferences, 
    setNutritionPreferences, 
    saveNutritionPreferences, 
    isSaving 
  } = useProfileSettings();
  
  const handleNutritionSave = async (updatedPreferences: NutritionPreferencesType) => {
    await saveNutritionPreferences({
      ...nutritionPreferences,
      ...updatedPreferences
    });
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {/* Macro Split */}
      <Card>
        <CardHeader>
          <CardTitle>Macro Split</CardTitle>
          <CardDescription>
            Set your preferred macronutrient split
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MacroSplitInput 
            preferences={nutritionPreferences}
            onChange={(values) => {
              setNutritionPreferences({
                ...nutritionPreferences,
                ...values
              });
            }}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => saveNutritionPreferences(nutritionPreferences)} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Macro Split
          </Button>
        </CardFooter>
      </Card>

      {/* Weight Goal */}
      <Card>
        <CardHeader>
          <CardTitle>Weight Goal</CardTitle>
          <CardDescription>
            Set your weight goal and deficit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WeightGoalInput 
            preferences={nutritionPreferences}
            onChange={(values) => {
              setNutritionPreferences({
                ...nutritionPreferences,
                ...values
              });
            }}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => saveNutritionPreferences(nutritionPreferences)} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Weight Goal
          </Button>
        </CardFooter>
      </Card>

        {/* Activity Components */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Components</CardTitle>
            <CardDescription>
              Set your activity levels for more precise calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityComponentsInput 
              preferences={nutritionPreferences} 
              onChange={(values) => {
                setNutritionPreferences({
                  ...nutritionPreferences,
                  ...values
                });
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => saveNutritionPreferences(nutritionPreferences)} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Activity Settings
            </Button>
          </CardFooter>
        </Card>
    </div>
  );
}
