
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BugIcon, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { ChatMessage, ChangesResponse } from '@/types/chat';

interface DebugPanelProps {
  response: string;
  changesSuggested: ChangesResponse | null;
  messageId?: string;
}

export function DebugPanel({ response, changesSuggested, messageId }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Format JSON for display with syntax highlighting
  const formatJsonOutput = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 rounded-full" 
          title="Debug AI Response"
        >
          <BugIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>AI Response Debug View</span>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {messageId && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Message ID</h3>
              <code className="block p-2 bg-slate-100 rounded overflow-auto whitespace-pre text-xs">
                {messageId}
              </code>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Raw Response</h3>
            <code className="block p-2 bg-slate-100 rounded overflow-auto whitespace-pre text-xs max-h-[200px]">
              {response}
            </code>
          </div>
          
          {changesSuggested && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Changes Suggested</h3>
              <code className="block p-2 bg-slate-100 rounded overflow-auto whitespace-pre text-xs max-h-[200px]">
                {formatJsonOutput(changesSuggested)}
              </code>
            </div>
          )}
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>
              This debug panel shows the raw AI response data for debugging purposes.
              Console logs contain additional information.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
