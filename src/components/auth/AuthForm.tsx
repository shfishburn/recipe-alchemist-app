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
      
      if (error) throw error;
      
      console.log("Login successful:", data);
      
      // Check for redirect path in sessionStorage first, then use onSuccess or navigate to home
      const redirectPath = sessionStorage.getItem('redirectPath');
      if (redirectPath) {
        sessionStorage.removeItem('redirectPath');
        navigate(redirectPath);
      } else if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
      
      toast({
        title: "Success",
        description: "Successfully logged in",
      });
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [loginForm, toast, navigate, onSuccess]);

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
        password: signupForm.password 
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Please check your email to confirm your account",
      });
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [signupForm, toast]);

  const content = (
    <FormContainer
      loginForm={loginForm}
      signupForm={signupForm}
      loading={loading}
      handleLoginChange={handleLoginChange}
      handleSignupChange={handleSignupChange}
      handleLoginSubmit={handleLoginSubmit}
      handleSignupSubmit={handleSignupSubmit}
    />
  );

  if (standalone) {
    return (
      <Card className="w-full max-w-md p-6">
        {content}
      </Card>
    );
  }

  return content;
};

export default AuthForm;
