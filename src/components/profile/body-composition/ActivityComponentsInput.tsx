
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { NutritionPreferencesType } from "@/hooks/use-profile-settings";

export interface ActivityComponentsInputProps {
  preferences: NutritionPreferencesType;
  onChange: (updatedValues: Partial<NutritionPreferencesType>) => void;
}

export function ActivityComponentsInput({ 
  preferences,
  onChange
}: ActivityComponentsInputProps) {
  // Use defaults if properties don't exist
  const activityLevel = preferences.activityLevel || 'moderate';
  const nonExerciseActivity = preferences.nonExerciseActivity || 'moderate';
  const exerciseIntensity = preferences.exerciseIntensity || 'moderate';

  const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
  const NEAT_LEVELS = ['minimal', 'low', 'moderate', 'high', 'very_high'];
  const INTENSITY_LEVELS = ['light', 'moderate', 'challenging', 'intense', 'extreme'];

  const handleActivityChange = (value: number[]) => {
    const level = ACTIVITY_LEVELS[value[0]];
    onChange({
      activityLevel: level
    });
  };

  const handleNEATChange = (value: number[]) => {
    const level = NEAT_LEVELS[value[0]];
    onChange({
      nonExerciseActivity: level
    });
  };

  const handleIntensityChange = (value: number[]) => {
    const level = INTENSITY_LEVELS[value[0]];
    onChange({
      exerciseIntensity: level
    });
  };

  const getActivityIndex = () => {
    return ACTIVITY_LEVELS.indexOf(activityLevel);
  };

  const getNEATIndex = () => {
    return NEAT_LEVELS.indexOf(nonExerciseActivity);
  };

  const getIntensityIndex = () => {
    return INTENSITY_LEVELS.indexOf(exerciseIntensity);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="activity-level">Overall Activity Level</Label>
          <span className="text-sm text-muted-foreground capitalize">
            {activityLevel.replace('_', ' ')}
          </span>
        </div>
        <Slider 
          id="activity-level"
          defaultValue={[getActivityIndex()]} 
          max={4}
          step={1}
          onValueChange={handleActivityChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Sedentary</span>
          <span>Very Active</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="neat-level">Non-exercise Activity (NEAT)</Label>
          <span className="text-sm text-muted-foreground capitalize">
            {nonExerciseActivity.replace('_', ' ')}
          </span>
        </div>
        <Slider 
          id="neat-level"
          defaultValue={[getNEATIndex()]} 
          max={4}
          step={1}
          onValueChange={handleNEATChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Minimal</span>
          <span>Very High</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="intensity-level">Workout Intensity</Label>
          <span className="text-sm text-muted-foreground capitalize">
            {exerciseIntensity.replace('_', ' ')}
          </span>
        </div>
        <Slider 
          id="intensity-level"
          defaultValue={[getIntensityIndex()]} 
          max={4}
          step={1}
          onValueChange={handleIntensityChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Light</span>
          <span>Extreme</span>
        </div>
      </div>
    </div>
  );
}
