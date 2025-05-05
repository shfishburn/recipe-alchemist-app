
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from 'lucide-react';

interface UserMessageProps {
  message: string;
  isOptimistic?: boolean;
}

export function UserMessage({ message, isOptimistic = false }: UserMessageProps) {
  return (
    <div className={`flex items-start space-x-2 ${isOptimistic ? 'opacity-70' : ''}`}>
      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <User className="h-5 w-5 text-primary-foreground" />
      </div>
      
      <div className="flex-1">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm text-foreground whitespace-pre-wrap break-words">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export function UserMessageSkeleton() {
  return (
    <div className="flex items-start space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>
  );
}
