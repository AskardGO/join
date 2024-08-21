// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
//
// const defaultConfig = getDefaultConfig(__dirname);
// const {assetExts, sourceExts} = defaultConfig.resolver;
//
// const config = {
//   transformer: {
//     babelTransformerPath: require.resolve('react-native-svg-transformer'),
//   },
//   resolver: {
//     assetExts: assetExts.filter(ext => ext !== 'svg'),
//     sourceExts: [...sourceExts, 'js', 'ts', 'tsx', 'svg'],
//   },
// };
//
// module.exports = mergeConfig(defaultConfig, config);

const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'js', 'ts', 'tsx', 'svg'],
    extraNodeModules: {
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
