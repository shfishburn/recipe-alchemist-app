
module.exports = {
  plugins: [
    ...(process.env.NODE_ENV === 'production'
      ? [
          require('@fullhuman/postcss-purgecss')({
            content: [
              './index.html',
              './src/**/*.{js,ts,jsx,tsx,html}',
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
          })
        ]
      : []),
    require('cssnano')({ preset: 'default' }),
  ],
};
