import React from "react";
import { Dialog, Portal, RadioButton, useTheme } from "react-native-paper";
import SwipeButton from "rn-swipe-button";

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
    setSwipeConfirmed,
    singleChoiceOptions,
    swipeConfirmed,
    swipeToConfirm,
    swipeToConfirmTitleKey,
    titleKey,
  } = useConfirmDialog();

  const theme = useTheme();

  console.log("===swipe confirmed", swipeConfirmed);
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
          {swipeToConfirm && (
            <SwipeButton
              disableResetOnTap
              onSwipeSuccess={setSwipeConfirmed}
              railBackgroundColor={theme.colors.tertiaryContainer}
              railStyles={{
                backgroundColor: theme.colors.tertiaryContainer,
                opacity: 0.7,
                borderColor: theme.colors.tertiaryContainer,
              }}
              thumbIconBackgroundColor={theme.colors.primary}
              title={t(swipeToConfirmTitleKey)}
              titleColor={theme.colors.primary}
              titleFontSize={16}
            />
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="outlined"
            onPress={cancel}
            textKey={cancelButtonTextKey}
          />
          <Button
            disabled={swipeToConfirm && !swipeConfirmed}
            onPress={confirm}
            textKey={confirmButtonTextKey}
          />
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
