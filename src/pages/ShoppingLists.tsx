
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { ShoppingListsContainer } from '@/components/shopping-list/ShoppingListsContainer';

const ShoppingLists = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-6 md:py-8 pb-16 sm:pb-20">
          <ShoppingListsContainer />
        </div>
      </main>
    </div>
  );
};

export default ShoppingLists;
