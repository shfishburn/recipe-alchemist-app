
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

const Favorites = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PageSeo 
        title="My Favorite Recipes | Recipe Alchemist"
        description="Access your saved favorite recipes for quick reference and meal planning."
        canonicalUrl="https://recipealchemist.com/favorites"
      />
      
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4" aria-label="Breadcrumb">
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
          </nav>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Favorite Recipes</h1>
          <p className="text-base text-muted-foreground mb-8">
            Access your saved favorite recipes for quick reference and meal planning.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Favorite recipe cards will go here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Favorites;
