import { TouchableHighlight } from "react-native";
import PropTypes from "prop-types";

import { NodeDefFileType } from "@openforis/arena-core";

import {
  Button,
  HView,
  IconButton,
  Image,
  ImagePreviewDialog,
  Loader,
  Text,
  VView,
  View,
} from "components";
import { useNodeFileComponent } from "./useNodeFileComponent";

import styles from "./styles";

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
    closeImagePreview,
    fileName,
    imagePreviewOpen,
    onDeletePress,
    onOpenCameraPress,
    onFileChoosePress,
    onFileOpenPress,
    onImagePreviewPress,
    pickedFileUri,
    resizing,
  } = useNodeFileComponent({ nodeDef, nodeUuid });

  return (
    <HView style={styles.container}>
      <View style={styles.previewContainer}>
        {resizing && <Loader />}
        {!resizing && pickedFileUri && (
          <>
            {fileType === NodeDefFileType.image ? (
              <TouchableHighlight onPress={onImagePreviewPress}>
                <Image source={{ uri: pickedFileUri }} style={styles.image} />
              </TouchableHighlight>
            ) : (
              <VView>
                <IconButton
                  icon="file-outline"
                  onPress={onFileOpenPress}
                  size={40}
                />
                <Text>{fileName}</Text>
              </VView>
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

      {imagePreviewOpen && (
        <ImagePreviewDialog
          fileName={fileName}
          imageUri={pickedFileUri}
          onClose={closeImagePreview}
        />
      )}
    </HView>
  );
};

NodeImageOrVideoComponent.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  nodeUuid: PropTypes.string,
};
