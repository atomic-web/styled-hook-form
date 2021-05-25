const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/stories/*.@(ts|tsx|js|jsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-storysource",
  ],
  webpackFinal: async (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin({}));
    config.module.rules.push({
      test: /stories(\\|\/).*\.(ts|tsx)$/,
      loaders: [
        {
          loader: require.resolve("babel-loader"),
        },
        {
          loader: require.resolve("@storybook/source-loader"),
        },
      ]
    });
    return config;
  },
};
