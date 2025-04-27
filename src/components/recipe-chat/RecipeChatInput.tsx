
import React, { useState, useRef } from 'react';
import { MessageInput, AttachmentButton, SendButton } from "@chatscope/chat-ui-kit-react";
import { Image, Link } from 'lucide-react';

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
            className="rounded-2xl bg-white"
          />
          
          <div className="absolute right-2 bottom-2 flex gap-1">
            <AttachmentButton
              onClick={() => fileInputRef.current?.click()}
              style={{ display: isUrlMode ? 'none' : 'flex' }}
            >
              <Image className="h-4 w-4" />
            </AttachmentButton>
            
            <AttachmentButton onClick={toggleUrlMode}>
              <Link className="h-4 w-4" />
            </AttachmentButton>
          </div>
        </div>

        <SendButton 
          onClick={handleSubmit}
          disabled={isSending || !message.trim()}
        />
      </div>
    </form>
  );
}
