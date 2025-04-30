
import React from 'react';
import { Helmet } from 'react-helmet-async';

const RecipeDetails = () => {
  return (
    <div className="container-page py-8">
      <Helmet>
        <title>Recipe Details | NutriSynth</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Recipe Details</h1>
      <p className="text-muted-foreground">
        Recipe details content will be displayed here.
      </p>
    </div>
  );
};

export default RecipeDetails;
