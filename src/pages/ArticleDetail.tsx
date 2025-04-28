
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

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('Article');

  useEffect(() => {
    // Set page title based on slug
    if (slug === 'intelligent-cooking') {
      setArticleTitle('AI Makes Cooking Intelligent');
    } else if (slug === 'nutrition-tracking') {
      setArticleTitle('Precise Nutrition Tracking');
    } else if (slug === 'substitutions') {
      setArticleTitle('Smart Ingredient Substitutions');
    }
  }, [slug]);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      // For now, we'll just generate an image for the intelligent cooking article
      const prompt = `Create a photorealistic image for an article titled "${articleTitle}". 
        Show cooking with advanced technology, AI assistance, and scientific elements. 
        Include visual elements representing recipe analysis and nutrition data. 
        Use a bright, clean style with soft lighting.`;
      
      // Use the existing image generation utility
      const imageUrl = await generateRecipeImage(
        articleTitle,
        [{ qty: 1, unit: '', item: articleTitle }],
        [prompt],
        `article-${slug}`
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
            <h2 className="text-3xl font-bold mb-6">Precise Nutrition Tracking</h2>
            <p className="mb-4">Article content coming soon...</p>
          </Card>
        );
      case 'substitutions':
        return (
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">Smart Ingredient Substitutions</h2>
            <p className="mb-4">Article content coming soon...</p>
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
          <div className="flex justify-between items-center mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/how-it-works')}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
            
            {!generatedImage && !isGenerating && (
              <Button 
                onClick={handleGenerateImage}
                className="flex items-center"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate Article Image
              </Button>
            )}
            
            {isGenerating && (
              <Button disabled className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </Button>
            )}
          </div>
          
          {generatedImage && (
            <div className="mb-8">
              <img 
                src={generatedImage} 
                alt={articleTitle}
                className="rounded-lg w-full max-h-72 object-cover shadow-md" 
              />
            </div>
          )}
          
          {renderArticle()}
        </div>
      </main>
    </div>
  );
};

export default ArticleDetail;
