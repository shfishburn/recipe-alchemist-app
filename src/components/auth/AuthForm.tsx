
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthFormProps {
  onSuccess?: () => void;
  standalone?: boolean;
}

interface FormState {
  email: string;
  password: string;
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
      
      const { error, data } = await supabase.auth.signInWithPassword({ 
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
      
      // Clear form
      setLoginForm({ email: '', password: '' });
      
      // If there's a success callback, call it
      if (onSuccess) {
        onSuccess();
      } else {
        // Check for pending actions
        try {
          const pendingSaveData = sessionStorage.getItem('pendingSaveRecipe');
          if (pendingSaveData) {
            const { sourceUrl } = JSON.parse(pendingSaveData);
            if (sourceUrl) {
              navigate(sourceUrl, { 
                state: { 
                  resumingAfterAuth: true,
                  pendingSave: true
                } 
              });
              return;
            }
          }
        } catch (e) {
          console.error("Error checking for pending actions after login:", e);
        }
        
        // Default navigation
        navigate('/');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [loginForm, toast, onSuccess, navigate]);

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
      
      const { error, data } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
      });

      if (error) {
        throw error;
      }

      // Clear form
      setSignupForm({ email: '', password: '' });
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created",
      });
      
      // If there's a success callback, call it
      if (onSuccess) {
        onSuccess();
      } else {
        // Check for pending actions
        try {
          const pendingSaveData = sessionStorage.getItem('pendingSaveRecipe');
          if (pendingSaveData) {
            const { sourceUrl } = JSON.parse(pendingSaveData);
            if (sourceUrl) {
              navigate(sourceUrl, { 
                state: { 
                  resumingAfterAuth: true,
                  pendingSave: true
                } 
              });
              return;
            }
          }
        } catch (e) {
          console.error("Error checking for pending actions after signup:", e);
        }
        
        // Default navigation
        navigate('/');
      }
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [signupForm, toast, onSuccess, navigate]);

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
