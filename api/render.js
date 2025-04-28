
const fs = require('fs');
const path = require('path');

/**
 * This is a server-side renderer that enhances the HTML with SEO metadata
 * based on the requested path before serving it to the client.
 */
module.exports = (req, res) => {
  try {
    // Get the full URL and extract path information
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const query = Object.fromEntries(url.searchParams.entries());
    const routePath = query.route || pathname; // Use the route param if provided
    
    console.log(`Rendering request for: ${routePath}`);
    
    // Define content type based on file extension
    const getContentType = (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      const types = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
      };
      return types[ext] || 'application/octet-stream';
    };
    
    // Handle static assets directly
    if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)) {
      try {
        // Try to read the file from disk
        const filePath = path.join(process.cwd(), 'dist', pathname);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath);
          res.setHeader('Content-Type', getContentType(pathname));
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          return res.status(200).send(content);
        }
      } catch (assetError) {
        console.error(`Error serving asset ${pathname}:`, assetError);
      }
      
      // If we couldn't serve the file directly, fall back to a redirect
      return res.status(307).setHeader('Location', pathname).send();
    }

    // For HTML routes, read the index.html file from the build directory
    const indexPath = path.join(process.cwd(), 'dist/index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');
    
    // Basic routing to identify content type
    let title = 'Recipe Alchemist';
    let description = 'AI-Powered Cooking & Nutrition';
    let ogType = 'website';
    let ogImage = 'https://recipealchemist.com/lovable-uploads/7d2f98f4-6026-4582-bbe4-e5c69edf0dc9.png';
    
    // Check if this is an article route
    if (routePath.startsWith('/how-it-works/')) {
      const slug = routePath.split('/').pop();
      
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
    } else if (routePath.startsWith('/recipe/')) {
      const recipeId = routePath.split('/').pop();
      title = `Recipe Details | Recipe Alchemist`;
      description = 'Explore this delicious recipe with nutrition analysis and cooking instructions.';
      ogType = 'article';
    }

    // Base URL for absolute references
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://recipealchemist.com';
    
    // Convert relative asset paths to absolute paths and add SEO tags
    let enhancedHtml = indexHtml
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace('</head>', `
        <meta name="description" content="${description}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:type" content="${ogType}" />
        <meta property="og:image" content="${ogImage}" />
        <meta property="og:url" content="${baseUrl}${routePath}" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preload" href="${baseUrl}/assets/vendor.*.js" as="script" crossorigin />
        </head>
      `);
      
    // Fix asset paths for proper loading
    enhancedHtml = enhancedHtml
      .replace(/src="\//g, `src="${baseUrl}/`)
      .replace(/href="\//g, `href="${baseUrl}/`)
      // But don't modify absolute URLs that already have https:// prefix
      .replace(new RegExp(`src="${baseUrl}/(https?:)`, 'g'), 'src="$1')
      .replace(new RegExp(`href="${baseUrl}/(https?:)`, 'g'), 'href="$1');

    // Set proper content type and serve the enhanced HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(enhancedHtml);
    console.log(`Successfully rendered ${routePath} with title: ${title}`);
  } catch (error) {
    console.error('Error generating HTML:', error);
    
    // Attempt to serve a minimal fallback HTML
    try {
      const fallbackHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Recipe Alchemist</title>
          <style>
            body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5; }
            .error-container { max-width: 600px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>Recipe Alchemist</h1>
            <p>We're experiencing technical difficulties. Please try again in a moment.</p>
            <p><a href="/">Return to home page</a></p>
          </div>
          <script>
            // Attempt to load the main app again after a delay
            setTimeout(function() { window.location.href = "/"; }, 3000);
          </script>
        </body>
        </html>
      `;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(500).send(fallbackHtml);
    } catch (fallbackError) {
      return res.status(500).send('An error occurred while generating the page');
    }
  }
};
