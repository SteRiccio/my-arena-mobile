import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";

import {
  CollapsiblePanel,
  Dialog,
  FormItem,
  HView,
  IconButton,
  LoadingIcon,
  VView,
} from "components";
import { ImageUtils } from "./imageUtils";
import { Files } from "utils";

const styles = StyleSheet.create({
  dialog: { display: "flex", height: "90%", padding: 5 },
  content: { display: "flex", height: "80%", gap: 20 },
  details: { flex: 1 },
  image: { flex: 1, resizeMode: "contain" },
});

const ImageInfo = (props) => {
  const { imageUri } = props;

  const [info, setInfo] = useState(null);

  const { width, height, size } = info ?? {};

  const fetchInfo = useCallback(async () => {
    const { width, height } = await ImageUtils.getSize(imageUri);
    const size = await Files.getSize(imageUri);
    setInfo({ width, height, size: Files.toHumanReadableFileSize(size) });
  }, [imageUri]);

  useEffect(() => {
    if (imageUri) {
      fetchInfo().catch((e) => {
        // ignore it
      });
    }
  }, [imageUri]);

  if (!info) return <LoadingIcon />;

  return (
    <VView>
      <FormItem labelKey="common:size">{size}</FormItem>
      <FormItem labelKey="dataEntry:fileAttributeImage.resolution">{`${width}x${height}`}</FormItem>
    </VView>
  );
};

export const ImagePreviewDialog = (props) => {
  const { fileName, imageUri, onClose } = props;

  const onSharePress = useCallback(async () => {
    const mimeType = Files.getMimeTypeFromName(fileName);
    await Files.shareFile({ url: imageUri, mimeType });
  }, [fileName, imageUri]);

  return (
    <Dialog
      onClose={onClose}
      style={styles.dialog}
      title="dataEntry:fileAttributeImage.imagePreview"
    >
      <VView style={styles.content} transparent>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <HView transparent>
          <CollapsiblePanel
            containerStyle={styles.details}
            headerKey="common:details"
          >
            <ImageInfo imageUri={imageUri} />
          </CollapsiblePanel>
          <IconButton icon="share" onPress={onSharePress} textKey="share" />
        </HView>
      </VView>
    </Dialog>
  );
};
