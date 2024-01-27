module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      ["module:@react-native/babel-preset"],
      [
        "module:metro-react-native-babel-preset",
        { useTransformReactJSXExperimental: true },
      ],
      "@babel/preset-react",
      "@babel/preset-typescript",
    ],
    plugins: [
      ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      [
        "module-resolver",
        {
          root: ["./src"],
        },
      ],
      "react-native-reanimated/plugin",
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
