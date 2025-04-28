
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ReadTimeDisplay } from '@/components/how-it-works/ReadTimeDisplay';

export const ArticleIntelligentCooking = () => {
  const [articleContent, setArticleContent] = useState('');
  
  useEffect(() => {
    // In a real implementation, this could come from an API or database
    setArticleContent(`
      How Nutrition Analysis Works
      We don't guess what's in your food — we measure it with real science. Our system pulls data from trusted sources like USDA FoodData Central, adjusts for cooking methods, tracks both macronutrients and vital micronutrients, and personalizes your nutrition to your body's needs. Every recipe you see reflects not just what you cook — but how it truly nourishes you.
      
      Food is Not Static: Why Accurate Nutrition Analysis Matters
      When you cook a steak, it loses water and shrinks.
      When you steam broccoli, some vitamins leach into the cooking water.
      When you eat fat with carrots, your body absorbs more vitamin A.
      
      These are the realities of food — constantly changing, interacting, transforming. But most nutrition apps don't account for any of this. They treat food like numbers in a database, not living chemistry that shifts with every cooking technique and combination.
      
      We believe you deserve better information about what you're really eating.
      
      That's why our nutrition analysis accounts for the real science of food:
      
      1. We Start with Quality Data
      Our system doesn't guess — it measures. We pull nutrition data from:
      
      USDA FoodData Central — laboratory-analyzed data, the gold standard in nutrition science
      Academic food composition databases — for unique or specialty ingredients
      Branded food databases — for packaged products
      
      This means you're seeing real numbers, not estimates.
      
      2. We Account for Cooking Methods
      Different cooking techniques transform food in different ways:
      
      Boiling can reduce water-soluble vitamins by up to 50%
      Grilling changes fat content as drippings are lost
      Baking causes moisture loss, concentrating some nutrients
      
      Our system applies scientifically validated retention factors to adjust nutrition values based on your cooking method.
      
      3. We Track the Full Nutrition Picture
      While most apps focus only on calories and macronutrients, we believe the micronutrients are equally important:
      
      Essential minerals like iron, potassium, calcium, magnesium, zinc
      Full vitamin profile including folate, riboflavin, and vitamins A, C, D, E, K
      Amino acid profiles for protein quality tracking
      
      Because health is about more than just calories in, calories out.
      
      4. We Balance Scientific Depth with Practical Clarity
      While our engine runs on complex calculations, what you see is clear and actionable:
      
      Visual representations of nutrient density
      Percentage of daily needs met (personalized to your body)
      Plain-language explanations of nutrition highlights
      
      So you always understand not just what you're eating, but why it matters.
      
      5. We Design for Bioavailability, Not Just Content
      It's not just what nutrients are in your food — it's whether your body can use them:
      
      We pair vitamin C with iron-rich foods to enhance absorption
      We include healthy fats with fat-soluble vitamins A, D, E and K
      We combine complementary plant proteins for complete amino acid profiles
      
      These pairings aren't random — they're designed to maximize how your body uses what you eat.
      
      Why Precision Nutrition Matters for Your Real Life
      When you understand what's truly in your food, cooking becomes more than just feeding yourself — it becomes a powerful tool for supporting your health goals, athletic performance, energy levels, and long-term vitality.
      
      With accurate nutrition analysis, you can:
      
      Make confident substitutions knowing the real impact
      Balance your plate more effectively
      Identify and address potential nutrient gaps
      Connect what you eat with how you feel
      
      You deserve to know what you're really eating — not just what you're cooking.
      That's the difference with Recipe Alchemist.
    `);
  }, []);
  
  return (
    <Card className="p-8">
      <article className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3">How Nutrition Analysis Works</h1>
          <div className="flex items-center gap-2 mb-4">
            <ReadTimeDisplay text={articleContent} />
          </div>
          <p className="text-xl font-medium text-muted-foreground">
            We don't guess what's in your food — we measure it with real science. Our system pulls data from trusted sources like USDA FoodData Central, adjusts for cooking methods, tracks both macronutrients and vital micronutrients, and personalizes your nutrition to your body's needs.
          </p>
        </header>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Food is Not Static: Why Accurate Nutrition Analysis Matters</h2>
          <p className="mb-4">
            When you cook a steak, it loses water and shrinks.
            When you steam broccoli, some vitamins leach into the cooking water.
            When you eat fat with carrots, your body absorbs more vitamin A.
          </p>
          <p className="mb-4">
            These are the realities of food — constantly changing, interacting, transforming. But most nutrition apps don't account for any of this. They treat food like numbers in a database, not living chemistry that shifts with every cooking technique and combination.
          </p>
          <p className="mb-4">
            We believe you deserve better information about what you're really eating.
          </p>
          <p className="font-medium">
            That's why our nutrition analysis accounts for the real science of food:
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">1. We Start with Quality Data</h3>
          <p className="mb-3">
            Our system doesn't guess — it measures. We pull nutrition data from:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>USDA FoodData Central — laboratory-analyzed data, the gold standard in nutrition science</li>
            <li>Academic food composition databases — for unique or specialty ingredients</li>
            <li>Branded food databases — for packaged products</li>
          </ul>
          <p className="mb-3">
            This means you're seeing real numbers, not estimates.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">2. We Account for Cooking Methods</h3>
          <p className="mb-3">
            Different cooking techniques transform food in different ways:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Boiling can reduce water-soluble vitamins by up to 50%</li>
            <li>Grilling changes fat content as drippings are lost</li>
            <li>Baking causes moisture loss, concentrating some nutrients</li>
          </ul>
          <p className="mb-3">
            Our system applies scientifically validated retention factors to adjust nutrition values based on your cooking method.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">3. We Track the Full Nutrition Picture</h3>
          <p className="mb-3">
            While most apps focus only on calories and macronutrients, we believe the micronutrients are equally important:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Essential minerals like iron, potassium, calcium, magnesium, zinc</li>
            <li>Full vitamin profile including folate, riboflavin, and vitamins A, C, D, E, K</li>
            <li>Amino acid profiles for protein quality tracking</li>
          </ul>
          <p className="mb-3">
            Because health is about more than just calories in, calories out.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">4. We Balance Scientific Depth with Practical Clarity</h3>
          <p className="mb-3">
            While our engine runs on complex calculations, what you see is clear and actionable:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Visual representations of nutrient density</li>
            <li>Percentage of daily needs met (personalized to your body)</li>
            <li>Plain-language explanations of nutrition highlights</li>
          </ul>
          <p className="mb-3">
            So you always understand not just what you're eating, but why it matters.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">5. We Design for Bioavailability, Not Just Content</h3>
          <p className="mb-3">
            It's not just what nutrients are in your food — it's whether your body can use them:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>We pair vitamin C with iron-rich foods to enhance absorption</li>
            <li>We include healthy fats with fat-soluble vitamins A, D, E and K</li>
            <li>We combine complementary plant proteins for complete amino acid profiles</li>
          </ul>
          <p className="mb-3">
            These pairings aren't random — they're designed to maximize how your body uses what you eat.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Why Precision Nutrition Matters for Your Real Life</h3>
          <p className="mb-3">
            When you understand what's truly in your food, cooking becomes more than just feeding yourself — it becomes a powerful tool for supporting your health goals, athletic performance, energy levels, and long-term vitality.
          </p>
          <p className="mb-3">
            With accurate nutrition analysis, you can:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Make confident substitutions knowing the real impact</li>
            <li>Balance your plate more effectively</li>
            <li>Identify and address potential nutrient gaps</li>
            <li>Connect what you eat with how you feel</li>
          </ul>
          <p className="mb-3 font-medium">
            You deserve to know what you're really eating — not just what you're cooking.
            That's the difference with Recipe Alchemist.
          </p>
        </section>
      </article>
    </Card>
  );
};
