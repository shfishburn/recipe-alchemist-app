
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type AppAvatarProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  src?: string;
  fallback?: string;
  role?: 'user' | 'ai';
  className?: string;
};

export function AppAvatar({ 
  size = 'md', 
  src, 
  fallback, 
  role = 'user',
  className
}: AppAvatarProps) {
  // Size mappings
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };
  
  // Role-based colors
  const roleClasses = {
    user: 'bg-primary text-primary-foreground',
    ai: 'bg-green-600 text-white'
  };
  
  // Default fallback text based on role
  const defaultFallback = role === 'user' ? 'U' : 'AI';
  
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src && <AvatarImage src={src} alt={role === 'user' ? 'User avatar' : 'AI avatar'} />}
      <AvatarFallback className={roleClasses[role]}>
        {fallback || defaultFallback}
      </AvatarFallback>
    </Avatar>
  );
}
