
import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/use-auth';
import { Card } from "@/components/ui/card";

const Auth = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/';
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Focus the first input when the component mounts
  useEffect(() => {
    if (!loading && !session && formContainerRef.current) {
      const firstInput = formContainerRef.current.querySelector('input');
      if (firstInput) {
        setTimeout(() => {
          firstInput.focus();
        }, 100);
      }
    }
  }, [loading, session]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Optional: You could navigate away or close some UI element
    }
  };

  // Show a loader while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" aria-live="polite" aria-busy="true">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If already logged in, redirect to home page or the page they came from
  if (session) {
    console.log("Already authenticated, redirecting to", from);
    return <Navigate to={from} replace />;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gray-50" 
      onKeyDown={handleKeyDown}
      ref={formContainerRef}
    >
      <Card 
        className="w-full max-w-md p-6 shadow-lg" 
        role="region" 
        aria-label="Authentication form"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
        <AuthForm standalone={true} />
      </Card>
    </div>
  );
};

export default Auth;
