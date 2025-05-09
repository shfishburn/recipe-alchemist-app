
import React from 'react';
import { PageContainer } from '@/components/ui/containers';
import { Suspense } from 'react';
import ProfilePage from './profile/ProfilePage';

const Profile = () => {
  return (
    <PageContainer>
      <Suspense fallback={<div>Loading profile...</div>}>
        <ProfilePage />
      </Suspense>
    </PageContainer>
  );
};

export default Profile;
