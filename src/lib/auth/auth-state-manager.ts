
// Import required modules
import { v4 as uuidv4 } from 'uuid';

// Define action types that can be pending authentication
export type PendingActionType = 'save-recipe' | 'generate-recipe' | 'other';

// Interface for pending actions
interface PendingAction {
  id: string;
  type: PendingActionType;
  data: Record<string, any>;
  timestamp: number;
  sourceUrl?: string;
  executed: boolean;
}

// Interface for redirect data
interface RedirectData {
  pathname: string;
  search?: string;
  hash?: string;
  state?: Record<string, any>;
}

// Interface for recipe backup
interface RecipeBackup {
  recipe: Record<string, any>;
  timestamp: number;
  sourceUrl?: string;
}

/**
 * Manager for handling auth state and pending actions
 * This helps with maintaining state across auth flows
 */
class AuthStateManager {
  private storagePrefix = 'recipe_auth_';
  
  /**
   * Queue a new action that requires authentication
   */
  queueAction(action: Omit<PendingAction, 'id' | 'timestamp' | 'executed'>): string {
    try {
      const id = uuidv4();
      const pendingAction: PendingAction = {
        id,
        ...action,
        timestamp: Date.now(),
        executed: false
      };
      
      // Get current actions and add the new one
      const actions = this.getPendingActions();
      actions.push(pendingAction);
      
      // Store updated actions
      localStorage.setItem(
        `${this.storagePrefix}pending_actions`, 
        JSON.stringify(actions)
      );
      
      return id;
    } catch (error) {
      console.error('Failed to queue action:', error);
      return '';
    }
  }
  
  /**
   * Get all pending actions
   */
  getPendingActions(): PendingAction[] {
    try {
      const actionsStr = localStorage.getItem(`${this.storagePrefix}pending_actions`);
      if (!actionsStr) return [];
      
      // Parse and return actions
      return JSON.parse(actionsStr) as PendingAction[];
    } catch (error) {
      console.error('Failed to get pending actions:', error);
      return [];
    }
  }
  
  /**
   * Get the next pending action that hasn't been executed
   */
  getNextPendingAction(): PendingAction | null {
    const actions = this.getPendingActions();
    return actions.find(action => !action.executed) || null;
  }
  
  /**
   * Mark an action as executed
   */
  markActionExecuted(id: string): boolean {
    try {
      const actions = this.getPendingActions();
      const actionIndex = actions.findIndex(action => action.id === id);
      
      if (actionIndex === -1) return false;
      
      // Mark as executed
      actions[actionIndex].executed = true;
      
      // Store updated actions
      localStorage.setItem(
        `${this.storagePrefix}pending_actions`, 
        JSON.stringify(actions)
      );
      
      return true;
    } catch (error) {
      console.error('Failed to mark action as executed:', error);
      return false;
    }
  }
  
  /**
   * Set redirect path to use after authentication
   */
  setRedirectAfterAuth(pathname: string, options?: Partial<Omit<RedirectData, 'pathname'>>): void {
    try {
      const redirectData: RedirectData = {
        pathname,
        ...options
      };
      
      // Store redirect data
      localStorage.setItem(
        `${this.storagePrefix}redirect`, 
        JSON.stringify(redirectData)
      );
    } catch (error) {
      console.error('Failed to set redirect after auth:', error);
    }
  }
  
  /**
   * Get redirect data to use after authentication
   */
  getRedirectAfterAuth(): RedirectData | null {
    try {
      const redirectStr = localStorage.getItem(`${this.storagePrefix}redirect`);
      if (!redirectStr) return null;
      
      // Parse and return redirect data
      return JSON.parse(redirectStr) as RedirectData;
    } catch (error) {
      console.error('Failed to get redirect after auth:', error);
      return null;
    }
  }
  
  /**
   * Clear redirect data
   */
  clearRedirectAfterAuth(): void {
    localStorage.removeItem(`${this.storagePrefix}redirect`);
  }
  
  /**
   * Store recipe data as a fallback mechanism
   * This helps with recovering recipes if primary mechanism fails
   */
  storeRecipeDataFallback(recipe: Record<string, any>, sourceUrl?: string): void {
    try {
      // Special handling for recipe objects
      const backup: RecipeBackup = {
        recipe,
        timestamp: Date.now(),
        sourceUrl: sourceUrl || window.location.pathname
      };
      
      localStorage.setItem(`${this.storagePrefix}recipe_backup`, JSON.stringify(backup));
    } catch (error) {
      console.error('Failed to store recipe fallback:', error);
    }
  }
  
  /**
   * Get stored recipe data from fallback storage
   */
  getRecipeDataFallback(): RecipeBackup | null {
    try {
      const backupStr = localStorage.getItem(`${this.storagePrefix}recipe_backup`);
      if (!backupStr) return null;
      
      return JSON.parse(backupStr) as RecipeBackup;
    } catch (error) {
      console.error('Failed to get recipe fallback:', error);
      return null;
    }
  }
  
  /**
   * Clear recipe data fallback
   * Only clears recipe-specific data, not all auth state
   */
  clearRecipeDataFallback(): void {
    localStorage.removeItem(`${this.storagePrefix}recipe_backup`);
  }
  
  /**
   * Clear all auth-related state
   * Use with caution - typically only on logout
   */
  clearState(): void {
    try {
      // Clear all auth-related items without affecting other localStorage
      const keysToRemove = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove identified keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear auth state:', error);
    }
  }
}

// Create and export singleton instance
export const authStateManager = new AuthStateManager();

export default authStateManager;
