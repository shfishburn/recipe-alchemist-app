
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RelatedArticlesProps {
  currentSlug: string;
}

interface ArticleInfo {
  slug: string;
  title: string;
  description: string;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ currentSlug }) => {
  const navigate = useNavigate();
  
  const allArticles: ArticleInfo[] = [
    {
      slug: 'intelligent-cooking',
      title: 'How Nutrition Analysis Works',
      description: 'Discover how our AI uses food science to measure nutrition with precision.'
    },
    {
      slug: 'nutrition-tracking',
      title: 'How Our AI Crafts Smarter Recipes',
      description: 'Learn about our method for accurate nutrition calculation.'
    },
    {
      slug: 'personalized-nutrition',
      title: 'How We Align Every Recipe to Your Health Goals',
      description: 'See how we tailor recipes to your unique nutritional needs.'
    },
    {
      slug: 'substitutions',
      title: 'Smart Ingredient Substitutions',
      description: 'See how we maintain flavor profiles when swapping ingredients.'
    }
  ];
  
  const relatedArticles = allArticles.filter(article => article.slug !== currentSlug);

  return (
    <section aria-labelledby="related-articles-heading" className="mt-12">
      <h2 id="related-articles-heading" className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedArticles.map((article) => (
          <Card key={article.slug} className="hover:shadow-md transition-shadow">
            <div className="p-6">
              <h3 className="font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{article.description}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/how-it-works/${article.slug}`)}
              >
                Read Article
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
