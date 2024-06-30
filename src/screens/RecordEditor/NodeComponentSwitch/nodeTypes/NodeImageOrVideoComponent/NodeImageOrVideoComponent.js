import PropTypes from "prop-types";

import { NodeDefFileType } from "@openforis/arena-core";

import { Button, HView, IconButton, Loader, VView, View } from "components";
import { ImageOrVideoValuePreview } from "screens/RecordEditor/NodeValuePreview/ImageOrVideoValuePreview";
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
    nodeValue,
    onDeletePress,
    onOpenCameraPress,
    onFileChoosePress,
    resizing,
  } = useNodeFileComponent({ nodeDef, nodeUuid });

  return (
    <HView style={styles.container}>
      <View style={styles.previewContainer}>
        {resizing && <Loader />}
        {!resizing && nodeValue && (
          <ImageOrVideoValuePreview nodeDef={nodeDef} value={nodeValue} />
        )}
      </View>

      <VView style={styles.buttonsContainer}>
        {nodeValue ? (
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

NodeImageOrVideoComponent.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  nodeUuid: PropTypes.string,
};
