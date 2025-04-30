import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BodyFatPercentileDisplay } from './body-composition/BodyFatPercentileDisplay';
import { ActivityComponentsInput } from './body-composition/ActivityComponentsInput';
import { AdaptationTracker } from './body-composition/AdaptationTracker';
import { MATADORSchedule } from './body-composition/MATADORSchedule';
import { WeightProjections } from './body-composition/WeightProjections';
import { WeightDisplay } from '@/components/ui/unit-display';
import { convertWeightFromKg, kgToLbs } from '@/utils/unit-conversion';
import type { NutritionPreferencesType } from '@/types/nutrition';

interface BodyCompositionProps {
  preferences: NutritionPreferencesType;
  onSave: (preferences: NutritionPreferencesType) => void;
}

export function BodyComposition({ preferences, onSave }: BodyCompositionProps) {
  const bodyComp = preferences.bodyComposition || {};
  const unitSystem = preferences.unitSystem || 'metric';
  
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      bodyFatPercentage: bodyComp.bodyFatPercentage || '',
      leanMass: bodyComp.leanMass || '',
      fatMass: bodyComp.fatMass || '',
      enableMATADOR: preferences.matadorProtocol?.enabled || false,
      dietPhaseLength: preferences.matadorProtocol?.dietPhaseLength || 28,
      breakPhaseLength: preferences.matadorProtocol?.breakPhaseLength || 14,
    }
  });

  const weight = preferences.personalDetails?.weight || 0;
  const displayWeight = unitSystem === 'imperial' ? kgToLbs(weight) : weight;
  const weightUnit = unitSystem === 'metric' ? 'kg' : 'lbs';
  
  const bodyFatPercentage = watch('bodyFatPercentage');
  
  // Calculate lean mass and fat mass when body fat percentage changes
  React.useEffect(() => {
    if (weight && bodyFatPercentage) {
      const bfp = parseFloat(bodyFatPercentage.toString());
      if (!isNaN(bfp)) {
        const fatMass = Math.round((weight * bfp / 100) * 10) / 10;
        const leanMass = Math.round((weight - fatMass) * 10) / 10;
        
        setValue('fatMass', fatMass);
        setValue('leanMass', leanMass);
      }
    }
  }, [bodyFatPercentage, weight, setValue]);

  const onSubmit = (data: any) => {
    const updatedPreferences = {
      ...preferences,
      bodyComposition: {
        bodyFatPercentage: parseFloat(data.bodyFatPercentage.toString()),
        leanMass: parseFloat(data.leanMass.toString()),
        fatMass: parseFloat(data.fatMass.toString()),
      },
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

  // Convert lean mass and fat mass for display
  const displayLeanMass = unitSystem === 'imperial' ? kgToLbs(Number(watch('leanMass') || 0)) : Number(watch('leanMass') || 0);
  const displayFatMass = unitSystem === 'imperial' ? kgToLbs(Number(watch('fatMass') || 0)) : Number(watch('fatMass') || 0);

  return (
    <Tabs defaultValue="bodyComposition">
      <TabsList>
        <TabsTrigger value="bodyComposition">Body Composition</TabsTrigger>
        <TabsTrigger value="activity">Activity Level</TabsTrigger>
        <TabsTrigger value="adaptation">Metabolic Adaptation</TabsTrigger>
        <TabsTrigger value="projections">Projections</TabsTrigger>
      </TabsList>
      
      <TabsContent value="bodyComposition">
        <Card>
          <CardHeader>
            <CardTitle>Body Composition Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bodyFatPercentage">Body Fat Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="bodyFatPercentage"
                      type="number"
                      step="0.1"
                      className="flex-1"
                      {...register('bodyFatPercentage', {
                        min: { value: 3, message: 'Minimum 3%' },
                        max: { value: 50, message: 'Maximum 50%' },
                      })}
                    />
                    <span>%</span>
                  </div>
                  {errors.bodyFatPercentage && (
                    <p className="text-sm text-red-500">{errors.bodyFatPercentage.message?.toString()}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="weight"
                      type="number"
                      value={displayWeight}
                      disabled
                      className="flex-1 bg-muted"
                    />
                    <span>{weightUnit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set in the Personal Details tab
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="leanMass">Lean Mass (calculated)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="leanMass"
                      type="number"
                      step="0.1"
                      className="flex-1"
                      value={displayLeanMass}
                      readOnly
                    />
                    <span>{weightUnit}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fatMass">Fat Mass (calculated)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="fatMass"
                      type="number"
                      step="0.1"
                      className="flex-1"
                      value={displayFatMass}
                      readOnly
                    />
                    <span>{weightUnit}</span>
                  </div>
                </div>
              </div>

              {preferences.personalDetails?.gender && preferences.personalDetails?.age && bodyFatPercentage && (
                <BodyFatPercentileDisplay 
                  bodyFatPercentage={parseFloat(bodyFatPercentage.toString())} 
                  gender={preferences.personalDetails.gender}
                  age={preferences.personalDetails.age}
                />
              )}
              
              <div className="flex justify-end">
                <Button type="submit">Save Body Composition</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="activity">
        <ActivityComponentsInput 
          preferences={preferences}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="adaptation">
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
      </TabsContent>
      
      <TabsContent value="projections">
        <WeightProjections
          preferences={preferences}
        />
      </TabsContent>
    </Tabs>
  );
}
