import React, { useEffect, useState } from 'react';
import Navbar from '@/components/ui/navbar';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileBasicInfo } from '@/components/profile/ProfileBasicInfo';
import { NutritionPreferences } from '@/components/profile/NutritionPreferences';
import { DietaryPreferences } from '@/components/profile/DietaryPreferences';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { NutritionPreferencesType } from '@/types/nutrition';
import { Json } from '@/integrations/supabase/types';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  // Fetch user profile data
  useEffect(() => {
    if (!user?.id) return;
    
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: 'Error',
            description: 'Failed to load profile data',
            variant: 'destructive'
          });
          return;
        }
        
        setProfileData(data);
        
        // Set nutrition preferences if available
        if (data.nutrition_preferences) {
          try {
            // Convert nutrition_preferences to NutritionPreferencesType using type assertion
            const nutritionData = data.nutrition_preferences as unknown as NutritionPreferencesType;
            setNutritionPreferences({
              ...nutritionPreferences,
              ...nutritionData
            });
          } catch (err) {
            console.error('Error parsing nutrition preferences:', err);
          }
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProfileData();
  }, [user?.id]);

  const saveNutritionPreferences = async (prefs: NutritionPreferencesType) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nutrition_preferences: prefs as unknown as Json
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating nutrition preferences:', error);
        toast({
          title: 'Error',
          description: 'Failed to save nutrition preferences',
          variant: 'destructive'
        });
        return;
      }
      
      setNutritionPreferences(prefs);
      toast({
        title: 'Success',
        description: 'Nutrition preferences saved'
      });
    } catch (err) {
      console.error('Save error:', err);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      });
    }
  };

  const saveDietaryPreferences = async (prefs: Partial<NutritionPreferencesType>) => {
    if (!user?.id) return;
    
    const updatedPreferences = {
      ...nutritionPreferences,
      ...prefs
    };
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nutrition_preferences: updatedPreferences as unknown as Json
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating dietary preferences:', error);
        toast({
          title: 'Error',
          description: 'Failed to save dietary preferences',
          variant: 'destructive'
        });
        return;
      }
      
      setNutritionPreferences(updatedPreferences);
      toast({
        title: 'Success',
        description: 'Dietary preferences saved'
      });
    } catch (err) {
      console.error('Save error:', err);
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container-page py-6 md:py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4" aria-label="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>
          
          <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
            <ProfileHeader profileData={profileData} isLoading={isLoading} />
            <div className="w-full">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">My Profile</h1>
              <p className="text-base text-muted-foreground mb-6 md:mb-8">
                Manage your personal information, nutrition goals, and dietary preferences to customize your cooking experience.
              </p>
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : (
                <Tabs defaultValue="nutrition" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="nutrition">Nutrition Goals</TabsTrigger>
                    <TabsTrigger value="dietary">Dietary Preferences</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic">
                    <ProfileBasicInfo 
                      user={user} 
                      profileData={profileData}
                      onUpdate={(data) => setProfileData({...profileData, ...data})} 
                    />
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
                      onSave={saveDietaryPreferences}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
