
const fs = require('fs');
const path = require('path');

/**
 * This is a minimal server implementation that enhances the HTML with basic SEO metadata
 * based on the requested path before serving it to the client.
 */
module.exports = (req, res) => {
  try {
    // Determine if the request is for an asset or a route
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    // If requesting a static asset with extension (CSS, JS, images)
    if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)) {
      // For assets, redirect to the static files
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.status(307).setHeader('Location', pathname).send();
    }

    // For HTML routes, read the index.html file from the build directory
    const indexHtml = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
    
    // Basic routing to identify content type
    let title = 'Recipe Alchemist';
    let description = 'AI-Powered Cooking & Nutrition';
    let ogType = 'website';
    let ogImage = 'https://recipealchemist.com/lovable-uploads/7d2f98f4-6026-4582-bbe4-e5c69edf0dc9.png';
    
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

    // Convert relative asset paths to absolute paths
    let enhancedHtml = indexHtml
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
      
    // Fix asset paths if needed - transform relative paths to absolute paths
    enhancedHtml = enhancedHtml
      .replace(/src="\/(?!\/)/g, 'src="/')
      .replace(/href="\/(?!\/)/g, 'href="/');

    // Set proper content type and serve the enhanced HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(enhancedHtml);
  } catch (error) {
    console.error('Error generating HTML:', error);
    res.status(500).send('An error occurred while generating the page');
  }
};
