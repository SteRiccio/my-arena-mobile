import { Image } from "react-native";
import ImageResizer from "@bam.tech/react-native-image-resizer";

import { Files } from "utils";

const _resizeToFitMaxSize = async ({
  fileUri,
  width,
  height,
  maxSize,
  maxTryings = 5,
}) => {
  let tryings = 1;
  let currentDestUri, currentSize;

  const stack = [0.5];

  while (stack.length > 0) {
    let currentScale = stack.pop();

    let currentMaxWidth = Math.floor(width * currentScale);
    let currentMaxHeight = Math.floor(height * currentScale);

    try {
      const {
        uri: destUri,
        path,
        name,
        size,
      } = await ImageResizer.createResizedImage(
        fileUri, // path to the file to resize
        currentMaxWidth,
        currentMaxHeight,
        "JPEG", // compressFormat
        90, // quality
        null, // rotation
        null, // output path
        true,
        { onlyScaleDown: true }
      );
      currentDestUri = destUri;
      currentSize = size;

      if (size === maxSize) {
        // quite rare...
        return { uri: currentDestUri, size: currentSize };
      }
      if (size > maxSize) {
        // always try to resize to fit max size
        stack.push(currentScale * 0.5);
      } else if (tryings < maxTryings) {
        // stop if max tryings reached and current size is less than maxSize
        stack.push(currentScale * 1.5);
      }
    } catch (error) {
      // Oops, something went wrong. Check that the filename is correct and
      // inspect err to get more details.
      return { error };
    }
    tryings = tryings + 1;
  }
  return { uri: currentDestUri, size: currentSize };
};

const resizeToFitMaxSize = async ({ fileUri, maxSize }) => {
  const info = await Files.getInfo(fileUri);
  if (info.size <= maxSize) return null;

  return new Promise((resolve) => {
    Image.getSize(fileUri, (width, height) => {
      _resizeToFitMaxSize({ fileUri, width, height, maxSize }).then((result) =>
        resolve(result)
      );
    });
  });
};

export const ImageUtils = {
  resizeToFitMaxSize,
};
