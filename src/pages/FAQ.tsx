
import React from 'react';
import Navbar from '@/components/ui/navbar';
import { Helmet } from 'react-helmet';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  // Schema.org JSON-LD structured data for better SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does Recipe Alchemy personalize nutrition, and how accurate are your macro calculations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When you create a profile, we estimate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on your age, weight, height, biological sex, and activity level — using proven scientific formulas. We then align every recipe with your personal macro targets (protein, carbs, fats, fiber) and nutrition goals, adjusting ingredient quantities and suggesting smart modifications when needed. Our macro calculations are based on lab-analyzed data from USDA FoodData Central, adjusted for cooking transformations like moisture loss, nutrient retention, and fat absorption. We believe in accuracy rooted in science — so the numbers you see aren't guesses; they reflect what truly ends up on your plate."
        }
      },
      {
        "@type": "Question",
        "name": "What is Recipe Alchemy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Recipe Alchemy is your smart kitchen companion — blending culinary creativity, real nutrition science, and AI intelligence to help you cook meals that are delicious, personalized, and nourishing. We don't just hand you recipes. We help you transform them to fit your ingredients, goals, and tastes."
        }
      },
      {
        "@type": "Question",
        "name": "How does Recipe Alchemy personalize recipes for me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When you set up your profile, we estimate your daily energy needs (BMR + TDEE) and your preferred macronutrient targets. Every recipe we generate adapts automatically — adjusting ingredients, portions, and substitutions — to fit your nutrition goals and lifestyle."
        }
      },
      {
        "@type": "Question",
        "name": "How accurate is your nutrition analysis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We source our nutrition data from: USDA FoodData Central, branded manufacturer databases, and peer-reviewed cooking and nutrition research. We also adjust for cooking methods (like roasting, boiling, frying) using scientifically validated retention and yield factors. The result: a nutrition label you can trust — grounded in real-world, real-food data."
        }
      },
      {
        "@type": "Question",
        "name": "Can I modify a recipe after it's generated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Our AI lets you chat with the recipe itself — asking for dairy-free versions, lower sodium swaps, plant-based alternatives, and more. Every substitution updates the ingredients, cooking steps, and nutrition facts automatically."
        }
      },
      {
        "@type": "Question",
        "name": "What if I don't have a specific ingredient?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Just ask! Our AI analyzes the role of each missing ingredient (flavor, texture, binding, etc.) and suggests smart, functional replacements — keeping your dish balanced and delicious."
        }
      },
      {
        "@type": "Question",
        "name": "How does Recipe Alchemy handle special diets like vegan, keto, or gluten-free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When you tell us about your dietary needs, our AI builds recipes that fit — not by simply removing ingredients, but by rebuilding the dish intelligently to maintain flavor, nutrition, and integrity."
        }
      },
      {
        "@type": "Question",
        "name": "What sources do you use for nutrition data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use: USDA FoodData Central, branded food product databases, and peer-reviewed scientific literature on nutrient retention and cooking effects. No user-submitted guesses. Only trusted, lab-tested sources."
        }
      },
      {
        "@type": "Question",
        "name": "How do you calculate time-to-read on recipes and articles?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We calculate time-to-read based on a standard reading speed (200 words per minute) — so you know at a glance whether you've got time for a deep dive or a quick inspiration hit."
        }
      },
      {
        "@type": "Question",
        "name": "Is Recipe Alchemy a meal planning tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We're not just a rigid meal planner. We're a creative kitchen companion — giving you flexible, personalized recipes you can save, adjust, shop for, and adapt to your goals and cravings day by day."
        }
      },
      {
        "@type": "Question",
        "name": "What's next for Recipe Alchemy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upcoming features include: intelligent shopping list creation, personalized meal suggestions based on your pantry, deeper nutrient tracking for specialty goals (gut health, heart health, athletic performance), and always — more real science, more flavor, more everyday kitchen magic."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Frequently Asked Questions | Recipe Alchemy</title>
        <meta 
          name="description" 
          content="Find answers to common questions about Recipe Alchemy's personalized nutrition calculations, recipe customization, dietary accommodations, and more." 
        />
        <link rel="canonical" href="https://recipealchemist.com/faq" />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <div className="container-page py-8 pb-16 sm:py-10 sm:pb-24">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>FAQ</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>

          <section aria-labelledby="page-title">
            <h1 id="page-title" className="text-2xl sm:text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
            <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Find answers to common questions about Recipe Alchemy's features, nutrition calculations, and more.
            </p>
          </section>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How does Recipe Alchemy personalize nutrition, and how accurate are your macro calculations?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">
                    When you create a profile, we estimate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on your age, weight, height, biological sex, and activity level — using proven scientific formulas.
                  </p>
                  <p className="mb-4">
                    We then align every recipe with your personal macro targets (protein, carbs, fats, fiber) and nutrition goals, adjusting ingredient quantities and suggesting smart modifications when needed.
                  </p>
                  <p className="mb-4">
                    Our macro calculations are based on lab-analyzed data from USDA FoodData Central, adjusted for cooking transformations like moisture loss, nutrient retention, and fat absorption.
                  </p>
                  <p>
                    We believe in accuracy rooted in science — so the numbers you see aren't guesses; they reflect what truly ends up on your plate.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">What is Recipe Alchemy?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">
                    Recipe Alchemy is your smart kitchen companion — blending culinary creativity, real nutrition science, and AI intelligence to help you cook meals that are delicious, personalized, and nourishing.
                  </p>
                  <p>
                    We don't just hand you recipes. We help you transform them to fit your ingredients, goals, and tastes.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">How does Recipe Alchemy personalize recipes for me?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">
                    When you set up your profile, we estimate your daily energy needs (BMR + TDEE) and your preferred macronutrient targets.
                  </p>
                  <p>
                    Every recipe we generate adapts automatically — adjusting ingredients, portions, and substitutions — to fit your nutrition goals and lifestyle.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">How accurate is your nutrition analysis?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">We source our nutrition data from:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>USDA FoodData Central</li>
                    <li>Branded manufacturer databases</li>
                    <li>Peer-reviewed cooking and nutrition research</li>
                  </ul>
                  <p className="mb-4">
                    We also adjust for cooking methods (like roasting, boiling, frying) using scientifically validated retention and yield factors.
                  </p>
                  <p>
                    The result: a nutrition label you can trust — grounded in real-world, real-food data.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">Can I modify a recipe after it's generated?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">Absolutely.</p>
                  <p className="mb-4">
                    Our AI lets you chat with the recipe itself — asking for dairy-free versions, lower sodium swaps, plant-based alternatives, and more.
                  </p>
                  <p>
                    Every substitution updates the ingredients, cooking steps, and nutrition facts automatically.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">What if I don't have a specific ingredient?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">Just ask!</p>
                  <p>
                    Our AI analyzes the role of each missing ingredient (flavor, texture, binding, etc.) and suggests smart, functional replacements — keeping your dish balanced and delicious.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">How does Recipe Alchemy handle special diets like vegan, keto, or gluten-free?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    When you tell us about your dietary needs, our AI builds recipes that fit — not by simply removing ingredients, but by rebuilding the dish intelligently to maintain flavor, nutrition, and integrity.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left">What sources do you use for nutrition data?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">We use:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>USDA FoodData Central</li>
                    <li>Branded food product databases</li>
                    <li>Peer-reviewed scientific literature on nutrient retention and cooking effects</li>
                  </ul>
                  <p>No user-submitted guesses. Only trusted, lab-tested sources.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-9">
                <AccordionTrigger className="text-left">How do you calculate time-to-read on recipes and articles?</AccordionTrigger>
                <AccordionContent>
                  <p>
                    We calculate time-to-read based on a standard reading speed (200 words per minute) — so you know at a glance whether you've got time for a deep dive or a quick inspiration hit.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-10">
                <AccordionTrigger className="text-left">Is Recipe Alchemy a meal planning tool?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">We're not just a rigid meal planner.</p>
                  <p>
                    We're a creative kitchen companion — giving you flexible, personalized recipes you can save, adjust, shop for, and adapt to your goals and cravings day by day.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-11">
                <AccordionTrigger className="text-left">What's next for Recipe Alchemy?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">Upcoming features include:</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Intelligent shopping list creation</li>
                    <li>Personalized meal suggestions based on your pantry</li>
                    <li>Deeper nutrient tracking for specialty goals (gut health, heart health, athletic performance)</li>
                  </ul>
                  <p>And always — more real science, more flavor, more everyday kitchen magic.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
