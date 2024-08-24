import React from "react";
import { Linking } from "react-native";

import { VersionNumberInfoButton } from "appComponents/VersionNumberInfoButton";
import { Button, FormItem, ScrollView, Text, VView } from "components";
import { useTranslation } from "localization";

import styles from "./styles";

const developedBy = "Stefano Ricci";
const supportEmailAddress = process.env.EXPO_PUBLIC_SUPPORT_EMAIL_ADDRESS;

export const AboutScreen = () => {
  const { t } = useTranslation();

  const onSupportPress = () => {
    const openSupportEmailParams = new URLSearchParams({
      subject: t("common:appTitle"),
    }).toString();
    Linking.openURL(`mailto:${supportEmailAddress}?${openSupportEmailParams}`);
  };

  return (
    <ScrollView style={styles.container}>
      <VView style={styles.formWrapper}>
        <FormItem labelKey="about:developedBy">{developedBy}</FormItem>
        <FormItem labelKey="about:support">
          <VView>
            <Text textKey="about:sendSupportEmailIntroduction" />
            <Button onPress={onSupportPress}>{supportEmailAddress}</Button>
          </VView>
        </FormItem>
        <FormItem labelKey="about:version">
          <VersionNumberInfoButton />
        </FormItem>
      </VView>
    </ScrollView>
  );
};
