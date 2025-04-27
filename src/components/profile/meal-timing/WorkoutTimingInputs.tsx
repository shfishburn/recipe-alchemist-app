
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface WorkoutTimingInputsProps {
  register: any;
  errors: any;
}

export function WorkoutTimingInputs({ register, errors }: WorkoutTimingInputsProps) {
  return (
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
  );
}
