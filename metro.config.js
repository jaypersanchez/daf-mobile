/**
 * Serto Mobile App
 *
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        babelTransformerPath: require.resolve('react-native-typescript-transformer'),
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
