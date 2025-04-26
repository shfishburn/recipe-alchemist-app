
import React from 'react';
import Navbar from '@/components/ui/navbar';

const Recipes = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          <h1 className="text-3xl font-bold mb-6">Browse Recipes</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Recipe cards will go here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recipes;
