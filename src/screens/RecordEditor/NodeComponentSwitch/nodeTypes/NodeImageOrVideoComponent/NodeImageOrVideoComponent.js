import { Image } from "react-native";

import { Button, HView, IconButton, Loader, VView, View } from "components";
import { useNodeFileComponent } from "./useNodeFileComponent";

import styles from "./styles";
import { NodeDefFileType } from "@openforis/arena-core";

const fileChooseTextKeySuffixByFileType = {
  [NodeDefFileType.audio]: "Audio",
  [NodeDefFileType.image]: "Picture",
  [NodeDefFileType.video]: "Video",
  [NodeDefFileType.other]: "File",
};

export const NodeImageOrVideoComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(
      `rendering NodeImageOrVideoComponent for ${nodeDef.props.name}`
    );
  }

  const { fileType = NodeDefFileType.other } = nodeDef.props;
  const fileChooseTextKeySuffix = fileChooseTextKeySuffixByFileType[fileType];

  const {
    onDeletePress,
    onOpenCameraPress,
    onFileChoosePress,
    pickedFileUri,
    resizing,
  } = useNodeFileComponent({ nodeDef, nodeUuid });

  return (
    <HView style={styles.container}>
      <View style={styles.imageContainer}>
        {resizing && <Loader />}
        {!resizing && pickedFileUri && (
          <>
            {fileType === NodeDefFileType.image ? (
              <Image source={{ uri: pickedFileUri }} style={styles.image} />
            ) : (
              <></>
            )}
          </>
        )}
      </View>

      <VView style={styles.buttonsContainer}>
        {pickedFileUri ? (
          <IconButton icon="trash-can-outline" onPress={onDeletePress} />
        ) : (
          <>
            {[NodeDefFileType.image, NodeDefFileType.video].includes(
              fileType
            ) && (
              <IconButton
                icon="camera"
                onPress={onOpenCameraPress}
                style={styles.cameraButton}
                size={40}
              />
            )}
            <Button
              icon="view-gallery"
              onPress={onFileChoosePress}
              textKey={`dataEntry:fileAttribute.choose${fileChooseTextKeySuffix}`}
            />
          </>
        )}
      </VView>
    </HView>
  );
};
