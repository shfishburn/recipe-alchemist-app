
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
            const savedPreferences = profileData.nutrition_preferences as NutritionPreferencesType;
            if (savedPreferences) {
              setNutritionPreferences(savedPreferences);
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
      const { error } = await supabase
        .from('profiles')
        .update({
          nutrition_preferences: updatedPreferences
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setNutritionPreferences(updatedPreferences);
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
