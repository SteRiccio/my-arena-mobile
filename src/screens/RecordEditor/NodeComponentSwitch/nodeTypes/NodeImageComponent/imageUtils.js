import { Image } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";

import { Files } from "utils";

const _resizeToFitMaxSize = async ({
  fileUri,
  width: sourceWidth,
  // height: sourceHeight,
  size: sourceSize,
  maxSize,
  maxTryings = 5,
}) => {
  let tryings = 1;
  let uri, width, height;

  let size = sourceSize;
  let sizeRatio = maxSize / size;

  const generateSuccessfulResult = () => ({ uri, size, height, width });

  const stack = [sizeRatio];

  while (stack.length > 0) {
    let scale = stack.pop();

    let currentMaxWidth = Math.floor(sourceWidth * scale);
    // let currentMaxHeight = Math.floor(sourceHeight * currentScale);

    try {
      const {
        uri: resizedImageUri,
        height: resizedImageHeight,
        width: resizedImageWidth,
      } = await ImageManipulator.manipulateAsync(
        fileUri,
        [{ resize: { width: currentMaxWidth } }],
        { compress: 0.9 }
      );

      uri = resizedImageUri;
      height = resizedImageHeight;
      width = resizedImageWidth;
      size = await Files.getSize(resizedImageUri);
      sizeRatio = maxSize / size;

      if (size === maxSize) {
        // quite rare...
        return generateSuccessfulResult();
      }
      if (size > maxSize) {
        // always try to resize to fit max size
        stack.push(scale * sizeRatio); // scale * size ratio
      } else if (tryings < maxTryings) {
        stack.push(scale * 1.25); // scale + 25%
      } else {
        // stop if max tryings reached and current size is less than maxSize
      }
    } catch (error) {
      // Oops, something went wrong. Check that the filename is correct and
      // inspect err to get more details.
      return { error };
    }
    tryings = tryings + 1;
  }
  return generateSuccessfulResult();
};

const resizeToFitMaxSize = async ({ fileUri, maxSize }) => {
  const info = await Files.getInfo(fileUri);
  const { size } = info;
  if (size <= maxSize) return null;

  return new Promise((resolve) => {
    Image.getSize(fileUri, (width, height) => {
      _resizeToFitMaxSize({ fileUri, width, height, size, maxSize }).then(
        (result) => resolve(result)
      );
    });
  });
};

export const ImageUtils = {
  resizeToFitMaxSize,
};
