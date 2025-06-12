// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Critical changes for TS handling
config.resolver = {
  ...config.resolver,
  sourceExts: [
    ...config.resolver.sourceExts,
    'ts',
    'tsx',
    'cjs',
    'mjs',
    'json'
  ],
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    'expo-modules-core': require.resolve('expo-modules-core/build')
  }
};

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-typescript-transformer')
};

module.exports = config;