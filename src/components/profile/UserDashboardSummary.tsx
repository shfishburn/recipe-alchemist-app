
import React from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function UserDashboardSummary() {
  const { profile, isLoading } = useProfile();
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const nutritionPreferences = profile?.nutrition_preferences || {
    dailyCalories: 2000,
    macroSplit: { protein: 30, carbs: 40, fat: 30 },
    healthGoal: 'maintenance',
    dietaryRestrictions: []
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-y-4' : 'grid-cols-3 gap-4'}`}>
          <div>
            <p className="text-sm font-medium mb-1">Daily Calorie Goal</p>
            <div className="text-2xl font-semibold">
              {nutritionPreferences.dailyCalories} kcal
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your {nutritionPreferences.healthGoal} goal
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Macro Split</p>
            <div className="flex space-x-3">
              <div>
                <span className="text-sm text-muted-foreground">P:</span> 
                <span className="font-semibold">{nutritionPreferences.macroSplit.protein}%</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">C:</span> 
                <span className="font-semibold">{nutritionPreferences.macroSplit.carbs}%</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">F:</span> 
                <span className="font-semibold">{nutritionPreferences.macroSplit.fat}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Dietary Preferences</p>
            <div className="flex flex-wrap gap-2">
              {nutritionPreferences.dietaryRestrictions && nutritionPreferences.dietaryRestrictions.length > 0 ? (
                nutritionPreferences.dietaryRestrictions.map((restriction, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {restriction}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic">None specified</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserDashboardSummary;
