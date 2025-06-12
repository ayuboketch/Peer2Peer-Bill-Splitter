module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'transform-inline-environment-variables',
    ['module-resolver', {
      alias: {
        'expo-modules-core': 'expo-modules-core/build'
      }
    }]
  ]
};