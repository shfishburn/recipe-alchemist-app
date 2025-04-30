
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { addDays, format } from 'date-fns';
import { ChartContainer } from '@/components/ui/chart';
import { convertWeightFromKg } from '@/utils/unit-conversion';
import type { NutritionPreferencesType } from '@/types/nutrition';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeightProjectionsProps {
  preferences: NutritionPreferencesType;
}

export function WeightProjections({ preferences }: WeightProjectionsProps) {
  const isMobile = useIsMobile();
  const unitSystem = preferences.unitSystem || 'metric';
  const weightUnit = unitSystem === 'metric' ? 'kg' : 'lbs';
  
  // Generate projection data based on current settings
  const generateProjectionData = React.useCallback(() => {
    const currentWeight = preferences.personalDetails?.weight;
    const adaptationTracking = preferences.adaptationTracking || {};
    const bodyComposition = preferences.bodyComposition || {};
    const weightGoalDeficit = preferences.weightGoalDeficit || 0;
    
    if (!currentWeight) return [];
    
    const currentDate = new Date();
    const data = [];
    
    // Get starting values
    let weight = currentWeight;
    let fatMass = bodyComposition.fatMass || (currentWeight * 0.25); // Assume 25% body fat if not specified
    let leanMass = bodyComposition.leanMass || (currentWeight * 0.75);
    
    // Calculate adaptation
    const calculateAdaptationForWeek = (week: number) => {
      const baseAdaptation = Math.min(week * 0.5, 15) / 100; // 0.5% per week, max 15%
      return baseAdaptation;
    };
    
    // Calculate TDEE with adaptation
    const calculateTDEEForWeek = (week: number) => {
      if (!preferences.tdee) return 2000;
      const adaptation = calculateAdaptationForWeek(week);
      return preferences.tdee * (1 - adaptation);
    };
    
    // Generate 12 weeks of data
    for (let day = 0; day <= 84; day++) {
      const weekNumber = Math.floor(day / 7);
      const date = addDays(currentDate, day);
      
      // Calculate weight loss based on deficit and adaptation
      if (day > 0 && weightGoalDeficit !== 0) {
        const tdee = calculateTDEEForWeek(weekNumber);
        const actualDeficit = weightGoalDeficit * (1 - calculateAdaptationForWeek(weekNumber));
        
        // Convert calorie deficit to kg (7700 kcal = 1kg)
        const weightLoss = actualDeficit / 7700;
        
        // 75% of weight loss comes from fat, 25% from lean mass
        const fatLoss = weightLoss * 0.75;
        const leanLoss = weightLoss * 0.25;
        
        weight -= weightLoss;
        fatMass -= fatLoss;
        leanMass -= leanLoss;
      }
      
      // Only add data points for each week
      if (day % 7 === 0 || day === 84) {
        // Convert all weight values to the selected unit system
        const displayWeight = convertWeightFromKg(weight, unitSystem);
        const displayFatMass = convertWeightFromKg(fatMass, unitSystem);
        const displayLeanMass = convertWeightFromKg(leanMass, unitSystem);

        data.push({
          day,
          date: format(date, 'MMM d'),
          weight: Math.round(displayWeight * 10) / 10,
          fatMass: Math.round(displayFatMass * 10) / 10,
          leanMass: Math.round(displayLeanMass * 10) / 10,
          // Store original values in kg for potential future conversions
          weightKg: Math.round(weight * 10) / 10,
          fatMassKg: Math.round(fatMass * 10) / 10,
          leanMassKg: Math.round(leanMass * 10) / 10,
          tdee: Math.round(calculateTDEEForWeek(weekNumber)),
          adaptation: Math.round(calculateAdaptationForWeek(weekNumber) * 100)
        });
      }
    }
    
    return data;
  }, [preferences, unitSystem]);
  
  const projectionData = React.useMemo(() => generateProjectionData(), [generateProjectionData]);
  
  if (!preferences.personalDetails?.weight) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weight & Metabolic Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Please complete your Personal Details and Body Composition information to see projections.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight & Metabolic Projections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-base font-medium mb-3">Weight Projection (12 weeks)</h3>
            <ChartContainer className="h-64" config={{
              weight: { color: '#3b82f6' },
              fatMass: { color: '#f97316' },
              leanMass: { color: '#10b981' }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projectionData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis 
                    fontSize={12} 
                    domain={['auto', 'auto']} 
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value} ${weightUnit}`, undefined]}
                    labelFormatter={(label) => `Week ${Math.floor(projectionData.findIndex(d => d.date === label) / 2)}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    name="Weight" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fatMass" 
                    name="Fat Mass" 
                    stroke="#f97316" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leanMass" 
                    name="Lean Mass" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {preferences.tdee && (
            <div>
              <h3 className="text-base font-medium mb-3">Metabolic Adaptation & TDEE</h3>
              <ChartContainer className="h-64" config={{
                tdee: { color: '#8b5cf6' },
                adaptation: { color: '#ef4444' }
              }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={projectionData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis 
                      yAxisId="left" 
                      fontSize={12} 
                      domain={['auto', 'auto']} 
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      fontSize={12}
                      domain={[0, 20]} 
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="tdee" 
                      name="TDEE" 
                      stroke="#8b5cf6"
                      strokeWidth={2} 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="adaptation" 
                      name="Adaptation %" 
                      stroke="#ef4444"
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground space-y-2 bg-blue-50 p-4 rounded-md">
            <p className="font-medium text-foreground">About these projections</p>
            <p>
              These projections are estimates based on your current settings. Actual results may vary
              based on many factors including adherence, activity levels, and individual metabolism.
            </p>
            <p>
              The model accounts for metabolic adaptation, which typically reduces energy expenditure
              during sustained caloric deficits.
            </p>
            {preferences.matadorProtocol?.enabled && (
              <p className="text-green-700">
                Your MATADOR protocol can help mitigate some of this adaptation by including strategic
                diet breaks.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
