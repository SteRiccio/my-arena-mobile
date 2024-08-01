import { Text } from "components";

export const EntityButton = ({ treeNode, isCurrentEntity }) => {
  const { label } = treeNode;

  return (
    <Text
      style={{
        fontSize: isCurrentEntity ? 24 : 20,
        fontWeight: isCurrentEntity ? "bold" : "normal",
      }}
      textKey={label}
    />
  );
};
