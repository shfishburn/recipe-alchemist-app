
import { useChatStore } from '@/store/use-chat-store';

/**
 * Migrate existing chat data from localStorage to our Zustand store
 */
export function migrateChatData() {
  try {
    // Look for chat history in localStorage
    const keys = Object.keys(localStorage).filter(key => key.startsWith('recipe-chat-'));
    
    if (keys.length === 0) {
      console.log('No chat data to migrate');
      return;
    }
    
    console.log(`Found ${keys.length} chat histories to migrate`);
    
    // Migrate each chat history
    keys.forEach(key => {
      try {
        // Extract recipe ID from the key
        const recipeId = key.replace('recipe-chat-', '');
        
        // Get chat data
        const chatData = localStorage.getItem(key);
        if (!chatData) return;
        
        // Parse chat data
        const chatHistory = JSON.parse(chatData);
        
        // Skip if not an array or empty
        if (!Array.isArray(chatHistory) || chatHistory.length === 0) return;
        
        console.log(`Migrating ${chatHistory.length} messages for recipe ${recipeId}`);
        
        // Add to store
        chatHistory.forEach(message => {
          useChatStore.getState().addMessage(recipeId, message);
        });
        
        // Remove from localStorage
        localStorage.removeItem(key);
        
        console.log(`Migration complete for ${recipeId}`);
      } catch (error) {
        console.error(`Error migrating chat data for ${key}:`, error);
      }
    });
    
    console.log('Chat data migration complete');
  } catch (error) {
    console.error('Error during chat data migration:', error);
  }
}
