
import React, { useState } from 'react';
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

const AuthForm = ({ onSuccess, standalone = false }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Enhanced input change handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (type === 'LOGIN') {
        const { error, data } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
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
        const { error } = await supabase.auth.signUp({ 
          email, 
          password 
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

  // Prevent form submission from bubbling
  const handleSubmit = (e: React.FormEvent, type: 'LOGIN' | 'SIGNUP') => {
    e.preventDefault();
    e.stopPropagation();
    handleAuth(type);
  };

  // Set explicit id attributes to ensure uniqueness and avoid conflicts
  const loginEmailId = "login-email-input";
  const loginPasswordId = "login-password-input";
  const signupEmailId = "signup-email-input";
  const signupPasswordId = "signup-password-input";

  const FormContent = () => (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={(e) => handleSubmit(e, 'LOGIN')} className="space-y-4">
          <div>
            <Label htmlFor={loginEmailId}>Email</Label>
            <Input
              id={loginEmailId}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={loginPasswordId}>Password</Label>
            <Input
              id={loginPasswordId}
              type="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              required
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="signup">
        <form onSubmit={(e) => handleSubmit(e, 'SIGNUP')} className="space-y-4">
          <div>
            <Label htmlFor={signupEmailId}>Email</Label>
            <Input
              id={signupEmailId}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={signupPasswordId}>Password</Label>
            <Input
              id={signupPasswordId}
              type="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              required
              className="mt-1"
            />
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
