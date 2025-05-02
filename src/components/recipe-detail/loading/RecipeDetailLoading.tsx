
import React from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/ui/navbar';

export function RecipeDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-4 sm:py-8">
          <div className="flex justify-center my-8 sm:my-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </main>
    </div>
  );
}
