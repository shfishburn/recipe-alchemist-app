
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturedRecipes } from '@/components/landing/FeaturedRecipes';
import { NutritionPreview } from '@/components/landing/NutritionPreview';
import { NutritionEnhancement } from '@/components/landing/NutritionEnhancement';
import { PersonalizedSection } from '@/components/landing/PersonalizedSection';
import { CommunitySection } from '@/components/landing/CommunitySection';
import Footer from '@/components/ui/footer';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  console.log("Rendering Index page");
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedRecipes />
        <NutritionEnhancement />
        <NutritionPreview />
        <PersonalizedSection />
        <CommunitySection />
        <div className="py-16 bg-muted/30">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Start Your Culinary Journey Today</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're looking for quick weeknight dinners or gourmet creations, NutriSynth has you covered. Join our community of food enthusiasts!
            </p>
            <Button asChild size="lg">
              <Link to={user ? "/recipes/create" : "/register"}>
                {user ? "Create My First Recipe" : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
