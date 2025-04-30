
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
        <title>Login | NutriSynth</title>
      </Helmet>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to NutriSynth</h1>
        <p className="text-center text-muted-foreground">
          Please implement authentication to enable this feature.
        </p>
      </div>
    </div>
  );
};

export default Login;
