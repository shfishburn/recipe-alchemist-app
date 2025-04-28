
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticlesList } from '@/components/how-it-works/ArticlesList';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>How It Works - Recipe Alchemist</title>
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
          <h1 className="text-4xl font-bold mb-6 text-center">How It Works</h1>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore how Recipe Alchemist combines AI and food science to transform your cooking experience.
          </p>
          
          <ArticlesList />
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
