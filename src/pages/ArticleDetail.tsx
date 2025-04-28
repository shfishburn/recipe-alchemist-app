
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { Helmet } from 'react-helmet';
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
    } else if (slug === 'substitutions') {
      setArticleTitle('Smart Ingredient Substitutions');
      setArticleDescription('See how our AI suggests perfect substitutions while maintaining flavor profiles and nutrition balance to accommodate your dietary needs and preferences.');
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

  const generateSchemaData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": articleTitle,
      "description": articleDescription,
      "image": generatedImage || "https://recipealchemist.com/images/default-article-image.jpg",
      "author": {
        "@type": "Organization",
        "name": authorName
      },
      "publisher": {
        "@type": "Organization",
        "name": "Recipe Alchemist",
        "logo": {
          "@type": "ImageObject",
          "url": "https://recipealchemist.com/logo.png"
        }
      },
      "datePublished": publishDate,
      "dateModified": publishDate
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
                <h3 className="text-xl font-semibold mb-3">1. It Starts with Real Ingredient Science</h3>
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
                <h3 className="text-xl font-semibold mb-3">2. Cooking Changes Everything — and We Respect It</h3>
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
                <h3 className="text-xl font-semibold mb-3">3. Flavor Built with Chemistry</h3>
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
                <h3 className="text-xl font-semibold mb-3">4. Smarter for Your Health Goals</h3>
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
                <h3 className="text-xl font-semibold mb-3">5. Measurements You Can Trust</h3>
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
      case 'substitutions':
        return (
          <Card className="p-8">
            <article className="prose prose-lg max-w-4xl mx-auto dark:prose-invert">
              <header className="mb-8">
                <h1 className="text-3xl font-bold mb-3">{articleTitle}</h1>
                <p className="text-xl font-medium text-muted-foreground">
                  {articleDescription}
                </p>
              </header>
              <p className="mb-4">Article content coming soon...</p>
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
    
    return (
      <Helmet>
        <title>{title}</title>
        <meta 
          name="description" 
          content={articleDescription} 
        />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={`https://recipealchemist.com/how-it-works/${slug}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={articleDescription} />
        <meta property="og:url" content={`https://recipealchemist.com/how-it-works/${slug}`} />
        {generatedImage && <meta property="og:image" content={generatedImage} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={articleDescription} />
        {generatedImage && <meta name="twitter:image" content={generatedImage} />}
        
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
              {['intelligent-cooking', 'nutrition-tracking', 'substitutions'].filter(s => s !== slug).map((relatedSlug) => {
                let title = '';
                let description = '';
                
                if (relatedSlug === 'intelligent-cooking') {
                  title = 'How Nutrition Analysis Works';
                  description = 'Discover how our AI uses food science to measure nutrition with precision.';
                } else if (relatedSlug === 'nutrition-tracking') {
                  title = 'Precise Nutrition Tracking';
                  description = 'Learn about our method for accurate nutrition calculation.';
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
