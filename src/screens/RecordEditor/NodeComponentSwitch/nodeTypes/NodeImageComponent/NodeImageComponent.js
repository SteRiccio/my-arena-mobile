import { Image } from "react-native";

import { Button, HView, IconButton, Loader, VView, View } from "components";
import { useNodeImageComponent } from "./useNodeImageComponent";

import styles from "./styles";

export const NodeImageComponent = (props) => {
  const { nodeDef, nodeUuid } = props;

  if (__DEV__) {
    console.log(`rendering NodeImageComponent for ${nodeDef.props.name}`);
  }

  const {
    onDeletePress,
    onOpenCameraPress,
    onPictureChoosePress,
    pickedImageUri,
    resizing,
  } = useNodeImageComponent({ nodeDef, nodeUuid });

  return (
    <HView style={styles.container}>
      <View style={styles.imageContainer}>
        {resizing && <Loader />}
        {!resizing && pickedImageUri && (
          <Image source={{ uri: pickedImageUri }} style={styles.image} />
        )}
      </View>

      <VView style={styles.buttonsContainer}>
        <IconButton
          icon="camera"
          onPress={onOpenCameraPress}
          style={styles.cameraButton}
          size={40}
        />
        <Button
          icon="view-gallery"
          onPress={onPictureChoosePress}
          textKey="dataEntry:fileAttributeImage.chooseAPicture"
        />

        {pickedImageUri && (
          <IconButton icon="trash-can-outline" onPress={onDeletePress} />
        )}
      </VView>
    </HView>
  );
};
