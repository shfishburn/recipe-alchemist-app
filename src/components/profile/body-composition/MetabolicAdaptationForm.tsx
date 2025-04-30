
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdaptationTracker } from './AdaptationTracker';
import { MATADORSchedule } from './MATADORSchedule';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface MetabolicAdaptationFormProps {
  preferences: NutritionPreferencesType;
  onSave: (updatedPrefs: NutritionPreferencesType) => void;
}

export function MetabolicAdaptationForm({ preferences, onSave }: MetabolicAdaptationFormProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      enableMATADOR: preferences.matadorProtocol?.enabled || false,
      dietPhaseLength: preferences.matadorProtocol?.dietPhaseLength || 28,
      breakPhaseLength: preferences.matadorProtocol?.breakPhaseLength || 14,
    }
  });
  
  const onSubmit = (data: any) => {
    const updatedPreferences = {
      ...preferences,
      matadorProtocol: {
        enabled: data.enableMATADOR,
        dietPhaseLength: parseInt(data.dietPhaseLength.toString()),
        breakPhaseLength: parseInt(data.breakPhaseLength.toString()),
        currentPhase: preferences.matadorProtocol?.currentPhase || 'diet',
        phaseStartDate: preferences.matadorProtocol?.phaseStartDate || new Date().toISOString(),
        schedule: preferences.matadorProtocol?.schedule || [],
      }
    };
    
    onSave(updatedPreferences);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metabolic Adaptation Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-medium mb-2">MATADOR Protocol</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The MATADOR protocol alternates between periods of caloric deficit and maintenance 
              to mitigate metabolic adaptation during weight loss.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  id="enableMATADOR"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  {...register('enableMATADOR')}
                />
                <Label htmlFor="enableMATADOR">Enable MATADOR Protocol</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dietPhaseLength">Deficit Phase Length</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="dietPhaseLength"
                      type="number"
                      className="flex-1"
                      min={7}
                      max={42}
                      {...register('dietPhaseLength')}
                    />
                    <span>days</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="breakPhaseLength">Maintenance Phase Length</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="breakPhaseLength"
                      type="number"
                      className="flex-1"
                      min={7}
                      max={21}
                      {...register('breakPhaseLength')}
                    />
                    <span>days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <AdaptationTracker 
            preferences={preferences}
          />
          
          {preferences.matadorProtocol?.enabled && (
            <MATADORSchedule
              dietPhaseLength={preferences.matadorProtocol.dietPhaseLength}
              breakPhaseLength={preferences.matadorProtocol.breakPhaseLength}
              currentPhase={preferences.matadorProtocol.currentPhase}
              phaseStartDate={preferences.matadorProtocol.phaseStartDate}
            />
          )}
          
          <div className="flex justify-end">
            <Button type="submit">Save Adaptation Settings</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
