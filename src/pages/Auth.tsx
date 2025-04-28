
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/use-auth';
import { Card } from "@/components/ui/card";

const Auth = () => {
  const { session, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Show a loader while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
        <AuthForm standalone={true} />
      </Card>
    </div>
  );
};

export default Auth;
