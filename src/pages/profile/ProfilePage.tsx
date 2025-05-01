
import React, { Suspense, lazy } from 'react';
import Navbar from '@/components/ui/navbar';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy-loaded components for better performance
const ProfileHeader = lazy(() => import('./components/ProfileHeader').then(module => ({ default: module.ProfileHeader })));
const UserDashboardSummary = lazy(() => import('@/components/profile/UserDashboardSummary'));
const ProfileBasicInfo = lazy(() => import('@/components/profile/ProfileBasicInfo'));
const BodyAndNutritionTabs = lazy(() => import('@/components/profile/BodyAndNutritionTabs'));
const DietAndMealTabs = lazy(() => import('@/components/profile/DietAndMealTabs'));

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <ProfileProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
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
            
            <div className="w-full mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">My Profile</h1>
              <p className="text-base text-muted-foreground mb-6">
                Manage your personal information, nutrition goals, and dietary preferences to customize your cooking experience.
              </p>
              
              <Suspense fallback={<ProfileSkeleton />}>
                {/* Dashboard Summary */}
                <UserDashboardSummary />

                {/* Main Profile Content */}
                <Tabs defaultValue="account" className="mt-8">
                  <TabsList className="mb-6">
                    <TabsTrigger value="account">Account Information</TabsTrigger>
                    <TabsTrigger value="body-nutrition">Body & Nutrition</TabsTrigger>
                    <TabsTrigger value="diet-meal">Diet & Meal Planning</TabsTrigger>
                  </TabsList>

                  {/* Account Information Tab */}
                  <TabsContent value="account">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-shrink-0 flex justify-center md:block">
                            <Suspense fallback={<div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse" />}>
                              <ProfileHeader />
                            </Suspense>
                          </div>
                          <div className="flex-grow">
                            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                            <Suspense fallback={<ProfileSkeleton />}>
                              <ProfileBasicInfo />
                            </Suspense>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Body & Nutrition Tab */}
                  <TabsContent value="body-nutrition">
                    <Suspense fallback={<ProfileSkeleton />}>
                      <BodyAndNutritionTabs />
                    </Suspense>
                  </TabsContent>

                  {/* Diet & Meal Planning Tab */}
                  <TabsContent value="diet-meal">
                    <Suspense fallback={<ProfileSkeleton />}>
                      <DietAndMealTabs />
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </ProfileProvider>
  );
};

export default ProfilePage;
