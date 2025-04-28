import React from 'react';
import { Card } from '@/components/ui/card';

export const ArticleIntelligentCooking = () => {
  return (
    <article 
      className="prose prose-lg max-w-4xl mx-auto dark:prose-invert"
      itemScope 
      itemType="http://schema.org/Article"
    >
      <meta itemProp="keywords" content="AI cooking, smart recipes, nutrition tracking, USDA FoodData, recipe substitutions" />
      
      <Card className="p-8 mb-8">
        <div className="space-y-6" itemProp="articleBody">
          <p className="text-lg">
            When you cook with our AI app, you're not just following recipes — you're cooking smarter.
          </p>

          <p>
            We believe great food deserves great information. That's why every recipe you see, 
            every nutrition label you get, is crafted using real science, not guesses.
          </p>

          <section aria-labelledby="fresh-data">
            <h3 id="fresh-data" className="text-2xl font-semibold mt-8">
              Fresh, Real Ingredient Data
            </h3>
            <p>
              Our app pulls the most trusted nutrition data from <strong>USDA FoodData Central</strong> and 
              branded food databases. That means your almond milk, your oat flour, your favorite 
              cereal — it's all recognized and measured accurately.
            </p>
            <p>
              You'll always get nutrition info that reflects <strong>what's actually in your kitchen</strong>.
            </p>
          </section>

          <section aria-labelledby="cooking-changes">
            <h3 id="cooking-changes" className="text-2xl font-semibold">
              Cooking Changes Food — We Respect That
            </h3>
            <p>
              Boiling, roasting, frying — cooking transforms ingredients, and nutrients along with them.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Moisture loss</strong> (your veggies shrink)</li>
              <li><strong>Nutrient loss</strong> (vitamins can fade with heat)</li>
              <li><strong>Concentration effects</strong> (some nutrients get stronger)</li>
            </ul>
          </section>

          <section aria-labelledby="smart-substitutions">
            <h3 id="smart-substitutions" className="text-2xl font-semibold">
              Smart Substitutions for Every Diet
            </h3>
            <p>
              Want to make a recipe gluten-free, vegan, keto, low-sodium? Our AI understands 
              ingredients at a deep level — their flavor, texture, and role — and suggests 
              substitutions that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Keep the dish delicious</li>
              <li>Match your dietary needs</li>
              <li>Recalculate full nutrition instantly</li>
            </ul>
          </section>

          <section aria-labelledby="absorption-insights">
            <h3 id="absorption-insights" className="text-2xl font-semibold">
              Beyond Labels: Real Absorption Insights
            </h3>
            <p>
              Nutrition isn't just about what's in the food — it's about what your body can use.
            </p>
            <p>
              Our app even hints at how you can <strong>boost absorption</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Add a splash of lemon to help absorb plant iron</li>
              <li>Pair cooked carrots with olive oil to unlock vitamin A</li>
            </ul>
          </section>

          <section aria-labelledby="transparent-info">
            <h3 id="transparent-info" className="text-2xl font-semibold">
              Transparent, Honest Information
            </h3>
            <p>
              We tell you when numbers might vary — because real food isn't always perfectly predictable.
            </p>
            <p>We always:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the latest science</li>
              <li>Respect cooking transformations</li>
              <li>Adjust for brand and ingredient variations</li>
            </ul>
          </section>

          <section aria-labelledby="why-it-matters">
            <h3 id="why-it-matters" className="text-2xl font-semibold">
              Why It Matters
            </h3>
            <p>When you cook with real information, you cook with confidence.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You can meet your health goals more easily.</li>
              <li>You can modify recipes without losing flavor or texture.</li>
              <li>You can truly understand what nourishes you.</li>
            </ul>
          </section>

          <div className="text-center mt-12">
            <p className="text-xl font-semibold">
              <strong>Our AI makes recipes smarter, so you can cook, eat, and live better.</strong>
            </p>
            <p className="text-lg text-muted-foreground">
              Welcome to the future of home cooking — joyful, informed, and delicious.
            </p>
          </div>
        </div>
      </Card>
    </article>
  );
};
