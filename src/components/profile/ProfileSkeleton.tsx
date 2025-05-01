
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileSkeletonProps {
  type?: 'basic' | 'detailed' | 'nutrition';
}

export function ProfileSkeleton({ type = 'basic' }: ProfileSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      {type === 'basic' && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-1/4 mt-6" />
        </div>
      )}
      
      {type === 'detailed' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-32 w-full" />
          </div>
          
          <Skeleton className="h-10 w-full sm:w-1/3" />
        </div>
      )}
      
      {type === 'nutrition' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-40 w-full" />
          </div>
          
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSkeleton;
