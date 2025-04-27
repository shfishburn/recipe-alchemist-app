
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileBasicInfo } from '@/components/profile/ProfileBasicInfo';
import { NutritionPreferences } from '@/components/profile/NutritionPreferences';
import { DietaryPreferences } from '@/components/profile/DietaryPreferences';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container-page py-8">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-6">
            <ProfileHeader />
            <div className="w-full">
              <h1 className="text-3xl font-bold mb-6">Profile</h1>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition Goals</TabsTrigger>
                  <TabsTrigger value="dietary">Dietary Preferences</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                  <ProfileBasicInfo user={user} profileData={null} />
                </TabsContent>
                <TabsContent value="nutrition">
                  <NutritionPreferences 
                    preferences={{
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
                    }}
                    onSave={() => {}}
                  />
                </TabsContent>
                <TabsContent value="dietary">
                  <DietaryPreferences 
                    preferences={{
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
                    }}
                    onSave={() => {}}
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

export default ProfilePage;
