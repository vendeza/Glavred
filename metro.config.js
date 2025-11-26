const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  ...(config.resolver.alias ?? {}),
  '@': __dirname,
  '@stores': path.resolve(__dirname, 'store'),
  '@services': path.resolve(__dirname, 'services'),
  firebase: path.resolve(__dirname, 'node_modules/firebase'),
  'firebase/app': path.resolve(__dirname, 'node_modules/firebase/app'),
  'firebase/functions': path.resolve(__dirname, 'node_modules/firebase/functions'),
};

module.exports = config;

