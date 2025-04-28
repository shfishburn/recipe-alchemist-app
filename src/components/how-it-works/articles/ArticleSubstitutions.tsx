
import React from 'react';
import { Card } from '@/components/ui/card';
import { ReadTimeDisplay } from '@/components/how-it-works/ReadTimeDisplay';

interface ArticleSubstitutionsProps {
  title: string;
  description: string;
  content: string;
}

export const ArticleSubstitutions: React.FC<ArticleSubstitutionsProps> = ({ 
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
          <h2 className="text-2xl font-semibold mb-4">Smart Ingredient Substitution: How Our AI Adapts Recipes to You — in Real Time</h2>
          <p className="mb-4">
            Cooking is a living process.
            And real kitchens are full of real surprises:
            You're out of eggs. You need a dairy-free option. You want more protein or less sodium.
            Maybe you simply want the dish to feel more like you.
          </p>
          <p className="mb-4">
            That's where our AI doesn't just generate a recipe — it becomes your kitchen co-pilot, helping you adapt, swap, and customize ingredients in real time through our recipe chat assistant.
          </p>
          <p className="mb-4">
            Smart Ingredient Substitution isn't just about replacing things.
            It's about preserving flavor, structure, nutrition — and empowering you to make every recipe your own.
          </p>
          <p className="font-medium">
            Here's how it really works:
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">1. Every Ingredient Has a Job — And We Respect It</h3>
          <p className="mb-3">
            Before suggesting any swap, our AI understands what the ingredient is doing in the recipe:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Is it providing structure (like flour)?</li>
            <li>Is it binding moisture (like eggs)?</li>
            <li>Is it supplying fat for tenderness (like butter)?</li>
            <li>Is it delivering acidity for balance (like lemon juice)?</li>
          </ul>
          <p className="mb-3">
            When you ask for a substitution — whether in your initial preferences or later through the recipe chat — our AI doesn't just pick a similar ingredient.
            It finds one that performs the same function, so the dish stays true in texture, taste, and craftsmanship.
          </p>
          <p className="mb-3">
            Form follows function — even in cooking.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">2. You Stay in the Driver's Seat with Real-Time Chat</h3>
          <p className="mb-3">
            When you open a recipe, you're not stuck with a static page.
            You can chat with the AI assistant right inside the recipe details:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Want to make it dairy-free? Just ask.</li>
            <li>Need a lower-sodium version? It'll adjust.</li>
            <li>Curious if almond flour can replace all-purpose? Our AI will explain when it works — and when it might not — with science behind the advice.</li>
          </ul>
          <p className="mb-3">
            It's a living conversation — fast, flexible, and always rooted in real food science.
          </p>
          <p className="mb-3">
            You're not limited to pre-set "dietary filters."
            You can shape the recipe moment-by-moment based on what you have, what you want, and how you're feeling today.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">3. Flavor and Culture Stay Intact</h3>
          <p className="mb-3">
            Smart substitutions honor the original spirit of a recipe.
            Our AI understands:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Flavor balancing — if you swap something sweet, it considers acidity and saltiness too.</li>
            <li>Regional authenticity — it won't suggest swapping miso paste with ketchup, or coconut milk with heavy cream, unless you ask for a playful twist.</li>
            <li>Culinary integrity — when a dish's identity matters, we suggest substitutions that respect the tradition, not dilute it.</li>
          </ul>
          <p className="mb-3">
            In the recipe chat, you can even ask:
            "What's a traditional swap for this ingredient if I can't find it?"
            And the assistant will guide you — not just for nutrition, but for authenticity too.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">4. Nutrition Adjusts Automatically — No Guesswork</h3>
          <p className="mb-3">
            Every time you modify a recipe, our system recalculates the full nutrition:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Calories</li>
            <li>Macronutrients (protein, carbs, fat, fiber, sugar)</li>
            <li>Key micronutrients (vitamin C, iron, potassium, calcium, vitamin A, vitamin D)</li>
          </ul>
          <p className="mb-3">
            Cooking isn't just about flavor.
            It's about fueling your life wisely.
            When you make a change, we show you immediately how it impacts your plate — no hidden math, no surprises later.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">5. Food That Fits Today, and Tomorrow</h3>
          <p className="mb-3">
            Maybe today, you want a lower-carb version.
            Maybe next week, you're cooking for a friend who's allergic to nuts.
            Maybe next month, you decide to lean more plant-based.
          </p>
          <p className="mb-3">
            Our Smart Ingredient Substitution through recipe chat lets your cooking grow with you.
            One recipe becomes many.
            One meal becomes a flexible foundation for whatever life — and your cravings — bring next.
          </p>
          <p className="mb-3">
            You're not trapped in someone else's kitchen rules.
            You're cooking for your real life, with real science quietly working in the background.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Why It Matters</h3>
          <p className="mb-3">
            Good recipes inspire.
            Great recipes adapt.
          </p>
          <p className="mb-3">
            When you can adjust ingredients confidently — guided by a smart, science-savvy assistant — you're not just following directions.
            You're collaborating with your food.
            You're crafting meals that nourish your body, honor your tastes, and celebrate your changing life.
          </p>
          <p className="mb-3 font-medium">
            That's the power of Smart Ingredient Substitution.
            Recipes that listen, learn, and grow with you.
          </p>
        </section>
      </article>
    </Card>
  );
};
