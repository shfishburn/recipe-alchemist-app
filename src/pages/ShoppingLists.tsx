
import React from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingListsContainer } from '@/components/shopping-list/ShoppingListsContainer';
import { PageContainer } from '@/components/ui/containers';

const ShoppingLists = () => {
  return (
    <PageContainer>
      <div className="space-y-10 py-6 md:py-10 animate-fadeIn">
        <ShoppingListsContainer />
      </div>
    </PageContainer>
  );
};

export default ShoppingLists;
