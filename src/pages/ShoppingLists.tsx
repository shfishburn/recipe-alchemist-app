
import React from 'react';
import Navbar from '@/components/ui/navbar';

const ShoppingLists = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          <h1 className="text-3xl font-bold mb-6">Shopping Lists</h1>
          <div className="max-w-4xl mx-auto">
            {/* Shopping lists will go here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingLists;
