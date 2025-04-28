
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { ArticleIntelligentCooking } from '@/components/how-it-works/ArticleIntelligentCooking';
import { Helmet } from 'react-helmet';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>How AI Makes Cooking Intelligent - Recipe Alchemist</title>
        <meta 
          name="description" 
          content="Discover how Recipe Alchemist uses AI and real science to make cooking smarter, from precise nutrition tracking to intelligent substitutions and absorption insights." 
        />
        <meta 
          name="keywords" 
          content="AI cooking, smart recipes, nutrition tracking, USDA FoodData, recipe substitutions, nutrient absorption, healthy cooking, intelligent cooking" 
        />
      </Helmet>
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <div className="container-page py-12">
          <h1 className="text-4xl font-bold mb-12 text-center">How It Works</h1>
          <ArticleIntelligentCooking />
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
