
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { EditIcon } from 'lucide-react';
import { useProfileSettings } from '@/hooks/use-profile-context';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileHeader() {
  const { user } = useAuth();
  const { profile, isLoading } = useProfileSettings();
  
  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    return name.split(' ')
      .map(part => part[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center text-center">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-5 w-24 mt-4" />
        <Skeleton className="h-4 w-32 mt-1" />
      </div>
    );
  }
  
  const userName = profile?.username || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url;
  const userInitials = getInitials(userName);
  
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || ''} alt={userName} />
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
