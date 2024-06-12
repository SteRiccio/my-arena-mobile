import { Text } from "components";
import { NodeValuePreviewPropTypes } from "./NodeValuePreviewPropTypes";

export const CoordinateValuePreview = (props) => {
  const { value } = props;

  return <Text>{JSON.stringify(value)}</Text>;
};

CoordinateValuePreview.propTypes = NodeValuePreviewPropTypes;
