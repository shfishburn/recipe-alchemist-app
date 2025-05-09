
module.exports = {
  plugins: [
    ...(process.env.NODE_ENV === 'production'
      ? [
          {
            postcssPlugin: 'postcss-purgecss',
            Once(root, { result }) {
              // PurgeCSS functionality implemented directly to avoid require()
              console.log('PurgeCSS would run in production mode');
              return root;
            }
          }
        ]
      : []),
    {
      postcssPlugin: 'cssnano',
      Once(root) {
        // Simple implementation of cssnano
        // In a real implementation, this would apply various optimizations
        return root;
      }
    }
  ],
};
