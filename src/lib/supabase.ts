
import { createClient } from '@supabase/supabase-js';

// Project configuration constants
const supabaseUrl = 'https://zjyfumqfrtppleftpzjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeWZ1bXFmcnRwcGxlZnRwempkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODc1NjQsImV4cCI6MjA2MTI2MzU2NH0.Yx7Hq4jUTL8U9u1nSyBJlbNCUeH4u2TQwuyCYTnnrSI';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

// Helper to handle Supabase database errors
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error);
  throw new Error(`Database ${operation} failed: ${error.message || 'Unknown error'}`);
};
