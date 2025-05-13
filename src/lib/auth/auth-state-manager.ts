
import { Session, User } from '@supabase/supabase-js';
import { QuickRecipe } from '@/types/quick-recipe';

// Version the state schema to allow for future migrations
const AUTH_STATE_VERSION = '1.0.0';
const AUTH_STATE_KEY = 'app_auth_state';

// Define all possible pending action types
export type PendingActionType = 
  | 'save-recipe'
  | 'modify-recipe'
  | 'generate-recipe'
  | 'other';

export interface PendingAction {
  type: PendingActionType;
  timestamp: number;
  data: Record<string, unknown>;
  sourceUrl: string;
  id: string; // Unique id to prevent duplicate execution
  executed: boolean;
}

export interface AuthState {
  version: string;
  redirectAfterAuth?: {
    pathname: string;
    search?: string;
    hash?: string;
    state?: unknown;
  };
  pendingActions: PendingAction[];
  lastActiveTimestamp: number;
}

// Type for the recipe backup in localStorage
export interface RecipeBackup {
  recipe: QuickRecipe;
  timestamp: number;
  sourceUrl: string;
}

/**
 * AuthStateManager provides a unified interface for managing authentication-related state
 * stored in sessionStorage. It handles:
 * - Redirects after authentication
 * - Pending actions that require authentication
 * - State synchronization across tabs
 * - Migration from legacy storage keys
 */
export class AuthStateManager {
  private state: AuthState;
  private broadcastChannel?: BroadcastChannel;

  constructor() {
    // Initialize state
    this.state = this.loadState();
    
    // Set up cross-tab synchronization if supported
    if (typeof BroadcastChannel !== 'undefined') {
      this.setupCrossTabSync();
    }
    
    // Migrate from legacy storage if needed
    this.migrateLegacyState();
  }

  /**
   * Load auth state from storage, or create default state if none exists
   * @returns The loaded auth state or a default state if none exists
   */
  private loadState(): AuthState {
    try {
      const storedState = sessionStorage.getItem(AUTH_STATE_KEY);
      
      if (storedState) {
        const parsed = JSON.parse(storedState) as Partial<AuthState>;
        
        // Ensure we have all required fields with defaults as needed
        return {
          version: parsed.version || AUTH_STATE_VERSION,
          pendingActions: Array.isArray(parsed.pendingActions) ? parsed.pendingActions : [],
          lastActiveTimestamp: parsed.lastActiveTimestamp || Date.now(),
          ...parsed
        };
      }
    } catch (error) {
      console.error('Failed to load auth state from storage:', error);
      // If there's an error, we'll create a fresh state
    }
    
    // Return default state if nothing in storage or error occurred
    return {
      version: AUTH_STATE_VERSION,
      pendingActions: [],
      lastActiveTimestamp: Date.now()
    };
  }

  /**
   * Save current state to storage
   */
  private saveState(): void {
    try {
      // Update the last active timestamp
      this.state.lastActiveTimestamp = Date.now();
      
      // Store the state
      sessionStorage.setItem(AUTH_STATE_KEY, JSON.stringify(this.state));
      
      // Broadcast the change if channel is available
      this.broadcastStateChange();
    } catch (error) {
      console.error('Failed to save auth state to storage:', error);
    }
  }

  /**
   * Set up cross-tab synchronization using BroadcastChannel
   */
  private setupCrossTabSync(): void {
    try {
      this.broadcastChannel = new BroadcastChannel('auth_state_sync');
      
      // Listen for changes from other tabs
      this.broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'auth_state_change') {
          // Update local state without saving to avoid a loop
          this.state = event.data.state;
        }
      };
      
      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        this.broadcastChannel?.close();
      });
    } catch (error) {
      console.error('Failed to set up cross-tab synchronization:', error);
    }
  }

  /**
   * Broadcast state change to other tabs
   */
  private broadcastStateChange(): void {
    try {
      this.broadcastChannel?.postMessage({
        type: 'auth_state_change',
        state: this.state
      });
    } catch (error) {
      console.error('Failed to broadcast state change:', error);
    }
  }

  /**
   * Migrate data from legacy storage keys to the new unified format
   * This ensures backward compatibility with older versions
   */
  private migrateLegacyState(): void {
    try {
      // Check for redirectAfterAuth in legacy storage
      const legacyRedirect = sessionStorage.getItem('redirectAfterAuth');
      if (legacyRedirect) {
        try {
          const redirectData = JSON.parse(legacyRedirect);
          if (!this.state.redirectAfterAuth) {
            this.state.redirectAfterAuth = redirectData;
            // Save the migrated state
            this.saveState();
          }
          // Remove the legacy key after successful migration
          sessionStorage.removeItem('redirectAfterAuth');
        } catch (e) {
          console.error('Failed to migrate legacy redirect data:', e);
        }
      }
      
      // Check for pending recipe save
      const pendingSave = sessionStorage.getItem('pendingSaveRecipe');
      if (pendingSave) {
        try {
          const saveData = JSON.parse(pendingSave);
          const existingAction = this.state.pendingActions.find(a => 
            a.type === 'save-recipe' && a.sourceUrl === saveData.sourceUrl
          );
          
          // Only add if not already present (idempotency)
          if (!existingAction && saveData.recipe) {
            this.queueAction({
              type: 'save-recipe',
              data: { recipe: saveData.recipe },
              sourceUrl: saveData.sourceUrl
            });
          }
          
          // Remove the legacy key after successful migration
          sessionStorage.removeItem('pendingSaveRecipe');
        } catch (e) {
          console.error('Failed to migrate pending save data:', e);
        }
      }
      
      // Check for recipe generation data
      const recipeGeneration = sessionStorage.getItem('recipeGenerationSource');
      if (recipeGeneration) {
        try {
          const generationData = JSON.parse(recipeGeneration);
          const existingAction = this.state.pendingActions.find(a => 
            a.type === 'generate-recipe' && a.data.formData
          );
          
          // Only add if not already present (idempotency)
          if (!existingAction && generationData.formData) {
            this.queueAction({
              type: 'generate-recipe',
              data: { formData: generationData.formData },
              sourceUrl: generationData.path || '/'
            });
          }
          
          // Remove the legacy key after successful migration
          sessionStorage.removeItem('recipeGenerationSource');
        } catch (e) {
          console.error('Failed to migrate recipe generation data:', e);
        }
      }
    } catch (error) {
      console.error('Error during state migration:', error);
    }
  }

  /**
   * Clear all authentication-related state
   * This is typically called during logout to ensure a clean state
   */
  public clearState(): void {
    this.state = {
      version: AUTH_STATE_VERSION,
      pendingActions: [],
      lastActiveTimestamp: Date.now()
    };
    this.saveState();
  }

  /**
   * Set the redirect path to use after successful authentication
   * @param pathname - The path to redirect to after authentication
   * @param options - Optional parameters like search, hash and state
   */
  public setRedirectAfterAuth(pathname: string, options?: { 
    search?: string, 
    hash?: string, 
    state?: unknown 
  }): void {
    this.state.redirectAfterAuth = {
      pathname,
      ...options
    };
    this.saveState();
    console.log('Auth redirect set:', pathname);
  }

  /**
   * Get the stored redirect path
   * @returns The stored redirect path and associated options, or undefined if none exists
   */
  public getRedirectAfterAuth(): AuthState['redirectAfterAuth'] {
    return this.state.redirectAfterAuth;
  }

  /**
   * Clear the stored redirect path
   */
  public clearRedirectAfterAuth(): void {
    if (this.state.redirectAfterAuth) {
      delete this.state.redirectAfterAuth;
      this.saveState();
      console.log('Auth redirect cleared');
    }
  }

  /**
   * Queue an action that requires authentication
   * @param action - The action to queue, without id, timestamp, and executed fields
   * @returns A unique identifier for the queued action
   */
  public queueAction(action: Omit<PendingAction, 'id' | 'timestamp' | 'executed'>): string {
    // Generate a unique ID for this action
    const id = `${action.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the full action object
    const fullAction: PendingAction = {
      ...action,
      id,
      timestamp: Date.now(),
      executed: false
    };
    
    // Add to pending actions
    this.state.pendingActions.push(fullAction);
    this.saveState();
    
    console.log(`Action queued (${action.type}):`, action.sourceUrl);
    return id;
  }

  /**
   * Get all pending actions
   * @returns A copy of the array of pending actions
   */
  public getPendingActions(): PendingAction[] {
    return [...this.state.pendingActions];
  }

  /**
   * Get a specific pending action by ID
   * @param id - The unique identifier of the action to find
   * @returns The pending action with the specified ID, or undefined if not found
   */
  public getPendingActionById(id: string): PendingAction | undefined {
    return this.state.pendingActions.find(action => action.id === id);
  }

  /**
   * Get the next pending action that hasn't been executed
   * @returns The first unexecuted pending action, or undefined if all have been executed
   */
  public getNextPendingAction(): PendingAction | undefined {
    return this.state.pendingActions.find(action => !action.executed);
  }

  /**
   * Mark an action as executed
   * @param id - The unique identifier of the action to mark as executed
   */
  public markActionExecuted(id: string): void {
    const action = this.state.pendingActions.find(a => a.id === id);
    if (action) {
      action.executed = true;
      this.saveState();
      console.log(`Action marked executed:`, id);
    }
  }

  /**
   * Remove a pending action
   * @param id - The unique identifier of the action to remove
   */
  public removePendingAction(id: string): void {
    const initialLength = this.state.pendingActions.length;
    this.state.pendingActions = this.state.pendingActions.filter(action => action.id !== id);
    
    if (initialLength !== this.state.pendingActions.length) {
      this.saveState();
      console.log(`Action removed:`, id);
    }
  }

  /**
   * Clear all pending actions
   */
  public clearPendingActions(): void {
    if (this.state.pendingActions.length > 0) {
      this.state.pendingActions = [];
      this.saveState();
      console.log('All pending actions cleared');
    }
  }

  /**
   * Store recipe data in localStorage as a fallback mechanism
   * This helps with scenarios where sessionStorage might be cleared
   * @param recipeData - The recipe data to store
   */
  public storeRecipeDataFallback(recipeData: QuickRecipe): void {
    try {
      localStorage.setItem('recipe_backup', JSON.stringify({
        recipe: recipeData,
        timestamp: Date.now(),
        sourceUrl: window.location.pathname
      }));
      console.log('Recipe backup stored in localStorage');
    } catch (error) {
      console.error('Failed to store recipe backup:', error);
    }
  }

  /**
   * Retrieve recipe data from localStorage fallback
   * @returns The stored recipe data or null if none exists
   */
  public getRecipeDataFallback(): RecipeBackup | null {
    try {
      const storedData = localStorage.getItem('recipe_backup');
      if (storedData) {
        return JSON.parse(storedData) as RecipeBackup;
      }
    } catch (error) {
      console.error('Failed to retrieve recipe backup:', error);
    }
    return null;
  }

  /**
   * Clear recipe data from localStorage fallback
   */
  public clearRecipeDataFallback(): void {
    try {
      localStorage.removeItem('recipe_backup');
      console.log('Recipe backup cleared from localStorage');
    } catch (error) {
      console.error('Failed to clear recipe backup:', error);
    }
  }
}

// Create and export a singleton instance
export const authStateManager = new AuthStateManager();

// Export a hook for React components
export function useAuthStateManager() {
  return authStateManager;
}
