
import React from 'react';

/**
 * Skeleton component for the chat while it's loading
 */
export function ChatSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* User message placeholder */}
      <div className="flex justify-end">
        <div className="bg-gray-200 rounded-lg p-4 max-w-[80%]">
          <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-40"></div>
        </div>
      </div>
      
      {/* AI response placeholder */}
      <div className="flex justify-start">
        <div className="bg-gray-200 rounded-lg p-4 max-w-[80%]">
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-64 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-52 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-40"></div>
        </div>
      </div>
      
      {/* Another user message placeholder */}
      <div className="flex justify-end">
        <div className="bg-gray-200 rounded-lg p-4 max-w-[80%]">
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-36"></div>
        </div>
      </div>
    </div>
  );
}
