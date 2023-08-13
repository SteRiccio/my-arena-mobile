import { useCallback } from "react";

import { NodeDefType, NodeDefs, Objects } from "@openforis/arena-core";

import { SystemUtils } from "utils";
import { HView, IconButton, TextInput } from "components";
import { useToast } from "hooks";
import { useNodeComponentLocalState } from "../../useNodeComponentLocalState";

export const NodeTextComponent = (props) => {
  const { nodeDef, nodeUuid, style } = props;

  if (__DEV__) {
    console.log(`rendering NodeTextComponent for ${nodeDef.props.name}`);
  }

  const isNumeric = [NodeDefType.decimal, NodeDefType.integer].includes(
    nodeDef.type
  );

  const toaster = useToast();

  const editable = !NodeDefs.isReadOnly(nodeDef);
  const multiline =
    NodeDefs.getType(nodeDef) === NodeDefType.text &&
    nodeDef.props.textInputType === "multiLine";

  const nodeValueToUiValue = useCallback(
    (value) => (Objects.isEmpty(value) ? "" : String(value)),
    []
  );

  const uiValueToNodeValue = useCallback(
    (uiValue) => {
      if (Objects.isEmpty(uiValue)) return null;
      if (isNumeric) return Number(uiValue);
      return uiValue;
    },
    [isNumeric]
  );

  const { applicable, invalidValue, uiValue, updateNodeValue } =
    useNodeComponentLocalState({
      nodeUuid,
      updateDelay: 500,
      nodeValueToUiValue,
      uiValueToNodeValue,
    });

  const onCopyPress = () => {
    if (SystemUtils.copyValueToClipboard(uiValue)) {
      toaster.show("common:textCopiedToClipboard");
    }
  };

  return (
    <HView style={{ width: "100%" }}>
      <TextInput
        editable={editable}
        error={invalidValue}
        keyboardType={isNumeric ? "numeric" : undefined}
        style={[
          {
            display: "flex",
            flex: 1,
            alignSelf: "stretch",
            ...(applicable ? {} : { backgroundColor: "lightgray" }),
          },
          style,
        ]}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        onChange={updateNodeValue}
        value={uiValue}
      />
      {!editable && (
        <IconButton
          disabled={Objects.isEmpty(uiValue)}
          icon="content-copy"
          onPress={onCopyPress}
        />
      )}
    </HView>
  );
};
