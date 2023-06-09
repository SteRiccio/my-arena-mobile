import { Text } from "components";
import { NodeImageComponent } from "./NodeImageComponent";

export const NodeFileComponent = (props) => {
  const { nodeDef } = props;

  if (__DEV__) {
    console.log(`rendering NodeFileComponent for ${nodeDef.props.name}`);
  }

  if (nodeDef.props.fileType === "image") {
    return <NodeImageComponent {...props} />;
  }

  return <Text textKey={`File type not supported (${nodeDef.fileType})`} />;
};
