
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from 'lucide-react';

interface AuthOverlayProps {
  onLogin: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ onLogin }) => {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Recipe Modification</CardTitle>
        <CardDescription>
          Personalize and improve your recipes with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sign in to modify recipes</h3>
            <p className="text-muted-foreground">
              You must be signed in to use the AI-powered recipe editor. Log in now to unlock personalized tweaks, 
              save your history, and get the most out of your AI Cooking Coach.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onLogin} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </Button>
            <Button onClick={onLogin} variant="outline" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
