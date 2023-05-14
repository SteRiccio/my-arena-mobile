import React from "react";
import { useNavigation } from "@react-navigation/native";

import { Button, Text, VView } from "components";
import { LocalSurveysDropdown } from "./LocalSurveysDropdown";
import { screenKeys } from "../screenKeys";

export const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <VView>
      <Text variant="displayMedium" textKey="My Arena Mobile" />
      <VView>
        <Text variant="headlineMedium" textKey="Select a survey:" />
        <LocalSurveysDropdown navigation={navigation} />
        <Button
          textKey="Manage surveys"
          onPress={() => navigation.navigate(screenKeys.surveysListLocal)}
        />
      </VView>
    </VView>
  );
};
