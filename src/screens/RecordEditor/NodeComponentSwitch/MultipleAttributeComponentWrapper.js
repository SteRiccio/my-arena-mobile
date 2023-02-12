import { SingleAttributeComponentSwitch } from "./SingleAttributeComponentSwitch";

export const MultipleAttributeComponentWrapper = (props) => {
  const { nodes, nodeDef } = props;

  return nodes.map((node) => (
    <SingleAttributeComponentSwitch nodeDef={nodeDef} />
  ));
};
