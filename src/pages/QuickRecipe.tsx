
import React from 'react';
import { PageSeo } from '@/components/seo/PageSeo';

export default function QuickRecipe() {
  return (
    <>
      <PageSeo 
        title="Quick Recipe Generator | Recipe Alchemy"
        description="Generate quick recipes based on ingredients you have on hand."
      />
      <main>
        <div className="container-page py-12">
          <h1 className="text-3xl font-bold">Quick Recipe Generator</h1>
          {/* Quick recipe content can be added here */}
        </div>
      </main>
    </>
  );
}
