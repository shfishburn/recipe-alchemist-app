
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const DefaultSeo = () => {
  return (
    <Helmet>
      <title>Recipe Alchemy - Your Personal Recipe Scientist</title>
      <meta name="description" content="Transform your cooking experience with AI-powered recipe creation and personalization." />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Recipe Alchemy - Your Personal Recipe Scientist" />
      <meta property="og:description" content="Transform your cooking experience with AI-powered recipe creation and personalization." />
      <meta property="og:url" content="https://recipealchemist.com" />
      <meta property="og:image" content="https://recipealchemist.com/lovable-uploads/7d2f98f4-6026-4582-bbe4-e5c69edf0dc9.png" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Recipe Alchemy - Your Personal Recipe Scientist" />
      <meta name="twitter:description" content="Transform your cooking experience with AI-powered recipe creation and personalization." />
      <meta name="twitter:image" content="https://recipealchemist.com/lovable-uploads/7d2f98f4-6026-4582-bbe4-e5c69edf0dc9.png" />
    </Helmet>
  );
};
