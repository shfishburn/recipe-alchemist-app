
import React from 'react';
import { Card } from '@/components/ui/card';
import { ReadTimeDisplay } from '@/components/how-it-works/ReadTimeDisplay';

interface ArticleNutritionTrackingProps {
  title: string;
  description: string;
  content: string;
}

export const ArticleNutritionTracking: React.FC<ArticleNutritionTrackingProps> = ({ 
  title, 
  description,
  content
}) => {
  return (
    <Card className="p-8">
      <article className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <ReadTimeDisplay text={content} />
          </div>
          <p className="text-xl font-medium text-muted-foreground">
            {description}
          </p>
        </header>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Behind the Magic: How Our AI Crafts Smarter Recipes</h2>
          <p className="mb-4">
            When you open our app and ask for a recipe — something low-carb, or dairy-free, or packed with vitamin C — it might feel like magic.
            A few taps. A few seconds. A beautiful recipe, ready to cook.
          </p>
          <p className="mb-4">
            But under the hood, it's not magic.
            It's a beautiful dance of science, cooking wisdom, and precision nutrition. Every recipe we generate follows rules shaped by real culinary chemistry, food safety research, and the messy, wonderful realities of a home kitchen.
          </p>
          <p className="mb-4">
            We don't believe in guesses.
            We believe in building flavor and nutrition with care, honesty, and respect for the food you feed yourself and the people you love.
          </p>
          <p className="font-medium">
            Here's how it really works:
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">It Starts with Real Ingredient Science</h3>
          <p className="mb-3">
            The first thing our AI does isn't chopping, stirring, or seasoning.
            It's thinking deeply about ingredients.
          </p>
          <p className="mb-3">
            Before anything else, the system pulls data from the most trusted nutrition sources available:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>USDA FoodData Central — the gold standard for lab-analyzed food composition.</li>
            <li>Branded food databases — capturing real manufacturer data for store-bought products.</li>
            <li>Scientific literature — when cooking transformations need extra depth.</li>
          </ul>
          <p className="mb-3">
            When you ask for almond flour pancakes or tofu stir-fry, the app doesn't guess at calories, vitamins, or carbs. It pulls real numbers tied to real foods — adjusting for brand-specific variations when possible.
          </p>
          <p className="mb-3">
            It's ingredient data that respects where food comes from, how it's processed, and how it truly nourishes you.
          </p>
          <p className="mb-3">
            Accuracy matters — because nutrition isn't about good intentions; it's about good information.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Cooking Changes Everything — and We Respect It</h3>
          <p className="mb-3">
            Cooking is magic — and it's science.
            The sizzle of fat. The sweet collapse of roasted carrots. The crust that forms on a seared steak.
          </p>
          <p className="mb-3">
            But along with flavor and texture, cooking changes nutrients too.
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Water evaporates — concentrating some nutrients and washing others away.</li>
            <li>Delicate vitamins degrade under heat — Vitamin C and B vitamins can lose up to 55% during cooking.</li>
            <li>Minerals like iron and potassium stay behind — but in smaller, more concentrated bites.</li>
            <li>Fats soak into foods during frying — or drip away during roasting.</li>
          </ul>
          <p className="mb-3">
            Our AI adjusts every recipe's nutrition using real scientific yield factors (how much food shrinks or absorbs) and nutrient retention factors (how cooking alters vitamins and minerals).
            These are the same techniques dietitians and food scientists use to calculate nutrition labels for packaged foods and hospital meals.
          </p>
          <p className="mb-3">
            So the numbers you see after you sauté, bake, roast, or simmer match what's truly on your plate — not just what you started with.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Flavor Built with Chemistry</h3>
          <p className="mb-3">
            Flavor doesn't just happen.
            It's a chemical story, written by heat, time, and care.
          </p>
          <p className="mb-3">
            Every recipe our AI creates is built to unlock the best flavor reactions:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Maillard reaction — the browning that gives bread its crust, steaks their sear, and onions their deep sweetness.</li>
            <li>Emulsification — the secret behind rich, creamy sauces that don't break.</li>
            <li>Heat transfer mastery — knowing when to blast food with high heat and when to go slow and gentle.</li>
          </ul>
          <p className="mb-3">
            We aren't just tossing ingredients together.
            We're designing each step to trigger the right chemical magic at the right moment — so even a fast 20-minute recipe can taste thoughtful, layered, and deeply satisfying.
          </p>
          <p className="mb-3">
            You might not see the chemistry happening, but you'll taste it.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Smarter for Your Health Goals</h3>
          <p className="mb-3">
            Healthy recipes aren't just low-calorie.
            True health comes from building food that feeds your body wisely and joyfully.
          </p>
          <p className="mb-3">
            Our AI thinks like a chef and a registered dietitian.
            It considers:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Macronutrients — protein, carbohydrates, fats, fiber, and sugar.</li>
            <li>Micronutrients — the quiet heroes like iron, potassium, vitamin C, calcium, vitamin A, and vitamin D.</li>
            <li>Bioavailability — how well your body can actually absorb those nutrients.</li>
          </ul>
          <p className="mb-3">
            We don't just list iron — we suggest adding lemon to spinach to boost iron absorption.
            We don't just mention carrots are rich in vitamin A — we design the recipe to include a little healthy fat, so your body can actually absorb it.
          </p>
          <p className="mb-3">
            This is nutrition designed for real life — where flavor, chemistry, and health are partners, not enemies.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Measurements You Can Trust</h3>
          <p className="mb-3">
            Precision isn't about being fussy.
            It's about freedom.
            When you trust the measurements, you can relax and focus on the joy of cooking.
          </p>
          <p className="mb-3">
            Every recipe includes:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Standard imperial measurements (cups, tablespoons, ounces) — the language of most home kitchens.</li>
            <li>Metric equivalents (grams, Celsius) — for precision and global cooks.</li>
            <li>Visual and tactile cues — like "golden brown" or "knife slides easily through" — because your senses are the best timers of all.</li>
          </ul>
          <p className="mb-3">
            Whether you're weighing flour or checking a roast for doneness, our recipes speak the real language of cooks — sight, smell, touch, and intuition, grounded in careful science.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Why It Matters</h3>
          <p className="mb-3">
            When you cook with our app, you're not just following a list of steps.
            You're stepping into a kitchen built on real knowledge — chemistry, nutrition, technique — disguised as easy, joyful guidance.
          </p>
          <p className="mb-3">
            You're building meals that are beautiful, delicious, and nourishing — without needing to decode a food science textbook.
            And behind every soup simmer, every loaf rising, every plate set on the table, there's real science working quietly for you.
          </p>
          <p className="mb-3 font-medium">
            Welcome to the future of smarter cooking — joyful, informed, and delicious.
          </p>
        </section>
      </article>
    </Card>
  );
};
