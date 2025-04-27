
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const ProfileHeader = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: 'Success',
        description: 'Successfully logged out',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full md:w-auto">
      <CardContent className="pt-6 pb-4 flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Profile" />
          ) : (
            <UserCircle className="h-24 w-24 text-muted-foreground" />
          )}
        </Avatar>
        <h2 className="text-xl font-semibold">{profile?.username || user?.email}</h2>
        <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          className="w-full"
          type="button"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );
};
