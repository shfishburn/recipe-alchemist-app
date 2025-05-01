
import React, { useState, useRef, useEffect } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  
  // Add visual feedback when typing
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

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
    setTimeout(() => textareaRef.current?.focus(), 50);
  };
  
  // Handle touch events for better feedback
  const handleTouchStart = () => {
    setIsTouched(true);
  };
  
  const handleTouchEnd = () => {
    setTimeout(() => setIsTouched(false), 200);
  };
  
  // Adjust height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [message]);

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
          "flex-1 relative transition-all duration-200 hw-accelerated",
          isFocused ? "ring-2 ring-recipe-blue rounded-2xl" : "",
          isTouched ? "scale-[0.99] opacity-95" : ""
        )}>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            placeholder={
              isUrlMode
                ? "Paste a recipe URL here..."
                : "Ask about cooking science, techniques, or modifications..."
            }
            className={cn(
              "flex-1 bg-white resize-none rounded-2xl pr-16 sm:pr-24 text-sm tap-highlight-none",
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
                "h-8 w-8 sm:h-8 sm:w-8 rounded-full hover:bg-gray-100 touch-active",
                isUrlMode && "hidden"
              )}
            >
              <Image className="h-4 w-4" />
              <span className="touch-ripple" />
            </Button>
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={toggleUrlMode}
              className="h-8 w-8 sm:h-8 sm:w-8 rounded-full hover:bg-gray-100 touch-active"
            >
              <Link className="h-4 w-4" />
              <span className="touch-ripple" />
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSending || !message.trim()}
          className={cn(
            "rounded-full h-10 w-10 sm:h-12 sm:w-12 p-0 bg-[#9b87f5] hover:bg-[#8b77e5] active:bg-[#7b67d5]",
            "transition-all duration-200 hw-accelerated relative overflow-hidden"
          )}
        >
          {isSending ? (
            <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          ) : (
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
          <span className="touch-ripple" />
        </Button>
      </div>
    </form>
  );
}
