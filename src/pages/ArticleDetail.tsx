
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

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('Article');
  const [articleDescription, setArticleDescription] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (slug === 'intelligent-cooking') {
      setArticleTitle('AI Makes Cooking Intelligent');
      setArticleDescription('Discover how our AI uses food science to transform your kitchen experience');
    } else if (slug === 'nutrition-tracking') {
      setArticleTitle('Precise Nutrition Tracking');
      setArticleDescription('Learn how we calculate nutrition data based on actual cooking methods');
    } else if (slug === 'substitutions') {
      setArticleTitle('Smart Ingredient Substitutions');
      setArticleDescription('See how our AI suggests perfect substitutions while maintaining flavor profiles');
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

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{articleTitle} - Recipe Alchemist</title>
        <meta 
          name="description" 
          content={`Learn about ${articleTitle} in Recipe Alchemist's knowledge base.`} 
        />
      </Helmet>
      <Navbar />
      <main className="flex-1 animate-fadeIn">
        <div className="container-page py-12">
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

          {/* Hero section with image and buttons */}
          <div className="mb-8">
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              {generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt={articleTitle}
                  className="w-full h-64 object-cover" 
                  onError={() => setGeneratedImage(null)}
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
        </div>
      </main>
    </div>
  );
};

export default ArticleDetail;
