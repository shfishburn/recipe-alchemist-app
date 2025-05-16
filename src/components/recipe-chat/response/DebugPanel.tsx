
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { BugIcon, Copy, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import type { ChatMessage, ChangesResponse } from '@/types/chat';

interface DebugPanelProps {
  response: string;
  changesSuggested: ChangesResponse | null;
  messageId?: string;
}

export function DebugPanel({ response, changesSuggested, messageId }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const responseRef = useRef<HTMLPreElement>(null);
  
  // Format JSON for display with syntax highlighting
  const formatJsonOutput = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  // Log debug info when panel opens
  React.useEffect(() => {
    if (isOpen) {
      console.log("[DebugPanel] Viewing debug info for message:", {
        messageId,
        responseSummary: response?.substring(0, 100) + (response?.length > 100 ? "..." : ""),
        hasChanges: !!changesSuggested
      });
    }
  }, [isOpen, messageId, response, changesSuggested]);
  
  // Copy content to clipboard
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setIsCopied(true);
        toast.success("Content copied to clipboard");
        console.log("[DebugPanel] Content copied to clipboard");
        
        // Reset copy icon after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error("[DebugPanel] Failed to copy:", err);
        toast.error("Failed to copy content");
      });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0 rounded-full" 
          title="Debug AI Response"
          onClick={() => {
            console.log("[DebugPanel] Opening debug panel for message:", messageId || "unknown");
          }}
        >
          <BugIcon className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[85vh] w-[calc(100%-2rem)] overflow-hidden p-0 gap-0">
        <DialogHeader className="p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <DialogTitle>AI Response Debug View</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ID: {messageId || "Not available"}
          </p>
        </DialogHeader>
        
        <div className="px-4 sm:px-6 py-4 space-y-4 overflow-hidden">
          <ScrollArea className="h-[calc(85vh-160px)]">
            <div className="space-y-6 pr-4">
              {messageId && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center">
                      Message ID
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => messageId && copyToClipboard(messageId)}
                        title="Copy message ID"
                      >
                        {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </h3>
                  </div>
                  <code className="block p-2 bg-slate-100 rounded overflow-auto whitespace-pre text-xs">
                    {messageId}
                  </code>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Raw Response</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 ml-2"
                    onClick={() => response && copyToClipboard(response)}
                    title="Copy raw response"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    <span className="text-xs">Copy</span>
                  </Button>
                </div>
                <pre 
                  ref={responseRef} 
                  className="block p-2 bg-slate-100 rounded overflow-auto whitespace-pre text-xs max-h-[300px]"
                >
                  {response || "No response data available"}
                </pre>
              </div>
              
              {changesSuggested && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Changes Suggested</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 ml-2"
                      onClick={() => changesSuggested && copyToClipboard(formatJsonOutput(changesSuggested))}
                      title="Copy changes"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      <span className="text-xs">Copy</span>
                    </Button>
                  </div>
                  <pre className="block p-2 bg-slate-100 rounded overflow-auto whitespace-pre text-xs max-h-[300px]">
                    {formatJsonOutput(changesSuggested)}
                  </pre>
                </div>
              )}
              
              <div className="py-4 text-xs text-muted-foreground bg-gray-50 p-3 rounded-md mt-6">
                <h3 className="font-medium mb-1">Debugging Notes</h3>
                <p>
                  This debug panel shows the raw AI response data. Check browser console logs for additional 
                  information about the entire request/response pipeline.
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
