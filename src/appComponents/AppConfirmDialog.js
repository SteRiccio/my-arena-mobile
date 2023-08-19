import React from "react";
import { Dialog, Portal, RadioButton } from "react-native-paper";

import { useConfirmDialog } from "state/confirm/useConfirmDialog";

import { Button, Text, VView } from "components";
import { useTranslation } from "localization";

export const AppConfirmDialog = () => {
  const { t } = useTranslation();

  const {
    isOpen,
    cancel,
    cancelButtonTextKey,
    confirm,
    confirmButtonTextKey,
    messageKey,
    messageParams,
    onSingleChoiceOptionChange,
    selectedSingleChoiceValue,
    singleChoiceOptions,
    titleKey,
  } = useConfirmDialog();

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={cancel}>
        <Dialog.Title>{t(titleKey)}</Dialog.Title>
        <Dialog.Content>
          <Text
            variant="bodyMedium"
            textKey={messageKey}
            textParams={messageParams}
          />
          {singleChoiceOptions?.length > 0 && (
            <RadioButton.Group
              onValueChange={onSingleChoiceOptionChange}
              value={selectedSingleChoiceValue}
            >
              <VView transparent>
                {singleChoiceOptions.map((option) => (
                  <RadioButton.Item
                    key={option.value}
                    label={t(option.label)}
                    value={option.value}
                  />
                ))}
              </VView>
            </RadioButton.Group>
          )}
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
