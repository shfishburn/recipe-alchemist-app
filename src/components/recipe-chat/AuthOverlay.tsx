
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from 'lucide-react';

interface AuthOverlayProps {
  onLogin: () => void;
}

export const AuthOverlay: React.FC<AuthOverlayProps> = ({ onLogin }) => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Recipe AI Chat</CardTitle>
        <CardDescription>
          Chat with our AI assistant to improve your recipes
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[300px]">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sign in to use Recipe Chat</h3>
            <p className="text-muted-foreground">
              You must be signed in to use the AI-powered recipe chat. Log in now to ask questions, 
              get cooking tips, and enhance your recipes with professional insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onLogin} className="flex items-center gap-2 touch-active">
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </Button>
            <Button onClick={onLogin} variant="outline" className="flex items-center gap-2 touch-active">
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
