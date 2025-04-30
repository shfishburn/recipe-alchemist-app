
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface ActivityComponentsInputProps {
  preferences: NutritionPreferencesType;
  onChange: (values: Partial<NutritionPreferencesType>) => void;
}

export function ActivityComponentsInput({ preferences, onChange }: ActivityComponentsInputProps) {
  const activityComponents = preferences.activityComponents || {};
  
  const handleActivityLevelChange = (value: "sedentary" | "light" | "moderate" | "active" | "very_active") => {
    onChange({
      activityComponents: {
        ...activityComponents,
        activityLevel: value,
      }
    });
  };
  
  const handleNonExerciseActivityChange = (value: "minimal" | "low" | "moderate" | "high" | "very_high") => {
    onChange({
      activityComponents: {
        ...activityComponents,
        nonExerciseActivity: value,
      }
    });
  };
  
  const handleExerciseIntensityChange = (value: "light" | "moderate" | "challenging" | "intense" | "extreme") => {
    onChange({
      activityComponents: {
        ...activityComponents,
        exerciseIntensity: value,
      }
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="activity-level">Overall Activity Level</Label>
        <Select
          onValueChange={handleActivityLevelChange}
          value={activityComponents.activityLevel as "sedentary" | "light" | "moderate" | "active" | "very_active" || "moderate"}
        >
          <SelectTrigger id="activity-level">
            <SelectValue placeholder="Select activity level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">Sedentary (office job, minimal movement)</SelectItem>
            <SelectItem value="light">Light Activity (occasional walks)</SelectItem>
            <SelectItem value="moderate">Moderate Activity (regular walks, light exercise)</SelectItem>
            <SelectItem value="active">Active (daily exercise, physical job)</SelectItem>
            <SelectItem value="very_active">Very Active (athlete, heavy labor job)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="non-exercise-activity">Daily Non-Exercise Movement</Label>
        <Select
          onValueChange={handleNonExerciseActivityChange}
          value={activityComponents.nonExerciseActivity as "minimal" | "low" | "moderate" | "high" | "very_high" || "moderate"}
        >
          <SelectTrigger id="non-exercise-activity">
            <SelectValue placeholder="Select non-exercise activity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimal">Minimal (mostly sitting)</SelectItem>
            <SelectItem value="low">Low (some walking)</SelectItem>
            <SelectItem value="moderate">Moderate (regular movement)</SelectItem>
            <SelectItem value="high">High (lots of walking/standing)</SelectItem>
            <SelectItem value="very_high">Very High (constantly moving)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="exercise-intensity">Exercise Intensity</Label>
        <Select
          onValueChange={handleExerciseIntensityChange}
          value={activityComponents.exerciseIntensity as "light" | "moderate" | "challenging" | "intense" | "extreme" || "moderate"}
        >
          <SelectTrigger id="exercise-intensity">
            <SelectValue placeholder="Select exercise intensity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light (walking, yoga)</SelectItem>
            <SelectItem value="moderate">Moderate (jogging, bodyweight exercises)</SelectItem>
            <SelectItem value="challenging">Challenging (running, weight training)</SelectItem>
            <SelectItem value="intense">Intense (HIIT, heavy lifting)</SelectItem>
            <SelectItem value="extreme">Extreme (competitive athlete training)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
