import React from 'react';
import { ArticlesList } from '@/components/how-it-works/ArticlesList';
import { PageSeo } from '@/components/seo/PageSeo';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { PageContainer } from '@/components/ui/containers';

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

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Our Science', current: true }
  ];

  return (
    <PageContainer>
      <PageSeo 
        title="Our Science: AI-Powered Cooking & Nutrition | Recipe Alchemist"
        description="Discover how Recipe Alchemist uses AI and food science to transform your cooking experience with precise nutrition tracking, intelligent substitutions, and science-backed cooking insights."
        keywords="AI cooking, smart recipes, nutrition tracking, USDA FoodData, recipe substitutions, nutrient absorption, healthy cooking, intelligent cooking, meal planning, diet tracking, personalized nutrition, health goals"
        canonicalUrl="https://recipealchemist.com/how-it-works"
        ogType="website"
        ogImage="https://recipealchemist.com/images/how-it-works-banner.jpg"
        structuredData={schemaData}
      />
      
      <div className="spacing-y-responsive">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav items={breadcrumbItems} />
        
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Our Science</h1>
          <p className="text-base text-muted-foreground mb-8">
            Explore how Recipe Alchemist combines AI and food science to transform your cooking experience with science-backed nutrition insights.
          </p>
        </div>
        
        <ArticlesList />
      </div>
    </PageContainer>
  );
};

export default HowItWorks;
