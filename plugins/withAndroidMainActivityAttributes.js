const { withAndroidManifest } = require("@expo/config-plugins");

const log = (message) =>
  console.warn(`withAndroidMainActivityAttributes: ${message}`);

function addAttributesToMainActivity(androidManifest, attributes) {
  const { manifest } = androidManifest;

  const applications = manifest["application"];
  if (!Array.isArray(applications)) {
    log("No application array in manifest?");
    return androidManifest;
  }

  const application = applications.find(
    (item) => item.$["android:name"] === ".MainApplication"
  );
  if (!application) {
    log("No .MainApplication?");
    return androidManifest;
  }

  const activities = application["activity"];
  if (!Array.isArray(activities)) {
    log("No activity array in .MainApplication?");
    return androidManifest;
  }

  const activity = activities.find(
    (item) => item.$["android:name"] === ".MainActivity"
  );
  if (!activity) {
    log("No .MainActivity?");
    return androidManifest;
  }

  activity.$ = { ...activity.$, ...attributes };

  return androidManifest;
}

module.exports = function withAndroidMainActivityAttributes(
  config,
  attributes
) {
  return withAndroidManifest(config, (config) => {
    config.modResults = addAttributesToMainActivity(
      config.modResults,
      attributes
    );
    return config;
  });
};
