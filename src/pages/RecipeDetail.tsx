
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';

const RecipeDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          <h1 className="text-3xl font-bold mb-6">Recipe Details</h1>
          {/* Recipe details will go here */}
        </div>
      </main>
    </div>
  );
};

export default RecipeDetail;
