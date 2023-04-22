import React from "react";

import { Text, VView } from "../../components";
import { LocalSurveysDropdown } from "./LocalSurveysDropdown";

export const HomeScreen = (props) => {
  const { navigation } = props;

  return (
    <VView>
      <Text variant="displayLarge" textKey="My Arena Mobile" />
      <VView>
        <Text textKey="Current survey:" />
        <LocalSurveysDropdown navigation={navigation} />
      </VView>
    </VView>
  );
};
