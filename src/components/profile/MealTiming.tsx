
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { NutritionPreferencesType } from '@/types/nutrition';
import { MealsPerDaySelect } from './meal-timing/MealsPerDaySelect';
import { FastingWindowSlider } from './meal-timing/FastingWindowSlider';
import { WorkoutTimingInputs } from './meal-timing/WorkoutTimingInputs';
import { MealScheduleDisplay } from './meal-timing/MealScheduleDisplay';
import { InfoPanel } from './meal-timing/InfoPanel';
import { useIsMobile } from '@/hooks/use-mobile';

interface MealTimingProps {
  preferences: NutritionPreferencesType;
  onSave: (details: Partial<NutritionPreferencesType>) => void;
}

export function MealTiming({ preferences, onSave }: MealTimingProps) {
  const isMobile = useIsMobile();
  const mealTiming = preferences.mealTiming || {
    mealsPerDay: 3,
    fastingWindow: 12,
    preworkoutTiming: 60,
    postworkoutTiming: 30,
  };
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      mealsPerDay: mealTiming.mealsPerDay,
      fastingWindow: mealTiming.fastingWindow,
      preworkoutTiming: mealTiming.preworkoutTiming,
      postworkoutTiming: mealTiming.postworkoutTiming,
    }
  });
  
  const fastingWindow = watch('fastingWindow');
  const mealsPerDay = watch('mealsPerDay');
  
  const handleFastingChange = (value: number[]) => {
    setValue('fastingWindow', value[0]);
  };

  const handleMealsPerDayChange = (value: number) => {
    setValue('mealsPerDay', value);
  };
  
  const onSubmit = (data: any) => {
    onSave({
      mealTiming: {
        mealsPerDay: parseInt(data.mealsPerDay),
        fastingWindow: data.fastingWindow,
        preworkoutTiming: parseInt(data.preworkoutTiming),
        postworkoutTiming: parseInt(data.postworkoutTiming),
      }
    });
  };
  
  const generateMealSchedule = () => {
    const feedingWindow = 24 - fastingWindow;
    const mealInterval = feedingWindow / mealsPerDay;
    
    const fastingEnd = 8;
    let schedule = [];
    
    for (let i = 0; i < mealsPerDay; i++) {
      const mealTime = fastingEnd + (i * mealInterval);
      const hour = Math.floor(mealTime);
      const minute = Math.round((mealTime - hour) * 60);
      
      let formattedHour = hour % 12;
      if (formattedHour === 0) formattedHour = 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedMinute = minute.toString().padStart(2, '0');
      
      schedule.push(`${formattedHour}:${formattedMinute} ${ampm}`);
    }
    
    return schedule;
  };
  
  const mealSchedule = generateMealSchedule();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal Timing Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <MealsPerDaySelect 
                value={mealsPerDay} 
                onChange={handleMealsPerDayChange} 
              />
              
              <FastingWindowSlider 
                value={fastingWindow} 
                onChange={handleFastingChange} 
              />
            </div>
            
            <WorkoutTimingInputs register={register} errors={errors} />
          </div>
          
          <MealScheduleDisplay 
            mealSchedule={mealSchedule}
            fastingWindow={fastingWindow}
            mealsPerDay={mealsPerDay}
          />
          
          <InfoPanel />
          
          <div className="flex justify-end">
            <Button type="submit">Save Meal Timing</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
