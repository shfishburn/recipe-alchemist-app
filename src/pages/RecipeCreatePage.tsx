
import React from 'react';
import { Helmet } from 'react-helmet-async';

const RecipeCreatePage = () => {
  return (
    <div className="container-page py-8">
      <Helmet>
        <title>Create Recipe | NutriSynth</title>
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Create New Recipe</h1>
      <p className="text-muted-foreground">
        Recipe creation form will be displayed here.
      </p>
    </div>
  );
};

export default RecipeCreatePage;
