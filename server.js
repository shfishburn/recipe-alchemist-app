
// This file serves as the entry point for Vercel's serverless functions
const fs = require('fs');
const path = require('path');

// Preload the HTML content
const indexHtml = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');

/**
 * This is a minimal server implementation that enhances the HTML with basic SEO metadata
 * based on the requested path before serving it to the client.
 */
module.exports = (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  // Basic routing to identify content type
  let title = 'Recipe Alchemist';
  let description = 'AI-Powered Cooking & Nutrition';
  let ogType = 'website';
  let ogImage = 'https://recipealchemist.com/images/how-it-works-banner.jpg';
  
  // Check if this is an article route
  if (pathname.startsWith('/how-it-works/')) {
    const slug = pathname.split('/').pop();
    
    // Add dynamic metadata based on the article
    if (slug === 'intelligent-cooking') {
      title = 'How Nutrition Analysis Works | Recipe Alchemist';
      description = 'We don\'t guess what\'s in your food — we measure it with real science.';
    } else if (slug === 'nutrition-tracking') {
      title = 'How Our AI Crafts Smarter Recipes | Recipe Alchemist';
      description = 'Our AI builds recipes with real food science — using trusted nutrition data.';
    } else if (slug === 'personalized-nutrition') {
      title = 'How We Align Every Recipe to Your Health Goals | Recipe Alchemist';
      description = 'Your body is unique — and your food should be too. We start by understanding your energy needs.';
    } else if (slug === 'substitutions') {
      title = 'Smart Ingredient Substitutions | Recipe Alchemist';
      description = 'Great cooking isn\'t rigid — it\'s flexible, creative, and alive.';
    }
    
    ogType = 'article';
  } else if (pathname.startsWith('/recipe/')) {
    title = 'Recipe Details | Recipe Alchemist';
    description = 'Explore this delicious recipe with nutrition analysis and cooking instructions.';
    ogType = 'article';
  }

  // Enhanced HTML with proper SEO tags injected into the head
  const enhancedHtml = indexHtml
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace('</head>', `
      <meta name="description" content="${description}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:type" content="${ogType}" />
      <meta property="og:image" content="${ogImage}" />
      <meta property="og:url" content="https://recipealchemist.com${pathname}" />
      <meta name="twitter:card" content="summary_large_image" />
      </head>
    `);

  // Set proper content type and serve the enhanced HTML
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(enhancedHtml);
};
