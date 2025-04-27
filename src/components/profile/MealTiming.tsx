import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface MealTimingProps {
  preferences: NutritionPreferencesType;
  onSave: (details: Partial<NutritionPreferencesType>) => void;
}

export function MealTiming({ preferences, onSave }: MealTimingProps) {
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
              <div className="space-y-2">
                <Label htmlFor="mealsPerDay">Meals Per Day</Label>
                <Select
                  onValueChange={(value) => setValue('mealsPerDay', parseInt(value))}
                  defaultValue={mealsPerDay.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of meals" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 meals</SelectItem>
                    <SelectItem value="3">3 meals</SelectItem>
                    <SelectItem value="4">4 meals</SelectItem>
                    <SelectItem value="5">5 meals</SelectItem>
                    <SelectItem value="6">6 meals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="fastingWindow">Fasting Window</Label>
                  <span className="text-sm font-medium">{fastingWindow} hours</span>
                </div>
                <Slider 
                  id="fastingWindow" 
                  value={[fastingWindow]} 
                  min={8}
                  max={16}
                  step={1}
                  onValueChange={handleFastingChange} 
                />
                <p className="text-xs text-muted-foreground">
                  Time spent not eating each day (e.g., 16:8 intermittent fasting = 16 hour fast)
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preworkoutTiming">Pre-Workout Meal Timing</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="preworkoutTiming"
                    type="number"
                    className="w-24"
                    {...register('preworkoutTiming', {
                      min: { value: 30, message: '30 minutes minimum' },
                      max: { value: 180, message: '3 hours maximum' },
                    })}
                  />
                  <span>minutes before workout</span>
                </div>
                {errors.preworkoutTiming && (
                  <p className="text-sm text-red-500">{errors.preworkoutTiming.message?.toString()}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postworkoutTiming">Post-Workout Meal Timing</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="postworkoutTiming"
                    type="number"
                    className="w-24"
                    {...register('postworkoutTiming', {
                      min: { value: 0, message: 'Must be 0 or greater' },
                      max: { value: 120, message: '2 hours maximum' },
                    })}
                  />
                  <span>minutes after workout</span>
                </div>
                {errors.postworkoutTiming && (
                  <p className="text-sm text-red-500">{errors.postworkoutTiming.message?.toString()}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md space-y-4">
            <h4 className="font-medium">Recommended Meal Schedule:</h4>
            <div className="grid grid-cols-3 gap-4">
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
          
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <h4 className="font-medium mb-2">Why this matters:</h4>
            <p className="text-sm text-muted-foreground">
              Meal timing can significantly impact energy levels, workout performance, and recovery.
              Intermittent fasting may have health benefits including improved insulin sensitivity and cellular repair processes.
              Pre and post-workout nutrition is crucial for performance and muscle recovery.
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">Save Meal Timing</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
