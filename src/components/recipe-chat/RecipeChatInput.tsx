
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image, Link, Loader, Send } from 'lucide-react';
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
    e.stopPropagation();
    if (message.trim()) {
      if (isUrlMode && onUrlSubmit) {
        onUrlSubmit(message);
      } else {
        onSubmit();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    setMessage(e.target.value);
  };

  const toggleUrlMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUrlMode(!isUrlMode);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-0 pt-4">
      <div className="flex gap-2 items-end">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={handleMessageChange}
            placeholder={
              isUrlMode
                ? "Paste a recipe URL here..."
                : "Ask about cooking science, techniques, or modifications..."
            }
            className="flex-1 bg-white resize-none rounded-2xl pr-24"
            rows={2}
          />
          
          <div className="absolute right-2 bottom-2 flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className={cn(
                "h-8 w-8 rounded-full hover:bg-gray-100",
                isUrlMode && "hidden"
              )}
            >
              <Image className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={toggleUrlMode}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSending || !message.trim()}
          className="rounded-full h-10 w-10 p-0 bg-[#9b87f5] hover:bg-[#8b77e5]"
        >
          {isSending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
