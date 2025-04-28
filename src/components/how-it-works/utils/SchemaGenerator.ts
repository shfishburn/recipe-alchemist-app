
export interface SchemaData {
  articleTitle: string;
  articleDescription: string;
  imageUrl: string | null;
  authorName: string;
  publishDate: string;
  slug: string;
}

export const generateSchemaData = ({
  articleTitle,
  articleDescription,
  imageUrl,
  authorName,
  publishDate,
  slug
}: SchemaData) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleTitle,
    "description": articleDescription,
    "image": imageUrl || "https://recipealchemist.com/images/default-article-image.jpg",
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
