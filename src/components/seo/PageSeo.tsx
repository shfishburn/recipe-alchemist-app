
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageSeoProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, any>;
}

export const PageSeo = ({
  title,
  description,
  canonicalUrl,
  keywords,
  ogType = 'website',
  ogImage = 'https://recipealchemist.com/lovable-uploads/7d2f98f4-6026-4582-bbe4-e5c69edf0dc9.png',
  ogImageWidth = '1200',
  ogImageHeight = '630',
  twitterCard = 'summary_large_image',
  structuredData
}: PageSeoProps) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={ogImageWidth} />
      <meta property="og:image:height" content={ogImageHeight} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Schema.org structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
