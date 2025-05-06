
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, MessageCircle } from 'lucide-react';

interface ChatHeaderProps {
  hasChatHistory: boolean;
  onClearChat: () => void;
}

export function ChatHeader({ hasChatHistory, onClearChat }: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <MessageCircle className="h-5 w-5 text-green-600 mr-2" />
        <h2 className="text-lg font-medium text-slate-800">Recipe Chat</h2>
      </div>
      
      {hasChatHistory && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearChat}
          className="text-xs sm:text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Clear Chat
        </Button>
      )}
    </div>
  );
}
