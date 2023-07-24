import "expo/build/Expo.fx";
import { Platform } from "react-native";
import { registerRootComponent } from "expo";
import { activateKeepAwakeAsync } from "expo-keep-awake";
import { createRoot } from "react-dom/client";
import App from "./src/App";

if (__DEV__) {
  activateKeepAwakeAsync();
}

if (Platform.OS === "web") {
  const root = createRoot(
    document.getElementById("root") ?? document.getElementById("main")
  );
  root.render(<App />);
} else {
  registerRootComponent(App);
}
