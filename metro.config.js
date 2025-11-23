const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  ...(config.resolver.alias ?? {}),
  '@': __dirname,
  '@stores': path.resolve(__dirname, 'store'),
  '@services': path.resolve(__dirname, 'services'),
};

module.exports = config;

