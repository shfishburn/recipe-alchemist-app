
import React from 'react';
import { Card } from '@/components/ui/card';

export const ArticleIntelligentCooking = () => {
  return (
    <article 
      className="prose prose-lg max-w-4xl mx-auto dark:prose-invert"
      itemScope 
      itemType="http://schema.org/Article"
    >
      <meta itemProp="keywords" content="nutrition analysis, macro tracking, micronutrients, USDA FoodData, recipe nutrition" />
      
      <Card className="p-8 mb-8 space-y-12">
        <div className="space-y-8" itemProp="articleBody">
          <header className="mb-12">
            <h1 className="text-3xl font-bold mb-4">How Nutrition Analysis Works</h1>
            <p className="text-xl font-medium text-muted-foreground">
              The science behind accurate recipe nutrition calculations
            </p>
          </header>

          <p className="text-lg leading-relaxed mb-8">
            Understanding what's really in your food goes beyond simple calorie counting. Our nutrition analysis system applies food science principles to give you the most accurate picture of what you're eating.
          </p>

          <section aria-labelledby="data-sources" className="space-y-4">
            <h3 id="data-sources" className="text-2xl font-semibold mt-8">
              Data Sources Matter
            </h3>
            <p>
              Unlike many nutrition calculators that rely on user-submitted data, our system pulls from authoritative sources:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>USDA FoodData Central</strong> - The gold standard in nutrition data, containing lab-analyzed values for thousands of foods</li>
              <li><strong>Branded food databases</strong> - Up-to-date nutrition information from manufacturers</li>
              <li><strong>Scientific literature</strong> - Peer-reviewed research on nutrient retention and interactions</li>
            </ul>
          </section>

          <section aria-labelledby="cooking-science" className="space-y-4">
            <h3 id="cooking-science" className="text-2xl font-semibold">
              Accounting for Cooking Methods
            </h3>
            <p>
              When you cook food, its nutritional profile changes. Our analysis accounts for these key transformations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Water loss and concentration</strong> - When foods are cooked, water evaporates, concentrating some nutrients while potentially reducing others through leaching
              </li>
              <li>
                <strong>Heat-sensitive vitamin degradation</strong> - Vitamins like C and B can decrease by 15-55% during cooking, depending on temperature and duration
              </li>
              <li>
                <strong>Fat absorption and rendering</strong> - Foods absorb oil during frying, while meats release fat during roasting
              </li>
              <li>
                <strong>Chemical transformations</strong> - Cooking creates new compounds and alters the bioavailability of nutrients
              </li>
            </ul>
          </section>

          <section aria-labelledby="macros-micros" className="space-y-4">
            <h3 id="macros-micros" className="text-2xl font-semibold">
              Beyond Macros: Micronutrient Analysis
            </h3>
            <p>
              While proteins, carbs, and fats are important, our system also tracks essential micronutrients:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Vitamins</strong> - Fat-soluble (A, D, E, K) and water-soluble (B-complex, C)
              </li>
              <li>
                <strong>Minerals</strong> - Including iron, calcium, potassium, and zinc
              </li>
              <li>
                <strong>Phytonutrients</strong> - Beneficial plant compounds like polyphenols and carotenoids
              </li>
            </ul>
            <p>
              By analyzing these components, we can provide insights into not just the energy content of your meal, but its complete nutritional profile.
            </p>
          </section>

          <section aria-labelledby="personalization" className="space-y-4">
            <h3 id="personalization" className="text-2xl font-semibold">
              Personalized Nutrition Analysis
            </h3>
            <p>
              Different bodies have different needs. Our system calculates:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Basal Metabolic Rate (BMR)</strong> - Your energy needs at complete rest
              </li>
              <li>
                <strong>Total Daily Energy Expenditure (TDEE)</strong> - Your total calorie needs based on activity level
              </li>
              <li>
                <strong>Macro targets</strong> - Optimal protein, carb, and fat ratios for your goals
              </li>
            </ul>
            <p>
              These personalized metrics help you understand how a specific recipe fits into your overall nutrition plan.
            </p>
          </section>

          <section aria-labelledby="ingredient-precision" className="space-y-4">
            <h3 id="ingredient-precision" className="text-2xl font-semibold">
              Ingredient-Level Precision
            </h3>
            <p>
              Each ingredient in a recipe is analyzed separately, considering:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Portion weights</strong> - Converting volumetric measures (cups, tablespoons) to grams</li>
              <li><strong>State changes</strong> - How ingredients transform when cooked together</li>
              <li><strong>Substitution analysis</strong> - Nutritional impact of ingredient swaps</li>
            </ul>
            <p>
              This granular approach ensures that every component of your meal is accurately represented in the final nutritional breakdown.
            </p>
          </section>

          <section aria-labelledby="limitations" className="space-y-4">
            <h3 id="limitations" className="text-2xl font-semibold">
              Understanding Limitations
            </h3>
            <p>
              We believe in transparency about what nutrition analysis can and cannot tell you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Natural variation</strong> - Foods vary naturally in their nutrient content
              </li>
              <li>
                <strong>Individual differences</strong> - Your personal metabolism and gut microbiome affect nutrient absorption
              </li>
              <li>
                <strong>Preparation variables</strong> - Small differences in cooking time, temperature, and technique can affect results
              </li>
            </ul>
            <p>
              Our system acknowledges these limitations while still providing the most reliable nutrition information possible.
            </p>
          </section>

          <div className="text-center mt-16 space-y-4">
            <p className="text-xl font-semibold">
              <strong>Know what you're eating with science-backed nutrition analysis</strong>
            </p>
            <p className="text-lg text-muted-foreground">
              Make informed choices about your diet with reliable, comprehensive nutrition data
            </p>
          </div>
        </div>
      </Card>
    </article>
  );
};
