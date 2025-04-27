
import React, { useState, useRef } from 'react';
import { MessageInput } from "@chatscope/chat-ui-kit-react";
import { Image, Link, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecipeChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: () => void;
  isSending: boolean;
  onUpload?: (file: File) => void;
  onUrlSubmit?: (url: string) => void;
}

export function RecipeChatInput({
  message,
  setMessage,
  onSubmit,
  isSending,
  onUpload,
  onUrlSubmit
}: RecipeChatInputProps) {
  const [isUrlMode, setIsUrlMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      if (isUrlMode && onUrlSubmit) {
        onUrlSubmit(message);
      } else {
        onSubmit();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const toggleUrlMode = () => {
    setIsUrlMode(!isUrlMode);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="pt-4">
      <div className="flex gap-2 items-end">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        
        <div className="flex-1 relative">
          <MessageInput
            value={message}
            onChange={(val) => setMessage(val)}
            placeholder={
              isUrlMode
                ? "Paste a recipe URL here..."
                : "Ask about cooking science, techniques, or modifications..."
            }
            attachButton={false}
            sendButton={false}
            className="rounded-2xl bg-white dark:bg-gray-800"
          />
          
          <div className="absolute right-2 bottom-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn("h-8 w-8", isUrlMode && "hidden")}
            >
              <Image className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={toggleUrlMode}
              className="h-8 w-8"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          type="submit"
          size="icon"
          disabled={isSending || !message.trim()}
          className="h-10 w-10"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          )}
        </Button>
      </div>
    </form>
  );
}
