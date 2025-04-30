
import React from 'react';
import { Helmet } from 'react-helmet-async';

const ShoppingListDetails = () => {
  return (
    <div className="container-page py-8">
      <Helmet>
        <title>Shopping List Details | NutriSynth</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Shopping List Details</h1>
      <p className="text-muted-foreground">
        Shopping list details content will be displayed here.
      </p>
    </div>
  );
};

export default ShoppingListDetails;
