import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { authStateManager } from '@/lib/auth/auth-state-manager';

interface AuthFormProps {
  onSuccess?: () => void;
  standalone?: boolean;
}

interface FormState {
  email: string;
  password: string;
}

/**
 * Helper function to extract error message from unknown errors
 */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "An error occurred";
}

/**
 * Login form component, optimized with memoization 
 */
const LoginForm = React.memo(({
  formState,
  loading,
  handleChange,
  handleSubmit
}: {
  formState: FormState;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formState.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';

/**
 * Signup form component, optimized with memoization
 */
const SignupForm = React.memo(({
  formState,
  loading,
  handleChange,
  handleSubmit
}: {
  formState: FormState;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formState.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </div>
    </form>
  );
});

SignupForm.displayName = 'SignupForm';

/**
 * FormContainer component to wrap the auth form content
 */
const FormContainer = React.memo(({
  loginForm,
  signupForm,
  loading,
  handleLoginChange,
  handleSignupChange,
  handleLoginSubmit,
  handleSignupSubmit
}: {
  loginForm: FormState;
  signupForm: FormState;
  loading: boolean;
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignupChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleSignupSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <Tabs defaultValue="login">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <LoginForm 
          formState={loginForm}
          loading={loading}
          handleChange={handleLoginChange}
          handleSubmit={handleLoginSubmit}
        />
      </TabsContent>

      <TabsContent value="signup">
        <SignupForm
          formState={signupForm}
          loading={loading}
          handleChange={handleSignupChange}
          handleSubmit={handleSignupSubmit}
        />
      </TabsContent>
    </Tabs>
  );
});

FormContainer.displayName = 'FormContainer';

/**
 * Main AuthForm component with optimized state management
 */
const AuthForm = ({ onSuccess, standalone = false }: AuthFormProps) => {
  // Separated state for login and signup forms
  const [loginForm, setLoginForm] = useState<FormState>({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState<FormState>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Separate change handlers for each form
  const handleLoginChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSignupChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(() => {
    // Clear form data
    setLoginForm({ email: '', password: '' });
    setSignupForm({ email: '', password: '' });
    
    // Call onSuccess callback if provided
    if (onSuccess) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Auth successful, calling onSuccess callback");
      }
      onSuccess();
      return;
    }
    
    // Otherwise handle navigation and pending actions
    if (process.env.NODE_ENV !== 'production') {
      console.log("Auth successful, checking for pending actions");
    }
    
    // Check for pending actions in authStateManager
    const nextAction = authStateManager.getNextPendingAction();
    if (nextAction && !nextAction.executed) {
      const { type, sourceUrl, data } = nextAction;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("Found pending action:", type, "source:", sourceUrl);
      }
      
      // Don't mark as executed yet - let the destination component handle that
      
      if (type === 'save-recipe' && sourceUrl) {
        navigate(sourceUrl, { 
          state: { 
            resumingAfterAuth: true, // Flag to indicate we're returning after auth
            pendingSave: true
          }
        });
        return;
      } else if (type === 'generate-recipe' && data.formData) {
        navigate(sourceUrl || '/quick-recipe', { 
          state: { 
            resumingGeneration: true, // Flag to indicate we're resuming generation
            recipeData: {
              formData: data.formData,
              path: sourceUrl
            }
          }
        });
        return;
      }
    }
    
    // Check for redirect after auth
    const redirectData = authStateManager.getRedirectAfterAuth();
    if (redirectData) {
      let redirectTo = redirectData.pathname;
      
      // Add search params and hash if they exist
      if (redirectData.search) redirectTo += redirectData.search;
      if (redirectData.hash) redirectTo += redirectData.hash;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("Auth success - redirecting to:", redirectTo);
      }
      
      // Navigate with any stored state - simplified using optional chaining
      const navigationState = redirectData.state ? 
        { ...redirectData.state, resumingAfterAuth: true } : 
        { resumingAfterAuth: true };
      
      navigate(redirectTo, { 
        state: navigationState,
        replace: true
      });
      
      // Clear the redirect after using it
      authStateManager.clearRedirectAfterAuth();
      return;
    }
    
    // Default navigation if no pending redirect
    navigate("/");
  }, [onSuccess, navigate]);

  const handleLoginSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email: loginForm.email, 
        password: loginForm.password 
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      
      // Handle success
      handleAuthSuccess();
      
    } catch (error: unknown) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [loginForm, toast, handleAuthSuccess]);

  const handleSignupSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.email || !signupForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created",
        description: "Your account has been successfully created",
      });
      
      // Handle success
      handleAuthSuccess();
      
    } catch (error: unknown) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [signupForm, toast, handleAuthSuccess]);

  // Handle form container styles based on standalone mode
  const formContainerClasses = standalone
    ? "w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    : "";

  return (
    <div className={formContainerClasses}>
      {standalone && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Welcome</h2>
          <p className="text-gray-500 dark:text-gray-400">Login or create an account</p>
        </div>
      )}
      
      <FormContainer
        loginForm={loginForm}
        signupForm={signupForm}
        loading={loading}
        handleLoginChange={handleLoginChange}
        handleSignupChange={handleSignupChange}
        handleLoginSubmit={handleLoginSubmit}
        handleSignupSubmit={handleSignupSubmit}
      />
    </div>
  );
};

export default AuthForm;
