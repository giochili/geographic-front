const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Ensure resolve.fallback exists
      if (!webpackConfig.resolve) {
        webpackConfig.resolve = {};
      }
      if (!webpackConfig.resolve.fallback) {
        webpackConfig.resolve.fallback = {};
      }

      // Add fallbacks for Node.js core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "util": require.resolve("util"),
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser.js"),
        "assert": require.resolve("assert"),
        "http": false,
        "https": false,
        "os": false,
        "url": false,
        "zlib": false,
        "path": require.resolve("path-browserify"),
        "fs": false,
      };

      // Add extension resolution for .mjs files
      if (!webpackConfig.resolve.extensions) {
        webpackConfig.resolve.extensions = ['.js', '.jsx', '.json'];
      }
      if (!webpackConfig.resolve.extensions.includes('.mjs')) {
        webpackConfig.resolve.extensions.push('.mjs');
      }

      // Ensure plugins array exists
      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }

      // Add plugins to provide globals
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser.js',
        }),
        // Replace process/browser imports (with or without extension) with the actual file
        new webpack.NormalModuleReplacementPlugin(
          /^process\/browser$/,
          require.resolve('process/browser.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /^process\/browser\.js$/,
          require.resolve('process/browser.js')
        )
      );

      // Configure resolve to handle process/browser properly
      webpackConfig.resolve.alias = {
        ...(webpackConfig.resolve.alias || {}),
        'process/browser': require.resolve('process/browser.js'),
      };

      // Configure module rules to handle .mjs files
      if (!webpackConfig.module) {
        webpackConfig.module = {};
      }
      if (!webpackConfig.module.rules) {
        webpackConfig.module.rules = [];
      }

      // Add rule to handle .mjs files and allow imports without extensions
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      });

      return webpackConfig;
    },
  },
};

