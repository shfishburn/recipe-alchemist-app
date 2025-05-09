import React from 'react';
import Navbar from '@/components/ui/navbar';
import { PageSeo } from '@/components/seo/PageSeo';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { PageContainer } from '@/components/ui/containers';

const Favorites = () => {
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Favorites', current: true }
  ];
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <PageSeo 
          title="My Favorite Recipes | Recipe Alchemist"
          description="Access your saved favorite recipes for quick reference and meal planning."
          canonicalUrl="https://recipealchemist.com/favorites"
        />
        
        <div className="spacing-y-responsive">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNav items={breadcrumbItems} />
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Favorite Recipes</h1>
            <p className="text-base text-muted-foreground mb-8">
              Access your saved favorite recipes for quick reference and meal planning.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Favorite recipe cards will go here */}
          </div>
        </div>
      </PageContainer>
    </>
  );
};

export default Favorites;
