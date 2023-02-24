import React from "react";

import { VView } from "../../components";
import { LocalSurveysDropdown } from "./LocalSurveysDropdown";

export const HomeScreen = (props) => {
  const { navigation } = props;

  return (
    <VView>
      <LocalSurveysDropdown navigation={navigation} />
    </VView>
  );
};
