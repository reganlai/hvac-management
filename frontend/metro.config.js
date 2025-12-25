const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .js extensions in imports (required for React Navigation 7)
config.resolver.sourceExts.push('js');

module.exports = config;
