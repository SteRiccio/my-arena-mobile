import React from "react";
import { Dialog, Portal } from "react-native-paper";

import { useConfirmDialog } from "../state/confirm/useConfirmDialog";

import { Button, Text } from "../components";

export const AppConfirmDialog = () => {
  const {
    isOpen,
    confirm,
    cancel,
    messageKey,
    messageParams,
    cancelButtonTextKey,
    confirmButtonTextKey,
    titleKey,
  } = useConfirmDialog();

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={cancel}>
        <Dialog.Title>{titleKey}</Dialog.Title>
        <Dialog.Content>
          <Text
            variant="bodyMedium"
            textKey={messageKey}
            textParams={messageParams}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="outlined"
            onPress={cancel}
            textKey={cancelButtonTextKey}
          />
          <Button onPress={confirm} textKey={confirmButtonTextKey} />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};