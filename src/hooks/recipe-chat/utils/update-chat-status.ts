
import { supabase } from '@/integrations/supabase/client';
import type { ChatMessage } from '@/types/chat';

export async function updateChatStatus(chatMessage: ChatMessage) {
  const { error } = await supabase
    .from('recipe_chats')
    .update({ applied: true })
    .eq('id', chatMessage.id);

  if (error) throw error;
}
