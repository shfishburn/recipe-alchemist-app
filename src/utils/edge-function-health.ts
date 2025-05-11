import { supabase } from '@/integrations/supabase/client';

// Store the last known health state of each edge function
const edgeFunctionHealthState: Record<string, {
  available: boolean;
  lastChecked: number;
  retryAfter: number;
}> = {};

// Check if an edge function is available (with caching)
export const checkEdgeFunctionHealth = async (
  functionName: string,
  recheckAfter = 60000 // Default: recheck after 1 minute
): Promise<boolean> => {
  const now = Date.now();
  const healthData = edgeFunctionHealthState[functionName];
  
  // If we have recent health data and it's still valid, use it
  if (healthData && (now - healthData.lastChecked) < recheckAfter) {
    return healthData.available;
  }
  
  // If function was down recently, enforce a retry timeout
  if (healthData && !healthData.available && (now - healthData.lastChecked) < healthData.retryAfter) {
    console.log(`Edge function ${functionName} was recently unavailable, waiting before retry`);
    return false;
  }
  
  try {
    // Send a lightweight health check to the function
    const { data, error } = await supabase.functions.invoke(`${functionName}/health`, {
      method: 'GET'
    });
    
    // Store the health state
    const available = !error && data?.status === 'ok';
    edgeFunctionHealthState[functionName] = {
      available,
      lastChecked: now,
      retryAfter: available ? recheckAfter : 5 * 60000 // 5 minutes if unavailable
    };
    
    if (!available) {
      console.warn(`Edge function ${functionName} is unavailable:`, error);
    }
    
    return available;
  } catch (err) {
    console.error(`Health check failed for ${functionName}:`, err);
    
    // Store the failed state
    edgeFunctionHealthState[functionName] = {
      available: false,
      lastChecked: now,
      retryAfter: 5 * 60000 // 5 minutes before retry
    };
    
    return false;
  }
};

// Check if an edge function is likely working
export const isEdgeFunctionAvailable = (functionName: string): boolean => {
  const healthData = edgeFunctionHealthState[functionName];
  
  // If we have no data, assume it's available
  if (!healthData) return true;
  
  // Otherwise, return the last known state
  return healthData.available;
};

// Mark an edge function as unavailable when we encounter errors
export const markEdgeFunctionUnavailable = (functionName: string): void => {
  edgeFunctionHealthState[functionName] = {
    available: false,
    lastChecked: Date.now(),
    retryAfter: 5 * 60000 // 5 minutes before retry
  };
};
