
import React from 'react';
import { Card } from '@/components/ui/card';

export const ArticleIntelligentCooking = () => {
  return (
    <article 
      className="prose prose-lg max-w-4xl mx-auto dark:prose-invert"
      itemScope 
      itemType="http://schema.org/Article"
    >
      <meta itemProp="headline" content="How Our Nutrition Analysis Works: Real Science, Real Food" />
      <meta itemProp="keywords" content="nutrition analysis, macro tracking, micronutrients, USDA FoodData, recipe nutrition, cooking science, food science" />
      <meta itemProp="datePublished" content="2025-04-28T10:00:00Z" />
      <meta itemProp="author" content="Recipe Alchemist Team" />
      
      <Card className="p-8 mb-8 space-y-12">
        <div className="space-y-8" itemProp="articleBody">
          <header className="mb-12">
            <h1 className="text-3xl font-bold mb-4" id="article-title">How Our Nutrition Analysis Works: Real Science, Real Food</h1>
            <p className="text-xl font-medium text-muted-foreground">
              Understanding what's really in your food goes far beyond counting calories or macros.
              It's a quiet, careful conversation between chemistry, cooking, and the messiness of real life.
            </p>
          </header>

          <p className="text-lg leading-relaxed mb-8">
            Our nutrition analysis system doesn't guess — it respects the true science behind how food transforms, nourishes, and fuels you.
          </p>

          <p className="text-lg leading-relaxed mb-8">
            Here's how we build a complete, honest picture of your meals:
          </p>

          <section aria-labelledby="trusted-sources" className="space-y-4">
            <h2 id="trusted-sources" className="text-2xl font-semibold mt-8">
              1. It All Starts With Trusted Sources
            </h2>
            <p>
              Good analysis begins with good ingredients — and good data.
              Unlike many apps that rely on crowdsourced entries or outdated labels, we source nutrition information from places that treat food with the seriousness it deserves:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>USDA FoodData Central</strong> — the gold standard of lab-tested nutrient data.</li>
              <li><strong>Branded food databases</strong> — real manufacturer values, updated to match what's on store shelves today.</li>
              <li><strong>Peer-reviewed science</strong> — research on how nutrients survive (or don't) through cooking, storage, and digestion.</li>
            </ul>
            <p>
              When you see numbers in our app, you're seeing science-backed truths, not guesses.
            </p>
          </section>

          <section aria-labelledby="cooking-changes" className="space-y-4">
            <h2 id="cooking-changes" className="text-2xl font-semibold">
              2. Cooking Changes Everything — and We Measure It
            </h2>
            <p>
              The heat of the stove, the slow work of an oven, the quick sear in a pan — every cooking method reshapes your food's nutrients.
              Our system tracks those transformations, carefully adjusting every value:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Water loss and concentration</strong> — When foods lose water, some nutrients get more concentrated. Others — especially delicate vitamins — wash away or evaporate.
              </li>
              <li>
                <strong>Heat-sensitive vitamin loss</strong> — Vitamin C and B vitamins can fade by 15–55%, depending on how gently (or fiercely) you cook.
              </li>
              <li>
                <strong>Fat absorption and rendering</strong> — Frying pulls oil into foods; roasting often lets fat drip away.
              </li>
              <li>
                <strong>Chemical reactions</strong> — Cooking doesn't just destroy nutrients — it sometimes creates new ones, or makes hidden ones easier for your body to absorb.
              </li>
            </ul>
            <p>
              We don't treat raw broccoli and roasted broccoli the same. Neither should you.
            </p>
          </section>

          <section aria-labelledby="beyond-macros" className="space-y-4">
            <h2 id="beyond-macros" className="text-2xl font-semibold">
              3. We Look Beyond Macros — Into the Micronutrient Heart of Food
            </h2>
            <p>
              Calories, carbs, protein, and fat are only part of the story.
              Our analysis goes deeper, following the real architects of health:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Vitamins</strong> — Fat-soluble (A, D, E, K) and water-soluble (B-complex, C).
              </li>
              <li>
                <strong>Minerals</strong> — Like iron, calcium, potassium, magnesium, and zinc.
              </li>
              <li>
                <strong>Phytonutrients</strong> — Plant-powered compounds like carotenoids and polyphenols.
              </li>
            </ul>
            <p>
              Every time you glance at your nutrition breakdown, you're seeing a full symphony, not just the bass drum.
            </p>
          </section>

          <section aria-labelledby="personalized" className="space-y-4">
            <h2 id="personalized" className="text-2xl font-semibold">
              4. Personalized, Because No Two Bodies Are the Same
            </h2>
            <p>
              A meal isn't just fuel — it's a conversation between your food and your body's needs.
              That's why we tailor nutrition analysis to you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Basal Metabolic Rate (BMR)</strong> — How many calories your body burns just staying alive.
              </li>
              <li>
                <strong>Total Daily Energy Expenditure (TDEE)</strong> — How your movement and life shape your daily needs.
              </li>
              <li>
                <strong>Macro targets</strong> — Your personal best ratio of protein, carbs, and fats, based on your goals.
              </li>
            </ul>
            <p>
              Every recipe can be seen through the lens of your own metabolism, not a generic average.
            </p>
          </section>

          <section aria-labelledby="ingredient-precision" className="space-y-4">
            <h2 id="ingredient-precision" className="text-2xl font-semibold">
              5. Ingredient-Level Precision — No Guessing Allowed
            </h2>
            <p>
              Behind every beautiful dish lies the story of each ingredient.
              We break it down carefully:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Precise weight conversions</strong> — Cups and spoons turn into grams, because your body eats mass, not volume.</li>
              <li><strong>State changes</strong> — We track how ingredients transform during cooking, mixing, or soaking.</li>
              <li><strong>Smart substitution analysis</strong> — When you swap almond flour for wheat flour, we don't just change the label — we recalculate the full nutrient impact.</li>
            </ul>
            <p>
              Every layer of your meal gets its own moment of scientific attention.
            </p>
          </section>

          <section aria-labelledby="limitations" className="space-y-4">
            <h2 id="limitations" className="text-2xl font-semibold">
              6. Respecting the Limits of Science, Too
            </h2>
            <p>
              Food is alive. Nature is messy.
              And we believe in honesty about what even the best nutrition analysis can and can't promise:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Natural variation</strong> — A tomato picked today won't have exactly the same nutrients as one picked next week.
              </li>
              <li>
                <strong>Individual digestion</strong> — Your gut microbiome changes how you absorb what you eat.
              </li>
              <li>
                <strong>Kitchen realities</strong> — A minute more in the pan, a hotter oven, a different cut of chicken — all create tiny shifts.
              </li>
            </ul>
            <p>
              Our system accounts for all it can — and it always respects the beautiful, irreducible variability of real food.
            </p>
          </section>

          <div className="text-center mt-16 space-y-4">
            <p className="text-xl font-semibold">
              <strong>Why It Matters</strong>
            </p>
            <p className="text-lg">
              When you know what's truly on your plate, you cook with confidence. 
              You eat with intention.
              And you nourish yourself — not just your hunger, but your body's complex, wonderful needs.
            </p>
            <p className="text-lg">
              That's the kind of nutrition analysis we believe in.
              <br />Real science. Real food. Real life.
            </p>
          </div>
        </div>
      </Card>
    </article>
  );
};
