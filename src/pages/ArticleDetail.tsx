
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ArticleIntelligentCooking } from '@/components/how-it-works/ArticleIntelligentCooking';
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
import { ArticleImage } from '@/components/how-it-works/ArticleImage';
import { RelatedArticles } from '@/components/how-it-works/RelatedArticles';
import { ArticleSeo } from '@/components/how-it-works/ArticleSeo';
import { ArticleNutritionTracking } from '@/components/how-it-works/articles/ArticleNutritionTracking';
import { ArticlePersonalizedNutrition } from '@/components/how-it-works/articles/ArticlePersonalizedNutrition';
import { ArticleSubstitutions } from '@/components/how-it-works/articles/ArticleSubstitutions';
import { articlesContent } from '@/components/how-it-works/ArticleContent';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('Article');
  const [articleDescription, setArticleDescription] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [publishDate] = useState('2025-04-28T10:00:00Z');
  const [authorName] = useState('Recipe Alchemist Team');

  useEffect(() => {
    if (!slug) return;
    
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

  const renderArticle = () => {
    if (!slug) return null;
    
    switch (slug) {
      case 'intelligent-cooking':
        return <ArticleIntelligentCooking />;
      case 'nutrition-tracking':
        return (
          <ArticleNutritionTracking
            title={articleTitle}
            description={articleDescription}
            content={articlesContent['nutrition-tracking']}
          />
        );
      case 'personalized-nutrition':
        return (
          <ArticlePersonalizedNutrition
            title={articleTitle}
            description={articleDescription}
            content={articlesContent['personalized-nutrition']}
          />
        );
      case 'substitutions':
        return (
          <ArticleSubstitutions
            title={articleTitle}
            description={articleDescription}
            content={articlesContent['substitutions']}
          />
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

  return (
    <div className="min-h-screen flex flex-col">
      {slug && (
        <ArticleSeo 
          title={articleTitle} 
          description={articleDescription}
          slug={slug}
          imageUrl={generatedImage}
          authorName={authorName}
          publishDate={publishDate}
        />
      )}

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

          {slug && (
            <ArticleImage
              slug={slug}
              articleTitle={articleTitle}
              generatedImage={generatedImage}
              setGeneratedImage={setGeneratedImage}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              isImageLoading={isImageLoading}
            />
          )}
          
          {renderArticle()}
          
          {slug && <RelatedArticles currentSlug={slug} />}
        </div>
      </main>
    </div>
  );
};

export default ArticleDetail;
