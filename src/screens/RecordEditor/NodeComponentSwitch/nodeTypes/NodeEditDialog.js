import * as React from "react";
import PropTypes from "prop-types";
import { Modal, Portal } from "react-native-paper";

import { useTranslation } from "localization";

import { Button, VView } from "components";

import { NodeDefFormItem } from "screens/RecordEditor/NodeDefFormItem";

export const NodeEditDialog = (props) => {
  const {
    doneButtonLabel,
    nodeDef,
    onDismiss,
    onDone,
    parentNodeUuid,
  } = props;

  const { t } = useTranslation();

  return (
    <Portal>
      <Modal visible onDismiss={onDismiss}>
        <VView style={{ height: "100%" }}>
          <NodeDefFormItem nodeDef={nodeDef} parentNodeUuid={parentNodeUuid} />
          <Button onPress={onDone ?? onDismiss}>{t(doneButtonLabel)}</Button>
        </VView>
      </Modal>
    </Portal>
  );
};

NodeEditDialog.propTypes = {
  children: PropTypes.node,
  doneButtonLabel: PropTypes.string,
  nodeDef: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onDone: PropTypes.func,
  parentNodeUuid: PropTypes.string,
};

NodeEditDialog.defaultProps = {
  doneButtonLabel: "common:close",
};
