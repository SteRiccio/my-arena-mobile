import * as React from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

export const MessageDialog = (props) => {
  const { content, doneButtonLabel, onDismiss, onDone, title } = props;

  return (
    <Portal>
      <Dialog visible onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDone}>{doneButtonLabel}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

MessageDialog.defaultProps = {
  doneButtonLabel: "Done",
  title: "Info",
};
