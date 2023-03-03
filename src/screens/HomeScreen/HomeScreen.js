import React from "react";

import { HView, Text, VView } from "../../components";
import { LocalSurveysDropdown } from "./LocalSurveysDropdown";

export const HomeScreen = (props) => {
  const { navigation } = props;

  return (
    <VView>
      <Text variant="displayLarge" textKey="My Arena Mobile" />
      <HView>
        <Text textKey="Current survey:" />
        <LocalSurveysDropdown navigation={navigation} />
      </HView>
    </VView>
  );
};
