
import React from 'react';
import { Card } from '@/components/ui/card';
import { Circle, CircleCheck, Info, Leaf, Lightbulb, Utensils } from 'lucide-react';

export const ArticleIntelligentCooking = () => {
  return (
    <article 
      className="prose prose-lg max-w-4xl mx-auto dark:prose-invert"
      itemScope 
      itemType="http://schema.org/Article"
    >
      <meta itemProp="keywords" content="AI cooking, smart recipes, nutrition tracking, USDA FoodData, recipe substitutions" />
      
      <Card className="p-8 mb-8">
        <h2 
          className="text-3xl font-bold mb-6 flex items-center gap-2" 
          itemProp="headline"
        >
          <Lightbulb className="text-recipe-blue" />
          Smarter Recipes, Healthier You: How Our AI Makes Cooking Intelligent
        </h2>

        <div className="space-y-6" itemProp="articleBody">
          <p className="text-lg">
            When you cook with our AI app, you're not just following recipes — you're cooking smarter.
          </p>

          <p>
            We believe great food deserves great information. That's why every recipe you see, 
            every nutrition label you get, is crafted using real science, not guesses.
          </p>

          <img 
            src="/ai-cooking-intelligence.jpg" 
            alt="AI-powered cooking analysis showing recipe customization and nutrition insights" 
            className="rounded-lg w-full object-cover h-64 my-8"
            itemProp="image"
          />

          <section aria-labelledby="fresh-data">
            <h3 id="fresh-data" className="text-2xl font-semibold flex items-center gap-2 mt-8">
              <Info className="text-recipe-blue" />
              1. Fresh, Real Ingredient Data
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
            <h3 id="cooking-changes" className="text-2xl font-semibold flex items-center gap-2">
              <Utensils className="text-recipe-green" />
              2. Cooking Changes Food — We Respect That
            </h3>
            <p>
              Boiling, roasting, frying — cooking transforms ingredients, and nutrients along with them.
            </p>
            <ul className="list-none pl-0">
              <li className="flex items-start gap-2 mb-2">
                <CircleCheck className="mt-1 text-recipe-green" />
                <span><strong>Moisture loss</strong> (your veggies shrink)</span>
              </li>
              <li className="flex items-start gap-2 mb-2">
                <CircleCheck className="mt-1 text-recipe-green" />
                <span><strong>Nutrient loss</strong> (vitamins can fade with heat)</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck className="mt-1 text-recipe-green" />
                <span><strong>Concentration effects</strong> (some nutrients get stronger)</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="smart-substitutions">
            <h3 id="smart-substitutions" className="text-2xl font-semibold flex items-center gap-2">
              <Info className="text-recipe-orange" />
              3. Smart Substitutions for Every Diet
            </h3>
            <p>
              Want to make a recipe gluten-free, vegan, keto, low-sodium? Our AI understands 
              ingredients at a deep level — their flavor, texture, and role — and suggests 
              substitutions that:
            </p>
            <ul className="list-none pl-0">
              <li className="flex items-start gap-2 mb-2">
                <CircleCheck className="mt-1 text-recipe-orange" />
                <span>Keep the dish delicious</span>
              </li>
              <li className="flex items-start gap-2 mb-2">
                <CircleCheck className="mt-1 text-recipe-orange" />
                <span>Match your dietary needs</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck className="mt-1 text-recipe-orange" />
                <span>Recalculate full nutrition instantly</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="absorption-insights">
            <h3 id="absorption-insights" className="text-2xl font-semibold flex items-center gap-2">
              <Leaf className="text-recipe-green" />
              4. Beyond Labels: Real Absorption Insights
            </h3>
            <p>
              Nutrition isn't just about what's in the food — it's about what your body can use.
            </p>
            <p>
              Our app even hints at how you can <strong>boost absorption</strong>:
            </p>
            <ul className="list-none pl-0">
              <li className="flex items-start gap-2 mb-2">
                <CircleCheck className="mt-1 text-recipe-green" />
                <span>Add a splash of lemon to help absorb plant iron</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck className="mt-1 text-recipe-green" />
                <span>Pair cooked carrots with olive oil to unlock vitamin A</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="transparent-info">
            <h3 id="transparent-info" className="text-2xl font-semibold flex items-center gap-2">
              <Circle className="text-recipe-blue" />
              5. Transparent, Honest Information
            </h3>
            <p>
              We tell you when numbers might vary — because real food isn't always perfectly predictable.
            </p>
            <p>We always:</p>
            <ul className="list-none pl-0">
              <li className="flex items-start gap-2 mb-2">
                <CircleCheck className="mt-1 text-recipe-blue" />
                <span>Use the latest science</span>
              </li>
              <li className="flex items-start gap-2 mb-2">
                <CircleCheck className="mt-1 text-recipe-blue" />
                <span>Respect cooking transformations</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck className="mt-1 text-recipe-blue" />
                <span>Adjust for brand and ingredient variations</span>
              </li>
            </ul>
          </section>

          <section aria-labelledby="why-it-matters">
            <h3 id="why-it-matters" className="text-2xl font-semibold flex items-center gap-2">
              <Lightbulb className="text-recipe-orange" />
              Why It Matters
            </h3>
            <p>When you cook with real information, you cook with confidence.</p>
            <ul className="list-none pl-0">
              <li className="flex items-start gap-2 mb-2">
                <CircleCheck className="mt-1 text-recipe-orange" />
                <span>You can meet your health goals more easily.</span>
              </li>
              <li className="flex items-start gap-2 mb-2">
                <CircleCheck className="mt-1 text-recipe-orange" />
                <span>You can modify recipes without losing flavor or texture.</span>
              </li>
              <li className="flex items-start gap-2">
                <CircleCheck className="mt-1 text-recipe-orange" />
                <span>You can truly understand what nourishes you.</span>
              </li>
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
