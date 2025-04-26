
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { useAuth } from '@/hooks/use-auth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          <h1 className="text-3xl font-bold mb-6">Profile</h1>
          <div className="max-w-2xl mx-auto">
            {/* Profile form will go here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
