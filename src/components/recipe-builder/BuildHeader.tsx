
// Note: I'm making changes to BuildHeader since it contains the page heading
// that needs to be left-aligned. The file isn't included in the provided files,
// but since there are references to it in Build.tsx, I will update it based on
// what I can infer about its structure.

// If this component doesn't match the actual structure, 
// we'll need to make adjustments to Build.tsx itself instead.

import React from 'react';

const BuildHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">My Lab</h1>
      <p className="text-base text-muted-foreground mb-8">
        Create personalized recipes tailored to your nutritional needs and flavor preferences with our AI-powered recipe builder.
      </p>
    </div>
  );
};

export default BuildHeader;
