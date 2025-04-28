import React, { useState, useCallback, useRef, useEffect } from 'react';
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

const FormContent = React.memo(({
  formState,
  loading,
  handleChange,
  handleLoginSubmit,
  handleSignupSubmit
}: {
  formState: { email: string; password: string };
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleSignupSubmit: (e: React.FormEvent) => void;
}) => {
  const emailLoginRef = useRef<HTMLInputElement>(null);
  const passwordLoginRef = useRef<HTMLInputElement>(null);
  const emailSignupRef = useRef<HTMLInputElement>(null);
  const passwordSignupRef = useRef<HTMLInputElement>(null);

  return (
    <Tabs defaultValue="login">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={handleLoginSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={handleChange}
                autoComplete="email"
                required
                ref={emailLoginRef}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                ref={passwordLoginRef}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="signup">
        <form onSubmit={handleSignupSubmit}>
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
                ref={emailSignupRef}
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
                ref={passwordSignupRef}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
});

FormContent.displayName = 'FormContent';

const AuthForm = ({ onSuccess, standalone = false }: AuthFormProps) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleLoginSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.email || !formState.password) {
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
        email: formState.email, 
        password: formState.password 
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
  }, [formState, toast, navigate, onSuccess]);

  const handleSignupSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.email || !formState.password) {
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
        email: formState.email, 
        password: formState.password 
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
  }, [formState, toast]);

  if (standalone) {
    return (
      <Card className="w-full max-w-md p-6">
        <FormContent
          formState={formState}
          loading={loading}
          handleChange={handleChange}
          handleLoginSubmit={handleLoginSubmit}
          handleSignupSubmit={handleSignupSubmit}
        />
      </Card>
    );
  }

  return (
    <FormContent
      formState={formState}
      loading={loading}
      handleChange={handleChange}
      handleLoginSubmit={handleLoginSubmit}
      handleSignupSubmit={handleSignupSubmit}
    />
  );
};

export default AuthForm;
