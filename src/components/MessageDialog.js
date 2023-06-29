import * as React from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";

import { useTranslation } from "localization";

export const MessageDialog = (props) => {
  const { content, contentParams, doneButtonLabel, onDismiss, onDone, title } =
    props;

  const { t } = useTranslation();

  return (
    <Portal>
      <Dialog visible onDismiss={onDismiss}>
        <Dialog.Title>{t(title)}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{t(content, contentParams)}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDone}>{t(doneButtonLabel)}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

MessageDialog.defaultProps = {
  doneButtonLabel: "common:done",
  title: "common:info",
};
