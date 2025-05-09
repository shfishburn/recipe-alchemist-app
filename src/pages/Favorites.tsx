
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { PageSeo } from '@/components/seo/PageSeo';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/ui/containers';

const Favorites = () => {
  return (
    <PageContainer>
      <PageSeo 
        title="My Favorite Recipes | Recipe Alchemist"
        description="Access your saved favorite recipes for quick reference and meal planning."
        canonicalUrl="https://recipealchemist.com/favorites"
      />
      
      <Navbar />
      <main className="space-y-10 py-6 md:py-10 animate-fadeIn">
        {/* Breadcrumb Navigation */}
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Favorites</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Favorite Recipes</h1>
          <p className="text-base text-muted-foreground mb-8">
            Access your saved favorite recipes for quick reference and meal planning.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Favorite recipe cards will go here */}
        </div>
      </main>
    </PageContainer>
  );
};

export default Favorites;
