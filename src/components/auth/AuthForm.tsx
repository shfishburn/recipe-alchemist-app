
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

  const FormContent = () => (
    <Tabs defaultValue="login">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <form onSubmit={(e) => { e.preventDefault(); handleAuth('LOGIN'); }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="signup">
        <form onSubmit={(e) => { e.preventDefault(); handleAuth('SIGNUP'); }}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
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

  if (standalone) {
    return (
      <Card className="w-full max-w-md p-6">
        <FormContent />
      </Card>
    );
  }

  return <FormContent />;
};

export default AuthForm;
