const TerserPlugin = require("terser-webpack-plugin");

module.exports = (config) => {
  // 1. Add the DefinePlugin to set the global nonce variable
  // We use 'random123' as a placeholder. In a perfect world, your server replaces this.
  // 2. Your existing Terser configuration
  if (config.mode === 'production') {
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            global_defs: {
              ngDevMode: false
            }
          },
        },
      }),
    ];
  }

  return config;
};
