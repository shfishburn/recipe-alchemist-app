
import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useRecipeDetail } from '@/hooks/use-recipe-detail';
import { RecipeDisplay } from '@/components/quick-recipe/RecipeDisplay';
import { ApplyChangesSection } from './response/ApplyChangesSection';
import { ResponseFormatter } from './response/ResponseFormatter';
import { useChatMutations } from '@/hooks/recipe-chat/use-chat-mutations';
import { updateRecipe } from '@/hooks/recipe-chat/utils/update-recipe';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';

interface RecipeChatProps {
  recipe: any;
  initialMessage?: string;
}

export function RecipeChat({ recipe, initialMessage }: RecipeChatProps) {
  const [message, setMessage] = useState(initialMessage || '');
  const [appliedMessageIds, setAppliedMessageIds] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const { data: chats } = useQuery({
    queryKey: ['recipe-chats', recipe.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipe_chats')
        .select('*')
        .eq('recipe_id', recipe.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
  
  const mutation = useChatMutations(recipe);
  
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    // Generate a unique ID for the message
    const messageId = Math.random().toString(36).substring(2, 15);
    
    try {
      await mutation.mutateAsync({ message, messageId });
      setMessage('');
    } catch (error: any) {
      console.error("Send message error:", error);
      toast.error("Message Failed", {
        description: error.message || "Failed to send message"
      });
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };
  
  const markMessageApplied = useCallback((messageId: string) => {
    setAppliedMessageIds(prev => [...prev, messageId]);
  }, []);

  const applyChanges = useCallback(
    async (chatMessage: ChatMessageType): Promise<boolean> => {
      try {
        const result = await updateRecipe(recipe, chatMessage);
        queryClient.invalidateQueries({ queryKey: ['recipe', recipe.id] });
        markMessageApplied(chatMessage.id);
        return true;
      } catch (error) {
        console.error('Error applying changes:', error);
        toast.error("Failed to apply changes", {
          description: error instanceof Error ? error.message : 'An unknown error occurred'
        });
        return false;
      }
    },
    [recipe, queryClient, markMessageApplied]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Recipe Display Section */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardContent className="p-4">
            <RecipeDisplay recipe={recipe} />
          </CardContent>
        </Card>
      </div>

      {/* Chat Section */}
      <div>
        <Card className="flex flex-col h-full">
          <CardContent className="relative flex-grow">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                {chats?.map((chat: any) => (
                  <div key={chat.id} className="space-y-2">
                    {/* User Message */}
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="text-sm font-bold">{profile?.username || 'You'}</div>
                        <p className="text-sm text-gray-800">{chat.user_message}</p>
                        <div className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleString()}</div>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/recipe-alchemy-logo.png" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="text-sm font-bold">Recipe AI</div>
                        <ResponseFormatter 
                          response={chat.ai_response} 
                          changesSuggested={chat.changes_suggested} 
                        />
                        <div className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleString()}</div>
                        
                        {/* Apply Changes Section */}
                        {!appliedMessageIds.includes(chat.id) && (
                          <ApplyChangesSection
                            changes={chat.changes_suggested}
                            onApplyChanges={() => applyChanges(chat)}
                            isApplying={mutation.isPending}
                            applied={appliedMessageIds.includes(chat.id)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="w-full flex space-x-2">
              <Input
                type="text"
                placeholder="Ask a question or request a change..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={sendMessage} disabled={mutation.isPending}>
                {mutation.isPending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
