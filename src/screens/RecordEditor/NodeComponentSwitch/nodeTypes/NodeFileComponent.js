import PropTypes from "prop-types";
import { NodeDefFileType } from "@openforis/arena-core";

import { Text } from "components";
import { NodeImageOrVideoComponent } from "./NodeImageOrVideoComponent";

const supportedFileTypes = [
  NodeDefFileType.other,
  NodeDefFileType.image,
  NodeDefFileType.video,
];

export const NodeFileComponent = (props) => {
  const { nodeDef } = props;

  if (__DEV__) {
    console.log(`rendering NodeFileComponent for ${nodeDef.props.name}`);
  }

  const { fileType = NodeDefFileType.other } = nodeDef.props;

  if (supportedFileTypes.includes(fileType)) {
    return <NodeImageOrVideoComponent {...props} />;
  }

  return <Text textKey={`File type not supported (${fileType})`} />;
};

NodeFileComponent.propTypes = {
  nodeDef: PropTypes.object.isRequired,
};
