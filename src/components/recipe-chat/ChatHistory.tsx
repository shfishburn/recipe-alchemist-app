
import React from 'react';
import { ChatMessage } from '@/types/chat';
import { Recipe } from '@/types/recipe';

interface ChatHistoryProps {
  chatHistory: ChatMessage[];
  optimisticMessages: ChatMessage[];
  isSending: boolean;
  setMessage: (message: string) => void;
  applyChanges: (recipe: Recipe, message: ChatMessage) => Promise<boolean>;
  isApplying: boolean;
  recipe: Recipe;
  retryMessage: (originalMessage: string, originalMessageId: string) => void;
}

export function ChatHistory({
  chatHistory,
  optimisticMessages,
  isSending,
  setMessage,
  applyChanges,
  isApplying,
  recipe,
  retryMessage
}: ChatHistoryProps) {
  // This is a placeholder component that will be implemented in the future
  return (
    <div className="space-y-4">
      {chatHistory.map((message, index) => (
        <div key={index} className="p-2 border-b">
          <div className={`font-medium ${message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
            {message.role === 'user' ? 'You' : 'Assistant'}
          </div>
          <div className="mt-1">{message.content}</div>
          {message.role === 'user' && (
            <button 
              onClick={() => retryMessage(message.content, message.id)}
              className="text-xs text-gray-500 hover:text-gray-700 mt-1"
            >
              Retry
            </button>
          )}
        </div>
      ))}
      
      {optimisticMessages.map((message, index) => (
        <div key={`optimistic-${index}`} className="p-2 border-b opacity-50">
          <div className={`font-medium ${message.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
            {message.role === 'user' ? 'You' : 'Assistant'}
          </div>
          <div className="mt-1">{message.content}</div>
        </div>
      ))}
      
      {isSending && (
        <div className="p-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="mt-1 h-10 bg-gray-100 rounded w-3/4"></div>
        </div>
      )}
    </div>
  );
}
