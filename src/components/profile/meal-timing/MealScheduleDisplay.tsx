
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MealScheduleDisplayProps {
  mealSchedule: string[];
  fastingWindow: number;
  mealsPerDay: number;
}

export function MealScheduleDisplay({ mealSchedule, fastingWindow, mealsPerDay }: MealScheduleDisplayProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-4 bg-blue-50 rounded-md space-y-4">
      <h4 className="font-medium">Recommended Meal Schedule:</h4>
      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
        {mealSchedule.map((time, index) => (
          <div key={index} className="bg-white p-3 rounded-md shadow-sm">
            <p className="font-medium">Meal {index + 1}</p>
            <p className="text-lg">{time}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Based on a {fastingWindow}-hour fast with {mealsPerDay} meals during a {24-fastingWindow}-hour eating window.
        Assumes fasting ends at 8:00 AM.
      </p>
    </div>
  );
}
