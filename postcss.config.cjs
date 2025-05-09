// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
    require('cssnano')({ preset: 'default' }),
  ],
};
