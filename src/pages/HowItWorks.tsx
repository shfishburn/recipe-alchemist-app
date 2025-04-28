import React from 'react';
import Navbar from '@/components/ui/navbar';
import { Helmet } from 'react-helmet';
import { ArticlesList } from '@/components/how-it-works/ArticlesList';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  // Schema.org JSON-LD structured data for better SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does Recipe Alchemist's nutrition analysis work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We don't guess what's in your food — we measure it with real science. Our system pulls data from trusted sources like USDA FoodData Central, adjusts for cooking methods, tracks both macronutrients and vital micronutrients, and personalizes your nutrition to your body's needs."
        }
      },
      {
        "@type": "Question",
        "name": "How does Recipe Alchemist craft smarter recipes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI builds recipes with real food science — using trusted nutrition data, cooking chemistry, and precision techniques to create meals that are not just delicious, but deeply nourishing."
        }
      },
      {
        "@type": "Question",
        "name": "How does Recipe Alchemist align recipes to individual health goals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your body is unique — and your food should be too. We start by understanding your energy needs and nutrition goals, from daily calorie targets to protein, carb, and fat ratios. Every recipe we build then adapts to you, balancing macronutrients and key vitamins and minerals, while weaving in smart ingredient choices that boost nutrient absorption naturally."
        }
      },
      {
        "@type": "Question",
        "name": "How does Recipe Alchemist handle ingredient substitutions?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI suggests perfect substitutions while maintaining flavor profiles and nutrition balance to accommodate dietary needs and preferences."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Our Science: AI-Powered Cooking & Nutrition | Recipe Alchemist</title>
        <meta 
          name="description" 
          content="Discover how Recipe Alchemist uses AI and food science to transform your cooking experience with precise nutrition tracking, intelligent substitutions, and science-backed cooking insights." 
        />
        <meta 
          name="keywords" 
          content="AI cooking, smart recipes, nutrition tracking, USDA FoodData, recipe substitutions, nutrient absorption, healthy cooking, intelligent cooking, meal planning, diet tracking, personalized nutrition, health goals" 
        />
        <link rel="canonical" href="https://recipealchemist.com/how-it-works" />
        <meta property="og:title" content="Our Science: AI-Powered Cooking & Nutrition" />
        <meta property="og:description" content="Discover how our AI uses food science to transform your cooking with precise nutrition tracking and smart substitutions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://recipealchemist.com/how-it-works" />
        <meta property="og:image" content="https://recipealchemist.com/images/how-it-works-banner.jpg" />
        <meta name="twitter:title" content="Our Science: AI-Powered Cooking & Nutrition" />
        <meta name="twitter:description" content="Discover how our AI uses food science to transform your cooking experience." />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <div className="container-page py-8 pb-16 sm:py-10 sm:pb-24">
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
                  <BreadcrumbPage>Our Science</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold mb-4">Our Science</h1>
          <p className="text-base text-muted-foreground mb-8">
            Explore how Recipe Alchemist combines AI and food science to transform your cooking experience with science-backed nutrition insights.
          </p>
          
          <ArticlesList />
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
