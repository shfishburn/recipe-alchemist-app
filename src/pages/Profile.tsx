
import React from 'react';
import { Suspense } from 'react';
import Navbar from '@/components/ui/navbar';
import { PageContainer } from '@/components/ui/containers';
import ProfilePage from './profile/ProfilePage';

const Profile = () => {
  return (
    <PageContainer>
      <Navbar />
      <main className="space-y-10 py-6 md:py-10 animate-fadeIn">
        <Suspense fallback={<div>Loading profile...</div>}>
          <ProfilePage />
        </Suspense>
      </main>
    </PageContainer>
  );
};

export default Profile;
