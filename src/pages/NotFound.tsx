
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageSeo } from "@/components/seo/PageSeo";
import { PageContainer } from '@/components/ui/containers';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageContainer>
      <PageSeo 
        title="Page Not Found | Recipe Alchemist"
        description="Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist."
        ogType="website"
      />
      
      <main className="space-y-10 py-6 md:py-10 animate-fadeIn flex items-center justify-center">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-base text-muted-foreground mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Return to Home
          </Link>
        </div>
      </main>
    </PageContainer>
  );
};

export default NotFound;
