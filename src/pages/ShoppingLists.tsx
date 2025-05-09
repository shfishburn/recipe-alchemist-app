
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { ShoppingListsContainer } from '@/components/shopping-list/ShoppingListsContainer';
import { PageContainer } from '@/components/ui/containers';

const ShoppingLists = () => {
  return (
    <PageContainer>
      <Navbar />
      <main className="space-y-10 py-6 md:py-10 animate-fadeIn">
        <ShoppingListsContainer />
      </main>
    </PageContainer>
  );
};

export default ShoppingLists;
