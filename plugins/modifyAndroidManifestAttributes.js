const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function androidManifestPlugin(config, data) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;
    const categories = Object.keys(data);

    categories.forEach((category) => {
      if (
        androidManifest[category] &&
        Array.isArray(androidManifest[category]) &&
        androidManifest[category].length > 0
      ) {
        const attributes = Object.keys(data[category]);
        attributes.forEach((attribute) => {
          androidManifest[category][0].$[attribute] = data[category][attribute];
        });
      }
    });

    return config;
  });
};
