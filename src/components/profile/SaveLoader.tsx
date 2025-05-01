
import React from 'react';
import { Loader2 } from 'lucide-react';

interface SaveLoaderProps {
  isSaving: boolean;
  savingText?: string;
  savedText?: string;
  showSuccess?: boolean;
  className?: string;
}

export function SaveLoader({ 
  isSaving, 
  savingText = "Saving...", 
  savedText = "Saved", 
  showSuccess = false,
  className = ""
}: SaveLoaderProps) {
  if (!isSaving && !showSuccess) return null;
  
  return (
    <div className={`flex items-center ${className}`}>
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">{savingText}</span>
        </>
      ) : showSuccess && (
        <span className="text-sm text-green-600 dark:text-green-500">{savedText}</span>
      )}
    </div>
  );
}
