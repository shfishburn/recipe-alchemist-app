
import React from 'react';
import { Card } from '@/components/ui/card';
import { ReadTimeDisplay } from '@/components/how-it-works/ReadTimeDisplay';

interface ArticlePersonalizedNutritionProps {
  title: string;
  description: string;
  content: string;
}

export const ArticlePersonalizedNutrition: React.FC<ArticlePersonalizedNutritionProps> = ({ 
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
          <h2 className="text-2xl font-semibold mb-4">How We Align Every Recipe to Your Health Goals</h2>
          <p className="mb-4">
            When you cook with us, you're not just making a meal.
            You're building something in conversation with your body:
            Its energy needs.
            Its cravings.
            Its deeper goals — whether that's fueling a workout, managing blood sugar, supporting recovery, or simply feeling vibrant and alive.
          </p>
          <p className="mb-4">
            Our AI doesn't treat you like an anonymous user.
            It treats you like a complex, dynamic human being — one who deserves food that fits.
          </p>
          <p className="font-medium">
            Here's how we do it:
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">1. We Start With Your Unique Blueprint</h3>
          <p className="mb-3">
            Every body has a different starting point.
            That's why we begin by estimating key personal metrics — using the best evidence from nutritional science:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Basal Metabolic Rate (BMR) — how many calories your body needs at complete rest, based on your age, weight, height, and biological sex.</li>
            <li>Total Daily Energy Expenditure (TDEE) — how your lifestyle and activity levels layer onto that foundation, changing what you truly need day-to-day.</li>
          </ul>
          <p className="mb-3">
            Some people need more fuel for performance.
            Some need careful balance for healing.
            Some simply want food that feels good and sustaining.
            Our recipes adjust accordingly — because a 5'2" runner and a 6'4" desk worker don't need the same plate, even if the flavor is just as joyful.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">2. We Honor Your Macro Goals — Without Forgetting the Micronutrients</h3>
          <p className="mb-3">
            Nutrition is an ecosystem, not a checklist.
            Our AI aligns recipes to your preferred macronutrient targets — whether you're aiming for:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Higher protein to build muscle</li>
            <li>Lower carbs for blood sugar management</li>
            <li>Balanced macros for general health</li>
            <li>High fiber for gut support</li>
          </ul>
          <p className="mb-3">
            But we don't stop at macros.
            Each recipe also tracks essential micronutrients — the quiet architects of energy, immunity, and long-term vitality:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Iron, calcium, potassium, magnesium</li>
            <li>Vitamins C, A, D, E, and the full B-complex</li>
            <li>Phytonutrients like carotenoids and polyphenols for antioxidant power</li>
          </ul>
          <p className="mb-3">
            Food isn't just fuel.
            It's a matrix of molecules, supporting every system in your body — and we make sure you see that full picture.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">3. We Build Bioavailability into Every Meal</h3>
          <p className="mb-3">
            It's not just what you eat.
            It's what your body can absorb and use.
          </p>
          <p className="mb-3">
            That's why our AI weaves bioavailability wisdom directly into recipes:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Add a squeeze of lemon over sautéed spinach to unlock more iron.</li>
            <li>Drizzle olive oil onto roasted carrots to boost vitamin A absorption.</li>
            <li>Pair plant-based proteins smartly to form complete amino acid profiles.</li>
          </ul>
          <p className="mb-3">
            These aren't random tips.
            They're subtle design choices that let the food do more work for you — quietly, in the background, every time you cook.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">4. We Adjust for Special Needs, Without Sacrificing Joy</h3>
          <p className="mb-3">
            You might need — or want — recipes that are:
          </p>
          <ul className="list-disc pl-6 mb-3">
            <li>Low-sodium for heart health</li>
            <li>Gluten-free for celiac safety</li>
            <li>Low-glycemic to stabilize energy</li>
            <li>Dairy-free for digestion comfort</li>
            <li>High-antioxidant for recovery and resilience</li>
          </ul>
          <p className="mb-3">
            Our AI doesn't just delete ingredients.
            It rebuilds flavor and structure with intention — using substitutions based on culinary chemistry, not guesswork.
          </p>
          <p className="mb-3">
            Because everyone deserves recipes that feel indulgent and satisfying, even when they serve a deeper purpose.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-3">5. We Respect the Whole Person</h3>
          <p className="mb-3">
            Maybe today, your "goal" isn't a number.
            Maybe it's feeding your family after a long week.
            Maybe it's celebrating a milestone.
            Maybe it's nourishing yourself gently through a hard season.
          </p>
          <p className="mb-3">
            Our system is smart enough to offer science — and humble enough to recognize that you are not a spreadsheet.
            You are a story in motion.
          </p>
          <p className="mb-3">
            We build recipes that flex with your life — science in service of joy, health, and flavor, not against it.
          </p>
        </section>

        <section className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Why It Matters</h3>
          <p className="mb-3">
            When recipes align with your body's needs, food becomes more than pleasure — it becomes power.
            The power to heal.
            The power to thrive.
            The power to build a life full of movement, resilience, and presence.
          </p>
          <p className="mb-3 font-medium">
            We don't just make meals smarter.
            We make them yours.
          </p>
        </section>
      </article>
    </Card>
  );
};
