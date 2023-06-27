import { ActivityIndicator } from "react-native-paper";

import { VView } from "./VView";

export const Loader = () => {
  return (
    <VView
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator animating size="large" />
    </VView>
  );
};
