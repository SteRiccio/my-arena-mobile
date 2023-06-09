import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 0.5,
    padding: 30,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "center",
  },
  buttonsContainer: {
    flex: 0.5,
    alignItems: "center",
  },
  cameraButton: {
    width: 75,
    height: 75,
  },
});
