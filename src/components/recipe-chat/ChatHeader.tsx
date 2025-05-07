
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ChatHeaderProps {
  hasChatHistory: boolean;
  onClearChat: () => void;
}

export function ChatHeader({ hasChatHistory, onClearChat }: ChatHeaderProps) {
  if (!hasChatHistory) return null;
  
  return (
    <div className="flex justify-between items-center">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onClearChat}
        className="text-xs sm:text-sm"
      >
        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        Clear Chat
      </Button>
    </div>
  );
}
