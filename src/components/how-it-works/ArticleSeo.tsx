
import React from 'react';
import { PageSeo } from '@/components/seo/PageSeo';
import { generateSchemaData, SchemaData } from './utils/SchemaGenerator';

interface ArticleSeoProps {
  title: string;
  description: string;
  slug: string;
  imageUrl: string | null;
  authorName: string;
  publishDate: string;
}

export const ArticleSeo: React.FC<ArticleSeoProps> = ({
  title,
  description,
  slug,
  imageUrl,
  authorName,
  publishDate
}) => {
  const schemaData = generateSchemaData({
    articleTitle: title,
    articleDescription: description,
    imageUrl: imageUrl,
    authorName,
    publishDate,
    slug
  });
  
  const keywords = `${slug}, recipe science, nutrition analysis, AI cooking, food science`;
  
  return (
    <PageSeo
      title={`${title} | Recipe Alchemist`}
      description={description}
      keywords={keywords}
      canonicalUrl={`https://recipealchemist.com/how-it-works/${slug}`}
      ogType="article"
      ogImage={imageUrl || "https://recipealchemist.com/images/default-article-image.jpg"}
      ogImageWidth="1200"
      ogImageHeight="630"
      twitterCard="summary_large_image"
      structuredData={schemaData}
    />
  );
};
