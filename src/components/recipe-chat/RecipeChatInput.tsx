
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image, Link, Loader, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Add visual feedback when typing
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
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
    <form onSubmit={handleSubmit} className="sticky bottom-0 pt-2 sm:pt-4">
      <div className="flex gap-1 sm:gap-2 items-end">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <div className={cn(
          "flex-1 relative transition-all duration-200",
          isFocused ? "ring-2 ring-recipe-blue rounded-2xl" : ""
        )}>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              isUrlMode
                ? "Paste a recipe URL here..."
                : "Ask about cooking science, techniques, or modifications..."
            }
            className={cn(
              "flex-1 bg-white resize-none rounded-2xl pr-16 sm:pr-24 text-sm",
              isMobile && "text-base py-3 min-h-[50px]" // Larger on mobile
            )}
            rows={isMobile ? 2 : 2}
          />
          
          <div className="absolute right-2 bottom-1 sm:bottom-2 flex gap-1 sm:gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "h-8 w-8 sm:h-8 sm:w-8 rounded-full hover:bg-gray-100",
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
              className="h-8 w-8 sm:h-8 sm:w-8 rounded-full hover:bg-gray-100"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSending || !message.trim()}
          className={cn(
            "rounded-full h-10 w-10 sm:h-12 sm:w-12 p-0 bg-[#9b87f5] hover:bg-[#8b77e5] active:bg-[#7b67d5]",
            "transition-all duration-200"
          )}
        >
          {isSending ? (
            <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          ) : (
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>
    </form>
  );
}
