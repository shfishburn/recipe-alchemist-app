
import React from 'react';
import { PageSeo } from '@/components/seo/PageSeo';

// Assuming we need a simple Home page component to fix the build error
export default function Home() {
  return (
    <>
      <PageSeo 
        title="Recipe Alchemy - AI-Powered Recipe Creation"
        description="Transform your cooking experience with AI-powered recipe creation and personalization."
      />
      <main>
        {/* Home page content can be added here */}
        <div className="container-page py-12">
          <h1 className="text-3xl font-bold">Welcome to Recipe Alchemy</h1>
        </div>
      </main>
    </>
  );
}
