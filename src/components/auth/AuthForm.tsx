
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  onSuccess?: () => void;
  standalone?: boolean;
}

const AuthForm = ({ onSuccess, standalone = false }: AuthFormProps) => {
  // Separate states for login and signup forms
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Refs for auto-focusing first input field
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const signupEmailRef = useRef<HTMLInputElement>(null);

  // Focus management when tab changes
  useEffect(() => {
    if (activeTab === 'login' && loginEmailRef.current) {
      loginEmailRef.current.focus();
    } else if (activeTab === 'signup' && signupEmailRef.current) {
      signupEmailRef.current.focus();
    }
  }, [activeTab]);

  // Handle tab change - reset errors and update focus
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'signup');
  };

  // Form validation
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateLoginForm = (): boolean => {
    if (!validateEmail(loginEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    if (!validatePassword(loginPassword)) {
      toast({
        title: "Invalid Password",
        description: "Password should be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateSignupForm = (): boolean => {
    if (!validateEmail(signupEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    if (!validatePassword(signupPassword)) {
      toast({
        title: "Invalid Password",
        description: "Password should be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    try {
      setLoading(true);
      
      if (type === 'LOGIN') {
        if (!validateLoginForm()) {
          setLoading(false);
          return;
        }

        const { error, data } = await supabase.auth.signInWithPassword({ 
          email: loginEmail, 
          password: loginPassword 
        });
        
        if (error) throw error;
        
        console.log("Login successful:", data);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/');
        }
        
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
      } else {
        if (!validateSignupForm()) {
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({ 
          email: signupEmail, 
          password: signupPassword 
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Please check your email to confirm your account",
        });
      }
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
  };

  // Handle keyboard events - submit on Enter, close on Escape
  const handleKeyDown = (e: React.KeyboardEvent, type: 'LOGIN' | 'SIGNUP') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAuth(type);
    }
  };

  // Form submission handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAuth('LOGIN');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAuth('SIGNUP');
  };

  // Toggle password visibility
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };

  const toggleSignupPasswordVisibility = () => {
    setShowSignupPassword(!showSignupPassword);
  };

  const FormContent = () => (
    <Tabs 
      defaultValue="login" 
      value={activeTab}
      onValueChange={handleTabChange} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <Label htmlFor="login-email-input">Email</Label>
            <Input
              id="login-email-input"
              ref={loginEmailRef}
              type="email"
              placeholder="you@example.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-1"
              onKeyDown={(e) => handleKeyDown(e, 'LOGIN')}
              aria-label="Email address for login"
            />
          </div>
          <div>
            <Label htmlFor="login-password-input">Password</Label>
            <div className="relative">
              <Input
                id="login-password-input"
                type={showLoginPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-1 pr-10"
                onKeyDown={(e) => handleKeyDown(e, 'LOGIN')}
                aria-label="Password for login"
              />
              <button
                type="button"
                onClick={toggleLoginPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1} // Exclude from tab order as it's a helper
                aria-label={showLoginPassword ? "Hide password" : "Show password"}
              >
                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="signup">
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <Label htmlFor="signup-email-input">Email</Label>
            <Input
              id="signup-email-input"
              ref={signupEmailRef}
              type="email"
              placeholder="you@example.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-1"
              onKeyDown={(e) => handleKeyDown(e, 'SIGNUP')}
              aria-label="Email address for sign up"
            />
          </div>
          <div>
            <Label htmlFor="signup-password-input">Password</Label>
            <div className="relative">
              <Input
                id="signup-password-input"
                type={showSignupPassword ? "text" : "password"}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="mt-1 pr-10"
                onKeyDown={(e) => handleKeyDown(e, 'SIGNUP')}
                aria-label="Create a password for sign up"
              />
              <button
                type="button"
                onClick={toggleSignupPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1} // Exclude from tab order
                aria-label={showSignupPassword ? "Hide password" : "Show password"}
              >
                {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );

  if (standalone) {
    return <FormContent />;
  }

  return (
    <Card className="w-full max-w-md p-6">
      <FormContent />
    </Card>
  );
};

export default AuthForm;
