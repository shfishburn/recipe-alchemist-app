import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ImageIcon, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ArticleIntelligentCooking } from '@/components/how-it-works/ArticleIntelligentCooking';
import { toast } from 'sonner';
import { generateRecipeImage } from '@/hooks/recipe-chat/utils/generate-recipe-image';
import { supabase } from '@/integrations/supabase/client';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Link } from 'react-router-dom';
import { ReadTimeDisplay } from '@/components/how-it-works/ReadTimeDisplay';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('Article');
  const [articleDescription, setArticleDescription] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [publishDate, setPublishDate] = useState('2025-04-28T10:00:00Z');
  const [authorName, setAuthorName] = useState('Recipe Alchemist Team');

  useEffect(() => {
    if (slug === 'intelligent-cooking') {
      setArticleTitle('How Nutrition Analysis Works');
      setArticleDescription('We don\'t guess what\'s in your food — we measure it with real science. Our system pulls data from trusted sources like USDA FoodData Central, adjusts for cooking methods, tracks both macronutrients and vital micronutrients, and personalizes your nutrition to your body\'s needs.');
    } else if (slug === 'nutrition-tracking') {
      setArticleTitle('How Our AI Crafts Smarter Recipes');
      setArticleDescription('Our AI builds recipes with real food science — using trusted nutrition data, cooking chemistry, and precision techniques to create meals that are not just delicious, but deeply nourishing. Real science. Real flavor. Real life.');
    } else if (slug === 'personalized-nutrition') {
      setArticleTitle('How We Align Every Recipe to Your Health Goals');
      setArticleDescription('Your body is unique — and your food should be too. We start by understanding your energy needs and nutrition goals, from daily calorie targets to protein, carb, and fat ratios. Every recipe we build then adapts to you, balancing macronutrients and key vitamins and minerals, while weaving in smart ingredient choices that boost nutrient absorption naturally.');
    } else if (slug === 'substitutions') {
      setArticleTitle('Smart Ingredient Substitutions');
      setArticleDescription('Great cooking isn\'t rigid — it\'s flexible, creative, and alive. With our AI assistant, you can customize recipes in real time, making smart ingredient swaps that preserve flavor, structure, and nutrition. Whether you\'re cooking dairy-free, swapping to whole grains, or adjusting for allergies, our system guides you with real food science — so your meals stay joyful, nourishing, and entirely yours.');
    }
    
    const checkForExistingImage = async () => {
      setIsImageLoading(true);
      try {
        const { data: fileList, error } = await supabase.storage
          .from('recipe-images')
          .list('', { 
            search: `article-${slug}` 
          });
          
        if (error) {
          console.error('Error fetching image list:', error);
          setIsImageLoading(false);
          return;
        }
          
        if (fileList && fileList.length > 0) {
          const sortedFiles = fileList.sort((a, b) => 
            new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
          );
          
          const latestFile = sortedFiles[0];
          const { data: { publicUrl } } = supabase.storage
            .from('recipe-images')
            .getPublicUrl(latestFile.name);
            
          setGeneratedImage(publicUrl);
          console.log('Found existing image:', publicUrl);
        }
      } catch (error) {
        console.error('Error checking for existing image:', error);
      } finally {
        setIsImageLoading(false);
      }
    };
    
    checkForExistingImage();
  }, [slug]);

  const getArticleContent = () => {
    switch (slug) {
      case 'intelligent-cooking':
        return "We don't guess what's in your food — we measure it with real science. Our system pulls data from trusted sources like USDA FoodData Central, adjusts for cooking methods, tracks both macronutrients and vital micronutrients, and personalizes your nutrition to your body's needs. Every recipe you see reflects not just what you cook — but how it truly nourishes you.";
      case 'nutrition-tracking':
        return "Our AI builds recipes with real food science — using trusted nutrition data, cooking chemistry, and precision techniques to create meals that are not just delicious, but deeply nourishing. Real science. Real flavor. Real life.";
      case 'personalized-nutrition':
        return "Your body is unique — and your food should be too. We start by understanding your energy needs and nutrition goals, from daily calorie targets to protein, carb, and fat ratios. Every recipe we build then adapts to you, balancing macronutrients and key vitamins and minerals, while weaving in smart ingredient choices that boost nutrient absorption naturally.";
      case 'substitutions':
        return "Great cooking isn't rigid — it's flexible, creative, and alive. With our AI assistant, you can customize recipes in real time, making smart ingredient swaps that preserve flavor, structure, and nutrition. Whether you're cooking dairy-free, swapping to whole grains, or adjusting for allergies, our system guides you with real food science — so your meals stay joyful, nourishing, and entirely yours.";
      default:
        return "";
    }
  };

  const renderFullArticleContent = (articleSlug: string) => {
    switch (articleSlug) {
      case 'nutrition-tracking':
        return `
          Behind the Magic: How Our AI Crafts Smarter Recipes
          When you open our app and ask for a recipe — something low-carb, or dairy-free, or packed with vitamin C — it might feel like magic.
          A few taps. A few seconds. A beautiful recipe, ready to cook.
          But under the hood, it's not magic.
          It's a beautiful dance of science, cooking wisdom, and precision nutrition. Every recipe we generate follows rules shaped by real culinary chemistry, food safety research, and the messy, wonderful realities of a home kitchen.
          We don't believe in guesses.
          We believe in building flavor and nutrition with care, honesty, and respect for the food you feed yourself and the people you love.
          Here's how it really works:
          
          It Starts with Real Ingredient Science
          The first thing our AI does isn't chopping, stirring, or seasoning.
          It's thinking deeply about ingredients.
          Before anything else, the system pulls data from the most trusted nutrition sources available:
          USDA FoodData Central — the gold standard for lab-analyzed food composition.
          Branded food databases — capturing real manufacturer data for store-bought products.
          Scientific literature — when cooking transformations need extra depth.
          When you ask for almond flour pancakes or tofu stir-fry, the app doesn't guess at calories, vitamins, or carbs. It pulls real numbers tied to real foods — adjusting for brand-specific variations when possible.
          It's ingredient data that respects where food comes from, how it's processed, and how it truly nourishes you.
          Accuracy matters — because nutrition isn't about good intentions; it's about good information.
          
          Cooking Changes Everything — and We Respect It
          Cooking is magic — and it's science.
          The sizzle of fat. The sweet collapse of roasted carrots. The crust that forms on a seared steak.
          But along with flavor and texture, cooking changes nutrients too.
          Water evaporates — concentrating some nutrients and washing others away.
          Delicate vitamins degrade under heat — Vitamin C and B vitamins can lose up to 55% during cooking.
          Minerals like iron and potassium stay behind — but in smaller, more concentrated bites.
          Fats soak into foods during frying — or drip away during roasting.
          Our AI adjusts every recipe's nutrition using real scientific yield factors (how much food shrinks or absorbs) and nutrient retention factors (how cooking alters vitamins and minerals).
          These are the same techniques dietitians and food scientists use to calculate nutrition labels for packaged foods and hospital meals.
          So the numbers you see after you sauté, bake, roast, or simmer match what's truly on your plate — not just what you started with.
          
          Flavor Built with Chemistry
          Flavor doesn't just happen.
          It's a chemical story, written by heat, time, and care.
          Every recipe our AI creates is built to unlock the best flavor reactions:
          Maillard reaction — the browning that gives bread its crust, steaks their sear, and onions their deep sweetness.
          Emulsification — the secret behind rich, creamy sauces that don't break.
          Heat transfer mastery — knowing when to blast food with high heat and when to go slow and gentle.
          We aren't just tossing ingredients together.
          We're designing each step to trigger the right chemical magic at the right moment — so even a fast 20-minute recipe can taste thoughtful, layered, and deeply satisfying.
          You might not see the chemistry happening, but you'll taste it.
          
          Smarter for Your Health Goals
          Healthy recipes aren't just low-calorie.
          True health comes from building food that feeds your body wisely and joyfully.
          Our AI thinks like a chef and a registered dietitian.
          It considers:
          Macronutrients — protein, carbohydrates, fats, fiber, and sugar.
          Micronutrients — the quiet heroes like iron, potassium, vitamin C, calcium, vitamin A, and vitamin D.
          Bioavailability — how well your body can actually absorb those nutrients.
          We don't just list iron — we suggest adding lemon to spinach to boost iron absorption.
          We don't just mention carrots are rich in vitamin A — we design the recipe to include a little healthy fat, so your body can actually absorb it.
          This is nutrition designed for real life — where flavor, chemistry, and health are partners, not enemies.
          
          Measurements You Can Trust
          Precision isn't about being fussy.
          It's about freedom.
          When you trust the measurements, you can relax and focus on the joy of cooking.
          Every recipe includes:
          Standard imperial measurements (cups, tablespoons, ounces) — the language of most home kitchens.
          Metric equivalents (grams, Celsius) — for precision and global cooks.
          Visual and tactile cues — like "golden brown" or "knife slides easily through" — because your senses are the best timers of all.
          Whether you're weighing flour or checking a roast for doneness, our recipes speak the real language of cooks — sight, smell, touch, and intuition, grounded in careful science.
          
          Why It Matters
          When you cook with our app, you're not just following a list of steps.
          You're stepping into a kitchen built on real knowledge — chemistry, nutrition, technique — disguised as easy, joyful guidance.
          You're building meals that are beautiful, delicious, and nourishing — without needing to decode a food science textbook.
          And behind every soup simmer, every loaf rising, every plate set on the table, there's real science working quietly for you.
          Welcome to the future of smarter cooking — joyful, informed, and delicious.
        `;
      case 'personalized-nutrition':
        return `
          How We Align Every Recipe to Your Health Goals
          When you cook with us, you're not just making a meal.
          You're building something in conversation with your body:
          Its energy needs.
          Its cravings.
          Its deeper goals — whether that's fueling a workout, managing blood sugar, supporting recovery, or simply feeling vibrant and alive.
          Our AI doesn't treat you like an anonymous user.
          It treats you like a complex, dynamic human being — one who deserves food that fits.
          Here's how we do it:
          
          1. We Start With Your Unique Blueprint
          Every body has a different starting point.
          That's why we begin by estimating key personal metrics — using the best evidence from nutritional science:
          Basal Metabolic Rate (BMR) — how many calories your body needs at complete rest, based on your age, weight, height, and biological sex.
          Total Daily Energy Expenditure (TDEE) — how your lifestyle and activity levels layer onto that foundation, changing what you truly need day-to-day.
          Some people need more fuel for performance.
          Some need careful balance for healing.
          Some simply want food that feels good and sustaining.
          Our recipes adjust accordingly — because a 5'2" runner and a 6'4" desk worker don't need the same plate, even if the flavor is just as joyful.
          
          2. We Honor Your Macro Goals — Without Forgetting the Micronutrients
          Nutrition is an ecosystem, not a checklist.
          Our AI aligns recipes to your preferred macronutrient targets — whether you're aiming for:
          Higher protein to build muscle
          Lower carbs for blood sugar management
          Balanced macros for general health
          High fiber for gut support
          But we don't stop at macros.
          Each recipe also tracks essential micronutrients — the quiet architects of energy, immunity, and long-term vitality:
          Iron, calcium, potassium, magnesium
          Vitamins C, A, D, E, and the full B-complex
          Phytonutrients like carotenoids and polyphenols for antioxidant power
          Food isn't just fuel.
          It's a matrix of molecules, supporting every system in your body — and we make sure you see that full picture.
          
          3. We Build Bioavailability into Every Meal
          It's not just what you eat.
          It's what your body can absorb and use.
          That's why our AI weaves bioavailability wisdom directly into recipes:
          Add a squeeze of lemon over sautéed spinach to unlock more iron.
          Drizzle olive oil onto roasted carrots to boost vitamin A absorption.
          Pair plant-based proteins smartly to form complete amino acid profiles.
          These aren't random tips.
          They're subtle design choices that let the food do more work for you — quietly, in the background, every time you cook.
          
          4. We Adjust for Special Needs, Without Sacrificing Joy
          You might need — or want — recipes that are:
          Low-sodium for heart health
          Gluten-free for celiac safety
          Low-glycemic to stabilize energy
          Dairy-free for digestion comfort
          High-antioxidant for recovery and resilience
          Our AI doesn't just delete ingredients.
          It rebuilds flavor and structure with intention — using substitutions based on culinary chemistry, not guesswork.
          Because everyone deserves recipes that feel indulgent and satisfying, even when they serve a deeper purpose.
          
          5. We Respect the Whole Person
          Maybe today, your "goal" isn't a number.
          Maybe it's feeding your family after a long week.
          Maybe it's celebrating a milestone.
          Maybe it's nourishing yourself gently through a hard season.
          Our system is smart enough to offer science — and humble enough to recognize that you are not a spreadsheet.
          You are a story in motion.
          We build recipes that flex with your life — science in service of joy, health, and flavor, not against it.
          
          Why It Matters
          When recipes align with your body's needs, food becomes more than pleasure — it becomes power.
          The power to heal.
          The power to thrive.
          The power to build a life full of movement, resilience, and presence.
          We don't just make meals smarter.
          We make them yours.
        `;
      case 'substitutions':
        return `
          Smart Ingredient Substitution: How Our AI Adapts Recipes to You — in Real Time
          Cooking is a living process.
          And real kitchens are full of real surprises:
          You're out of eggs. You need a dairy-free option. You want more protein or less sodium.
          Maybe you simply want the dish to feel more like you.
          That's where our AI doesn't just generate a recipe — it becomes your kitchen co-pilot, helping you adapt, swap, and customize ingredients in real time through our recipe chat assistant.
          Smart Ingredient Substitution isn't just about replacing things.
          It's about preserving flavor, structure, nutrition — and empowering you to make every recipe your own.
          Here's how it really works:
          
          1. Every Ingredient Has a Job — And We Respect It
          Before suggesting any swap, our AI understands what the ingredient is doing in the recipe:
          Is it providing structure (like flour)?
          Is it binding moisture (like eggs)?
          Is it supplying fat for tenderness (like butter)?
          Is it delivering acidity for balance (like lemon juice)?
          When you ask for a substitution — whether in your initial preferences or later through the recipe chat — our AI doesn't just pick a similar ingredient.
          It finds one that performs the same function, so the dish stays true in texture, taste, and craftsmanship.
          Form follows function — even in cooking.
          
          2. You Stay in the Driver's Seat with Real-Time Chat
          When you open a recipe, you're not stuck with a static page.
          You can chat with the AI assistant right inside the recipe details:
          Want to make it dairy-free? Just ask.
          Need a lower-sodium version? It'll adjust.
          Curious if almond flour can replace all-purpose? Our AI will explain when it works — and when it might not — with science behind the advice.
          It's a living conversation — fast, flexible, and always rooted in real food science.
          You're not limited to pre-set "dietary filters."
          You can shape the recipe moment-by-moment based on what you have, what you want, and how you're feeling today.
          
          3. Flavor and Culture Stay Intact
          Smart substitutions honor the original spirit of a recipe.
          Our AI understands:
          Flavor balancing — if you swap something sweet, it considers acidity and saltiness too.
          Regional authenticity — it won't suggest swapping miso paste with ketchup, or coconut milk with heavy cream, unless you ask for a playful twist.
          Culinary integrity — when a dish's identity matters, we suggest substitutions that respect the tradition, not dilute it.
          In the recipe chat, you can even ask:
          "What's a traditional swap for this ingredient if I can't find it?"
          And the assistant will guide you — not just for nutrition, but for authenticity too.
          
          4. Nutrition Adjusts Automatically — No Guesswork
          Every time you modify a recipe, our system recalculates the full nutrition:
          Calories
          Macronutrients (protein, carbs, fat, fiber, sugar)
          Key micronutrients (vitamin C, iron, potassium, calcium, vitamin A, vitamin D)
          Cooking isn't just about flavor.
          It's about fueling your life wisely.
          When you make a change, we show you immediately how it impacts your plate — no hidden math, no surprises later.
          
          5. Food That Fits Today, and Tomorrow
          Maybe today, you want a lower-carb version.
          Maybe next week, you're cooking for a friend who's allergic to nuts.
          Maybe next month, you decide to lean more plant-based.
          Our Smart Ingredient Substitution through recipe chat lets your cooking grow with you.
          One recipe becomes many.
          One meal becomes a flexible foundation for whatever life — and your cravings — bring next.
          You're not trapped in someone else's kitchen rules.
          You're cooking for your real life, with real science quietly working in the background.
          
          Why It Matters
          Good recipes inspire.
          Great recipes adapt.
          When you can adjust ingredients confidently — guided by a smart, science-savvy assistant — you're not just following directions.
          You're collaborating with your food.
          You're crafting meals that nourish your body, honor your tastes, and celebrate your changing life.
          That's the power of Smart Ingredient Substitution.
          Recipes that listen, learn, and grow with you.
        `;
      default:
        return "";
    }
  };

  const generateSchemaData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": articleTitle,
      "description": articleDescription,
      "image": generatedImage || "https://recipealchemist.com/images/default-article-image.jpg",
      "author": {
        "@type": "Organization",
        "name": authorName,
        "url": "https://recipealchemist.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Recipe Alchemist",
        "logo": {
          "@type": "ImageObject",
          "url": "https://recipealchemist.com/lovable-uploads/7d2f98f4-6026-4582-bbe4-e5c69edf0dc9.png",
          "width": "192",
          "height": "192"
        }
      },
      "datePublished": publishDate,
      "dateModified": publishDate,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://recipealchemist.com/how-it-works/${slug}`
      }
    };
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      console.log('Generating image for article:', articleTitle, 'with slug:', slug);
      
      let prompt = `Create an informative, visually appealing illustration for an article titled "${articleTitle}". `;
      
      if (slug === 'intelligent-cooking') {
        prompt += 'Show a modern kitchen setting with AI visualizations analyzing cooking processes, ingredient interactions, and scientific data points. Include elements like molecular structures, temperature graphs, and flavor compound visualizations.';
      } else if (slug === 'nutrition-tracking') {
        prompt += 'Depict nutrition tracking technology with detailed macro visualizations, vitamin/mineral breakdowns, and cooking method impacts on nutrient retention. Show scientific tools monitoring nutritional changes during cooking.';
      } else if (slug === 'personalized-nutrition') {
        prompt += 'Illustrate how our AI aligns recipes to your unique nutritional needs. Show how it considers macronutrient goals, essential micronutrients, and bioavailability.';
      } else if (slug === 'substitutions') {
        prompt += 'Illustrate ingredient substitution science with side-by-side comparison of alternative ingredients. Include molecular analysis showing flavor profile matches, cooking property similarities, and nutritional equivalence data.';
      }
      
      const fileName = `article-${slug}-${Date.now()}.png`;
      
      const imageUrl = await generateRecipeImage(
        articleTitle,
        [{ qty: 1, unit: '', item: articleTitle }],
        [prompt],
        fileName
      );
      
      setGeneratedImage(imageUrl);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderArticle = () => {
    switch (slug) {
      case 'intelligent-cooking':
        return <ArticleIntelligentCooking />;
      case 'nutrition-tracking':
        return (
          <Card className="p-8">
            <article className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-3">{articleTitle}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <ReadTimeDisplay text={getArticleContent() + " " + renderFullArticleContent('nutrition-tracking')} />
                </div>
                <p className="text-xl font-medium text-muted-foreground">
                  {articleDescription}
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
      case 'personalized-nutrition':
        return (
          <Card className="p-8">
            <article className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-3">{articleTitle}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <ReadTimeDisplay text={getArticleContent() + " " + renderFullArticleContent('personalized-nutrition')} />
                </div>
                <p className="text-xl font-medium text-muted-foreground">
                  {articleDescription}
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
      case 'substitutions':
        return (
          <Card className="p-8">
            <article className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-3">{articleTitle}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <ReadTimeDisplay text={getArticleContent() + " " + renderFullArticleContent('substitutions')} />
                </div>
                <p className="text-xl font-medium text-muted-foreground">
                  {articleDescription}
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
      default:
        return (
          <div className="text-center py-12">
            <p className="text-lg">Article not found</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate('/how-it-works')}
            >
              Return to Articles
            </Button>
          </div>
        );
    }
  };

  const getMetaTags = () => {
    const title = `${articleTitle} | Recipe Alchemist`;
    const keywords = `${slug}, recipe science, nutrition analysis, AI cooking, food science`;
    const fullImageUrl = generatedImage || "https://recipealchemist.com/images/default-article-image.jpg";
    
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={articleDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={`https://recipealchemist.com/how-it-works/${slug}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={articleDescription} />
        <meta property="og:url" content={`https://recipealchemist.com/how-it-works/${slug}`} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={articleDescription} />
        <meta name="twitter:image" content={fullImageUrl} />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify(generateSchemaData())}
        </script>
      </Helmet>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {getMetaTags()}
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <div className="container-page py-12">
          <nav className="mb-6" aria-label="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/how-it-works">How It Works</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{articleTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>

          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/how-it-works')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </div>

          <div className="mb-8">
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              {generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt={`Illustration for article: ${articleTitle}`}
                  className="w-full h-64 object-cover" 
                  onError={() => setGeneratedImage(null)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center">
                  {isGenerating ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 animate-spin mb-2" />
                      <p>Generating article image...</p>
                    </div>
                  ) : isImageLoading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 animate-spin mb-2" />
                      <p>Loading image...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-16 w-16 text-gray-400 mb-2" />
                      <p className="text-gray-500">No image available</p>
                      <Button 
                        onClick={handleGenerateImage}
                        className="mt-4 flex items-center"
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Generate Article Image
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {renderArticle()}

          <section aria-labelledby="related-articles-heading" className="mt-12">
            <h2 id="related-articles-heading" className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {['intelligent-cooking', 'nutrition-tracking', 'personalized-nutrition', 'substitutions'].filter(s => s !== slug).map((relatedSlug) => {
                let title = '';
                let description = '';
                
                if (relatedSlug === 'intelligent-cooking') {
                  title = 'How Nutrition Analysis Works';
                  description = 'Discover how our AI uses food science to measure nutrition with precision.';
                } else if (relatedSlug === 'nutrition-tracking') {
                  title = 'How Our AI Crafts Smarter Recipes';
                  description = 'Learn about our method for accurate nutrition calculation.';
                } else if (relatedSlug === 'personalized-nutrition') {
                  title = 'How We Align Every Recipe to Your Health Goals';
                  description = 'See how we tailor recipes to your unique nutritional needs.';
                } else if (relatedSlug === 'substitutions') {
                  title = 'Smart Ingredient Substitutions';
                  description = 'See how we maintain flavor profiles when swapping ingredients.';
                }
                
                return (
                  <Card key={relatedSlug} className="hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <h3 className="font-semibold mb-2">{title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{description}</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/how-it-works/${relatedSlug}`)}
                      >
                        Read Article
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ArticleDetail;
