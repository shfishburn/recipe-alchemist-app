
import React, { useState } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateRecipeImage } from '@/hooks/recipe-chat/utils/generate-recipe-image';

interface ArticleImageProps {
  slug: string;
  articleTitle: string;
  generatedImage: string | null;
  setGeneratedImage: (url: string) => void;
  isGenerating: boolean;
  setIsGenerating: (state: boolean) => void;
  isImageLoading: boolean;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({
  slug,
  articleTitle,
  generatedImage,
  setGeneratedImage,
  isGenerating,
  setIsGenerating,
  isImageLoading,
}) => {
  
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

  return (
    <div className="mb-8">
      <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        {generatedImage ? (
          <img 
            src={generatedImage} 
            alt={`Illustration for article: ${articleTitle}`}
            className="w-full h-64 object-cover" 
            onError={() => setGeneratedImage('')}
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
  );
};
