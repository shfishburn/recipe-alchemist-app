
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { EditIcon } from 'lucide-react';

interface ProfileHeaderProps {
  profileData: any;
  isLoading: boolean;
}

export function ProfileHeader({ profileData, isLoading }: ProfileHeaderProps) {
  const { user } = useAuth();
  
  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    return name.split(' ')
      .map(part => part[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const userName = profileData?.username || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profileData?.avatar_url;
  const userInitials = getInitials(userName);
  
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
      </Avatar>
      
      <h2 className="mt-4 text-lg font-medium">{userName}</h2>
      
      <p className="text-sm text-muted-foreground mt-1">
        {user?.email}
      </p>
      
      <Button variant="outline" size="sm" className="mt-4">
        <EditIcon className="mr-2 h-4 w-4" />
        Edit Profile
      </Button>
    </div>
  );
}
