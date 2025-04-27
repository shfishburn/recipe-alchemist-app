
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/ui/navbar';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';
import { ProfileBasicInfo } from '@/components/profile/ProfileBasicInfo';
import { NutritionPreferences } from '@/components/profile/NutritionPreferences';
import { DietaryPreferences } from '@/components/profile/DietaryPreferences';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface NutritionPreferencesType {
  dailyCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fat: number;
  };
  dietaryRestrictions: string[];
  allergens: string[];
  healthGoal: string;
  mealSizePreference: string;
  personalDetails?: {
    age?: number;
    weight?: number;
    height?: number;
    gender?: string;
    activityLevel?: string;
  };
  bmr?: number;
  tdee?: number;
  macroDetails?: {
    complexCarbs?: number;
    simpleCarbs?: number;
    saturatedFat?: number;
    unsaturatedFat?: number;
  };
  mealTiming?: {
    mealsPerDay: number;
    fastingWindow: number;
    preworkoutTiming: number;
    postworkoutTiming: number;
  };
  weightGoalType?: 'maintenance' | 'weight-loss' | 'muscle-gain';
  weightGoalDeficit?: number;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<any>(null);
  const [nutritionPreferences, setNutritionPreferences] = useState<NutritionPreferencesType>({
    dailyCalories: 2000,
    macroSplit: {
      protein: 30,
      carbs: 40,
      fat: 30,
    },
    dietaryRestrictions: [],
    allergens: [],
    healthGoal: 'maintenance',
    mealSizePreference: 'medium',
    personalDetails: {
      age: undefined,
      weight: undefined,
      height: undefined,
      gender: undefined,
      activityLevel: 'moderate'
    },
    macroDetails: {
      complexCarbs: 60,
      simpleCarbs: 40,
      saturatedFat: 30,
      unsaturatedFat: 70
    },
    mealTiming: {
      mealsPerDay: 3,
      fastingWindow: 12,
      preworkoutTiming: 60,
      postworkoutTiming: 30
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) throw profileError;
          
          if (profileData) {
            setProfileData(profileData);
            
            // If nutrition preferences exist, load them
            const savedPreferences = profileData.nutrition_preferences;
            if (savedPreferences) {
              // Type assertion with check to ensure it has required properties
              const typedPreferences = savedPreferences as any;
              if (typedPreferences && 
                  typeof typedPreferences === 'object' && 
                  'dailyCalories' in typedPreferences &&
                  'macroSplit' in typedPreferences) {
                setNutritionPreferences({
                  ...nutritionPreferences, // Default values
                  ...typedPreferences as NutritionPreferencesType // Overwrite with saved values
                });
              }
            }
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          toast({
            title: 'Error',
            description: 'Failed to load profile data',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user, toast]);

  const saveNutritionPreferences = async (updatedPreferences: NutritionPreferencesType) => {
    if (!user) return;
    
    try {
      // Calculate BMR and TDEE when saving if personal details are available
      let prefsToSave = { ...updatedPreferences };
      
      if (prefsToSave.personalDetails && 
          prefsToSave.personalDetails.age && 
          prefsToSave.personalDetails.weight && 
          prefsToSave.personalDetails.height && 
          prefsToSave.personalDetails.gender) {
            
        // Calculate BMR using Mifflin-St Jeor Equation
        const { age, weight, height, gender } = prefsToSave.personalDetails;
        
        let bmr = 0;
        if (gender === 'male') {
          // Men: BMR = 10W + 6.25H - 5A + 5
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          // Women: BMR = 10W + 6.25H - 5A - 161
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        // Calculate TDEE based on activity level
        const activityMultipliers: Record<string, number> = {
          'sedentary': 1.2,
          'light': 1.375,
          'moderate': 1.55,
          'active': 1.725,
          'very-active': 1.9
        };
        
        const activityLevel = prefsToSave.personalDetails.activityLevel || 'moderate';
        const tdee = Math.round(bmr * activityMultipliers[activityLevel]);
        
        prefsToSave.bmr = Math.round(bmr);
        prefsToSave.tdee = tdee;
        
        // Update calories based on health goal if auto-calculation is desired
        if (prefsToSave.healthGoal === 'weight-loss') {
          prefsToSave.dailyCalories = Math.round(tdee * 0.8); // 20% deficit
        } else if (prefsToSave.healthGoal === 'muscle-gain') {
          prefsToSave.dailyCalories = Math.round(tdee * 1.15); // 15% surplus
        } else {
          prefsToSave.dailyCalories = tdee; // Maintenance
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          nutrition_preferences: prefsToSave
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setNutritionPreferences(prefsToSave);
      toast({
        title: 'Success',
        description: 'Nutrition preferences saved',
      });
    } catch (error) {
      console.error('Error saving nutrition preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save nutrition preferences',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container-page py-8">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-6">
            <Card className="w-full md:w-auto">
              <CardContent className="pt-6 pb-4 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  {profileData?.avatar_url ? 
                    <img src={profileData.avatar_url} alt="Profile" /> : 
                    <UserCircle className="h-24 w-24 text-muted-foreground" />
                  }
                </Avatar>
                <h2 className="text-xl font-semibold">{profileData?.username || user?.email}</h2>
                <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
              </CardContent>
            </Card>
            <div className="w-full">
              <h1 className="text-3xl font-bold mb-6">Profile</h1>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition Goals</TabsTrigger>
                  <TabsTrigger value="dietary">Dietary Preferences</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <ProfileBasicInfo user={user} profileData={profileData} />
                </TabsContent>
                <TabsContent value="nutrition">
                  <NutritionPreferences 
                    preferences={nutritionPreferences} 
                    onSave={saveNutritionPreferences}
                  />
                </TabsContent>
                <TabsContent value="dietary">
                  <DietaryPreferences 
                    preferences={nutritionPreferences}
                    onSave={(dietary) => {
                      const updated = {...nutritionPreferences, ...dietary};
                      saveNutritionPreferences(updated);
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
