const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable fast refresh to prevent touch event interference
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = {
  ...config,
  server: {
    // Disable fast refresh
    rewriteRequestUrl: (url) => {
      if (!url.endsWith('.bundle')) {
        return url;
      }
      // Remove hot reload parameters that might interfere
      return url.replace(/[?&]platform=.*/, '').replace(/[?&]dev=.*/, '').replace(/[?&]hot=.*/, '');
    },
  },
};
