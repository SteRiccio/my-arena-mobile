import { useCallback } from "react";
import PropTypes from "prop-types";

import { NodeDefType, NodeDefs, Objects } from "@openforis/arena-core";

import { SystemUtils } from "utils";
import { HView, IconButton, TextInput } from "components";
import { useToast } from "hooks";
import { useNodeComponentLocalState } from "../../../useNodeComponentLocalState";
import { useStyles } from "./styles";

export const NodeTextComponent = (props) => {
  const { nodeDef, nodeUuid, style, wrapperStyle } = props;

  if (__DEV__) {
    console.log(`rendering NodeTextComponent for ${nodeDef.props.name}`);
  }

  const styles = useStyles({ wrapperStyle });

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

  const onChange = useCallback(
    (value) => updateNodeValue({ value }),
    [updateNodeValue]
  );

  const onCopyPress = () => {
    if (SystemUtils.copyValueToClipboard(uiValue)) {
      toaster("common:textCopiedToClipboard");
    }
  };

  return (
    <HView style={styles.wrapper}>
      <TextInput
        editable={editable}
        error={invalidValue}
        keyboardType={isNumeric ? "numeric" : undefined}
        style={[
          styles.textInput,
          applicable ? {} : styles.notApplicable,
          style,
        ]}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        onChange={onChange}
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

NodeTextComponent.propTypes = {
  nodeDef: PropTypes.object.isRequired,
  nodeUuid: PropTypes.string,
  style: PropTypes.object,
  wrapperStyle: PropTypes.object,
};
